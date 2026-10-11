import type { Article } from "../types";

export const energieverbrauchUnternehmen: Article = {
  slug: "energieverbrauch-unternehmen",
  title: "Energieverbrauch im Unternehmen verstehen und gezielt senken",
  metaTitle: "Energieverbrauch im Unternehmen analysieren – Grundlast, Lastgang, Maßnahmen",
  description:
    "Grundlast, Lastspitzen, Lastgang und Smart Meter: Wie Unternehmen ihren Strom- und Gasverbrauch verstehen und mit einfachen Schritten beeinflussen können.",
  excerpt: "Grundlast, Lastspitzen und Lastgang: So finden Sie heraus, wo Ihr Betrieb Energie verbraucht.",
  category: "Gewerbe",
  readingMinutes: 6,
  published: "2026-10-10",
  updated: "2026-10-10",
  blocks: [
    {
      type: "p",
      text: "Der günstigste Vertrag ist nur die halbe Miete. Wer weiß, **wann und wofür** im Betrieb Energie verbraucht wird, kann Kosten dauerhaft beeinflussen – und erhält zudem passendere Angebote.",
    },
    { type: "h2", id: "grundlast", text: "Grundlast und Spitzenlast" },
    {
      type: "ul",
      items: [
        "**Grundlast:** der Verbrauch, der immer anfällt – auch nachts und am Wochenende. Typisch: Kühlung, Server, Lüftung, Geräte im Stand-by.",
        "**Spitzenlast:** kurze Phasen mit hohem Leistungsbedarf, etwa wenn Maschinen, Küche oder Klimaanlage gleichzeitig laufen.",
      ],
    },
    {
      type: "p",
      text: "Eine hohe Grundlast außerhalb der Betriebszeiten ist oft ein Hinweis auf Geräte, die unnötig laufen. Spitzenlasten sind vor allem bei leistungsgemessenen Zählern relevant, weil sie den Leistungspreis bestimmen.",
    },
    { type: "h2", id: "daten", text: "Welche Daten Sie bereits haben" },
    {
      type: "ol",
      items: [
        "**Jahresrechnungen der letzten drei Jahre** – zeigen Entwicklung und Ausreißer.",
        "**Lastgang** bei RLM-Zählern – Viertelstundenwerte, die Ihr Messstellenbetreiber oder Lieferant bereitstellen kann.",
        "**Smart-Meter-Daten** – sofern ein intelligentes Messsystem verbaut ist.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Smart-Meter-Rollout",
      text: "Ab einem Jahresverbrauch von 6.000 kWh ist der Einbau eines intelligenten Messsystems Pflicht. Für die Kosten gelten gesetzliche Preisobergrenzen. Den Zeitpunkt des Einbaus bestimmt Ihr Messstellenbetreiber.",
    },
    { type: "h2", id: "massnahmen", text: "Erste Maßnahmen mit wenig Aufwand" },
    {
      type: "ul",
      items: [
        "**Zeitsteuerung:** Beleuchtung, Lüftung und Heizung an tatsächliche Betriebszeiten koppeln",
        "**Druckluft prüfen:** Leckagen in Druckluftsystemen sind ein häufiger und unauffälliger Verbraucher",
        "**Kühlung:** Türdichtungen, Abtauzyklen und Standort von Kühlgeräten kontrollieren",
        "**Anlaufzeiten staffeln:** Maschinen nicht alle gleichzeitig einschalten, um Lastspitzen zu vermeiden",
        "**Beleuchtung modernisieren:** Austausch alter Leuchtmittel und bedarfsgerechte Steuerung",
      ],
    },
    { type: "h2", id: "pflichten", text: "Zusätzliche Pflichten bei hohem Verbrauch" },
    {
      type: "p",
      text: "Für Unternehmen mit sehr hohem Energieverbrauch können gesetzliche Pflichten etwa zu Energieaudits oder Energiemanagementsystemen bestehen. Ob und welche Pflichten für Sie gelten, sollte mit einer qualifizierten Fachberatung geklärt werden.",
    },
    {
      type: "p",
      text: "Ihr Verbrauchsprofil ist auch die Grundlage für passende Lieferangebote. Senden Sie uns Rechnung oder Lastgang über den [Energie-Check](/energie-check) – wir berücksichtigen beides im Vergleich.",
    },
  ],
  sources: [
    { label: "Bundesnetzagentur – Ablauf des Smart-Meter-Rollouts", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/Metering/_faq/Ablauf_RollOut_table.html" },
    { label: "Bundesnetzagentur – Netzentgelt (Glossar)", url: "https://www.bundesnetzagentur.de/SharedDocs/A_Z_Glossar/N/Netzentgelt.html" },
  ],
  related: ["gewerbestrom-verstehen", "arbeitspreis-grundpreis", "gewerbegas-verstehen"],
};
