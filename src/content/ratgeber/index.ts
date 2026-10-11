import { anbieterwechsel } from "./articles/anbieterwechsel";
import { arbeitspreisGrundpreis } from "./articles/arbeitspreis-grundpreis";
import { energieverbrauchUnternehmen } from "./articles/energieverbrauch-unternehmen";
import { gewerbegasVerstehen } from "./articles/gewerbegas-verstehen";
import { gewerbestromVerstehen } from "./articles/gewerbestrom-verstehen";
import { kuendigungsfristen } from "./articles/kuendigungsfristen";
import { stromrechnungLesen } from "./articles/stromrechnung-lesen";
import { vertragslaufzeiten } from "./articles/vertragslaufzeiten";
import type { Article } from "./types";

export type { Article, Block } from "./types";

/** Reihenfolge = Darstellung in Übersicht und Teasern. */
export const articles: Article[] = [
  gewerbestromVerstehen,
  arbeitspreisGrundpreis,
  anbieterwechsel,
  gewerbegasVerstehen,
  stromrechnungLesen,
  kuendigungsfristen,
  vertragslaufzeiten,
  energieverbrauchUnternehmen,
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
