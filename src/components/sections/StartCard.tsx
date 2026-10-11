import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { company } from "@/content/company";

/** Seitenleiste im Hero: was benötigt wird + direkter Einstieg. */
export function StartCard({
  title = "Das brauchen wir für Ihr Angebot",
  items,
  href,
  cta = "Energie-Check starten",
}: {
  title?: string;
  items: string[];
  href: string;
  cta?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/15 bg-white/[0.07] p-6 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)] backdrop-blur-xl sm:p-8">
      <p className="font-display text-lg font-bold text-white">{title}</p>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-on-dark">
            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-energy-400 text-navy-900">
              <Icon name="check" className="size-3" strokeWidth={3} />
            </span>
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>
      <ButtonLink href={href} size="lg" icon="arrow" className="mt-7 w-full">
        {cta}
      </ButtonLink>
      <a
        href={company.phone.href}
        className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-on-dark transition-colors hover:text-white"
      >
        <Icon name="phone" className="size-4 text-energy-400" />
        Lieber anrufen: {company.phone.display}
      </a>
    </div>
  );
}
