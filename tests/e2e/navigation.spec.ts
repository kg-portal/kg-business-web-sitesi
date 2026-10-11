import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test("Desktop: Mega-Menü öffnet, navigiert und schließt mit Escape", async ({ page, isMobile }) => {
    test.skip(isMobile, "nur Desktop");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Hauptnavigation" });
    const trigger = nav.getByRole("button", { name: "Gewerbekunden" });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
    await trigger.click();
    await nav.getByRole("link", { name: /Gewerbegas/ }).first().click();
    await expect(page).toHaveURL(/\/gewerbegas$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Gewerbegas");
  });

  test("Desktop: alle Hauptlinks führen zu existierenden Seiten", async ({ page, isMobile }) => {
    test.skip(isMobile, "nur Desktop");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Hauptnavigation" });
    for (const [name, url] of [
      ["So funktioniert’s", "/so-funktionierts"],
      ["Ratgeber", "/ratgeber"],
      ["Über uns", "/ueber-uns"],
      ["Kontakt", "/kontakt"],
    ]) {
      await nav.getByRole("link", { name: name!, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${url}$`));
      await expect(nav.getByRole("link", { name: name!, exact: true })).toHaveAttribute("aria-current", "page");
    }
  });

  test("Mobil: Menü öffnet, hält den Fokus und schließt", async ({ page, isMobile }) => {
    test.skip(!isMobile, "nur Mobil");
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menü öffnen" });
    await toggle.click();
    const dialog = page.getByRole("dialog", { name: "Hauptmenü" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Menü schließen" })).toHaveAttribute("aria-expanded", "true");
    // Fokus bleibt im Menü
    for (let i = 0; i < 25; i++) await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const el = document.activeElement;
      return !!el && (document.getElementById("mobile-menu")?.contains(el) || el.id === "mobile-menu-button");
    });
    expect(inside).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    // Untermenü und Navigation
    await page.getByRole("button", { name: "Menü öffnen" }).click();
    await dialog.getByRole("button", { name: "Gewerbekunden" }).click();
    await dialog.getByRole("link", { name: /^Gewerbestrom/ }).click();
    await expect(page).toHaveURL(/\/gewerbestrom$/);
    await expect(dialog).toBeHidden();
  });

  test("Mobil: Angebots-Leiste ist erreichbar und führt zum Energie-Check", async ({ page, isMobile }) => {
    test.skip(!isMobile, "nur Mobil");
    await page.goto("/gewerbestrom");
    const cta = page.getByRole("link", { name: "Kostenloser Energie-Check" });
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/energie-check$/);
    // Auf der Check-Seite selbst keine doppelte Leiste
    await expect(page.getByRole("link", { name: "Kostenloser Energie-Check" })).toHaveCount(0);
  });

  test("Skip-Link springt zum Inhalt", async ({ page }) => {
    await page.goto("/ratgeber");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Zum Inhalt springen" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("Haupt-CTAs der Startseite zeigen auf die richtigen Ziele", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("section").first();
    await expect(hero.getByRole("link", { name: "Jetzt kostenlosen Energie-Check starten" })).toHaveAttribute("href", "/energie-check");
    await expect(hero.getByRole("link", { name: "Persönlich beraten lassen" })).toHaveAttribute("href", "/kontakt");
    await expect(page.locator('a[href^="tel:+49"]').first()).toBeAttached();
  });

  test("Quick-Check im Hero übergibt Auswahl an den Energie-Check", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("form").filter({ hasText: "Kostenloser Energie-Check" }).first();
    await form.getByText("Privathaushalt").click();
    await form.getByText("Gas", { exact: true }).click();
    await form.getByLabel(/Postleitzahl/).fill("40210");
    await form.getByRole("button", { name: "Jetzt Energie-Check starten" }).click();
    await expect(page).toHaveURL(/\/energie-check\?kundentyp=privat&energie=gas&plz=40210/);
    await expect(page.getByTestId("step-indicator")).toContainText("Schritt 3 von 5");
    await expect(page.getByRole("textbox", { name: /Postleitzahl/ })).toHaveValue("40210");
  });

  test("Footer enthält Rechtslinks", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    for (const name of ["Impressum", "Datenschutz", "AGB"]) {
      await expect(footer.getByRole("link", { name, exact: true })).toHaveAttribute("href", `/${name.toLowerCase()}`);
    }
  });
});
