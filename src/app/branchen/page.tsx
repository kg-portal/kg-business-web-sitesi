import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { industries } from "@/content/industries";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Branchenlösungen – Strom & Gas passend zu Ihrem Betrieb",
  description:
    "Hausverwaltungen, Büros, Gastronomie, Hotels, Handwerk, Einzelhandel, Praxen, Gewerbeimmobilien und Produktion: Energieberatung, die zum Verbrauchsprofil Ihrer Branche passt.",
  path: "/branchen",
});

export default function BranchenPage() {
  return (
    <>
      <PageHero
        eyebrow="Branchenlösungen"
        title={
          <>
            Jede Branche verbraucht Energie anders. <span className="text-energy-300">Wir berücksichtigen das.</span>
          </>
        }
        lead="Kühlung rund um die Uhr, Maschinen mit Lastspitzen, viele Lieferstellen oder saisonale Schwankungen – ein passendes Angebot beginnt mit dem Verständnis Ihres Betriebs."
        breadcrumbs={[{ name: "Branchenlösungen", path: "/branchen" }]}
        actions={
          <ButtonLink href="/energie-check?kundentyp=gewerbe" size="lg" icon="arrow">
            Gewerbe-Check starten
          </ButtonLink>
        }
      />
      <section className="py-20 sm:py-24" aria-labelledby="liste-title">
        <div className="container-page">
          <SectionHeading id="liste-title" eyebrow="Branchen" title="Wählen Sie Ihre Branche" />
          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind) => (
              <li key={ind.slug}>
                <Link
                  href={`/branchen/${ind.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-soft text-navy-700 transition-colors group-hover:bg-navy-900 group-hover:text-white">
                    <Icon name={ind.icon} className="size-6" />
                  </span>
                  <h2 className="mt-5 text-xl font-bold group-hover:text-electric-600">{ind.name}</h2>
                  <p className="mt-2 flex-1 leading-relaxed text-muted">{ind.teaser}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {ind.consumers.slice(0, 3).map((c) => (
                      <li key={c} className="rounded-full bg-soft px-2.5 py-1 text-xs font-medium text-muted">
                        {c}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-electric-600">
                    Zur Branchenlösung
                    <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 rounded-2xl border border-line bg-soft p-6 text-[0.95rem] leading-relaxed text-muted">
            Ihre Branche ist nicht dabei? Kein Problem – wir beraten alle gewerblichen Kundinnen und Kunden. Starten Sie den{" "}
            <Link href="/energie-check?kundentyp=gewerbe" className="link-inline">
              Energie-Check
            </Link>{" "}
            oder{" "}
            <Link href="/kontakt" className="link-inline">
              sprechen Sie uns direkt an
            </Link>
            .
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
