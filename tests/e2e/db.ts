import Database from "better-sqlite3";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const DATA_DIR = path.resolve(".e2e-data");

/** Liest Metadaten eines Leads (unverschlüsselte Spalten) aus der E2E-Datenbank. */
export function leadMeta(reference: string) {
  const db = new Database(path.join(DATA_DIR, "leads.sqlite"), { readonly: true, fileMustExist: true });
  try {
    return db
      .prepare("SELECT reference, form_type, customer_type, energy, is_test, crm_status, upload_count, duplicate_of, consent_marketing_email, consent_marketing_phone FROM leads WHERE reference = ?")
      .get(reference) as
      | { reference: string; form_type: string; customer_type: string | null; energy: string | null; is_test: number; crm_status: string; upload_count: number; duplicate_of: string | null; consent_marketing_email: number; consent_marketing_phone: number }
      | undefined;
  } finally {
    db.close();
  }
}

export function mockOutbox(): string {
  const file = path.join(DATA_DIR, "crm-mock-outbox.jsonl");
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

export const fixturesDir = path.resolve("tests/e2e/fixtures");
