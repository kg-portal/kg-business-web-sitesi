import { cn } from "@/lib/cn";
import { company } from "@/content/company";

/**
 * Bildmarke aus V1 (drei steigende Balken + grüner Bogen), Geometrie unverändert.
 * Änderungen an Logo/Marke nur nach Freigabe – Varianten siehe docs/brand/.
 */
export function LogoMark({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const bars = tone === "light" ? "#ffffff" : "#142b70";
  return (
    <svg viewBox="0 0 120 100" aria-hidden="true" focusable="false" className={className}>
      <path d="M19 20h20v47H19zM43 11h20v56H43zM67 4h20v63H67z" fill={bars} />
      <path d="M13 69c20 23 64 23 92-2-25 12-55 15-75 5 25 11 56 6 80-9-24 31-74 39-97 6Z" fill="#38d51a" />
      <path d="M15 72c15 12 32 18 50 18 18 0 35-5 48-15" fill="none" stroke="#38d51a" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  tone = "dark",
  showTagline = true,
  className,
}: {
  tone?: "dark" | "light";
  showTagline?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} className="h-10 w-12 shrink-0 sm:h-11 sm:w-[3.25rem]" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.15rem] font-extrabold tracking-[0.02em] sm:text-[1.25rem]",
            tone === "light" ? "text-white" : "text-navy-900",
          )}
        >
          {company.legalName}
        </span>
        {showTagline ? (
          <span
            className={cn(
              "mt-1 text-[0.7rem] font-medium tracking-wide",
              tone === "light" ? "text-on-dark-muted" : "text-muted",
            )}
          >
            {company.tagline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
