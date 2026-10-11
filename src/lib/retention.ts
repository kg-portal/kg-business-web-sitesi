/**
 * Lösch- und Aufbewahrungsfristen – einzige Quelle für Datenschutzerklärung
 * und Lösch-Skript (scripts/purge-data.ts). Änderungen hier ändern beides.
 */
export const retention = {
  /** Anfragen ohne Vertragsabschluss werden nach dieser Frist gelöscht */
  leadDays: Number(process.env.LEAD_RETENTION_DAYS ?? 180),
  /** Hochgeladene Rechnungen werden nach dieser Frist gelöscht (spätestens) */
  uploadDays: Number(process.env.UPLOAD_RETENTION_DAYS ?? 90),
  /** Nachweis einer Werbeeinwilligung (§ 7a UWG): 5 Jahre nach letzter Verwendung */
  consentProofYears: 5,
  /** Zeitfenster der Missbrauchserkennung (gehashte IP, nur im Arbeitsspeicher) */
  rateLimitMinutes: 60,
} as const;
