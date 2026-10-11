import type { LeadPayload, LeadRow } from "../leads/types";
import type { CrmLeadPayload } from "./types";

const fmt = new Intl.NumberFormat("de-DE");

export interface AttachmentMeta {
  originalName: string;
  mime: string;
  size: number;
  sha256: string;
  scanStatus: string;
}

/** Bildet eine gespeicherte Anfrage auf das CRM-Format ab. */
export function toCrmPayload(row: Pick<LeadRow, "reference" | "created_at" | "duplicate_of" | "consent_text_version">, payload: LeadPayload, attachments: AttachmentMeta[]): CrmLeadPayload {
  const base = {
    referenzId: row.reference,
    quelle: "KG Business Website" as const,
    anfragezeitpunkt: row.created_at,
    istDuplikatVon: row.duplicate_of,
    anhaenge: attachments.map((a) => ({ dateiname: a.originalName, mimeType: a.mime, groesseBytes: a.size, sha256: a.sha256, virenscan: a.scanStatus })),
  };

  if (payload.formType === "kontakt") {
    const d = payload.data;
    return {
      ...base,
      formular: "kontakt",
      firma: d.firma ?? null,
      ansprechpartner: d.ansprechpartner,
      telefonnummer: d.telefon ?? null,
      email: d.email,
      adresse: { plz: null, stadt: null },
      kundentyp: d.kundentyp ?? null,
      energieart: null,
      aktuellerAnbieter: null,
      jahresverbrauchKwh: { strom: null, gas: null },
      vertragsende: null,
      notizen: `Kontaktanfrage:\n${d.nachricht}`,
      einwilligungen: { werbungEmail: false, werbungTelefon: false, textVersion: row.consent_text_version },
    };
  }

  const d = payload.data;
  const notes: string[] = [];
  if (d.nachricht) notes.push(`Nachricht: ${d.nachricht}`);
  if (d.zaehlerart) notes.push(`Zählerart: ${{ slp: "Standardlastprofil (SLP)", rlm: "Leistungsmessung (RLM)", unbekannt: "unbekannt" }[d.zaehlerart]}`);
  if (d.lieferstellen) notes.push(`Anzahl Lieferstellen: ${d.lieferstellen}`);
  if (d.arbeitspreis !== undefined) notes.push(`Aktueller Arbeitspreis: ${fmt.format(d.arbeitspreis)} ct/kWh`);
  if (d.grundpreis !== undefined) notes.push(`Aktueller Grundpreis: ${fmt.format(d.grundpreis)} €/Monat`);
  notes.push(`Kündigung bereits erfolgt: ${{ ja: "ja", nein: "nein", unbekannt: "unbekannt" }[d.kuendigung]}`);

  return {
    ...base,
    formular: "energie-check",
    firma: d.firma ?? null,
    ansprechpartner: d.ansprechpartner,
    telefonnummer: d.telefon,
    email: d.email,
    adresse: { plz: d.plz, stadt: d.ort },
    kundentyp: d.kundentyp,
    energieart: d.energie === "beides" ? "strom_und_gas" : d.energie,
    aktuellerAnbieter: d.anbieter ?? null,
    jahresverbrauchKwh: { strom: d.verbrauchStrom ?? null, gas: d.verbrauchGas ?? null },
    vertragsende: d.vertragsende ?? null,
    notizen: notes.join("\n"),
    einwilligungen: { werbungEmail: d.werbungEmail, werbungTelefon: d.werbungTelefon, textVersion: row.consent_text_version },
  };
}
