# KG Business – Website V2

Neue Website für **KG Business – Strom & Gas Energieberatung** (Duisburg).
Next.js 16 · React 19 · TypeScript (strict) · Tailwind CSS 4 · Zod · SQLite · Vitest · Playwright

> Status: **Preview / nicht live.** Die bestehende Website kg-business.de wurde nicht verändert.
> Stand, offene Punkte und Freigaben: [`docs/PROJECT_STATE.md`](docs/PROJECT_STATE.md).

## Schnellstart

```bash
npm ci
cp .env.example .env.local      # für die Entwicklung genügen die Standardwerte
npm run dev                     # http://localhost:3000
```

In der Entwicklung werden ohne `APP_SECRET`/`LEAD_ENCRYPTION_KEY` unsichere Dev-Schlüssel verwendet (Warnung im Log).
Im Produktionsbetrieb (`NODE_ENV=production`) sind beide Pflicht – sonst antwortet die Formular-API mit 503.

## Befehle

| Befehl | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver |
| `npm run build` / `npm start` | Produktions-Build / -Server |
| `npm run check` | Typecheck + ESLint + Unit-Tests |
| `npm test` | Unit-Tests (Vitest) |
| `npm run test:e2e` | E2E-Tests (Playwright) gegen den Produktions-Build – vorher `npm run build` |
| `npm run test:all` | alles: check → build → E2E |
| `npm run leads -- list` | Betriebs-CLI: Anfragen auflisten (weitere Befehle: `show`, `export-upload`, `requeue`, `dispatch`, `purge`) |

## Aufbau

```
src/
  app/                 Seiten (App Router), API-Routen, sitemap/robots/manifest
    api/leads          Annahme Energie-Check & Kontakt (multipart)
    api/form-token     signiertes Formular-Token (CSRF/Bot-Schutz)
    api/health         Monitoring
  components/          UI (ui/), Layout, Abschnitte, Formulare, Grafiken (art/), Rechtstexte
  content/             Inhalte als Daten: Unternehmen, Branchen, Ratgeber, FAQ, Navigation
  lib/                 geteilte Logik: Validierung (lead-schema), Telefon, SEO, Schema.org, Tarifrechnung
  server/              nur serverseitig: Konfiguration, DB, Verschlüsselung, Sicherheit,
                       Uploads, Leads, CRM-Adapter, E-Mail, Löschlauf, Hintergrundjobs
scripts/leads.ts       Betriebs-CLI
tests/unit, tests/e2e  Vitest / Playwright
docs/                  Projektstand, Entscheidungen, Recht, SEO, Deployment, Testbericht
```

Zentrale Unternehmensdaten stehen ausschließlich in [`src/content/company.ts`](src/content/company.ts) – Impressum,
Footer, Kontakt und Schema.org lesen von dort.

## Energie-Check: Datenfluss

1. Browser holt `/api/form-token` (HMAC-signiert, Zeitstempel).
2. Formular (5 Schritte) validiert clientseitig mit demselben Zod-Schema wie der Server.
3. `POST /api/leads`: Origin-Prüfung → eigener Header → Größe → Rate-Limit → Honeypot → Token (Mindest-Ausfüllzeit) →
   Idempotenz → Validierung → Upload-Prüfung (Signatur, PDF-Heuristik, Bild-Neukodierung, optional ClamAV) →
   verschlüsselte Speicherung (AES-256-GCM) in `DATA_DIR`.
4. Erst nach erfolgreicher Speicherung: Erfolgsseite mit Referenz-ID (z. B. `KGB-261011-7H3KQ2`).
5. Danach (asynchron): optionale interne E-Mail, CRM-Outbox (Standard: deaktiviert).

Details: [`docs/DECISIONS.md`](docs/DECISIONS.md), CRM: [`docs/CRM_INTEGRATION.md`](docs/CRM_INTEGRATION.md).

## Dokumentation

- [Projektstand](docs/PROJECT_STATE.md) · [Nächste Schritte](docs/NEXT_STEPS.md) · [Backlog](docs/BACKLOG.md)
- [Entscheidungen](docs/DECISIONS.md) · [CRM-Integration](docs/CRM_INTEGRATION.md)
- [Deployment & Rollback](docs/DEPLOYMENT.md) · [SEO & Weiterleitungen](docs/SEO_REDIRECTS.md)
- [Rechtliche Prüfpunkte](docs/LEGAL_REVIEW.md) · [Testbericht](docs/TEST_REPORT.md)
- [Texte/Hero-Varianten](docs/COPY_OPTIONS.md) · [Logo](docs/brand/LOGO.md)
- Recherche: [`docs/research/`](docs/research/)

## Regeln für die Weiterentwicklung

Siehe [`CLAUDE.md`](CLAUDE.md): Nur dieses Repository ändern, `main` nicht anfassen, keine Live-/DNS-/CRM-Aktionen ohne
Freigabe, keine erfundenen Preise oder Referenzen.
