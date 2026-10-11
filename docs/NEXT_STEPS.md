# Nächste Schritte

Reihenfolge nach Abhängigkeiten. ☐ = offen. **(F)** = Freigabe durch Murat erforderlich.

## 1. Sofort möglich (ohne Freigabe)
- ☐ Backup-Tag nachholen: `git tag -a v1-before-v2-20261011 ea8ac0d -m "V1 vor V2" && git push origin v1-before-v2-20261011`
- ☐ Unternehmensangaben prüfen und in `src/content/company.ts` als `bestaetigt` markieren
- ☐ Hero-Text auswählen (`docs/COPY_OPTIONS.md`), Logo-Variante entscheiden (`docs/brand/LOGO.md`)
- ☐ Offizielles Logo als SVG liefern (falls abweichend)
- ☐ Ratgeber-Fakten stichprobenartig gegen Primärquellen prüfen (`docs/LEGAL_REVIEW.md` G)

## 2. Live-Audit nachholen
- ☐ Netzwerkzugang für `kg-business.de`, `www.kg-business.de`, `dns.google` freigeben – oder Audit auf einem eigenen Rechner (`docs/research/2026-10-live-site-audit.md`)
- ☐ Indexierte URLs erfassen → Weiterleitungen in `next.config.ts` + E2E-Test (`docs/SEO_REDIRECTS.md`)
- ☐ Live-Inhalte mit V2 abgleichen (fehlende Leistungen/Angaben?)

## 3. Rechtliche Prüfung
- ☐ Impressum, Datenschutz, AGB anwaltlich prüfen; IHK-Auskunft Erlaubnispflicht (`docs/LEGAL_REVIEW.md`)
- ☐ Entscheidung Double-Opt-in für E-Mail-Werbung

## 4. Preview auf Hetzner **(F)**
- ☐ Ist-Zustand Server/DNS lesend erfassen
- ☐ Isolierten Dienst einrichten (`docs/DEPLOYMENT.md` Abschnitt 1), Preview-Subdomain anlegen, Basic-Auth
- ☐ Optional ClamAV
- ☐ Abnahme der Preview durch Murat (Desktop + Smartphone)

## 5. Benachrichtigung & CRM **(F)**
- ☐ SMTP-Zugang für interne Benachrichtigung (`MAIL_MODE=smtp`, `MAIL_INCLUDE_CONTACT=true`)
- ☐ CRM-API-Vertrag beschaffen, Mapping anpassen, Test gegen CRM-Testinstanz (`docs/CRM_INTEGRATION.md`)
- ☐ Freigabe `CRM_LIVE_APPROVED=true`

## 6. Go-Live **(F)**
- ☐ Go-Live-Checkliste (`docs/DEPLOYMENT.md` Abschnitt 5)
- ☐ Merge `claude/kg-business-v2` → `main` per Pull Request
- ☐ Build mit `SITE_ENV=production`, DNS-Umschaltung, Search Console
