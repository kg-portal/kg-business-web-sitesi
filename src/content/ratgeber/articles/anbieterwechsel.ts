import type { Article } from "../types";

export const anbieterwechsel: Article = {
  slug: "anbieterwechsel",
  title: "Anbieterwechsel bei Strom und Gas: Ablauf, Dauer und Sicherheit",
  metaTitle: "Strom- und Gasanbieter wechseln – Ablauf, 24-Stunden-Wechsel & Tipps",
  description:
    "Wie ein Anbieterwechsel bei Strom und Gas abläuft, wer kündigt, wie lange es dauert und warum die Versorgung nicht unterbrochen wird – Schritt für Schritt erklärt.",
  excerpt: "Schritt für Schritt: Wer kündigt, wie lange es dauert und warum der Strom beim Wechsel nicht ausfällt.",
  category: "Wechsel",
  readingMinutes: 6,
  published: "2026-10-10",
  updated: "2026-10-10",
  blocks: [
    {
      type: "p",
      text: "Viele Unternehmen und Haushalte bleiben jahrelang beim selben Versorger – oft aus Sorge vor Aufwand oder Versorgungslücken. Beides ist unbegründet: Der Wechsel ist ein standardisierter Prozess, und die **physische Versorgung läuft unverändert weiter**.",
    },
    { type: "h2", id: "sicherheit", text: "Warum beim Wechsel nichts ausfällt" },
    {
      type: "p",
      text: "Strom und Gas kommen immer über das Netz Ihres örtlichen Netzbetreibers. Beim Anbieterwechsel ändert sich nur, **wer Ihnen die Energie in Rechnung stellt** – nicht die Leitung, nicht der Zähler. Sollte es bei einem Lieferanten zu Problemen kommen, sichert die Ersatz- bzw. Grundversorgung die Belieferung ab.",
    },
    { type: "h2", id: "ablauf", text: "Der Ablauf in sieben Schritten" },
    {
      type: "ol",
      items: [
        "**Unterlagen zusammenstellen:** letzte Jahresrechnung mit Zählernummer, Marktlokation, Verbrauch und Vertragsende.",
        "**Angebote vergleichen:** Preisstruktur, Laufzeit, Preisgarantie und Kündigungsbedingungen bewerten.",
        "**Vertrag mit dem neuen Lieferanten schließen:** in Textform; der Vertrag kommt direkt zwischen Ihnen und dem Lieferanten zustande.",
        "**Kündigung des alten Vertrags:** meist durch den neuen Lieferanten mit Ihrer Vollmacht – oder durch Sie selbst.",
        "**Bestätigung abwarten:** Der neue Lieferant bestätigt den Lieferbeginn in Textform.",
        "**Zählerstand zum Wechseltag festhalten:** am besten mit Foto und Datum.",
        "**Schlussrechnung prüfen:** Der bisherige Versorger rechnet bis zum Wechseltag ab.",
      ],
    },
    { type: "h2", id: "dauer", text: "Wie lange dauert der Wechsel?" },
    {
      type: "p",
      text: "Beim Strom ist der **technische Lieferantenwechsel seit dem 6. Juni 2025 innerhalb von 24 Stunden** an Werktagen möglich (§ 20a EnWG). Das heißt aber nicht, dass Sie jeden Vertrag sofort verlassen können: **Vertragliche Laufzeiten und Kündigungsfristen gelten weiterhin.** Ein rückwirkender Wechsel ist nicht möglich.",
    },
    {
      type: "p",
      text: "Für Gas wird der beschleunigte Wechselprozess separat umgesetzt. Den konkreten Lieferbeginn nennt Ihnen der neue Lieferant in seiner Bestätigung.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Gewerbekunden mit Leistungsmessung",
      text: "Bei RLM-Zählern holen Lieferanten für ein belastbares Angebot häufig den Lastgang ein. Liegt er Ihnen bereits vor, beschleunigt das die Angebotserstellung deutlich.",
    },
    { type: "h2", id: "kosten", text: "Kostet der Wechsel etwas?" },
    {
      type: "p",
      text: "Für Haushaltskunden ist der Lieferantenwechsel kostenfrei; Wechselentgelte sind nicht zulässig. Auch bei Gewerbekunden fallen für den Wechselprozess selbst in der Regel keine Gebühren an – entscheidend sind die Konditionen des neuen Vertrags.",
    },
    { type: "h2", id: "begleitung", text: "Wie KG Business Sie unterstützt" },
    {
      type: "ul",
      items: [
        "Auswertung Ihrer Rechnung und Ermittlung des frühestmöglichen Wechseltermins",
        "Einholung und verständliche Gegenüberstellung passender Angebote",
        "Vorbereitung der Unterlagen und Begleitung bis zur Bestätigung des Lieferbeginns",
      ],
    },
    {
      type: "p",
      text: "Starten Sie mit dem [Energie-Check](/energie-check) oder lesen Sie, wie wir arbeiten: [So funktioniert’s](/so-funktionierts).",
    },
  ],
  sources: [
    { label: "Bundesnetzagentur – Lieferantenwechsel in 24 Stunden", url: "https://www.bundesnetzagentur.de/DE/Beschlusskammern/BK06/BK6_83_Zug_Mess/8353_Lieferantenwechsel/BK6_Lieferantenwechsel24h_node.html" },
    { label: "Bundesnetzagentur – Lieferantenwechsel (Verbraucherportal)", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/KuendigungLieferantenwechsel/Lieferantenwechsel/start.html" },
    { label: "Bundesnetzagentur – Kündigung (FAQ)", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/KuendigungLieferantenwechsel/Kuendigung/_faq/Kuendigung-table.html" },
  ],
  related: ["kuendigungsfristen", "stromrechnung-lesen", "vertragslaufzeiten"],
  faq: [
    {
      question: "Kann der Strom beim Anbieterwechsel ausfallen?",
      answer: "Nein. Die Belieferung erfolgt weiter über das Netz des örtlichen Netzbetreibers. Es ändert sich nur der Vertragspartner für die Energielieferung.",
    },
    {
      question: "Wie schnell kann ich den Stromanbieter wechseln?",
      answer: "Technisch ist der Stromlieferantenwechsel seit Juni 2025 innerhalb von 24 Stunden an Werktagen möglich. Ihre vertraglichen Kündigungsfristen müssen Sie trotzdem einhalten.",
    },
  ],
};
