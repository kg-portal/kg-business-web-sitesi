/**
 * Eigene, isolierte SQLite-Datenbank der Website (kein Zugriff auf das CRM).
 * Personenbezogene Inhalte liegen verschlüsselt in `payload_enc`.
 */
import Database from "better-sqlite3";
import { chmodSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { getConfig } from "./config";

type DB = Database.Database;

const MIGRATIONS: string[] = [
  `CREATE TABLE leads (
     id TEXT PRIMARY KEY,
     reference TEXT NOT NULL UNIQUE,
     idempotency_key TEXT NOT NULL UNIQUE,
     created_at TEXT NOT NULL,
     form_type TEXT NOT NULL CHECK (form_type IN ('energie-check','kontakt')),
     customer_type TEXT,
     energy TEXT,
     fingerprint TEXT NOT NULL,
     duplicate_of TEXT,
     payload_enc BLOB NOT NULL,
     consent_text_version TEXT NOT NULL,
     consent_privacy_at TEXT NOT NULL,
     consent_marketing_email INTEGER NOT NULL DEFAULT 0,
     consent_marketing_phone INTEGER NOT NULL DEFAULT 0,
     is_test INTEGER NOT NULL DEFAULT 0,
     upload_count INTEGER NOT NULL DEFAULT 0,
     crm_status TEXT NOT NULL,
     crm_attempts INTEGER NOT NULL DEFAULT 0,
     crm_last_error TEXT,
     crm_next_attempt_at TEXT,
     crm_external_id TEXT,
     crm_sent_at TEXT,
     notify_status TEXT NOT NULL DEFAULT 'pending'
   );
   CREATE INDEX leads_fingerprint_created ON leads (fingerprint, created_at);
   CREATE INDEX leads_crm_queue ON leads (crm_status, crm_next_attempt_at);
   CREATE INDEX leads_created ON leads (created_at);
   CREATE TABLE uploads (
     id TEXT PRIMARY KEY,
     lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
     stored_name TEXT NOT NULL,
     original_name_enc BLOB NOT NULL,
     mime TEXT NOT NULL,
     size INTEGER NOT NULL,
     sha256 TEXT NOT NULL,
     scan_status TEXT NOT NULL CHECK (scan_status IN ('clean','not_scanned','error')),
     created_at TEXT NOT NULL
   );
   CREATE INDEX uploads_lead ON uploads (lead_id);
   CREATE TABLE events (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     lead_id TEXT,
     at TEXT NOT NULL,
     type TEXT NOT NULL,
     detail TEXT
   );
   CREATE INDEX events_lead ON events (lead_id);`,
];

let instance: { db: DB; file: string } | null = null;

function migrate(db: DB) {
  const current = db.pragma("user_version", { simple: true }) as number;
  for (let v = current; v < MIGRATIONS.length; v++) {
    db.transaction(() => {
      db.exec(MIGRATIONS[v]!);
      db.pragma(`user_version = ${v + 1}`);
    })();
  }
}

export function getDb(): DB {
  const { dataDir } = getConfig();
  const file = path.join(dataDir, "leads.sqlite");
  if (instance && instance.file === file) return instance.db;
  mkdirSync(dataDir, { recursive: true, mode: 0o700 });
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  db.pragma("secure_delete = ON");
  migrate(db);
  // Nur der Dienstbenutzer darf lesen/schreiben (zusätzlich zum 0700-Verzeichnis)
  for (const f of [file, `${file}-wal`, `${file}-shm`]) if (existsSync(f)) chmodSync(f, 0o600);
  instance = { db, file };
  return db;
}

/** Nur für Tests. */
export function closeDbForTests(): void {
  instance?.db.close();
  instance = null;
}

export function recordEvent(db: DB, leadId: string | null, type: string, detail?: string): void {
  db.prepare("INSERT INTO events (lead_id, at, type, detail) VALUES (?, ?, ?, ?)").run(leadId, new Date().toISOString(), type, detail ?? null);
}
