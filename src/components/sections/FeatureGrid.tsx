import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export interface Feature {
  icon: IconName;
  title: string;
  text: string;
}

export function FeatureGrid({ items, columns = 3, tone = "white" }: { items: Feature[]; columns?: 2 | 3 | 4; tone?: "white" | "soft" }) {
  return (
    <ul
      className={cn(
        "grid gap-5 sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4",
      )}
    >
      {items.map((f) => (
        <li
          key={f.title}
          className={cn(
            "group rounded-2xl border border-line p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift",
            tone === "white" ? "bg-white shadow-card" : "bg-soft",
          )}
        >
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-electric-500/10 text-electric-600 transition-colors group-hover:bg-navy-900 group-hover:text-white">
            <Icon name={f.icon} className="size-5" />
          </span>
          <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
          <p className="mt-2 leading-relaxed text-muted">{f.text}</p>
        </li>
      ))}
    </ul>
  );
}
