import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HttpCrmAdapter, MockCrmAdapter } from "@/server/crm/adapters";
import { BACKOFF_MINUTES, nextAttemptAt, processCrmQueue, requeueHeldLeads } from "@/server/crm/dispatcher";
import { toCrmPayload } from "@/server/crm/mapping";
import type { CrmAdapter, CrmSendResult } from "@/server/crm/types";
import { energieCheckSchema } from "@/lib/lead-schema";
import { getLeadByReference, submitLead } from "@/server/leads/service";
import { useTempDataDir, validEnergieCheck } from "./helpers";

const uuid = () => crypto.randomUUID();

describe("toCrmPayload", () => {
  it("bildet alle geforderten Felder ab", () => {
    const data = energieCheckSchema.parse({
      ...validEnergieCheck,
      energie: "beides",
      verbrauchGas: "40000",
      anbieter: "Stadtwerke Beispiel",
      vertragsende: "2027-03-31",
      zaehlerart: "rlm",
      lieferstellen: "3",
      arbeitspreis: "28,5",
      nachricht: "Bitte vormittags anrufen",
    });
    const p = toCrmPayload(
      { reference: "KGB-261011-ABCDEF", created_at: "2026-10-11T08:00:00.000Z", duplicate_of: null, consent_text_version: "v1" },
      { formType: "energie-check", data },
      [{ originalName: "Rechnung.pdf", mime: "application/pdf", size: 100, sha256: "abc", scanStatus: "clean" }],
    );
    expect(p).toMatchObject({
      referenzId: "KGB-261011-ABCDEF",
      quelle: "KG Business Website",
      firma: "Muster GmbH",
      ansprechpartner: "Max Mustermann",
      telefonnummer: "+492031234567",
      email: "max@muster-gmbh.de",
      adresse: { plz: "47055", stadt: "Duisburg" },
      kundentyp: "gewerbe",
      energieart: "strom_und_gas",
      aktuellerAnbieter: "Stadtwerke Beispiel",
      jahresverbrauchKwh: { strom: 25000, gas: 40000 },
      vertragsende: "2027-03-31",
      anfragezeitpunkt: "2026-10-11T08:00:00.000Z",
    });
    expect(p.notizen).toContain("Leistungsmessung (RLM)");
    expect(p.notizen).toContain("Anzahl Lieferstellen: 3");
    expect(p.notizen).toContain("28,5 ct/kWh");
    expect(p.anhaenge[0]).toMatchObject({ dateiname: "Rechnung.pdf", virenscan: "clean" });
  });
});

describe("HttpCrmAdapter", () => {
  const payload = { referenzId: "KGB-1" } as never;
  const respond = (status: number, body: unknown = {}) => vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

  it("sendet Token und Idempotenz-Schlüssel und liest die externe ID", async () => {
    const fetchMock = respond(201, { id: 4711 });
    const r = await new HttpCrmAdapter("https://crm.test/api/leads", "geheim", 1000, fetchMock).send(payload, "KGB-1");
    expect(r).toEqual({ ok: true, externalId: "4711" });
    const [, init] = (fetchMock as unknown as ReturnType<typeof vi.fn>).mock.calls[0]! as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer geheim");
    expect(headers["Idempotency-Key"]).toBe("KGB-1");
  });
  it("wertet 409 (bereits vorhanden) als Erfolg", async () => {
    expect(await new HttpCrmAdapter("https://crm.test", "t", 1000, respond(409)).send(payload, "k")).toMatchObject({ ok: true });
  });
  it.each([
    [500, true],
    [503, true],
    [429, true],
    [400, false],
    [401, false],
    [422, false],
  ])("Status %i → wiederholbar: %s", async (status, retryable) => {
    expect(await new HttpCrmAdapter("https://crm.test", "t", 1000, respond(status)).send(payload, "k")).toEqual({ ok: false, retryable, error: `http_${status}` });
  });
  it("behandelt Zeitüberschreitung als wiederholbar", async () => {
    const hanging = ((_: string, init: RequestInit) =>
      new Promise((_r, reject) => init.signal?.addEventListener("abort", () => reject(Object.assign(new Error("abort"), { name: "AbortError" }))))) as unknown as typeof fetch;
    expect(await new HttpCrmAdapter("https://crm.test", "t", 20, hanging).send(payload, "k")).toEqual({ ok: false, retryable: true, error: "timeout" });
  });
});

describe("CRM-Outbox", () => {
  let env: ReturnType<typeof useTempDataDir>;
  beforeEach(() => {
    env = useTempDataDir({ CRM_MODE: "mock", CRM_MAX_ATTEMPTS: "3" });
  });
  afterEach(() => env.cleanup());

  async function createLead(email = "kunde@firma-beispiel.de") {
    const r = await submitLead({ formType: "energie-check", fields: { ...validEnergieCheck, email }, files: [], idempotencyKey: uuid() });
    if (r.kind !== "created") throw new Error("erwartet created");
    return r.reference;
  }

  it("überträgt ausstehende Anfragen genau einmal", async () => {
    const ref = await createLead();
    const adapter = new MockCrmAdapter(null);
    expect(await processCrmQueue({ adapter })).toMatchObject({ processed: 1, sent: 1 });
    expect(await processCrmQueue({ adapter })).toMatchObject({ processed: 0 });
    expect(adapter.sent).toHaveLength(1);
    expect(adapter.sent[0]!.idempotencyKey).toBe(ref);
    expect(getLeadByReference(ref)!.crm_status).toBe("sent");
  });

  it("überträgt niemals Testanfragen", async () => {
    await createLead("test@example.com");
    const adapter = new MockCrmAdapter(null);
    expect(await processCrmQueue({ adapter })).toMatchObject({ processed: 0 });
    expect(adapter.sent).toHaveLength(0);
  });

  it("wiederholt mit Backoff und markiert nach Höchstzahl als fehlgeschlagen", async () => {
    const ref = await createLead();
    const failing: CrmAdapter = { mode: "live", send: async (): Promise<CrmSendResult> => ({ ok: false, retryable: true, error: "http_503" }) };
    let now = new Date();
    expect(await processCrmQueue({ adapter: failing, now })).toMatchObject({ retried: 1 });
    const row1 = getLeadByReference(ref)!;
    expect(row1.crm_attempts).toBe(1);
    expect(new Date(row1.crm_next_attempt_at!).getTime() - now.getTime()).toBe(BACKOFF_MINUTES[0]! * 60_000);
    // vor Ablauf der Wartezeit kein neuer Versuch
    expect(await processCrmQueue({ adapter: failing, now })).toMatchObject({ processed: 0 });
    now = new Date(now.getTime() + 2 * 60_000);
    expect(await processCrmQueue({ adapter: failing, now })).toMatchObject({ retried: 1 });
    now = new Date(now.getTime() + 10 * 60_000);
    expect(await processCrmQueue({ adapter: failing, now })).toMatchObject({ failed: 1 });
    expect(getLeadByReference(ref)!.crm_status).toBe("failed");
  });

  it("bricht bei dauerhaften Fehlern sofort ab", async () => {
    const ref = await createLead();
    const rejecting: CrmAdapter = { mode: "live", send: async () => ({ ok: false, retryable: false, error: "http_400" }) };
    expect(await processCrmQueue({ adapter: rejecting })).toMatchObject({ failed: 1 });
    expect(getLeadByReference(ref)!.crm_last_error).toBe("http_400");
  });

  it("nextAttemptAt folgt der Backoff-Tabelle", () => {
    const t0 = new Date("2026-10-11T00:00:00Z");
    expect(nextAttemptAt(1, t0)).toBe("2026-10-11T00:01:00.000Z");
    expect(nextAttemptAt(4, t0)).toBe("2026-10-11T01:00:00.000Z");
    expect(nextAttemptAt(99, t0)).toBe("2026-10-12T00:00:00.000Z");
  });
});

describe("CRM deaktiviert", () => {
  let env: ReturnType<typeof useTempDataDir>;
  beforeEach(() => {
    env = useTempDataDir({ CRM_MODE: "disabled" });
  });
  afterEach(() => env.cleanup());

  it("hält Anfragen zurück, bis sie ausdrücklich eingereiht werden", async () => {
    const r = await submitLead({ formType: "energie-check", fields: { ...validEnergieCheck, email: "kunde@firma-beispiel.de" }, files: [], idempotencyKey: uuid() });
    if (r.kind !== "created") throw new Error("erwartet created");
    expect(getLeadByReference(r.reference)!.crm_status).toBe("skipped_disabled");
    expect(await processCrmQueue()).toMatchObject({ processed: 0 });
    expect(requeueHeldLeads("2000-01-01T00:00:00.000Z")).toBe(1);
    expect(getLeadByReference(r.reference)!.crm_status).toBe("pending");
  });

  it("Live-Modus ohne Freigabe bleibt deaktiviert", async () => {
    env.cleanup();
    env = useTempDataDir({ CRM_MODE: "live", CRM_ENDPOINT: "https://crm.test/api", CRM_API_TOKEN: "x", CRM_LIVE_APPROVED: "false" });
    const { getConfig } = await import("@/server/config");
    expect(getConfig().crmMode).toBe("disabled");
  });
});
