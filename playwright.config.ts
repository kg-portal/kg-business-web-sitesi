import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * E2E-Tests gegen den Produktions-Build (`next build` vorher ausführen).
 * Isolierte Testdaten in .e2e-data, CRM im Mock-Modus – niemals Live-CRM.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 4,
  retries: 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: BASE_URL,
    locale: "de-DE",
    timezoneId: "Europe/Berlin",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] }, testMatch: /(navigation|energie-check|responsive)\.spec\.ts/ },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `${BASE_URL}/api/health`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NODE_ENV: "production",
      SITE_ENV: "preview",
      ALLOWED_ORIGINS: BASE_URL,
      APP_SECRET: "e2e-only-secret-not-for-production-use-0123456789",
      LEAD_ENCRYPTION_KEY: Buffer.alloc(32, 42).toString("base64"),
      DATA_DIR: "./.e2e-data",
      CRM_MODE: "mock",
      MAIL_MODE: "disabled",
      FORM_MIN_FILL_SECONDS: "2",
      RATE_LIMIT_SUBMISSIONS_PER_HOUR: "1000",
      RATE_LIMIT_TOKENS_PER_HOUR: "5000",
      BACKGROUND_JOBS: "false",
    },
  },
});
