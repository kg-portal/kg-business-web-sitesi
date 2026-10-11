import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { FeatureGrid, type Feature } from "@/components/sections/FeatureGrid";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { RelatedArticles } from "@/components/sections/RelatedArticles";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SymbolImage } from "@/components/ui/SymbolImage";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Strom & Gas für Privathaushalte – Tarif prüfen und wechseln",
  description:
    "KG Business unterstützt auch Privathaushalte: Strom- und Gastarif prüfen, Angebote verständlich vergleichen und den Anbieterwechsel begleiten – kostenfrei und unverbindlich.",
  path: "/privatkunden",
});

const help: Feature[] = [
  { icon: "fileSearch", title: "Tarif und Rechnung prüfen", text: "Wir lesen Ihre Abrechnung, ordnen Preise und Abschläge ein und erklären, was Sie aktuell zahlen." },
  { icon: "scale", title: "Angebote verständlich vergleichen", text: "Bruttopreise inklusive Umsatzsteuer, Laufzeit, Preisgarantie und Bonus – übersichtlich gegenübergestellt." },
  { icon: "route", title: "Wechsel begleiten", text: "Wir unterstützen bei Vertrag, Kündigung und Fristen – bis der neue Lieferbeginn bestätigt ist." },
];

const faq = [
  {
    question: "Lohnt sich ein Wechsel auch bei geringem Verbrauch?",
    answer: "Das hängt vom Verhältnis zwischen Grundpreis und Arbeitspreis ab. Bei kleinem Verbrauch fällt der Grundpreis stärker ins Gewicht – genau das berücksichtigen wir beim Vergleich.",
  },
  {
    question: "Kann ich Strom und Gas gleichzeitig prüfen lassen?",
    answer: "Ja. Wählen Sie im Energie-Check einfach „Strom und Gas“. Wir prüfen beide Verträge zusammen.",
  },
  {
    question: "Was kostet mich die Beratung?",
    answer:
      "Für Sie ist die Beratung in der Regel kostenfrei. Wir erhalten bei erfolgreicher Vermittlung eine Provision vom Energieversorger – das sagen wir offen.",
  },
];

export default function PrivatkundenPage() {
  return (
    <>
      <PageHero
        eyebrow="Privatkunden"
        title={
          <>
            Strom und Gas für Ihr Zuhause – <span className="text-energy-300">verständlich statt kompliziert.</span>
          </>
        }
        lead="Grundversorgung, Preiserhöhung, Umzug oder auslaufende Preisgarantie: Wir prüfen Ihre Tarife und begleiten Sie persönlich beim Wechsel."
        breadcrumbs={[{ name: "Privatkunden", path: "/privatkunden" }]}
        actions={
          <>
            <ButtonLink href="/energie-check?kundentyp=privat" size="lg" icon="arrow">
              Privat-Check starten
            </ButtonLink>
            <ButtonLink href="/kontakt" size="lg" variant="ghost-dark" iconLeft="phone">
              Persönlich beraten lassen
            </ButtonLink>
          </>
        }
      />

      <section className="relative z-10 -mt-10 pb-8" aria-label="Privatstrom und Privatgas">
        <div className="container-page grid grid-cols-1 gap-5 md:grid-cols-2">
          {[
            { href: "/privatkunden/strom", icon: "zap" as const, title: "Privatstrom", text: "Haushaltsstrom prüfen – von der Grundversorgung bis zur Wärmepumpe." },
            { href: "/privatkunden/gas", icon: "flame" as const, title: "Privatgas", text: "Gas für Heizung und Warmwasser – inklusive CO₂-Preis verständlich erklärt." },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex items-start gap-5 rounded-2xl border border-line bg-white p-7 shadow-lift transition-all duration-300 hover:-translate-y-1 hover:border-electric-500/40"
            >
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 text-white">
                <Icon name={c.icon} className="size-6" />
              </span>
              <span>
                <span className="flex items-center gap-2 font-display text-xl font-bold text-navy-900">
                  {c.title}
                  <Icon name="arrow" className="size-5 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="mt-1.5 block leading-relaxed text-muted">{c.text}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="hilfe-title">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading
              id="hilfe-title"
              eyebrow="So helfen wir"
              title="Ein Ansprechpartner statt endloser Vergleichslisten."
              lead="Viele Haushalte wissen, dass ihr Tarif zu teuer sein könnte – aber nicht, wo sie anfangen sollen. Genau dort setzen wir an."
            />
            <div className="mt-10">
              <FeatureGrid items={help} columns={2} />
            </div>
          </div>
          <SymbolImage
            src="/images/privatkunden-familie.jpg"
            alt="Familie bespricht Strom- und Gastarife mit einem Berater"
            className="aspect-[4/5] rounded-3xl shadow-lift sm:aspect-[4/3] lg:aspect-[4/5]"
          />
        </div>
      </section>

      <section className="bg-soft py-16 sm:py-20" aria-labelledby="ablauf-title">
        <div className="container-page">
          <SectionHeading id="ablauf-title" eyebrow="Ablauf" title="In vier Schritten zum neuen Tarif." align="center" />
          <div className="mt-12">
            <ProcessSteps />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="faq-title">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Fragen von Privatkunden" />
          <FaqList items={faq} />
        </div>
      </section>
      <RelatedArticles slugs={["kuendigungsfristen", "anbieterwechsel", "arbeitspreis-grundpreis"]} />
      <CtaBand href="/energie-check?kundentyp=privat" cta="Privat-Check starten" />
    </>
  );
}
