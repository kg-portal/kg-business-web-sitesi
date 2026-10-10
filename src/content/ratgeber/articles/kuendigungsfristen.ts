import type { Article } from "../types";

export const kuendigungsfristen: Article = {
  slug: "kuendigungsfristen",
  title: "Kündigungsfristen bei Strom und Gas: Fristen, Sonderkündigung und Form",
  metaTitle: "Kündigungsfrist Strom & Gas – Grundversorgung, Sonderkündigung, Gewerbe",
  description:
    "Zwei Wochen in der Grundversorgung, ein Monat nach Verlängerung, Sonderkündigungsrecht bei Preisänderungen: Die wichtigsten Kündigungsregeln für Strom und Gas.",
  excerpt: "Grundversorgung, Sonderkündigung bei Preisänderung und Gewerbeverträge – wann und wie Sie kündigen können.",
  category: "Vertrag",
  readingMinutes: 5,
  published: "2026-10-10",
  updated: "2026-10-10",
  blocks: [
    {
      type: "p",
      text: "Die beste Alternative nützt wenig, wenn die Kündigungsfrist verpasst ist. Wer seine Fristen kennt, kann rechtzeitig vergleichen und ohne Zeitdruck entscheiden.",
    },
    {
      type: "table",
      caption: "Kündigungsregeln im Überblick",
      head: ["Situation", "Frist", "Grundlage"],
      rows: [
        ["Grundversorgung", "2 Wochen, Textform", "§ 20 StromGVV / GasGVV"],
        ["Verbrauchervertrag nach Erstlaufzeit (seit 03/2022)", "max. 1 Monat", "§ 309 Nr. 9 BGB"],
        ["Preisänderung durch den Lieferanten", "Sonderkündigung ohne Frist zum Wirksamwerden der Änderung", "§ 41 Abs. 5 EnWG"],
        ["Umzug (Haushaltskunden außerhalb der Grundversorgung)", "6 Wochen", "§ 41b EnWG"],
        ["Gewerbevertrag", "laut Vertrag", "frei vereinbart"],
      ],
    },
    { type: "h2", id: "preisaenderung", text: "Sonderkündigungsrecht bei Preisänderungen" },
    {
      type: "p",
      text: "Ändert ein Lieferant einseitig die Preise oder Vertragsbedingungen, muss er dies rechtzeitig ankündigen – Haushaltskunden **mindestens einen Monat**, andere Letztverbraucher **mindestens zwei Wochen** vorher. Sie können den Vertrag dann **ohne Einhaltung einer Frist** zu dem Zeitpunkt kündigen, an dem die Änderung wirksam wird (§ 41 Abs. 5 EnWG).",
    },
    {
      type: "callout",
      tone: "warn",
      title: "Preissenkungen lösen kein Sonderkündigungsrecht aus",
      text: "Gibt ein Lieferant gesunkene staatliche Bestandteile – etwa den Wegfall der Gasspeicherumlage – an Sie weiter, entsteht dadurch kein Sonderkündigungsrecht.",
    },
    { type: "h2", id: "form", text: "In welcher Form muss gekündigt werden?" },
    {
      type: "p",
      text: "Für Haushaltskunden außerhalb der Grundversorgung schreibt § 41b EnWG die **Textform** vor – eine E-Mail genügt also grundsätzlich. Der Lieferant muss die Kündigung innerhalb einer Woche in Textform bestätigen. Bei Gewerbeverträgen gilt die vertraglich vereinbarte Form.",
    },
    { type: "h2", id: "wer-kuendigt", text: "Wer kündigt beim Anbieterwechsel?" },
    {
      type: "p",
      text: "In der Praxis übernimmt meist der **neue Lieferant** die Kündigung beim bisherigen Versorger – auf Grundlage Ihrer Vollmacht. Ohne wirksame Vollmacht ist eine solche Kündigung unwirksam. Prüfen Sie deshalb, ob die Vollmacht erteilt wurde und ob die Kündigungsbestätigung eingegangen ist.",
    },
    { type: "h2", id: "tipps", text: "So verpassen Sie keine Frist" },
    {
      type: "ol",
      items: [
        "Vertragsende und Kündigungsfrist aus Rechnung oder Vertragsbestätigung notieren.",
        "Den spätesten Kündigungstermin im Kalender eintragen – mit Vorlauf für den Vergleich.",
        "Angebote rechtzeitig einholen, damit Sie ohne Zeitdruck entscheiden können.",
        "Kündigungsbestätigung und Bestätigung des neuen Lieferbeginns aufbewahren.",
      ],
    },
    {
      type: "p",
      text: "Sie sind unsicher, wann Ihr Vertrag endet? Laden Sie Ihre Rechnung im [Energie-Check](/energie-check) hoch – wir lesen die Fristen für Sie aus.",
    },
  ],
  sources: [
    { label: "Bundesnetzagentur – Kündigung (FAQ)", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/KuendigungLieferantenwechsel/Kuendigung/_faq/Kuendigung-table.html" },
    { label: "Bundesnetzagentur – Preiserhöhungen", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/Preiserhoehungen/artikel.html" },
    { label: "EnWG § 41b", url: "https://www.gesetze-im-internet.de/enwg_2005/__41b.html" },
    { label: "StromGVV § 20", url: "https://www.gesetze-im-internet.de/stromgvv/__20.html" },
    { label: "Verbraucherzentrale – Faire Verbraucherverträge", url: "https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/kundenrechte/gesetz-fuer-fairere-vertraege-mehr-schutz-bei-kosten-und-laufzeiten-55274" },
  ],
  related: ["vertragslaufzeiten", "anbieterwechsel", "stromrechnung-lesen"],
  faq: [
    {
      question: "Kann ich per E-Mail kündigen?",
      answer: "Für Haushaltskunden außerhalb der Grundversorgung genügt die Textform, also auch eine E-Mail. Bei Gewerbeverträgen gilt die im Vertrag vereinbarte Form.",
    },
  ],
};
