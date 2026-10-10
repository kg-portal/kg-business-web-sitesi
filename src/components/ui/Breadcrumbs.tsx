import Link from "next/link";
import { breadcrumbSchema, type Crumb } from "@/lib/schema";
import { JsonLd } from "./JsonLd";
import { Icon } from "./Icon";

/** Sichtbare Brotkrumen + BreadcrumbList-Strukturdaten. Startseite wird automatisch ergänzt. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: "Startseite", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Brotkrumen" className="text-sm">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-on-dark-muted">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="font-medium text-white">
                    {c.name}
                  </span>
                ) : (
                  <>
                    <Link href={c.path} className="transition-colors hover:text-white">
                      {c.name}
                    </Link>
                    <Icon name="arrow" className="size-3 opacity-60" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all)} />
    </>
  );
}
