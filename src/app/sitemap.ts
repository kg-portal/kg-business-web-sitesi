import type { MetadataRoute } from "next";
import { industries } from "@/content/industries";
import { articles } from "@/content/ratgeber";
import { absoluteUrl } from "@/lib/site";

const STATIC: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/gewerbestrom", priority: 0.9, changeFrequency: "monthly" },
  { path: "/gewerbegas", priority: 0.9, changeFrequency: "monthly" },
  { path: "/energie-check", priority: 0.9, changeFrequency: "monthly" },
  { path: "/privatkunden", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privatkunden/strom", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privatkunden/gas", priority: 0.7, changeFrequency: "monthly" },
  { path: "/branchen", priority: 0.7, changeFrequency: "monthly" },
  { path: "/so-funktionierts", priority: 0.6, changeFrequency: "yearly" },
  { path: "/energieberatung-duisburg", priority: 0.7, changeFrequency: "monthly" },
  { path: "/ratgeber", priority: 0.7, changeFrequency: "weekly" },
  { path: "/ueber-uns", priority: 0.5, changeFrequency: "yearly" },
  { path: "/kontakt", priority: 0.6, changeFrequency: "yearly" },
  { path: "/impressum", priority: 0.2, changeFrequency: "yearly" },
  { path: "/datenschutz", priority: 0.2, changeFrequency: "yearly" },
  { path: "/agb", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookie-hinweis", priority: 0.1, changeFrequency: "yearly" },
];

const CONTENT_DATE = new Date("2026-10-10");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC.map((s) => ({ url: absoluteUrl(s.path), lastModified: CONTENT_DATE, changeFrequency: s.changeFrequency, priority: s.priority })),
    ...industries.map((i) => ({ url: absoluteUrl(`/branchen/${i.slug}`), lastModified: CONTENT_DATE, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...articles.map((a) => ({ url: absoluteUrl(`/ratgeber/${a.slug}`), lastModified: new Date(a.updated), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
