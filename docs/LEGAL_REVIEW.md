# Rechtliche Prüfpunkte vor dem Livegang

> Keine Rechtsberatung. Die Texte wurden nach bestem Wissen erstellt; die markierten Punkte müssen von KG Business bestätigt bzw. anwaltlich geprüft werden.
> Im Vorschau-Build sind offene Punkte direkt auf den Seiten als gelbe **„Prüfhinweis“**-Boxen sichtbar (im Production-Build automatisch ausgeblendet).

## A. Unternehmensangaben (`src/content/company.ts`)
| Angabe | Wert | Quelle | Status |
|---|---|---|---|
| Firmierung | KG-BUSINESS | V1-Impressum | zu bestätigen |
| Rechtsform | Einzelunternehmen | Annahme aus „Inh.“ | zu bestätigen |
| Inhaberin | Damla Kicci | V1-Impressum | zu bestätigen |
| Anschrift | Fliederstr. 59, 47055 Duisburg | V1-Impressum | zu bestätigen |
| Telefon | +49 203 47 96 68 22 | V1 | zu bestätigen – laut Suchergebnissen auch von „KG-Gebäudereinigung“ genutzt |
| E-Mail | info@kg-business.de | V1 | zu bestätigen |
| USt-IdNr. | DE325770756 | V1 | zu bestätigen (gehört sie zu diesem Unternehmen/dieser Tätigkeit?) |
| Handelsregister | – | – | offen (nur falls eingetragen) |
| Öffnungszeiten | Mo–Fr 09:00–18:00 | V1-Topbar | zu bestätigen |

## B. Impressum (`/impressum`)
- [ ] § 5 DDG-Angaben vollständig (siehe A)
- [ ] Verantwortliche Person nach § 18 Abs. 2 MStV (Ratgeber) – derzeit Inhaberin eingetragen
- [ ] Erklärung zur Verbraucherstreitbeilegung (§ 36 VSBG) bestätigen; **kein OS-Plattform-Link** (Plattform seit 20.07.2025 eingestellt)
- [ ] Bei der Niederrheinischen IHK bestätigen: Energievermittlung ohne Erlaubnis nach §§ 34c/d/f GewO
- [ ] Bildnachweise: Herkunft/Rechte der Symbolbilder

## C. Datenschutzerklärung (`/datenschutz`)
- [ ] Hosting-Anbieter und AV-Vertrag (Hetzner) – erst nach Einrichtung
- [ ] Log-Aufbewahrung des Reverse Proxys (Text: 14 Tage) mit tatsächlicher Konfiguration abgleichen
- [ ] Empfänger: CRM (Standort/Auftragsverarbeiter), E-Mail-Postfach, ggf. Versorger namentlich oder als Kategorie
- [ ] Datenschutzbeauftragter nicht erforderlich? (§ 38 BDSG)
- [ ] Löschfristen 180 Tage (Anfragen) / 90 Tage (Uploads) fachlich bestätigen
- [ ] Werbeeinwilligungen: Double-Opt-in-Verfahren festlegen, bevor E-Mail-Werbung versendet wird (Bestätigungsmail ohne Werbung)
- [ ] sessionStorage für Formularentwurf als „unbedingt erforderlich“ (§ 25 Abs. 2 Nr. 2 TDDDG) bestätigen
- [ ] Gesamttext anwaltlich/datenschutzfachlich prüfen

## D. AGB (`/agb`)
- [ ] Werden AGB tatsächlich verwendet? Text inhaltlich aus V1 übernommen
- [ ] Vollmacht für Kündigung/Wechsel (wird im Prozess erwähnt) – Musterformular und Regelung
- [ ] Haftung, Verbraucherinformationen, Widerruf bei Fernabsatz-Beratungsvertrag prüfen

## E. Werbe- und Wettbewerbsrecht (UWG)
- [ ] Aussage „für Sie in der Regel kostenfrei“ + Offenlegung der Provision (BGH I ZR 55/16) – inhaltlich korrekt?
- [ ] Keine Aussage „unabhängig“/„Vergleichsportal“ verwendet ✔ – so beibehalten
- [ ] Versorgernamen nur beschreibend; Logos nur mit schriftlicher Erlaubnis
- [ ] Keine generischen Umweltaussagen (UWG-Novelle ab 27.09.2026) ✔
- [ ] Ratgeber: Hinweis „keine Rechts-/Steuerberatung“ vorhanden ✔; Fakten mit Quellen – vor Livegang stichprobenartig gegen gesetze-im-internet.de prüfen

## F. Barrierefreiheit (BFSG)
- Voraussichtlich Kleinstunternehmen-Ausnahme (< 10 Beschäftigte, ≤ 2 Mio. € Umsatz) – **Begründung dokumentieren**.
- Website wurde trotzdem auf WCAG 2.2 AA ausgelegt (axe-Tests ohne Verstöße, Lighthouse Accessibility 100).

## G. Ratgeber-Fakten (Stand Oktober 2026)
Quellen: `docs/research/`. Recherche erfolgte über Suchmaschinen-Auszüge, da Direktabrufe in der Entwicklungsumgebung blockiert waren. Vor Veröffentlichung insbesondere prüfen: Umlagenwerte 2026, Stromsteuer-Entlastung, Auslaufen StromNZV/GasNZV, 24-h-Lieferantenwechsel, § 41a EnWG (Festpreisangebot).
