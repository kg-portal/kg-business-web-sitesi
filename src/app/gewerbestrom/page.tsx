import Link from "next/link";
import { LoadProfileChart } from "@/components/art/LoadProfileChart";
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
import { industries } from "@/content/industries";
import { serviceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

const PATH = "/gewerbestrom";
const DESCRIPTION =
  "Gewerbestrom vergleichen mit persönlicher Beratung: KG Business prüft Arbeitspreis, Grundpreis, Laufzeit, Kündigungsfrist und Lastgang und begleitet Ihren Anbieterwechsel – kostenfrei für Unternehmen.";

export const metadata = buildMetadata({
  title: "Gewerbestrom vergleichen – Stromtarife für Unternehmen",
  description: DESCRIPTION,
  path: PATH,
});

const priceFeatures: Feature[] = [
  { icon: "scale", title: "Stromtarife vergleichen", text: "Wir holen Angebote verschiedener Versorger für Ihre Lieferstelle ein – passend zu Verbrauch, Netzgebiet und Lieferbeginn." },
  { icon: "zap", title: "Arbeitspreis", text: "Der Preis je Kilowattstunde wirkt mit jedem Verbrauch. Wir bewerten ihn im Verhältnis zu Ihrem tatsächlichen Jahresverbrauch." },
  { icon: "receipt", title: "Grundpreis", text: "Der feste Monatsbetrag fällt bei kleinen Verbräuchen stärker ins Gewicht. Wir zeigen, ab wann sich welcher Tarif lohnt." },
  { icon: "gauge", title: "Gewerblicher Jahresverbrauch", text: "Grundlage jedes Angebots. Liegt keine Rechnung vor, schätzen wir den Verbrauch gemeinsam anhand Ihrer Nutzung." },
  { icon: "chart", title: "Verbrauchsprofil", text: "Wann verbrauchen Sie Strom? Öffnungszeiten, Schichtbetrieb und Grundlast beeinflussen, welches Angebot passt." },
  { icon: "user", title: "Persönliche Beratung", text: "Ein fester Ansprechpartner erklärt Ihnen die Unterschiede – telefonisch, per E-Mail oder im Gespräch." },
];

const contractFeatures: Feature[] = [
  { icon: "calendar", title: "Vertragslaufzeit", text: "Wie lange binden Sie sich – und was gilt nach Ablauf? Wir achten auf stillschweigende Verlängerungen." },
  { icon: "timer", title: "Kündigungsfrist", text: "Wir ermitteln den spätesten Kündigungstermin, damit der Wechsel ohne Zeitdruck vorbereitet werden kann." },
  { icon: "shield", title: "Preisgarantie", text: "Welche Bestandteile sind tatsächlich garantiert? Der Begriff ist gesetzlich nicht definiert – entscheidend ist der Vertragstext." },
  { icon: "route", title: "Anbieterwechsel", text: "Von der Vollmacht bis zur Bestätigung des Lieferbeginns begleiten wir den Wechsel – ohne Unterbrechung der Versorgung." },
];

const faq = [
  {
    question: "Ab welchem Verbrauch spricht man von Gewerbestrom?",
    answer:
      "Es gibt keinen festen Schwellenwert. Gewerbestrom ist Strom für gewerblich genutzte Lieferstellen – vom kleinen Büro bis zur Produktionshalle. Kleine Betriebe bis 10.000 kWh Jahresverbrauch zählen rechtlich zu den Haushaltskunden und profitieren von bestimmten Schutzvorschriften.",
  },
  {
    question: "Brauche ich für ein Angebot meinen Lastgang?",
    answer:
      "Nur bei leistungsgemessenen Zählern (RLM), in der Regel ab etwa 100.000 kWh pro Jahr. Für kleinere Abnahmestellen genügt die Jahresrechnung. Den Lastgang stellen Messstellenbetreiber oder Versorger bereit – wir helfen bei der Anforderung.",
  },
  {
    question: "Wir haben mehrere Standorte. Können Sie alle prüfen?",
    answer: "Ja. Senden Sie uns die Rechnungen oder eine Liste der Lieferstellen. Wir erfassen Verbräuche und Vertragsenden je Standort und prüfen, ob eine Bündelung sinnvoll ist.",
  },
  {
    question: "Was kostet die Beratung?",
    answer:
      "Für Sie ist die Prüfung in der Regel kostenfrei. Wir erhalten bei erfolgreicher Vermittlung eine Provision vom Energieversorger. Fällt ausnahmsweise ein Entgelt an, teilen wir das vorab ausdrücklich mit.",
  },
  {
    question: "Wird der Strom beim Wechsel unterbrochen?",
    answer: "Nein. Ihr Netzbetreiber und Ihr Zähler bleiben gleich, es ändert sich nur der Vertragspartner für die Stromlieferung.",
  },
];

export default function GewerbestromPage() {
  return (
    <>
      <PageHero
        eyebrow="Gewerbestrom"
        title={
          <>
            Gewerbestrom vergleichen – <span className="text-energy-300">mit Blick auf das ganze Angebot.</span>
          </>
        }
        lead="Wir prüfen Ihren Stromvertrag, holen passende Angebote verschiedener Versorger ein und erklären die Unterschiede verständlich. Für Büros, Praxen, Handel, Handwerk und Produktion."
        breadcrumbs={[{ name: "Gewerbestrom", path: PATH }]}
        actions={
          <>
            <ButtonLink href="/energie-check?kundentyp=gewerbe&energie=strom" size="lg" icon="arrow">
              Gewerbestrom prüfen lassen
            </ButtonLink>
            <ButtonLink href="#rlm" size="lg" variant="ghost-dark">
              SLP oder RLM?
            </ButtonLink>
          </>
        }
        aside={
          <StartCard
            items={[
              "Letzte Jahresrechnung – oder Jahresverbrauch in kWh",
              "Postleitzahl der Lieferstelle",
              "Vertragsende, falls bekannt",
              "Bei Leistungsmessung: Lastgang der letzten 12 Monate",
            ]}
            href="/energie-check?kundentyp=gewerbe&energie=strom"
          />
        }
      />

      <section className="py-20 sm:py-24" aria-labelledby="pruefen-title">
        <div className="container-page">
          <SectionHeading
            id="pruefen-title"
            eyebrow="Was wir prüfen"
            title="Preise, Verbrauch und Vertrag – im Zusammenhang bewertet."
            lead="Ein niedriger Arbeitspreis allein macht noch kein gutes Angebot. Wir betrachten, wie Preise, Verbrauchsprofil und Vertragsbedingungen zusammenwirken."
          />
          <div className="mt-12">
            <FeatureGrid items={priceFeatures} />
          </div>
        </div>
      </section>

      <section id="rlm" className="relative scroll-mt-24 overflow-hidden bg-soft py-20 sm:py-24" aria-labelledby="rlm-title">
        <div className="bg-grid-light absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
        <div className="container-page relative">
          <SectionHeading
            id="rlm-title"
            eyebrow="Messung & Lastgang"
            title="Standardlastprofil oder Leistungsmessung?"
            lead="Wie Ihr Zähler misst, verändert Abrechnung und Angebot. Wir berücksichtigen beides – und sagen Ihnen, welche Unterlagen wirklich nötig sind."
          />
          <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {[
                {
                  tag: "SLP",
                  title: "Standardlastprofil",
                  range: "in der Regel bis ca. 100.000 kWh/Jahr",
                  points: ["Gemessen wird der Gesamtverbrauch", "Typischer Verlauf wird unterstellt", "Arbeitspreis + Grundpreis", "Jahresrechnung genügt"],
                },
                {
                  tag: "RLM",
                  title: "Registrierende Leistungsmessung",
                  range: "in der Regel ab ca. 100.000 kWh/Jahr",
                  points: ["Viertelstundenwerte (Lastgang)", "Leistungsspitzen werden erfasst", "Arbeitspreis + Leistungspreis (Netz)", "Lastgang verbessert das Angebot"],
                },
              ].map((c) => (
                <div key={c.tag} className="rounded-2xl border border-line bg-white p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-navy-900 px-2.5 py-1 font-display text-sm font-bold text-white">{c.tag}</span>
                    <h3 className="text-lg font-bold">{c.title}</h3>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-electric-600">{c.range}</p>
                  <ul className="mt-4 space-y-2.5">
                    {c.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-[0.95rem] text-ink">
                        <Icon name="check" className="mt-0.5 size-4 shrink-0 text-energy-700" strokeWidth={2.5} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="text-sm leading-relaxed text-muted sm:col-span-2 lg:col-span-1 xl:col-span-2">
                Die Abgrenzung ergibt sich seit 2026 aus Festlegungen der Bundesnetzagentur; maßgeblich ist das Messkonzept Ihres
                Netzbetreibers. Mehr dazu im Ratgeber{" "}
                <Link href="/ratgeber/gewerbestrom-verstehen#slp-rlm" className="link-inline">
                  Gewerbestrom verstehen
                </Link>
                .
              </p>
            </div>
            <LoadProfileChart />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="vertrag-title">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading
              id="vertrag-title"
              eyebrow="Vertrag & Wechsel"
              title="Fristen, Garantien und der Wechsel selbst."
              lead="Die besten Konditionen nützen nichts, wenn die Kündigungsfrist verstreicht. Wir behalten Laufzeiten und Termine für Sie im Blick."
            />
            <div className="mt-8 rounded-2xl border border-line bg-soft p-6">
              <p className="font-display font-bold text-navy-900">Nur ein Teil des Strompreises ist verhandelbar</p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                Beschaffung, Vertrieb und Marge stehen im Wettbewerb. Netzentgelte, Messstellenbetrieb, Konzessionsabgabe, Umlagen und
                Steuern sind für alle Versorger im selben Netzgebiet gleich.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Beschaffung", "Vertrieb", "Marge"].map((t) => (
                  <span key={t} className="rounded-full bg-energy-400/20 px-3 py-1 text-xs font-semibold text-energy-700">
                    {t}
                  </span>
                ))}
                {["Netzentgelte", "Messung", "Konzessionsabgabe", "Umlagen", "Stromsteuer", "USt."].map((t) => (
                  <span key={t} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted ring-1 ring-line">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <FeatureGrid items={contractFeatures} columns={2} />
        </div>
      </section>

      <section className="pb-8" aria-label="Jahreskosten-Rechner">
        <div className="container-page">
          <CostCalculator energy="strom" />
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="ablauf-title">
        <div className="container-page">
          <SectionHeading id="ablauf-title" eyebrow="Ablauf" title="So läuft Ihr Gewerbestrom-Check ab." align="center" />
          <div className="mt-12">
            <ProcessSteps />
          </div>
        </div>
      </section>

      <section className="bg-soft py-16 sm:py-20" aria-labelledby="branchen-title">
        <div className="container-page">
          <SectionHeading
            id="branchen-title"
            eyebrow="Branchen"
            title="Gewerbestrom für Ihre Branche"
            lead="Kühlung rund um die Uhr, Maschinen mit Lastspitzen oder viele Lieferstellen – lesen Sie, worauf es in Ihrer Branche ankommt."
          />
          <ul className="mt-10 flex flex-wrap gap-3">
            {industries.map((i) => (
              <li key={i.slug}>
                <Link
                  href={`/branchen/${i.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:border-electric-500 hover:text-electric-600"
                >
                  <Icon name={i.icon} className="size-4" />
                  {i.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="faq-title">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Fragen zu Gewerbestrom" />
          <FaqList items={faq} />
        </div>
      </section>

      <RelatedArticles slugs={["gewerbestrom-verstehen", "arbeitspreis-grundpreis", "kuendigungsfristen"]} />
      <CtaBand
        title="Wie gut ist Ihr aktueller Stromvertrag?"
        lead="Laden Sie Ihre Rechnung hoch oder nennen Sie uns Ihren Verbrauch. Wir prüfen Ihren Vertrag und melden uns persönlich."
        href="/energie-check?kundentyp=gewerbe&energie=strom"
        cta="Gewerbestrom-Check starten"
      />
      <JsonLd
        data={serviceSchema({ name: "Gewerbestrom-Vergleich und Beratung", serviceType: "Energieberatung Gewerbestrom", description: DESCRIPTION, path: PATH })}
      />
    </>
  );
}
