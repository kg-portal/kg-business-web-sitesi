import { JsonLd } from "@/components/ui/JsonLd";
import { faqSchema } from "@/lib/schema";

/** FAQ als native Disclosure (details/summary) – tastatur- und screenreaderfreundlich. */
export function FaqList({ items, withSchema = true }: { items: { question: string; answer: string }[]; withSchema?: boolean }) {
  return (
    <>
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        {items.map((item) => (
          <details key={item.question} className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-5 py-5 text-left font-display text-[1.05rem] font-semibold text-navy-900 transition-colors hover:bg-soft/60 sm:px-7 [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                aria-hidden="true"
                className="relative mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-soft text-navy-700 transition-transform group-open:rotate-45"
              >
                <span className="absolute h-0.5 w-3 rounded bg-current" />
                <span className="absolute h-3 w-0.5 rounded bg-current" />
              </span>
            </summary>
            <div className="px-5 pb-6 text-[1rem] leading-relaxed text-muted sm:px-7">{item.answer}</div>
          </details>
        ))}
      </div>
      {withSchema ? <JsonLd data={faqSchema(items)} /> : null}
    </>
  );
}
