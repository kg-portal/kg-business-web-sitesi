"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { company } from "@/content/company";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Nur Digest protokollieren – keine Nutzereingaben
    console.error("Seitenfehler", error.digest ?? "ohne Digest");
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center bg-soft pt-24">
      <div className="container-page py-20">
        <p className="font-display text-sm font-bold tracking-[0.2em] text-electric-600">FEHLER 500</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">Hier ist etwas schiefgelaufen.</h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          Bitte versuchen Sie es erneut. Wenn das Problem bestehen bleibt, erreichen Sie uns telefonisch unter{" "}
          <a className="link-inline" href={company.phone.href}>
            {company.phone.display}
          </a>
          .
        </p>
        {error.digest ? <p className="mt-3 text-sm text-muted">Fehlercode: {error.digest}</p> : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset} size="lg" icon="arrow">
            Erneut versuchen
          </Button>
          <ButtonLink href="/" size="lg" variant="secondary">
            Zur Startseite
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
