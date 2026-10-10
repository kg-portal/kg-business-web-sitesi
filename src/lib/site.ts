/**
 * Umgebungsabhängige Website-Konfiguration (öffentlich, keine Geheimnisse).
 *
 * SITE_ENV steuert die Indexierung:
 *  - "production": indexierbar (erst nach Freigabe durch KG Business setzen)
 *  - alles andere (Standard "preview"): noindex, robots.txt Disallow
 */
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kg-business.de";

export const siteConfig = {
  url: rawUrl.replace(/\/+$/, ""),
  env: process.env.SITE_ENV ?? "preview",
  locale: "de_DE",
  language: "de-DE",
  defaultOgImage: "/og/kg-business-og.png",
} as const;

export function isIndexable(): boolean {
  return siteConfig.env === "production";
}

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
