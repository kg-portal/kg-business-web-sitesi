/**
 * Strukturiertes Logging (JSON-Zeilen). REGEL: Niemals personenbezogene Daten
 * loggen (keine Namen, E-Mails, Telefonnummern, Adressen, Nachrichten, IPs).
 * Erlaubt sind Referenz-IDs, Status, Zähler und technische Fehlercodes.
 */
type Fields = Record<string, string | number | boolean | null | undefined>;

function write(level: "info" | "warn" | "error", event: string, fields: Fields = {}) {
  if (process.env.NODE_ENV === "test" && process.env.LOG_IN_TESTS !== "true") return;
  const line = JSON.stringify({ t: new Date().toISOString(), level, event, ...fields });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const log = {
  info: (event: string, fields?: Fields) => write("info", event, fields),
  warn: (event: string, fields?: Fields) => write("warn", event, fields),
  error: (event: string, fields?: Fields) => write("error", event, fields),
};

/** Fehler auf einen nicht-sensiblen Code reduzieren. */
export function errorCode(err: unknown): string {
  if (err instanceof Error) return `${err.name}${"code" in err && err.code ? `:${String(err.code)}` : ""}`;
  return "UnknownError";
}
