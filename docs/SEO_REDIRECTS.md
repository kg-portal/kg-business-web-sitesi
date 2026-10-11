# SEO-Konzept und Weiterleitungsplan

## Indexierung
- Vorschau (`SITE_ENV≠production`): `<meta name="robots" content="noindex, nofollow">`, Header `X-Robots-Tag: noindex, nofollow, noarchive`, `robots.txt` → `Disallow: /`. Automatisiert getestet.
- Produktion (`SITE_ENV=production` **beim Build**): indexierbar, `robots.txt` mit Sitemap, `/api/` gesperrt.

## Seitenstruktur und Suchintention
| URL | Hauptthema / Suchintention |
|---|---|
| `/` | Strom & Gas für Unternehmen, Energieberatung Duisburg |
| `/gewerbestrom` | Gewerbestrom vergleichen, Stromtarife Geschäftskunden, Strom für Unternehmen |
| `/gewerbegas` | Gewerbegas vergleichen, Gewerbegas Anbieter, Gasvergleich Unternehmen |
| `/energie-check` | Anfrage (Conversion) |
| `/privatkunden`, `/privatkunden/strom`, `/privatkunden/gas` | Strom-/Gastarif Haushalt prüfen |
| `/branchen` + 9 Branchenseiten | Energieberatung für Hausverwaltungen, Gastronomie, Hotels, Praxen, … |
| `/energieberatung-duisburg` | Energieberatung Duisburg (echter Firmensitz) |
| `/ratgeber` + 8 Artikel | informationelle Suchanfragen (Arbeitspreis, Kündigungsfrist, Anbieterwechsel, …) |
| `/so-funktionierts`, `/ueber-uns`, `/kontakt` | Vertrauen, Navigation |
| `/impressum`, `/datenschutz`, `/agb`, `/cookie-hinweis` | Pflichtseiten |

Jede Seite hat: eigenen Title und Meta-Description (Eindeutigkeit wird getestet), Canonical, Open Graph, Twitter Card, Breadcrumbs (sichtbar + `BreadcrumbList`), eine H1.
Strukturierte Daten: `ProfessionalService` (Organisation, Adresse, Einsatzgebiet), `WebSite`, `Service` (Leistungsseiten), `FAQPage`, `Article` (Ratgeber). Keine `AggregateRating`/Bewertungen.

## Lokale Ausrichtung
- Physischer Standort: **nur Duisburg** (Fliederstr. 59) – im Schema als Adresse.
- Einsatzgebiet: Duisburg, Düsseldorf, Essen, Oberhausen, Mülheim an der Ruhr, Krefeld, NRW, bundesweit – im Schema als `areaServed`, im Text als Einsatzgebiet (nicht als Standorte).
- **Keine** generierten Stadtseiten mit austauschbarem Text. Weitere Stadtseiten erst, wenn echte lokale Inhalte vorliegen (z. B. Netzgebiet, Referenzen mit Freigabe, lokale Ansprechpartner) – siehe Backlog.

## Weiterleitungen
### Bereits umgesetzt (V1-Prototyp, `next.config.ts`, 308 dauerhaft)
| Alt | Neu |
|---|---|
| `/index.html` | `/` |
| `/impressum.html` | `/impressum` |
| `/datenschutz.html` | `/datenschutz` |
| `/agb.html` | `/agb` |

### Live-Website (Wix o. ä.) – **noch zu erheben**
Die indexierten URLs der aktuellen kg-business.de konnten nicht abgerufen werden. Vorgehen vor dem Go-Live:
1. `https://www.kg-business.de/sitemap.xml` und ggf. Unter-Sitemaps abrufen, alle URLs exportieren.
2. Google Search Console → Seiten → indexierte URLs exportieren; zusätzlich `site:kg-business.de`.
3. Jede alte URL einer neuen Seite zuordnen (Tabelle unten), in `next.config.ts → redirects()` als `permanent: true` ergänzen.
4. E2E-Test für die Weiterleitungen ergänzen (`tests/e2e/pages.spec.ts`).

Typische Wix-Muster und vorgeschlagene Ziele (nur übernehmen, wenn die URL tatsächlich existiert):

| Mögliche alte URL | Ziel |
|---|---|
| `/kontakt`, `/contact` | `/kontakt` |
| `/impressum` | `/impressum` |
| `/datenschutz`, `/datenschutzerklaerung` | `/datenschutz` |
| `/agb` | `/agb` |
| `/gewerbe`, `/gewerbekunden`, `/geschaeftskunden` | `/gewerbestrom` |
| `/privat`, `/privatkunden` | `/privatkunden` |
| `/strom` | `/gewerbestrom` |
| `/gas` | `/gewerbegas` |
| `/ueber-uns`, `/about` | `/ueber-uns` |
| `/blank`, `/copy-of-*` (Wix-Standard) | jeweils inhaltlich passende Seite, sonst `/` |

## Nach dem Go-Live
- Sitemap in der Google Search Console einreichen, Abdeckung beobachten.
- Brancheneintrag Google Unternehmensprofil mit identischen NAP-Daten (Name, Adresse, Telefon).
- Ratgeber jährlich (Umlagen, Steuersätze) aktualisieren – Stand-Datum im Artikel pflegen.
