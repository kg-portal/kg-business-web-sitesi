/**
 * „Über uns“-Inhalte. Felder mit `null` bzw. leeren Listen sind NICHT
 * verifiziert und werden auf der Website nicht angezeigt, bis KG Business
 * (Murat) sie bestätigt. Keine erfundenen Kennzahlen, Partner oder Referenzen.
 */
import type { IconName } from "@/components/ui/Icon";

export const about = {
  /** Gründungsjahr – offen */
  foundingYear: null as number | null,
  /** Teamgröße – offen */
  teamSize: null as string | null,
  /** Namentlich genannte Ansprechpartner mit Foto – offen (Einwilligung der Personen nötig) */
  contacts: [] as { name: string; role: string; image?: string }[],
  /** Versorger, mit denen nachweislich zusammengearbeitet wird – offen; Logos nur mit schriftlicher Erlaubnis */
  supplierPartners: [] as { name: string; logo?: string; logoPermission: boolean }[],
  /** Kundenstimmen – nur echte, nachprüfbare Bewertungen mit Einwilligung (§ 5b Abs. 3 UWG) */
  testimonials: [] as { quote: string; author: string; source: string }[],
} as const;

export const principles: { icon: IconName; title: string; text: string }[] = [
  { icon: "eye", title: "Transparenz", text: "Wir sagen offen, wie wir vergütet werden, und kennzeichnen, was ein Angebot garantiert – und was nicht." },
  { icon: "lightbulb", title: "Verständlichkeit", text: "Wir erklären Tarifdetails so, dass Sie eine informierte Entscheidung treffen können." },
  { icon: "shield", title: "Kein Abschlusszwang", text: "Sie entscheiden. Ein Vergleich verpflichtet Sie zu nichts." },
  { icon: "lock", title: "Datensparsamkeit", text: "Wir fragen nur, was für Ihr Angebot nötig ist, und schützen Ihre Unterlagen technisch und organisatorisch." },
];
