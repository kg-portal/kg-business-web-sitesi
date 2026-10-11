import { expect, test, type APIRequestContext } from "@playwright/test";

const ORIGIN = "http://localhost:3200";
const base = {
  formType: "energie-check",
  kundentyp: "gewerbe",
  energie: "strom",
  plz: "47055",
  ort: "Duisburg",
  firma: "API Test GmbH",
  ansprechpartner: "Api Test",
  email: "api@example.com",
  telefon: "0203 1234567",
  datenschutz: "true",
};

async function token(request: APIRequestContext) {
  const res = await request.get("/api/form-token");
  expect(res.status()).toBe(200);
  const { token } = (await res.json()) as { token: string };
  await new Promise((r) => setTimeout(r, 2100));
  return token;
}

test.describe("Lead-API (serverseitige Absicherung)", () => {
  test.skip(({ isMobile }) => isMobile, "API einmal genügt");

  test("lehnt fremde Herkunft, fehlende Header und Bots ab", async ({ request }) => {
    const t = await token(request);
    const key = () => crypto.randomUUID();
    const send = (headers: Record<string, string>, extra: Record<string, string> = {}) =>
      request.post("/api/leads", { headers, multipart: { ...base, formToken: t, idempotencyKey: key(), ...extra } });

    expect((await send({ origin: "https://evil.example", "x-kg-form": "1" })).status()).toBe(403);
    expect((await send({ origin: ORIGIN })).status()).toBe(400);
    expect((await send({ origin: ORIGIN, "x-kg-form": "1" }, { website: "https://spam.example" })).status()).toBe(400);
    expect((await send({ origin: ORIGIN, "x-kg-form": "1" }, { formToken: "gefälscht.token" })).status()).toBe(400);
  });

  test("zu schnelles Absenden wird als Bot erkannt", async ({ request }) => {
    const { token: fresh } = (await (await request.get("/api/form-token")).json()) as { token: string };
    const res = await request.post("/api/leads", {
      headers: { origin: ORIGIN, "x-kg-form": "1" },
      multipart: { ...base, formToken: fresh, idempotencyKey: crypto.randomUUID() },
    });
    expect(res.status()).toBe(400);
    expect(((await res.json()) as { error: string }).error).toBe("too_fast");
  });

  test("validiert serverseitig und antwortet mit deutschen Feldmeldungen", async ({ request }) => {
    const t = await token(request);
    const res = await request.post("/api/leads", {
      headers: { origin: ORIGIN, "x-kg-form": "1" },
      multipart: { formType: "energie-check", formToken: t, idempotencyKey: crypto.randomUUID(), kundentyp: "gewerbe", energie: "strom", plz: "12", email: "x", datenschutz: "false" },
    });
    expect(res.status()).toBe(422);
    const body = (await res.json()) as { fields: Record<string, string> };
    expect(body.fields.plz).toContain("Postleitzahl");
    expect(body.fields.email).toContain("E-Mail");
    expect(body.fields.datenschutz).toContain("Datenschutzhinweise");
  });

  test("Idempotenz: doppelte Übermittlung erzeugt nur einen Lead", async ({ request }) => {
    const t = await token(request);
    const idempotencyKey = crypto.randomUUID();
    const send = () => request.post("/api/leads", { headers: { origin: ORIGIN, "x-kg-form": "1" }, multipart: { ...base, email: `idem.${Date.now()}@example.com`, formToken: t, idempotencyKey } });
    const first = await send();
    expect(first.status()).toBe(201);
    const ref = ((await first.json()) as { reference: string }).reference;
    const second = await send();
    expect(second.status()).toBe(200);
    expect(await second.json()).toMatchObject({ reference: ref, replay: true });
  });

  test("lehnt getarnte und aktive Dateien serverseitig ab", async ({ request }) => {
    const t = await token(request);
    const send = (name: string, buffer: Buffer, mimeType: string) =>
      request.post("/api/leads", {
        headers: { origin: ORIGIN, "x-kg-form": "1" },
        multipart: { ...base, formToken: t, idempotencyKey: crypto.randomUUID(), files: { name, mimeType, buffer } },
      });
    const fake = await send("rechnung.pdf", Buffer.from("MZ\x90\x00 programm"), "application/pdf");
    expect(fake.status()).toBe(422);
    const active = await send("rechnung.pdf", Buffer.from("%PDF-1.7\n1 0 obj << /OpenAction << /S /JavaScript /JS (x) >> >> endobj"), "application/pdf");
    expect(active.status()).toBe(422);
    expect(((await active.json()) as { message: string }).message).toContain("aktive Inhalte");
  });

  test("GET auf /api/leads ist nicht erlaubt und Health-Check ist schlank", async ({ request }) => {
    expect((await request.get("/api/leads")).status()).toBe(405);
    expect(await (await request.get("/api/health")).json()).toEqual({ status: "ok" });
  });
});
