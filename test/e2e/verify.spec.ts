import { test, expect, capturePost } from "./fixtures/site";

const NAME = 'input[placeholder="Your full name"]';
const EMAIL = 'input[placeholder="your@email.com"]';
const RELATION = 'textarea[placeholder^="How are you related"]';
const SUBMIT = 'button:has-text("Submit Verification")';

test.describe("identity verification onboarding", () => {
  test.beforeEach(async ({ gotoSite }) => {
    await gotoSite("/verify");
  });

  test("submits the request and shows the confirmation", async ({
    page,
  }) => {
    const postPromise = capturePost(page, "/api/leads");

    await page.locator(NAME).fill("Ama Lutterodt");
    await page.locator(EMAIL).fill("ama@example.com");
    await page
      .locator(RELATION)
      .fill("Granddaughter of Georgina, through the Accra branch.");
    await page.locator(SUBMIT).click();

    const post = await postPromise;
    expect(post.json).toMatchObject({
      name: "Ama Lutterodt",
      email: "ama@example.com",
      subject: "Identity Verification",
      message:
        "Family relation: Granddaughter of Georgina, through the Accra branch.",
    });

    await expect(page.getByRole("heading", { name: "Thank You" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Back to Directory" })
    ).toBeVisible();
  });

  test("requires a name, email and family relation", async ({ page }) => {
    let posted = false;
    page.on("request", (request) => {
      if (request.url().includes("/api/leads")) posted = true;
    });

    await page.locator(SUBMIT).click();

    await expect(page.locator(NAME)).toBeVisible();
    expect(posted, "an incomplete form must not reach the API").toBe(false);
  });

  test("reports a failure to the user when the API rejects the request", async ({
    page,
    stubApi,
  }) => {
    test.fail(
      true,
      "BUG: VerifyClient.tsx:19 calls setSubmitted only when res.ok, so a failed POST leaves the user staring at an unchanged form with no error and no feedback"
    );

    await stubApi("**/api/leads", 500, { error: "rejected" });

    await page.locator(NAME).fill("Ama Lutterodt");
    await page.locator(EMAIL).fill("ama@example.com");
    await page.locator(RELATION).fill("Great-granddaughter, Accra branch.");
    await page.locator(SUBMIT).click();

    await expect(page.getByText(/could not|try again|failed|error/i)).toBeVisible();
  });

  test("grants access to gated directory profiles", async ({ page }) => {
    test.fail(
      true,
      "BUG: nothing in the codebase ever sets the lutterodt_verified cookie, so submitting verification never unlocks a modern profile and the flow dead-ends at the directory"
    );

    await page.locator(NAME).fill("Ama Lutterodt");
    await page.locator(EMAIL).fill("ama@example.com");
    await page.locator(RELATION).fill("Granddaughter, Accra branch.");
    await page.locator(SUBMIT).click();
    await expect(page.getByRole("heading", { name: "Thank You" })).toBeVisible();

    const cookies = await page.context().cookies();
    expect(
      cookies.some((cookie) => cookie.name === "lutterodt_verified"),
      "verification must issue a cookie that the directory API accepts"
    ).toBe(true);
  });

  test("form fields expose an accessible name", async ({ page }) => {
    test.fail(
      true,
      "A11Y: VerifyClient.tsx labels have no htmlFor and the inputs have no id, so all three fields have no accessible name for screen readers"
    );

    await expect(
      page.getByRole("textbox", { name: "Full Name" })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Email Address" })
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Family Relation" })
    ).toBeVisible();
  });
});
