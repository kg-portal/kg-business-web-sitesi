import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getArticle } from "@/content/ratgeber";

export function RelatedArticles({ slugs, title = "Passend dazu im Ratgeber" }: { slugs: string[]; title?: string }) {
  const items = slugs.map(getArticle).filter((a) => a !== undefined);
  if (items.length === 0) return null;
  return (
    <section className="py-16 sm:py-20" aria-labelledby="related-title">
      <div className="container-page">
        <SectionHeading id="related-title" eyebrow="Ratgeber" title={title} />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/ratgeber/${a.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="eyebrow">{a.category}</span>
                <span className="mt-3 font-display text-lg font-bold leading-snug text-navy-900 group-hover:text-electric-600">{a.title}</span>
                <span className="mt-auto flex items-center justify-between pt-5 text-sm text-muted">
                  {a.readingMinutes} Min. Lesezeit
                  <Icon name="arrow" className="size-5 text-electric-600 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
