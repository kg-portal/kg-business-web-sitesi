import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { KEY_PAGES } from "./routes";

test.describe("Barrierefreiheit (axe, WCAG 2.2 AA)", () => {
  for (const path of KEY_PAGES) {
    test(`${path} ohne axe-Verstöße`, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length}× – ${v.nodes[0]?.target.join(" ")}`);
      expect(summary, summary.join("\n")).toEqual([]);
    });
  }

  test("Energie-Check: Fehlerzustand ohne axe-Verstöße", async ({ page }) => {
    await page.goto("/energie-check");
    await page.getByTestId("next-step").click();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test("Mobiles Menü geöffnet ohne axe-Verstöße", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: "Menü öffnen" }).click();
    const results = await new AxeBuilder({ page }).include("#mobile-menu").analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test("Energie-Check ist vollständig per Tastatur bedienbar", async ({ page }) => {
    await page.goto("/energie-check");
    // Zum ersten Radio springen und mit Pfeiltasten wählen
    await page.locator('input[type="radio"]').first().focus();
    await page.keyboard.press("Space");
    await expect(page.locator('input[type="radio"]').first()).toBeChecked();
    await page.keyboard.press("Tab");
    await expect(page.getByTestId("next-step")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("step-indicator")).toContainText("Schritt 2 von 5");
    // Fokus liegt auf der neuen Schrittüberschrift
    await expect(page.locator("h3[tabindex='-1']")).toBeFocused();
  });

  test("Reduzierte Bewegung wird respektiert", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    const duration = await page.locator(".animate-flow").first().evaluate((el) => getComputedStyle(el).animationDuration);
    expect(parseFloat(duration)).toBeLessThan(0.01);
    await context.close();
  });
});
