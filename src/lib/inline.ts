/**
 * Minimaler Inline-Parser für redaktionelle Texte:
 * **fett** und [Linktext](ziel). Erzeugt Tokens – kein HTML, keine Injection.
 */
export type InlineToken =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "link"; value: string; href: string };

const PATTERN = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function parseInline(input: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let last = 0;
  for (const match of input.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ type: "text", value: input.slice(last, index) });
    if (match[1] !== undefined) tokens.push({ type: "bold", value: match[1] });
    else if (match[2] !== undefined && match[3] !== undefined) {
      const href = match[3];
      // Nur sichere Ziele: interne Pfade, Anker, https
      if (/^(\/|#|https:\/\/)/.test(href)) tokens.push({ type: "link", value: match[2], href });
      else tokens.push({ type: "text", value: match[2] });
    }
    last = index + match[0].length;
  }
  if (last < input.length) tokens.push({ type: "text", value: input.slice(last) });
  return tokens;
}
