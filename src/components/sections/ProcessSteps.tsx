import { Icon } from "@/components/ui/Icon";
import { processSteps } from "@/content/process";
import { cn } from "@/lib/cn";

/** Vier-Schritte-Prozess als verbundene Zeitleiste. */
export function ProcessSteps({ tone = "light", detailed = false }: { tone?: "light" | "dark"; detailed?: boolean }) {
  const dark = tone === "dark";
  return (
    <ol className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 right-0 top-[2.1rem] hidden h-px lg:block",
          dark ? "bg-gradient-to-r from-white/0 via-white/25 to-white/0" : "bg-gradient-to-r from-line/0 via-line-strong to-line/0",
        )}
      />
      {processSteps.map((step, i) => (
        <li
          key={step.title}
          className={cn(
            "relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1",
            dark
              ? "border-white/12 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]"
              : "border-line bg-white shadow-card hover:shadow-lift",
          )}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "relative z-10 inline-flex size-11 items-center justify-center rounded-xl",
                dark ? "bg-energy-400 text-navy-900" : "bg-navy-900 text-white",
              )}
            >
              <Icon name={step.icon} className="size-5" />
            </span>
            <span className={cn("font-display text-sm font-bold tracking-wider", dark ? "text-energy-300" : "text-electric-600")}>
              Schritt {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className={cn("mt-5 text-xl font-bold", dark && "text-white")}>{step.title}</h3>
          <p className={cn("mt-2 leading-relaxed", dark ? "text-on-dark" : "text-muted")}>{step.text}</p>
          {detailed ? (
            <p className={cn("mt-3 border-t pt-3 text-[0.95rem] leading-relaxed", dark ? "border-white/10 text-on-dark-muted" : "border-line text-muted")}>
              {step.detail}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
