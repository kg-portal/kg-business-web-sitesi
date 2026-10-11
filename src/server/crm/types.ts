/**
 * Übergabeformat an das bestehende KG-Business-CRM.
 * Feldnamen gemäß Anforderung; der tatsächliche API-Vertrag des CRM muss noch
 * bestätigt werden (docs/CRM_INTEGRATION.md). Anpassungen nur in mapping.ts.
 */
export interface CrmLeadPayload {
  referenzId: string;
  quelle: "KG Business Website";
  formular: "energie-check" | "kontakt";
  anfragezeitpunkt: string;
  firma: string | null;
  ansprechpartner: string;
  telefonnummer: string | null;
  email: string;
  adresse: { plz: string | null; stadt: string | null };
  kundentyp: "gewerbe" | "privat" | null;
  energieart: "strom" | "gas" | "strom_und_gas" | null;
  aktuellerAnbieter: string | null;
  jahresverbrauchKwh: { strom: number | null; gas: number | null };
  vertragsende: string | null;
  notizen: string;
  einwilligungen: { werbungEmail: boolean; werbungTelefon: boolean; textVersion: string };
  anhaenge: { dateiname: string; mimeType: string; groesseBytes: number; sha256: string; virenscan: string }[];
  istDuplikatVon: string | null;
}

export type CrmSendResult = { ok: true; externalId: string | null } | { ok: false; retryable: boolean; error: string };

export interface CrmAdapter {
  readonly mode: "disabled" | "mock" | "live";
  send(payload: CrmLeadPayload, idempotencyKey: string): Promise<CrmSendResult>;
}
