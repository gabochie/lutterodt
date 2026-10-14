import { test, expect } from "./fixtures/site";
// Rate-limit isolation: distinct egress IP per spec file so suites
// never share a throttle bucket.
test.use({ extraHTTPHeaders: { "x-forwarded-for": "10.21.0.17" } });

const EMAIL = 'input[placeholder="you@example.com"]';
const ACCESS_CODE = 'input[placeholder="Your access code"]';

const SERVICES_PAYLOAD = [
  {
    id: "s1",
    title: "Archiving & Digitisation",
    category: "Archive",
    description: "Digitise and index family records.",
    pricing: "From GH₵ 2,000",
    deliverables: JSON.stringify(["Scans", "index", "catalogue"]),
  },
];

const PROJECTS_PAYLOAD = [
  {
    id: 1,
    service_interest: "Building in Ghana",
    message: "Family property project",
    status: "in_progress",
    created_at: "2026-01-15T00:00:00.000Z",
  },
];

async function fillLogin(page: import("@playwright/test").Page) {
  await page.locator(EMAIL).fill("client@example.com");
  await page.locator(ACCESS_CODE).fill("ABCD-1234");
  await page.getByRole("button", { name: "Log In" }).click();
}

test.describe("client portal", () => {
  test("requires an email and an access code", async ({ page, gotoSite }) => {
    let posted = false;
    page.on("request", (request) => {
      if (request.url().includes("/api/clients/login")) posted = true;
    });

    await gotoSite("/dashboard/login");
    await page.getByRole("button", { name: "Log In" }).click();

    await expect(page.locator(EMAIL)).toBeVisible();
    expect(posted, "an incomplete login must not reach the API").toBe(false);
  });

  test("shows the server error for invalid credentials", async ({
    page,
    gotoSite,
    stubApi,
  }) => {
    await gotoSite("/dashboard/login");
    await stubApi("**/api/clients/login", 401, {
      error: "Invalid credentials or account not active",
    });

    await fillLogin(page);

    await expect(
      page.getByText("Invalid credentials or account not active")
    ).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard\/login/);
  });

  test("a successful login lands on the client dashboard", async ({
    page,
    gotoSite,
    stubApi,
  }) => {
    await gotoSite("/dashboard/login");
    await stubApi("**/api/clients/services", 200, SERVICES_PAYLOAD);
    await stubApi("**/api/clients/projects", 200, PROJECTS_PAYLOAD);

    await fillLogin(page);

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByRole("heading", { name: "Welcome aboard" })
    ).toBeVisible();
    await expect(page.getByText("Building in Ghana")).toBeVisible();
  });

  test("the dashboard returns to login when the client APIs reject", async ({
    page,
    gotoSite,
    stubApi,
  }) => {
    await gotoSite("/dashboard");
    await stubApi("**/api/clients/services", 401, { error: "Unauthorized" });
    await stubApi("**/api/clients/projects", 401, { error: "Unauthorized" });

    await expect(page).toHaveURL(/\/dashboard\/login/, {
      timeout: 15_000,
    });
  });

  test("logging out returns to the login page", async ({
    page,
    gotoSite,
    stubApi,
  }) => {
    await stubApi("**/api/clients/services", 200, SERVICES_PAYLOAD);
    await stubApi("**/api/clients/projects", 200, PROJECTS_PAYLOAD);

    await gotoSite("/dashboard");

    await expect(
      page.getByRole("heading", { name: "Welcome aboard" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Log out" }).click({ force: true });

    await expect(page).toHaveURL(/\/dashboard\/login/);
  });

  test("the dashboard survives a plain-text deliverables value", async ({
    page,
    gotoSite,
    stubApi,
  }) => {
    await stubApi("**/api/clients/services", 200, [
      { ...SERVICES_PAYLOAD[0], deliverables: "Scans, index, catalogue" },
    ]);
    await stubApi("**/api/clients/projects", 200, PROJECTS_PAYLOAD);

    await gotoSite("/dashboard");

    await expect(
      page.getByRole("heading", { name: "Welcome aboard" })
    ).toBeVisible();
    await expect(page.getByText("Scans")).toBeVisible();
    await expect(page.getByText("Something went wrong")).toHaveCount(0);
  });
});
