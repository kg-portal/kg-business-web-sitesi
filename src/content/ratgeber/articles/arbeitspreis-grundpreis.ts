import type { Article } from "../types";

export const arbeitspreisGrundpreis: Article = {
  slug: "arbeitspreis-grundpreis",
  title: "Arbeitspreis und Grundpreis: So vergleichen Sie Energieangebote richtig",
  metaTitle: "Arbeitspreis vs. Grundpreis – Jahreskosten richtig berechnen",
  description:
    "Was Arbeitspreis, Grundpreis und Leistungspreis bedeuten, wie Sie Jahreskosten berechnen und warum der niedrigste kWh-Preis nicht immer das günstigste Angebot ist.",
  excerpt: "Warum der niedrigste Preis pro kWh nicht automatisch gewinnt – mit Rechner für Ihre eigenen Werte.",
  category: "Grundlagen",
  readingMinutes: 5,
  published: "2026-10-10",
  updated: "2026-10-10",
  blocks: [
    {
      type: "p",
      text: "Energieangebote bestehen fast immer aus zwei Preisen: einem **verbrauchsabhängigen Arbeitspreis** und einem **festen Grundpreis**. Welches Angebot günstiger ist, entscheidet sich erst im Zusammenspiel mit Ihrem Verbrauch.",
    },
    { type: "h2", id: "definitionen", text: "Die Begriffe" },
    {
      type: "ul",
      items: [
        "**Arbeitspreis** (ct/kWh): Preis je verbrauchter Kilowattstunde. Er wird mit Ihrem Verbrauch multipliziert.",
        "**Grundpreis** (€/Monat oder €/Jahr): fester Betrag, unabhängig vom Verbrauch – etwa für Abrechnung und Messung.",
        "**Leistungspreis** (€/kW): bei leistungsgemessenen Zählern (RLM) zusätzlich auf die höchste in Anspruch genommene Leistung im Abrechnungszeitraum.",
      ],
    },
    { type: "h2", id: "formel", text: "Jahreskosten berechnen" },
    { type: "p", text: "**Jahreskosten = Arbeitspreis × Jahresverbrauch + Grundpreis × 12 − Bonus (nur im ersten Jahr)**" },
    {
      type: "p",
      text: "Achten Sie darauf, ob Preise **netto oder brutto** angegeben sind. Angebote für Gewerbekunden werden meist netto ausgewiesen, Angebote für Privathaushalte müssen Gesamtpreise inklusive Umsatzsteuer nennen.",
    },
    { type: "calculator" },
    { type: "h2", id: "break-even", text: "Ab welchem Verbrauch lohnt sich welcher Tarif?" },
    {
      type: "p",
      text: "Ein Tarif mit niedrigem Arbeitspreis und höherem Grundpreis lohnt sich erst ab einem bestimmten Verbrauch. Diesen Punkt können Sie selbst berechnen:",
    },
    { type: "p", text: "**Break-even-Verbrauch (kWh) = Differenz der Grundpreise pro Jahr ÷ Differenz der Arbeitspreise pro kWh**" },
    {
      type: "p",
      text: "Liegt Ihr Verbrauch darüber, ist der Tarif mit dem niedrigeren Arbeitspreis günstiger – liegt er darunter, der mit dem niedrigeren Grundpreis. Achten Sie darauf, beide Differenzen in derselben Einheit (Euro) zu rechnen.",
    },
    { type: "h2", id: "bonus", text: "Boni richtig einordnen" },
    {
      type: "p",
      text: "Neukundenboni senken die Kosten meist nur **im ersten Vertragsjahr**. Ein Angebot, das nur durch einen hohen Bonus günstig wirkt, kann im zweiten Jahr deutlich teurer sein. Vergleichen Sie deshalb immer auch die Kosten ohne Bonus.",
    },
    { type: "h2", id: "leistung", text: "Leistungspreis bei RLM-Kunden" },
    {
      type: "p",
      text: "Bei leistungsgemessenen Abnahmestellen zahlen Sie für die Netznutzung neben dem Arbeitspreis einen Leistungspreis auf Ihre Jahreshöchstleistung. Netzbetreiber unterscheiden dabei häufig nach der Benutzungsdauer (Jahresverbrauch geteilt durch Höchstleistung), typischerweise mit einer Grenze bei **2.500 Stunden pro Jahr**. Wer Lastspitzen vermeidet, kann diesen Kostenanteil beeinflussen.",
    },
    {
      type: "p",
      text: "Sie möchten Angebote nicht selbst durchrechnen? Im [Energie-Check](/energie-check) übernehmen wir das für Sie.",
    },
  ],
  sources: [
    { label: "Bundesnetzagentur – Arbeitspreis (Glossar)", url: "https://www.bundesnetzagentur.de/SharedDocs/A_Z_Glossar/A/Arbeitspreis.html" },
    { label: "Bundesnetzagentur – Netzentgelt (Glossar)", url: "https://www.bundesnetzagentur.de/SharedDocs/A_Z_Glossar/N/Netzentgelt.html" },
    { label: "Bundesnetzagentur – Tarife (Verbraucherportal)", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/PreiseAbschlaege/Tarife-table.html" },
  ],
  related: ["stromrechnung-lesen", "gewerbestrom-verstehen", "vertragslaufzeiten"],
};
