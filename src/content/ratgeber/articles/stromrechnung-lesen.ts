import type { Article } from "../types";

export const stromrechnungLesen: Article = {
  slug: "stromrechnung-lesen",
  title: "Strom- und Gasrechnung richtig lesen: Diese Angaben zählen",
  metaTitle: "Stromrechnung lesen – Zählpunkt, Verbrauch, Preise & Vertragsende",
  description:
    "Zählernummer, Marktlokation, Verbrauch, Arbeitspreis, Grundpreis und Vertragsende: So finden Sie die wichtigsten Angaben auf Ihrer Strom- oder Gasrechnung.",
  excerpt: "Zählpunkt, Verbrauch, Preise und Kündigungstermin – so finden Sie die entscheidenden Angaben auf Ihrer Rechnung.",
  category: "Grundlagen",
  readingMinutes: 5,
  published: "2026-10-10",
  updated: "2026-10-10",
  blocks: [
    {
      type: "p",
      text: "Ihre Jahresrechnung ist die beste Grundlage für einen Vergleich. Sie enthält alle Angaben, die ein neuer Lieferant für ein Angebot braucht – und verrät, wann Sie frühestens wechseln können. Energieversorger sind gesetzlich verpflichtet, auf Rechnungen eine Reihe von Informationen auszuweisen (§ 40 EnWG).",
    },
    { type: "h2", id: "identifikation", text: "1. Wer und wo: Kundendaten und Lieferstelle" },
    {
      type: "ul",
      items: [
        "**Kundennummer und Vertragskonto** beim aktuellen Lieferanten",
        "**Lieferadresse** – sie kann von der Rechnungsadresse abweichen",
        "**Zählernummer** – steht auch auf dem Zähler selbst",
        "**Marktlokations-ID bzw. Zählpunktbezeichnung** – die eindeutige Kennung Ihrer Abnahmestelle im Netz",
      ],
    },
    { type: "h2", id: "verbrauch", text: "2. Was: Zählerstände und Verbrauch" },
    {
      type: "p",
      text: "Achten Sie darauf, ob die Zählerstände **abgelesen oder geschätzt** wurden. Geschätzte Werte können zu hohen Nachzahlungen oder Guthaben führen. Der Jahresverbrauch in kWh ist die wichtigste Zahl für jedes Angebot. Bei Gas finden Sie zusätzlich Brennwert und Zustandszahl für die Umrechnung von m³ in kWh.",
    },
    { type: "h2", id: "preise", text: "3. Wie viel: Arbeitspreis, Grundpreis und Bestandteile" },
    {
      type: "ul",
      items: [
        "**Arbeitspreis** in ct/kWh – Preis je verbrauchter Kilowattstunde",
        "**Grundpreis** in €/Monat oder €/Jahr – fester Betrag, unabhängig vom Verbrauch",
        "Bei leistungsgemessenen Zählern: **Leistungspreis** in €/kW",
        "Ausweis von Netzentgelten, Abgaben, Umlagen und Steuern",
        "Netto- und Bruttobeträge – Gewerbekunden rechnen meist netto",
      ],
    },
    { type: "h2", id: "vertrag", text: "4. Wie lange: Vertragsende und Kündigungsfrist" },
    {
      type: "p",
      text: "Auf der Rechnung finden Sie in der Regel die Vertragslaufzeit, den nächstmöglichen Kündigungstermin und die Kündigungsfrist. Diese Angaben bestimmen, **ab wann ein Wechsel möglich ist**. Fehlen sie, hilft ein Blick in die Vertragsbestätigung oder eine Nachfrage beim Lieferanten.",
    },
    { type: "h2", id: "abschlag", text: "5. Abschläge und Saldo" },
    {
      type: "p",
      text: "Die Rechnung verrechnet Ihre gezahlten Abschläge mit den tatsächlichen Kosten. Daraus ergibt sich ein Guthaben oder eine Nachzahlung sowie der **neue monatliche Abschlag**. Ein auffällig gestiegener Abschlag ist oft ein guter Anlass, den Vertrag zu prüfen.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Rechnung hochladen – aber datensparsam",
      text: "Für den Energie-Check genügt die Seite mit Verbrauch, Preisen und Vertragsdaten. Bankverbindungen und andere nicht benötigte Angaben können Sie vor dem Hochladen gerne schwärzen.",
    },
    {
      type: "p",
      text: "Laden Sie Ihre Rechnung im [Energie-Check](/energie-check) hoch – wir werten sie für Sie aus und melden uns mit einer Einschätzung.",
    },
  ],
  sources: [
    { label: "Bundesnetzagentur – Arbeitspreis (Glossar)", url: "https://www.bundesnetzagentur.de/SharedDocs/A_Z_Glossar/A/Arbeitspreis.html" },
    { label: "Bundesnetzagentur – Tarife und Preise (Verbraucherportal)", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/PreiseAbschlaege/Tarife-table.html" },
  ],
  related: ["arbeitspreis-grundpreis", "kuendigungsfristen", "anbieterwechsel"],
};
