import { test, expect, capturePost } from "./fixtures/site";

const SUCCESS_TEXT = "Message received. We will be in touch within 5 business days.";
const ERROR_TEXT =
  "Something went wrong. Please try again or email us directly at hello@lutterodt.org.";

const DROPPED_FIELD_CASES = [
  { tab: "Join Interest", label: "Family Branch", value: "Ghana" },
  {
    tab: "Volunteer",
    label: "Area of Interest",
    value: "Web & technology",
    isSelect: true,
  },
  {
    tab: "Research Request",
    label: "Institution / Affiliation",
    value: "University of Ghana",
  },
  { tab: "Media", label: "Outlet", value: "Daily Graphic" },
];

test.describe("contact form", () => {
  test.beforeEach(async ({ gotoSite }) => {
    await gotoSite("/contact");
  });

  test("general enquiry posts every field and confirms receipt", async ({
    page,
  }) => {
    const postPromise = capturePost(page, "/api/leads");

    await page.getByLabel("Full Name").fill("Ama Lutterodt");
    await page.getByLabel("Email Address").fill("ama@example.com");
    await page.getByLabel("Message").fill("I would like to know more.");
    await page.getByRole("button", { name: "Send Message" }).click();

    const post = await postPromise;
    expect(post.json).toMatchObject({
      category: "general",
      subject: "General Enquiry",
      name: "Ama Lutterodt",
      email: "ama@example.com",
      message: "I would like to know more.",
    });

    await expect(page.getByText(SUCCESS_TEXT)).toBeVisible();
  });

  test("required fields block an empty submission", async ({ page }) => {
    let posted = false;
    page.on("request", (request) => {
      if (request.url().includes("/api/leads")) posted = true;
    });

    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByLabel("Full Name")).toBeVisible();
    expect(posted, "an empty form must not reach the API").toBe(false);
  });

  test("surfaces an error banner when the API rejects the submission", async ({
    page,
    stubApi,
  }) => {
    await stubApi("**/api/leads", 500, { error: "rejected" });

    await page.getByLabel("Full Name").fill("Ama Lutterodt");
    await page.getByLabel("Email Address").fill("ama@example.com");
    await page.getByLabel("Message").fill("Testing the failure path.");
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText(ERROR_TEXT)).toBeVisible();
  });

  test("a network failure surfaces an error banner", async ({ page }) => {
    await page.route("**/api/leads", (route) => route.abort());

    await page.getByLabel("Full Name").fill("Ama Lutterodt");
    await page.getByLabel("Email Address").fill("ama@example.com");
    await page.getByLabel("Message").fill("Testing the network failure path.");
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText(ERROR_TEXT)).toBeVisible();
  });

  for (const { tab, label, value, isSelect } of DROPPED_FIELD_CASES) {
    test(`${tab} sends the ${label} field`, async ({ page }) => {
      test.fail(
        true,
        `BUG: ContactClient.tsx:38-45 only forwards category, subject, name, email and message, so "${label}" never reaches /api/leads`
      );

      await page.getByRole("button", { name: tab, exact: true }).click();

      const postPromise = capturePost(page, "/api/leads");
      await page.getByLabel("Full Name").fill("Kofi Lutterodt");
      const field = page.getByLabel(label);
      if (isSelect) {
        await field.selectOption(value);
      } else {
        await field.fill(value);
      }
      await page.getByRole("button", { name: "Send Message" }).click();

      const post = await postPromise;
      expect(post.json).toMatchObject({ [label.toLowerCase()]: value });
    });
  }
});
