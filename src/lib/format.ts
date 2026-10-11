/** Deutsche Zahleneingabe („12.000“, „31,5“, „31.5“) in Number umwandeln. */
export function parseGermanNumber(input: string): number | null {
  const trimmed = input.trim().replace(/\s/g, "");
  if (!trimmed) return null;
  if (!/^\d{1,3}(\.\d{3})*(,\d+)?$|^\d+(,\d+)?$|^\d+(\.\d+)?$/.test(trimmed)) return null;
  let normalized = trimmed;
  if (trimmed.includes(",")) normalized = trimmed.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(trimmed)) normalized = trimmed.replace(/\./g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}
