"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type DragEvent, type FormEvent } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Segmented } from "@/components/ui/Segmented";
import { company } from "@/content/company";
import { consentTexts, energieCheckSchema, fieldErrors, stepFields, uploadRules } from "@/lib/lead-schema";
import { cn } from "@/lib/cn";
import { CheckboxField, TextAreaField, TextField } from "./fields";
import { useLeadSubmit } from "./useLeadSubmit";

type Kundentyp = "gewerbe" | "privat";
type Energie = "strom" | "gas" | "beides";

export interface CheckState {
  kundentyp: Kundentyp | "";
  energie: Energie | "";
  plz: string;
  ort: string;
  anbieter: string;
  verbrauchStrom: string;
  verbrauchGas: string;
  vertragsende: string;
  arbeitspreis: string;
  grundpreis: string;
  kuendigung: "unbekannt" | "ja" | "nein";
  zaehlerart: "unbekannt" | "slp" | "rlm";
  lieferstellen: string;
  firma: string;
  ansprechpartner: string;
  email: string;
  telefon: string;
  nachricht: string;
  datenschutz: boolean;
  werbungEmail: boolean;
  werbungTelefon: boolean;
}

const initialState: CheckState = {
  kundentyp: "",
  energie: "",
  plz: "",
  ort: "",
  anbieter: "",
  verbrauchStrom: "",
  verbrauchGas: "",
  vertragsende: "",
  arbeitspreis: "",
  grundpreis: "",
  kuendigung: "unbekannt",
  zaehlerart: "unbekannt",
  lieferstellen: "",
  firma: "",
  ansprechpartner: "",
  email: "",
  telefon: "",
  nachricht: "",
  datenschutz: false,
  werbungEmail: false,
  werbungTelefon: false,
};

const STEPS = [
  { id: "kundentyp", title: "Kundentyp", short: "Kunde" },
  { id: "energie", title: "Energieart", short: "Energie" },
  { id: "vertrag", title: "Vertragsdaten", short: "Vertrag" },
  { id: "kontakt", title: "Kontakt", short: "Kontakt" },
  { id: "abschluss", title: "Rechnung & Absenden", short: "Absenden" },
] as const;
type StepId = (typeof STEPS)[number]["id"];

const DRAFT_KEY = "kg-energie-check-v1";

function newIdempotencyKey(): string {
  return crypto.randomUUID();
}

function readDraft(): { state: CheckState; step: number; key: string } | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: Partial<CheckState>; step?: number; key?: string };
    if (!parsed.state || typeof parsed.key !== "string") return null;
    return { state: { ...initialState, ...parsed.state }, step: Math.min(Math.max(parsed.step ?? 0, 0), STEPS.length - 1), key: parsed.key };
  } catch {
    return null;
  }
}

function writeDraft(state: CheckState, step: number, key: string) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ state, step, key }));
  } catch {
    // Speicher nicht verfügbar (z. B. privater Modus) – Formular funktioniert trotzdem
  }
}

function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignorieren
  }
}

function formatBytes(n: number) {
  return n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1).replace(".", ",")} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
}

/** Validiert alle Felder bis einschließlich des angegebenen Schritts. */
export function validateUpTo(state: CheckState, stepIndex: number): Record<string, string> {
  const result = energieCheckSchema.safeParse(state);
  const all = result.success ? {} : fieldErrors(result.error);
  // Objektweite Regel (Firma) wird von Zod erst nach Feldprüfung ausgeführt → hier zusätzlich prüfen
  if (state.kundentyp === "gewerbe" && !state.firma.trim()) all.firma ??= "Bitte geben Sie den Firmennamen an.";
  const allowed = new Set<string>(STEPS.slice(0, stepIndex + 1).flatMap((s) => [...stepFields[s.id]]));
  return Object.fromEntries(Object.entries(all).filter(([k]) => allowed.has(k)));
}

function stepOfField(field: string): number {
  const idx = STEPS.findIndex((s) => (stepFields[s.id] as readonly string[]).includes(field));
  return idx === -1 ? STEPS.length - 1 : idx;
}

export function EnergieCheck() {
  const searchParams = useSearchParams();
  const uid = useId();
  const [state, setState] = useState<CheckState>(initialState);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [ready, setReady] = useState(false);
  const keyRef = useRef<string>("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);
  const { submit, submitting } = useLeadSubmit();

  // Entwurf laden + URL-Parameter übernehmen (einmalig nach dem Mounten)
  useEffect(() => {
    const draft = readDraft();
    let next = draft?.state ?? initialState;
    keyRef.current = draft?.key ?? newIdempotencyKey();
    const kt = searchParams.get("kundentyp");
    const en = searchParams.get("energie");
    const plz = searchParams.get("plz");
    const verbrauch = searchParams.get("verbrauch");
    const fromUrl: Partial<CheckState> = {};
    if (kt === "gewerbe" || kt === "privat") fromUrl.kundentyp = kt;
    if (en === "strom" || en === "gas" || en === "beides") fromUrl.energie = en;
    if (plz && /^\d{5}$/.test(plz)) fromUrl.plz = plz;
    if (verbrauch && /^\d{1,9}$/.test(verbrauch)) {
      if (en === "gas") fromUrl.verbrauchGas = verbrauch;
      else fromUrl.verbrauchStrom = verbrauch;
    }
    next = { ...next, ...fromUrl };
    let startStep = draft?.step ?? 0;
    if (!draft) {
      if (next.kundentyp && next.energie) startStep = 2;
      else if (next.kundentyp) startStep = 1;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- einmalige Initialisierung aus sessionStorage/URL (nur im Browser verfügbar)
    setState(next);
    setStep(startStep);
    setReady(true);
  }, [searchParams]);

  useEffect(() => {
    if (ready && !success) writeDraft(state, step, keyRef.current);
  }, [state, step, ready, success]);

  // Fokus auf Schrittüberschrift bei Schrittwechsel (nicht beim ersten Rendern)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    if (success) successRef.current?.focus();
  }, [success]);

  const set = useCallback(<K extends keyof CheckState>(key: K, value: CheckState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
    setErrors((e) => {
      if (!(key in e)) return e;
      const { [key]: _removed, ...rest } = e;
      return rest;
    });
  }, []);

  const current = STEPS[step]!;
  const isGewerbe = state.kundentyp === "gewerbe";
  const showStrom = state.energie === "strom" || state.energie === "beides";
  const showGas = state.energie === "gas" || state.energie === "beides";

  const focusFirstError = (errs: Record<string, string>) => {
    const first = Object.keys(errs)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(`${uid}-${first}`) ?? document.querySelector<HTMLElement>(`[name="${uid}-${first}"]`);
      el?.focus();
    });
  };

  const goNext = () => {
    const errs = validateUpTo(state, step);
    const stepErrs = Object.fromEntries(Object.entries(errs).filter(([k]) => (stepFields[current.id] as readonly string[]).includes(k)));
    if (Object.keys(stepErrs).length > 0) {
      setErrors(stepErrs);
      focusFirstError(stepErrs);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setErrors({});
    setFormError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const addFiles = (list: FileList | File[]) => {
    setFileError(null);
    const incoming = Array.from(list);
    const next = [...files];
    for (const f of incoming) {
      const ext = (f.name.match(/\.[a-z0-9]+$/i)?.[0] ?? "").toLowerCase();
      if (!(uploadRules.extensions as readonly string[]).includes(ext)) {
        setFileError(`„${f.name}“: Bitte nur PDF, JPG oder PNG hochladen.`);
        continue;
      }
      if (f.size > uploadRules.maxBytes) {
        setFileError(`„${f.name}“ ist größer als 10 MB.`);
        continue;
      }
      if (f.size === 0) {
        setFileError(`„${f.name}“ ist leer.`);
        continue;
      }
      if (next.length >= uploadRules.maxFiles) {
        setFileError(`Bitte höchstens ${uploadRules.maxFiles} Dateien hochladen.`);
        break;
      }
      if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
    }
    setFiles(next);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (step < STEPS.length - 1) {
      goNext();
      return;
    }
    const errs = validateUpTo(state, STEPS.length - 1);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const target = Math.min(...Object.keys(errs).map(stepOfField));
      setStep(target);
      focusFirstError(errs);
      return;
    }
    const outcome = await submit((token) => {
      const fd = new FormData();
      fd.set("formType", "energie-check");
      fd.set("formToken", token);
      fd.set("idempotencyKey", keyRef.current);
      fd.set("website", honeypotRef.current?.value ?? "");
      for (const [k, v] of Object.entries(state)) fd.set(k, typeof v === "boolean" ? String(v) : v);
      for (const f of files) fd.append("files", f, f.name);
      return fd;
    });
    if (outcome.ok) {
      clearDraft();
      setSuccess(outcome.reference);
      return;
    }
    if (outcome.kind === "validation") {
      setErrors(outcome.fields);
      const target = Math.min(...Object.keys(outcome.fields).map(stepOfField), STEPS.length - 1);
      setStep(target);
      setFormError(outcome.message);
      focusFirstError(outcome.fields);
      return;
    }
    if (outcome.kind === "upload") setFileError(outcome.message);
    else setFormError(outcome.message);
  };

  const restart = () => {
    keyRef.current = newIdempotencyKey();
    setState(initialState);
    setFiles([]);
    setStep(0);
    setSuccess(null);
  };

  const progress = useMemo(() => Math.round(((step + 1) / STEPS.length) * 100), [step]);

  if (success) {
    return (
      <div className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-10" data-testid="check-success">
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-energy-400 text-navy-900 shadow-glow">
            <Icon name="check" className="size-8" strokeWidth={3} />
          </span>
          <h2 ref={successRef} tabIndex={-1} className="mt-6 text-3xl font-bold outline-none">
            Vielen Dank! Ihre Anfrage ist bei uns eingegangen.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Ihre Referenznummer lautet{" "}
            <strong className="whitespace-nowrap font-display text-navy-900" data-testid="check-reference">
              {success}
            </strong>
            . Bitte geben Sie sie bei Rückfragen an.
          </p>
        </div>
        <ol className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { t: "Wir prüfen Ihre Angaben", d: "Verbrauch, Vertrag und – falls hochgeladen – Ihre Rechnung." },
            { t: "Wir melden uns persönlich", d: `Telefonisch oder per E-Mail zu unseren Geschäftszeiten (${company.openingHours.display}).` },
            { t: "Sie entscheiden", d: "Sie erhalten passende Angebote – ohne Abschlusszwang." },
          ].map((s, i) => (
            <li key={s.t} className="rounded-2xl bg-soft p-5">
              <span className="font-display text-sm font-bold text-electric-600">Schritt {i + 1}</span>
              <p className="mt-1 font-semibold text-navy-900">{s.t}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" variant="navy" icon="arrow">
            Zur Startseite
          </ButtonLink>
          <ButtonLink href="/ratgeber" variant="secondary">
            Ratgeber lesen
          </ButtonLink>
          <Button variant="link" onClick={restart} className="sm:ml-2">
            Weitere Anfrage stellen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby={`${uid}-title`} className="overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
      <h2 id={`${uid}-title`} className="sr-only">
        Energie-Check Formular
      </h2>

      {/* Fortschritt */}
      <div className="border-b border-line bg-soft/60 px-5 py-5 sm:px-8">
        <div className="flex items-center justify-between gap-4 text-sm">
          <p className="font-semibold text-navy-900" aria-live="polite" data-testid="step-indicator">
            Schritt {step + 1} von {STEPS.length}: {current.title}
          </p>
          <p className="hidden items-center gap-1.5 text-muted sm:flex">
            <Icon name="lock" className="size-4" />
            Verschlüsselte Übertragung
          </p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div className="h-full rounded-full bg-gradient-to-r from-electric-500 to-energy-400 transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>
        <ol className="mt-4 hidden grid-cols-5 gap-2 sm:grid">
          {STEPS.map((s, i) => (
            <li key={s.id} aria-current={i === step ? "step" : undefined} className="flex items-center gap-2 text-xs font-semibold">
              <span
                className={cn(
                  "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[0.7rem]",
                  i < step ? "bg-energy-400 text-navy-900" : i === step ? "bg-navy-900 text-white" : "bg-white text-muted ring-1 ring-line",
                )}
              >
                {i < step ? <Icon name="check" className="size-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span className={i === step ? "text-navy-900" : "text-muted"}>{s.short}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="px-5 py-7 sm:px-8 sm:py-9">
        <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none">
          {
            {
              kundentyp: "Für wen ist das Angebot?",
              energie: "Welche Energie möchten Sie prüfen lassen?",
              vertrag: "Ihre Lieferstelle und Ihr aktueller Vertrag",
              kontakt: "Wie erreichen wir Sie?",
              abschluss: "Rechnung hochladen und absenden",
            }[current.id as StepId]
          }
        </h3>

        {formError ? (
          <div role="alert" className="mt-5 flex gap-3 rounded-xl border border-danger/30 bg-danger-soft p-4 text-[0.95rem] text-danger" data-testid="form-error">
            <Icon name="info" className="mt-0.5 size-5 shrink-0" />
            <p>{formError}</p>
          </div>
        ) : null}

        {/* Schritt 1 */}
        {current.id === "kundentyp" ? (
          <div className="mt-6">
            <Segmented<Kundentyp>
              legend="Kundentyp"
              legendClassName="sr-only"
              name={`${uid}-kundentyp`}
              size="lg"
              value={state.kundentyp}
              onChange={(v) => set("kundentyp", v)}
              error={errors.kundentyp}
              options={[
                { value: "gewerbe", label: "Gewerbekunde", icon: "building", hint: "Unternehmen, Selbstständige, Vereine, Hausverwaltungen" },
                { value: "privat", label: "Privatkunde", icon: "home", hint: "Wohnung oder Eigenheim" },
              ]}
            />
          </div>
        ) : null}

        {/* Schritt 2 */}
        {current.id === "energie" ? (
          <div className="mt-6">
            <Segmented<Energie>
              legend="Energieart"
              legendClassName="sr-only"
              name={`${uid}-energie`}
              size="lg"
              columns={3}
              value={state.energie}
              onChange={(v) => set("energie", v)}
              error={errors.energie}
              options={[
                { value: "strom", label: "Strom", icon: "zap" },
                { value: "gas", label: "Gas", icon: "flame" },
                { value: "beides", label: "Strom und Gas", icon: "plus" },
              ]}
            />
          </div>
        ) : null}

        {/* Schritt 3 */}
        {current.id === "vertrag" ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <TextField
              id={`${uid}-plz`}
              label="Postleitzahl der Lieferstelle"
              required
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              value={state.plz}
              error={errors.plz}
              onChange={(e) => set("plz", e.target.value.replace(/\D/g, "").slice(0, 5))}
            />
            <TextField id={`${uid}-ort`} label="Ort" required autoComplete="address-level2" value={state.ort} error={errors.ort} onChange={(e) => set("ort", e.target.value)} />
            <TextField
              id={`${uid}-anbieter`}
              label="Aktueller Anbieter"
              optionalLabel
              value={state.anbieter}
              error={errors.anbieter}
              onChange={(e) => set("anbieter", e.target.value)}
              hint="Wie auf Ihrer Rechnung angegeben."
            />
            <TextField
              id={`${uid}-vertragsende`}
              label="Vertragsende"
              optionalLabel
              type="date"
              value={state.vertragsende}
              error={errors.vertragsende}
              onChange={(e) => set("vertragsende", e.target.value)}
              hint="Falls bekannt – steht meist auf der Jahresrechnung."
            />
            {showStrom ? (
              <TextField
                id={`${uid}-verbrauchStrom`}
                label="Jahresverbrauch Strom"
                optionalLabel
                inputMode="decimal"
                suffix="kWh"
                value={state.verbrauchStrom}
                error={errors.verbrauchStrom}
                onChange={(e) => set("verbrauchStrom", e.target.value)}
                hint="Unbekannt? Laden Sie im letzten Schritt Ihre Rechnung hoch."
              />
            ) : null}
            {showGas ? (
              <TextField
                id={`${uid}-verbrauchGas`}
                label="Jahresverbrauch Gas"
                optionalLabel
                inputMode="decimal"
                suffix="kWh"
                value={state.verbrauchGas}
                error={errors.verbrauchGas}
                onChange={(e) => set("verbrauchGas", e.target.value)}
                hint="In kWh, nicht in m³ – siehe Rechnung."
              />
            ) : null}
            <TextField
              id={`${uid}-arbeitspreis`}
              label="Aktueller Arbeitspreis"
              optionalLabel
              inputMode="decimal"
              suffix="ct/kWh"
              value={state.arbeitspreis}
              error={errors.arbeitspreis}
              onChange={(e) => set("arbeitspreis", e.target.value)}
            />
            <TextField
              id={`${uid}-grundpreis`}
              label="Aktueller Grundpreis"
              optionalLabel
              inputMode="decimal"
              suffix="€/Monat"
              value={state.grundpreis}
              error={errors.grundpreis}
              onChange={(e) => set("grundpreis", e.target.value)}
            />
            <div className="sm:col-span-2">
              <Segmented<"nein" | "ja" | "unbekannt">
                legend="Wurde der aktuelle Vertrag bereits gekündigt?"
                name={`${uid}-kuendigung`}
                value={state.kuendigung}
                onChange={(v) => set("kuendigung", v)}
                columns={3}
                options={[
                  { value: "nein", label: "Nein" },
                  { value: "ja", label: "Ja" },
                  { value: "unbekannt", label: "Weiß nicht" },
                ]}
              />
            </div>
            {isGewerbe ? (
              <>
                <div className="sm:col-span-2">
                  <Segmented<"slp" | "rlm" | "unbekannt">
                    legend="Zählerart"
                    name={`${uid}-zaehlerart`}
                    value={state.zaehlerart}
                    onChange={(v) => set("zaehlerart", v)}
                    columns={3}
                    stackOnMobile
                    options={[
                      { value: "slp", label: "Standard (SLP)" },
                      { value: "rlm", label: "Leistungsmessung (RLM)" },
                      { value: "unbekannt", label: "Weiß nicht" },
                    ]}
                  />
                  <p className="mt-2 text-xs text-muted">
                    RLM-Zähler gibt es in der Regel ab ca. 100.000 kWh Stromverbrauch pro Jahr.{" "}
                    <Link href="/gewerbestrom#rlm" className="link-inline" target="_blank">
                      Mehr erfahren
                    </Link>
                  </p>
                </div>
                <TextField
                  id={`${uid}-lieferstellen`}
                  label="Anzahl Lieferstellen / Standorte"
                  optionalLabel
                  inputMode="numeric"
                  value={state.lieferstellen}
                  error={errors.lieferstellen}
                  onChange={(e) => set("lieferstellen", e.target.value.replace(/\D/g, "").slice(0, 4))}
                />
              </>
            ) : null}
          </div>
        ) : null}

        {/* Schritt 4 */}
        {current.id === "kontakt" ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {isGewerbe ? (
              <TextField
                id={`${uid}-firma`}
                label="Firma"
                required
                autoComplete="organization"
                value={state.firma}
                error={errors.firma}
                onChange={(e) => set("firma", e.target.value)}
                className="sm:col-span-2"
              />
            ) : null}
            <TextField
              id={`${uid}-ansprechpartner`}
              label={isGewerbe ? "Ansprechpartner/in" : "Ihr Name"}
              required
              autoComplete="name"
              value={state.ansprechpartner}
              error={errors.ansprechpartner}
              onChange={(e) => set("ansprechpartner", e.target.value)}
              className="sm:col-span-2"
            />
            <TextField
              id={`${uid}-email`}
              label="E-Mail"
              required
              type="email"
              autoComplete="email"
              value={state.email}
              error={errors.email}
              onChange={(e) => set("email", e.target.value)}
            />
            <TextField
              id={`${uid}-telefon`}
              label="Telefonnummer"
              required
              type="tel"
              autoComplete="tel"
              value={state.telefon}
              error={errors.telefon}
              onChange={(e) => set("telefon", e.target.value)}
              hint="Für Rückfragen zu Ihrem Angebot."
            />
            <TextAreaField
              id={`${uid}-nachricht`}
              label="Nachricht"
              optionalLabel
              rows={4}
              maxLength={2000}
              value={state.nachricht}
              error={errors.nachricht}
              onChange={(e) => set("nachricht", e.target.value)}
              hint="Zum Beispiel Rückrufwunsch, Besonderheiten Ihres Betriebs oder Fragen."
              className="sm:col-span-2"
            />
          </div>
        ) : null}

        {/* Schritt 5 */}
        {current.id === "abschluss" ? (
          <div className="mt-6 space-y-7">
            <div>
              <p className="text-sm font-semibold text-navy-900">
                Strom- oder Gasrechnung <span className="font-normal text-muted">(optional)</span>
              </p>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={cn(
                  "mt-2 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-colors",
                  dragOver ? "border-electric-500 bg-electric-500/5" : "border-line-strong bg-soft/50",
                )}
              >
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-white text-electric-600 shadow-card">
                  <Icon name="upload" className="size-6" />
                </span>
                <p className="mt-3 font-semibold text-navy-900">Datei hierher ziehen oder</p>
                <Button variant="secondary" size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()} iconLeft="file">
                  Datei auswählen
                </Button>
                <input
                  ref={fileInputRef}
                  id={`${uid}-files`}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  className="sr-only"
                  aria-label="Rechnung hochladen (PDF, JPG oder PNG)"
                  aria-describedby={`${uid}-files-hint`}
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
                <p id={`${uid}-files-hint`} className="mt-3 text-xs text-muted">
                  PDF, JPG oder PNG · max. {uploadRules.maxFiles} Dateien · je max. 10 MB
                </p>
              </div>
              {fileError ? (
                <p role="alert" className="mt-2 text-sm font-medium text-danger" data-testid="file-error">
                  {fileError}
                </p>
              ) : null}
              {files.length > 0 ? (
                <ul className="mt-3 space-y-2" aria-label="Ausgewählte Dateien">
                  {files.map((f) => (
                    <li key={`${f.name}-${f.size}`} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-2.5">
                      <span className="flex min-w-0 items-center gap-2.5">
                        <Icon name="file" className="size-4 shrink-0 text-electric-600" />
                        <span className="truncate text-sm font-medium text-navy-900">{f.name}</span>
                        <span className="shrink-0 text-xs text-muted">{formatBytes(f.size)}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setFiles((list) => list.filter((x) => x !== f))}
                        className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-danger hover:bg-danger-soft"
                        aria-label={`${f.name} entfernen`}
                      >
                        Entfernen
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-3 flex gap-2 rounded-xl bg-soft p-3 text-xs leading-relaxed text-muted">
                <Icon name="shield" className="mt-0.5 size-4 shrink-0 text-electric-600" />
                Dateien werden verschlüsselt gespeichert und nicht öffentlich zugänglich gemacht. Bankverbindungen und nicht benötigte Angaben
                können Sie vorher gerne schwärzen.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-line p-5">
              <CheckboxField
                id={`${uid}-datenschutz`}
                checked={state.datenschutz}
                onChange={(v) => set("datenschutz", v)}
                error={errors.datenschutz}
                required
              >
                Ich habe die{" "}
                <Link href="/datenschutz" target="_blank" className="link-inline">
                  Datenschutzhinweise
                </Link>{" "}
                zur Kenntnis genommen. Meine Angaben werden zur Bearbeitung meiner Anfrage verwendet.
                <span className="text-danger" aria-hidden="true">
                  {" "}
                  *
                </span>
              </CheckboxField>
              <div className="border-t border-line pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Freiwillig – nicht erforderlich für Ihre Anfrage</p>
                <div className="space-y-3">
                  <CheckboxField id={`${uid}-werbungEmail`} checked={state.werbungEmail} onChange={(v) => set("werbungEmail", v)}>
                    {consentTexts.marketingEmail}
                  </CheckboxField>
                  <CheckboxField id={`${uid}-werbungTelefon`} checked={state.werbungTelefon} onChange={(v) => set("werbungTelefon", v)}>
                    {consentTexts.marketingPhone}
                  </CheckboxField>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Honeypot – für Menschen unsichtbar */}
        <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
          <label htmlFor={`${uid}-website`}>Bitte leer lassen</label>
          <input ref={honeypotRef} id={`${uid}-website`} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-line bg-soft/40 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        {step > 0 ? (
          <Button variant="secondary" onClick={goBack} iconLeft="arrowLeft">
            Zurück
          </Button>
        ) : (
          <p className="text-sm text-muted">Kostenlos & unverbindlich · ca. 2 Minuten</p>
        )}
        {step < STEPS.length - 1 ? (
          <Button type="submit" size="lg" icon="arrow" data-testid="next-step">
            Weiter
          </Button>
        ) : (
          <Button type="submit" size="lg" icon="arrow" disabled={submitting} data-testid="submit">
            {submitting ? "Wird gesendet …" : "Anfrage kostenlos absenden"}
          </Button>
        )}
      </div>
    </form>
  );
}
