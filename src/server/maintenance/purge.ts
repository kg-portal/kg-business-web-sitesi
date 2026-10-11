/**
 * Löschkonzept: Uploads nach UPLOAD_RETENTION_DAYS, Anfragen ohne Vertrags-
 * kennzeichnung nach LEAD_RETENTION_DAYS. Zusätzlich verwaiste Upload-Ordner.
 */
import { readdir } from "node:fs/promises";
import path from "node:path";
import { retention } from "@/lib/retention";
import { getConfig } from "../config";
import { getDb, recordEvent } from "../db";
import { log } from "../logger";
import { leadUploadDir, removeUploadDir } from "../uploads/store";

export async function purgeExpiredData(now = new Date()): Promise<{ uploadsDeleted: number; leadsDeleted: number }> {
  const config = getConfig();
  const db = getDb();
  const uploadCutoff = new Date(now.getTime() - retention.uploadDays * 86_400_000).toISOString();
  const leadCutoff = new Date(now.getTime() - retention.leadDays * 86_400_000).toISOString();

  // Uploads: Dateien + Metadaten
  const oldUploadLeads = db.prepare("SELECT DISTINCT lead_id FROM uploads WHERE created_at < ?").all(uploadCutoff) as { lead_id: string }[];
  let uploadsDeleted = 0;
  for (const { lead_id } of oldUploadLeads) {
    await removeUploadDir(leadUploadDir(config.dataDir, lead_id));
    uploadsDeleted += db.prepare("DELETE FROM uploads WHERE lead_id = ?").run(lead_id).changes;
    recordEvent(db, lead_id, "purge.uploads");
  }

  // Anfragen
  const oldLeads = db.prepare("SELECT id FROM leads WHERE created_at < ?").all(leadCutoff) as { id: string }[];
  for (const { id } of oldLeads) {
    await removeUploadDir(leadUploadDir(config.dataDir, id));
  }
  const leadsDeleted = db.transaction(() => {
    const n = db.prepare("DELETE FROM leads WHERE created_at < ?").run(leadCutoff).changes;
    db.prepare("DELETE FROM events WHERE at < ?").run(leadCutoff);
    return n;
  })();

  // Verwaiste Upload-Ordner (z. B. nach Abbruch)
  try {
    const dirs = await readdir(path.join(config.dataDir, "uploads"));
    const known = new Set((db.prepare("SELECT id FROM leads").all() as { id: string }[]).map((r) => r.id));
    for (const d of dirs) if (!known.has(d)) await removeUploadDir(path.join(config.dataDir, "uploads", d));
  } catch {
    // Ordner existiert noch nicht
  }

  if (uploadsDeleted || leadsDeleted) log.info("purge.done", { uploadsDeleted, leadsDeleted });
  return { uploadsDeleted, leadsDeleted };
}
