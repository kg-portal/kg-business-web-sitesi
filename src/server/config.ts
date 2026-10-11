/**
 * Server-Konfiguration aus Umgebungsvariablen (siehe .env.example).
 * Wird erst zur Laufzeit gelesen – der Build benötigt keine Geheimnisse.
 */
import { createHash } from "node:crypto";
import path from "node:path";
import { z } from "zod";
import { log } from "./logger";

const boolEnv = z
  .enum(["true", "false", "1", "0", ""])
  .optional()
  .transform((v) => v === "true" || v === "1");

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  SITE_ENV: z.string().default("preview"),
  NEXT_PUBLIC_SITE_URL: z.string().default("https://www.kg-business.de"),
  DATA_DIR: z.string().default("./data"),
  /** Mindestens 32 Zeichen; Basis für HMAC-Schlüssel (Formular-Token, Fingerprints, IP-Hash) */
  APP_SECRET: z.string().min(32).optional(),
  /** 32 Byte, Base64 – verschlüsselt personenbezogene Daten und Uploads */
  LEAD_ENCRYPTION_KEY: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  TRUST_PROXY: boolEnv,
  RATE_LIMIT_SUBMISSIONS_PER_HOUR: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_TOKENS_PER_HOUR: z.coerce.number().int().positive().default(60),
  FORM_MIN_FILL_SECONDS: z.coerce.number().min(0).default(4),
  FORM_TOKEN_MAX_AGE_HOURS: z.coerce.number().positive().default(6),
  DUPLICATE_WINDOW_HOURS: z.coerce.number().positive().default(24),
  TEST_EMAIL_DOMAINS: z.string().default("example.com,example.org,example.net,test.invalid"),

  CRM_MODE: z.enum(["disabled", "mock", "live"]).default("disabled"),
  CRM_LIVE_APPROVED: boolEnv,
  CRM_ENDPOINT: z.url().optional(),
  CRM_API_TOKEN: z.string().optional(),
  CRM_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
  CRM_MAX_ATTEMPTS: z.coerce.number().int().positive().default(8),

  MAIL_MODE: z.enum(["disabled", "log", "smtp"]).default("disabled"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: boolEnv,
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional(),
  MAIL_TO_INTERNAL: z.string().optional(),
  /** Interne Benachrichtigung mit Kontaktdaten (TLS-gesicherter Versand vorausgesetzt) */
  MAIL_INCLUDE_CONTACT: boolEnv,
  /** Bestätigungsmail an Kunden – erst nach Freigabe aktivieren */
  CUSTOMER_CONFIRMATION_EMAIL: boolEnv,

  CLAMAV_HOST: z.string().optional(),
  CLAMAV_PORT: z.coerce.number().int().positive().default(3310),
  CLAMAV_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),
  /** true: Uploads ablehnen, wenn kein Virenscanner erreichbar ist */
  UPLOAD_SCAN_REQUIRED: boolEnv,

  BACKGROUND_JOBS: z.enum(["true", "false"]).default("true"),
});

export interface AppConfig {
  env: z.output<typeof envSchema>;
  isProductionRuntime: boolean;
  dataDir: string;
  appSecret: Buffer;
  encryptionKey: Buffer;
  allowedOrigins: string[];
  /** Außerhalb der Produktion: http://localhost:* und 127.0.0.1 zulassen */
  allowLocalhostOrigins: boolean;
  testEmailDomains: string[];
  crmMode: "disabled" | "mock" | "live";
  usingDevSecrets: boolean;
}

export class ConfigError extends Error {}

let cached: AppConfig | null = null;

function devKey(label: string): Buffer {
  return createHash("sha256").update(`kg-business-dev-only-${label}`).digest();
}

export function getConfig(): AppConfig {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new ConfigError(`Ungültige Konfiguration: ${parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`);
  }
  const env = parsed.data;
  const isProductionRuntime = env.NODE_ENV === "production";
  let usingDevSecrets = false;

  let appSecret: Buffer;
  if (env.APP_SECRET) appSecret = Buffer.from(env.APP_SECRET, "utf8");
  else if (isProductionRuntime) throw new ConfigError("APP_SECRET fehlt");
  else {
    appSecret = devKey("app-secret");
    usingDevSecrets = true;
  }

  let encryptionKey: Buffer;
  if (env.LEAD_ENCRYPTION_KEY) {
    encryptionKey = Buffer.from(env.LEAD_ENCRYPTION_KEY, "base64");
    if (encryptionKey.length !== 32) throw new ConfigError("LEAD_ENCRYPTION_KEY muss 32 Byte (Base64) lang sein");
  } else if (isProductionRuntime) throw new ConfigError("LEAD_ENCRYPTION_KEY fehlt");
  else {
    encryptionKey = devKey("encryption");
    usingDevSecrets = true;
  }

  const siteOrigin = new URL(env.NEXT_PUBLIC_SITE_URL).origin;
  const allowedOrigins = new Set<string>([siteOrigin]);
  for (const o of (env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean)) {
    allowedOrigins.add(new URL(o).origin);
  }

  // Live-CRM nur mit ausdrücklicher Freigabe und vollständiger Konfiguration
  let crmMode = env.CRM_MODE;
  if (crmMode === "live" && !(env.CRM_LIVE_APPROVED && env.CRM_ENDPOINT && env.CRM_API_TOKEN)) {
    log.warn("crm.live_blocked", { reason: "CRM_LIVE_APPROVED/CRM_ENDPOINT/CRM_API_TOKEN fehlen – CRM bleibt deaktiviert" });
    crmMode = "disabled";
  }
  if (crmMode === "mock" && isProductionRuntime && env.SITE_ENV === "production") {
    throw new ConfigError("CRM_MODE=mock ist in der Produktionsumgebung nicht erlaubt");
  }

  if (usingDevSecrets) log.warn("config.dev_secrets", { hint: "Nur für lokale Entwicklung – APP_SECRET und LEAD_ENCRYPTION_KEY setzen" });

  cached = {
    env,
    isProductionRuntime,
    dataDir: path.resolve(env.DATA_DIR),
    appSecret,
    encryptionKey,
    allowedOrigins: [...allowedOrigins],
    allowLocalhostOrigins: !isProductionRuntime,
    testEmailDomains: env.TEST_EMAIL_DOMAINS.split(",").map((d) => d.trim().toLowerCase()).filter(Boolean),
    crmMode,
    usingDevSecrets,
  };
  return cached;
}

/** Nur für Tests. */
export function resetConfigForTests(): void {
  cached = null;
}
