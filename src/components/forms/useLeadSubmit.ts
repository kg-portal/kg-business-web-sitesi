"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { company } from "@/content/company";

export type SubmitOutcome =
  | { ok: true; reference: string }
  | { ok: false; kind: "validation"; message: string; fields: Record<string, string> }
  | { ok: false; kind: "upload" | "rate_limited" | "server" | "network" | "rejected"; message: string };

const TOKEN_REFRESH_MS = 4 * 3600_000;

async function fetchToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/form-token", { cache: "no-store", headers: { "x-kg-form": "1" } });
    if (!res.ok) return null;
    const data = (await res.json()) as { token?: string };
    return data.token ?? null;
  } catch {
    return null;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Formular-Token beim Laden holen und Übermittlung an /api/leads.
 * Abgelaufene Tokens werden einmalig automatisch erneuert.
 */
export function useLeadSubmit() {
  const tokenRef = useRef<{ value: string; at: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    void fetchToken().then((t) => {
      if (active && t) tokenRef.current = { value: t, at: Date.now() };
    });
    return () => {
      active = false;
    };
  }, []);

  const submit = useCallback(async (build: (token: string) => FormData): Promise<SubmitOutcome> => {
    setSubmitting(true);
    try {
      for (let attempt = 0; attempt < 2; attempt++) {
        if (!tokenRef.current || Date.now() - tokenRef.current.at > TOKEN_REFRESH_MS) {
          const t = await fetchToken();
          if (!t) return { ok: false, kind: "network", message: networkMessage };
          tokenRef.current = { value: t, at: Date.now() };
          // Frisches Token: Mindest-Ausfüllzeit abwarten
          await sleep(4200);
        }
        let res: Response;
        try {
          res = await fetch("/api/leads", { method: "POST", body: build(tokenRef.current.value), headers: { "x-kg-form": "1" } });
        } catch {
          return { ok: false, kind: "network", message: networkMessage };
        }
        let data: Record<string, unknown> = {};
        try {
          data = (await res.json()) as Record<string, unknown>;
        } catch {
          // leere oder ungültige Antwort
        }
        const message = typeof data.message === "string" ? data.message : serverMessage;
        if (res.ok && typeof data.reference === "string") return { ok: true, reference: data.reference };
        if (res.status === 400 && (data.error === "token_expired" || data.error === "token_invalid" || data.error === "too_fast") && attempt === 0) {
          tokenRef.current = null;
          continue;
        }
        if (res.status === 422 && data.error === "validation") {
          return { ok: false, kind: "validation", message, fields: (data.fields as Record<string, string>) ?? {} };
        }
        if (res.status === 422 || res.status === 413) return { ok: false, kind: "upload", message };
        if (res.status === 429) return { ok: false, kind: "rate_limited", message };
        if (res.status >= 500) return { ok: false, kind: "server", message };
        return { ok: false, kind: "rejected", message };
      }
      return { ok: false, kind: "rejected", message: serverMessage };
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submit, submitting };
}

const networkMessage = `Die Verbindung ist fehlgeschlagen. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut – oder rufen Sie uns an: ${company.phone.display}.`;
const serverMessage = `Ihre Anfrage konnte leider nicht gespeichert werden. Bitte versuchen Sie es erneut oder rufen Sie uns an: ${company.phone.display}.`;
