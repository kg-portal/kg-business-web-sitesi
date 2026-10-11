"use client";

import { useId, useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { parseGermanNumber } from "@/lib/format";
import { calculateAnnualCost } from "@/lib/tariffs/calculate";

const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const ct = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Field({
  id,
  label,
  unit,
  value,
  onChange,
  placeholder,
  hint,
}: {
  id: string;
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy-900">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="w-full rounded-xl border border-line-strong bg-white py-3 pl-4 pr-20 text-navy-900 placeholder:text-muted/60 focus:border-electric-500 focus:outline-none focus:ring-2 focus:ring-electric-500/25"
        />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-muted">{unit}</span>
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Jahreskosten-Rechner auf Basis der eigenen Rechnungswerte.
 * Zeigt keine Marktpreise – nur die Kosten Ihres aktuellen Vertrags.
 */
export function CostCalculator({ energy = "strom" }: { energy?: "strom" | "gas" }) {
  const id = useId();
  const [verbrauch, setVerbrauch] = useState("");
  const [arbeitspreis, setArbeitspreis] = useState("");
  const [grundpreis, setGrundpreis] = useState("");

  const result = useMemo(() => {
    const v = parseGermanNumber(verbrauch);
    const a = parseGermanNumber(arbeitspreis);
    const g = parseGermanNumber(grundpreis) ?? 0;
    if (v === null || a === null || v <= 0 || a <= 0) return null;
    if (v > 100_000_000 || a > 500 || g > 100_000) return null;
    return { v, a, g, cost: calculateAnnualCost({ arbeitspreisCtKwh: a, grundpreisEurMonat: g }, v) };
  }, [verbrauch, arbeitspreis, grundpreis]);

  const checkHref = result
    ? `/energie-check?energie=${energy}&verbrauch=${Math.round(result.v)}`
    : `/energie-check?energie=${energy}`;

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="not-prose my-10 overflow-hidden rounded-3xl border border-line bg-white shadow-lift"
    >
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-6 sm:p-8">
          <p className="eyebrow">
            <Icon name="calculator" className="size-4" />
            Jahreskosten-Rechner
          </p>
          <h3 id={`${id}-title`} className="mt-2 text-xl font-bold sm:text-2xl">
            Was kostet Ihr aktueller Vertrag pro Jahr?
          </h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
            Tragen Sie die Werte von Ihrer Rechnung ein – netto oder brutto, so wie sie dort stehen.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <Field id={`${id}-v`} label="Jahresverbrauch" unit="kWh" value={verbrauch} onChange={setVerbrauch} placeholder="z. B. 25.000" />
            <Field id={`${id}-a`} label="Arbeitspreis" unit="ct/kWh" value={arbeitspreis} onChange={setArbeitspreis} placeholder="0,00" />
            <Field id={`${id}-g`} label="Grundpreis" unit="€/Monat" value={grundpreis} onChange={setGrundpreis} placeholder="0,00" />
          </div>
        </div>
        <div className="on-dark flex flex-col justify-between bg-navy-900 p-6 text-white sm:p-8" aria-live="polite">
          {result ? (
            <div>
              <p className="text-sm text-on-dark-muted">Voraussichtliche Jahreskosten</p>
              <p className="mt-1 font-display text-4xl font-extrabold tracking-tight text-white">{eur.format(result.cost.recurringEur)}</p>
              <dl className="mt-6 space-y-2.5 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2.5">
                  <dt className="text-on-dark-muted">Verbrauchskosten</dt>
                  <dd className="font-semibold">{eur.format(result.cost.energyCostEur)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2.5">
                  <dt className="text-on-dark-muted">Grundpreis (12 Monate)</dt>
                  <dd className="font-semibold">{eur.format(result.cost.baseCostEur)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-on-dark-muted">Durchschnittspreis</dt>
                  <dd className="font-semibold">{ct.format(result.cost.effectiveCtKwh)} ct/kWh</dd>
                </div>
              </dl>
            </div>
          ) : (
            <div>
              <p className="text-sm text-on-dark-muted">Ergebnis</p>
              <p className="mt-2 text-lg leading-relaxed text-on-dark">
                Geben Sie Verbrauch und Arbeitspreis ein, um Ihre Jahreskosten zu sehen.
              </p>
            </div>
          )}
          <div className="mt-8">
            <ButtonLink href={checkHref} icon="arrow" className="w-full">
              Angebot zum Vergleich anfordern
            </ButtonLink>
            <p className="mt-3 text-xs leading-relaxed text-on-dark-muted">
              Berechnung ohne Gewähr, auf Basis Ihrer Eingaben. Ihre Werte werden nicht gespeichert.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
