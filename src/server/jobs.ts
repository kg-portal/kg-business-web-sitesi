/**
 * Hintergrundaufgaben im Server-Prozess (eine Instanz): CRM-Outbox und Löschlauf.
 * Abschaltbar mit BACKGROUND_JOBS=false (z. B. bei externem Cron).
 */
import { getConfig } from "./config";
import { processCrmQueue } from "./crm/dispatcher";
import { errorCode, log } from "./logger";
import { notifyNewLead } from "./mail/notify";
import { purgeExpiredData } from "./maintenance/purge";

let started = false;
let crmRunning = false;

export function startBackgroundJobs(): void {
  if (started) return;
  let config;
  try {
    config = getConfig();
  } catch (err) {
    log.error("jobs.config_error", { code: errorCode(err) });
    return;
  }
  if (config.isProductionRuntime && !config.env.TRUST_PROXY) {
    log.warn("config.trust_proxy_off", { hint: "Hinter Caddy/Nginx TRUST_PROXY=true setzen, sonst teilen sich alle Besucher ein Rate-Limit" });
  }
  if (config.env.BACKGROUND_JOBS === "false") return;
  started = true;

  const runCrm = async () => {
    if (crmRunning) return;
    crmRunning = true;
    try {
      await processCrmQueue();
    } catch (err) {
      log.error("jobs.crm_error", { code: errorCode(err) });
    } finally {
      crmRunning = false;
    }
  };
  const runPurge = async () => {
    try {
      await purgeExpiredData();
    } catch (err) {
      log.error("jobs.purge_error", { code: errorCode(err) });
    }
  };

  setInterval(runCrm, 60_000).unref();
  setInterval(runPurge, 6 * 3600_000).unref();
  setTimeout(runPurge, 30_000).unref();
  log.info("jobs.started", { crmMode: config.crmMode });
}

/** Nach dem Speichern einer Anfrage: Benachrichtigung + sofortiger CRM-Versuch (nicht blockierend). */
export function afterLeadCreated(reference: string): void {
  void notifyNewLead(reference).catch((err) => log.error("jobs.notify_error", { code: errorCode(err) }));
  void processCrmQueue({ limit: 5 }).catch((err) => log.error("jobs.crm_error", { code: errorCode(err) }));
}
