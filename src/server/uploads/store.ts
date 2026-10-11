/**
 * Verarbeitung und verschlüsselte Ablage von Rechnungen außerhalb des
 * öffentlichen Verzeichnisses. Es gibt bewusst KEINE Download-Route.
 */
import { createHash, randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { encrypt } from "../crypto";
import type { DetectedType } from "./validate";
import { UploadRejected } from "./validate";

export interface PreparedUpload {
  id: string;
  storedName: string;
  originalName: string;
  mime: DetectedType;
  size: number;
  sha256: string;
  scanStatus: "clean" | "not_scanned" | "error";
  data: Buffer;
}

/** Bilder neu kodieren: entfernt EXIF/GPS-Metadaten und eventuelle Polyglott-Anhänge. */
export async function normalizeImage(buf: Buffer, type: DetectedType): Promise<Buffer> {
  if (type === "application/pdf") return buf;
  try {
    const img = sharp(buf, { limitInputPixels: 60_000_000, failOn: "error" }).rotate();
    return type === "image/png" ? await img.png({ compressionLevel: 9 }).toBuffer() : await img.jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  } catch {
    throw new UploadRejected("corrupt", "Das Bild konnte nicht gelesen werden. Bitte versuchen Sie es mit einer anderen Datei.");
  }
}

export function prepareUpload(originalName: string, data: Buffer, mime: DetectedType, scanStatus: PreparedUpload["scanStatus"]): PreparedUpload {
  const id = randomUUID();
  return {
    id,
    storedName: `${id}.bin`,
    originalName,
    mime,
    size: data.length,
    sha256: createHash("sha256").update(data).digest("hex"),
    scanStatus,
    data,
  };
}

export function leadUploadDir(dataDir: string, leadId: string): string {
  return path.join(dataDir, "uploads", leadId);
}

export async function writeEncryptedUploads(dir: string, uploads: PreparedUpload[], key: Buffer): Promise<void> {
  if (uploads.length === 0) return;
  await mkdir(dir, { recursive: true, mode: 0o700 });
  for (const u of uploads) {
    await writeFile(path.join(dir, u.storedName), encrypt(u.data, key), { mode: 0o600, flag: "wx" });
  }
}

export async function removeUploadDir(dir: string): Promise<void> {
  await rm(dir, { recursive: true, force: true });
}
