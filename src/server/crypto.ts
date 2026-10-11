import { createCipheriv, createDecipheriv, createHmac, hkdfSync, randomBytes } from "node:crypto";

const VERSION = 1;

/** AES-256-GCM: [version(1) | iv(12) | tag(16) | ciphertext] */
export function encrypt(plain: Buffer, key: Buffer): Buffer {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(plain), cipher.final()]);
  return Buffer.concat([Buffer.from([VERSION]), iv, cipher.getAuthTag(), ct]);
}

export function decrypt(blob: Buffer, key: Buffer): Buffer {
  if (blob.length < 29 || blob[0] !== VERSION) throw new Error("Unbekanntes Verschlüsselungsformat");
  const iv = blob.subarray(1, 13);
  const tag = blob.subarray(13, 29);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(blob.subarray(29)), decipher.final()]);
}

export function encryptJson(value: unknown, key: Buffer): Buffer {
  return encrypt(Buffer.from(JSON.stringify(value), "utf8"), key);
}

export function decryptJson<T>(blob: Buffer, key: Buffer): T {
  return JSON.parse(decrypt(blob, key).toString("utf8")) as T;
}

/** Zweckgebundener Unterschlüssel aus dem App-Secret (HKDF-SHA256). */
export function deriveKey(secret: Buffer, label: string): Buffer {
  return Buffer.from(hkdfSync("sha256", secret, Buffer.alloc(0), `kg-business:${label}`, 32));
}

export function hmac(key: Buffer, value: string): string {
  return createHmac("sha256", key).update(value).digest("base64url");
}
