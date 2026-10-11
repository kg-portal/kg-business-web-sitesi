import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/ratgeber/ArticleBody";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { RelatedArticles } from "@/components/sections/RelatedArticles";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { company } from "@/content/company";
import { articles, getArticle } from "@/content/ratgeber";
import { articleSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return buildMetadata({
    title: a.metaTitle,
    description: a.description,
    path: `/ratgeber/${a.slug}`,
    type: "article",
    publishedTime: a.published,
    modifiedTime: a.updated,
  });
}

const dateFormat = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" });

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const path = `/ratgeber/${a.slug}`;
  const toc = a.blocks.filter((b): b is Extract<typeof b, { type: "h2" }> => b.type === "h2");

  return (
    <>
      <PageHero
        eyebrow={`Ratgeber · ${a.category}`}
        title={a.title}
        lead={a.excerpt}
        breadcrumbs={[
          { name: "Ratgeber", path: "/ratgeber" },
          { name: a.title, path },
        ]}
        compact
      >
        <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-on-dark-muted">
          <span className="flex items-center gap-1.5">
            <Icon name="calendar" className="size-4" />
            Stand: <time dateTime={a.updated}>{dateFormat.format(new Date(a.updated))}</time>
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="clock" className="size-4" />
            {a.readingMinutes} Min. Lesezeit
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="user" className="size-4" />
            Redaktion {company.brandName}
          </span>
        </p>
      </PageHero>

      <div className="container-page grid grid-cols-1 gap-12 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
        <article className="min-w-0 max-w-3xl">
          <ArticleBody blocks={a.blocks} />

          {a.faq && a.faq.length > 0 ? (
            <section className="mt-14" aria-labelledby="artikel-faq">
              <h2 id="artikel-faq" className="text-2xl font-bold">
                Häufige Fragen
              </h2>
              <div className="mt-6">
                <FaqList items={a.faq} />
              </div>
            </section>
          ) : null}

          <section className="mt-14 rounded-2xl border border-line bg-soft p-6" aria-labelledby="quellen">
            <h2 id="quellen" className="text-lg font-bold">
              Quellen
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {a.sources.map((s) => (
                <li key={s.url} className="flex gap-2">
                  <Icon name="arrow" className="mt-0.5 size-4 shrink-0 text-muted" />
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-inline font-medium">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Allgemeine Information, keine Rechts- oder Steuerberatung. Angaben ohne Gewähr; maßgeblich sind die aktuellen Gesetzestexte und
              Ihre Vertragsunterlagen.
            </p>
          </section>
        </article>

        <aside className="lg:sticky lg:top-28 lg:h-fit" aria-label="Seitenleiste">
          {toc.length > 0 ? (
            <nav aria-labelledby="toc-title" className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <p id="toc-title" className="text-sm font-bold uppercase tracking-wider text-muted">
                Inhalt
              </p>
              <ol className="mt-3 space-y-2 text-[0.95rem]">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="block leading-snug text-navy-900 transition-colors hover:text-electric-600">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <div className="on-dark mt-5 rounded-2xl bg-navy-900 p-6 text-white">
            <p className="font-display text-lg font-bold">Ihren Vertrag prüfen lassen?</p>
            <p className="mt-2 text-sm leading-relaxed text-on-dark">Kostenlos, unverbindlich und persönlich.</p>
            <ButtonLink href="/energie-check" icon="arrow" className="mt-5 w-full">
              Energie-Check starten
            </ButtonLink>
          </div>
          <p className="mt-5 text-sm">
            <Link href="/ratgeber" className="link-inline">
              ← Alle Ratgeber-Artikel
            </Link>
          </p>
        </aside>
      </div>
      <RelatedArticles slugs={a.related} title="Weiterlesen" />
      <CtaBand />
      <JsonLd data={articleSchema({ title: a.title, description: a.description, path, datePublished: a.published, dateModified: a.updated })} />
    </>
  );
}
