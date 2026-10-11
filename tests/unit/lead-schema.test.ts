import { describe, expect, it } from "vitest";
import { energieCheckSchema, fieldErrors, kontaktSchema } from "@/lib/lead-schema";
import { validEnergieCheck } from "./helpers";

describe("energieCheckSchema", () => {
  it("akzeptiert eine vollständige Gewerbeanfrage und normalisiert Werte", () => {
    const r = energieCheckSchema.parse(validEnergieCheck);
    expect(r.telefon).toBe("+492031234567");
    expect(r.verbrauchStrom).toBe(25000);
    expect(r.email).toBe("max@muster-gmbh.de");
    expect(r.zaehlerart).toBe("unbekannt");
    expect(r.werbungEmail).toBe(false);
  });

  it("verlangt bei Gewerbekunden den Firmennamen", () => {
    const r = energieCheckSchema.safeParse({ ...validEnergieCheck, firma: "" });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrors(r.error).firma).toMatch(/Firmennamen/);
  });

  it("verwirft bei Privatkunden gewerbliche Felder (Datensparsamkeit)", () => {
    const r = energieCheckSchema.parse({ ...validEnergieCheck, kundentyp: "privat", zaehlerart: "rlm", lieferstellen: "3" });
    expect(r.firma).toBeUndefined();
    expect(r.zaehlerart).toBeUndefined();
    expect(r.lieferstellen).toBeUndefined();
  });

  it("verwirft Gasverbrauch bei reiner Stromanfrage", () => {
    const r = energieCheckSchema.parse({ ...validEnergieCheck, verbrauchGas: "9000" });
    expect(r.verbrauchGas).toBeUndefined();
  });

  it("liefert deutsche Meldungen für fehlende Pflichtfelder", () => {
    const r = energieCheckSchema.safeParse({ kundentyp: "gewerbe", energie: "strom" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const e = fieldErrors(r.error);
      expect(e.plz).toMatch(/Postleitzahl/);
      expect(e.ort).toMatch(/Ort/);
      expect(e.email).toMatch(/E-Mail/);
      expect(e.telefon).toMatch(/Telefonnummer/);
      expect(e.datenschutz).toMatch(/Datenschutzhinweise/);
    }
  });

  it.each([
    ["plz", "4705"],
    ["email", "kein-at.de"],
    ["telefon", "123"],
    ["verbrauchStrom", "viel"],
    ["arbeitspreis", "999"],
    ["vertragsende", "31.12.2027"],
  ])("lehnt ungültiges Feld %s ab", (field, value) => {
    const r = energieCheckSchema.safeParse({ ...validEnergieCheck, [field]: value });
    expect(r.success).toBe(false);
    if (!r.success) expect(Object.keys(fieldErrors(r.error))).toContain(field);
  });

  it("Werbeeinwilligungen sind optional und unabhängig voneinander", () => {
    const r = energieCheckSchema.parse({ ...validEnergieCheck, werbungTelefon: "true" });
    expect(r.werbungTelefon).toBe(true);
    expect(r.werbungEmail).toBe(false);
  });
});

describe("kontaktSchema", () => {
  it("akzeptiert eine Nachricht ohne Telefonnummer", () => {
    const r = kontaktSchema.parse({ ansprechpartner: "Erika", email: "erika@test.de", nachricht: "Bitte um Rückruf zum Gasvertrag.", datenschutz: "true" });
    expect(r.telefon).toBeUndefined();
  });
  it("verlangt eine ausreichend lange Nachricht", () => {
    expect(kontaktSchema.safeParse({ ansprechpartner: "Erika", email: "erika@test.de", nachricht: "Hallo", datenschutz: "true" }).success).toBe(false);
  });
});
