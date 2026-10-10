# Recherche: Wettbewerber-UX, Rechtliche Anforderungen, Energiemarkt-Fakten

Stand: 2026-10-10 · Keine Rechtsberatung – Teil B vor Livegang anwaltlich prüfen lassen.

> **Methodische Einschränkung:** Die Netzwerkrichtlinie der Entwicklungsumgebung blockierte direkte
> Seitenabrufe (u. a. check24.de, verivox.de, gesetze-im-internet.de). Alle Angaben wurden über
> Suchmaschinen-Auszüge der zitierten Seiten geprüft. Gesetzeszitate vor Veröffentlichung gegen
> gesetze-im-internet.de stichprobenartig prüfen. „nicht verifiziert“ = nicht belastbar bestätigt.

## Teil A – Wettbewerber-UX (nur Muster, keine Übernahme von Texten/Design)

| Anbieter | Einstieg / Formular | Vertrauenselemente | SLP/RLM | Preisinformation |
|---|---|---|---|---|
| CHECK24 Gewerbestrom/-gas | Rechner im Hero: PLZ + Jahresverbrauch; Live-Tarifliste. Gas > 300.000 kWh: Verbrauch + Anzahl Verbrauchsstellen, Ausschreibung durch Berater | TÜV-Siegel, Bewertungszähler mit Zeitraum, Bestpreis-Versprechen | Strom > 100.000 kWh → Partner-Seite (individuelle Angebote) | Kleinkunden: Live-Tarife; RLM: nur Ersparnis-Claim |
| Verivox Gewerbestrom | PLZ + Verbrauch (mit Schätzhilfe); > 100.000 kWh → Formular über Partner | TÜV-Badge, Bewertungen, Auszeichnungen | Daten anonymisiert an Partner; Angebote in max. 6 Werktagen; Lastgang erst ab 2 GWh | Prozess-/Zeitversprechen statt Preise |
| stromauskunft.de (Industriestrom) | Branche → Verbrauch → optional Leistung; unverbindliche Preisschätzung vor Kontaktdaten | nicht verifiziert | ab 100.000 kWh Ausschreibung | Richtwert, dann Lead |
| Ampere AG | Unterlagen: Vorjahresrechnungen, Lastgang, aktueller Vertrag | Verbandskooperationen, Kundenzahl | Bündelmodell | Erfolgshonorar (25 % der Ersparnis) |
| wattline | Ausschreibung/Einkaufsgemeinschaft | Ersparnis-Angabe mit offengelegter Methodik | RLM/Großkunden | Erfolgshonorar |
| getenergy/procheck24 | Firma, Rechtsform, kWh/a, optional Rechnung; Zeitangaben (3 Werktage mit Lastgang, 3–6 Wochen ohne) | – | RLM-Fokus, Maklervollmacht | keine Preise |

**UX-Erkenntnisse für KG Business (umgesetzt bzw. im Backlog):**
1. Trichter früh nach Kundentyp/Größe aufteilen (Zählerart „Standard / Leistungsmessung / weiß nicht“). ✅
2. Kontaktdaten zuletzt abfragen. ✅
3. Upload optional; Hinweis auf Schwärzen von Bankdaten. ✅
4. Lastgang nur dort anfragen, wo er das Angebot ändert (RLM). ✅
5. Nur einhaltbare Service-Zusagen (Reaktionszeit offen → Murat). ⏳
6. Anzahl Lieferstellen/Standorte abfragen. ✅
7. Vertrauenssignale nur verifizierbar – keine Siegel ohne Zertifikat. ✅
8. „So verdienen wir“-Block (Provision offenlegen). ✅
9. Keine unbelegten „bis zu X %“-Claims. ✅
10. 4-Schritte-Prozess inkl. Kündigung per Vollmacht. ✅
11. Vertragsende als Anlass (Erinnerungsfunktion) → Backlog.
12. Branchen-Landingpages mit echten Unterschieden. ✅
13. Einwilligungen als UX: getrennte, nicht vorausgewählte Checkboxen je Kanal. ✅

## Teil B – Rechtliche Checkliste (Kurzfassung)

1. **Impressum § 5 DDG** (ersetzt TMG seit 14.05.2024): Name/Anschrift (bei Einzelunternehmen Vor- und Nachname der Inhaberin), schnelle elektronische Kontaktaufnahme (E-Mail + zweiter Kanal), Aufsichtsbehörde nur bei erlaubnispflichtiger Tätigkeit, Registereintrag falls vorhanden, USt-IdNr. falls vorhanden. Energievermittlung ist nach Sekundärquellen nicht erlaubnispflichtig nach §§ 34c/d/f GewO (Gewerbeanzeige genügt) – **bei der Niederrheinischen IHK bestätigen**. Ratgeber → Verantwortliche Person nach **§ 18 Abs. 2 MStV** angeben.
2. **TDDDG § 25:** Speichern/Auslesen auf Endgeräten nur mit Einwilligung, außer unbedingt erforderlich. Google Fonts selbst hosten (LG München I, 3 O 17493/20). Karten/Videos nur nach Einwilligung. Banner: „Ablehnen“ gleichwertig auf erster Ebene.
3. **DSGVO:** Anfrage/Angebotseinholung Art. 6 Abs. 1 lit. b; Werbung nur mit gesonderter Einwilligung (lit. a), getrennte Checkboxen je Kanal; Art.-13-Informationen am Formular; Rechnungsupload: Datenminimierung (Bankdaten schwärzen), Verschlüsselung, Virenscan, Löschkonzept (z. B. 6 Monate für nicht konvertierte Anfragen, dokumentiert). **§ 7 UWG:** Telefonwerbung Verbraucher nur mit ausdrücklicher, B2B mit mindestens mutmaßlicher Einwilligung; E-Mail-Werbung auch B2B nur mit Einwilligung; **§ 7a UWG** Dokumentation 5 Jahre; DOI ohne Werbung in der Bestätigungsmail. Aufbewahrung: Geschäftsbriefe 6 Jahre, Buchungsbelege 8 Jahre (seit 2025). AVV mit Hetzner und weiteren Auftragsverarbeitern.
4. **VSBG § 36:** Ausnahme bei ≤ 10 Beschäftigten; freiwillige Erklärung unschädlich. **EU-OS-Plattform am 20.07.2025 eingestellt** (VO (EU) 2024/3228) → Link entfernen.
5. **BFSG** (seit 28.06.2025): Kleinstunternehmen (< 10 Beschäftigte und ≤ 2 Mio. € Umsatz) für Dienstleistungen ausgenommen – Begründung dokumentieren; trotzdem WCAG 2.2 AA anstreben.
6. **PAngV:** Gegenüber Verbrauchern Gesamtpreise inkl. USt.; § 14 PAngV für Energie. Website zeigt keine Preise → derzeit nicht einschlägig.
7. **Marken/Claims:** Versorgernamen beschreibend nennen ist risikoarm; Logos nur mit schriftlicher Erlaubnis; kein „offizieller Partner“ ohne Grundlage. Provision ist wesentliche Information (BGH I ZR 55/16) → offenlegen. Nicht „Vergleichsportal“ nennen, nicht „unabhängig“ ohne Grundlage, nicht „werbefrei“. **Green Claims:** UWG-Novelle (EmpCo) gilt ab **27.09.2026** – keine generischen Umweltaussagen („umweltfreundlich“, „klimaneutral“).

## Teil C – Energiemarkt-Fakten (für Ratgeber)

- **SLP/RLM:** StromNZV und GasNZV sind zum **31.12.2025 ausgelaufen** (Nachfolge: BNetzA-Festlegungen). Formulierung: „in der Regel bis ca. 100.000 kWh/a Standardlastprofil, darüber registrierende Leistungsmessung“ (Strom); Gas bisher 1,5 Mio. kWh/a bzw. 500 kWh/h. **Haushaltskunde (§ 3 Nr. 22 EnWG)** umfasst auch Gewerbe bis 10.000 kWh/a.
- **Strompreisbestandteile 2026:** Beschaffung/Vertrieb, Netzentgelte (bei RLM inkl. Leistungspreis), Messstellenbetrieb, Konzessionsabgabe (Sondervertrag max. 0,11 ct/kWh), Umlagen 2026: KWKG 0,446 · Offshore 0,941 · Aufschlag für besondere Netznutzung 1,559 ct/kWh (Kat. A′), Stromsteuer 2,05 ct/kWh (Produzierendes Gewerbe/Land- und Forstwirtschaft auf Antrag dauerhaft 0,05 ct/kWh ab 2026), USt 19 %. EEG-Umlage seit 07/2022 null. 2026: Bundeszuschuss 6,5 Mrd. € zu Übertragungsnetzkosten (§ 24c EnWG).
- **Gas 2026:** Energiesteuer 0,55 ct/kWh, CO₂-Preis 55–65 €/t (Korridor), Gasspeicherumlage seit 01.01.2026 abgeschafft, Konzessionsabgabe Sondervertrag max. 0,03 ct/kWh, USt 19 %.
- **Definitionen:** Arbeitspreis (ct/kWh), Grundpreis (fix je Monat/Jahr), Leistungspreis (€/kW auf Höchstleistung, RLM).
- **Kündigung:** Grundversorgung 2 Wochen (§ 20 StromGVV/GasGVV); Verbraucher-Sonderverträge seit 01.03.2022: nach Erstlaufzeit nur unbefristete Verlängerung mit max. 1 Monat Kündigungsfrist (§ 309 Nr. 9 BGB); § 41b EnWG Textform; Preisänderung: Mitteilung 1 Monat (Haushalt) / 2 Wochen (andere), Sonderkündigungsrecht § 41 Abs. 5 EnWG. B2B frei verhandelbar.
- **Wechsel:** Strom technisch binnen 24 Stunden an Werktagen (§ 20a EnWG, umgesetzt seit 06.06.2025); vertragliche Fristen gelten weiter; Kündigung meist durch neuen Lieferanten per Vollmacht. Gas: 24-h-Wechsel Start nicht verifiziert.
- **Preisgarantie:** keine gesetzliche Definition; VZ NRW: umfassend / eingeschränkt / stark eingeschränkt.

Vollständige Quellenliste: siehe Subagent-Bericht vom 2026-10-10 (in `docs/research/sources.md`).
