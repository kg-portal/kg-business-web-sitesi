import type { Article } from "../types";

export const gewerbestromVerstehen: Article = {
  slug: "gewerbestrom-verstehen",
  title: "Gewerbestrom verstehen: Was Unternehmen über ihren Stromvertrag wissen sollten",
  metaTitle: "Gewerbestrom verstehen – Messung, Preisbestandteile & Verträge 2026",
  description:
    "Was ist Gewerbestrom, wann gilt Standardlastprofil oder Leistungsmessung, und woraus setzt sich der Strompreis 2026 zusammen? Ein verständlicher Überblick für Unternehmen.",
  excerpt: "Standardlastprofil oder Leistungsmessung, Umlagen, Stromsteuer und Vertragsfreiheit – die Grundlagen für Unternehmen.",
  category: "Gewerbe",
  readingMinutes: 7,
  published: "2026-10-10",
  updated: "2026-10-10",
  blocks: [
    {
      type: "p",
      text: "„Gewerbestrom“ ist kein eigener Rechtsbegriff. Gemeint ist Strom, den ein Unternehmen für seinen Betrieb bezieht – im Büro, in der Werkstatt, im Laden oder in der Produktion. Physikalisch ist es derselbe Strom wie im Haushalt. Unterschiede gibt es bei **Verbrauchsmenge, Messung, Preisbestandteilen und Vertragsgestaltung**.",
    },
    { type: "h2", id: "haushaltskunde", text: "Kleine Betriebe sind rechtlich oft „Haushaltskunden“" },
    {
      type: "p",
      text: "Das Energiewirtschaftsgesetz zählt auch Unternehmen zu den Haushaltskunden, wenn ihr Jahresverbrauch für berufliche oder gewerbliche Zwecke **10.000 kWh nicht übersteigt** (§ 3 Nr. 22 EnWG). Für sie gelten bestimmte Schutzvorschriften des EnWG, etwa zur Textform von Verträgen. Größere Gewerbekunden verhandeln ihre Verträge dagegen weitgehend frei.",
    },
    { type: "h2", id: "slp-rlm", text: "Standardlastprofil (SLP) oder Leistungsmessung (RLM)?" },
    {
      type: "p",
      text: "Wie Ihr Verbrauch gemessen wird, hat großen Einfluss auf Abrechnung und Angebot. Kleinere Abnahmestellen werden über ein **Standardlastprofil** abgerechnet: Der Netzbetreiber unterstellt einen typischen Verbrauchsverlauf, gemessen wird nur die Gesamtmenge. Bei größeren Abnahmestellen erfolgt eine **registrierende Leistungsmessung (RLM)** – der Verbrauch wird viertelstündlich erfasst.",
    },
    {
      type: "ul",
      items: [
        "**In der Regel bis ca. 100.000 kWh pro Jahr:** Standardlastprofil (SLP)",
        "**Darüber:** registrierende Leistungsmessung mit Viertelstundenwerten (Lastgang)",
        "Bei RLM-Zählern fällt zusätzlich ein **Leistungspreis** auf die höchste in Anspruch genommene Leistung an",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Rechtsgrundlage hat sich geändert",
      text: "Die bisher maßgebliche Stromnetzzugangsverordnung (StromNZV) ist Ende 2025 ausgelaufen; die Regeln ergeben sich seitdem aus Festlegungen der Bundesnetzagentur. Für Ihre Abnahmestelle ist entscheidend, welches Messkonzept Ihr Netzbetreiber anwendet – das steht auf Ihrer Rechnung.",
    },
    { type: "h2", id: "preisbestandteile", text: "Woraus sich der Strompreis 2026 zusammensetzt" },
    {
      type: "p",
      text: "Nur ein Teil des Strompreises ist im Wettbewerb verhandelbar: **Energiebeschaffung, Vertrieb und Marge** des Lieferanten. Der Rest sind Netzentgelte, Abgaben, Umlagen und Steuern, die für alle Lieferanten im selben Netzgebiet gleich sind.",
    },
    {
      type: "table",
      caption: "Staatlich veranlasste und regulierte Preisbestandteile Strom (Stand 2026, netto)",
      head: ["Bestandteil", "Höhe 2026", "Hinweis"],
      rows: [
        ["Netzentgelte", "netzgebietsabhängig", "Bei RLM inkl. Leistungspreis; 2026 Bundeszuschuss zu den Übertragungsnetzkosten"],
        ["Messstellenbetrieb", "zählerabhängig", "Preisobergrenzen für moderne Messeinrichtungen und Smart Meter"],
        ["Konzessionsabgabe", "max. 0,11 ct/kWh", "für Sondervertragskunden (§ 2 KAV)"],
        ["KWKG-Umlage", "0,446 ct/kWh", "2025: 0,277 ct/kWh"],
        ["Offshore-Netzumlage", "0,941 ct/kWh", "2025: 0,816 ct/kWh"],
        ["Aufschlag für besondere Netznutzung", "1,559 ct/kWh", "Kategorie A′; ermäßigt ab 1 GWh Verbrauch"],
        ["Stromsteuer", "2,05 ct/kWh", "Entlastung für Produzierendes Gewerbe auf Antrag (s. u.)"],
        ["EEG-Umlage", "0 ct/kWh", "seit Juli 2022 entfallen"],
        ["Umsatzsteuer", "19 %", "auf den Gesamtbetrag"],
      ],
      note: "Umlagewerte laut Veröffentlichung der Übertragungsnetzbetreiber für 2026. Angaben ohne Gewähr.",
    },
    { type: "h2", id: "stromsteuer", text: "Stromsteuer: Entlastung nur für bestimmte Branchen" },
    {
      type: "p",
      text: "Seit 2026 können Unternehmen des **Produzierenden Gewerbes sowie der Land- und Forstwirtschaft** dauerhaft eine Entlastung beantragen, durch die die Stromsteuer effektiv auf den europäischen Mindestsatz von 0,05 ct/kWh sinkt. Die Entlastung wird **nicht automatisch** gewährt, sondern elektronisch beim zuständigen Hauptzollamt beantragt. Für Handel, Dienstleistungen, Büros und Haushalte gilt sie nicht.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Steuerliche Fragen",
      text: "Ob Ihr Unternehmen entlastungsberechtigt ist, klärt Ihre Steuerberatung. Wir weisen im Gespräch darauf hin, wenn eine Prüfung sinnvoll erscheint.",
    },
    { type: "h2", id: "vertrag", text: "Was einen guten Gewerbestromvertrag ausmacht" },
    {
      type: "ul",
      items: [
        "**Passende Preisstruktur:** Arbeits- und Grundpreis im Verhältnis zu Ihrem tatsächlichen Verbrauch – siehe [Arbeitspreis und Grundpreis](/ratgeber/arbeitspreis-grundpreis)",
        "**Klar definierte Preisgarantie:** Welche Bestandteile sind wirklich fest, welche werden durchgereicht?",
        "**Laufzeit und Verlängerung:** Was passiert nach Ablauf – und bis wann muss gekündigt werden? Siehe [Kündigungsfristen](/ratgeber/kuendigungsfristen)",
        "**Messkonzept berücksichtigt:** Bei RLM gehören Lastgang und Leistungspreis in die Bewertung",
        "**Alle Lieferstellen im Blick:** Mehrere Standorte mit unterschiedlichen Vertragsenden sind eine häufige Kostenfalle",
      ],
    },
    {
      type: "p",
      text: "Sie möchten wissen, wie Ihr aktueller Vertrag einzuordnen ist? Im [kostenlosen Energie-Check](/energie-check) prüfen wir Ihre Unterlagen und holen passende Angebote ein.",
    },
  ],
  sources: [
    { label: "Bundesnetzagentur – Netzentgelt (Glossar)", url: "https://www.bundesnetzagentur.de/SharedDocs/A_Z_Glossar/N/Netzentgelt.html" },
    { label: "Konzessionsabgabenverordnung § 2", url: "https://www.gesetze-im-internet.de/kav/__2.html" },
    { label: "Netztransparenz – EEG-Finanzierung", url: "https://www.netztransparenz.de/de-de/Erneuerbare-Energien-und-Umlagen/EEG/EEG-Finanzierung" },
    { label: "IHK Lippe zu Detmold – Strompreis-Umlagen", url: "https://www.ihk.de/lippe-detmold/hauptnavigation/beraten-und-informieren/energie/strompreis-umlagen-4208854" },
    { label: "Grant Thornton – Änderungen im Energie- und Stromsteuerrecht 2026", url: "https://www.grantthornton.de/themen/2025/anderungen-im-energie--und-stromsteuerrecht-zum-1.-januar-2026" },
    { label: "Bundesregierung – Neuregelungen Januar 2026", url: "https://www.bundesregierung.de/breg-de/aktuelles/gesetzliche-neuregelungen-januar-2026-2399838" },
  ],
  related: ["arbeitspreis-grundpreis", "energieverbrauch-unternehmen", "anbieterwechsel"],
  faq: [
    {
      question: "Ab wann ist ein Unternehmen RLM-Kunde?",
      answer: "In der Regel ab einem Jahresverbrauch von etwa 100.000 kWh Strom. Maßgeblich ist das Messkonzept Ihres Netzbetreibers, das auf Ihrer Rechnung angegeben ist.",
    },
    {
      question: "Gilt die Stromsteuer-Entlastung für alle Unternehmen?",
      answer: "Nein. Die dauerhafte Entlastung auf das EU-Mindestniveau gilt für das Produzierende Gewerbe sowie die Land- und Forstwirtschaft und muss beim Hauptzollamt beantragt werden.",
    },
  ],
};
