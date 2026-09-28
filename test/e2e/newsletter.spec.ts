import { test, expect, capturePost } from "./fixtures/site";

const EMAIL_FIELD = "#newsletter-email";
const SUBSCRIBE = 'button:has-text("Subscribe")';

test.describe("footer newsletter", () => {
  test("renders the quarterly copy and an accessible email field", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    await expect(
      page.getByText(/quarterly notes from the archive/i)
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Newsletter" })).toBeVisible();

    const field = page.locator(EMAIL_FIELD);
    await expect(field).toBeVisible();
    await expect(field).toHaveAttribute("type", "email");
    await expect(field).toHaveAttribute("required", "");
  });

  test("a valid subscription posts to the leads endpoint and confirms", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    const post = capturePost(page, "/api/leads");
    await page.locator(EMAIL_FIELD).fill("family@lutterodt.org");
    await page.locator(SUBSCRIBE).click();

    const captured = await post;
    expect(captured.json).toMatchObject({
      email: "family@lutterodt.org",
      subject: "Newsletter Subscription",
    });

    await expect(
      page.getByText(/subscribed\. welcome to the archive bulletin/i)
    ).toBeVisible();
  });

  test("the input clears after a successful subscription", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    const field = page.locator(EMAIL_FIELD);
    await field.fill("clear-me@lutterodt.org");
    await page.locator(SUBSCRIBE).click();

    await expect(
      page.getByText(/subscribed\. welcome to the archive bulletin/i)
    ).toBeVisible();
    await expect(field).toHaveValue("");
  });

  test("the browser blocks a malformed address before any request", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    let called = false;
    await page.route("**/api/leads", (route) => {
      called = true;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.locator(EMAIL_FIELD).fill("not-an-email");
    await page.locator(SUBSCRIBE).click();

    await expect(page).toHaveURL(/\/$/);
    expect(called).toBe(false);
  });

  test("a rejected subscription surfaces an error and keeps the address", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    await page.route("**/api/leads", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Could not register" }),
      })
    );

    const field = page.locator(EMAIL_FIELD);
    await field.fill("fail@lutterodt.org");
    await page.locator(SUBSCRIBE).click();

    await expect(page.getByText(/something went wrong/i)).toBeVisible();
    await expect(field).toHaveValue("fail@lutterodt.org");
  });

  test("a network failure surfaces an error rather than a false confirmation", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    await page.route("**/api/leads", (route) => route.abort("failed"));

    await page.locator(EMAIL_FIELD).fill("offline@lutterodt.org");
    await page.locator(SUBSCRIBE).click();

    await expect(page.getByText(/something went wrong/i)).toBeVisible();
    await expect(
      page.getByText(/subscribed\. welcome to the archive bulletin/i)
    ).toHaveCount(0);
  });

  test("appears once per page and is absent from the admin shell", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");
    await expect(page.locator(EMAIL_FIELD)).toHaveCount(1);

    // /login is a public page inside the (main) group, so it keeps the footer.
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.locator(EMAIL_FIELD)).toHaveCount(1);

    // The admin area renders AdminShell, which has no site footer.
    await page.goto("/admin", { waitUntil: "domcontentloaded" });
    await page.waitForURL(/\/login/, { timeout: 15_000 });
    await expect(page.locator(EMAIL_FIELD)).toHaveCount(1);
  });
});
