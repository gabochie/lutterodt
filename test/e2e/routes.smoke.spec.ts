import { test, expect } from "./fixtures/site";

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/contribute/consent",
  "/directory",
  "/services",
  "/projects",
  "/history",
  "/gallery",
  "/sponsor",
  "/verify",
  "/reunion-2026",
  "/coming-soon",
  "/privacy",
  "/terms",
  "/cookies",
  "/copyright",
  "/disclaimer",
];

test.describe("public route availability", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} responds with 200 and a page title`, async ({ page }) => {
      const response = await page.goto(route, {
        waitUntil: "domcontentloaded",
      });

      expect(response, `no response for ${route}`).not.toBeNull();
      expect(response!.status(), `status for ${route}`).toBe(200);

      const title = await page.title();
      expect(title, `empty title for ${route}`).not.toBe("");
    });
  }

  test("unknown route returns a 404", async ({ page }) => {
    const response = await page.goto("/this-route-should-not-exist", {
      waitUntil: "domcontentloaded",
    });

    expect(response!.status()).toBe(404);
  });

  test.describe("service health", () => {
    test("/api/health reports D1 and KV reachability", async ({ page }) => {
      const response = await page.request.get("/api/health");
      expect(response.status()).toBe(200);
      const body = (await response.json()) as {
        healthy?: boolean;
        d1?: { ok?: boolean };
        kv?: { ok?: boolean };
      };
      expect(body.d1?.ok, "D1 unreachable").toBe(true);
      expect(body.kv?.ok, "KV unreachable").toBe(true);
      expect(body.healthy).toBe(true);
    });
  });

  test.describe("PWA assets", () => {    test("/sw.js is served as javascript", async ({ page }) => {
      const response = await page.request.get("/sw.js");
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("javascript");
    });

    test("/manifest.webmanifest is servable and complete", async ({ page }) => {
      const response = await page.request.get("/manifest.webmanifest");
      expect(response.status()).toBe(200);
      const manifest = await response.json();
      expect(manifest.id).toBe("/");
      expect(manifest.display).toBe("standalone");
      expect(
        manifest.icons.some((icon: { purpose?: string }) =>
          (icon.purpose ?? "any").includes("maskable")
        )
      ).toBe(true);
    });
  });
});
