import { company } from "./company";

export interface FaqItem {
  question: string;
  answer: string;
}

export const generalFaq: FaqItem[] = [
  {
    question: "Kostet die Prüfung oder Beratung etwas?",
    answer:
      "Für Sie ist die Prüfung und Beratung in der Regel kostenfrei und unverbindlich. KG Business erhält bei einer erfolgreichen Vermittlung eine Provision vom jeweiligen Energieversorger. Sollte in einem Ausnahmefall ein Entgelt anfallen, teilen wir Ihnen das vorab ausdrücklich mit.",
  },
  {
    question: "Ist KG Business selbst ein Energieversorger?",
    answer:
      "Nein. Wir sind Berater und Vermittler. Ihr Liefervertrag kommt immer direkt zwischen Ihnen und dem Energieversorger zustande. Wir helfen Ihnen, passende Angebote zu finden, zu verstehen und den Wechsel umzusetzen.",
  },
  {
    question: "Welche Angaben oder Unterlagen werden benötigt?",
    answer:
      "Am einfachsten ist Ihre letzte Jahresrechnung. Alternativ genügen Postleitzahl der Lieferstelle, Jahresverbrauch in kWh, aktueller Anbieter und – falls bekannt – das Vertragsende. Bei leistungsgemessenen Gewerbezählern hilft zusätzlich der Lastgang.",
  },
  {
    question: "Muss ich nach dem Vergleich wechseln?",
    answer: "Nein. Es besteht kein Abschlusszwang. Sie entscheiden auf Grundlage der Angebote selbst, ob und wann Sie wechseln.",
  },
  {
    question: "Wird meine Versorgung beim Anbieterwechsel unterbrochen?",
    answer:
      "Nein. Strom und Gas fließen weiterhin über das Netz Ihres örtlichen Netzbetreibers. Beim Wechsel ändert sich nur Ihr Vertragspartner für die Energielieferung – nicht die Leitung oder der Zähler.",
  },
  {
    question: "Beraten Sie nur in Duisburg?",
    answer: `Unser Sitz ist in ${company.address.city}, unser Schwerpunkt liegt in Nordrhein-Westfalen – etwa in Düsseldorf, Essen, Oberhausen, Mülheim an der Ruhr und Krefeld. Da Beratung und Wechsel telefonisch und digital funktionieren, unterstützen wir Kundinnen und Kunden bundesweit.`,
  },
  {
    question: "Zeigen Sie auf der Website konkrete Tarifpreise an?",
    answer:
      "Nein – bewusst nicht. Energiepreise hängen von Lieferstelle, Verbrauch, Netzgebiet und Zeitpunkt ab. Statt pauschaler Beispielpreise holen wir für Ihre Lieferstelle individuelle Angebote ein und erläutern sie Ihnen.",
  },
  {
    question: "Was passiert mit meinen Daten?",
    answer:
      "Wir verwenden Ihre Angaben ausschließlich zur Bearbeitung Ihrer Anfrage und – wenn Sie sich für ein Angebot entscheiden – zur Vorbereitung des Vertragsabschlusses. Einzelheiten erläutert unsere Datenschutzerklärung.",
  },
];
