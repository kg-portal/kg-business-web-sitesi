import type { ReactNode } from "react";
import { PageHero } from "@/components/sections/PageHero";

export function LegalPage({ title, path, updated, children }: { title: string; path: string; updated: string; children: ReactNode }) {
  return (
    <>
      <PageHero title={title} breadcrumbs={[{ name: title, path }]} compact />
      <div className="container-page py-14 sm:py-16">
        <div className="prose-kg max-w-3xl">
          {children}
          <p className="!mt-12 text-sm text-muted">Stand: {updated}</p>
        </div>
      </div>
    </>
  );
}
