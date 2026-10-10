# Live-Site-Audit kg-business.de – Stand 2026-10-10

**Ergebnis: nicht durchführbar aus der Entwicklungsumgebung.**

Die Netzwerkrichtlinie der Cloud-Entwicklungsumgebung blockiert `kg-business.de`, `www.kg-business.de`,
`portal.kg-business.de` sowie DNS-over-HTTPS-Resolver (`dns.google`, `cloudflare-dns.com`).
Daher konnten **nicht** ermittelt werden:

1. Hosting-Plattform der Live-Seite (Wix o. ä.)
2. Weiterleitungsverhalten (http→https, apex→www)
3. DNS-Einträge (A/AAAA/CNAME/MX/TXT/SPF/DMARC/NS)
4. robots.txt, Sitemap, indexierte URLs (Websuche `site:kg-business.de` lieferte keine Treffer)
5. Seiteninhalte, Logo, Farben, Tracker der Live-Seite

Es wurde **nichts** vermutet oder ersetzt. Die V2 basiert auf den Inhalten des Repository-Prototyps (V1).

## Hinweise aus Suchergebnissen (unverifiziert)

- Unter `kg-reinigung.de` („KG-Gebäudereinigung“) erscheinen laut Suchmaschinen-Auszügen dieselbe
  Inhaberin (Damla Kicci), dieselbe Adresse (Fliederstraße 59, Duisburg) und dieselbe Telefonnummer
  (+49 203 47 96 68 22). Vor dem Livegang ist zu bestätigen, welche Angaben (insbesondere Telefon und
  USt-IdNr. DE325770756) für KG Business gelten.
- `kg-management.de` (Yusuf Kicci, Bergheimer Str. 115, 47228 Duisburg) ist vermutlich ein separates Unternehmen.

## Nachholen

Sobald die Domains in der Umgebung freigegeben sind (Network access → Allowed domains) oder von einem
Rechner mit normalem Internetzugang:

```bash
curl -sSIL https://kg-business.de/ https://www.kg-business.de/
curl -sSL https://www.kg-business.de/robots.txt
curl -sSL https://www.kg-business.de/sitemap.xml
dig +short kg-business.de A AAAA MX TXT NS; dig +short _dmarc.kg-business.de TXT; dig +short portal.kg-business.de
```

Ergebnisse in `docs/SEO_REDIRECTS.md` (Redirect-Tabelle) und `docs/DEPLOYMENT.md` (DNS-Ist-Zustand) eintragen.
