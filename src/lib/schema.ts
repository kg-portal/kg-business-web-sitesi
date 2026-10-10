/**
 * Schema.org-Strukturdaten (JSON-LD). Nur verifizierbare Angaben –
 * keine Bewertungen, keine Gründungsjahre, keine erfundenen Kennzahlen.
 */
import { company } from "@/content/company";
import { absoluteUrl } from "./site";

export const ORGANIZATION_ID = `${absoluteUrl("/")}#organization`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORGANIZATION_ID,
    name: company.brandName,
    legalName: company.legalName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/brand/kg-business-logo.png"),
    image: absoluteUrl("/og/kg-business-og.png"),
    description:
      "Beratung und Vermittlung von Strom- und Gasverträgen für Unternehmen und Privathaushalte – Tarifvergleich, Vertragsprüfung und Begleitung beim Anbieterwechsel.",
    telephone: company.phone.international,
    email: company.email,
    vatID: company.vatId,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      postalCode: company.address.postalCode,
      addressLocality: company.address.city,
      addressRegion: company.address.region,
      addressCountry: company.address.countryCode,
    },
    openingHours: company.openingHours.schema,
    areaServed: [
      ...company.serviceArea.focus.map((city) => ({ "@type": "City", name: city })),
      { "@type": "State", name: company.serviceArea.region },
      { "@type": "Country", name: "Deutschland" },
    ],
    knowsAbout: ["Gewerbestrom", "Gewerbegas", "Tarifvergleich", "Anbieterwechsel", "Energieberatung"],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    url: absoluteUrl("/"),
    name: company.brandName,
    inLanguage: "de-DE",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function serviceSchema(input: { name: string; description: string; path: string; serviceType: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    serviceType: input.serviceType,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@id": ORGANIZATION_ID },
    areaServed: { "@type": "Country", name: "Deutschland" },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: "Unverbindliche, für Kundinnen und Kunden kostenfreie Erstprüfung",
    },
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    inLanguage: "de-DE",
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    image: absoluteUrl("/og/kg-business-og.png"),
  };
}
