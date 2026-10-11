"use client";

/** Fallback, falls das Root-Layout selbst fehlschlägt (ohne Abhängigkeiten). */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="de">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#081a40", color: "#fff" }}>
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "120px 24px" }}>
          <p style={{ letterSpacing: "0.2em", fontWeight: 700, color: "#8ee6a0", fontSize: 14 }}>FEHLER 500</p>
          <h1 style={{ fontSize: 36, lineHeight: 1.15 }}>Die Seite konnte nicht geladen werden.</h1>
          <p style={{ color: "#c9d6ee", fontSize: 18 }}>Bitte versuchen Sie es erneut oder rufen Sie uns an: 0203 47 96 68 22.</p>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: 24, padding: "14px 22px", borderRadius: 12, border: 0, background: "#35cd55", color: "#081a40", fontWeight: 700, fontSize: 16, cursor: "pointer" }}
          >
            Erneut versuchen
          </button>
        </main>
      </body>
    </html>
  );
}
