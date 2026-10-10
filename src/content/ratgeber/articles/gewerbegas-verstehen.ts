import type { Article } from "../types";

export const gewerbegasVerstehen: Article = {
  slug: "gewerbegas-verstehen",
  title: "Gewerbegas verstehen: Verbrauch, Preisbestandteile und Verträge",
  metaTitle: "Gewerbegas verstehen – Preisbestandteile, CO₂-Preis & Verträge 2026",
  description:
    "Wie Gas abgerechnet wird, welche Steuern und Abgaben 2026 gelten und worauf Unternehmen bei Gasverträgen achten sollten – kompakt erklärt.",
  excerpt: "Von Kubikmetern zu Kilowattstunden, CO₂-Preis und Energiesteuer: So setzt sich der Gaspreis für Unternehmen zusammen.",
  category: "Gewerbe",
  readingMinutes: 6,
  published: "2026-10-10",
  updated: "2026-10-10",
  blocks: [
    {
      type: "p",
      text: "Gas wird im Gewerbe vor allem für **Heizung, Warmwasser und Prozesswärme** eingesetzt – vom Gasherd im Restaurant bis zum Trockenofen in der Produktion. Weil der Verbrauch stark von Witterung und Auslastung abhängt, sind bei Gasverträgen Laufzeit und Preisgarantie besonders wichtig.",
    },
    { type: "h2", id: "kwh", text: "Vom Kubikmeter zur Kilowattstunde" },
    {
      type: "p",
      text: "Ihr Gaszähler misst das Volumen in Kubikmetern (m³). Abgerechnet wird jedoch in Kilowattstunden. Die Umrechnung erfolgt mit zwei Werten, die auf Ihrer Rechnung stehen: dem **Brennwert** (Energiegehalt des Gases) und der **Zustandszahl** (Druck und Temperatur am Zähler).",
    },
    { type: "p", text: "**Verbrauch in kWh = Verbrauch in m³ × Zustandszahl × Brennwert**" },
    { type: "h2", id: "messung", text: "Standardlastprofil oder Leistungsmessung" },
    {
      type: "p",
      text: "Wie beim Strom werden kleinere Gasabnahmestellen über ein Standardlastprofil abgerechnet, große Verbraucher stündlich gemessen. Nach der bis Ende 2025 geltenden Gasnetzzugangsverordnung lag die Grenze bei **1,5 Mio. kWh pro Jahr bzw. 500 kWh pro Stunde**. Seit 2026 ergeben sich die Regeln aus Festlegungen der Bundesnetzagentur; maßgeblich ist das Messkonzept Ihres Netzbetreibers.",
    },
    { type: "h2", id: "preisbestandteile", text: "Preisbestandteile beim Gas 2026" },
    {
      type: "table",
      caption: "Wesentliche Bestandteile des Gaspreises (Stand 2026, netto)",
      head: ["Bestandteil", "Höhe 2026", "Hinweis"],
      rows: [
        ["Beschaffung, Vertrieb, Marge", "anbieterabhängig", "der im Wettbewerb verhandelbare Teil"],
        ["Netzentgelte", "netzgebietsabhängig", "2026 in vielen Netzgebieten gestiegen"],
        ["Messstellenbetrieb", "zählerabhängig", "–"],
        ["Konzessionsabgabe", "max. 0,03 ct/kWh", "für Sondervertragskunden"],
        ["Energiesteuer (Heizgas)", "0,55 ct/kWh", "§ 2 EnergieStG"],
        ["CO₂-Preis (BEHG)", "Preiskorridor 55–65 €/t", "je nach Kalkulation rund 1,0–1,2 ct/kWh netto"],
        ["Gasspeicherumlage", "entfallen", "seit 1. Januar 2026 abgeschafft"],
        ["Umsatzsteuer", "19 %", "seit 1. April 2024 wieder Regelsatz"],
      ],
      note: "Angaben ohne Gewähr. Die konkrete Höhe des CO₂-Kostenanteils hängt von Emissionsfaktor und Abrechnungsbasis des Lieferanten ab.",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Wegfall der Gasspeicherumlage",
      text: "Die Abschaffung der Gasspeicherumlage ist eine Senkung staatlich veranlasster Bestandteile. Lieferanten müssen solche Senkungen bei der nächsten Preisanpassung berücksichtigen. Ein Sonderkündigungsrecht entsteht durch eine Preissenkung nicht.",
    },
    { type: "h2", id: "vertrag", text: "Worauf es beim Gewerbegasvertrag ankommt" },
    {
      type: "ul",
      items: [
        "**Preisgarantie über die Heizperiode:** Gerade bei hohem Winterverbrauch ist entscheidend, welche Preisbestandteile garantiert sind",
        "**CO₂-Kosten transparent:** Wird der CO₂-Preis gesondert ausgewiesen oder ist er im Arbeitspreis enthalten?",
        "**Abschläge realistisch:** Zu hohe Abschläge binden Liquidität, zu niedrige führen zu Nachzahlungen",
        "**Laufzeit passend zur Nutzung:** Pachtverträge, Umbauten oder geplante Heizungswechsel berücksichtigen",
      ],
    },
    {
      type: "p",
      text: "Mehr zu Gasverträgen für Unternehmen finden Sie auf unserer Seite [Gewerbegas](/gewerbegas). Für eine konkrete Einschätzung starten Sie den [Energie-Check](/energie-check?energie=gas).",
    },
  ],
  sources: [
    { label: "Bundesregierung – Abschaffung der Gasspeicherumlage", url: "https://www.bundesregierung.de/breg-de/aktuelles/abschaffung-gasspeicherumlage-2375074" },
    { label: "DEHSt – nEHS Versteigerung ab 2026", url: "https://www.dehst.de/SharedDocs/FAQ/DE/nehs/063-nEHS-versteigerung-ab-2026.html" },
    { label: "Verbraucherzentrale – Das ändert sich 2026", url: "https://www.verbraucherzentrale.de/neues-jahr-neue-gesetze-das-aendert-sich-im-jahr-2026-113872" },
    { label: "Konzessionsabgabenverordnung § 2", url: "https://www.gesetze-im-internet.de/kav/__2.html" },
    { label: "Bundesnetzagentur – Preiserhöhungen", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/Preiserhoehungen/artikel.html" },
  ],
  related: ["gewerbestrom-verstehen", "vertragslaufzeiten", "stromrechnung-lesen"],
  faq: [
    {
      question: "Warum steht auf meiner Gasrechnung kWh, obwohl der Zähler m³ misst?",
      answer: "Abgerechnet wird der Energiegehalt. Dazu wird das gemessene Volumen mit Zustandszahl und Brennwert in Kilowattstunden umgerechnet. Beide Werte stehen auf der Rechnung.",
    },
  ],
};
