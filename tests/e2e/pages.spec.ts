import { expect, test } from "@playwright/test";
import { PAGES } from "./routes";

test.describe("Seiten & SEO", () => {
  for (const path of PAGES) {
    test(`${path} lädt mit vollständigen Metadaten`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();
      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThanOrEqual(90);
      const desc = await page.locator('meta[name="description"]').getAttribute("content");
      expect(desc?.length ?? 0).toBeGreaterThan(50);
      expect(desc?.length ?? 0).toBeLessThanOrEqual(200);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.kg-business.de${path === "/" ? "" : path}`);
      await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /kg-business-og\.png/);
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "de_DE");
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
      // Vorschau: niemals indexieren
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      expect(res?.headers()["x-robots-tag"]).toContain("noindex");
      await expect(page.locator("html")).toHaveAttribute("lang", "de");
    });
  }

  test("Titel und Beschreibungen sind seitenweise eindeutig", async ({ page }) => {
    test.setTimeout(120_000);
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const path of PAGES) {
      await page.goto(path);
      titles.add(await page.title());
      descriptions.add((await page.locator('meta[name="description"]').getAttribute("content")) ?? "");
    }
    expect(titles.size).toBe(PAGES.length);
    expect(descriptions.size).toBe(PAGES.length);
  });

  test("Strukturierte Daten sind gültiges JSON und enthalten die Organisation", async ({ page }) => {
    await page.goto("/gewerbestrom");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.flatMap((b) => {
      const data = JSON.parse(b) as unknown;
      return (Array.isArray(data) ? data : [data]).map((d) => (d as { "@type": string })["@type"]);
    });
    expect(types).toEqual(expect.arrayContaining(["ProfessionalService", "WebSite", "BreadcrumbList", "FAQPage", "Service"]));
  });

  test("sitemap.xml listet alle Seiten mit kanonischen URLs", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    for (const path of PAGES.filter((p) => p !== "/")) expect(xml).toContain(`https://www.kg-business.de${path}</loc>`);
    expect(xml).not.toContain("/api/");
  });

  test("robots.txt sperrt die Vorschau vollständig", async ({ request }) => {
    const txt = await (await request.get("/robots.txt")).text();
    expect(txt).toMatch(/Disallow: \/\s*$/m);
  });

  test("Unbekannte URLs liefern eine 404-Seite", async ({ page }) => {
    const res = await page.goto("/diese-seite-gibt-es-nicht");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("nicht");
    await expect(page.getByRole("link", { name: "Zur Startseite", exact: true })).toBeVisible();
  });

  test("Alte V1-URLs werden dauerhaft weitergeleitet", async ({ request }) => {
    for (const [from, to] of [
      ["/index.html", "/"],
      ["/impressum.html", "/impressum"],
      ["/datenschutz.html", "/datenschutz"],
      ["/agb.html", "/agb"],
    ]) {
      const res = await request.get(from!, { maxRedirects: 0 });
      expect(res.status()).toBe(308);
      expect(res.headers().location).toBe(to);
    }
  });

  test("Sicherheits-Header sind gesetzt", async ({ request }) => {
    const h = (await request.get("/")).headers();
    expect(h["content-security-policy"]).toContain("default-src 'self'");
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["x-powered-by"]).toBeUndefined();
  });

  test("Keine Anfragen an externe Domains (keine Tracker, keine Google Fonts)", async ({ page }) => {
    const external: string[] = [];
    page.on("request", (r) => {
      const url = new URL(r.url());
      if (!["localhost", "127.0.0.1"].includes(url.hostname) && url.protocol.startsWith("http")) external.push(r.url());
    });
    for (const path of ["/", "/gewerbestrom", "/energie-check"]) await page.goto(path, { waitUntil: "networkidle" });
    expect(external).toEqual([]);
  });

  test("Rechtsseiten enthalten die Pflichtangaben", async ({ page }) => {
    await page.goto("/impressum");
    await expect(page.getByText("Angaben gemäß § 5 DDG")).toBeVisible();
    await expect(page.getByText("Damla Kicci").first()).toBeVisible();
    await expect(page.getByText("DE325770756")).toBeVisible();
    await expect(page.getByText(/ec\.europa\.eu\/consumers\/odr/)).toHaveCount(0);
    await page.goto("/datenschutz");
    await expect(page.getByRole("heading", { name: /Ihre Rechte/ })).toBeVisible();
    await expect(page.getByText(/Landesbeauftragte für Datenschutz/)).toBeVisible();
  });

  test("Keine erfundenen Preise oder Bewertungen auf zentralen Seiten", async ({ page }) => {
    // Gewerbegas zeigt bewusst gesetzliche Steuer-/Abgabensätze (keine Tarifpreise) und ist daher ausgenommen
    for (const path of ["/", "/gewerbestrom", "/privatkunden", "/privatkunden/strom"]) {
      await page.goto(path);
      const text = await page.locator("main").innerText();
      expect(text).not.toMatch(/\d+[,.]\d+\s?ct\/kWh/);
      expect(text).not.toMatch(/bis zu \d+\s?%/i);
      expect(text).not.toMatch(/★|Sterne|Kundenbewertung/);
      expect(text).not.toMatch(/klimaneutral|umweltfreundlich/i);
    }
  });
});
