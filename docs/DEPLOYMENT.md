# Deployment, Preview und Rollback

> **Nichts davon wurde ausgeführt.** Jeder Schritt auf dem Server oder im DNS benötigt die **vorherige Freigabe durch Murat**.
> Bestehende Dienste (KG CRM, `portal.kg-business.de`, LEON SaaS, E-Mail, weitere KG-Domains) dürfen nicht beeinträchtigt werden.

## 0. Ist-Zustand (unbekannt – vor jedem Schritt erfassen)
Der Live-Auftritt und die DNS-Einträge konnten aus der Entwicklungsumgebung nicht abgerufen werden (Netzwerkrichtlinie). Vor jeder Änderung **nur lesend** dokumentieren:

```bash
# von einem Rechner mit Internetzugang
dig +short kg-business.de A AAAA NS MX TXT
dig +short www.kg-business.de CNAME A
dig +short portal.kg-business.de A CNAME
dig +short _dmarc.kg-business.de TXT
curl -sSIL https://kg-business.de/ https://www.kg-business.de/
# auf dem Hetzner-Server (nur lesen!)
sudo ss -tlnp                          # belegte Ports
sudo systemctl list-units --type=service --state=running
sudo caddy validate --config /etc/caddy/Caddyfile 2>/dev/null; sudo cat /etc/caddy/Caddyfile   # oder Nginx-Konfiguration
df -h; free -h; node -v
```
Ergebnis in diesem Dokument unter „Ist-Zustand“ ergänzen. Insbesondere: Wo zeigt `www`/Apex hin (Wix?), welcher Reverse Proxy läuft, welche Ports sind belegt.

## 1. Zielbild auf Hetzner (isoliert)
| Element | Wert (Vorschlag) |
|---|---|
| Systembenutzer | `kgweb` (ohne Login-Shell) |
| App-Verzeichnis | `/opt/kg-business-web` |
| Daten (DB + Uploads) | `/var/lib/kg-business-web` (Owner `kgweb`, `chmod 700`) |
| Umgebungsdatei | `/etc/kg-business-web/.env` (Owner `root:kgweb`, `chmod 640`) |
| Dienst | `kg-business-web.service` (systemd) |
| Port | **3410**, nur `127.0.0.1` (vorher mit `ss -tlnp` prüfen, ob frei) |
| Node.js | ≥ 22.12 (eigene Installation nicht nötig, falls vorhanden – Version prüfen) |
| Reverse Proxy | bestehender Caddy/Nginx – **nur ein neuer Site-Block**, keine Änderung bestehender Blöcke |

### Installation (nach Freigabe)
```bash
sudo useradd --system --home /opt/kg-business-web --shell /usr/sbin/nologin kgweb
sudo mkdir -p /opt/kg-business-web /var/lib/kg-business-web /etc/kg-business-web
sudo chown kgweb:kgweb /opt/kg-business-web /var/lib/kg-business-web && sudo chmod 700 /var/lib/kg-business-web
sudo -u kgweb git clone --branch claude/kg-business-v2 https://github.com/kg-portal/kg-business-web-sitesi.git /opt/kg-business-web
cd /opt/kg-business-web
sudo -u kgweb npm ci
# Umgebungsdatei anlegen (Vorlage: .env.example), Geheimnisse erzeugen:
openssl rand -base64 48   # APP_SECRET
openssl rand -base64 32   # LEAD_ENCRYPTION_KEY  → zusätzlich sicher offline verwahren!
sudo -u kgweb bash -c 'set -a; source /etc/kg-business-web/.env; set +a; npm run build'
```

Mindestwerte in `/etc/kg-business-web/.env` für die **Preview**:
```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://v2.kg-business.de     # Beispiel – Preview-Domain nach Absprache
SITE_ENV=preview
ALLOWED_ORIGINS=https://v2.kg-business.de
DATA_DIR=/var/lib/kg-business-web
TRUST_PROXY=true
APP_SECRET=…
LEAD_ENCRYPTION_KEY=…
CRM_MODE=disabled
MAIL_MODE=disabled
ENABLE_HSTS=true
PORT=3410
```

### systemd-Unit `/etc/systemd/system/kg-business-web.service`
```ini
[Unit]
Description=KG Business Website V2 (Next.js)
After=network.target

[Service]
Type=simple
User=kgweb
Group=kgweb
WorkingDirectory=/opt/kg-business-web
EnvironmentFile=/etc/kg-business-web/.env
ExecStart=/usr/bin/npm start -- -p 3410 -H 127.0.0.1
Restart=on-failure
RestartSec=5
# Härtung
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/lib/kg-business-web /opt/kg-business-web/.next
CapabilityBoundingSet=
UMask=0077

[Install]
WantedBy=multi-user.target
```
```bash
sudo systemctl daemon-reload && sudo systemctl enable --now kg-business-web
curl -s http://127.0.0.1:3410/api/health   # → {"status":"ok"}
```

### Caddy – neuer, separater Site-Block (Beispiel Preview)
```caddyfile
v2.kg-business.de {
    encode zstd gzip
    reverse_proxy 127.0.0.1:3410
    request_body {
        max_size 32MB
    }
    log {
        output file /var/log/caddy/kg-business-web.log {
            roll_keep_for 336h      # 14 Tage, passend zur Datenschutzerklärung
        }
    }
}
```
Vorher `caddy validate`, danach `systemctl reload caddy` (kein Neustart). Bestehende Blöcke **nicht** anfassen.
Für Nginx analog: eigener `server`-Block, `client_max_body_size 32m`, `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for`.

### Optional: Zugriffsschutz für die Preview
Basic-Auth im Caddy-Block (`basicauth`) – verhindert, dass Dritte die Preview sehen oder echte Daten eingeben.

### Optional: ClamAV
`apt install clamav-daemon`, `clamd` auf `127.0.0.1:3310` binden, `CLAMAV_HOST=127.0.0.1`, `UPLOAD_SCAN_REQUIRED=true`. Speicherbedarf ≈ 1–1,5 GB RAM → vorher Serverressourcen prüfen.

## 2. Preview-Domain (DNS – Freigabe nötig)
Nur **ein neuer** Eintrag, z. B. `v2.kg-business.de A <Hetzner-IP>`. Keine Änderung an Apex, `www`, `portal`, MX, SPF, DKIM, DMARC.

## 3. Backups
- Täglich: `sqlite3 /var/lib/kg-business-web/leads.sqlite ".backup '/var/backups/kg-web/leads-$(date +%F).sqlite'"` + `uploads/` (bereits verschlüsselt).
- `LEAD_ENCRYPTION_KEY` getrennt von den Backups verwahren (ohne Schlüssel sind Backups unbrauchbar – gewollt).
- Aufbewahrung der Backups an Löschfristen anpassen (max. 30 Tage empfohlen).

## 4. Updates
```bash
cd /opt/kg-business-web
sudo -u kgweb git fetch origin && sudo -u kgweb git checkout <commit-oder-tag>
sudo -u kgweb npm ci
sudo -u kgweb bash -c 'set -a; source /etc/kg-business-web/.env; set +a; npm run build'
sudo systemctl restart kg-business-web && curl -s http://127.0.0.1:3410/api/health
```
Vorher lokal: `npm run test:all`.

## 5. Go-Live (Umschaltung kg-business.de) – separate, ausdrückliche Freigabe
Checkliste vor der Umschaltung:
- [ ] Alle Punkte in `docs/LEGAL_REVIEW.md` erledigt (Prüfhinweise sind dann im Production-Build ohnehin unsichtbar)
- [ ] Unternehmensdaten in `src/content/company.ts` bestätigt
- [ ] Live-Site-Audit nachgeholt, Weiterleitungen in `next.config.ts` ergänzt (`docs/SEO_REDIRECTS.md`)
- [ ] Build mit `SITE_ENV=production` und `NEXT_PUBLIC_SITE_URL=https://www.kg-business.de`
- [ ] `ALLOWED_ORIGINS` enthält `https://www.kg-business.de` und `https://kg-business.de`
- [ ] E-Mail-Benachrichtigung oder CRM aktiv (sonst sieht niemand die Anfragen!)
- [ ] Testanfrage mit Test-Domain durchgeführt, Referenz im Log/CLI sichtbar
- [ ] Backups eingerichtet
- [ ] Google Search Console: Sitemap einreichen (nach Umschaltung)

Umschaltung:
1. TTL der betroffenen DNS-Einträge (Apex/`www`) 24 h vorher auf 300 s senken.
2. Caddy-Site-Block für `kg-business.de, www.kg-business.de` (Weiterleitung Apex → `www`) ergänzen und validieren.
3. A/AAAA bzw. CNAME von Apex und `www` auf Hetzner umstellen. **MX/SPF/DKIM/DMARC unverändert lassen.**
4. Prüfen: `curl -I https://www.kg-business.de`, Formular-Test, E-Mail-Empfang (MX unverändert).

## 6. Rollback
| Situation | Maßnahme | Dauer |
|---|---|---|
| Fehler nach Update | `git checkout <vorheriger Commit>` → `npm ci && npm run build` → `systemctl restart` | ~5 min |
| Dienst startet nicht | `journalctl -u kg-business-web -n 100`; ggf. `systemctl stop kg-business-web` – andere Dienste sind nicht betroffen | sofort |
| Probleme nach DNS-Umschaltung | DNS-Einträge von Apex/`www` auf die notierten Ursprungswerte (z. B. Wix) zurücksetzen; dank TTL 300 s wirksam in Minuten | 5–30 min |
| Datenproblem | Dienst stoppen, DB aus letztem Backup wiederherstellen | ~10 min |
| Vollständiger Rückbau | Dienst deaktivieren, Caddy-Block entfernen + `reload`, Verzeichnisse `/opt/kg-business-web`, `/var/lib/kg-business-web`, `/etc/kg-business-web` löschen, DNS-Eintrag der Preview entfernen | ~15 min |

Die alte statische V1 bleibt unverändert im Branch `backup/kg-business-before-v2-20261011`.
