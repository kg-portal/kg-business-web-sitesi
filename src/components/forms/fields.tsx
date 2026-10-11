"use client";

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-[1rem] text-navy-900 transition-colors placeholder:text-muted/60 focus:outline-none focus:ring-2 disabled:bg-soft";
const inputOk = "border-line-strong focus:border-electric-500 focus:ring-electric-500/25";
const inputErr = "border-danger focus:border-danger focus:ring-danger/20";

interface FieldShellProps {
  id: string;
  label: string;
  required?: boolean;
  optionalLabel?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FieldShell({ id, label, required, optionalLabel, hint, error, children, className }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-900">
        {label}
        {required ? (
          <span className="ml-0.5 text-danger" aria-hidden="true">
            *
          </span>
        ) : null}
        {optionalLabel ? <span className="ml-1.5 font-normal text-muted">(optional)</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs leading-relaxed text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-danger">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: ReactNode, error?: string) {
  return [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
}

export function TextField({
  id,
  label,
  required,
  optionalLabel,
  hint,
  error,
  suffix,
  className,
  ...input
}: Omit<FieldShellProps, "children"> & { suffix?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className">) {
  return (
    <FieldShell id={id} label={label} required={required} optionalLabel={optionalLabel} hint={hint} error={error} className={className}>
      <div className="relative">
        <input
          id={id}
          name={id}
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cn(inputBase, error ? inputErr : inputOk, suffix && "pr-20")}
          {...input}
        />
        {suffix ? <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-muted">{suffix}</span> : null}
      </div>
    </FieldShell>
  );
}

export function TextAreaField({
  id,
  label,
  required,
  optionalLabel,
  hint,
  error,
  className,
  ...textarea
}: Omit<FieldShellProps, "children"> & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className">) {
  return (
    <FieldShell id={id} label={label} required={required} optionalLabel={optionalLabel} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        name={id}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(inputBase, "min-h-28 resize-y", error ? inputErr : inputOk)}
        {...textarea}
      />
    </FieldShell>
  );
}

export function CheckboxField({
  id,
  checked,
  onChange,
  children,
  error,
  required,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-line-strong accent-electric-600"
        />
        <label htmlFor={id} className="cursor-pointer text-[0.95rem] leading-relaxed text-ink">
          {children}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 pl-8 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
