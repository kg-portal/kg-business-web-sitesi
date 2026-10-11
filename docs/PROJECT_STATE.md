# Projektstand – KG Business Website V2

**Stand:** 2026-10-11 · **Branch:** `claude/kg-business-v2` · **Status:** technisch fertig für eine Preview, **nicht live**

## Sicherheit & Rahmen
| Punkt | Status |
|---|---|
| Nur `kg-portal/kg-business-web-sitesi` verändert | ✅ |
| `main` unverändert (`ea8ac0d`) | ✅ |
| Backup-Branch `backup/kg-business-before-v2-20261011` (= `main`, verifiziert) | ✅ gepusht |
| Backup-Tag `v1-before-v2-20261011` | ⚠️ lokal erstellt, Push vom Git-Proxy der Umgebung abgelehnt – nachholen (Befehl in `DECISIONS.md` D-01) |
| Live-Website, DNS, Hetzner, CRM, E-Mail | ✅ nicht angefasst |

## Umgesetzt (alle Phasen)
| Phase | Ergebnis |
|---|---|
| 1 Audit & Backup | Backup + Arbeitsbranch; Repository-Analyse; Recherche Wettbewerb/Recht/Energiemarkt (`docs/research/`). **Live-Site/DNS nicht abrufbar** (Netzwerkrichtlinie) |
| 2 Designsystem | Tokens (Navy/Blau/Grün, WCAG-geprüft), Plus Jakarta Sans selbst gehostet, Buttons, Karten, Segment-Auswahl, Icons, Header mit Mega-Menü, mobiles Menü (Fokusfalle), Footer, mobile Angebotsleiste, eigene SVG-Hero-Grafik |
| 3 Startseite | Hero + Quick-Check, Einstiege, Leistungen, Angebots-Anatomie, Prozess, Branchen, Transparenz-Block, Privatkunden, Ratgeber, FAQ, CTA |
| 4 Leistungsseiten | Gewerbestrom (SLP/RLM, Lastgang-Grafik, Rechner), Gewerbegas, Privatkunden + Strom + Gas, Branchen-Übersicht + 9 Branchenseiten, So funktioniert’s, Über uns (nur verifizierbare Angaben), Kontakt, Energieberatung Duisburg |
| 5 Energie-Check | 5 Schritte + Bestätigung, Upload, Validierung, Entwurfsspeicher, Fehlerzustände; API mit Origin/Token/Honeypot/Rate-Limit/Idempotenz/Duplikaten; verschlüsselte SQLite-Speicherung; sichere Uploads |
| 6 CRM-Adapter | disabled/mock/live, Outbox mit Backoff, Freigabesperre, Maskierung, Tests. **Live wartet auf API-Vertrag + Freigabe** |
| 7 SEO | Metadaten je Seite, Canonicals, OG/Twitter, Schema.org, Breadcrumbs, Sitemap, robots, 8 Ratgeber-Artikel mit Quellen, V1-Weiterleitungen; Plan für Live-Weiterleitungen |
| 8 Recht & A11y | Impressum, Datenschutz, AGB (aus V1), Cookie-Hinweis mit Prüfhinweisen (nur Preview sichtbar); WCAG 2.2 AA (axe 0 Verstöße) |
| 9 Tests & QA | 100 Unit-Tests, 94 E2E-Tests, 7 Breiten ohne Überbreite, Lighthouse (mobil 95–97 / Desktop 100 Performance; A11y & Best Practices 100; SEO 100 indexierbar) |
| 10 Deployment | Anleitung Hetzner (isoliert), Caddy-Block, systemd, Backups, Go-Live-Checkliste, Rollback (`docs/DEPLOYMENT.md`) – **nicht ausgeführt** |

## Wartet auf Freigabe / Zuarbeit von KG Business (Murat)
1. **Unternehmensangaben bestätigen** (`docs/LEGAL_REVIEW.md` Abschnitt A) – insbesondere Telefonnummer und USt-IdNr. (laut Suchergebnissen auch bei „KG-Gebäudereinigung“ genutzt)
2. **Rechtstexte prüfen lassen** (Impressum, Datenschutz, AGB)
3. **Netzwerkfreigabe** für `kg-business.de`, `www.kg-business.de`, `dns.google` in der Entwicklungsumgebung **oder** Live-Audit selbst durchführen → Weiterleitungen ergänzen
4. **CRM-API-Vertrag** + Testinstanz; danach Freigabe für `CRM_MODE=live`
5. **Hetzner-Preview** (Dienst, Port, Caddy-Block, Subdomain-DNS) – nach Freigabe gemäß `docs/DEPLOYMENT.md`
6. **E-Mail-Benachrichtigung** (SMTP-Zugang) – sonst sieht vor CRM-Anbindung niemand die Anfragen
7. Logo/Bildrechte bestätigen; Hero-Text wählen (`docs/COPY_OPTIONS.md`); Öffnungszeiten; Löschfristen
8. Merge nach `main` und DNS-Umschaltung: jeweils separate Freigabe

## Wichtige Pfade
- Inhalte: `src/content/` (Unternehmen, Branchen, Ratgeber, FAQ, Navigation)
- Formular-Backend: `src/app/api/leads/route.ts`, `src/server/`
- Betriebs-CLI: `npm run leads -- list|show|export-upload|requeue|dispatch|purge`
- Tests: `tests/unit`, `tests/e2e`; Bericht `docs/TEST_REPORT.md`

## Bekannte Einschränkungen
- Rate-Limiter und Hintergrundjobs für **eine** Serverinstanz ausgelegt
- ClamAV, SMTP, Live-CRM nicht gegen echte Dienste getestet
- Nur Chromium getestet (Safari/Firefox ausstehend)
- Simuliertes mobiles LCP 2,6–2,8 s (Ziel ≤ 2,5 s)
