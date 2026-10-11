import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SymbolImage } from "@/components/ui/SymbolImage";
import { about, principles } from "@/content/about";
import { company } from "@/content/company";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Über uns – Energieberatung mit Sitz in Duisburg",
  description:
    "KG Business berät Unternehmen und Privathaushalte zu Strom und Gas: persönlich, transparent und ohne Abschlusszwang. Erfahren Sie, wie wir arbeiten und wie wir vergütet werden.",
  path: "/ueber-uns",
});

export default function UeberUnsPage() {
  return (
    <>
      <PageHero
        eyebrow="Über uns"
        title={
          <>
            Energieberatung, die Sie <span className="text-energy-300">verstehen</span> – aus Duisburg.
          </>
        }
        lead={`${company.brandName} unterstützt Unternehmen und Privathaushalte dabei, Strom- und Gasverträge zu prüfen, passende Angebote zu finden und den Wechsel sicher umzusetzen.`}
        breadcrumbs={[{ name: "Über uns", path: "/ueber-uns" }]}
      />

      <section className="py-20 sm:py-24" aria-labelledby="wer-title">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading id="wer-title" eyebrow="Wer wir sind" title="Persönliche Beratung statt anonymer Vergleichsliste." />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/90">
              <p>
                {company.brandName} ist ein Beratungs- und Vermittlungsunternehmen für Strom und Gas mit Sitz in {company.address.city}.
                Inhaberin ist {company.owner}. Wir begleiten Gewerbekunden – vom kleinen Ladengeschäft bis zum Produktionsbetrieb – ebenso wie
                Privathaushalte.
              </p>
              <p>
                Unser Anspruch: Sie sollen verstehen, was Ihnen angeboten wird. Deshalb erklären wir Preise, Laufzeiten und Garantien in klarer
                Sprache und stellen Angebote so gegenüber, dass die Unterschiede sichtbar werden.
              </p>
              {about.foundingYear ? <p>Gegründet {about.foundingYear}.</p> : null}
            </div>
          </div>
          <SymbolImage
            src="/images/beratung-tablet.jpg"
            alt="Beratungsgespräch zu Energieverträgen mit Tablet"
            className="aspect-[4/3] rounded-3xl shadow-lift"
          />
        </div>
      </section>

      <section className="bg-soft py-20 sm:py-24" aria-labelledby="prinzipien-title">
        <div className="container-page">
          <SectionHeading id="prinzipien-title" eyebrow="Wie wir arbeiten" title="Vier Grundsätze, an denen Sie uns messen können." />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <li key={p.title} className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-navy-900 text-white">
                  <Icon name={p.icon} className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="rolle-title">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-line bg-white p-8 shadow-card">
            <h2 id="rolle-title" className="text-2xl font-bold">
              Unsere Rolle am Energiemarkt
            </h2>
            <p className="mt-4 leading-relaxed text-ink/90">
              Wir sind <strong>kein Energieversorger</strong>. Ihr Liefervertrag kommt immer direkt zwischen Ihnen und dem Versorger zustande.
              Wir beraten, holen Angebote ein, erklären die Unterschiede und begleiten den Wechsel.
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-white p-8 shadow-card">
            <h2 className="text-2xl font-bold">So verdienen wir unser Geld</h2>
            <p className="mt-4 leading-relaxed text-ink/90">{company.compensation}</p>
          </div>
          <div className="rounded-3xl border border-line bg-soft p-8 lg:col-span-2">
            <h2 className="text-2xl font-bold">Wo wir beraten</h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-ink/90">
              Unser Büro befindet sich in {company.address.city}. Unser Schwerpunkt liegt in Nordrhein-Westfalen – etwa in{" "}
              {company.serviceArea.focus.filter((c) => c !== company.address.city).join(", ")}. Da Beratung und Wechsel telefonisch und digital
              funktionieren, unterstützen wir Kundinnen und Kunden in ganz Deutschland.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/energieberatung-duisburg" variant="secondary" icon="arrow">
                Energieberatung in Duisburg
              </ButtonLink>
              <ButtonLink href="/kontakt" variant="navy" icon="arrow">
                Kontakt aufnehmen
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8" aria-label="Rechtliche Angaben">
        <div className="container-page">
          <p className="text-sm text-muted">
            Vollständige Unternehmensangaben finden Sie im{" "}
            <Link href="/impressum" className="link-inline">
              Impressum
            </Link>
            .
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
