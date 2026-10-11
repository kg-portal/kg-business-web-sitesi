/**
 * Signiertes Formular-Token: schützt gegen Cross-Site-Requests (zusätzlich
 * zur Origin-Prüfung) und erzwingt eine Mindest-Ausfüllzeit gegen Bots.
 * Format: base64url(JSON{iat,n}).hmac
 */
import { randomBytes, timingSafeEqual } from "node:crypto";
import { deriveKey, hmac } from "../crypto";

export type TokenCheck = { ok: true; ageMs: number } | { ok: false; reason: "malformed" | "signature" | "too_fast" | "expired" };

export function issueFormToken(secret: Buffer, now = Date.now()): string {
  const body = Buffer.from(JSON.stringify({ iat: now, n: randomBytes(9).toString("base64url") })).toString("base64url");
  return `${body}.${hmac(deriveKey(secret, "form-token"), body)}`;
}

export function verifyFormToken(
  token: string | null | undefined,
  secret: Buffer,
  opts: { minAgeMs: number; maxAgeMs: number },
  now = Date.now(),
): TokenCheck {
  if (!token || typeof token !== "string" || token.length > 300) return { ok: false, reason: "malformed" };
  const [body, sig] = token.split(".");
  if (!body || !sig) return { ok: false, reason: "malformed" };
  const expected = hmac(deriveKey(secret, "form-token"), body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, reason: "signature" };
  let iat: unknown;
  try {
    iat = (JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as { iat?: unknown }).iat;
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (typeof iat !== "number") return { ok: false, reason: "malformed" };
  const age = now - iat;
  if (age < opts.minAgeMs) return { ok: false, reason: "too_fast" };
  if (age > opts.maxAgeMs) return { ok: false, reason: "expired" };
  return { ok: true, ageMs: age };
}
