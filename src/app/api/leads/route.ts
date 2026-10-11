/**
 * Annahme von Energie-Check- und Kontaktanfragen (multipart/form-data).
 * Sicherheitsprüfungen: Origin, eigener Header, Größe, Rate-Limit,
 * Honeypot, signiertes Formular-Token (Mindest-Ausfüllzeit), Idempotenz.
 */
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { uploadRules } from "@/lib/lead-schema";
import { ConfigError, getConfig } from "@/server/config";
import { afterLeadCreated } from "@/server/jobs";
import { submitLead, type IncomingFile } from "@/server/leads/service";
import { errorCode, log } from "@/server/logger";
import { verifyFormToken } from "@/server/security/form-token";
import { getLimiters } from "@/server/security/limits";
import { checkOrigin, clientIdentity } from "@/server/security/request";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = uploadRules.maxFiles * uploadRules.maxBytes + 1024 * 1024;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const META_FIELDS = new Set(["formToken", "idempotencyKey", "formType", "website", "files"]);

function json(status: number, body: Record<string, unknown>, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

const GENERIC_REJECT = "Ihre Anfrage konnte nicht verarbeitet werden. Bitte laden Sie die Seite neu und versuchen Sie es erneut.";

export async function POST(request: Request) {
  let config;
  try {
    config = getConfig();
  } catch (err) {
    if (err instanceof ConfigError) {
      log.error("api.config_error", { code: "ConfigError" });
      return json(503, { error: "unavailable", message: "Der Dienst ist vorübergehend nicht verfügbar. Bitte rufen Sie uns an." });
    }
    throw err;
  }

  if (!checkOrigin(request.headers, config.allowedOrigins, config.allowLocalhostOrigins)) {
    log.warn("api.origin_rejected");
    return json(403, { error: "origin", message: GENERIC_REJECT });
  }
  if (request.headers.get("x-kg-form") !== "1") return json(400, { error: "bad_request", message: GENERIC_REJECT });
  if (!(request.headers.get("content-type") ?? "").startsWith("multipart/form-data")) {
    return json(415, { error: "unsupported_media_type", message: GENERIC_REJECT });
  }
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_BODY_BYTES) {
    return json(413, { error: "too_large", message: "Die Dateien sind zu groß. Insgesamt sind höchstens 3 Dateien mit je 10 MB möglich." });
  }

  const limiters = getLimiters();
  const { key, identified } = clientIdentity(request.headers, config.env.TRUST_PROXY, config.appSecret);
  const attemptLimiter = identified ? limiters.attempts : limiters.sharedAttempts;
  const createdLimiter = identified ? limiters.created : limiters.sharedCreated;
  const attempt = attemptLimiter.hit(key);
  const created = createdLimiter.check(key);
  if (!attempt.allowed || !created.allowed) {
    const retry = Math.max(attempt.retryAfterSeconds, created.retryAfterSeconds);
    log.warn("api.rate_limited");
    return json(
      429,
      { error: "rate_limited", message: "Sie haben in kurzer Zeit mehrere Anfragen gesendet. Bitte versuchen Sie es später erneut oder rufen Sie uns an." },
      { "Retry-After": String(retry) },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { error: "bad_request", message: GENERIC_REJECT });
  }

  // Honeypot: für Menschen unsichtbares Feld
  if (String(form.get("website") ?? "").trim() !== "") {
    log.warn("api.spam_honeypot");
    return json(400, { error: "rejected", message: GENERIC_REJECT });
  }

  const token = verifyFormToken(String(form.get("formToken") ?? ""), config.appSecret, {
    minAgeMs: config.env.FORM_MIN_FILL_SECONDS * 1000,
    maxAgeMs: config.env.FORM_TOKEN_MAX_AGE_HOURS * 3600_000,
  });
  if (!token.ok) {
    log.warn("api.token_rejected", { reason: token.reason });
    if (token.reason === "expired") return json(400, { error: "token_expired", message: "Die Sitzung ist abgelaufen. Bitte senden Sie die Anfrage erneut." });
    return json(400, { error: token.reason === "too_fast" ? "too_fast" : "token_invalid", message: GENERIC_REJECT });
  }

  const idempotencyKey = String(form.get("idempotencyKey") ?? "");
  if (!UUID_RE.test(idempotencyKey)) return json(400, { error: "bad_request", message: GENERIC_REJECT });
  const formType = String(form.get("formType") ?? "");
  if (formType !== "energie-check" && formType !== "kontakt") return json(400, { error: "bad_request", message: GENERIC_REJECT });

  const fields: Record<string, unknown> = {};
  const files: IncomingFile[] = [];
  for (const [name, value] of form.entries()) {
    if (name === "files" && typeof value !== "string") {
      if (value.size === 0) continue;
      if (files.length >= uploadRules.maxFiles) return json(422, { error: "upload", message: `Bitte laden Sie höchstens ${uploadRules.maxFiles} Dateien hoch.` });
      if (value.size > uploadRules.maxBytes) return json(422, { error: "upload", message: "Eine Datei ist größer als 10 MB." });
      files.push({ name: value.name, data: Buffer.from(await value.arrayBuffer()) });
      continue;
    }
    if (META_FIELDS.has(name) || typeof value !== "string") continue;
    fields[name] = value.slice(0, 4000);
  }

  try {
    const result = await submitLead({ formType, fields, files, idempotencyKey });
    switch (result.kind) {
      case "created":
        createdLimiter.hit(key);
        afterLeadCreated(result.reference);
        return json(201, { ok: true, reference: result.reference });
      case "replay":
        return json(200, { ok: true, reference: result.reference, replay: true });
      case "invalid":
        return json(422, { error: "validation", message: "Bitte prüfen Sie die markierten Angaben.", fields: result.errors });
      case "upload_rejected":
        return json(422, { error: "upload", code: result.code, message: result.message });
    }
  } catch (err) {
    const errorId = randomUUID().slice(0, 8);
    log.error("api.lead_failed", { errorId, code: errorCode(err) });
    return json(500, {
      error: "server",
      errorId,
      message: "Ihre Anfrage konnte leider nicht gespeichert werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.",
    });
  }
}
