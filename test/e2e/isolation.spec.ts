import { test, expect } from "./fixtures/site";

test.describe("test isolation guarantees", () => {
  test("lead submissions are intercepted and never reach the application", async ({
    page,
  }) => {
    let body: string | null = null;

    page.on("response", async (response) => {
      if (response.url().includes("/api/leads")) {
        try {
          body = await response.text();
        } catch {
          body = null;
        }
      }
    });

    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    const form = page
      .locator("form")
      .filter({ has: page.getByRole("button", { name: "Send Message" }) });

    await form.getByLabel("Full Name").fill("Isolation Probe");
    await form.getByLabel("Email Address").fill("probe@example.com");
    await form.getByLabel("Message").fill("This must never reach D1.");
    await form.getByRole("button", { name: "Send Message" }).click();

    await expect(
      page.getByText("Message received. We will be in touch within 5 business days.")
    ).toBeVisible();

    expect(body, "the request must be answered by the test harness").toBe(
      '{"ok":true}'
    );
  });

  test("the outreach send path is disabled", async ({ page, gotoSite }) => {
    await gotoSite("/");

    const status = await page.evaluate(async () => {
      const response = await fetch("/api/outreach/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });
      return response.status;
    });

    expect(status).toBe(503);
  });

  test("the daily pipeline is disabled", async ({ page, gotoSite }) => {
    await gotoSite("/");

    const status = await page.evaluate(async () => {
      const response = await fetch("/api/outreach/daily", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });
      return response.status;
    });

    expect(status).toBe(503);
  });

  test("never issues a request to the production origin", async ({ page }) => {
    const productionRequests: string[] = [];

    page.on("request", (request) => {
      if (request.url().startsWith("https://lutterodt.org")) {
        productionRequests.push(request.url());
      }
    });

    for (const route of ["/", "/directory", "/contact", "/services", "/verify"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(250);
    }

    expect(
      productionRequests,
      "local runs must not reach the live site or its D1"
    ).toEqual([]);
  });
});
