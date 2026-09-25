import { test, expect } from "./fixtures/site";

const GATED_ROUTES = ["/", "/about", "/contact", "/directory", "/services"];

test.describe("coming soon gate", () => {
  test("reveals the site when coming_soon is disabled", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Notify Me" })).toHaveCount(0);
  });

  test("locks the site behind the overlay when coming_soon is enabled", async ({
    page,
    stubApi,
  }) => {
    await stubApi("**/api/settings", 200, { coming_soon: true });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("button", { name: "Notify Me" })).toBeVisible();
    await expect(page.locator("header")).toHaveCount(0);
  });

  for (const route of GATED_ROUTES) {
    test(`${route} is blocked by the overlay`, async ({ page, stubApi }) => {
      await stubApi("**/api/settings", 200, { coming_soon: true });
      await page.goto(route, { waitUntil: "domcontentloaded" });

      await expect(page.getByRole("button", { name: "Notify Me" })).toBeVisible();
      await expect(page.locator("header")).toHaveCount(0);
    });
  }

  test("the admin login stays reachable while the gate is closed", async ({
    page,
    stubApi,
  }) => {
    await stubApi("**/api/settings", 200, { coming_soon: true });
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("button", { name: "Notify Me" })).toHaveCount(0);
    await expect(page.locator("input[type=password]")).toBeVisible();
  });

  test("blocks an invalid email before any request is sent", async ({
    page,
    stubApi,
  }) => {
    await stubApi("**/api/settings", 200, { coming_soon: true });
    let posted = false;
    page.on("request", (request) => {
      if (request.url().includes("/api/leads")) posted = true;
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByPlaceholder("Your email address").fill("not-an-email");
    await page.getByRole("button", { name: "Notify Me" }).click();

    await expect(page.getByPlaceholder("Your email address")).toBeVisible();
    expect(posted, "an invalid email must not reach the API").toBe(false);
  });

  test("accepts a valid email on the notify form", async ({
    page,
    stubApi,
  }) => {
    await stubApi("**/api/settings", 200, { coming_soon: true });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByPlaceholder("Your name").fill("Ama Lutterodt");
    await page
      .getByPlaceholder("Your email address")
      .fill("ama@example.com");
    await page.getByRole("button", { name: "Notify Me" }).click();

    await expect(page.getByPlaceholder("Your email address")).toHaveCount(0);
  });
});
