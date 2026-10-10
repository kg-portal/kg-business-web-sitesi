/**
 * Ratgeber-Artikel als strukturierte Inhalte.
 * Inline-Auszeichnung in Texten: **fett** und [Linktext](/pfad oder https://…).
 */
export type Block =
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; tone: "info" | "tip" | "warn"; title: string; text: string }
  | { type: "table"; caption: string; head: string[]; rows: string[][]; note?: string }
  | { type: "calculator" };

export interface ArticleSource {
  label: string;
  url: string;
}

export interface Article {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  excerpt: string;
  category: "Gewerbe" | "Grundlagen" | "Vertrag" | "Wechsel";
  readingMinutes: number;
  published: string;
  updated: string;
  blocks: Block[];
  sources: ArticleSource[];
  related: string[];
  faq?: { question: string; answer: string }[];
}
