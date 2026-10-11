import { CostCalculator } from "@/components/forms/CostCalculator";
import { Icon } from "@/components/ui/Icon";
import type { Block } from "@/content/ratgeber";
import { cn } from "@/lib/cn";
import { RichText } from "./RichText";

const calloutStyles = {
  info: { box: "border-electric-500/30 bg-electric-500/[0.05]", icon: "info" as const, iconClass: "text-electric-600" },
  tip: { box: "border-energy-400/40 bg-success-soft", icon: "lightbulb" as const, iconClass: "text-energy-700" },
  warn: { box: "border-amber-400/50 bg-amber-50", icon: "info" as const, iconClass: "text-amber-700" },
};

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-kg">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return (
              <h2 key={i} id={b.id}>
                {b.text}
              </h2>
            );
          case "h3":
            return <h3 key={i}>{b.text}</h3>;
          case "p":
            return (
              <p key={i}>
                <RichText text={b.text} />
              </p>
            );
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it) => (
                  <li key={it}>
                    <RichText text={it} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((it) => (
                  <li key={it}>
                    <RichText text={it} />
                  </li>
                ))}
              </ol>
            );
          case "callout": {
            const s = calloutStyles[b.tone];
            return (
              <aside key={i} className={cn("flex gap-4 rounded-2xl border p-5", s.box)}>
                <Icon name={s.icon} className={cn("mt-0.5 size-5 shrink-0", s.iconClass)} />
                <div>
                  <p className="font-display font-bold text-navy-900">{b.title}</p>
                  <p className="mt-1 text-[0.98rem] leading-relaxed">
                    <RichText text={b.text} />
                  </p>
                </div>
              </aside>
            );
          }
          case "table":
            return (
              <figure key={i} className="not-prose">
                <div className="overflow-x-auto rounded-2xl border border-line">
                  <table className="w-full min-w-[34rem] border-collapse text-left text-[0.95rem]">
                    <caption className="bg-soft px-4 py-3 text-left text-sm font-semibold text-navy-900">{b.caption}</caption>
                    <thead>
                      <tr>
                        {b.head.map((h) => (
                          <th key={h} scope="col" className="border-y border-line bg-white px-4 py-3 font-semibold text-navy-900">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((row) => (
                        <tr key={row.join("|")} className="odd:bg-white even:bg-soft/50">
                          {row.map((cell, ci) => (
                            <td key={ci} className={cn("border-b border-line px-4 py-3 align-top", ci === 0 && "font-medium text-navy-900")}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {b.note ? <figcaption className="mt-2 text-xs text-muted">{b.note}</figcaption> : null}
              </figure>
            );
          case "calculator":
            return <CostCalculator key={i} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
