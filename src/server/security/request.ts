import { deriveKey, hmac } from "../crypto";

const LOCALHOST = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

/** Prüft Origin (bzw. Referer) gegen die erlaubten Ursprünge. */
export function checkOrigin(headers: Headers, allowed: string[], allowLocalhost = false): boolean {
  const ok = (o: string) => allowed.includes(o) || (allowLocalhost && LOCALHOST.test(o));
  const origin = headers.get("origin");
  if (origin) return ok(origin);
  const referer = headers.get("referer");
  if (!referer) return false;
  try {
    return ok(new URL(referer).origin);
  } catch {
    return false;
  }
}

/**
 * Client-IP nur aus Proxy-Headern, wenn TRUST_PROXY gesetzt ist (Betrieb hinter
 * Caddy/Nginx). Ohne vertrauenswürdigen Proxy: gemeinsamer Bucket.
 */
export function clientKey(headers: Headers, trustProxy: boolean, secret: Buffer, now = new Date()): string {
  return clientIdentity(headers, trustProxy, secret, now).key;
}

/** Wie clientKey, zusätzlich mit Angabe, ob eine echte Client-IP ermittelt wurde. */
export function clientIdentity(headers: Headers, trustProxy: boolean, secret: Buffer, now = new Date()): { key: string; identified: boolean } {
  let ip = "unknown";
  if (trustProxy) {
    const xff = headers.get("x-forwarded-for");
    ip = (xff?.split(",")[0] ?? headers.get("x-real-ip") ?? "unknown").trim() || "unknown";
  }
  // Tägliches Salz → Hash nicht über Tage hinweg verknüpfbar
  const day = now.toISOString().slice(0, 10);
  return { key: hmac(deriveKey(secret, `ip:${day}`), ip), identified: ip !== "unknown" };
}
