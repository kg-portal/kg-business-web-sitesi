import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const isProductionSite = process.env.SITE_ENV === "production";
const enableHsts = process.env.ENABLE_HSTS === "true";

/**
 * Content-Security-Policy: keine externen Quellen (Schriften selbst gehostet,
 * kein Tracking, keine eingebetteten Dienste). 'unsafe-inline' für Skripte ist
 * für Next.js-Hydration bei statischer Auslieferung nötig – siehe docs/DECISIONS.md.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
  ...(enableHsts ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(enableHsts ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }] : []),
  // Vorschau-/Testumgebungen niemals indexieren
  ...(isProductionSite ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }]),
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  serverExternalPackages: ["better-sqlite3"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 828, 1080, 1280, 1600, 1920],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
  async redirects() {
    // Alte V1-URLs (statischer HTML-Prototyp). Live-Site-URLs: siehe docs/SEO_REDIRECTS.md
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/impressum.html", destination: "/impressum", permanent: true },
      { source: "/datenschutz.html", destination: "/datenschutz", permanent: true },
      { source: "/agb.html", destination: "/agb", permanent: true },
    ];
  },
};

export default nextConfig;
