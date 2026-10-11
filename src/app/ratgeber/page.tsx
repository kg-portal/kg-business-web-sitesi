import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Icon } from "@/components/ui/Icon";
import { articles } from "@/content/ratgeber";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Ratgeber Strom & Gas – Wissen für Unternehmen und Haushalte",
  description:
    "Gewerbestrom, Gewerbegas, Stromrechnung, Laufzeiten, Kündigungsfristen und Anbieterwechsel verständlich erklärt – mit Quellen und Stand 2026.",
  path: "/ratgeber",
});

const categories = ["Gewerbe", "Grundlagen", "Vertrag", "Wechsel"] as const;

export default function RatgeberPage() {
  const [featured, ...rest] = articles;
  return (
    <>
      <PageHero
        eyebrow="Ratgeber"
        title={
          <>
            Energiewissen, <span className="text-energy-300">verständlich erklärt.</span>
          </>
        }
        lead="Was steht auf meiner Rechnung? Wann kann ich kündigen? Was ist ein Lastgang? Unsere Artikel beantworten die wichtigsten Fragen – mit Quellenangaben."
        breadcrumbs={[{ name: "Ratgeber", path: "/ratgeber" }]}
        compact
      />
      <section className="py-16 sm:py-20" aria-label="Artikel">
        <div className="container-page">
          {featured ? (
            <Link
              href={`/ratgeber/${featured.slug}`}
              className="group grid overflow-hidden rounded-[2rem] border border-line bg-white shadow-card transition-all duration-300 hover:shadow-lift lg:grid-cols-[1.2fr_1fr]"
            >
              <div className="p-8 sm:p-12">
                <span className="eyebrow">Empfohlen · {featured.category}</span>
                <h2 className="mt-4 text-2xl font-bold leading-tight group-hover:text-electric-600 sm:text-3xl">{featured.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">{featured.excerpt}</p>
                <span className="mt-8 inline-flex items-center gap-2 font-semibold text-electric-600">
                  Artikel lesen · {featured.readingMinutes} Min.
                  <Icon name="arrow" className="size-5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
              <div className="on-dark relative hidden overflow-hidden bg-navy-900 lg:block" aria-hidden="true">
                <div className="bg-grid-dark absolute inset-0" />
                <div className="absolute inset-0 bg-[radial-gradient(500px_300px_at_70%_30%,rgb(22_139_255/0.45),transparent_70%)]" />
                <Icon name="book" className="absolute bottom-10 right-10 size-28 text-white/15" strokeWidth={1} />
              </div>
            </Link>
          ) : null}

          {categories.map((cat) => {
            const items = rest.filter((a) => a.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="mt-16">
                <h2 className="flex items-center gap-3 text-xl font-bold">
                  <span className="h-px w-8 bg-electric-500" aria-hidden="true" />
                  {cat}
                </h2>
                <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/ratgeber/${a.slug}`}
                        className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                      >
                        <h3 className="text-lg font-bold leading-snug group-hover:text-electric-600">{a.title}</h3>
                        <p className="mt-3 flex-1 leading-relaxed text-muted">{a.excerpt}</p>
                        <span className="mt-5 flex items-center justify-between text-sm text-muted">
                          {a.readingMinutes} Min. Lesezeit
                          <Icon name="arrow" className="size-5 text-electric-600 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <p className="mt-14 rounded-2xl border border-line bg-soft p-5 text-sm leading-relaxed text-muted">
            Hinweis: Unsere Ratgeber-Artikel dienen der allgemeinen Information und ersetzen keine Rechts- oder Steuerberatung. Rechtslage
            und Preisbestandteile können sich ändern – maßgeblich sind die aktuellen Gesetzestexte und Ihre Vertragsunterlagen.
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
