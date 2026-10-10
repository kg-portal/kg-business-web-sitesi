import type { Article } from "../types";

export const vertragslaufzeiten: Article = {
  slug: "vertragslaufzeiten",
  title: "Vertragslaufzeiten bei Strom und Gas: Was gilt für Privat- und Gewerbekunden?",
  metaTitle: "Vertragslaufzeit Strom & Gas – Regeln für Privat- und Gewerbekunden",
  description:
    "Erstlaufzeit, automatische Verlängerung und Preisgarantie: Welche Regeln für Verbraucher seit 2022 gelten und was Gewerbekunden frei verhandeln.",
  excerpt: "Erstlaufzeit, Verlängerung und Preisgarantie – welche Regeln für Verbraucher und für Unternehmen gelten.",
  category: "Vertrag",
  readingMinutes: 6,
  published: "2026-10-10",
  updated: "2026-10-10",
  blocks: [
    {
      type: "p",
      text: "Die Laufzeit eines Energievertrags bestimmt, wie lange Sie an Preise und Bedingungen gebunden sind. Sie kann Planungssicherheit schaffen – oder dazu führen, dass Sie bessere Konditionen verpassen. Welche Regeln gelten, hängt davon ab, ob Sie **Verbraucher oder Unternehmer** sind.",
    },
    { type: "h2", id: "grundversorgung", text: "Grundversorgung: keine feste Laufzeit" },
    {
      type: "p",
      text: "Wer keinen eigenen Vertrag abgeschlossen hat, wird vom örtlichen Grundversorger beliefert. Die Grundversorgung hat keine Mindestlaufzeit und kann mit einer Frist von **zwei Wochen** in Textform gekündigt werden (§ 20 StromGVV/GasGVV). Sie ist flexibel, aber häufig nicht der günstigste Tarif.",
    },
    { type: "h2", id: "verbraucher", text: "Sonderverträge für Verbraucher seit März 2022" },
    {
      type: "p",
      text: "Für Verbraucherverträge, die seit dem **1. März 2022** geschlossen wurden, gilt nach dem „Gesetz für faire Verbraucherverträge“ (§ 309 Nr. 9 BGB):",
    },
    {
      type: "ul",
      items: [
        "Die **Erstlaufzeit** darf höchstens zwei Jahre betragen.",
        "Danach darf sich der Vertrag nur noch **auf unbestimmte Zeit** verlängern.",
        "Ein verlängerter Vertrag ist jederzeit mit einer Frist von **höchstens einem Monat** kündbar.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Ältere Verträge",
      text: "Für Verträge, die vor dem 1. März 2022 geschlossen wurden, gelten die damals vereinbarten Verlängerungsregeln weiter. Ein Blick in die Vertragsunterlagen lohnt sich.",
    },
    { type: "h2", id: "gewerbe", text: "Gewerbekunden: Laufzeit ist Verhandlungssache" },
    {
      type: "p",
      text: "Die verbraucherschützenden AGB-Regeln des § 309 BGB gelten gegenüber Unternehmen nicht unmittelbar. Laufzeiten, automatische Verlängerungen und Kündigungsfristen werden im Gewerbe weitgehend frei vereinbart. Üblich sind feste Laufzeiten über ein oder mehrere Jahre – oft mit **stillschweigender Verlängerung**, wenn nicht rechtzeitig gekündigt wird.",
    },
    {
      type: "p",
      text: "Kleine Betriebe mit bis zu 10.000 kWh Jahresverbrauch gelten nach dem Energiewirtschaftsgesetz zwar als Haushaltskunden und profitieren von dessen Schutzvorschriften (z. B. Textform). Die Laufzeitbegrenzungen des BGB für Verbraucher greifen für sie aber nicht automatisch.",
    },
    { type: "h2", id: "preisgarantie", text: "Laufzeit und Preisgarantie gehören zusammen" },
    {
      type: "p",
      text: "Eine lange Laufzeit ist nur dann ein Vorteil, wenn auch die Preise abgesichert sind. Für den Begriff „Preisgarantie“ gibt es **keine gesetzliche Definition**. Verbraucherschützer unterscheiden grob:",
    },
    {
      type: "table",
      caption: "Typische Formen der Preisgarantie",
      head: ["Bezeichnung", "Was ist garantiert?"],
      rows: [
        ["Umfassende / volle Preisgarantie", "Alle Preisbestandteile außer der Umsatzsteuer (je nach Anbieter auch ohne Stromsteuer)"],
        ["Eingeschränkte Preisgarantie", "Energiepreis und Netzentgelte; Steuern, Abgaben und Umlagen werden weitergegeben"],
        ["Stark eingeschränkte Preisgarantie", "Nur Beschaffung, Vertrieb und Marge des Lieferanten"],
      ],
      note: "Bezeichnungen werden von Anbietern unterschiedlich verwendet – entscheidend ist der genaue Vertragstext.",
    },
    {
      type: "p",
      text: "Seit Ende 2025 müssen Lieferanten mit mehr als 200.000 Letztverbrauchern zudem einen Festpreisvertrag mit mindestens zwölf Monaten Laufzeit anbieten (§ 41a EnWG).",
    },
    { type: "h2", id: "entscheidung", text: "Kurz oder lang? Eine Frage der Planung" },
    {
      type: "ul",
      items: [
        "**Kurze Laufzeit:** mehr Flexibilität, aber häufiger neu entscheiden",
        "**Lange Laufzeit mit umfassender Garantie:** Planungssicherheit für Budget und Kalkulation",
        "**Betriebliche Pläne berücksichtigen:** Umzug, Umbau, Pachtende oder Heizungstausch",
      ],
    },
    {
      type: "p",
      text: "Prognosen über künftige Energiepreise geben wir bewusst nicht ab. Wir zeigen Ihnen aber, welche Bindung ein Angebot bedeutet – im [Energie-Check](/energie-check) oder im [persönlichen Gespräch](/kontakt).",
    },
  ],
  sources: [
    { label: "Verbraucherzentrale – Gesetz für faire Verbraucherverträge", url: "https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/kundenrechte/gesetz-fuer-fairere-vertraege-mehr-schutz-bei-kosten-und-laufzeiten-55274" },
    { label: "StromGVV § 20", url: "https://www.gesetze-im-internet.de/stromgvv/__20.html" },
    { label: "GasGVV § 20", url: "https://www.gesetze-im-internet.de/gasgvv/__20.html" },
    { label: "Bundesnetzagentur – Vertragsabschluss", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/Vertragsarten/vertragsabschluss_table.html" },
    { label: "Verbraucherzentrale NRW – Preisgarantien", url: "https://www.verbraucherzentrale.nrw/sites/default/files/migration_files/media244675A.pdf" },
    { label: "EnWG § 41a", url: "https://www.gesetze-im-internet.de/enwg_2005/__41a.html" },
  ],
  related: ["kuendigungsfristen", "anbieterwechsel", "arbeitspreis-grundpreis"],
};
