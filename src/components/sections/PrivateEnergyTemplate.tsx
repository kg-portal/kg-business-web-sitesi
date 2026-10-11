import { CostCalculator } from "@/components/forms/CostCalculator";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { RelatedArticles } from "@/components/sections/RelatedArticles";
import { StartCard } from "@/components/sections/StartCard";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PrivateEnergyPage } from "@/content/private";
import { serviceSchema } from "@/lib/schema";

export function PrivateEnergyTemplate({ page }: { page: PrivateEnergyPage }) {
  const checkHref = `/energie-check?kundentyp=privat&energie=${page.energy}`;
  return (
    <>
      <PageHero
        eyebrow={page.name}
        title={page.heroTitle}
        lead={page.heroLead}
        breadcrumbs={[
          { name: "Privatkunden", path: "/privatkunden" },
          { name: page.name, path: page.path },
        ]}
        actions={
          <ButtonLink href={checkHref} size="lg" icon="arrow">
            {page.energy === "strom" ? "Stromtarif prüfen lassen" : "Gastarif prüfen lassen"}
          </ButtonLink>
        }
        aside={
          <StartCard
            items={[
              "Letzte Jahresabrechnung – oder Ihr Jahresverbrauch",
              "Postleitzahl Ihrer Wohnung oder Ihres Hauses",
              "Aktueller Anbieter und Vertragsende, falls bekannt",
            ]}
            href={checkHref}
          />
        }
      />
      <section className="py-20 sm:py-24" aria-labelledby="anlaesse-title">
        <div className="container-page">
          <SectionHeading id="anlaesse-title" eyebrow="Wann sich ein Check lohnt" title={page.situationsTitle} />
          <div className="mt-12">
            <FeatureGrid items={page.situations} />
          </div>
        </div>
      </section>
      <section className="bg-soft py-20 sm:py-24" aria-labelledby="rechte-title">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            id="rechte-title"
            eyebrow="Verbraucherrechte"
            title={page.rightsTitle}
            lead="Kurz zusammengefasst – ausführlich und mit Quellen in unserem Ratgeber."
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {page.rights.map((r) => (
              <li key={r.title} className="rounded-2xl border border-line bg-white p-5 shadow-card">
                <p className="flex items-start gap-2.5 font-display font-bold text-navy-900">
                  <Icon name="checkCircle" className="mt-0.5 size-5 shrink-0 text-energy-700" />
                  {r.title}
                </p>
                <p className="mt-2 pl-7.5 text-[0.95rem] leading-relaxed text-muted">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="py-16" aria-label="Jahreskosten-Rechner">
        <div className="container-page">
          <CostCalculator energy={page.energy} />
        </div>
      </section>
      <section className="pb-16 sm:pb-20" aria-labelledby="ablauf-title">
        <div className="container-page">
          <SectionHeading id="ablauf-title" eyebrow="Ablauf" title="So einfach geht’s." align="center" />
          <div className="mt-12">
            <ProcessSteps />
          </div>
        </div>
      </section>
      <section className="bg-soft py-20 sm:py-24" aria-labelledby="faq-title">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-title" eyebrow="FAQ" title={`Fragen zu ${page.name}`} />
          <FaqList items={page.faq} />
        </div>
      </section>
      <RelatedArticles slugs={page.related} />
      <CtaBand href={checkHref} cta={`${page.name}-Check starten`} />
      <JsonLd data={serviceSchema({ name: `${page.name} – Tarifprüfung und Wechselservice`, serviceType: `Energieberatung ${page.name}`, description: page.description, path: page.path })} />
    </>
  );
}
