"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: IconName;
  hint?: string;
}

/**
 * Barrierefreie Auswahl als Radio-Gruppe (native Inputs, Pfeiltasten-Navigation
 * durch den Browser). Visuell als Kacheln dargestellt.
 */
export function Segmented<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
  tone = "light",
  size = "md",
  columns,
  error,
  legendClassName,
}: {
  legend: string;
  name: string;
  value: T | "";
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  tone?: "light" | "dark";
  size?: "md" | "lg";
  columns?: 2 | 3;
  error?: string;
  legendClassName?: string;
}) {
  const id = useId();
  const cols = columns ?? (options.length === 3 ? 3 : 2);
  return (
    <fieldset aria-describedby={error ? `${id}-err` : undefined} aria-invalid={error ? true : undefined}>
      <legend className={cn("mb-2 text-sm font-semibold", tone === "dark" ? "text-on-dark" : "text-navy-900", legendClassName)}>
        {legend}
      </legend>
      <div className={cn("grid gap-2", cols === 3 ? "grid-cols-3" : "grid-cols-2")}>
        {options.map((opt) => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              className={cn(
                "relative flex cursor-pointer items-center gap-2.5 rounded-xl border text-left transition-all has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-electric-500",
                size === "lg" ? "flex-col items-start gap-3 p-4 sm:p-5" : "px-3 py-2.5",
                tone === "dark"
                  ? checked
                    ? "border-energy-400 bg-energy-400/12 text-white"
                    : "border-white/15 bg-white/5 text-on-dark hover:border-white/35"
                  : checked
                    ? "border-electric-500 bg-electric-500/[0.06] text-navy-900 ring-1 ring-electric-500"
                    : "border-line-strong bg-white text-navy-900 hover:border-navy-700/40",
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              {opt.icon ? (
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center justify-center rounded-lg",
                    size === "lg" ? "size-11" : "size-7",
                    tone === "dark"
                      ? checked
                        ? "bg-energy-400 text-navy-900"
                        : "bg-white/10 text-white"
                      : checked
                        ? "bg-electric-500 text-white"
                        : "bg-soft text-navy-700",
                  )}
                >
                  <Icon name={opt.icon} className={size === "lg" ? "size-5" : "size-4"} />
                </span>
              ) : null}
              <span className="min-w-0">
                <span className={cn("block font-semibold leading-tight", size === "lg" ? "text-base" : "text-sm")}>{opt.label}</span>
                {opt.hint ? (
                  <span className={cn("mt-1 block text-sm leading-snug", tone === "dark" ? "text-on-dark-muted" : "text-muted")}>
                    {opt.hint}
                  </span>
                ) : null}
              </span>
              {checked && size === "lg" ? (
                <span className="absolute right-3 top-3 inline-flex size-6 items-center justify-center rounded-full bg-electric-500 text-white">
                  <Icon name="check" className="size-3.5" strokeWidth={3} />
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={`${id}-err`} className="mt-2 text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
