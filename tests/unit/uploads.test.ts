import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { normalizeImage } from "@/server/uploads/store";
import { detectType, sanitizeFileName, UploadRejected, validateUpload } from "@/server/uploads/validate";

const pdf = Buffer.from("%PDF-1.4\n1 0 obj << /Type /Catalog >>\nendobj\n%%EOF");
const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0]);

function rejectCode(fn: () => unknown): string | null {
  try {
    fn();
    return null;
  } catch (e) {
    return e instanceof UploadRejected ? e.code : "other";
  }
}

describe("Dateityp-Erkennung", () => {
  it("erkennt PDF, PNG und JPEG anhand der Signatur", () => {
    expect(detectType(pdf)).toBe("application/pdf");
    expect(detectType(png)).toBe("image/png");
    expect(detectType(jpg)).toBe("image/jpeg");
    expect(detectType(Buffer.from("MZ\x90\x00"))).toBeNull();
    expect(detectType(Buffer.from("<svg></svg>"))).toBeNull();
  });
});

describe("validateUpload", () => {
  it("akzeptiert passende Dateien", () => {
    expect(validateUpload("rechnung.pdf", pdf)).toBe("application/pdf");
    expect(validateUpload("Foto.JPEG", jpg)).toBe("image/jpeg");
  });
  it("lehnt getarnte Dateien ab (Endung passt nicht zum Inhalt)", () => {
    expect(rejectCode(() => validateUpload("rechnung.pdf", png))).toBe("type");
    expect(rejectCode(() => validateUpload("rechnung.exe", pdf))).toBe("type");
    expect(rejectCode(() => validateUpload("rechnung.pdf", Buffer.from("MZ\x90\x00 programm")))).toBe("type");
  });
  it("lehnt leere und zu große Dateien ab", () => {
    expect(rejectCode(() => validateUpload("a.pdf", Buffer.alloc(0)))).toBe("empty");
    expect(rejectCode(() => validateUpload("a.pdf", Buffer.concat([pdf, Buffer.alloc(10 * 1024 * 1024)])))).toBe("too_large");
  });
  it.each(["/JavaScript ", "/JS (", "/Launch <<", "/EmbeddedFile ", "/XFA ["])("lehnt PDFs mit aktivem Inhalt %s ab", (token) => {
    const evil = Buffer.from(`%PDF-1.7\n1 0 obj << ${token} >> endobj`);
    expect(rejectCode(() => validateUpload("a.pdf", evil))).toBe("active_content");
  });
});

describe("sanitizeFileName", () => {
  it("entfernt Pfade und Sonderzeichen", () => {
    expect(sanitizeFileName("../../etc/passwd")).toBe("passwd");
    expect(sanitizeFileName("C:\\Users\\x\\Rechnung März 2026.pdf")).toBe("Rechnung März 2026.pdf");
    expect(sanitizeFileName("<script>.pdf")).toBe("_script_.pdf");
    expect(sanitizeFileName("")).toBe("datei");
  });
});

describe("normalizeImage", () => {
  it("entfernt EXIF-Metadaten durch Neukodierung", async () => {
    const withExif = await sharp({ create: { width: 20, height: 10, channels: 3, background: "#123b91" } })
      .jpeg()
      .withMetadata({ exif: { IFD0: { Artist: "Geheim", ImageDescription: "GPS" } } })
      .toBuffer();
    expect((await sharp(withExif).metadata()).exif).toBeDefined();
    const out = await normalizeImage(withExif, "image/jpeg");
    expect((await sharp(out).metadata()).exif).toBeUndefined();
  });
  it("lehnt beschädigte Bilder ab", async () => {
    await expect(normalizeImage(Buffer.from([0xff, 0xd8, 0xff, 0x00, 0x01]), "image/jpeg")).rejects.toBeInstanceOf(UploadRejected);
  });
});
