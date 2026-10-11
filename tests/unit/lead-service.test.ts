import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getDb } from "@/server/db";
import { getLeadByReference, submitLead } from "@/server/leads/service";
import { purgeExpiredData } from "@/server/maintenance/purge";
import { useTempDataDir, validEnergieCheck } from "./helpers";

let env: ReturnType<typeof useTempDataDir>;
const uuid = () => crypto.randomUUID();
const pdf = Buffer.from("%PDF-1.4\n1 0 obj << /Type /Catalog >>\nendobj\n%%EOF");

beforeEach(() => {
  env = useTempDataDir();
});
afterEach(() => env.cleanup());

describe("submitLead", () => {
  it("speichert eine gültige Anfrage verschlüsselt und vergibt eine Referenz", async () => {
    const r = await submitLead({ formType: "energie-check", fields: validEnergieCheck, files: [], idempotencyKey: uuid() });
    expect(r.kind).toBe("created");
    if (r.kind !== "created") return;
    expect(r.reference).toMatch(/^KGB-\d{6}-[2-9A-Z]{6}$/);
    const row = getLeadByReference(r.reference)!;
    expect(row.customer_type).toBe("gewerbe");
    expect(row.crm_status).toBe("skipped_disabled");
    expect(row.payload_enc.toString("utf8")).not.toContain("Mustermann");
    const raw = readFileSync(path.join(env.dir, "leads.sqlite-wal")).toString("latin1");
    expect(raw).not.toContain("max@muster-gmbh.de");
  });

  it("ist idempotent: gleiche Übermittlung erzeugt keinen zweiten Datensatz", async () => {
    const key = uuid();
    const a = await submitLead({ formType: "energie-check", fields: validEnergieCheck, files: [], idempotencyKey: key });
    const b = await submitLead({ formType: "energie-check", fields: validEnergieCheck, files: [], idempotencyKey: key });
    expect(a.kind).toBe("created");
    expect(b).toEqual({ kind: "replay", reference: a.kind === "created" ? a.reference : "" });
    expect((getDb().prepare("SELECT COUNT(*) n FROM leads").get() as { n: number }).n).toBe(1);
  });

  it("markiert Duplikate innerhalb des Zeitfensters und überträgt sie nicht erneut", async () => {
    process.env.CRM_MODE = "mock";
    env.cleanup();
    env = useTempDataDir({ CRM_MODE: "mock" });
    const a = await submitLead({ formType: "energie-check", fields: validEnergieCheck, files: [], idempotencyKey: uuid() });
    const b = await submitLead({ formType: "energie-check", fields: validEnergieCheck, files: [], idempotencyKey: uuid() });
    if (a.kind !== "created" || b.kind !== "created") throw new Error("erwartet created");
    expect(b.duplicate).toBe(true);
    const row = getLeadByReference(b.reference)!;
    expect(row.duplicate_of).toBe(a.reference);
    expect(row.crm_status).toBe("skipped_duplicate");
    expect(getLeadByReference(a.reference)!.crm_status).toBe("pending");
  });

  it("kennzeichnet Testanfragen (Test-Domains) und sperrt sie für das CRM", async () => {
    env.cleanup();
    env = useTempDataDir({ CRM_MODE: "mock" });
    const r = await submitLead({ formType: "energie-check", fields: { ...validEnergieCheck, email: "lead@example.com" }, files: [], idempotencyKey: uuid() });
    if (r.kind !== "created") throw new Error("erwartet created");
    const row = getLeadByReference(r.reference)!;
    expect(row.is_test).toBe(1);
    expect(row.crm_status).toBe("skipped_test");
  });

  it("gibt Feldfehler zurück und speichert nichts", async () => {
    const r = await submitLead({ formType: "energie-check", fields: { ...validEnergieCheck, plz: "1" }, files: [], idempotencyKey: uuid() });
    expect(r.kind).toBe("invalid");
    if (r.kind === "invalid") expect(r.errors.plz).toBeDefined();
    expect((getDb().prepare("SELECT COUNT(*) n FROM leads").get() as { n: number }).n).toBe(0);
  });

  it("speichert Uploads verschlüsselt außerhalb des öffentlichen Verzeichnisses", async () => {
    const r = await submitLead({ formType: "energie-check", fields: validEnergieCheck, files: [{ name: "Rechnung.pdf", data: pdf }], idempotencyKey: uuid() });
    if (r.kind !== "created") throw new Error("erwartet created");
    const row = getLeadByReference(r.reference)!;
    expect(row.upload_count).toBe(1);
    const dir = path.join(env.dir, "uploads", row.id);
    const files = readdirSync(dir);
    expect(files).toHaveLength(1);
    expect(readFileSync(path.join(dir, files[0]!)).subarray(0, 5).toString()).not.toBe("%PDF-");
  });

  it("lehnt unzulässige Uploads ab, ohne die Anfrage zu speichern", async () => {
    const r = await submitLead({ formType: "energie-check", fields: validEnergieCheck, files: [{ name: "virus.pdf", data: Buffer.from("MZ...") }], idempotencyKey: uuid() });
    expect(r).toMatchObject({ kind: "upload_rejected", code: "type" });
    const tooMany = Array.from({ length: 4 }, (_, i) => ({ name: `r${i}.pdf`, data: pdf }));
    expect(await submitLead({ formType: "energie-check", fields: validEnergieCheck, files: tooMany, idempotencyKey: uuid() })).toMatchObject({ kind: "upload_rejected", code: "too_many" });
    expect((getDb().prepare("SELECT COUNT(*) n FROM leads").get() as { n: number }).n).toBe(0);
  });

  it("nimmt Kontaktanfragen an, aber keine Dateien darin", async () => {
    const fields = { ansprechpartner: "Erika", email: "erika@kunde.de", nachricht: "Bitte rufen Sie mich zurück.", datenschutz: "true" };
    expect((await submitLead({ formType: "kontakt", fields, files: [], idempotencyKey: uuid() })).kind).toBe("created");
    expect((await submitLead({ formType: "kontakt", fields, files: [{ name: "a.pdf", data: pdf }], idempotencyKey: uuid() })).kind).toBe("upload_rejected");
  });
});

describe("purgeExpiredData", () => {
  it("löscht Anfragen und Uploads nach Ablauf der Fristen", async () => {
    const r = await submitLead({ formType: "energie-check", fields: validEnergieCheck, files: [{ name: "Rechnung.pdf", data: pdf }], idempotencyKey: uuid() });
    if (r.kind !== "created") throw new Error("erwartet created");
    const row = getLeadByReference(r.reference)!;
    // Kurz danach: nichts löschen
    expect(await purgeExpiredData(new Date())).toEqual({ uploadsDeleted: 0, leadsDeleted: 0 });
    // Nach 100 Tagen: Upload weg, Anfrage noch da
    const res100 = await purgeExpiredData(new Date(Date.now() + 100 * 86_400_000));
    expect(res100.uploadsDeleted).toBe(1);
    expect(getLeadByReference(r.reference)).toBeDefined();
    expect(() => readdirSync(path.join(env.dir, "uploads", row.id))).toThrow();
    // Nach 200 Tagen: Anfrage gelöscht
    const res200 = await purgeExpiredData(new Date(Date.now() + 200 * 86_400_000));
    expect(res200.leadsDeleted).toBe(1);
    expect(getLeadByReference(r.reference)).toBeUndefined();
  });
});
