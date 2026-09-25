import { test, expect } from "./fixtures/site";

const EMAIL = 'input[name="email"]';
const PASSWORD = 'input[name="password"]';
const ADMIN_PASSWORD = "e2e-local-admin-password";

test.describe("admin login", () => {
  test("renders the error banner from the query string", async ({ page }) => {
    await page.goto("/login?error=Invalid+credentials", {
      waitUntil: "domcontentloaded",
    });

    await expect(page.getByText("Invalid+credentials")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Admin Login" })
    ).toBeVisible();
  });

  test("a wrong password returns to the login page with an error", async ({
    page,
  }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    await page.locator(EMAIL).fill("admin@lutterodt.org");
    await page.locator(PASSWORD).fill("not-the-password");
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.waitForURL(/\/login\?error=/, { timeout: 15_000 });
    await expect(page.locator(PASSWORD)).toBeVisible();
  });

  test("the legacy default password is refused", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    await page.locator(EMAIL).fill("admin@lutterodt.org");
    await page.locator(PASSWORD).fill("admin");
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.waitForURL(/\/login\?error=/, { timeout: 15_000 });
    await expect(page.getByText("Invalid+credentials")).toBeVisible();
  });

  test("the correct password signs in and reaches the admin area", async ({
    page,
  }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    await page.locator(EMAIL).fill("admin@lutterodt.org");
    await page.locator(PASSWORD).fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.waitForURL(/\/admin/, { timeout: 15_000 });
    await expect(page).not.toHaveURL(/\/login\?error=/);
  });

  test("the password field can be revealed and hidden", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    await expect(page.locator(PASSWORD)).toHaveAttribute("type", "password");

    await page.getByRole("button", { name: "Show password" }).click();
    await expect(page.locator(PASSWORD)).toHaveAttribute("type", "text");

    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(page.locator(PASSWORD)).toHaveAttribute("type", "password");
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
