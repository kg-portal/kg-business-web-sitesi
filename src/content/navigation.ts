import { industries } from "./industries";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  /** Übersichtsseite der Gruppe */
  href: string;
  links: NavLink[];
  /** Optionale zweite Spalte (z. B. Branchen) */
  secondary?: { title: string; links: NavLink[] };
}

export type NavItem = NavLink | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return "links" in item;
}

export const mainNavigation: NavItem[] = [
  {
    label: "Gewerbekunden",
    href: "/gewerbestrom",
    links: [
      { label: "Gewerbestrom", href: "/gewerbestrom", description: "Stromverträge für Unternehmen prüfen und vergleichen" },
      { label: "Gewerbegas", href: "/gewerbegas", description: "Gasverträge für Heizung und Prozesswärme" },
      { label: "Branchenlösungen", href: "/branchen", description: "Energie passend zu Ihrer Branche" },
      { label: "Energie-Check", href: "/energie-check", description: "Kostenlose Prüfung in wenigen Minuten" },
    ],
    secondary: {
      title: "Branchen",
      links: industries.map((i) => ({ label: i.short, href: `/branchen/${i.slug}` })),
    },
  },
  {
    label: "Privatkunden",
    href: "/privatkunden",
    links: [
      { label: "Überblick Privatkunden", href: "/privatkunden", description: "Strom und Gas für Ihren Haushalt" },
      { label: "Privatstrom", href: "/privatkunden/strom", description: "Stromtarif prüfen und wechseln" },
      { label: "Privatgas", href: "/privatkunden/gas", description: "Gastarif für Heizung und Warmwasser" },
    ],
  },
  { label: "So funktioniert’s", href: "/so-funktionierts" },
  { label: "Ratgeber", href: "/ratgeber" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Kontakt", href: "/kontakt" },
];

export const footerNavigation = {
  leistungen: [
    { label: "Gewerbestrom", href: "/gewerbestrom" },
    { label: "Gewerbegas", href: "/gewerbegas" },
    { label: "Privatstrom", href: "/privatkunden/strom" },
    { label: "Privatgas", href: "/privatkunden/gas" },
    { label: "Energie-Check", href: "/energie-check" },
    { label: "Energieberatung Duisburg", href: "/energieberatung-duisburg" },
  ],
  unternehmen: [
    { label: "Über uns", href: "/ueber-uns" },
    { label: "So funktioniert’s", href: "/so-funktionierts" },
    { label: "Branchenlösungen", href: "/branchen" },
    { label: "Ratgeber", href: "/ratgeber" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  rechtliches: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
    { label: "AGB", href: "/agb" },
    { label: "Cookie-Hinweis", href: "/cookie-hinweis" },
  ],
} satisfies Record<string, NavLink[]>;
