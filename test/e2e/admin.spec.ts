import { test, expect } from "./fixtures/site";
// Rate-limit isolation: distinct egress IP per spec file so suites
// never share a throttle bucket.
test.use({ extraHTTPHeaders: { "x-forwarded-for": "10.21.0.11" } });

const EMAIL = 'input[name="email"]';
const PASSWORD = 'input[name="password"]';
const ADMIN_PASSWORD = "e2e-local-admin-password";

async function signIn(page: import("@playwright/test").Page, password: string) {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await page.locator(EMAIL).fill("admin@lutterodt.org");
  await page.locator(PASSWORD).fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
}

test.describe("admin login", () => {
  test("renders the error banner from the query string", async ({ page }) => {
    await page.goto("/login?error=Invalid+credentials", {
      waitUntil: "domcontentloaded",
    });

    await expect(page.getByText("Invalid credentials")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Admin Login" })
    ).toBeVisible();
  });

  test("a wrong password returns to the login page with an error", async ({
    page,
  }) => {
    await signIn(page, "not-the-password");

    await page.waitForURL(/\/login\?error=/, { timeout: 15_000 });
    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("the legacy default password is refused", async ({ page }) => {
    await signIn(page, "admin");

    await page.waitForURL(/\/login\?error=/, { timeout: 15_000 });
    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("the correct password signs in and reaches the admin area", async ({
    page,
  }) => {
    await signIn(page, ADMIN_PASSWORD);

    await page.waitForURL(/\/admin/, { timeout: 20_000 });
    await expect(page).not.toHaveURL(/\/login/);

    const cookies = await page.context().cookies();
    expect(cookies.some((cookie) => cookie.name === "admin_token")).toBe(true);
  });

  test("the password field can be revealed and hidden", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    await expect(page.locator(PASSWORD)).toHaveAttribute("type", "password");

    // The reveal toggle is a client component, so clicks before React has
    // hydrated are no-ops. Retry until the type actually flips, which keeps
    // this spec stable under parallel load.
    const reveal = page.getByRole("button", { name: "Show password" });
    await expect(reveal).toBeVisible();
    await expect
      .poll(
        async () => {
          await reveal.click();
          return page.locator(PASSWORD).getAttribute("type");
        },
        { timeout: 15_000 }
      )
      .toBe("text");

    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(page.locator(PASSWORD)).toHaveAttribute("type", "password", {
      timeout: 15_000,
    });
  });

  test("login fields expose an accessible name", async ({ page }) => {
    test.fail(
      true,
      "A11Y: the admin login labels have no htmlFor and the inputs have no id, so both fields have no accessible name"
    );

    await page.goto("/login", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("textbox", { name: "Email Address" })
    ).toBeVisible();
    await expect(
      page.getByLabel("Password", { exact: true })
    ).toBeVisible();
  });
});
