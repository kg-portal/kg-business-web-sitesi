/**
 * Annahme von Anfragen: Validierung → Idempotenz → Duplikatprüfung →
 * Upload-Prüfung → verschlüsselte Speicherung (Transaktion).
 * Erfolg wird nur gemeldet, wenn die Daten gespeichert sind.
 */
import { randomUUID } from "node:crypto";
import { CONSENT_TEXT_VERSION, energieCheckSchema, fieldErrors, kontaktSchema, uploadRules } from "@/lib/lead-schema";
import { getConfig } from "../config";
import { deriveKey, encrypt, encryptJson, hmac } from "../crypto";
import { getDb, recordEvent } from "../db";
import { errorCode, log } from "../logger";
import { scanBuffer } from "../uploads/scan";
import { leadUploadDir, normalizeImage, prepareUpload, removeUploadDir, writeEncryptedUploads, type PreparedUpload } from "../uploads/store";
import { sanitizeFileName, UploadRejected, validateUpload } from "../uploads/validate";
import { createReference } from "./reference";
import type { CrmStatus, FormType, LeadPayload, LeadRow } from "./types";

export interface IncomingFile {
  name: string;
  data: Buffer;
}

export type SubmitResult =
  | { kind: "created"; reference: string; duplicate: boolean }
  | { kind: "replay"; reference: string }
  | { kind: "invalid"; errors: Record<string, string> }
  | { kind: "upload_rejected"; message: string; code: UploadRejected["code"] };

function isTestEmail(email: string, domains: string[]): boolean {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return domains.some((d) => domain === d || domain.endsWith(`.${d}`));
}

async function processUploads(files: IncomingFile[]): Promise<PreparedUpload[]> {
  const config = getConfig();
  if (files.length > uploadRules.maxFiles) throw new UploadRejected("too_many", `Bitte laden Sie höchstens ${uploadRules.maxFiles} Dateien hoch.`);
  const prepared: PreparedUpload[] = [];
  for (const f of files) {
    const type = validateUpload(f.name, f.data);
    const normalized = await normalizeImage(f.data, type);
    const scan = await scanBuffer(normalized, {
      host: config.env.CLAMAV_HOST,
      port: config.env.CLAMAV_PORT,
      timeoutMs: config.env.CLAMAV_TIMEOUT_MS,
    });
    if (scan.status === "infected") {
      log.warn("upload.infected", { signature: scan.signature });
      throw new UploadRejected("infected", "Eine Datei wurde aus Sicherheitsgründen abgelehnt.");
    }
    if (scan.status === "error" && config.env.UPLOAD_SCAN_REQUIRED) {
      log.error("upload.scan_error", { reason: scan.reason });
      throw new UploadRejected("scan_unavailable", "Dateien können derzeit nicht geprüft werden. Bitte senden Sie die Anfrage ohne Datei oder versuchen Sie es später erneut.");
    }
    if (scan.status === "not_scanned" && config.env.UPLOAD_SCAN_REQUIRED) {
      throw new UploadRejected("scan_unavailable", "Dateien können derzeit nicht geprüft werden. Bitte senden Sie die Anfrage ohne Datei oder versuchen Sie es später erneut.");
    }
    const scanStatus = scan.status === "clean" ? "clean" : scan.status === "error" ? "error" : "not_scanned";
    prepared.push(prepareUpload(sanitizeFileName(f.name), normalized, type, scanStatus));
  }
  return prepared;
}

export async function submitLead(input: {
  formType: FormType;
  fields: Record<string, unknown>;
  files: IncomingFile[];
  idempotencyKey: string;
}): Promise<SubmitResult> {
  const config = getConfig();
  const db = getDb();

  // 1) Idempotenz: identische Übermittlung (z. B. Doppelklick, Netzwerk-Retry)
  const existing = db.prepare("SELECT reference FROM leads WHERE idempotency_key = ?").get(input.idempotencyKey) as { reference: string } | undefined;
  if (existing) return { kind: "replay", reference: existing.reference };

  // 2) Validierung
  let payload: LeadPayload;
  if (input.formType === "energie-check") {
    const parsed = energieCheckSchema.safeParse(input.fields);
    if (!parsed.success) return { kind: "invalid", errors: fieldErrors(parsed.error) };
    payload = { formType: "energie-check", data: parsed.data };
  } else {
    const parsed = kontaktSchema.safeParse(input.fields);
    if (!parsed.success) return { kind: "invalid", errors: fieldErrors(parsed.error) };
    payload = { formType: "kontakt", data: parsed.data };
  }
  if (input.formType === "kontakt" && input.files.length > 0) {
    return { kind: "upload_rejected", code: "too_many", message: "Im Kontaktformular sind keine Dateien vorgesehen." };
  }

  // 3) Uploads prüfen und vorbereiten (vor dem Speichern)
  let uploads: PreparedUpload[] = [];
  try {
    uploads = await processUploads(input.files);
  } catch (err) {
    if (err instanceof UploadRejected) return { kind: "upload_rejected", code: err.code, message: err.message };
    throw err;
  }

  // 4) Duplikat-Fingerprint (gleiche E-Mail + Energieart + PLZ innerhalb des Zeitfensters)
  const d = payload.data;
  const energy = payload.formType === "energie-check" ? payload.data.energie : null;
  const plz = payload.formType === "energie-check" ? payload.data.plz : "";
  const fingerprint = hmac(deriveKey(config.appSecret, "lead-fingerprint"), `${input.formType}|${d.email}|${energy ?? ""}|${plz}`);
  const since = new Date(Date.now() - config.env.DUPLICATE_WINDOW_HOURS * 3600_000).toISOString();
  const dup = db
    .prepare("SELECT reference FROM leads WHERE fingerprint = ? AND created_at >= ? ORDER BY created_at ASC LIMIT 1")
    .get(fingerprint, since) as { reference: string } | undefined;

  const isTest = isTestEmail(d.email, config.testEmailDomains);
  const crmStatus: CrmStatus = isTest ? "skipped_test" : dup ? "skipped_duplicate" : config.crmMode === "disabled" ? "skipped_disabled" : "pending";

  const id = randomUUID();
  const now = new Date();
  const createdAt = now.toISOString();
  let reference = createReference(now);
  const uploadDir = leadUploadDir(config.dataDir, id);

  // 5) Dateien verschlüsselt ablegen, dann Datensatz in einer Transaktion speichern
  await writeEncryptedUploads(uploadDir, uploads, config.encryptionKey);
  try {
    const insert = db.transaction(() => {
      for (let attempt = 0; attempt < 5; attempt++) {
        const taken = db.prepare("SELECT 1 FROM leads WHERE reference = ?").get(reference);
        if (!taken) break;
        reference = createReference(now);
      }
      const marketingEmail = payload.formType === "energie-check" ? payload.data.werbungEmail : false;
      const marketingPhone = payload.formType === "energie-check" ? payload.data.werbungTelefon : false;
      db.prepare(
        `INSERT INTO leads (id, reference, idempotency_key, created_at, form_type, customer_type, energy, fingerprint, duplicate_of,
           payload_enc, consent_text_version, consent_privacy_at, consent_marketing_email, consent_marketing_phone, is_test,
           upload_count, crm_status, crm_next_attempt_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        id,
        reference,
        input.idempotencyKey,
        createdAt,
        input.formType,
        payload.data.kundentyp ?? null,
        energy,
        fingerprint,
        dup?.reference ?? null,
        encryptJson(payload, config.encryptionKey),
        CONSENT_TEXT_VERSION,
        createdAt,
        marketingEmail ? 1 : 0,
        marketingPhone ? 1 : 0,
        isTest ? 1 : 0,
        uploads.length,
        crmStatus,
        crmStatus === "pending" ? createdAt : null,
      );
      const insUpload = db.prepare(
        "INSERT INTO uploads (id, lead_id, stored_name, original_name_enc, mime, size, sha256, scan_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      );
      for (const u of uploads) {
        insUpload.run(u.id, id, u.storedName, encrypt(Buffer.from(u.originalName, "utf8"), config.encryptionKey), u.mime, u.size, u.sha256, u.scanStatus, createdAt);
      }
      recordEvent(db, id, "lead.created", `${input.formType};crm=${crmStatus};uploads=${uploads.length}${dup ? ";duplicate" : ""}${isTest ? ";test" : ""}`);
    });
    insert();
  } catch (err) {
    await removeUploadDir(uploadDir);
    // Gleichzeitige Übermittlung mit demselben Idempotenz-Schlüssel
    const again = db.prepare("SELECT reference FROM leads WHERE idempotency_key = ?").get(input.idempotencyKey) as { reference: string } | undefined;
    if (again) return { kind: "replay", reference: again.reference };
    log.error("lead.store_failed", { code: errorCode(err) });
    throw err;
  }

  log.info("lead.created", { reference, formType: input.formType, crm: crmStatus, uploads: uploads.length, duplicate: Boolean(dup), test: isTest });
  return { kind: "created", reference, duplicate: Boolean(dup) };
}

export function getLeadByReference(reference: string): LeadRow | undefined {
  return getDb().prepare("SELECT * FROM leads WHERE reference = ?").get(reference) as LeadRow | undefined;
}
