import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  as: Tag = "h2",
  className,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      {eyebrow ? (
        <p className={cn("eyebrow", align === "center" && "justify-center")}>
          <span className="h-px w-6 bg-current opacity-60" aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <Tag id={id} className="mt-3 text-[2rem] font-bold leading-[1.1] sm:text-[2.5rem] lg:text-[2.85rem] on-dark:text-white">
        {title}
      </Tag>
      {lead ? <div className="mt-5 text-lg leading-relaxed text-muted on-dark:text-on-dark-muted">{lead}</div> : null}
    </div>
  );
}
