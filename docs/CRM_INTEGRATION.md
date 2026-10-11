# CRM-Integration (KG-Business-CRM)

**Status: Adapter fertig und getestet – Live-Übertragung deaktiviert, wartet auf Freigabe und API-Vertrag.**

## Grundsätze
- Das bestehende KG-Business-CRM (Quellcode, Datenbank, API-Konfiguration) wird **nicht verändert**. Es werden keine Endpunkte im CRM ergänzt.
- Die Website enthält einen eigenständigen Adapter (`src/server/crm/`), der Anfragen nach erfolgreicher lokaler Speicherung überträgt.
- Zugangsdaten nur als Server-Umgebungsvariablen (`CRM_ENDPOINT`, `CRM_API_TOKEN`) – nie im Browser, Bundle oder Repository.
- Der API-Vertrag des CRM konnte in dieser Sitzung **nicht eingesehen werden** (Lesezugriff auf das CRM-Repository wurde nicht freigegeben). Das folgende Format ist ein **Vorschlag** auf Basis der geforderten Felder.

## Betriebsmodi
| `CRM_MODE` | Verhalten |
|---|---|
| `disabled` (Standard) | Keine Übertragung. Neue Leads erhalten `crm_status = skipped_disabled`. |
| `mock` | Übertragung an eine lokale Datei `DATA_DIR/crm-mock-outbox.jsonl` (personenbezogene Felder maskiert). Nur Entwicklung/Preview. In `SITE_ENV=production` verboten. |
| `live` | HTTP-POST an `CRM_ENDPOINT`. **Wirksam nur mit `CRM_LIVE_APPROVED=true`** sowie gesetztem Endpoint und Token – sonst automatisch `disabled`. |

Testanfragen (E-Mail-Domains aus `TEST_EMAIL_DOMAINS`) und Duplikate werden **nie** übertragen.

## Übertragungsformat (Vorschlag)
`POST {CRM_ENDPOINT}` · `Content-Type: application/json`

Header:
```
Authorization: Bearer {CRM_API_TOKEN}
Idempotency-Key: KGB-261011-7H3KQ2        # Referenz-ID der Website
X-Source: kg-business-website
```

Body (`src/server/crm/types.ts`):
```json
{
  "referenzId": "KGB-261011-7H3KQ2",
  "quelle": "KG Business Website",
  "formular": "energie-check",
  "anfragezeitpunkt": "2026-10-11T08:15:00.000Z",
  "firma": "Muster GmbH",
  "ansprechpartner": "Max Mustermann",
  "telefonnummer": "+492031234567",
  "email": "max@muster-gmbh.de",
  "adresse": { "plz": "47055", "stadt": "Duisburg" },
  "kundentyp": "gewerbe",
  "energieart": "strom_und_gas",
  "aktuellerAnbieter": "Stadtwerke Beispiel",
  "jahresverbrauchKwh": { "strom": 85000, "gas": 140000 },
  "vertragsende": "2027-03-31",
  "notizen": "Zählerart: Leistungsmessung (RLM)\nAnzahl Lieferstellen: 3\nKündigung bereits erfolgt: nein",
  "einwilligungen": { "werbungEmail": true, "werbungTelefon": false, "textVersion": "2026-10-v1" },
  "anhaenge": [{ "dateiname": "Rechnung.pdf", "mimeType": "application/pdf", "groesseBytes": 182934, "sha256": "…", "virenscan": "clean" }],
  "istDuplikatVon": null
}
```

Feldzuordnung zur Anforderung:

| Anforderung | Feld |
|---|---|
| Firma | `firma` |
| Ansprechpartner | `ansprechpartner` |
| Telefonnummer | `telefonnummer` (E.164) |
| E-Mail | `email` |
| Adresse / PLZ / Stadt | `adresse.plz`, `adresse.stadt` |
| Kundentyp | `kundentyp` |
| Strom oder Gas | `energieart` (`strom` · `gas` · `strom_und_gas`) |
| Aktueller Anbieter | `aktuellerAnbieter` |
| Jahresverbrauch | `jahresverbrauchKwh.strom` / `.gas` |
| Vertragsende | `vertragsende` (ISO-Datum) |
| Quelle | `quelle` = „KG Business Website“ |
| Anfragezeitpunkt | `anfragezeitpunkt` (ISO 8601, UTC) |
| Notizen | `notizen` (Nachricht, Zählerart, Lieferstellen, Preise, Kündigungsstatus) |
| Referenz-ID | `referenzId` |

Erwartete Antworten:
- `2xx` → Erfolg; eine ID aus `id`, `leadId` oder `externalId` wird als `crm_external_id` gespeichert.
- `409` → bereits vorhanden (Idempotenz) → als Erfolg gewertet.
- `408`, `425`, `429`, `5xx`, Timeout, Netzwerkfehler → erneuter Versuch mit Backoff (1, 5, 15, 60, 180, 720, 1440 min).
- Sonstige `4xx` → dauerhafter Fehler (`crm_status = failed`), manuelle Prüfung.

**Dateien (Rechnungen)** werden derzeit **nicht** übertragen – nur Metadaten. Optionen nach Klärung: separater Upload-Endpunkt im CRM, signierter Abruf durch das CRM, oder manueller Export (`npm run leads -- export-upload`). Nur virengeprüfte Dateien (`virenscan: clean`) übertragen.

## Aktivierung (nach Freigabe durch Murat)
1. CRM-Team stellt API-Vertrag bereit (Endpoint, Authentifizierung, Feldnamen, Idempotenz, Fehlercodes, Datei-Upload).
2. Mapping in `src/server/crm/mapping.ts` und Typen in `types.ts` anpassen, Tests in `tests/unit/crm.test.ts` aktualisieren.
3. Test gegen eine **CRM-Testinstanz** mit Testdaten (`CRM_MODE=live`, `CRM_LIVE_APPROVED=true`, Test-Endpoint).
4. Schriftliche Freigabe für Produktion.
5. Produktion: `.env` setzen, Dienst neu starten. Prüfen mit `npm run leads -- list` (Status `sent`).
6. Optional zurückgehaltene Leads gezielt nachsenden: `npm run leads -- requeue --since 2026-10-15` und `npm run leads -- dispatch`.

## Betrieb
- Automatische Verarbeitung: jede Minute im Serverprozess (`BACKGROUND_JOBS=true`) und unmittelbar nach jeder neuen Anfrage.
- Manuell: `npm run leads -- dispatch`.
- Fehlgeschlagene Übertragungen: `npm run leads -- list` (Spalte `crm_status = failed`), Ursache in `crm_last_error`; nach Behebung `requeue`.

## Offene Fragen an das CRM-Team
1. Endpoint und Authentifizierungsverfahren (Bearer-Token? mTLS? IP-Freigabe?)
2. Feldnamen und Pflichtfelder; Format für Kundentyp/Energieart
3. Unterstützt das CRM einen Idempotenz-Schlüssel bzw. Duplikaterkennung über `referenzId`?
4. Wie sollen Rechnungsdateien übergeben werden?
5. Sollen Werbeeinwilligungen im CRM gespeichert werden (Nachweis nach § 7a UWG)?
6. Rückmeldung bei Übernahme (ID) – für die Zuordnung in der Website-Datenbank
