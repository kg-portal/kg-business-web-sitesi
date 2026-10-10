"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Segmented } from "@/components/ui/Segmented";

type Kundentyp = "gewerbe" | "privat";
type Energie = "strom" | "gas" | "beides";

/**
 * Schnellstart im Hero: übergibt Kundentyp, Energieart und PLZ an den
 * vollständigen Energie-Check (keine Datenspeicherung an dieser Stelle).
 */
export function QuickCheck({ defaultKundentyp = "gewerbe" }: { defaultKundentyp?: Kundentyp }) {
  const router = useRouter();
  const id = useId();
  const [kundentyp, setKundentyp] = useState<Kundentyp>(defaultKundentyp);
  const [energie, setEnergie] = useState<Energie>("strom");
  const [plz, setPlz] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (plz && !/^\d{5}$/.test(plz)) {
      setError("Bitte geben Sie eine gültige fünfstellige Postleitzahl ein.");
      return;
    }
    const params = new URLSearchParams({ kundentyp, energie });
    if (plz) params.set("plz", plz);
    router.push(`/energie-check?${params.toString()}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-labelledby={`${id}-title`}
      className="relative rounded-3xl border border-white/15 bg-white/[0.07] p-5 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)] backdrop-blur-xl sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p id={`${id}-title`} className="font-display text-xl font-bold text-white">
            Kostenloser Energie-Check
          </p>
          <p className="mt-1 text-sm text-on-dark-muted">In wenigen Minuten zur persönlichen Prüfung.</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-energy-400/15 px-2.5 py-1 text-xs font-semibold text-energy-300">
          <Icon name="timer" className="size-3.5" />
          ca. 2 Min.
        </span>
      </div>

      <div className="mt-6 space-y-5">
        <Segmented<Kundentyp>
          legend="Ich bin"
          name={`${id}-kundentyp`}
          tone="dark"
          value={kundentyp}
          onChange={setKundentyp}
          options={[
            { value: "gewerbe", label: "Unternehmen", icon: "building" },
            { value: "privat", label: "Privathaushalt", icon: "home" },
          ]}
        />
        <Segmented<Energie>
          legend="Energieart"
          name={`${id}-energie`}
          tone="dark"
          value={energie}
          onChange={setEnergie}
          options={[
            { value: "strom", label: "Strom", icon: "zap" },
            { value: "gas", label: "Gas", icon: "flame" },
            { value: "beides", label: "Beides" },
          ]}
        />
        <div>
          <label htmlFor={`${id}-plz`} className="mb-2 block text-sm font-semibold text-on-dark">
            Postleitzahl der Lieferstelle <span className="font-normal text-on-dark-muted">(optional)</span>
          </label>
          <input
            id={`${id}-plz`}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            placeholder="z. B. 47055"
            value={plz}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-plz-err` : undefined}
            onChange={(e) => {
              setPlz(e.target.value.replace(/\D/g, "").slice(0, 5));
              setError(null);
            }}
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-on-dark-muted/70 focus:border-energy-400 focus:outline-none focus:ring-2 focus:ring-energy-400/40"
          />
          {error ? (
            <p id={`${id}-plz-err`} role="alert" className="mt-2 text-sm font-medium text-[#ffb4ab]">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <Button type="submit" size="lg" icon="arrow" className="mt-6 w-full">
        Jetzt Energie-Check starten
      </Button>
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-on-dark-muted">
        <Icon name="lock" className="size-3.5" />
        Kostenlos & unverbindlich · Kein Abschlusszwang
      </p>
    </form>
  );
}
