/**
 * Normalisiert Telefonnummern ins E.164-Format (Standard: Deutschland).
 * Gibt null zurück, wenn die Eingabe keine plausible Nummer ist.
 *
 *  "0203 47 96 68 22"      → "+4920347966822"
 *  "+49 (0) 203 / 4796682" → "+492034796682"
 *  "0049 170 1234567"      → "+491701234567"
 *  "+43 1 234567"          → "+431234567"
 */
export function normalizePhone(input: string): string | null {
  if (typeof input !== "string") return null;
  let s = input.trim();
  if (!s || s.length > 40) return null;
  // Nur übliche Zeichen zulassen
  if (!/^[+\d\s()\-./]+$/.test(s)) return null;
  s = s.replace(/\(0\)/g, "");
  const hasPlus = s.startsWith("+");
  let digits = s.replace(/\D/g, "");
  if (hasPlus) {
    // international
  } else if (digits.startsWith("00")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0")) {
    digits = `49${digits.slice(1)}`;
  } else {
    return null;
  }
  if (digits.startsWith("49")) {
    const national = digits.slice(2);
    if (national.startsWith("0")) return null;
    if (national.length < 6 || national.length > 13) return null;
  }
  if (digits.length < 8 || digits.length > 15) return null;
  return `+${digits}`;
}
