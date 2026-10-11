# CLAUDE.md – Regeln für KI-gestützte Entwicklung (KG Business Website V2)

## Oberste Sicherheitsregel (Wortlaut der Auftraggeberin/des Auftraggebers)

> **KG Business Website V2 geliştirilirken yalnızca bu repository değiştirilebilir. Diğer KG sistemleri, LEON SaaS, Hetzner üretim servisleri ve mevcut alan adları dokunulmazdır.**

Sinngemäß: Bei der Entwicklung der KG Business Website V2 darf ausschließlich dieses Repository verändert werden. Andere KG-Systeme, LEON SaaS, Hetzner-Produktionsdienste und bestehende Domains sind tabu.

Das bedeutet verbindlich:

- Geändert werden darf **ausschließlich** `kg-portal/kg-business-web-sitesi`.
- **Nicht anfassen:** `kg-portal/leon-saas`, `kg-portal/kg-portal`, `kg-portal/kg-business-voice`, `kg-portal/KG-Agent-Portal`, `kg-portal/kg-connector-relay`, alle übrigen Repositories, KG-CRM- und Leon-Business-Quellcode, KG Daten MCP.
- **Keine Eingriffe** in Hetzner-Produktionsdienste, systemd-Units, Caddy/Nginx-Konfiguration, DNS-, MX-, SPF-, DKIM-, DMARC-Einträge, E-Mail-Konten, laufende Ports, CRM-Datenbanken, Kampagnen, API-Schlüssel oder Kundendaten.
- `portal.kg-business.de` und alle weiteren KG-Domains dürfen nicht beeinträchtigt werden.

## Branches

- Arbeitsbranch: `claude/kg-business-v2` – alle Änderungen nur hier.
- `main` wird **nicht** verändert, nicht gemergt, kein Force-Push.
- Sicherung der V1: Branch `backup/kg-business-before-v2-20261011` (Commit `ea8ac0d`). Nicht löschen, nicht verändern.

## Nur mit ausdrücklicher Freigabe durch Murat (KG Business)

- Live-Website oder Domain/DNS ändern
- Hetzner-Dienste anlegen oder ändern
- Kostenpflichtige Dienste/Abos buchen
- Echte Leads ins CRM schreiben (`CRM_MODE=live` + `CRM_LIVE_APPROVED=true`)
- E-Mails an echte Kunden senden (`CUSTOMER_CONFIRMATION_EMAIL=true`)
- Rechtliche Unternehmensangaben ändern (`src/content/company.ts`)
- Merge nach `main`

## Inhaltliche Regeln

- Keine erfundenen Preise, Ersparnisse, Kundenbewertungen, Kundenzahlen, Zertifikate, Partnerschaften oder Gründungsjahre.
- Versorgernamen nicht als „Partner“ darstellen, keine Versorgerlogos ohne schriftliche Erlaubnis.
- Nicht „unabhängig“ oder „Vergleichsportal“ nennen; Provisionsmodell offen kommunizieren.
- Keine generischen Umweltaussagen („klimaneutral“, „umweltfreundlich“) – UWG-Novelle seit 27.09.2026.
- Rechtliche Fakten im Ratgeber nur mit Quelle und Stand-Datum.
- Unbestätigte Unternehmensangaben bleiben in `src/content/company.ts` / `src/content/about.ts` als „offen“ markiert und werden nicht angezeigt.

## Technische Regeln

- Vor jedem Commit: `npm run check` (Typecheck, ESLint, Vitest). Vor größeren Änderungen zusätzlich `npm run build && npm run test:e2e`.
- Niemals personenbezogene Daten loggen (siehe `src/server/logger.ts`).
- Keine Geheimnisse ins Repository. `.env*` (außer `.env.example`) und `data/` sind ausgeschlossen.
- Next.js 16: `params` sind Promises; `middleware` heißt `proxy`. Bei Unsicherheit `node_modules/next/dist/docs/` lesen (siehe `AGENTS.md`).

## Fortsetzung in neuen Sitzungen

Zuerst lesen: `docs/PROJECT_STATE.md`, `docs/NEXT_STEPS.md`, `docs/DECISIONS.md`. Nach jeder Arbeitsphase `docs/PROJECT_STATE.md` aktualisieren.
