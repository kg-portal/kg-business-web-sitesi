import type { Feature } from "@/components/sections/FeatureGrid";

export interface PrivateEnergyPage {
  energy: "strom" | "gas";
  path: string;
  name: string;
  metaTitle: string;
  description: string;
  heroTitle: string;
  heroLead: string;
  situationsTitle: string;
  situations: Feature[];
  rightsTitle: string;
  rights: { title: string; text: string }[];
  faq: { question: string; answer: string }[];
  related: string[];
}

export const privatStrom: PrivateEnergyPage = {
  energy: "strom",
  path: "/privatkunden/strom",
  name: "Privatstrom",
  metaTitle: "Stromtarif für Privathaushalte prüfen & wechseln",
  description:
    "Grundversorgung, Preiserhöhung oder auslaufende Preisgarantie? KG Business prüft Ihren Haushaltsstromtarif, vergleicht passende Angebote und unterstützt beim Wechsel.",
  heroTitle: "Haushaltsstrom ohne Tarifdschungel.",
  heroLead:
    "Wir prüfen Ihren aktuellen Stromtarif, erklären Preise und Fristen verständlich und zeigen Ihnen passende Alternativen – persönlich statt per Klick-Formular-Lotterie.",
  situationsTitle: "Typische Anlässe für einen Stromcheck",
  situations: [
    { icon: "receipt", title: "Noch in der Grundversorgung", text: "Wer nie gewechselt hat, wird meist vom Grundversorger beliefert. Das ist flexibel, aber häufig nicht der günstigste Tarif." },
    { icon: "chart", title: "Preiserhöhung angekündigt", text: "Bei einer Preisänderung haben Sie ein Sonderkündigungsrecht. Wir prüfen, ob sich ein Wechsel lohnt." },
    { icon: "shield", title: "Preisgarantie läuft aus", text: "Nach Ablauf der Garantie können Preise steigen. Ein rechtzeitiger Vergleich schafft Klarheit." },
    { icon: "home", title: "Umzug oder neue Wohnung", text: "Bei Einzug gilt zunächst die Grund- bzw. Ersatzversorgung. Ein eigener Vertrag lässt sich einfach abschließen." },
    { icon: "zap", title: "Wärmepumpe oder Wallbox", text: "Für steuerbare Verbrauchseinrichtungen gelten eigene Regeln (§ 14a EnWG). Das berücksichtigen wir im Gespräch." },
    { icon: "gauge", title: "Hoher Abschlag", text: "Ein deutlich gestiegener Abschlag ist ein guter Anlass, Tarif und Verbrauch zu prüfen." },
  ],
  rightsTitle: "Ihre Rechte als Stromkunde",
  rights: [
    { title: "Kurze Kündigungsfrist in der Grundversorgung", text: "Zwei Wochen in Textform (§ 20 StromGVV)." },
    { title: "Nach der Erstlaufzeit höchstens ein Monat", text: "Für Verträge seit März 2022 verlängern sich Sonderverträge nur unbefristet mit maximal einem Monat Kündigungsfrist." },
    { title: "Sonderkündigung bei Preisänderung", text: "Preisänderungen müssen mindestens einen Monat vorher angekündigt werden; Sie können zum Wirksamwerden kündigen (§ 41 Abs. 5 EnWG)." },
    { title: "Schneller Wechsel", text: "Der technische Stromlieferantenwechsel ist seit Juni 2025 innerhalb von 24 Stunden an Werktagen möglich." },
  ],
  faq: [
    {
      question: "Zeigen Sie mir direkt Tarifpreise an?",
      answer: "Nein. Wir holen für Ihre Adresse und Ihren Verbrauch individuelle Angebote ein. Preise für Privathaushalte nennen wir Ihnen selbstverständlich als Bruttopreise inklusive Umsatzsteuer.",
    },
    {
      question: "Was passiert, wenn mein neuer Anbieter ausfällt?",
      answer: "Dann werden Sie automatisch über die Ersatzversorgung des örtlichen Grundversorgers weiterbeliefert. Ihr Strom fällt nicht aus.",
    },
    {
      question: "Muss ich meinen alten Vertrag selbst kündigen?",
      answer: "In der Regel übernimmt das der neue Anbieter mit Ihrer Vollmacht. Wir achten darauf, dass Fristen eingehalten werden.",
    },
  ],
  related: ["kuendigungsfristen", "anbieterwechsel", "stromrechnung-lesen"],
};

export const privatGas: PrivateEnergyPage = {
  energy: "gas",
  path: "/privatkunden/gas",
  name: "Privatgas",
  metaTitle: "Gastarif für Heizung & Warmwasser prüfen und wechseln",
  description:
    "Gasheizung im Eigenheim oder in der Wohnung: KG Business prüft Ihren Gastarif, erklärt CO₂-Preis, Preisgarantie und Fristen und unterstützt beim Anbieterwechsel.",
  heroTitle: "Gas für Heizung und Warmwasser – fair und verständlich.",
  heroLead:
    "Die Heizkosten machen bei vielen Haushalten den größten Energieposten aus. Wir prüfen Ihren Gastarif und zeigen, welche Alternativen zu Ihrem Verbrauch passen.",
  situationsTitle: "Typische Anlässe für einen Gascheck",
  situations: [
    { icon: "receipt", title: "Hohe Nachzahlung", text: "Eine hohe Jahresabrechnung ist ein guter Anlass, Tarif, Abschläge und Verbrauch zu prüfen." },
    { icon: "chart", title: "Preiserhöhung angekündigt", text: "Sie können zum Wirksamwerden der Änderung kündigen. Wir zeigen Ihnen, ob sich ein Wechsel lohnt." },
    { icon: "shield", title: "Preisgarantie endet", text: "Gerade vor der Heizperiode lohnt ein Blick darauf, welche Preisbestandteile künftig garantiert sind." },
    { icon: "home", title: "Neu eingezogen", text: "Ohne eigenen Vertrag beliefert Sie zunächst der Grundversorger. Ein passender Tarif lässt sich einfach abschließen." },
    { icon: "flame", title: "CO₂-Preis verstehen", text: "Der CO₂-Preis nach BEHG ist Teil Ihres Gaspreises. Wir erklären, wie er in Angeboten berücksichtigt wird." },
    { icon: "calendar", title: "Lange nicht gewechselt", text: "Viele Gasverträge laufen jahrelang unverändert weiter. Ein Vergleich ist kostenfrei und unverbindlich." },
  ],
  rightsTitle: "Ihre Rechte als Gaskunde",
  rights: [
    { title: "Grundversorgung: zwei Wochen", text: "Kündigung in Textform mit zweiwöchiger Frist (§ 20 GasGVV)." },
    { title: "Sonderkündigung bei Preisänderung", text: "Bei angekündigten Preis- oder Vertragsänderungen können Sie zum Wirksamwerden kündigen (§ 41 Abs. 5 EnWG)." },
    { title: "Umzug", text: "Haushaltskunden außerhalb der Grundversorgung können bei Umzug mit sechs Wochen Frist kündigen (§ 41b EnWG)." },
    { title: "Gasspeicherumlage entfallen", text: "Seit dem 1. Januar 2026 ist die Gasspeicherumlage abgeschafft – ein Sonderkündigungsrecht entsteht dadurch nicht." },
  ],
  faq: [
    {
      question: "Ändert sich beim Wechsel etwas an meiner Heizung?",
      answer: "Nein. Gasleitung, Zähler und Heizung bleiben unverändert. Es wechselt nur der Vertragspartner für die Gaslieferung.",
    },
    {
      question: "Wie wird mein Gasverbrauch berechnet?",
      answer: "Ihr Zähler misst Kubikmeter. Mit Zustandszahl und Brennwert wird daraus der Verbrauch in kWh berechnet – beide Werte finden Sie auf Ihrer Rechnung.",
    },
    {
      question: "Nennen Sie Bruttopreise?",
      answer: "Ja. Angebote für Privathaushalte stellen wir mit Gesamtpreisen inklusive Umsatzsteuer dar.",
    },
  ],
  related: ["gewerbegas-verstehen", "kuendigungsfristen", "vertragslaufzeiten"],
};
