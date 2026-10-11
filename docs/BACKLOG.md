# Backlog (priorisiert)

## Hoch
- **Interne Lead-Übersicht** (passwortgeschützt, z. B. hinter Basic-Auth/IP-Freigabe) als Alternative zur CLI, solange das CRM nicht angebunden ist – nur nach Abstimmung (zusätzliche Angriffsfläche).
- **Datei-Übergabe an das CRM** nach Klärung des API-Vertrags (nur virengeprüfte Dateien).
- **ClamAV in Produktion** und `UPLOAD_SCAN_REQUIRED=true`.
- **Vertragsende-Erinnerung** als freiwillige Option im Energie-Check (Einwilligung, Double-Opt-in) – starker Kundennutzen im B2B.
- **Lastgang-Upload** (CSV/XLSX) für RLM-Kunden – XLSX nur mit strenger Prüfung (ZIP-Struktur, keine Makros).

## Mittel
- Mobiles LCP unter 2,5 s (simuliert): Icon-Registry für Client-Komponenten verkleinern, Client-JavaScript weiter reduzieren, Schrift-Subset prüfen.
- CSP ohne `'unsafe-inline'` für Skripte (Hashes/SRI oder Nonces mit dynamischem Rendering abwägen).
- Rate-Limit/Jobs für mehrere Instanzen (gemeinsamer Speicher) – nur falls skaliert wird.
- Echte Kundenstimmen mit Einwilligung und nachvollziehbarer Quelle (§ 5b Abs. 3 UWG) in `src/content/about.ts`.
- Namentliche Ansprechpartner mit Foto (Einwilligung) auf „Über uns“ – stärkt Vertrauen mehr als Symbolbilder.
- Stadtseiten (Düsseldorf, Essen, …) **nur** mit eigenständigem lokalem Inhalt.
- Weitere Ratgeber-Themen: Smart Meter & Messstellenbetrieb, Stromsteuer-Entlastung (Antrag), Netzentgelte 2027 (AgNes-Reform), Ersatz-/Grundversorgung nach Übernahme eines Betriebs.
- Tarifdaten-Anbindung über `TariffProvider`, falls lizenzierte Quelle vorhanden (Preise für Privatkunden brutto, PAngV).

## Niedrig
- Englische Sprachversion (falls Zielgruppe vorhanden)
- Privacy-freundliche Reichweitenmessung ohne Endgerätezugriff (z. B. serverseitige, aggregierte Logauswertung) – Datenschutzerklärung anpassen
- Safari/Firefox in die E2E-Matrix aufnehmen
- Visuelle Regressionstests (Screenshot-Vergleich)
- Dev-Abhängigkeit: `braces`-Schwachstelle in ESLint-Toolchain (nur Entwicklung) – mit nächstem `eslint-config-next`-Update beheben
