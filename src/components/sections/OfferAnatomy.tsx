import { Icon, type IconName } from "@/components/ui/Icon";

const rows: { label: string; unit: string; note: string; icon: IconName }[] = [
  { label: "Arbeitspreis", unit: "ct/kWh", note: "Preis je verbrauchter Kilowattstunde – wirkt mit jedem Verbrauch.", icon: "zap" },
  { label: "Grundpreis", unit: "€/Monat", note: "Fixer Betrag, unabhängig vom Verbrauch.", icon: "receipt" },
  { label: "Vertragslaufzeit", unit: "Monate", note: "Wie lange Sie gebunden sind – und was danach gilt.", icon: "calendar" },
  { label: "Preisgarantie", unit: "Umfang", note: "Welche Preisbestandteile tatsächlich festgeschrieben sind.", icon: "shield" },
  { label: "Kündigungsfrist", unit: "Wochen/Monate", note: "Bis wann Sie kündigen müssen, um nicht zu verlängern.", icon: "timer" },
  { label: "Bonus", unit: "einmalig", note: "Nur im ersten Jahr – im Folgejahr oft entscheidend.", icon: "badge" },
];

/**
 * Schematische Darstellung eines Energieangebots. Bewusst ohne Zahlen –
 * die Website zeigt keine Beispiel- oder Fantasiepreise.
 */
export function OfferAnatomy() {
  return (
    <figure className="relative">
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-electric-500/15 via-transparent to-energy-400/15 blur-2xl" aria-hidden="true" />
      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-lift">
        <div className="flex items-center justify-between border-b border-line bg-soft px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 items-center justify-center rounded-lg bg-navy-900 text-white">
              <Icon name="file" className="size-4.5" />
            </span>
            <div>
              <p className="font-display text-sm font-bold text-navy-900">Energieangebot</p>
              <p className="text-xs text-muted">Worauf wir beim Vergleich achten</p>
            </div>
          </div>
          <span className="rounded-full border border-line-strong bg-white px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-muted">
            Schema
          </span>
        </div>
        <ul className="divide-y divide-line">
          {rows.map((row) => (
            <li key={row.label} className="grid grid-cols-[auto_1fr] items-start gap-4 px-5 py-4 sm:grid-cols-[auto_1fr_auto] sm:px-6">
              <span className="mt-0.5 inline-flex size-9 items-center justify-center rounded-lg bg-electric-500/10 text-electric-600">
                <Icon name={row.icon} className="size-4.5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-navy-900">{row.label}</p>
                <p className="mt-0.5 text-sm leading-snug text-muted">{row.note}</p>
              </div>
              <span className="col-start-2 inline-flex w-fit items-center gap-2 rounded-lg bg-soft px-2.5 py-1 text-xs font-medium text-muted sm:col-start-3 sm:mt-0.5">
                <span className="h-1.5 w-8 rounded-full bg-line-strong" aria-hidden="true" />
                {row.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted">
        Schematische Darstellung – konkrete Konditionen erhalten Sie in Ihrem individuellen Angebot.
      </figcaption>
    </figure>
  );
}
