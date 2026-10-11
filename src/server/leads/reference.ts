import { randomInt } from "node:crypto";

// Ohne verwechselbare Zeichen (0/O, 1/I/L)
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Lesbare Referenz-ID, z. B. „KGB-261011-7H3KQ2“ (Datum UTC + 6 Zeichen). */
export function createReference(date = new Date()): string {
  const y = String(date.getUTCFullYear()).slice(2);
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  let rnd = "";
  for (let i = 0; i < 6; i++) rnd += ALPHABET[randomInt(ALPHABET.length)];
  return `KGB-${y}${m}${d}-${rnd}`;
}
