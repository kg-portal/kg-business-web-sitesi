import { expect, test } from "@playwright/test";
import { PAGES } from "./routes";

const WIDTHS = [360, 390, 430, 768, 1024, 1440, 1920];

test.describe("Responsives Layout", () => {
  test("keine horizontale Überbreite auf allen Seiten und Breiten", async ({ page, isMobile }) => {
    test.skip(isMobile, "Breiten werden explizit gesetzt");
    test.setTimeout(240_000);
    const problems: string[] = [];
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      for (const path of PAGES) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        if (overflow > 0) {
          const culprit = await page.evaluate(() => {
            const w = window.innerWidth;
            const el = [...document.querySelectorAll("body *")].find((e) => e.getBoundingClientRect().right > w + 1);
            return el ? `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}` : "?";
          });
          problems.push(`${width}px ${path}: +${overflow}px (${culprit})`);
        }
      }
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });

  test("mobile Ansicht: Navigation per Menü-Button, keine Desktop-Navigation", async ({ page, isMobile }) => {
    test.skip(!isMobile, "nur Mobil");
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Hauptnavigation" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Menü öffnen" })).toBeVisible();
  });

  test("Touch-Ziele der wichtigsten Bedienelemente sind ausreichend groß", async ({ page, isMobile }) => {
    test.skip(!isMobile, "nur Mobil");
    await page.goto("/");
    for (const locator of [page.getByRole("button", { name: "Menü öffnen" }), page.getByRole("link", { name: "Kostenloser Energie-Check" })]) {
      const box = await locator.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });
});
