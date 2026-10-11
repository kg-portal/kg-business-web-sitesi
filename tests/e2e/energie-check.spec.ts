import { expect, test, type Page } from "@playwright/test";
import path from "node:path";
import { fixturesDir, leadMeta, mockOutbox } from "./db";

async function fillContractStep(page: Page) {
  await page.getByRole("textbox", { name: /Postleitzahl/ }).fill("47055");
  await page.getByRole("textbox", { name: "Ort", exact: true }).fill("Duisburg");
}

async function goToStep3(page: Page, kundentyp: "Gewerbekunde" | "Privatkunde", energie: "Strom" | "Gas" | "Strom und Gas") {
  await page.goto("/energie-check");
  await page.getByText(kundentyp, { exact: true }).click();
  await page.getByTestId("next-step").click();
  await page.getByText(energie, { exact: true }).click();
  await page.getByTestId("next-step").click();
  await expect(page.getByTestId("step-indicator")).toContainText("Schritt 3 von 5");
}

test.describe("Energie-Check", () => {
  test("Gewerbekunde: vollständiger Ablauf mit Rechnung – serverseitig gespeichert, Testlead nicht ans CRM", async ({ page }) => {
    await goToStep3(page, "Gewerbekunde", "Strom und Gas");
    await fillContractStep(page);
    await page.getByRole("textbox", { name: /Jahresverbrauch Strom/ }).fill("85.000");
    await page.getByRole("textbox", { name: /Jahresverbrauch Gas/ }).fill("140.000");
    await page.getByRole("textbox", { name: /Aktueller Anbieter/ }).fill("Stadtwerke Beispiel");
    await page.getByText("Leistungsmessung (RLM)").click();
    await page.getByTestId("next-step").click();
    await page.getByRole("textbox", { name: "Firma", exact: true }).fill("E2E Test GmbH");
    await page.getByRole("textbox", { name: "Ansprechpartner/in", exact: true }).fill("Erika Test");
    await page.getByRole("textbox", { name: "E-Mail", exact: true }).fill("erika@example.com");
    await page.getByRole("textbox", { name: "Telefonnummer", exact: true }).fill("0203 1112223");
    await page.getByTestId("next-step").click();
    await page.locator('input[type="file"]').setInputFiles([path.join(fixturesDir, "rechnung.pdf"), path.join(fixturesDir, "rechnung.jpg")]);
    await expect(page.getByRole("list", { name: "Ausgewählte Dateien" }).getByRole("listitem")).toHaveCount(2);
    await page.getByLabel(/Datenschutzhinweise zur Kenntnis/).check();
    await page.getByLabel(/per E-Mail über passende/).check();
    await page.getByTestId("submit").click();

    await expect(page.getByRole("heading", { name: "Vielen Dank! Ihre Anfrage ist bei uns eingegangen." })).toBeVisible();
    const reference = (await page.getByTestId("check-reference").textContent())!.trim();
    expect(reference).toMatch(/^KGB-\d{6}-[2-9A-Z]{6}$/);

    const meta = leadMeta(reference);
    expect(meta).toMatchObject({ form_type: "energie-check", customer_type: "gewerbe", energy: "beides", upload_count: 2, is_test: 1, crm_status: "skipped_test", consent_marketing_email: 1, consent_marketing_phone: 0 });
    await page.waitForTimeout(1000);
    expect(mockOutbox()).not.toContain(reference);
  });

  test("Privatkunde: gewerbliche Felder ausgeblendet; echter Lead geht an den (Mock-)CRM-Adapter", async ({ page }) => {
    await goToStep3(page, "Privatkunde", "Gas");
    await expect(page.getByText("Zählerart")).toHaveCount(0);
    await expect(page.getByRole("textbox", { name: /Jahresverbrauch Strom/ })).toHaveCount(0);
    await fillContractStep(page);
    await page.getByTestId("next-step").click();
    await expect(page.getByRole("textbox", { name: "Firma", exact: true })).toHaveCount(0);
    await page.getByRole("textbox", { name: "Ihr Name", exact: true }).fill("Paul Privat");
    const unique = `paul.${Date.now()}@e2e-kunde-test.de`;
    await page.getByRole("textbox", { name: "E-Mail", exact: true }).fill(unique);
    await page.getByRole("textbox", { name: "Telefonnummer", exact: true }).fill("+49 170 1234567");
    await page.getByTestId("next-step").click();
    await page.getByLabel(/Datenschutzhinweise zur Kenntnis/).check();
    await page.getByTestId("submit").click();
    await expect(page.getByTestId("check-success")).toBeVisible();
    const reference = (await page.getByTestId("check-reference").textContent())!.trim();
    expect(leadMeta(reference)).toMatchObject({ customer_type: "privat", energy: "gas", is_test: 0 });
    await expect.poll(() => mockOutbox(), { timeout: 10_000 }).toContain(reference);
    await expect.poll(() => leadMeta(reference)?.crm_status, { timeout: 10_000 }).toBe("sent");
    const line = mockOutbox().split("\n").find((l) => l.includes(reference))!;
    const payload = (JSON.parse(line) as { payload: Record<string, unknown> }).payload;
    expect(payload).toMatchObject({ quelle: "KG Business Website", kundentyp: "privat", energieart: "gas", telefonnummer: "+491701234567", firma: null });
  });

  test("Pflichtfelder werden je Schritt geprüft und verständlich gemeldet", async ({ page }) => {
    await page.goto("/energie-check");
    await page.getByTestId("next-step").click();
    await expect(page.getByText("Bitte wählen Sie aus, ob Sie Unternehmen oder Privathaushalt sind.")).toBeVisible();
    await page.getByText("Gewerbekunde", { exact: true }).click();
    await page.getByTestId("next-step").click();
    await page.getByText("Strom", { exact: true }).click();
    await page.getByTestId("next-step").click();
    await page.getByTestId("next-step").click();
    await expect(page.getByText("Bitte geben Sie eine gültige fünfstellige Postleitzahl an.")).toBeVisible();
    await expect(page.getByRole("textbox", { name: /Postleitzahl/ })).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByRole("textbox", { name: /Postleitzahl/ })).toBeFocused();
    await fillContractStep(page);
    await page.getByTestId("next-step").click();
    await page.getByRole("textbox", { name: "E-Mail", exact: true }).fill("keine-mail");
    await page.getByRole("textbox", { name: "Telefonnummer", exact: true }).fill("12");
    await page.getByTestId("next-step").click();
    await expect(page.getByText("Bitte geben Sie den Firmennamen an.")).toBeVisible();
    await expect(page.getByText("Bitte geben Sie eine gültige E-Mail-Adresse an.")).toBeVisible();
    await expect(page.getByText(/gültige Telefonnummer/)).toBeVisible();
  });

  test("Serverfehler: klare Meldung, keine Erfolgsseite, Eingaben bleiben erhalten", async ({ page }) => {
    await page.route("**/api/leads", (route) =>
      route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "server", message: "Ihre Anfrage konnte leider nicht gespeichert werden. Bitte versuchen Sie es erneut oder rufen Sie uns an." }) }),
    );
    await goToStep3(page, "Privatkunde", "Strom");
    await fillContractStep(page);
    await page.getByTestId("next-step").click();
    await page.getByRole("textbox", { name: "Ihr Name", exact: true }).fill("Fehler Test");
    await page.getByRole("textbox", { name: "E-Mail", exact: true }).fill("fehler@example.com");
    await page.getByRole("textbox", { name: "Telefonnummer", exact: true }).fill("0203 555555");
    await page.getByTestId("next-step").click();
    await page.getByLabel(/Datenschutzhinweise zur Kenntnis/).check();
    await page.getByTestId("submit").click();
    await expect(page.getByTestId("form-error")).toContainText("nicht gespeichert");
    await expect(page.getByTestId("check-success")).toHaveCount(0);
    await page.getByRole("button", { name: "Zurück" }).click();
    await expect(page.getByRole("textbox", { name: "E-Mail", exact: true })).toHaveValue("fehler@example.com");
  });

  test("Netzwerkfehler wird verständlich gemeldet", async ({ page }) => {
    await page.route("**/api/leads", (route) => route.abort("failed"));
    await goToStep3(page, "Privatkunde", "Strom");
    await fillContractStep(page);
    await page.getByTestId("next-step").click();
    await page.getByRole("textbox", { name: "Ihr Name", exact: true }).fill("Netz Test");
    await page.getByRole("textbox", { name: "E-Mail", exact: true }).fill("netz@example.com");
    await page.getByRole("textbox", { name: "Telefonnummer", exact: true }).fill("0203 555555");
    await page.getByTestId("next-step").click();
    await page.getByLabel(/Datenschutzhinweise zur Kenntnis/).check();
    await page.getByTestId("submit").click();
    await expect(page.getByTestId("form-error")).toContainText("Verbindung");
  });

  test("Upload-Regeln: falsche Dateitypen und zu viele Dateien werden abgewiesen", async ({ page }) => {
    await goToStep3(page, "Privatkunde", "Strom");
    await fillContractStep(page);
    await page.getByTestId("next-step").click();
    await page.getByRole("textbox", { name: "Ihr Name", exact: true }).fill("Upload Test");
    await page.getByRole("textbox", { name: "E-Mail", exact: true }).fill("upload@example.com");
    await page.getByRole("textbox", { name: "Telefonnummer", exact: true }).fill("0203 555555");
    await page.getByTestId("next-step").click();
    const input = page.locator('input[type="file"]');
    await input.setInputFiles(path.join(fixturesDir, "programm.exe"));
    await expect(page.getByTestId("file-error")).toContainText("Bitte nur PDF, JPG oder PNG");
    await input.setInputFiles([path.join(fixturesDir, "rechnung.pdf"), path.join(fixturesDir, "rechnung.jpg")]);
    await input.setInputFiles(path.join(fixturesDir, "getarnt.pdf"));
    await input.setInputFiles({ name: "vierte.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 x") });
    await expect(page.getByTestId("file-error")).toContainText("höchstens 3 Dateien");
    await expect(page.getByRole("list", { name: "Ausgewählte Dateien" }).getByRole("listitem")).toHaveCount(3);
    // Server erkennt die getarnte Datei
    await page.getByLabel(/Datenschutzhinweise zur Kenntnis/).check();
    await page.getByTestId("submit").click();
    await expect(page.getByTestId("file-error")).toContainText(/PDF-, JPG- oder PNG|Dateiendung/);
    await expect(page.getByTestId("check-success")).toHaveCount(0);
  });

  test("Eingaben bleiben beim Neuladen erhalten (Sitzungsspeicher)", async ({ page }) => {
    await goToStep3(page, "Gewerbekunde", "Strom");
    await fillContractStep(page);
    await page.waitForTimeout(200);
    await page.reload();
    await expect(page.getByTestId("step-indicator")).toContainText("Schritt 3 von 5");
    await expect(page.getByRole("textbox", { name: "Ort", exact: true })).toHaveValue("Duisburg");
  });
});

test.describe("Kontaktformular", () => {
  test("sendet eine Nachricht und bestätigt mit Referenz", async ({ page, isMobile }) => {
    test.skip(isMobile, "einmal genügt");
    await page.goto("/kontakt");
    await page.getByTestId("kontakt-submit").click();
    await expect(page.getByText("Bitte geben Sie Ihren Namen an.")).toBeVisible();
    await page.getByRole("textbox", { name: "Name", exact: true }).fill("Kontakt Test");
    await page.getByRole("textbox", { name: "E-Mail", exact: true }).fill("kontakt@example.com");
    await page.getByRole("textbox", { name: "Ihre Nachricht", exact: true }).fill("Bitte rufen Sie mich wegen unseres Gasvertrags zurück.");
    await page.getByLabel(/Datenschutzhinweise zur Kenntnis/).check();
    await page.waitForTimeout(2200);
    await page.getByTestId("kontakt-submit").click();
    await expect(page.getByTestId("kontakt-success")).toContainText("KGB-");
  });
});
