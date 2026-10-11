/**
 * Outbox-Verarbeitung: überträgt gespeicherte Anfragen mit Status "pending"
 * an das CRM. Wiederholung mit exponentiellem Backoff; Referenz-ID dient als
 * Idempotenz-Schlüssel, damit das CRM Doppelanlagen erkennen kann.
 */
import { getConfig } from "../config";
import { decrypt, decryptJson } from "../crypto";
import { getDb, recordEvent } from "../db";
import { log } from "../logger";
import type { LeadPayload, LeadRow, UploadRow } from "../leads/types";
import { createCrmAdapter } from "./adapters";
import { toCrmPayload } from "./mapping";
import type { CrmAdapter } from "./types";

/** Wartezeiten in Minuten nach dem n-ten Fehlversuch */
export const BACKOFF_MINUTES = [1, 5, 15, 60, 180, 720, 1440];

export function nextAttemptAt(attempts: number, now = new Date()): string {
  const minutes = BACKOFF_MINUTES[Math.min(attempts - 1, BACKOFF_MINUTES.length - 1)] ?? 1440;
  return new Date(now.getTime() + minutes * 60_000).toISOString();
}

export interface DispatchSummary {
  processed: number;
  sent: number;
  retried: number;
  failed: number;
}

export async function processCrmQueue(opts: { adapter?: CrmAdapter; limit?: number; now?: Date } = {}): Promise<DispatchSummary> {
  const config = getConfig();
  const adapter = opts.adapter ?? createCrmAdapter(config);
  const summary: DispatchSummary = { processed: 0, sent: 0, retried: 0, failed: 0 };
  if (adapter.mode === "disabled") return summary;

  const db = getDb();
  const now = opts.now ?? new Date();
  const rows = db
    .prepare(
      "SELECT * FROM leads WHERE crm_status = 'pending' AND is_test = 0 AND (crm_next_attempt_at IS NULL OR crm_next_attempt_at <= ?) ORDER BY created_at ASC LIMIT ?",
    )
    .all(now.toISOString(), opts.limit ?? 20) as LeadRow[];

  for (const row of rows) {
    summary.processed++;
    const payload = decryptJson<LeadPayload>(row.payload_enc, config.encryptionKey);
    const uploads = db.prepare("SELECT * FROM uploads WHERE lead_id = ?").all(row.id) as UploadRow[];
    const crmPayload = toCrmPayload(
      row,
      payload,
      uploads.map((u) => ({
        originalName: decrypt(u.original_name_enc, config.encryptionKey).toString("utf8"),
        mime: u.mime,
        size: u.size,
        sha256: u.sha256,
        scanStatus: u.scan_status,
      })),
    );
    const result = await adapter.send(crmPayload, row.reference);
    const attempts = row.crm_attempts + 1;
    if (result.ok) {
      db.prepare("UPDATE leads SET crm_status = 'sent', crm_attempts = ?, crm_sent_at = ?, crm_external_id = ?, crm_last_error = NULL, crm_next_attempt_at = NULL WHERE id = ?").run(
        attempts,
        new Date().toISOString(),
        result.externalId,
        row.id,
      );
      recordEvent(db, row.id, "crm.sent", adapter.mode);
      log.info("crm.sent", { reference: row.reference, mode: adapter.mode });
      summary.sent++;
    } else if (result.retryable && attempts < config.env.CRM_MAX_ATTEMPTS) {
      db.prepare("UPDATE leads SET crm_attempts = ?, crm_last_error = ?, crm_next_attempt_at = ? WHERE id = ?").run(attempts, result.error, nextAttemptAt(attempts, now), row.id);
      recordEvent(db, row.id, "crm.retry", result.error);
      log.warn("crm.retry", { reference: row.reference, attempts, error: result.error });
      summary.retried++;
    } else {
      db.prepare("UPDATE leads SET crm_status = 'failed', crm_attempts = ?, crm_last_error = ?, crm_next_attempt_at = NULL WHERE id = ?").run(attempts, result.error, row.id);
      recordEvent(db, row.id, "crm.failed", result.error);
      log.error("crm.failed", { reference: row.reference, attempts, error: result.error });
      summary.failed++;
    }
  }
  return summary;
}

/** Zurückgehaltene Anfragen (CRM deaktiviert) gezielt zur Übertragung einreihen. */
export function requeueHeldLeads(sinceIso: string): number {
  const db = getDb();
  const info = db
    .prepare("UPDATE leads SET crm_status = 'pending', crm_next_attempt_at = ? WHERE crm_status IN ('skipped_disabled','failed') AND is_test = 0 AND created_at >= ?")
    .run(new Date().toISOString(), sinceIso);
  return info.changes;
}
