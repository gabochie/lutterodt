import { test, expect } from "./fixtures/site";

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
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
});
