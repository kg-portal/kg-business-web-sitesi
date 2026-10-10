import { cn } from "@/lib/cn";

/**
 * Eigenständige, im Code gezeichnete Hero-Grafik (keine Fremdlizenzen):
 * Energienetz mit fließenden Linien über einer Linien-Skyline aus Bürotürmen,
 * Strommast, Windrad und Produktionshalle. Animationen respektieren
 * prefers-reduced-motion (globale Regel in globals.css).
 */
export function EnergyBackdrop({ variant = "home", className }: { variant?: "home" | "page"; className?: string }) {
  const isHome = variant === "home";
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {/* Farbverläufe */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_85%_-10%,rgb(22_139_255/0.35),transparent_60%),radial-gradient(900px_500px_at_-10%_110%,rgb(53_205_85/0.16),transparent_60%),linear-gradient(180deg,#081a40_0%,#0b2152_55%,#081a40_100%)]" />
      <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_30%,black_10%,transparent_70%)]" />

      <svg
        className="absolute inset-x-0 bottom-0 h-full w-full"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMax slice"
        focusable="false"
      >
        <defs>
          <linearGradient id="kg-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#4da3ff" stopOpacity="0" />
            <stop offset="0.35" stopColor="#4da3ff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#35cd55" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="kg-fade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#081a40" stopOpacity="0" />
            <stop offset="1" stopColor="#081a40" stopOpacity="0.9" />
          </linearGradient>
          <pattern id="kg-windows" width="14" height="18" patternUnits="userSpaceOnUse">
            <rect x="3" y="4" width="6" height="8" rx="1" fill="#8cc4ff" fillOpacity="0.16" />
          </pattern>
          <pattern id="kg-windows-lit" width="14" height="18" patternUnits="userSpaceOnUse">
            <rect x="3" y="4" width="6" height="8" rx="1" fill="#8cc4ff" fillOpacity="0.1" />
            <rect x="3" y="4" width="6" height="8" rx="1" fill="#35cd55" fillOpacity="0.18" className="animate-pulse-soft" />
          </pattern>
        </defs>

        {/* Energiefluss-Linien */}
        <g fill="none" strokeLinecap="round">
          {[
            "M-40 470 C 260 380, 520 560, 820 440 S 1240 330, 1480 400",
            "M-40 520 C 300 450, 560 610, 860 500 S 1260 400, 1480 470",
            "M-40 420 C 220 330, 500 480, 780 380 S 1200 260, 1480 320",
            ...(isHome ? ["M-40 570 C 340 520, 640 650, 940 560 S 1300 470, 1480 530"] : []),
          ].map((d, i) => (
            <g key={d}>
              <path d={d} stroke="url(#kg-line)" strokeWidth={i === 0 ? 1.6 : 1.1} strokeOpacity={0.9} />
              <path
                d={d}
                stroke={i % 2 === 0 ? "#35cd55" : "#8cc4ff"}
                strokeWidth={i === 0 ? 3 : 2.2}
                strokeDasharray="3 237"
                className="animate-flow"
                style={{ animationDelay: `${i * -1.4}s`, animationDuration: `${5 + i}s` }}
              />
            </g>
          ))}
        </g>

        {/* Knotenpunkte */}
        <g>
          {[
            [820, 440],
            [1240, 360],
            [560, 520],
            [1060, 470],
          ].map(([cx, cy], i) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r="10" fill="#168bff" fillOpacity="0.12" className="animate-pulse-soft" style={{ animationDelay: `${i * 0.7}s` }} />
              <circle cx={cx} cy={cy} r="3.2" fill="#8cc4ff" />
            </g>
          ))}
        </g>

        {/* Skyline */}
        <g stroke="#8cc4ff" strokeOpacity="0.28" strokeWidth="1.2">
          {/* Produktionshalle links */}
          <path d="M40 800 V690 l60 -30 v30 l60 -30 v30 l60 -30 V800" fill="#0b2152" />
          <rect x="190" y="610" width="18" height="80" fill="#0b2152" />
          {/* Bürotürme */}
          <rect x="300" y="560" width="96" height="240" fill="url(#kg-windows)" />
          <rect x="300" y="560" width="96" height="240" fill="none" />
          <rect x="410" y="610" width="70" height="190" fill="url(#kg-windows-lit)" />
          <rect x="410" y="610" width="70" height="190" fill="none" />
          <path d="M500 800 V520 l60 -40 l60 40 V800" fill="url(#kg-windows)" />
          <path d="M500 800 V520 l60 -40 l60 40 V800" fill="none" />
          <rect x="640" y="650" width="120" height="150" fill="url(#kg-windows)" />
          <rect x="640" y="650" width="120" height="150" fill="none" />
          {/* Strommast */}
          <g strokeOpacity="0.35">
            <path d="M880 800 L905 600 L930 800 M893 700 h24 M887 750 h36 M898 650 h14" fill="none" />
            <path d="M860 625 h90 M870 660 h70" fill="none" />
            <path d="M950 625 C 1040 650, 1120 640, 1200 610" fill="none" strokeDasharray="2 4" />
          </g>
          {/* Glasfassade */}
          <path d="M1000 800 V590 h110 V800" fill="#0b2152" />
          <path d="M1000 590 l110 0 M1018 590 V800 M1036 590 V800 M1054 590 V800 M1072 590 V800 M1090 590 V800" fill="none" strokeOpacity="0.18" />
          <rect x="1125" y="640" width="80" height="160" fill="url(#kg-windows-lit)" />
          <rect x="1125" y="640" width="80" height="160" fill="none" />
          {/* Windrad */}
          <g>
            <path d="M1300 800 L1306 600 L1312 800" fill="#0b2152" />
            <g className={isHome ? "origin-[1306px_600px] motion-safe:animate-[spin_18s_linear_infinite]" : undefined}>
              <path d="M1306 600 L1306 520 M1306 600 L1375 640 M1306 600 L1237 640" strokeOpacity="0.45" strokeWidth="2.4" />
            </g>
            <circle cx="1306" cy="600" r="4" fill="#8cc4ff" fillOpacity="0.6" stroke="none" />
          </g>
          {/* Solarfeld */}
          <g strokeOpacity="0.3">
            <path d="M1350 790 l30 -24 h56 l-30 24 Z M1380 766 l-30 24" fill="#0d2457" />
          </g>
        </g>
        <rect x="0" y="560" width="1440" height="240" fill="url(#kg-fade)" />
      </svg>
    </div>
  );
}
