import Link from "next/link";
import { EnergyBackdrop } from "@/components/art/EnergyBackdrop";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "Seite nicht gefunden", robots: { index: false, follow: true } };

export default function NotFound() {
  const links = [
    { href: "/gewerbestrom", label: "Gewerbestrom" },
    { href: "/gewerbegas", label: "Gewerbegas" },
    { href: "/privatkunden", label: "Privatkunden" },
    { href: "/ratgeber", label: "Ratgeber" },
    { href: "/kontakt", label: "Kontakt" },
  ];
  return (
    <section className="on-dark relative isolate flex min-h-[80vh] items-center overflow-hidden bg-navy-900 text-white">
      <EnergyBackdrop variant="page" />
      <div className="container-page relative py-32">
        <p className="font-display text-sm font-bold tracking-[0.2em] text-energy-300">FEHLER 404</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl">Diese Seite ist leider nicht (mehr) da.</h1>
        <p className="mt-5 max-w-xl text-lg text-on-dark">
          Vielleicht wurde sie verschoben oder die Adresse ist nicht ganz korrekt. Hier geht es weiter:
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg" icon="arrow">
            Zur Startseite
          </ButtonLink>
          <ButtonLink href="/energie-check" size="lg" variant="ghost-dark">
            Energie-Check starten
          </ButtonLink>
        </div>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-on-dark">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="underline decoration-white/30 underline-offset-4 hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
