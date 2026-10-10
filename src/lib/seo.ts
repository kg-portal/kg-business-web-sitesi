import type { Metadata } from "next";
import { company } from "@/content/company";
import { absoluteUrl, isIndexable, siteConfig } from "./site";

interface PageMetaInput {
  /** Seitentitel ohne Markenzusatz (wird über das Template ergänzt) */
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  /** Titel exakt so verwenden (ohne Template) */
  absoluteTitle?: boolean;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

export function buildMetadata(input: PageMetaInput): Metadata {
  const url = absoluteUrl(input.path);
  const image = input.ogImage ?? siteConfig.defaultOgImage;
  const index = isIndexable() && !input.noindex;
  const fullTitle = input.absoluteTitle ? input.title : `${input.title} | ${company.brandName}`;
  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      type: input.type ?? "website",
      locale: siteConfig.locale,
      url,
      siteName: company.brandName,
      title: fullTitle,
      description: input.description,
      images: [{ url: image, width: 1200, height: 630, alt: `${company.brandName} – Strom & Gas Energieberatung` }],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
      images: [image],
    },
  };
}
