import type { ReactNode } from "react";
import { EnergyBackdrop } from "@/components/art/EnergyBackdrop";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { Crumb } from "@/lib/schema";
import { cn } from "@/lib/cn";

/** Dunkler Seitenkopf für Unterseiten (konsistent mit transparentem Header). */
export function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  actions,
  aside,
  children,
  compact = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-900 text-white">
      <EnergyBackdrop variant="page" />
      <div
        className={cn(
          "container-page relative pt-28 sm:pt-32 lg:pt-36",
          compact ? "pb-14 sm:pb-16" : "pb-16 sm:pb-20 lg:pb-24",
        )}
      >
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        <div className={cn("mt-8 grid items-center gap-10 lg:gap-14", aside && "lg:grid-cols-[1.15fr_0.85fr]")}>
          {/* Kein Einblenden des Textblocks: er ist meist das LCP-Element */}
          <div>
            {eyebrow ? (
              <p className="eyebrow">
                <span className="h-px w-6 bg-current opacity-60" aria-hidden="true" />
                {eyebrow}
              </p>
            ) : null}
            <h1
              className={cn(
                "mt-4 font-bold leading-[1.06] text-white",
                compact ? "text-[2.1rem] sm:text-5xl" : "text-[2.3rem] sm:text-5xl lg:text-[3.6rem]",
              )}
            >
              {title}
            </h1>
            {lead ? <div className="mt-6 max-w-2xl text-lg leading-relaxed text-on-dark sm:text-xl">{lead}</div> : null}
            {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div> : null}
            {children}
          </div>
          {aside ? <div className="animate-fade-up [animation-delay:120ms]">{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}
