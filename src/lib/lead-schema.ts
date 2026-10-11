/**
 * Gemeinsame Validierung für Energie-Check und Kontaktformular
 * (Client und Server). Eingaben kommen als Strings (FormData) oder
 * Formularzustand und werden hier normalisiert.
 */
import { z } from "zod";
import { parseGermanNumber } from "./format";
import { normalizePhone } from "./phone";

// Deutsche Standardmeldungen als Rückfallebene; jitless: kein eval/new Function
// (verträgt sich mit der strengen Content-Security-Policy ohne 'unsafe-eval')
z.config({ ...z.locales.de(), jitless: true });

export const CONSENT_TEXT_VERSION = "2026-10-v1";

export const consentTexts = {
  privacy: "Ich habe die Datenschutzhinweise zur Kenntnis genommen. Meine Angaben werden zur Bearbeitung meiner Anfrage verwendet.",
  marketingEmail: "Ich möchte per E-Mail über passende Strom- und Gasangebote von KG Business informiert werden (optional, jederzeit widerrufbar).",
  marketingPhone: "Ich bin einverstanden, dass KG Business mich telefonisch zu passenden Strom- und Gasangeboten kontaktiert (optional, jederzeit widerrufbar).",
} as const;

/** Fehlende Werte wie leere Eingaben behandeln (→ deutsche Pflichtfeld-Meldung). */
const toStr = (v: unknown) => (v === undefined || v === null ? "" : v);

/** Pflicht-Textfeld: fehlende Werte werden wie leere Eingaben behandelt (deutsche Meldung). */
const requiredText = (max: number, min: number, missing: string) =>
  z.preprocess(toStr, z.string({ error: missing }).trim().min(min, { error: missing }).max(max, { error: `Bitte maximal ${max} Zeichen.` }));

const optionalText = (max: number) =>
  z.preprocess((v) => (typeof v === "string" ? v.trim() : v), z.string().max(max, { error: `Bitte maximal ${max} Zeichen.` }).optional().or(z.literal("")))
    .transform((v) => (v ? v : undefined));

const bool = z.preprocess((v) => v === true || v === "true" || v === "on" || v === "1", z.boolean());

function optionalNumber(label: string, min: number, max: number) {
  return z.preprocess(
    (v) => {
      if (v === undefined || v === null || v === "") return undefined;
      if (typeof v === "number") return v;
      const n = parseGermanNumber(String(v));
      return n === null ? Number.NaN : n;
    },
    z
      .number({ error: `Bitte geben Sie ${label} als Zahl ein.` })
      .refine((n) => Number.isFinite(n), { error: `Bitte geben Sie ${label} als Zahl ein.` })
      .refine((n) => n >= min && n <= max, { error: `Bitte prüfen Sie ${label}.` })
      .optional(),
  );
}

export const kundentypEnum = z.enum(["gewerbe", "privat"], { error: "Bitte wählen Sie aus, ob Sie Unternehmen oder Privathaushalt sind." });
export const energieEnum = z.enum(["strom", "gas", "beides"], { error: "Bitte wählen Sie eine Energieart." });

const email = z.preprocess(
  toStr,
  z
    .string({ error: "Bitte geben Sie Ihre E-Mail-Adresse an." })
    .trim()
    .toLowerCase()
    .min(1, { error: "Bitte geben Sie Ihre E-Mail-Adresse an." })
    .max(160, { error: "Die E-Mail-Adresse ist zu lang." })
    .pipe(z.email({ error: "Bitte geben Sie eine gültige E-Mail-Adresse an." })),
);

const phoneRequired = z.preprocess(
  toStr,
  z
    .string({ error: "Bitte geben Sie Ihre Telefonnummer an." })
    .trim()
    .min(1, { error: "Bitte geben Sie Ihre Telefonnummer an." })
    .transform((v, ctx) => {
      const n = normalizePhone(v);
      if (!n) {
        ctx.addIssue({ code: "custom", message: "Bitte geben Sie eine gültige Telefonnummer an, z. B. 0203 1234567." });
        return z.NEVER;
      }
      return n;
    }),
);

const phoneOptional = z
  .string()
  .trim()
  .optional()
  .transform((v, ctx) => {
    if (!v) return undefined;
    const n = normalizePhone(v);
    if (!n) {
      ctx.addIssue({ code: "custom", message: "Bitte geben Sie eine gültige Telefonnummer an, z. B. 0203 1234567." });
      return z.NEVER;
    }
    return n;
  });

const privacyAck = bool.refine((v) => v === true, { error: "Bitte bestätigen Sie, dass Sie die Datenschutzhinweise zur Kenntnis genommen haben." });

/** Felder je Schritt – für die schrittweise Validierung im Client. */
export const stepFields = {
  kundentyp: ["kundentyp"],
  energie: ["energie"],
  vertrag: [
    "plz",
    "ort",
    "anbieter",
    "verbrauchStrom",
    "verbrauchGas",
    "vertragsende",
    "arbeitspreis",
    "grundpreis",
    "kuendigung",
    "zaehlerart",
    "lieferstellen",
  ],
  kontakt: ["firma", "ansprechpartner", "email", "telefon", "nachricht"],
  abschluss: ["datenschutz", "werbungEmail", "werbungTelefon", "files"],
} as const;

export const energieCheckSchema = z
  .object({
    kundentyp: kundentypEnum,
    energie: energieEnum,
    plz: z.preprocess(
      toStr,
      z.string().trim().regex(/^\d{5}$/, { error: "Bitte geben Sie eine gültige fünfstellige Postleitzahl an." }),
    ),
    ort: requiredText(80, 2, "Bitte geben Sie den Ort an."),
    anbieter: optionalText(120),
    verbrauchStrom: optionalNumber("den Stromverbrauch (kWh)", 1, 500_000_000),
    verbrauchGas: optionalNumber("den Gasverbrauch (kWh)", 1, 500_000_000),
    vertragsende: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : undefined))
      .refine((v) => v === undefined || /^\d{4}-\d{2}(-\d{2})?$/.test(v), { error: "Bitte geben Sie ein gültiges Datum an." }),
    arbeitspreis: optionalNumber("den Arbeitspreis (ct/kWh)", 0.01, 300),
    grundpreis: optionalNumber("den Grundpreis (€/Monat)", 0, 100_000),
    kuendigung: z.enum(["nein", "ja", "unbekannt"], { error: "Bitte wählen Sie eine Option." }).default("unbekannt"),
    zaehlerart: z.enum(["slp", "rlm", "unbekannt"]).optional(),
    lieferstellen: optionalNumber("die Anzahl der Lieferstellen", 1, 5000),
    firma: optionalText(160),
    ansprechpartner: requiredText(120, 2, "Bitte geben Sie Ihren Namen an."),
    email,
    telefon: phoneRequired,
    nachricht: optionalText(2000),
    datenschutz: privacyAck,
    werbungEmail: bool.default(false),
    werbungTelefon: bool.default(false),
  })
  .superRefine((v, ctx) => {
    if (v.kundentyp === "gewerbe" && !v.firma) {
      ctx.addIssue({ code: "custom", path: ["firma"], message: "Bitte geben Sie den Firmennamen an." });
    }
  })
  .transform((v) => ({
    ...v,
    // Kundentyp-fremde Felder verwerfen (Datensparsamkeit)
    firma: v.kundentyp === "gewerbe" ? v.firma : undefined,
    zaehlerart: v.kundentyp === "gewerbe" ? (v.zaehlerart ?? "unbekannt") : undefined,
    lieferstellen: v.kundentyp === "gewerbe" ? v.lieferstellen : undefined,
    verbrauchStrom: v.energie === "gas" ? undefined : v.verbrauchStrom,
    verbrauchGas: v.energie === "strom" ? undefined : v.verbrauchGas,
  }));

export type EnergieCheckInput = z.input<typeof energieCheckSchema>;
export type EnergieCheckData = z.output<typeof energieCheckSchema>;

export const kontaktSchema = z.object({
  kundentyp: kundentypEnum.optional(),
  ansprechpartner: requiredText(120, 2, "Bitte geben Sie Ihren Namen an."),
  firma: optionalText(160),
  email,
  telefon: phoneOptional,
  nachricht: requiredText(2000, 10, "Bitte schreiben Sie uns kurz Ihr Anliegen (mindestens 10 Zeichen)."),
  datenschutz: privacyAck,
});

export type KontaktData = z.output<typeof kontaktSchema>;

/** Zod-Fehler in { feld: meldung } umwandeln (erste Meldung je Feld). */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "_form");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

/** Datei-Regeln (Client und Server). */
export const uploadRules = {
  maxFiles: 3,
  maxBytes: 10 * 1024 * 1024,
  accept: ["application/pdf", "image/jpeg", "image/png"] as const,
  extensions: [".pdf", ".jpg", ".jpeg", ".png"] as const,
};
