/**
 * Betriebs-CLI für die Lead-Datenbank (nur auf dem Server mit Zugriff auf
 * DATA_DIR und Schlüssel). Gibt personenbezogene Daten nur bei `show` aus.
 *
 *   npm run leads -- list [--limit 20]
 *   npm run leads -- show <REFERENZ>
 *   npm run leads -- export-upload <REFERENZ> <ZIELORDNER>
 *   npm run leads -- requeue --since 2026-10-01      (zurückgehaltene Leads ans CRM übergeben)
 *   npm run leads -- dispatch                        (CRM-Outbox einmalig verarbeiten)
 *   npm run leads -- purge                           (Löschlauf gemäß Aufbewahrungsfristen)
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getConfig } from "../src/server/config";
import { processCrmQueue, requeueHeldLeads } from "../src/server/crm/dispatcher";
import { decrypt, decryptJson } from "../src/server/crypto";
import { getDb } from "../src/server/db";
import type { LeadPayload, LeadRow, UploadRow } from "../src/server/leads/types";
import { purgeExpiredData } from "../src/server/maintenance/purge";
import { leadUploadDir } from "../src/server/uploads/store";

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  const config = getConfig();
  const db = getDb();
  switch (cmd) {
    case "list": {
      const limit = Number(args[args.indexOf("--limit") + 1] ?? 20) || 20;
      const rows = db
        .prepare("SELECT reference, created_at, form_type, customer_type, energy, crm_status, upload_count, duplicate_of, is_test FROM leads ORDER BY created_at DESC LIMIT ?")
        .all(limit);
      console.table(rows);
      break;
    }
    case "show": {
      const row = db.prepare("SELECT * FROM leads WHERE reference = ?").get(args[0]) as LeadRow | undefined;
      if (!row) throw new Error("Referenz nicht gefunden");
      const payload = decryptJson<LeadPayload>(row.payload_enc, config.encryptionKey);
      const uploads = (db.prepare("SELECT * FROM uploads WHERE lead_id = ?").all(row.id) as UploadRow[]).map((u) => ({
        name: decrypt(u.original_name_enc, config.encryptionKey).toString("utf8"),
        mime: u.mime,
        size: u.size,
        scan: u.scan_status,
      }));
      const { payload_enc: _p, ...meta } = row;
      console.log(JSON.stringify({ meta, payload, uploads }, null, 2));
      break;
    }
    case "export-upload": {
      const [ref, target] = args;
      if (!ref || !target) throw new Error("Aufruf: export-upload <REFERENZ> <ZIELORDNER>");
      const row = db.prepare("SELECT id FROM leads WHERE reference = ?").get(ref) as { id: string } | undefined;
      if (!row) throw new Error("Referenz nicht gefunden");
      await mkdir(target, { recursive: true, mode: 0o700 });
      for (const u of db.prepare("SELECT * FROM uploads WHERE lead_id = ?").all(row.id) as UploadRow[]) {
        if (u.scan_status !== "clean") console.warn(`Achtung: ${u.id} wurde nicht als virenfrei geprüft (${u.scan_status}).`);
        const data = decrypt(await readFile(path.join(leadUploadDir(config.dataDir, row.id), u.stored_name)), config.encryptionKey);
        const name = decrypt(u.original_name_enc, config.encryptionKey).toString("utf8");
        const out = path.join(target, `${ref}-${name}`);
        await writeFile(out, data, { mode: 0o600 });
        console.log("exportiert:", out);
      }
      break;
    }
    case "requeue": {
      const since = args[args.indexOf("--since") + 1];
      if (!since || !/^\d{4}-\d{2}-\d{2}/.test(since)) throw new Error("Aufruf: requeue --since JJJJ-MM-TT");
      console.log("eingereiht:", requeueHeldLeads(new Date(since).toISOString()));
      break;
    }
    case "dispatch":
      console.log(await processCrmQueue({ limit: 100 }));
      break;
    case "purge":
      console.log(await purgeExpiredData());
      break;
    default:
      console.log("Befehle: list | show <REF> | export-upload <REF> <DIR> | requeue --since <DATUM> | dispatch | purge");
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
