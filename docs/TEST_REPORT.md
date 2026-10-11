# Testbericht

Stand: 2026-10-11 · Branch `claude/kg-business-v2` · alle Ergebnisse tatsächlich ausgeführt (keine Annahmen).

## Zusammenfassung
| Prüfung | Ergebnis |
|---|---|
| TypeScript (`tsc --noEmit`, strict) | ✅ fehlerfrei |
| ESLint (next/core-web-vitals + typescript) | ✅ 0 Fehler, 0 Warnungen |
| Unit-Tests (Vitest) | ✅ **100 bestanden** (8 Testdateien) |
| Produktions-Build (`next build`) | ✅ 0 Warnungen; 34 Inhaltsseiten statisch vorgerendert (+ 404, Sitemap, robots, Manifest), 3 API-Routen dynamisch |
| E2E-Tests (Playwright, Chromium, Desktop 1440 + Pixel 7) | ✅ **94 bestanden**, 8 übersprungen (gerätespezifisch: Desktop-Tests im Mobil-Projekt und umgekehrt) |
| Barrierefreiheit (axe-core, WCAG 2.0/2.1/2.2 A+AA) | ✅ 0 Verstöße auf 10 Kernseiten, Fehlerzustand und mobilem Menü |
| Responsive (360/390/430/768/1024/1440/1920 px × 34 Seiten) | ✅ keine horizontale Überbreite |
| Lighthouse 13.5 | siehe unten |

## Unit-Tests (Vitest) – Inhalte
- Telefon-Normalisierung (E.164) und deutsche Zahleneingabe
- Tarifberechnung: Jahreskosten, Bonus nur im ersten Jahr, Break-even, Ranking nach Folgejahreskosten; kein Tarifanbieter → keine Preise
- Validierungsschema: Pflichtfelder, deutsche Meldungen, Gewerbe/Privat-Felder, Datensparsamkeit, getrennte Einwilligungen
- Sicherheit: Formular-Token (gültig, zu schnell, abgelaufen, manipuliert), Rate-Limiter, Origin-Prüfung, IP-Hash mit Tagessalz, AES-256-GCM (Manipulation, falscher Schlüssel)
- Uploads: Signaturerkennung, getarnte Dateien, Größen, aktive PDF-Inhalte, Dateinamen-Bereinigung, EXIF-Entfernung, beschädigte Bilder
- Lead-Service: verschlüsselte Speicherung (kein Klartext in DB/WAL), Idempotenz, Duplikate, Testleads, Upload-Ablehnung ohne Speicherung, Kontaktformular
- Löschlauf: Uploads nach 90, Anfragen nach 180 Tagen
- CRM: Feldzuordnung, Maskierung, HTTP-Adapter (Token, Idempotency-Key, 409, Wiederholbarkeit je Statuscode, Timeout), Outbox (genau einmal, nie Testleads, Backoff, Abbruch bei 4xx), Freigabesperre für Live-Modus

## E2E-Tests (Playwright) – Inhalte
- Alle 34 Seiten: Status 200, genau eine H1, Title/Description (Länge, Eindeutigkeit), Canonical, OG/Twitter, `lang="de"`, `noindex` in der Vorschau
- Strukturierte Daten gültig; Sitemap vollständig; robots.txt sperrt Vorschau; 404-Seite; V1-Weiterleitungen (308); Sicherheits-Header
- **Keine externen Requests** (kein Tracking, keine Google Fonts)
- Keine Preis-/Bewertungs-/Umwelt-Claims auf Kernseiten
- Navigation: Mega-Menü (Escape, Fokus), Hauptlinks + `aria-current`, mobiles Menü mit Fokusfalle, mobile Angebotsleiste, Skip-Link, Hero-CTAs, Quick-Check-Übergabe, Footer-Rechtslinks
- Energie-Check: Gewerbe mit 2 Uploads → **in DB gespeichert**, als Testlead markiert, **nicht** in der CRM-Outbox; Privatkunde → gewerbliche Felder ausgeblendet, Lead **im Mock-CRM** angekommen (Status `sent`, personenbezogene Felder maskiert); Schrittvalidierung mit Fokus; Serverfehler (500) und Netzwerkfehler mit klarer Meldung und ohne Erfolgsseite; Upload-Regeln (Typ, Anzahl, serverseitige Erkennung getarnter Dateien); Entwurf übersteht Neuladen
- Kontaktformular mit Referenz
- API: fremde Origin (403), fehlender Header, Honeypot, gefälschtes Token, zu schnelles Absenden, deutsche Feldmeldungen (422), Idempotenz, getarnte/aktive Dateien, GET 405, schlanker Health-Check
- Tastaturbedienung des Formulars, `prefers-reduced-motion`, Touch-Ziele ≥ 44 px

## Lighthouse 13.5 (lokaler Produktions-Build, Chromium headless)
Mobil = simuliertes langsames 4G + CPU-Drosselung (Lighthouse-Standard).

| Seite | Gerät | Performance | Accessibility | Best Practices | SEO* | FCP | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|---|
| `/` | desktop | 100 | 100 | 100 | 69 | 0.3 s | 0.6 s | 0 | 0 ms |
| `/energie-check` | desktop | 100 | 100 | 100 | 66 | 0.2 s | 0.6 s | 0 | 0 ms |
| `/gewerbestrom` | desktop | 100 | 100 | 100 | 66 | 0.3 s | 0.6 s | 0 | 0 ms |
| `/` | mobile | 97 | 100 | 100 | 69 | 1.0 s | 2.6 s | 0 | 60 ms |
| `/branchen/gastronomie` | mobile | 97 | 100 | 100 | 66 | 0.9 s | 2.6 s | 0 | 50 ms |
| `/energie-check` | mobile | 95 | 100 | 100 | 66 | 0.9 s | 2.8 s | 0.011 | 80 ms |
| `/gewerbestrom` | mobile | 96 | 100 | 100 | 66 | 0.9 s | 2.6 s | 0 | 80 ms |
| `/ratgeber/anbieterwechsel` | mobile | 95 | 100 | 100 | 66 | 0.9 s | 2.8 s | 0 | 110 ms |

\* SEO 66–69 in der Vorschau ist **beabsichtigt**: Einziger Fehlpunkt ist `is-crawlable`, weil die Vorschau `noindex` ausliefert. Gegenprobe mit indexierbarem Build (`SITE_ENV=production`, nur lokal):

| Seite | SEO (indexierbarer Build) |
|---|---|
| `/` | 100 |
| `/gewerbestrom` | 100 |
| `/ratgeber/anbieterwechsel` | 100 |

Vollständige HTML-Berichte (Auszug): `docs/reports/lighthouse/`. Rohdaten aller Läufe: `docs/reports/lighthouse-summary.json`.

Beobachtete (ungedrosselte) Werte lokal: FCP = LCP ≈ 0,2 s. Das simulierte mobile LCP (2,6–2,8 s) liegt knapp über dem „gut“-Grenzwert von 2,5 s; Hauptanteile sind Framework-JavaScript und Schriftdatei. Weitere Optimierungen im Backlog.

## Manuelle Prüfungen
- Formularablauf in Chromium bei 1280 px und 390 px durchgeklickt, Screenshots aller Schritte geprüft; keine Konsolenfehler
- API-Smoke-Test per curl (13 Fälle: Origin, Header, Honeypot, Token, zu schnell, Validierung, Erstellung, Idempotenz, Duplikat, getarnte Datei, PDF mit JavaScript, gültige Uploads, Kontakt)
- Verschlüsselung geprüft: weder E-Mail-Adresse noch Name im Klartext in `leads.sqlite`/WAL; hochgeladenes JPEG ohne EXIF
- Logs enthalten nur Ereignisse/Referenzen, keine Personendaten
- CSP: keine Verstöße auf Energie-Check und Kontakt (nach Umstellung von Zod auf `jitless`)

## Nicht getestet / Einschränkungen
- Live-CRM (kein API-Vertrag, keine Freigabe) – nur Mock- und HTTP-Adapter mit simuliertem Server
- ClamAV-Scan (kein clamd in der Umgebung) – Protokoll implementiert, ungetestet gegen echten Dienst
- SMTP-Versand (keine Zugangsdaten) – Modus `log`/`disabled` aktiv
- Safari/Firefox (nur Chromium verfügbar); echte iOS/Android-Geräte
- Deployment auf Hetzner, DNS (keine Freigabe)
- Live-Website-Abgleich (Netzwerkrichtlinie)

## Tests ausführen
```bash
npm run check                 # Typecheck, Lint, Unit
npm run build && npm run test:e2e
```
