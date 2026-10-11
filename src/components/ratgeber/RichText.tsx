import Link from "next/link";
import { Fragment } from "react";
import { parseInline } from "@/lib/inline";

export function RichText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((t, i) => {
        if (t.type === "bold") return <strong key={i}>{t.value}</strong>;
        if (t.type === "link") {
          if (t.href.startsWith("https://")) {
            return (
              <a key={i} href={t.href} target="_blank" rel="noopener noreferrer">
                {t.value}
              </a>
            );
          }
          return (
            <Link key={i} href={t.href}>
              {t.value}
            </Link>
          );
        }
        return <Fragment key={i}>{t.value}</Fragment>;
      })}
    </>
  );
}
