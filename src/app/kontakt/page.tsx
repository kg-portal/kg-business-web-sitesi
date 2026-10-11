import { KontaktForm } from "@/components/forms/KontaktForm";
import { PageHero } from "@/components/sections/PageHero";
import { Icon } from "@/components/ui/Icon";
import { company } from "@/content/company";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Kontakt – persönliche Energieberatung aus Duisburg",
  description: `Kontakt zu ${company.brandName}: Telefon ${company.phone.display}, E-Mail ${company.email}, ${company.address.street}, ${company.address.postalCode} ${company.address.city}.`,
  path: "/kontakt",
});

export default function KontaktPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title={
          <>
            Sprechen Sie mit uns – <span className="text-energy-300">persönlich und unverbindlich.</span>
          </>
        }
        lead="Rufen Sie an, schreiben Sie uns oder nutzen Sie das Formular. Wir melden uns so bald wie möglich."
        breadcrumbs={[{ name: "Kontakt", path: "/kontakt" }]}
        compact
      />
      <section className="py-16 sm:py-20">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            {[
              { icon: "phone" as const, label: "Telefon", value: company.phone.display, href: company.phone.href },
              { icon: "mail" as const, label: "E-Mail", value: company.email, href: `mailto:${company.email}` },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="group flex items-center gap-5 rounded-2xl border border-line bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-white">
                  <Icon name={c.icon} className="size-5" />
                </span>
                <span>
                  <span className="block text-sm text-muted">{c.label}</span>
                  <span className="block font-display text-lg font-bold text-navy-900 group-hover:text-electric-600">{c.value}</span>
                </span>
              </a>
            ))}
            <div className="rounded-2xl border border-line bg-soft p-6">
              <p className="flex items-center gap-2 font-display font-bold text-navy-900">
                <Icon name="mapPin" className="size-5 text-energy-700" />
                Anschrift
              </p>
              <address className="mt-3 not-italic leading-relaxed text-ink">
                {company.legalName}
                <br />
                {company.address.street}
                <br />
                {company.address.postalCode} {company.address.city}
              </address>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                <Icon name="clock" className="size-4" />
                {company.openingHours.display}
              </p>
              <a
                href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(`${company.address.street}, ${company.address.postalCode} ${company.address.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-inline mt-4 inline-block text-sm"
              >
                Auf OpenStreetMap anzeigen (externer Link)
              </a>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6">
              <p className="font-display font-bold text-navy-900">Einsatzgebiet</p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
                Sitz in {company.address.city}, Schwerpunkt Nordrhein-Westfalen ({company.serviceArea.focus.join(", ")}), Beratung bundesweit.
              </p>
            </div>
          </div>
          <KontaktForm />
        </div>
      </section>
    </>
  );
}
