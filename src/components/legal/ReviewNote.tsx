import type { ReactNode } from "react";
import { isIndexable } from "@/lib/site";

/**
 * Prüfhinweis für offene rechtliche/inhaltliche Punkte.
 * Wird NUR in Vorschau-Umgebungen angezeigt (SITE_ENV ≠ production).
 * Vor dem Livegang müssen alle Hinweise erledigt sein (docs/LEGAL_REVIEW.md).
 */
export function ReviewNote({ children }: { children: ReactNode }) {
  if (isIndexable()) return null;
  return (
    <div role="note" className="not-prose my-4 rounded-xl border-2 border-dashed border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <strong className="font-bold">Prüfhinweis (nur Vorschau):</strong> {children}
    </div>
  );
}
