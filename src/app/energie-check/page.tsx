import { Suspense } from "react";
import { EnergyBackdrop } from "@/components/art/EnergyBackdrop";
import { EnergieCheck } from "@/components/forms/EnergieCheck";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Icon } from "@/components/ui/Icon";
import { company } from "@/content/company";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Kostenloser Energie-Check – Strom & Gas prüfen lassen",
  description:
    "In wenigen Minuten zur persönlichen Prüfung Ihres Strom- oder Gasvertrags: Kundentyp wählen, Verbrauch angeben, optional Rechnung hochladen. Kostenlos und unverbindlich.",
  path: "/energie-check",
});

export default function EnergieCheckPage() {
  return (
    <>
      <section className="on-dark relative isolate overflow-hidden bg-navy-900 text-white">
        <EnergyBackdrop variant="page" />
        <div className="container-page relative pb-36 pt-28 sm:pt-32 lg:pb-44 lg:pt-36">
          <Breadcrumbs items={[{ name: "Energie-Check", path: "/energie-check" }]} />
          <h1 className="mt-6 max-w-3xl text-[2.2rem] font-bold leading-[1.08] text-white sm:text-5xl">
            Kostenloser Energie-Check
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-on-dark">
            Fünf kurze Schritte, rund zwei Minuten. Wir prüfen Ihren Vertrag und melden uns persönlich – ohne Abschlusszwang.
          </p>
        </div>
      </section>

      <section className="relative z-10 -mt-28 pb-20 lg:-mt-32" aria-label="Energie-Check Formular">
        <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0">
            <Suspense
              fallback={
                <div className="flex min-h-96 items-center justify-center rounded-3xl border border-line bg-white shadow-lift">
                  <p className="text-muted">Formular wird geladen …</p>
                </div>
              }
            >
              <EnergieCheck />
            </Suspense>
          </div>
          <aside className="space-y-5 lg:pt-2" aria-label="Hinweise zum Energie-Check">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <p className="font-display text-lg font-bold text-navy-900">Ihre Vorteile</p>
              <ul className="mt-4 space-y-3 text-[0.95rem]">
                {["Für Sie in der Regel kostenfrei", "Kein Abschlusszwang", "Persönlicher Ansprechpartner", "Angebote verständlich erklärt"].map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <Icon name="checkCircle" className="mt-0.5 size-5 shrink-0 text-energy-700" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <p className="flex items-center gap-2 font-display text-lg font-bold text-navy-900">
                <Icon name="shield" className="size-5 text-electric-600" />
                Datenschutz
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Ihre Angaben werden verschlüsselt gespeichert und nur zur Bearbeitung Ihrer Anfrage genutzt. Keine Weitergabe ohne Ihren
                Auftrag, kein Tracking.
              </p>
            </div>
            <div className="on-dark rounded-2xl bg-navy-900 p-6 text-white">
              <p className="font-display text-lg font-bold">Lieber persönlich?</p>
              <a href={company.phone.href} className="mt-3 flex items-center gap-2 text-lg font-semibold text-white hover:text-energy-300">
                <Icon name="phone" className="size-5 text-energy-400" />
                {company.phone.display}
              </a>
              <a href={`mailto:${company.email}`} className="mt-2 flex items-center gap-2 text-on-dark hover:text-white">
                <Icon name="mail" className="size-4 text-energy-400" />
                {company.email}
              </a>
              <p className="mt-3 text-sm text-on-dark-muted">{company.openingHours.display}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
