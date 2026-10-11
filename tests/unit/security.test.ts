import { describe, expect, it } from "vitest";
import { decrypt, decryptJson, encrypt, encryptJson } from "@/server/crypto";
import { issueFormToken, verifyFormToken } from "@/server/security/form-token";
import { RateLimiter } from "@/server/security/rate-limit";
import { checkOrigin, clientKey } from "@/server/security/request";

const secret = Buffer.from("x".repeat(40));
const key = Buffer.alloc(32, 7);

describe("Formular-Token", () => {
  const opts = { minAgeMs: 4000, maxAgeMs: 6 * 3600_000 };
  it("akzeptiert ein gültiges Token nach der Mindest-Ausfüllzeit", () => {
    const t = issueFormToken(secret, 1_000_000);
    expect(verifyFormToken(t, secret, opts, 1_005_000)).toEqual({ ok: true, ageMs: 5000 });
  });
  it("erkennt zu schnelles Absenden (Bot)", () => {
    const t = issueFormToken(secret, 1_000_000);
    expect(verifyFormToken(t, secret, opts, 1_001_000)).toMatchObject({ ok: false, reason: "too_fast" });
  });
  it("erkennt abgelaufene Tokens", () => {
    const t = issueFormToken(secret, 0);
    expect(verifyFormToken(t, secret, opts, 7 * 3600_000)).toMatchObject({ ok: false, reason: "expired" });
  });
  it("erkennt manipulierte oder fremd signierte Tokens", () => {
    const t = issueFormToken(secret, 0);
    const [body] = t.split(".");
    expect(verifyFormToken(`${body}.AAAA`, secret, opts, 10_000)).toMatchObject({ ok: false, reason: "signature" });
    expect(verifyFormToken(t, Buffer.from("y".repeat(40)), opts, 10_000)).toMatchObject({ ok: false, reason: "signature" });
    expect(verifyFormToken("", secret, opts)).toMatchObject({ ok: false, reason: "malformed" });
    expect(verifyFormToken("x".repeat(400), secret, opts)).toMatchObject({ ok: false, reason: "malformed" });
  });
});

describe("RateLimiter", () => {
  it("begrenzt Zugriffe im Zeitfenster und gibt danach wieder frei", () => {
    const rl = new RateLimiter(2, 60_000);
    expect(rl.hit("a", 0).allowed).toBe(true);
    expect(rl.hit("a", 1000).allowed).toBe(true);
    const blocked = rl.hit("a", 2000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(58);
    expect(rl.hit("b", 2000).allowed).toBe(true);
    expect(rl.hit("a", 61_000).allowed).toBe(true);
  });
  it("check() zählt nicht mit", () => {
    const rl = new RateLimiter(1, 60_000);
    expect(rl.check("a", 0).allowed).toBe(true);
    expect(rl.check("a", 0).allowed).toBe(true);
    rl.hit("a", 0);
    expect(rl.check("a", 1).allowed).toBe(false);
  });
  it("räumt abgelaufene Schlüssel auf", () => {
    const rl = new RateLimiter(5, 1000);
    rl.hit("a", 0);
    rl.prune(5000);
    expect(rl.size()).toBe(0);
  });
});

describe("Origin-Prüfung", () => {
  const allowed = ["https://www.kg-business.de"];
  it("akzeptiert erlaubte Origins und Referer", () => {
    expect(checkOrigin(new Headers({ origin: "https://www.kg-business.de" }), allowed)).toBe(true);
    expect(checkOrigin(new Headers({ referer: "https://www.kg-business.de/energie-check" }), allowed)).toBe(true);
  });
  it("lehnt fremde oder fehlende Origins ab", () => {
    expect(checkOrigin(new Headers({ origin: "https://evil.example" }), allowed)).toBe(false);
    expect(checkOrigin(new Headers({ origin: "https://www.kg-business.de.evil.example" }), allowed)).toBe(false);
    expect(checkOrigin(new Headers(), allowed)).toBe(false);
    expect(checkOrigin(new Headers({ origin: "http://localhost:3000" }), allowed)).toBe(false);
  });
  it("erlaubt localhost nur, wenn ausdrücklich aktiviert (Entwicklung)", () => {
    expect(checkOrigin(new Headers({ origin: "http://localhost:3000" }), allowed, true)).toBe(true);
    expect(checkOrigin(new Headers({ origin: "http://localhost.evil.example" }), allowed, true)).toBe(false);
  });
});

describe("Client-Schlüssel", () => {
  it("hasht die IP und wechselt das Salz täglich", () => {
    const h = new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" });
    const day1 = clientKey(h, true, secret, new Date("2026-10-11T10:00:00Z"));
    const day1b = clientKey(h, true, secret, new Date("2026-10-11T20:00:00Z"));
    const day2 = clientKey(h, true, secret, new Date("2026-10-12T10:00:00Z"));
    expect(day1).toBe(day1b);
    expect(day1).not.toBe(day2);
    expect(day1).not.toContain("203.0.113.7");
  });
  it("ignoriert Proxy-Header ohne TRUST_PROXY (Header sind sonst fälschbar)", () => {
    const a = clientKey(new Headers({ "x-forwarded-for": "1.1.1.1" }), false, secret);
    const b = clientKey(new Headers({ "x-forwarded-for": "2.2.2.2" }), false, secret);
    expect(a).toBe(b);
  });
});

describe("Verschlüsselung (AES-256-GCM)", () => {
  it("verschlüsselt und entschlüsselt verlustfrei", () => {
    const data = { name: "Erika Mustermann", email: "erika@test.de" };
    const blob = encryptJson(data, key);
    expect(blob.toString("utf8")).not.toContain("Erika");
    expect(decryptJson(blob, key)).toEqual(data);
  });
  it("erkennt Manipulation und falsche Schlüssel", () => {
    const blob = encrypt(Buffer.from("geheim"), key);
    const tampered = Buffer.from(blob);
    tampered[tampered.length - 1]! ^= 1;
    expect(() => decrypt(tampered, key)).toThrow();
    expect(() => decrypt(blob, Buffer.alloc(32, 8))).toThrow();
  });
  it("erzeugt bei gleichem Klartext unterschiedliche Chiffrate", () => {
    expect(encrypt(Buffer.from("a"), key).equals(encrypt(Buffer.from("a"), key))).toBe(false);
  });
});
