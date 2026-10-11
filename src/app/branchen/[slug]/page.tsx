import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { RelatedArticles } from "@/components/sections/RelatedArticles";
import { StartCard } from "@/components/sections/StartCard";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getIndustry, industries } from "@/content/industries";
import { serviceSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return {};
  return buildMetadata({ title: ind.metaTitle, description: ind.metaDescription, path: `/branchen/${ind.slug}` });
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();
  const path = `/branchen/${ind.slug}`;
  const others = industries.filter((i) => i.slug !== ind.slug);
  const checkHref = `/energie-check?kundentyp=gewerbe&energie=${ind.energy.length > 1 ? "beides" : ind.energy[0]}`;

  return (
    <>
      <PageHero
        eyebrow={`Branchenlösung · ${ind.name}`}
        title={ind.heroTitle}
        lead={ind.heroLead}
        breadcrumbs={[
          { name: "Branchenlösungen", path: "/branchen" },
          { name: ind.name, path },
        ]}
        actions={
          <ButtonLink href={checkHref} size="lg" icon="arrow">
            Angebot für {ind.short} anfordern
          </ButtonLink>
        }
        aside={<StartCard title="Das prüfen wir für Sie" items={ind.checks} href={checkHref} cta="Kostenlos prüfen lassen" />}
      />

      <section className="py-20 sm:py-24" aria-labelledby="situation-title">
        <div className="container-page grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <SectionHeading id="situation-title" eyebrow="Ausgangslage" title={ind.situationTitle} />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/90">
              {ind.situation.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="h-fit rounded-3xl border border-line bg-soft p-7" aria-labelledby="verbraucher-title">
            <p id="verbraucher-title" className="font-display text-lg font-bold text-navy-900">
              Typische Verbraucher
            </p>
            <ul className="mt-5 space-y-3">
              {ind.consumers.map((c) => (
                <li key={c} className="flex items-center gap-3">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-electric-600 ring-1 ring-line">
                    <Icon name="zap" className="size-4" />
                  </span>
                  <span className="text-ink">{c}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-2 border-t border-line pt-5">
              {ind.energy.map((e) => (
                <Link
                  key={e}
                  href={e === "strom" ? "/gewerbestrom" : "/gewerbegas"}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-navy-900 ring-1 ring-line hover:text-electric-600"
                >
                  <Icon name={e === "strom" ? "zap" : "flame"} className="size-4" />
                  {e === "strom" ? "Gewerbestrom" : "Gewerbegas"}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-soft py-20 sm:py-24" aria-labelledby="bedarf-title">
        <div className="container-page">
          <SectionHeading id="bedarf-title" eyebrow="Was Sie erwarten können" title={`So unterstützen wir ${ind.name}`} />
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {ind.needs.map((n, i) => (
              <li key={n.title} className="flex gap-5 rounded-2xl border border-line bg-white p-6 shadow-card">
                <span className="font-display text-3xl font-extrabold text-electric-500/30">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-lg font-bold">{n.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{n.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="ablauf-title">
        <div className="container-page">
          <SectionHeading id="ablauf-title" eyebrow="Ablauf" title="Vom ersten Kontakt bis zum Wechsel" align="center" />
          <div className="mt-12">
            <ProcessSteps />
          </div>
        </div>
      </section>

      <section className="bg-soft py-20 sm:py-24" aria-labelledby="faq-title">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-title" eyebrow="FAQ" title={`Häufige Fragen aus der Branche ${ind.short}`} />
          <FaqList items={ind.faq} />
        </div>
      </section>

      <section className="py-16" aria-labelledby="weitere-title">
        <div className="container-page">
          <h2 id="weitere-title" className="text-2xl font-bold">
            Weitere Branchenlösungen
          </h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/branchen/${o.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:border-electric-500 hover:text-electric-600"
                >
                  <Icon name={o.icon} className="size-4" />
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <RelatedArticles slugs={["gewerbestrom-verstehen", "energieverbrauch-unternehmen", "anbieterwechsel"]} />
      <CtaBand
        title={`Energieverträge für ${ind.name} prüfen lassen`}
        lead="Senden Sie uns Ihre Rechnung oder Ihren Verbrauch. Wir prüfen Konditionen und Fristen und melden uns persönlich."
        href={checkHref}
      />
      <JsonLd data={serviceSchema({ name: `Energieberatung für ${ind.name}`, serviceType: "Energieberatung Gewerbe", description: ind.metaDescription, path })} />
    </>
  );
}
