# Entscheidungen (Architecture Decision Log)

Stand: 2026-10-11. Jede Entscheidung mit Begründung und ggf. Alternative. Annahmen sind als solche gekennzeichnet.

## D-01 Sicherung der V1 und Branch-Strategie
- `main@ea8ac0d` unverändert; Sicherung als Branch `backup/kg-business-before-v2-20261011` (identisch zu `main`, verifiziert per `git diff`).
- Annotiertes Tag `v1-before-v2-20261011` wurde lokal erstellt; **Push wurde vom Git-Proxy der Entwicklungsumgebung abgewiesen** (Branch-Pushes funktionieren). Nachholen: `git tag -a v1-before-v2-20261011 ea8ac0d -m "..." && git push origin v1-before-v2-20261011`.
- Entwicklung ausschließlich in `claude/kg-business-v2`. V1-Dateien (HTML, `assets/`) wurden im Arbeitsbranch entfernt; ausgewählte Bilder optimiert nach `public/images/` übernommen.

## D-02 Technologie
- **Next.js 16.4 (App Router), React 19.3, TypeScript 5.9 strict, Tailwind CSS 4.3, Zod 4.** Aktuelle stabile Versionen (Okt. 2026).
- TypeScript 5.9 statt 7.0: TS 7 ist der neue native Compiler; die Integration in Next.js-Typprüfung ist weniger erprobt. Wechsel später unkritisch.
- Playwright 1.56.1 gepinnt (passend zum vorinstallierten Chromium der Umgebung); `playwright-core` per npm-Override vereinheitlicht.
- Kein `output: "standalone"`: Der Dienst wird aus dem Repository mit `next start` betrieben, damit Betriebs-CLI (`npm run leads`) und Quellcode verfügbar sind.

## D-03 Datenhaltung: eigene SQLite-Datenbank
- `better-sqlite3`, WAL-Modus, Datei in `DATA_DIR` (Standard `./data`, Server: `/var/lib/kg-business-web`).
- **Begründung:** keine zusätzliche Datenbank-Instanz auf Hetzner nötig, keine Berührung bestehender Postgres-/CRM-Datenbanken, transaktional, Unique-Constraints für Idempotenz, ein Dateipfad zum Sichern.
- Alternative PostgreSQL wäre möglich (Repository-Schicht ist gekapselt), ist für das erwartete Volumen aber nicht nötig.
- Personenbezogene Inhalte werden **AES-256-GCM-verschlüsselt** (`payload_enc`); unverschlüsselt sind nur Betriebsmetadaten (Referenz, Zeit, Kundentyp, Energieart, Status). DB-Dateien `0600`, Verzeichnis `0700`.

## D-04 Formularsicherheit
- **CSRF:** Origin/Referer-Prüfung + Pflicht-Header `x-kg-form: 1` (erzwingt CORS-Preflight bei Fremdursprüngen) + HMAC-signiertes Formular-Token. Keine Session, keine Cookies.
- **Bot-Schutz ohne Drittanbieter:** Honeypot-Feld, Mindest-Ausfüllzeit (Token-Alter ≥ 4 s), Rate-Limit. Kein reCAPTCHA (Datenschutz, TDDDG).
- **Rate-Limit:** im Arbeitsspeicher, Schlüssel = HMAC(IP, tägliches Salz). Mit `TRUST_PROXY=true` wird `X-Forwarded-For` genutzt; ohne vertrauenswürdigen Proxy teilen sich alle Besucher einen großzügigen gemeinsamen Bucket (Schutz vor Fehlkonfiguration). Ausgelegt für **eine** Serverinstanz.
- **Idempotenz:** Client erzeugt pro Formularsitzung eine UUID; doppelte Übermittlungen liefern dieselbe Referenz (HTTP 200 statt 201).
- **Duplikate:** gleicher Fingerprint (HMAC aus E-Mail, Energieart, PLZ) innerhalb 24 h → gespeichert, aber `duplicate_of` gesetzt und **nicht erneut ans CRM**.
- **Testleads:** E-Mail-Domains aus `TEST_EMAIL_DOMAINS` → `is_test=1`, werden nie ans CRM übertragen.
- Honeypot-Treffer erhalten eine ehrliche Fehlermeldung statt einer Schein-Bestätigung (damit ein Mensch, dessen Browser das Feld automatisch füllt, nicht fälschlich „Erfolg“ sieht).

## D-05 Uploads
- Erlaubt: PDF, JPG, PNG; max. 3 Dateien à 10 MB. Prüfung über **Dateisignatur** und passende Endung (MIME-Angabe des Browsers wird ignoriert).
- PDF-Heuristik lehnt aktive Inhalte ab (`/JavaScript`, `/JS`, `/Launch`, `/EmbeddedFile`, `/RichMedia`, `/XFA`, `/SubmitForm`, `/ImportData`). Komprimierte Objektströme können Inhalte verbergen → **ersetzt keinen Virenscan**.
- Bilder werden mit `sharp` neu kodiert → EXIF/GPS-Metadaten und angehängte Fremddaten entfernt.
- Optionaler **ClamAV**-Scan (`CLAMAV_HOST`). Ohne Scanner: Status `not_scanned`; `UPLOAD_SCAN_REQUIRED=true` lehnt Uploads dann ab. Empfehlung für Produktion: ClamAV auf dem Server (eigener Dienst, Freigabe nötig).
- Ablage verschlüsselt außerhalb des Webroots; **keine Download-Route**. Zugriff nur per CLI auf dem Server (`npm run leads -- export-upload`).

## D-06 CRM-Anbindung als isolierter Adapter
- Modi `disabled` (Standard) · `mock` · `live`. `live` greift nur mit `CRM_LIVE_APPROVED=true` + Endpoint + Token, sonst automatisch `disabled`.
- Outbox-Muster: Lead wird zuerst lokal gespeichert, Übertragung danach asynchron mit Backoff (1, 5, 15, 60, 180, 720, 1440 min; max. 8 Versuche). Referenz-ID = `Idempotency-Key`.
- Bei deaktiviertem CRM erhalten Leads den Status `skipped_disabled` und werden **nicht** automatisch nachgesendet, wenn später aktiviert wird – das passiert bewusst nur per `npm run leads -- requeue --since <Datum>` (verhindert, dass Preview-Daten versehentlich ins CRM gelangen).
- Der API-Vertrag des KG-Business-CRM konnte **nicht eingesehen werden** (Zugriff auf das CRM-Repository in dieser Sitzung nicht freigegeben). Feldnamen folgen der Anforderung; Anpassung nur in `src/server/crm/mapping.ts`. Siehe `docs/CRM_INTEGRATION.md`.
- Mock-Outbox maskiert personenbezogene Felder.

## D-07 Keine Tarifpreise auf der Website
- Ohne lizenzierte Tarifdaten zeigt die Website **keine** Preise, Boni oder Ersparnisse. Modell: „Individuelles Angebot anfordern“.
- Vorbereitet: Berechnungsmodul (`src/lib/tariffs/calculate.ts`: Jahreskosten, Break-even, Ranking nach Folgejahreskosten) und `TariffProvider`-Schnittstelle (Standard: keiner).
- Der Jahreskosten-Rechner rechnet ausschließlich mit **den eigenen Rechnungswerten** der Besucher.

## D-08 Datenschutz-Architektur
- Keine Cookies, kein Tracking, keine externen Ressourcen (Schrift selbst gehostet, keine Karten/Videos). Daher kein Cookie-Banner.
- Formularentwurf im `sessionStorage` (ohne Dateien) als technisch erforderliche Speicherung nach § 25 Abs. 2 Nr. 2 TDDDG – **rechtlich bestätigen lassen** (siehe `LEGAL_REVIEW.md`).
- Datenschutzhinweis (Kenntnisnahme, Pflicht) und Werbeeinwilligungen (E-Mail / Telefon, je getrennt, freiwillig, nicht vorausgewählt) sind getrennt; Wortlaut-Version wird gespeichert (`consent_text_version`).
- Logs enthalten nie Personendaten (nur Referenzen, Status, Fehlercodes).
- Löschfristen zentral in `src/lib/retention.ts` (Leads 180 Tage, Uploads 90 Tage) – Datenschutzerklärung und Löschlauf lesen denselben Wert. **Annahme**, von KG Business zu bestätigen.

## D-09 Design
- Eigenständige visuelle Sprache: dunkles Navy, Energienetz-Grafik und Skyline als **im Code gezeichnete SVG** (keine Fremdlizenzen), Glas-Karten, ruhige Animationen mit `prefers-reduced-motion`.
- Farben: Navy `#081A40`, Corporate Blue `#123B91`, Electric Blue `#168BFF` (nur dekorativ/auf Dunkel), Links `#0B6FD8` (4,9:1), Grün `#35CD55` nur als Fläche mit Navy-Text (8,1:1), grüner Text `#147A2E`/`#0E5C22`.
- Schrift: **Plus Jakarta Sans** (variabel, selbst gehostet, SIL OFL) für Überschriften und Text – ursprünglich zusätzlich Inter; aus Performancegründen (−48 KB) auf eine Familie reduziert.
- Logo: V1-Bildmarke unverändert übernommen; Verbesserungsvorschläge separat in `docs/brand/`.
- Personenfotos aus dem V1-Repository werden sparsam eingesetzt und als **„Symbolbild“** gekennzeichnet, damit sie nicht als Mitarbeitende missverstanden werden (Herkunft/Rechte vermutlich KI-generiert – bestätigen).

## D-10 Content-Security-Policy
- `default-src 'self'`, keine externen Quellen, `frame-ancestors 'none'`, `form-action 'self'`, `object-src 'none'`.
- `script-src 'unsafe-inline'` ist nötig, weil Seiten statisch vorgerendert werden (Nonces erfordern dynamisches Rendering). Risiko gering (keine Nutzerinhalte in HTML, keine Drittskripte). Verbesserung im Backlog (Hashes/SRI).
- Zod läuft im `jitless`-Modus, damit keine `eval`-Versuche CSP-Verstöße erzeugen.

## D-11 Performance
- Statisches Prerendering aller Inhaltsseiten; nur `/api/*` dynamisch.
- `experimental.inlineCss` getestet und **verworfen** (kein LCP-Gewinn, CSS doppelt im HTML).
- Detaillierte Hero-Grafik nur im Seitenkopf; dekorative Abschnitte ohne Inline-SVG → Startseiten-HTML 86 → 39 KB (gzip).
- Ergebnis Lighthouse (mobil, simuliertes 4G): Performance 95–97, Accessibility 100, Best Practices 100; SEO 100 bei indexierbarem Build.

## D-12 SEO und Indexierung
- `SITE_ENV=preview` (Standard): `noindex` per Meta und `X-Robots-Tag`, `robots.txt` sperrt alles. Erst `SITE_ENV=production` (beim Build!) macht die Seite indexierbar.
- Keine massenhaften Stadt-Landingpages. Eine echte Standortseite (`/energieberatung-duisburg`); weitere Städte erst mit inhaltlich eigenständigem Material (Backlog).
- Ratgeber-Fakten mit Quellen und Stand-Datum; Rechtsstand wurde über Suchauszüge geprüft (Direktabruf in der Umgebung blockiert) → stichprobenartige Gegenprüfung vor Livegang.

## D-13 Annahmen (bitte bestätigen)
- Unternehmensdaten aus V1 (Inhaberin Damla Kicci, Fliederstr. 59, 47055 Duisburg, Tel. 0203 47 96 68 22, info@kg-business.de, USt-IdNr. DE325770756) sind korrekt und gelten für KG Business.
- Öffnungszeiten „Mo–Fr 09:00–18:00 Uhr“ (aus V1-Topbar).
- Beratung ist für Kunden in der Regel kostenfrei, Vergütung über Versorgerprovision (aus V1-AGB).
- Rückmeldezeit wird bewusst nicht konkret versprochen.
