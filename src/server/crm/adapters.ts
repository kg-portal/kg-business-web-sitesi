import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { AppConfig } from "../config";
import type { CrmAdapter, CrmLeadPayload, CrmSendResult } from "./types";

export class DisabledCrmAdapter implements CrmAdapter {
  readonly mode = "disabled" as const;
  async send(): Promise<CrmSendResult> {
    return { ok: false, retryable: false, error: "crm_disabled" };
  }
}

/**
 * Test-Adapter: schreibt in eine lokale Outbox-Datei (JSONL) statt ins CRM.
 * Nur für Entwicklung/Preview mit Testdaten.
 */
export class MockCrmAdapter implements CrmAdapter {
  readonly mode = "mock" as const;
  readonly sent: { idempotencyKey: string; payload: CrmLeadPayload }[] = [];
  constructor(private readonly outboxFile: string | null) {}
  async send(payload: CrmLeadPayload, idempotencyKey: string): Promise<CrmSendResult> {
    this.sent.push({ idempotencyKey, payload });
    if (this.outboxFile) {
      await mkdir(path.dirname(this.outboxFile), { recursive: true, mode: 0o700 });
      await appendFile(this.outboxFile, `${JSON.stringify({ at: new Date().toISOString(), idempotencyKey, payload })}\n`, { mode: 0o600 });
    }
    return { ok: true, externalId: `mock-${payload.referenzId}` };
  }
}

/** HTTP-Adapter für die CRM-API (nur mit CRM_LIVE_APPROVED=true aktiv). */
export class HttpCrmAdapter implements CrmAdapter {
  readonly mode = "live" as const;
  constructor(
    private readonly endpoint: string,
    private readonly token: string,
    private readonly timeoutMs: number,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async send(payload: CrmLeadPayload, idempotencyKey: string): Promise<CrmSendResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await this.fetchImpl(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
          "Idempotency-Key": idempotencyKey,
          "X-Source": "kg-business-website",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (res.ok || res.status === 409) {
        let externalId: string | null = null;
        try {
          const body = (await res.json()) as Record<string, unknown>;
          const id = body.id ?? body.leadId ?? body.externalId;
          externalId = id === undefined || id === null ? null : String(id);
        } catch {
          externalId = null;
        }
        return { ok: true, externalId };
      }
      const retryable = res.status === 408 || res.status === 425 || res.status === 429 || res.status >= 500;
      return { ok: false, retryable, error: `http_${res.status}` };
    } catch (err) {
      const aborted = err instanceof Error && err.name === "AbortError";
      return { ok: false, retryable: true, error: aborted ? "timeout" : "network" };
    } finally {
      clearTimeout(timer);
    }
  }
}

let mockSingleton: MockCrmAdapter | null = null;

export function createCrmAdapter(config: AppConfig): CrmAdapter {
  switch (config.crmMode) {
    case "live":
      return new HttpCrmAdapter(config.env.CRM_ENDPOINT!, config.env.CRM_API_TOKEN!, config.env.CRM_TIMEOUT_MS);
    case "mock":
      mockSingleton ??= new MockCrmAdapter(path.join(config.dataDir, "crm-mock-outbox.jsonl"));
      return mockSingleton;
    default:
      return new DisabledCrmAdapter();
  }
}
