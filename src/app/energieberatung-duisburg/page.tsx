import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { FeatureGrid, type Feature } from "@/components/sections/FeatureGrid";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/content/company";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Energieberatung Duisburg – Gewerbestrom & Gewerbegas vergleichen",
  description:
    "Energieberatung mit Sitz in Duisburg: KG Business prüft Strom- und Gasverträge für Unternehmen und Haushalte in Duisburg, im Ruhrgebiet und am Niederrhein – persönlich und unverbindlich.",
  path: "/energieberatung-duisburg",
});

const local: Feature[] = [
  { icon: "mapPin", title: "Sitz in Duisburg", text: `Unser Büro: ${company.address.street}, ${company.address.postalCode} ${company.address.city}. Kurze Wege, persönliche Ansprechpartner.` },
  { icon: "factory", title: "Gewerbe zwischen Rhein und Ruhr", text: "Ob Handwerksbetrieb, Einzelhandel oder Produktion: Wir berücksichtigen das Verbrauchsprofil Ihres Betriebs statt pauschaler Standardangebote." },
  { icon: "phone", title: "Direkt erreichbar", text: `Telefon ${company.phone.display} oder E-Mail an ${company.email} – ohne Callcenter und Warteschleife.` },
];

const faq = [
  {
    question: "Beraten Sie auch außerhalb von Duisburg?",
    answer: `Ja. Neben Duisburg beraten wir Unternehmen und Haushalte unter anderem in ${company.serviceArea.focus.filter((c) => c !== "Duisburg").join(", ")} sowie bundesweit. Beratung und Wechsel funktionieren telefonisch und digital.`,
  },
  {
    question: "Welcher Netzbetreiber ist für meine Lieferstelle zuständig?",
    answer: "Das steht auf Ihrer Strom- bzw. Gasrechnung. Der Netzbetreiber bleibt beim Lieferantenwechsel unverändert – es ändert sich nur Ihr Energielieferant.",
  },
];

export default function DuisburgPage() {
  return (
    <>
      <PageHero
        eyebrow="Energieberatung Duisburg"
        title={
          <>
            Energieberatung in Duisburg – <span className="text-energy-300">für Gewerbe und Haushalte.</span>
          </>
        }
        lead="Strom und Gas für Unternehmen und Privathaushalte prüfen, vergleichen und wechseln: mit einem persönlichen Ansprechpartner aus Duisburg."
        breadcrumbs={[{ name: "Energieberatung Duisburg", path: "/energieberatung-duisburg" }]}
        actions={
          <>
            <ButtonLink href="/energie-check" size="lg" icon="arrow">
              Energie-Check starten
            </ButtonLink>
            <ButtonLink href={company.phone.href} size="lg" variant="ghost-dark" iconLeft="phone">
              {company.phone.display}
            </ButtonLink>
          </>
        }
      />
      <section className="py-20 sm:py-24" aria-labelledby="lokal-title">
        <div className="container-page">
          <SectionHeading
            id="lokal-title"
            eyebrow="Vor Ort"
            title="Aus Duisburg – für die Region und darüber hinaus."
            lead="Duisburg und das westliche Ruhrgebiet sind geprägt von Handwerk, Logistik, Handel und Industrie. Entsprechend unterschiedlich sind die Anforderungen an Strom- und Gasverträge."
          />
          <div className="mt-12">
            <FeatureGrid items={local} />
          </div>
        </div>
      </section>
      <section className="bg-soft py-20 sm:py-24" aria-labelledby="gebiet-title">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading id="gebiet-title" eyebrow="Einsatzgebiet" title="Wo wir beraten" />
            <p className="mt-6 text-lg leading-relaxed text-ink/90">
              Unser Büro ist in Duisburg. Unser Beratungsschwerpunkt liegt in Nordrhein-Westfalen; Anfragen aus ganz Deutschland sind
              willkommen.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[...company.serviceArea.focus, "Nordrhein-Westfalen", "Bundesweit"].map((c) => (
              <li key={c} className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 font-semibold text-navy-900">
                <Icon name="mapPin" className="size-4 shrink-0 text-energy-700" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="py-20 sm:py-24" aria-labelledby="faq-title">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Fragen zur Beratung in Duisburg" />
          <FaqList items={faq} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
