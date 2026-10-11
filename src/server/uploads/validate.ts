/**
 * Prüfung hochgeladener Rechnungen: Größe, Dateisignatur (Magic Bytes),
 * passende Endung und eine Heuristik gegen aktive PDF-Inhalte.
 * Die Heuristik ersetzt keinen Virenscan (siehe scan.ts).
 */
import { uploadRules } from "@/lib/lead-schema";

export type DetectedType = "application/pdf" | "image/jpeg" | "image/png";

export class UploadRejected extends Error {
  constructor(
    public readonly code: "too_many" | "too_large" | "empty" | "type" | "active_content" | "infected" | "scan_unavailable" | "corrupt",
    message: string,
  ) {
    super(message);
    this.name = "UploadRejected";
  }
}

export function detectType(buf: Buffer): DetectedType | null {
  if (buf.length >= 5 && buf.subarray(0, 5).toString("latin1") === "%PDF-") return "application/pdf";
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  return null;
}

const EXT_FOR: Record<DetectedType, string[]> = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

/** Aktive PDF-Inhalte, die in einer Energierechnung nichts zu suchen haben. */
const PDF_ACTIVE = /\/(JavaScript|JS|Launch|EmbeddedFile|RichMedia|XFA|SubmitForm|ImportData)[\s/<(\[]/;

export function sanitizeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "datei";
  const cleaned = base
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}._ -]/gu, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return cleaned || "datei";
}

export function validateUpload(name: string, buf: Buffer): DetectedType {
  if (buf.length === 0) throw new UploadRejected("empty", "Die Datei ist leer.");
  if (buf.length > uploadRules.maxBytes) throw new UploadRejected("too_large", "Die Datei ist größer als 10 MB.");
  const type = detectType(buf);
  if (!type) throw new UploadRejected("type", "Bitte laden Sie nur PDF-, JPG- oder PNG-Dateien hoch.");
  const ext = (name.match(/\.[a-z0-9]+$/i)?.[0] ?? "").toLowerCase();
  if (!EXT_FOR[type].includes(ext)) throw new UploadRejected("type", "Dateiendung und Dateiinhalt passen nicht zusammen.");
  if (type === "application/pdf" && PDF_ACTIVE.test(buf.toString("latin1"))) {
    throw new UploadRejected("active_content", "Die PDF-Datei enthält aktive Inhalte und wurde aus Sicherheitsgründen abgelehnt.");
  }
  return type;
}
