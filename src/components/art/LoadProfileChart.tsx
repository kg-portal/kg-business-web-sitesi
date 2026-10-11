/**
 * Schematischer Tageslastgang (96 Viertelstunden) zur Erklärung von
 * Grundlast und Leistungsspitze. Keine Messwerte, keine Einheiten.
 */
function profile(i: number): number {
  const h = i / 4;
  const base = 0.22;
  const work = h >= 6.5 && h <= 18.5 ? 0.5 * Math.sin(((h - 6.5) / 12) * Math.PI) : 0;
  const morning = Math.exp(-((h - 8) ** 2) / 0.8) * 0.18;
  const noon = Math.exp(-((h - 12.25) ** 2) / 0.35) * 0.16;
  const wiggle = Math.sin(i * 1.7) * 0.018 + Math.sin(i * 0.53) * 0.012;
  return Math.min(1, base + work + morning + noon + wiggle);
}

export function LoadProfileChart() {
  const W = 640;
  const H = 260;
  const pad = { l: 16, r: 16, t: 28, b: 34 };
  const n = 96;
  const values = Array.from({ length: n }, (_, i) => profile(i));
  const max = Math.max(...values);
  const peakIndex = values.indexOf(max);
  const bw = (W - pad.l - pad.r) / n;
  const y = (v: number) => pad.t + (1 - v) * (H - pad.t - pad.b);
  const baseY = y(0.22);

  return (
    <figure className="overflow-hidden rounded-3xl border border-line bg-white p-5 shadow-lift sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-sm font-bold text-navy-900">Lastgang · ein Werktag</p>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-electric-500/70" aria-hidden="true" />
            Viertelstundenwert
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-energy-400" aria-hidden="true" />
            Spitze
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 h-auto w-full" role="img" aria-label="Schematischer Tageslastgang mit Grundlast in der Nacht, Anstieg am Morgen und einer Leistungsspitze zur Mittagszeit">
        <defs>
          <linearGradient id="lp-bar" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#168bff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#168bff" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={pad.l} x2={W - pad.r} y1={y(g)} y2={y(g)} stroke="#e3eaf5" strokeWidth="1" />
        ))}
        {values.map((v, i) => (
          <rect
            key={i}
            x={pad.l + i * bw + 0.6}
            y={y(v)}
            width={Math.max(1, bw - 1.2)}
            height={H - pad.b - y(v)}
            rx="1.2"
            fill={i === peakIndex ? "#35cd55" : "url(#lp-bar)"}
          />
        ))}
        <line x1={pad.l} x2={W - pad.r} y1={baseY} y2={baseY} stroke="#081a40" strokeWidth="1.5" strokeDasharray="5 5" />
        <text x={pad.l + 4} y={baseY - 7} fontSize="12" fontWeight="600" fill="#081a40">
          Grundlast
        </text>
        <g transform={`translate(${pad.l + peakIndex * bw + bw / 2}, ${y(max) - 8})`}>
          <text textAnchor="middle" fontSize="12" fontWeight="700" fill="#147a2e">
            Leistungsspitze
          </text>
        </g>
        {["0 Uhr", "6 Uhr", "12 Uhr", "18 Uhr", "24 Uhr"].map((t, i) => (
          <text key={t} x={pad.l + (i * (W - pad.l - pad.r)) / 4} y={H - 10} fontSize="11" fill="#5b6b86" textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"}>
            {t}
          </text>
        ))}
      </svg>
      <figcaption className="mt-3 text-xs leading-relaxed text-muted">
        Schematische Darstellung, keine Messwerte. Bei RLM-Zählern bestimmt die höchste Viertelstundenleistung im Jahr den
        Leistungspreis des Netzentgelts.
      </figcaption>
    </figure>
  );
}
