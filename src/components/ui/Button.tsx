import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "navy" | "secondary" | "ghost-dark" | "outline-dark" | "link";
type Size = "md" | "lg" | "sm";

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-xl text-center font-semibold sm:whitespace-nowrap transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-energy-400 text-navy-900 shadow-[0_10px_30px_-10px_rgb(53_205_85/0.7)] hover:bg-energy-300 hover:shadow-[0_14px_36px_-10px_rgb(53_205_85/0.8)] active:translate-y-px",
  navy: "bg-navy-900 text-white shadow-[0_10px_30px_-12px_rgb(8_26_64/0.6)] hover:bg-navy-700 active:translate-y-px",
  secondary: "border border-line-strong bg-white text-navy-900 hover:border-navy-700/40 hover:bg-soft active:translate-y-px",
  "ghost-dark": "border border-white/20 bg-white/5 text-white backdrop-blur hover:border-white/40 hover:bg-white/10 active:translate-y-px",
  "outline-dark": "border border-white/25 text-white hover:bg-white/10",
  link: "px-0 py-0 text-electric-600 hover:text-navy-700",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-3 text-[0.95rem]",
  lg: "px-6 py-3.5 text-base sm:px-7 sm:py-4",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconLeft?: IconName;
  className?: string;
  children: ReactNode;
}

function Inner({ icon, iconLeft, children }: Pick<CommonProps, "icon" | "iconLeft" | "children">) {
  return (
    <>
      {iconLeft ? <Icon name={iconLeft} className="size-[1.1em] shrink-0" /> : null}
      <span>{children}</span>
      {icon ? (
        <Icon name={icon} className="size-[1.1em] shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
      ) : null}
    </>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon,
  iconLeft,
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  const classes = cn(base, variants[variant], variant !== "link" && sizes[size], className);
  const hrefStr = typeof href === "string" ? href : "";
  if (/^(tel:|mailto:)/.test(hrefStr)) {
    return (
      <a href={hrefStr} className={classes}>
        <Inner icon={icon} iconLeft={iconLeft}>{children}</Inner>
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      <Inner icon={icon} iconLeft={iconLeft}>{children}</Inner>
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconLeft,
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button type={type} className={cn(base, variants[variant], variant !== "link" && sizes[size], className)} {...rest}>
      <Inner icon={icon} iconLeft={iconLeft}>{children}</Inner>
    </button>
  );
}
