/**
 * Branchenlösungen – jede Seite beschreibt die tatsächlichen energetischen
 * Besonderheiten der Branche. Keine erfundenen Kennzahlen, keine Referenzen.
 */
import type { IconName } from "@/components/ui/Icon";

export interface IndustryNeed {
  title: string;
  text: string;
}

export interface Industry {
  slug: string;
  name: string;
  /** Kurzbezeichnung für Navigation und Karten */
  short: string;
  icon: IconName;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroLead: string;
  /** Kurzer Teaser für Übersichtskarten */
  teaser: string;
  energy: ("strom" | "gas")[];
  /** Typische Verbraucher in der Branche */
  consumers: string[];
  situationTitle: string;
  situation: string[];
  needs: IndustryNeed[];
  checks: string[];
  faq: { question: string; answer: string }[];
}

export const industries: Industry[] = [
  {
    slug: "hausverwaltungen",
    name: "Hausverwaltungen",
    short: "Hausverwaltungen",
    icon: "building",
    metaTitle: "Energieberatung für Hausverwaltungen – Allgemeinstrom & Heizgas",
    metaDescription:
      "Allgemeinstrom und Heizgas für mehrere Objekte strukturiert prüfen: KG Business unterstützt Hausverwaltungen beim Vergleich, bei Vertragsfristen und beim Anbieterwechsel.",
    heroTitle: "Allgemeinstrom und Heizgas für Ihre Objekte – geordnet statt verstreut.",
    heroLead:
      "Viele Liegenschaften, viele Zähler, unterschiedliche Vertragsenden: Wir bringen Übersicht in die Energieverträge Ihrer verwalteten Objekte und vergleichen Angebote nachvollziehbar.",
    teaser: "Allgemeinstrom, Heizgas und viele Lieferstellen übersichtlich bündeln.",
    energy: ["strom", "gas"],
    consumers: ["Treppenhaus- und Außenbeleuchtung", "Aufzüge", "Heizungs- und Umwälzpumpen", "Zentralheizung mit Gas", "Tiefgaragen und Torantriebe"],
    situationTitle: "Was die Energieversorgung in der Hausverwaltung besonders macht",
    situation: [
      "In der Verwaltung laufen Energieverträge oft objektweise auseinander: unterschiedliche Versorger, unterschiedliche Laufzeiten, Rechnungen zu verschiedenen Zeitpunkten. Das kostet Zeit – und führt leicht dazu, dass Kündigungsfristen verpasst werden.",
      "Allgemeinstrom und Heizkosten fließen in der Regel in die Betriebskostenabrechnung. Vermietende sind dabei an den Grundsatz der Wirtschaftlichkeit gebunden (§ 556 Abs. 3 BGB). Ein dokumentierter Vergleich hilft, Entscheidungen gegenüber Eigentümern und Mietparteien nachvollziehbar zu machen.",
    ],
    needs: [
      { title: "Übersicht über alle Lieferstellen", text: "Wir erfassen Zählpunkte, Verbräuche und Vertragsenden je Objekt und machen sichtbar, wo Handlungsbedarf besteht." },
      { title: "Fristen im Blick", text: "Vertragsenden und Kündigungsfristen werden strukturiert festgehalten, damit Wechselzeitpunkte nicht verstreichen." },
      { title: "Nachvollziehbare Entscheidungsgrundlage", text: "Angebote werden mit Arbeitspreis, Grundpreis, Laufzeit und Preisgarantie gegenübergestellt – geeignet als Grundlage für Ihre Abstimmung." },
      { title: "Bündelung, wo sinnvoll", text: "Mehrere Objekte können – je nach Angebot des Versorgers – gemeinsam ausgeschrieben werden. Ob das Vorteile bringt, prüfen wir im Einzelfall." },
    ],
    checks: ["Allgemeinstromverträge je Liegenschaft", "Heizgasverträge der Zentralheizungen", "Vertragsenden und Kündigungsfristen", "Abrechnungsmodalitäten (Einzel- oder Sammelrechnung)"],
    faq: [
      { question: "Können wir mehrere Objekte gleichzeitig prüfen lassen?", answer: "Ja. Am einfachsten senden Sie uns eine Liste der Lieferstellen oder die letzten Jahresrechnungen. Wir ordnen die Daten je Objekt und melden uns mit einer strukturierten Übersicht." },
      { question: "Wer darf den Anbieterwechsel für ein Objekt beauftragen?", answer: "Das hängt von Ihrem Verwaltungsvertrag und gegebenenfalls von Beschlüssen der Eigentümergemeinschaft ab. Wir stellen die Unterlagen so zusammen, dass Sie die Entscheidung intern sauber vorbereiten können." },
    ],
  },
  {
    slug: "buerogebaeude",
    name: "Bürogebäude",
    short: "Bürogebäude",
    icon: "briefcase",
    metaTitle: "Gewerbestrom für Bürogebäude & Büroflächen vergleichen",
    metaDescription:
      "IT, Beleuchtung, Klima: Für Büros und Bürogebäude prüft KG Business Strom- und Gasverträge, Lastprofil und Vertragslaufzeiten – persönlich und unverbindlich.",
    heroTitle: "Energie für Büro und Verwaltung – planbar und transparent.",
    heroLead:
      "Ob einzelne Büroetage oder ganzes Verwaltungsgebäude: Wir prüfen, ob Ihr Stromvertrag zu Ihrem Verbrauchsprofil passt, und vergleichen Angebote mit klaren Konditionen.",
    teaser: "IT, Beleuchtung und Klimatisierung – Verträge passend zum Büroalltag.",
    energy: ["strom", "gas"],
    consumers: ["Arbeitsplatz-IT und Serverräume", "Beleuchtung", "Lüftung und Klimatisierung", "Aufzüge und Gebäudetechnik", "Heizung (häufig Gas)"],
    situationTitle: "Typisch für Bürogebäude",
    situation: [
      "Der Stromverbrauch in Büros folgt meist dem Arbeitstag: hohe Last werktags, geringe Last nachts und am Wochenende. Serverräume und Klimatechnik sorgen allerdings oft für eine durchgehende Grundlast.",
      "Bei größeren Gebäuden wird der Verbrauch häufig viertelstündlich gemessen (registrierende Leistungsmessung). Dann spielen neben dem Arbeitspreis auch Leistungsspitzen eine Rolle – und damit der Lastgang.",
    ],
    needs: [
      { title: "Planbare Kosten", text: "Preisgarantien und Laufzeiten, die zu Ihrer Budgetplanung passen – mit klarer Angabe, welche Preisbestandteile tatsächlich garantiert sind." },
      { title: "Passend zum Lastprofil", text: "Wir berücksichtigen, ob Ihr Zähler als Standardlastprofil oder per Leistungsmessung abgerechnet wird." },
      { title: "Allgemein- und Mietflächen trennen", text: "In vermieteten Bürogebäuden prüfen wir getrennt, welche Lieferstellen Sie selbst und welche Ihre Mietparteien verantworten." },
    ],
    checks: ["Arbeitspreis, Grundpreis und ggf. Leistungspreis", "Messkonzept (SLP oder RLM)", "Preisgarantie und Laufzeit", "Heizenergie (Gas) im selben Gebäude"],
    faq: [
      { question: "Lohnt sich die Prüfung auch für eine einzelne Büroetage?", answer: "Häufig ja – auch kleinere Gewerbeverträge laufen oft unbemerkt in teuren Anschlusskonditionen weiter. Eine Rechnung reicht für die erste Einschätzung." },
      { question: "Was ist, wenn der Strom über den Vermieter abgerechnet wird?", answer: "Dann haben Sie meist keinen eigenen Liefervertrag. Wir prüfen gerne, ob ein eigener Zähler und Vertrag möglich ist – das hängt vom Gebäude und vom Mietvertrag ab." },
    ],
  },
  {
    slug: "gastronomie",
    name: "Gastronomie",
    short: "Gastronomie",
    icon: "utensils",
    metaTitle: "Strom & Gas für Gastronomie und Restaurants vergleichen",
    metaDescription:
      "Kühlung rund um die Uhr, Gasherd, Spülmaschine: KG Business prüft Strom- und Gasverträge für Restaurants, Cafés und Imbisse und begleitet den Anbieterwechsel.",
    heroTitle: "Kühlung, Küche, Kasse – Energie, die im Betrieb nicht nebenbei laufen darf.",
    heroLead:
      "In der Gastronomie läuft die Kühlung rund um die Uhr und die Küche braucht verlässlich Strom oder Gas. Wir sorgen dafür, dass Ihre Verträge dazu passen – ohne dass Sie Zeit im Papierkram verlieren.",
    teaser: "Kühlung rund um die Uhr, Gasherd und Spülküche zuverlässig versorgt.",
    energy: ["strom", "gas"],
    consumers: ["Kühl- und Tiefkühltechnik (24/7)", "Gasherde und Kombidämpfer", "Spülmaschinen und Warmwasser", "Lüftung und Abzugshauben", "Beleuchtung und Kassensysteme"],
    situationTitle: "Typisch für Gastronomiebetriebe",
    situation: [
      "Kühlräume und Kühlmöbel erzeugen eine hohe Grundlast, die auch außerhalb der Öffnungszeiten anfällt. Hinzu kommen Spitzen im Service, wenn Küche, Spülmaschine und Lüftung gleichzeitig arbeiten.",
      "Bei Übernahme oder Neueröffnung eines Lokals ist die rechtzeitige An- bzw. Ummeldung der Zähler entscheidend. Ohne eigenen Vertrag landet die Lieferstelle sonst in der Grund- oder Ersatzversorgung, die oft teurer ist.",
    ],
    needs: [
      { title: "Schnell und unkompliziert", text: "Ein Foto Ihrer letzten Rechnung genügt für den Start. Wir melden uns mit einer verständlichen Einschätzung." },
      { title: "Strom und Gas zusammen denken", text: "Viele Betriebe nutzen beide Energiearten. Wir prüfen beide Verträge und achten auf sinnvolle Vertragsenden." },
      { title: "Begleitung bei Übernahme", text: "Bei Betreiberwechsel unterstützen wir bei Zählerständen, Ummeldung und neuen Lieferverträgen." },
    ],
    checks: ["Strom- und Gasvertrag inklusive Grundpreis", "Vertragsstatus nach Übernahme (Grund-/Ersatzversorgung?)", "Laufzeit im Verhältnis zum Pachtvertrag", "Preisgarantie und Abschlagshöhe"],
    faq: [
      { question: "Wir übernehmen ein bestehendes Restaurant – was ist zu tun?", answer: "Notieren Sie am Übergabetag die Zählerstände (Strom und Gas) mit Foto. Anschließend sollte zeitnah ein eigener Liefervertrag abgeschlossen werden. Wir unterstützen Sie dabei, passende Angebote zu finden." },
      { question: "Können Sie auch kurzfristig helfen?", answer: "Wir melden uns schnellstmöglich. Wie kurzfristig ein Lieferbeginn möglich ist, hängt vom Versorger und von der Situation an der Lieferstelle ab." },
    ],
  },
  {
    slug: "hotels",
    name: "Hotels & Beherbergung",
    short: "Hotels",
    icon: "bed",
    metaTitle: "Energieberatung für Hotels – Strom & Gas für den 24/7-Betrieb",
    metaDescription:
      "Warmwasser, Heizung, Küche, Wäsche: KG Business vergleicht Strom- und Gasverträge für Hotels, Pensionen und Apartmenthäuser und unterstützt beim Wechsel.",
    heroTitle: "Rund um die Uhr in Betrieb – mit Energieverträgen, die das abbilden.",
    heroLead:
      "Hotels verbrauchen Energie an 365 Tagen: für Zimmer, Warmwasser, Küche, Wäsche und Technik. Wir prüfen Ihre Verträge mit Blick auf Verbrauchsprofil, Saisonalität und Budgetsicherheit.",
    teaser: "Warmwasser, Heizung, Küche und Wäsche – 365 Tage im Jahr.",
    energy: ["strom", "gas"],
    consumers: ["Heizung und Warmwasserbereitung", "Hotelküche und Frühstücksbereich", "Wäscherei und Trockner", "Klimatisierung und Lüftung", "Wellness- und Poolbereiche"],
    situationTitle: "Typisch für Hotels und Pensionen",
    situation: [
      "Der Energiebedarf von Hotels ist durch Warmwasser und Heizung oft stark gasgeprägt, während Küche, Klima und Technik beim Strom ins Gewicht fallen. Je nach Größe des Hauses kann der Verbrauch in die registrierende Leistungsmessung fallen.",
      "Saisonale Schwankungen und Auslastung beeinflussen den Verbrauch deutlich. Für die Budgetplanung zählen deshalb nicht nur Preise, sondern auch Laufzeit und Umfang der Preisgarantie.",
    ],
    needs: [
      { title: "Budgetsicherheit", text: "Wir zeigen, welche Preisbestandteile ein Angebot tatsächlich festschreibt – und welche sich während der Laufzeit ändern können." },
      { title: "Strom und Gas im Paket prüfen", text: "Beide Verträge werden gemeinsam betrachtet, damit Laufzeiten und Konditionen zusammenpassen." },
      { title: "Mehrere Häuser", text: "Für Betreiber mehrerer Standorte erfassen wir alle Lieferstellen übersichtlich." },
    ],
    checks: ["Gasvertrag für Heizung und Warmwasser", "Stromvertrag inkl. Messkonzept", "Preisgarantie und Laufzeit", "Verbrauchsverlauf über das Jahr"],
    faq: [
      { question: "Welche Unterlagen brauchen Sie von einem Hotel?", answer: "Idealerweise die letzten Jahresrechnungen für Strom und Gas. Bei leistungsgemessenen Zählern hilft zusätzlich der Lastgang, den Ihr Messstellenbetreiber oder Versorger bereitstellen kann." },
      { question: "Ist ein Festpreis immer die beste Wahl?", answer: "Nicht zwingend. Ein Festpreis schafft Planbarkeit, kann aber höher kalkuliert sein. Wir erläutern die Unterschiede, damit Sie bewusst entscheiden." },
    ],
  },
  {
    slug: "handwerk",
    name: "Handwerk",
    short: "Handwerk",
    icon: "wrench",
    metaTitle: "Gewerbestrom & Gewerbegas für Handwerksbetriebe vergleichen",
    metaDescription:
      "Maschinen, Kompressoren, Hallenheizung: KG Business prüft Energieverträge für Handwerksbetriebe – Werkstatt, Büro und Lager im Blick, persönlich beraten.",
    heroTitle: "Werkstatt, Maschinen, Halle – Energieverträge, die zu Ihrem Betrieb passen.",
    heroLead:
      "Ob Tischlerei, Kfz-Werkstatt, Bäckerei oder Metallbau: Ihr Energiebedarf hängt an Maschinen und Arbeitszeiten. Wir prüfen Ihre Verträge und vergleichen Angebote, die dazu passen.",
    teaser: "Maschinen, Kompressoren und Hallenheizung – Werkstatt und Büro im Blick.",
    energy: ["strom", "gas"],
    consumers: ["Maschinen und Drehstromverbraucher", "Druckluft-Kompressoren", "Hallen- und Werkstattheizung", "Backöfen, Trockner, Lackierkabinen", "Büro und Lager"],
    situationTitle: "Typisch für Handwerksbetriebe",
    situation: [
      "Im Handwerk entstehen Lastspitzen, wenn mehrere Maschinen gleichzeitig anlaufen. Bei leistungsgemessenen Zählern beeinflussen diese Spitzen die Kosten über den Leistungspreis – bei kleineren Betrieben zählt vor allem der Arbeitspreis.",
      "Oft gibt es mehrere Lieferstellen: Werkstatt, Büro, Lager oder Verkaufsraum. Unterschiedliche Verträge mit unterschiedlichen Laufzeiten sind die Regel – und eine typische Quelle für unnötige Kosten.",
    ],
    needs: [
      { title: "Wenig Aufwand für Sie", text: "Sie konzentrieren sich auf Ihre Aufträge. Wir werten Rechnungen aus und bereiten die Entscheidung vor." },
      { title: "Alle Standorte im Blick", text: "Werkstatt, Büro und Lager werden gemeinsam betrachtet – inklusive Vertragsenden." },
      { title: "Gas für Prozess und Heizung", text: "Ob Hallenheizung oder Trocknung: Wir prüfen auch den Gasvertrag und dessen Konditionen." },
    ],
    checks: ["Strom- und Gasverträge aller Standorte", "Messkonzept und ggf. Leistungspreis", "Laufzeiten und automatische Verlängerungen", "Abschläge im Verhältnis zum tatsächlichen Verbrauch"],
    faq: [
      { question: "Unser Betrieb hat Werkstatt und Büro an verschiedenen Adressen – geht das zusammen?", answer: "Ja. Wir erfassen beide Lieferstellen und prüfen, ob gemeinsame oder getrennte Verträge günstiger und praktischer sind." },
      { question: "Was ist ein Leistungspreis?", answer: "Bei leistungsgemessenen Zählern wird neben der verbrauchten Energie auch die höchste in Anspruch genommene Leistung berechnet. Details erklären wir in unserem Ratgeber." },
    ],
  },
  {
    slug: "einzelhandel",
    name: "Einzelhandel",
    short: "Einzelhandel",
    icon: "store",
    metaTitle: "Stromvergleich für Einzelhandel & Ladengeschäfte",
    metaDescription:
      "Ladenbeleuchtung, Kühlung, Klimatisierung, Filialen: KG Business prüft Energieverträge im Einzelhandel und vergleicht passende Angebote – persönlich aus Duisburg.",
    heroTitle: "Gut beleuchtet, richtig gekühlt – und fair versorgt.",
    heroLead:
      "Im Handel prägen Öffnungszeiten, Beleuchtung und Kühlung den Verbrauch. Wir prüfen Ihre Strom- und Gasverträge – vom einzelnen Ladengeschäft bis zum Filialnetz.",
    teaser: "Beleuchtung, Kühlung und Öffnungszeiten – vom Laden bis zur Filiale.",
    energy: ["strom", "gas"],
    consumers: ["Laden- und Schaufensterbeleuchtung", "Kühltheken und Kühlräume", "Klimatisierung und Lüftung", "Kassensysteme und IT", "Heizung der Verkaufsfläche"],
    situationTitle: "Typisch für den Einzelhandel",
    situation: [
      "Lange Öffnungszeiten bedeuten lange Beleuchtungs- und Klimatisierungszeiten. Im Lebensmittelhandel kommt durchgängige Kühlung hinzu – entsprechend hoch ist der Stromanteil an den Betriebskosten.",
      "In Einkaufszentren oder Geschäftshäusern wird Energie teilweise über den Vermieter abgerechnet. Ob ein eigener Liefervertrag möglich ist, hängt vom Messkonzept des Gebäudes ab.",
    ],
    needs: [
      { title: "Filialen bündeln", text: "Mehrere Standorte erfassen wir übersichtlich – mit Vertragsenden je Filiale." },
      { title: "Klare Kostenstruktur", text: "Wir zeigen Arbeitspreis und Grundpreis getrennt, damit Sie Angebote wirklich vergleichen können." },
      { title: "Weniger Verwaltungsaufwand", text: "Auf Wunsch begleiten wir den Wechsel bis zur Bestätigung durch den neuen Versorger." },
    ],
    checks: ["Stromverträge je Filiale", "Messkonzept bei Mietflächen", "Preisgarantie und Laufzeit", "Gasvertrag, sofern eigene Heizung vorhanden"],
    faq: [
      { question: "Wir haben nur einen kleinen Laden – lohnt sich das?", answer: "Eine Prüfung ist für Sie kostenlos und unverbindlich. Gerade kleinere Gewerbeverträge laufen oft in Anschlusskonditionen weiter, die selten geprüft werden." },
      { question: "Können Sie mehrere Filialen gleichzeitig betreuen?", answer: "Ja. Senden Sie uns die Rechnungen der Standorte – wir erstellen eine Übersicht mit Vertragsenden und Handlungsbedarf." },
    ],
  },
  {
    slug: "praxen",
    name: "Arzt- & Therapiepraxen",
    short: "Praxen",
    icon: "stethoscope",
    metaTitle: "Energieberatung für Arztpraxen, Zahnarztpraxen & Therapiepraxen",
    metaDescription:
      "Medizintechnik, IT, Sterilisation, Klima: KG Business prüft Strom- und Gasverträge für Praxen – verlässlich, diskret und mit möglichst wenig Aufwand für Ihr Team.",
    heroTitle: "Ihre Praxis braucht Verlässlichkeit – auch beim Energievertrag.",
    heroLead:
      "Medizintechnik, Praxis-IT und Sterilisation brauchen eine stabile Versorgung. Wir übernehmen den Vergleich und die Vorbereitung, damit Sie sich auf Ihre Patientinnen und Patienten konzentrieren können.",
    teaser: "Medizintechnik, IT und Klima – zuverlässig versorgt, wenig Aufwand.",
    energy: ["strom", "gas"],
    consumers: ["Medizintechnik und Diagnostikgeräte", "Sterilisation und Hygienetechnik", "Praxis-IT und Server", "Klimatisierung", "Etagenheizung (häufig Gas)"],
    situationTitle: "Typisch für Praxen",
    situation: [
      "Praxen haben überwiegend einen gleichmäßigen Verbrauch während der Sprechzeiten, ergänzt um Geräte, die dauerhaft laufen. Ein Lieferantenwechsel ändert nichts an der physischen Versorgung: Strom und Gas kommen weiterhin über das örtliche Netz.",
      "Für Praxisinhaberinnen und -inhaber ist vor allem der Zeitaufwand entscheidend. Deshalb setzen wir auf einen kurzen Start – Rechnung hochladen, Rückruf vereinbaren.",
    ],
    needs: [
      { title: "Minimaler Aufwand", text: "Rechnung hochladen, Rückrufzeit nennen – den Rest bereiten wir vor." },
      { title: "Versorgungssicherheit verstehen", text: "Wir erklären, warum ein Versorgerwechsel die Netzversorgung nicht unterbricht." },
      { title: "Praxis und Privat getrennt", text: "Wenn Praxis- und Privaträume im selben Haus liegen, prüfen wir beide Verträge sauber getrennt." },
    ],
    checks: ["Stromvertrag der Praxis", "Gasvertrag bei eigener Heizung", "Laufzeiten und Preisanpassungen", "Abschlagshöhe"],
    faq: [
      { question: "Kann es beim Wechsel zu einer Unterbrechung kommen?", answer: "Nein, ein Lieferantenwechsel erfolgt ohne Unterbrechung der Versorgung. Der Netzbetreiber bleibt derselbe, nur der Vertragspartner für die Energielieferung ändert sich." },
      { question: "Gehen Sie mit unseren Daten vertraulich um?", answer: "Ja. Wir verwenden Ihre Angaben ausschließlich zur Bearbeitung Ihrer Anfrage. Details finden Sie in unserer Datenschutzerklärung." },
    ],
  },
  {
    slug: "gewerbeimmobilien",
    name: "Gewerbeimmobilien",
    short: "Gewerbeimmobilien",
    icon: "buildings",
    metaTitle: "Energieverträge für Gewerbeimmobilien & Immobilienportfolios",
    metaDescription:
      "Allgemeinflächen, Leerstand, Mieterwechsel: KG Business unterstützt Eigentümer und Betreiber von Gewerbeimmobilien beim strukturierten Vergleich von Strom- und Gasverträgen.",
    heroTitle: "Für Eigentümer und Betreiber: Energieverträge über das ganze Portfolio.",
    heroLead:
      "Allgemeinflächen, Leerstände, Mieterwechsel und Weiterberechnung: Bei Gewerbeimmobilien ist der Energievertrag Teil der Bewirtschaftung. Wir schaffen Ordnung und vergleichen Angebote objektübergreifend.",
    teaser: "Allgemeinflächen, Leerstand und Mieterwechsel objektübergreifend steuern.",
    energy: ["strom", "gas"],
    consumers: ["Allgemeinflächen und Außenanlagen", "Zentrale Heizungsanlagen", "Aufzüge, Lüftung, Gebäudetechnik", "Leerstehende Mieteinheiten", "Ladeinfrastruktur und Parkflächen"],
    situationTitle: "Typisch für Gewerbeimmobilien",
    situation: [
      "In gemischt genutzten Objekten wird Energie häufig zentral beschafft und anteilig weiterberechnet. Dafür sind saubere Messkonzepte und klare Vertragsstrukturen entscheidend.",
      "Leerstände und Mieterwechsel führen dazu, dass Lieferstellen kurzfristig auf den Eigentümer zurückfallen. Ohne Vertrag rutschen sie in die Grund- oder Ersatzversorgung.",
    ],
    needs: [
      { title: "Portfolio-Übersicht", text: "Alle Lieferstellen mit Verbrauch, Versorger und Vertragsende in einer Struktur." },
      { title: "Leerstand absichern", text: "Wir achten darauf, dass zurückfallende Lieferstellen nicht in teuren Tarifen landen." },
      { title: "Bündelung prüfen", text: "Ob gemeinsame Verträge über mehrere Objekte Vorteile bringen, klären wir mit konkreten Angeboten." },
    ],
    checks: ["Verträge für Allgemein- und Leerstandsflächen", "Zentrale Heizgasversorgung", "Vertragsenden je Objekt", "Weiterberechnung an Mietparteien (Abrechnungsstruktur)"],
    faq: [
      { question: "Wir verwalten mehrere Objekte in verschiedenen Städten – ist das ein Problem?", answer: "Nein. Die Energiebelieferung ist in ganz Deutschland möglich. Wir beraten bundesweit, mit Schwerpunkt in Nordrhein-Westfalen." },
      { question: "Wie gehen Sie mit vielen Zählpunkten um?", answer: "Am besten erhalten wir eine Liste mit Zählpunkt-Nummern, Adressen und Verbräuchen. Daraus erstellen wir eine strukturierte Übersicht für die Angebotsanfrage." },
    ],
  },
  {
    slug: "produktionsbetriebe",
    name: "Produktionsbetriebe",
    short: "Produktion",
    icon: "factory",
    metaTitle: "Energieberatung für Produktionsbetriebe – Lastgang, RLM & Gewerbegas",
    metaDescription:
      "Hoher Verbrauch, Lastspitzen, Prozesswärme: KG Business analysiert Strom- und Gasverträge produzierender Unternehmen und vergleicht Angebote auf Basis Ihres Lastgangs.",
    heroTitle: "Wenn Energie ein Produktionsfaktor ist, zählt jedes Detail im Vertrag.",
    heroLead:
      "In der Produktion sind Strom und Gas direkte Kostenfaktoren. Wir analysieren Ihre Verträge auf Basis von Lastgang, Leistungsspitzen und Laufzeiten – und holen Angebote ein, die zu Ihrem Profil passen.",
    teaser: "Lastgang, Leistungsspitzen und Prozesswärme – Verträge für hohen Verbrauch.",
    energy: ["strom", "gas"],
    consumers: ["Produktionsmaschinen und Antriebe", "Druckluft und Kälteanlagen", "Prozesswärme mit Gas", "Hallenbeleuchtung und Lüftung", "Schichtbetrieb mit Nachtlast"],
    situationTitle: "Typisch für Produktionsbetriebe",
    situation: [
      "Produzierende Unternehmen werden in der Regel per registrierender Leistungsmessung (RLM) abgerechnet. Der viertelstündliche Lastgang zeigt, wann wie viel Leistung benötigt wird – und ist die Grundlage für passende Angebote.",
      "Bei hohen Verbräuchen kommen neben Festpreisangeboten auch andere Beschaffungsmodelle in Betracht. Ob das für Ihr Unternehmen sinnvoll ist, klären wir individuell – ohne Standardlösung von der Stange.",
    ],
    needs: [
      { title: "Lastgang als Basis", text: "Wir nutzen Ihre Lastgangdaten, damit Angebote auf Ihrem tatsächlichen Verbrauchsverhalten beruhen." },
      { title: "Leistungsspitzen verstehen", text: "Wir zeigen, welchen Anteil der Leistungspreis an Ihren Netzkosten hat." },
      { title: "Steuern und Umlagen im Blick", text: "Für produzierende Unternehmen können steuerliche Entlastungen relevant sein. Wir weisen darauf hin, wo eine Prüfung durch Ihre Steuerberatung sinnvoll ist." },
    ],
    checks: ["Lastgang (Viertelstundenwerte)", "Arbeits-, Leistungs- und Grundpreise", "Gasvertrag für Prozesswärme", "Laufzeiten, Preisgarantien und Preisanpassungsklauseln"],
    faq: [
      { question: "Woher bekomme ich meinen Lastgang?", answer: "Den Lastgang stellen Ihr Messstellenbetreiber, Netzbetreiber oder Ihr aktueller Versorger bereit – häufig als Excel- oder CSV-Datei. Wir helfen bei der Anforderung." },
      { question: "Beraten Sie auch zu Energiesteuern?", answer: "Wir weisen auf mögliche Entlastungstatbestände hin. Eine verbindliche steuerliche Beratung kann nur Ihre Steuerberatung leisten." },
    ],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
