import { test, expect } from "./fixtures/site";

test.describe("brand icon wiring", () => {
  test("advertises the crest PNGs and no explicit ico or shortcut link", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    // metadata must not declare the ico or a shortcut icon itself. Next's
    // App Router still injects src/app/favicon.ico by convention, which is
    // why that file must carry the crest build (asserted in the next test).
    const hrefs = await page
      .locator('link[rel~="icon"]')
      .evaluateAll((nodes) =>
        nodes.map((node) => (node.getAttribute("href") ?? "").split("?")[0])
      );

    expect(hrefs).toContain("/favicon-crest-32.png");
    expect(hrefs).toContain("/favicon-crest-64.png");

    // Every advertised icon must be a PNG, except the single convention-injected
    // ico, which the byte-level test below proves is the crest.
    const nonPng = hrefs.filter(
      (href) => !href.endsWith(".png") && !href.endsWith(".ico")
    );
    expect(nonPng, `unexpected icon hrefs: ${nonPng.join(", ")}`).toEqual([]);

    await expect(page.locator('link[rel="shortcut icon"]')).toHaveCount(0);
  });

  test("every served favicon.ico is the rebuilt crest, never a legacy mark", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    // src/app/favicon.ico shadows public/favicon.ico and Next injects it
    // automatically, so assert the bytes it actually returns.
    for (const path of ["/favicon.ico", "/favicon.ico?cachebust=1"]) {
      const response = await page.request.get(path);
      expect(response.status(), `status for ${path}`).toBe(200);

      const body = await response.body();
      // ICONDIR: reserved=0, type=1, and PNG signatures at every entry's
      // image offset mark the rebuilt multi-size PNG-compressed crest.
      expect(body.readUInt16LE(0), `not an icon for ${path}`).toBe(0);
      expect(body.readUInt16LE(2), `wrong icon type for ${path}`).toBe(1);

      const entries = body.readUInt16LE(4);
      expect(entries, `no icon entries for ${path}`).toBeGreaterThanOrEqual(3);

      for (let i = 0; i < entries; i++) {
        const offset = body.readUInt32LE(6 + i * 16 + 12);
        expect(
          body.readUInt32BE(offset).toString(16),
          `favicon.ico entry ${i} at ${path} is not PNG-compressed`
        ).toBe("89504e47");
      }
    }
  });

  test("serves the apple touch icon and the crest pngs", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    const touch = page.locator('link[rel="apple-touch-icon"]');
    await expect(touch).toHaveCount(1);

    for (const path of [
      "/favicon-crest-32.png",
      "/favicon-crest-64.png",
      "/apple-touch-icon.png",
    ]) {
      const response = await page.request.get(path);
      expect(response.status(), `status for ${path}`).toBe(200);
      expect(response.headers()["content-type"]).toContain("image/png");
    }
  });

  test("the manifest references only the crest icons", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    const response = await page.request.get("/manifest.webmanifest");
    expect(response.status()).toBe(200);

    const manifest = (await response.json()) as {
      icons?: { src?: string }[];
    };
    const sources = (manifest.icons ?? []).map((icon) => icon.src ?? "");

    expect(sources.length).toBeGreaterThan(0);
    expect(sources).toContain("/icon-192.png");
    expect(sources).toContain("/icon-512.png");
    for (const src of sources) {
      expect(src, `manifest references the ico: ${src}`).not.toMatch(/\.ico($|\?)/);
    }
  });

  test("no legacy mark survives anywhere in the rendered shell", async ({
    page,
  }) => {
    for (const path of ["/", "/coming-soon", "/about", "/login"]) {
      // /coming-soon and /login have no <header>, so navigate directly
      // rather than through the gotoSite fixture.
      await page.goto(path, { waitUntil: "domcontentloaded" });

      const html = await page.content();
      expect(html, `dark-cut asset on ${path}`).not.toContain(
        "lutterodt-dark-black",
      );
      expect(html, `oval asset on ${path}`).not.toContain("lutterodt-logo-");
      expect(html, `oval favicon on ${path}`).not.toContain("favicon-oval");
      expect(html, `inline star path on ${path}`).not.toContain(
        "M20 7L23.5 16.5",
      );
      expect(html, `no achievement crest on ${path}`).toContain("lutterodt-crest-200");
    }
  });
});
