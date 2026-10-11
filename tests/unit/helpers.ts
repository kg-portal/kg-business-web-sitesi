import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { resetConfigForTests } from "@/server/config";
import { closeDbForTests } from "@/server/db";

/** Isolierte Testumgebung mit eigenem DATA_DIR. */
export function useTempDataDir(extraEnv: Record<string, string> = {}) {
  const dir = mkdtempSync(path.join(os.tmpdir(), "kg-test-"));
  const previous: Record<string, string | undefined> = {};
  const env = { DATA_DIR: dir, CRM_MODE: "disabled", MAIL_MODE: "disabled", ...extraEnv };
  for (const [k, v] of Object.entries(env)) {
    previous[k] = process.env[k];
    process.env[k] = v;
  }
  resetConfigForTests();
  closeDbForTests();
  return {
    dir,
    cleanup() {
      closeDbForTests();
      resetConfigForTests();
      for (const [k, v] of Object.entries(previous)) {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      }
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

export const validEnergieCheck = {
  kundentyp: "gewerbe",
  energie: "strom",
  plz: "47055",
  ort: "Duisburg",
  verbrauchStrom: "25.000",
  firma: "Muster GmbH",
  ansprechpartner: "Max Mustermann",
  email: "max@muster-gmbh.de",
  telefon: "0203 1234567",
  datenschutz: "true",
};
