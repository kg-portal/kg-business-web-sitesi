/**
 * Zentrale Unternehmensdaten – EINZIGE Quelle für Impressum, Footer, Kontakt,
 * Schema.org und Rechtstexte.
 *
 * Herkunft: Impressum/Datenschutz/AGB der V1-Website im Repository
 * (Backup-Branch backup/kg-business-before-v2-20261011, Commit ea8ac0d).
 * Die Live-Website kg-business.de konnte aus der Entwicklungsumgebung nicht
 * abgerufen werden – ein Abgleich steht aus.
 *
 * `verification` dokumentiert, welche Angaben vor dem Livegang durch
 * KG Business (Murat) bestätigt werden müssen. Siehe docs/LEGAL_REVIEW.md.
 */

export type VerificationStatus = "bestaetigt" | "aus-v1-uebernommen" | "offen";

export const company = {
  /** Markenname im Fließtext */
  brandName: "KG Business",
  /** Schreibweise in Wortmarke und Impressum (wie V1) */
  legalName: "KG-BUSINESS",
  legalForm: "Einzelunternehmen",
  owner: "Damla Kicci",
  ownerTitle: "Inhaberin",
  tagline: "Energie. Einfach. Persönlich.",
  address: {
    street: "Fliederstr. 59",
    postalCode: "47055",
    city: "Duisburg",
    region: "Nordrhein-Westfalen",
    country: "Deutschland",
    countryCode: "DE",
  },
  phone: {
    display: "0203 47 96 68 22",
    international: "+49 203 47 96 68 22",
    href: "tel:+4920347966822",
  },
  email: "info@kg-business.de",
  vatId: "DE325770756",
  website: "https://www.kg-business.de",
  /** Aus der V1-Topbar übernommen – Bestätigung erforderlich. */
  openingHours: {
    display: "Mo–Fr 09:00–18:00 Uhr",
    schema: ["Mo-Fr 09:00-18:00"],
  },
  /** Physischer Sitz ≠ Einsatzgebiet. Beratung bundesweit, Fokus NRW. */
  serviceArea: {
    focus: ["Duisburg", "Düsseldorf", "Essen", "Oberhausen", "Mülheim an der Ruhr", "Krefeld"],
    region: "Nordrhein-Westfalen",
    nationwide: true,
  },
  /** Rolle am Markt – maßgeblich für Formulierungen (kein Versorger). */
  role: "Vermittlung und Beratung von Strom- und Gaslieferverträgen; kein Energieversorger.",
  compensation:
    "Die Beratung ist für Kundinnen und Kunden in der Regel kostenfrei. KG Business erhält bei erfolgreicher Vermittlung eine Provision vom jeweiligen Energieversorger.",
  verification: {
    legalName: "aus-v1-uebernommen",
    owner: "aus-v1-uebernommen",
    address: "aus-v1-uebernommen",
    phone: "aus-v1-uebernommen",
    email: "aus-v1-uebernommen",
    vatId: "aus-v1-uebernommen",
    openingHours: "offen",
    handelsregister: "offen",
    foundingYear: "offen",
    teamSize: "offen",
    supplierPartnerships: "offen",
  } satisfies Record<string, VerificationStatus>,
} as const;

export const fullAddress = `${company.address.street}, ${company.address.postalCode} ${company.address.city}`;
