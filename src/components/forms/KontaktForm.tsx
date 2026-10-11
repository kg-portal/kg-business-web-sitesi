"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Segmented } from "@/components/ui/Segmented";
import { fieldErrors, kontaktSchema } from "@/lib/lead-schema";
import { CheckboxField, TextAreaField, TextField } from "./fields";
import { useLeadSubmit } from "./useLeadSubmit";

interface KontaktState {
  kundentyp: "gewerbe" | "privat" | "";
  ansprechpartner: string;
  firma: string;
  email: string;
  telefon: string;
  nachricht: string;
  datenschutz: boolean;
}

const initial: KontaktState = { kundentyp: "", ansprechpartner: "", firma: "", email: "", telefon: "", nachricht: "", datenschutz: false };

/** Kurzes Kontaktformular – gleiche Sicherheitsmechanismen wie der Energie-Check. */
export function KontaktForm() {
  const uid = useId();
  const [state, setState] = useState<KontaktState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const keyRef = useRef<string>("");
  const honeypotRef = useRef<HTMLInputElement>(null);
  const { submit, submitting } = useLeadSubmit();

  const set = <K extends keyof KontaktState>(k: K, v: KontaktState[K]) => {
    setState((s) => ({ ...s, [k]: v }));
    setErrors((e) => {
      if (!(k in e)) return e;
      const { [k]: _removed, ...rest } = e;
      return rest;
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const parsed = kontaktSchema.safeParse({ ...state, kundentyp: state.kundentyp || undefined });
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      const first = Object.keys(errs)[0];
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    keyRef.current ||= crypto.randomUUID();
    const outcome = await submit((token) => {
      const fd = new FormData();
      fd.set("formType", "kontakt");
      fd.set("formToken", token);
      fd.set("idempotencyKey", keyRef.current);
      fd.set("website", honeypotRef.current?.value ?? "");
      for (const [k, v] of Object.entries(state)) if (v !== "") fd.set(k, typeof v === "boolean" ? String(v) : v);
      return fd;
    });
    if (outcome.ok) {
      setSuccess(outcome.reference);
      setState(initial);
      keyRef.current = "";
      return;
    }
    if (outcome.kind === "validation") setErrors(outcome.fields);
    setFormError(outcome.message);
  };

  if (success) {
    return (
      <div role="status" className="rounded-3xl border border-line bg-white p-8 text-center shadow-lift" data-testid="kontakt-success">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-energy-400 text-navy-900">
          <Icon name="check" className="size-7" strokeWidth={3} />
        </span>
        <h2 className="mt-5 text-2xl font-bold">Vielen Dank! Ihre Nachricht ist bei uns eingegangen.</h2>
        <p className="mt-3 text-muted">
          Referenz: <strong className="text-navy-900">{success}</strong>. Wir melden uns so bald wie möglich.
        </p>
        <Button variant="link" className="mt-6" onClick={() => setSuccess(null)}>
          Weitere Nachricht senden
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby={`${uid}-title`} className="rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8">
      <h2 id={`${uid}-title`} className="text-2xl font-bold">
        Nachricht senden
      </h2>
      <p className="mt-2 text-muted">
        Für ein konkretes Angebot nutzen Sie am besten den{" "}
        <Link href="/energie-check" className="link-inline">
          Energie-Check
        </Link>
        .
      </p>
      {formError ? (
        <div role="alert" className="mt-5 rounded-xl border border-danger/30 bg-danger-soft p-4 text-[0.95rem] text-danger" data-testid="kontakt-error">
          {formError}
        </div>
      ) : null}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Segmented<"gewerbe" | "privat">
            legend="Ich bin (optional)"
            name={`${uid}-kundentyp`}
            value={state.kundentyp}
            onChange={(v) => set("kundentyp", v)}
            options={[
              { value: "gewerbe", label: "Unternehmen", icon: "building" },
              { value: "privat", label: "Privatperson", icon: "home" },
            ]}
          />
        </div>
        <TextField id={`${uid}-ansprechpartner`} label="Name" required autoComplete="name" value={state.ansprechpartner} error={errors.ansprechpartner} onChange={(e) => set("ansprechpartner", e.target.value)} />
        <TextField id={`${uid}-firma`} label="Firma" optionalLabel autoComplete="organization" value={state.firma} error={errors.firma} onChange={(e) => set("firma", e.target.value)} />
        <TextField id={`${uid}-email`} label="E-Mail" required type="email" autoComplete="email" value={state.email} error={errors.email} onChange={(e) => set("email", e.target.value)} />
        <TextField id={`${uid}-telefon`} label="Telefon" optionalLabel type="tel" autoComplete="tel" value={state.telefon} error={errors.telefon} onChange={(e) => set("telefon", e.target.value)} />
        <TextAreaField
          id={`${uid}-nachricht`}
          label="Ihre Nachricht"
          required
          rows={5}
          maxLength={2000}
          value={state.nachricht}
          error={errors.nachricht}
          onChange={(e) => set("nachricht", e.target.value)}
          className="sm:col-span-2"
        />
        <div className="sm:col-span-2">
          <CheckboxField id={`${uid}-datenschutz`} checked={state.datenschutz} onChange={(v) => set("datenschutz", v)} error={errors.datenschutz} required>
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
        </div>
      </div>
      <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Bitte leer lassen</label>
        <input ref={honeypotRef} id={`${uid}-website`} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <Button type="submit" size="lg" icon="arrow" className="mt-7 w-full sm:w-auto" disabled={submitting} data-testid="kontakt-submit">
        {submitting ? "Wird gesendet …" : "Nachricht senden"}
      </Button>
    </form>
  );
}
