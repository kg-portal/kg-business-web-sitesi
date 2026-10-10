import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { company } from "@/content/company";
import { footerNavigation } from "@/content/navigation";

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-white">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-[0.95rem] text-on-dark-muted transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-navy-950 text-on-dark">
      <div className="bg-grid-dark pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="container-page relative pb-28 pt-16 lg:pb-12 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Link href="/" aria-label={`${company.brandName} – zur Startseite`} className="inline-block rounded-lg">
              <Logo tone="light" />
            </Link>
            <p className="mt-6 text-[0.95rem] leading-relaxed text-on-dark-muted">
              Persönliche Beratung zu Strom und Gas für Unternehmen und Privathaushalte. Wir vergleichen, erklären und
              begleiten Ihren Anbieterwechsel – mit Sitz in Duisburg.
            </p>
            <address className="mt-6 space-y-3 not-italic">
              <a href={company.phone.href} className="flex items-center gap-3 text-white transition-colors hover:text-energy-300">
                <Icon name="phone" className="size-4 text-energy-400" />
                {company.phone.display}
              </a>
              <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-white transition-colors hover:text-energy-300">
                <Icon name="mail" className="size-4 text-energy-400" />
                {company.email}
              </a>
              <p className="flex items-start gap-3 text-on-dark-muted">
                <Icon name="mapPin" className="mt-0.5 size-4 shrink-0 text-energy-400" />
                <span>
                  {company.address.street}
                  <br />
                  {company.address.postalCode} {company.address.city}
                </span>
              </p>
              <p className="flex items-center gap-3 text-on-dark-muted">
                <Icon name="clock" className="size-4 text-energy-400" />
                {company.openingHours.display}
              </p>
            </address>
          </div>
          <FooterColumn title="Leistungen" links={footerNavigation.leistungen} />
          <FooterColumn title="Unternehmen" links={footerNavigation.unternehmen} />
          <FooterColumn title="Rechtliches" links={footerNavigation.rechtliches} />
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-on-dark-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.legalName} · Inh. {company.owner}
          </p>
          <p>Vermittlung &amp; Beratung für Strom und Gas · kein Energieversorger</p>
        </div>
      </div>
    </footer>
  );
}
