import { EnergyBackdrop } from "@/components/art/EnergyBackdrop";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { company } from "@/content/company";

/** Abschließender Handlungsaufruf mit Energie-Check und Direktkontakt. */
export function CtaBand({
  title = "Bereit für Klarheit bei Ihren Energiekosten?",
  lead = "Starten Sie den kostenlosen Energie-Check. Wir prüfen Ihren Vertrag und melden uns persönlich – ohne Abschlusszwang.",
  href = "/energie-check",
  cta = "Jetzt kostenlosen Energie-Check starten",
}: {
  title?: string;
  lead?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="cta-band-title">
      <div className="container-page">
        <div className="on-dark relative isolate overflow-hidden rounded-[2rem] bg-navy-900 px-6 py-12 text-white shadow-lift sm:px-12 sm:py-16 lg:px-16">
          <EnergyBackdrop variant="page" className="opacity-90" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 id="cta-band-title" className="text-[1.9rem] font-bold leading-tight text-white sm:text-4xl">
                {title}
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-on-dark">{lead}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
              <ButtonLink href={href} size="lg" icon="arrow" className="w-full">
                {cta}
              </ButtonLink>
              <ButtonLink href={company.phone.href} variant="ghost-dark" size="lg" iconLeft="phone" className="w-full">
                Persönlich beraten lassen
              </ButtonLink>
              <p className="flex items-center justify-center gap-2 text-sm text-on-dark-muted">
                <Icon name="clock" className="size-4" />
                {company.openingHours.display}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
