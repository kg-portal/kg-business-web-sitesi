import { CostCalculator } from "@/components/forms/CostCalculator";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { FeatureGrid, type Feature } from "@/components/sections/FeatureGrid";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { RelatedArticles } from "@/components/sections/RelatedArticles";
import { StartCard } from "@/components/sections/StartCard";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SymbolImage } from "@/components/ui/SymbolImage";
import { serviceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const PATH = "/gewerbegas";
const DESCRIPTION =
  "Gewerbegas vergleichen: KG Business prüft Gasverbrauch, Gaskosten, CO₂-Anteil, Laufzeit und Preisgarantie Ihres Gasvertrags und begleitet den Anbieterwechsel – persönlich und unverbindlich.";

export const metadata = buildMetadata({
  title: "Gewerbegas vergleichen – Gasverträge für Unternehmen",
  description: DESCRIPTION,
  path: PATH,
});

const usage: Feature[] = [
  { icon: "building", title: "Heizung & Warmwasser", text: "Büros, Praxen, Ladenlokale, Hotels und Wohnanlagen – der häufigste Einsatz von Gas im Gewerbe." },
  { icon: "utensils", title: "Küche & Gastronomie", text: "Gasherde, Kombidämpfer und Spülküchen brauchen eine verlässliche, gut kalkulierbare Versorgung." },
  { icon: "factory", title: "Prozesswärme", text: "Trocknung, Backöfen, Lackierkabinen oder Produktionsprozesse – hier ist Gas ein direkter Kostenfaktor." },
];

const checks: Feature[] = [
  { icon: "gauge", title: "Gasverbrauch", text: "Wir prüfen Verbrauch und Umrechnung von m³ in kWh – und ob Zählerstände abgelesen oder geschätzt wurden." },
  { icon: "euro", title: "Gaskosten", text: "Arbeitspreis, Grundpreis und der Anteil von CO₂-Preis und Energiesteuer werden transparent gegenübergestellt." },
  { icon: "fileSearch", title: "Vertragsprüfung", text: "Preisanpassungsklauseln, Preisgarantie und automatische Verlängerung lesen wir für Sie im Detail." },
  { icon: "calendar", title: "Laufzeiten", text: "Wir stimmen die Laufzeit auf Heizperiode, Pachtvertrag und geplante Investitionen ab." },
  { icon: "scale", title: "Tarifvergleich", text: "Angebote mehrerer Versorger für Ihre Lieferstelle – vergleichbar gemacht auf Basis Ihres Verbrauchs." },
  { icon: "route", title: "Anbieterwechsel", text: "Kündigung, Vollmacht, Zählerstand zum Wechseltag: Wir begleiten den Wechsel bis zur Bestätigung." },
];

const faq = [
  {
    question: "Warum rechnet mein Versorger in kWh, obwohl der Zähler m³ misst?",
    answer: "Abgerechnet wird der Energiegehalt des Gases. Dazu wird das Volumen mit Zustandszahl und Brennwert in Kilowattstunden umgerechnet. Beide Werte stehen auf Ihrer Rechnung.",
  },
  {
    question: "Wie wirkt sich der CO₂-Preis auf meinen Gasvertrag aus?",
    answer:
      "Für Erdgas fällt nach dem Brennstoffemissionshandelsgesetz ein CO₂-Preis an, 2026 innerhalb eines Preiskorridors von 55 bis 65 Euro pro Tonne. Lieferanten berücksichtigen ihn im Arbeitspreis oder weisen ihn gesondert aus. Wir zeigen Ihnen, wie Ihr Angebot das handhabt.",
  },
  {
    question: "Ist die Gasspeicherumlage noch Bestandteil meines Preises?",
    answer: "Nein, die Gasspeicherumlage ist seit dem 1. Januar 2026 abgeschafft. Lieferanten müssen solche Senkungen bei der nächsten Preisanpassung berücksichtigen.",
  },
  {
    question: "Wann ist der richtige Zeitpunkt für einen Wechsel?",
    answer:
      "Entscheidend ist Ihr Vertragsende bzw. Ihre Kündigungsfrist. Wir ermitteln den frühestmöglichen Termin und holen rechtzeitig Angebote ein – Prognosen über Marktpreise geben wir bewusst nicht ab.",
  },
  {
    question: "Kann ich Strom und Gas gemeinsam prüfen lassen?",
    answer: "Ja. Im Energie-Check wählen Sie „Strom und Gas“. Wir betrachten beide Verträge und achten auf sinnvolle Laufzeiten.",
  },
];

export default function GewerbegasPage() {
  return (
    <>
      <PageHero
        eyebrow="Gewerbegas"
        title={
          <>
            Gewerbegas vergleichen – <span className="text-energy-300">für Heizung, Küche und Prozesswärme.</span>
          </>
        }
        lead="Gasverträge im Gewerbe sind oft lange nicht geprüft worden. Wir analysieren Verbrauch, Preisbestandteile und Vertragsbedingungen und holen passende Angebote für Ihre Lieferstelle ein."
        breadcrumbs={[{ name: "Gewerbegas", path: PATH }]}
        actions={
          <>
            <ButtonLink href="/energie-check?kundentyp=gewerbe&energie=gas" size="lg" icon="arrow">
              Gasvertrag prüfen lassen
            </ButtonLink>
            <ButtonLink href="#kosten" size="lg" variant="ghost-dark">
              Gaskosten verstehen
            </ButtonLink>
          </>
        }
        aside={
          <StartCard
            items={[
              "Letzte Gas-Jahresrechnung oder Jahresverbrauch in kWh",
              "Postleitzahl der Lieferstelle",
              "Vertragsende und aktueller Versorger, falls bekannt",
              "Bei mehreren Lieferstellen: Liste der Standorte",
            ]}
            href="/energie-check?kundentyp=gewerbe&energie=gas"
          />
        }
      />

      <section className="py-20 sm:py-24" aria-labelledby="einsatz-title">
        <div className="container-page">
          <SectionHeading
            id="einsatz-title"
            eyebrow="Gewerbliche Versorgung"
            title="Wofür Ihr Betrieb Gas braucht, bestimmt den passenden Vertrag."
            lead="Ein Heizgasvertrag für ein Bürohaus stellt andere Anforderungen als die Versorgung einer Großküche oder einer Produktionslinie."
          />
          <div className="mt-12">
            <FeatureGrid items={usage} />
          </div>
        </div>
      </section>

      <section id="kosten" className="scroll-mt-24 bg-soft py-20 sm:py-24" aria-labelledby="kosten-title">
        <div className="container-page grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="kosten-title"
              eyebrow="Gasverbrauch & Gaskosten"
              title="Vom Kubikmeter zur Rechnung."
              lead="Ihr Zähler misst Kubikmeter, abgerechnet werden Kilowattstunden. Und nur ein Teil des Preises ist zwischen Versorgern verhandelbar."
            />
            <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-card">
              <p className="text-sm font-semibold text-muted">Umrechnung auf Ihrer Gasrechnung</p>
              <p className="mt-3 font-display text-lg font-bold leading-relaxed text-navy-900 sm:text-xl">
                kWh = m³ × Zustandszahl × Brennwert
              </p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
                Der <strong className="text-navy-900">Brennwert</strong> beschreibt den Energiegehalt des Gases, die{" "}
                <strong className="text-navy-900">Zustandszahl</strong> berücksichtigt Druck und Temperatur am Zähler.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            <div className="border-b border-line px-6 py-4">
              <p className="font-display font-bold text-navy-900">Preisbestandteile Gas 2026</p>
              <p className="text-sm text-muted">netto, Stand Oktober 2026 – ohne Gewähr</p>
            </div>
            <dl className="divide-y divide-line">
              {[
                ["Beschaffung, Vertrieb, Marge", "anbieterabhängig – im Wettbewerb", true],
                ["Netzentgelte & Messstellenbetrieb", "netzgebietsabhängig", false],
                ["Energiesteuer (Heizgas)", "0,55 ct/kWh", false],
                ["CO₂-Preis (BEHG)", "Korridor 55–65 €/t", false],
                ["Konzessionsabgabe (Sondervertrag)", "max. 0,03 ct/kWh", false],
                ["Gasspeicherumlage", "seit 01.01.2026 entfallen", false],
                ["Umsatzsteuer", "19 %", false],
              ].map(([label, value, highlight]) => (
                <div key={label as string} className="flex flex-col gap-1 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <dt className="flex items-center gap-2 text-[0.95rem] font-medium text-navy-900">
                    {highlight ? <span className="size-2 rounded-full bg-energy-400" aria-hidden="true" /> : null}
                    {label}
                  </dt>
                  <dd className="text-[0.95rem] text-muted">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="border-t border-line bg-soft/60 px-6 py-3 text-xs text-muted">
              Quellen und Erläuterungen im Ratgeber „Gewerbegas verstehen“.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="pruefen-title">
        <div className="container-page">
          <SectionHeading
            id="pruefen-title"
            eyebrow="Was wir prüfen"
            title="Ihr Gasvertrag im Detail."
            lead="Von der Verbrauchsangabe bis zur Preisanpassungsklausel: Wir prüfen, was in Ihrem Vertrag steht – und was ein neues Angebot besser machen kann."
          />
          <div className="mt-12">
            <FeatureGrid items={checks} />
          </div>
        </div>
      </section>

      <section className="pb-16" aria-labelledby="heizperiode-title">
        <div className="container-page">
          <div className="grid overflow-hidden rounded-[2rem] border border-line bg-white shadow-card lg:grid-cols-2">
            <SymbolImage src="/images/gastronomie-beratung.jpg" alt="Beratung zu Gasverträgen in einem Gastronomiebetrieb" className="min-h-72" />
            <div className="p-8 sm:p-12">
              <SectionHeading
                id="heizperiode-title"
                eyebrow="Laufzeit & Heizperiode"
                title="Planbar durch den Winter."
                lead="Der größte Teil des Gasverbrauchs fällt in der Heizperiode an. Deshalb zählt, welche Preisbestandteile über diese Zeit garantiert sind."
              />
              <ul className="mt-6 space-y-3">
                {[
                  "Umfang der Preisgarantie über die gesamte Heizperiode prüfen",
                  "Abschläge realistisch ansetzen – weder Liquidität binden noch Nachzahlungen riskieren",
                  "Vertragsende nicht mitten in die Heizperiode legen, wenn es vermeidbar ist",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <Icon name="checkCircle" className="mt-0.5 size-5 shrink-0 text-energy-700" />
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8" aria-label="Jahreskosten-Rechner Gas">
        <div className="container-page">
          <CostCalculator energy="gas" />
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="ablauf-title">
        <div className="container-page">
          <SectionHeading id="ablauf-title" eyebrow="Ablauf" title="So prüfen wir Ihren Gasvertrag." align="center" />
          <div className="mt-12">
            <ProcessSteps />
          </div>
        </div>
      </section>

      <section className="bg-soft py-20 sm:py-24" aria-labelledby="faq-title">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Fragen zu Gewerbegas" />
          <FaqList items={faq} />
        </div>
      </section>

      <RelatedArticles slugs={["gewerbegas-verstehen", "vertragslaufzeiten", "anbieterwechsel"]} />
      <CtaBand
        title="Wann haben Sie Ihren Gasvertrag zuletzt geprüft?"
        lead="Senden Sie uns Ihre Gasrechnung – wir prüfen Konditionen und Fristen und melden uns mit einer verständlichen Einschätzung."
        href="/energie-check?kundentyp=gewerbe&energie=gas"
        cta="Gewerbegas-Check starten"
      />
      <JsonLd data={serviceSchema({ name: "Gewerbegas-Vergleich und Beratung", serviceType: "Energieberatung Gewerbegas", description: DESCRIPTION, path: PATH })} />
    </>
  );
}
