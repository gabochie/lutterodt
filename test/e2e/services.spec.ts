import { test, expect, capturePost } from "./fixtures/site";

const NAME = 'input[placeholder="Full name"]';
const EMAIL = 'input[placeholder="email@example.com"]';
const PHONE = 'input[placeholder="+233..."]';
const MESSAGE = 'textarea[placeholder="What are you working on?"]';

test.describe("services enquiry", () => {
  test.beforeEach(async ({ gotoSite }) => {
    await gotoSite("/services");
  });

  test("submits the enquiry and confirms receipt", async ({ page }) => {
    const postPromise = capturePost(page, "/api/clients/register");

    await page.locator(NAME).fill("Kofi Lutterodt");
    await page.locator(EMAIL).fill("kofi@example.com");
    await page.locator(PHONE).fill("+233201234567");
    await page.locator("select").selectOption("Building in Ghana");
    await page.locator(MESSAGE).fill("I need help with a family property.");

    await page.getByRole("button", { name: /Send/ }).click();

    const post = await postPromise;
    expect(post.json).toMatchObject({
      name: "Kofi Lutterodt",
      email: "kofi@example.com",
      phone: "+233201234567",
      service_interest: "Building in Ghana",
      message: "I need help with a family property.",
    });

    await expect(page.getByText("Thank you.")).toBeVisible();
  });

  test("requires a name and email", async ({ page }) => {
    let posted = false;
    page.on("request", (request) => {
      if (request.url().includes("/api/clients/register")) posted = true;
    });

    await page.getByRole("button", { name: /Send/ }).click();

    await expect(page.locator(NAME)).toBeVisible();
    expect(posted, "an incomplete enquiry must not reach the API").toBe(false);
  });

  test("surfaces the server error message", async ({ page, stubApi }) => {
    await stubApi("**/api/clients/register", 400, {
      error: "Name and email are required",
    });

    await page.locator(NAME).fill("Kofi Lutterodt");
    await page.locator(EMAIL).fill("kofi@example.com");
    await page.getByRole("button", { name: /Send/ }).click();

    await expect(page.getByText("Name and email are required")).toBeVisible();
    await expect(page.getByText("Thank you.")).toHaveCount(0);
  });

  test("a network failure surfaces an error", async ({ page }) => {
    await page.route("**/api/clients/register", (route) => route.abort());

    await page.locator(NAME).fill("Kofi Lutterodt");
    await page.locator(EMAIL).fill("kofi@example.com");
    await page.getByRole("button", { name: /Send/ }).click();

    await expect(page.getByText("Something went wrong")).toBeVisible();
  });

  test("the form resets after a successful submission", async ({ page }) => {
    await page.locator(NAME).fill("Kofi Lutterodt");
    await page.locator(EMAIL).fill("kofi@example.com");
    await page.getByRole("button", { name: /Send/ }).click();

    await expect(page.getByText("Thank you.")).toBeVisible();
    await expect(page.locator(NAME)).toHaveCount(0);
  });

  test("enquiry fields expose an accessible name", async ({ page }) => {
    test.fail(
      true,
      "A11Y: ServicesClient.tsx labels have no htmlFor and the inputs have no id, so the enquiry fields have no accessible name"
    );

    await expect(page.getByRole("textbox", { name: "Name *" })).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Email *" })
    ).toBeVisible();
  });
});
