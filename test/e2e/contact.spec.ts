import { test, expect, capturePost, type Page } from "./fixtures/site";

const SUCCESS_TEXT =
  "Message received. We will be in touch within 5 business days.";
const ERROR_TEXT =
  "Something went wrong. Please try again or email us directly at hello@lutterodt.org.";

function contactForm(page: Page) {
  return page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: "Send Message" }) });
}

const DROPPED_FIELD_CASES = [
  { tab: "Join Interest", label: "Family Branch", value: "Ghana", hasName: true },
  {
    tab: "Volunteer",
    label: "Area of Interest",
    value: "Web & technology",
    isSelect: true,
    hasName: true,
  },
  {
    tab: "Research Request",
    label: "Institution / Affiliation",
    value: "University of Ghana",
    hasName: false,
  },
  {
    tab: "Media",
    label: "Outlet",
    value: "Daily Graphic",
    hasName: false,
  },
];

test.describe("contact form", () => {
  test.beforeEach(async ({ gotoSite }) => {
    await gotoSite("/contact");
  });

  test("general enquiry posts every field and confirms receipt", async ({
    page,
  }) => {
    const postPromise = capturePost(page, "/api/leads");
    const form = contactForm(page);

    await form.getByLabel("Full Name").fill("Ama Lutterodt");
    await form.getByLabel("Email Address").fill("ama@example.com");
    await form.getByLabel("Message").fill("I would like to know more.");
    await form.getByRole("button", { name: "Send Message" }).click();

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

    await contactForm(page)
      .getByRole("button", { name: "Send Message" })
      .click();

    await expect(contactForm(page)).toBeVisible();
    expect(posted, "an empty form must not reach the API").toBe(false);
  });

  test("surfaces an error banner when the API rejects the submission", async ({
    page,
    stubApi,
  }) => {
    await stubApi("**/api/leads", 500, { error: "rejected" });
    const form = contactForm(page);

    await form.getByLabel("Full Name").fill("Ama Lutterodt");
    await form.getByLabel("Email Address").fill("ama@example.com");
    await form.getByLabel("Message").fill("Testing the failure path.");
    await form.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText(ERROR_TEXT)).toBeVisible();
  });

  test("a network failure surfaces an error banner", async ({ page }) => {
    await page.route("**/api/leads", (route) => route.abort());
    const form = contactForm(page);

    await form.getByLabel("Full Name").fill("Ama Lutterodt");
    await form.getByLabel("Email Address").fill("ama@example.com");
    await form.getByLabel("Message").fill("Testing the network failure path.");
    await form.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText(ERROR_TEXT)).toBeVisible();
  });

  for (const { tab, label, value, isSelect, hasName } of DROPPED_FIELD_CASES) {
    test(`${tab} sends the ${label} field`, async ({ page }) => {
      test.fail(
        true,
        `BUG: ContactClient.tsx:38-45 only forwards category, subject, name, email and message, so "${label}" never reaches /api/leads`
      );

      await page.getByRole("button", { name: tab, exact: true }).click();
      const form = contactForm(page);
      const postPromise = capturePost(page, "/api/leads");

      if (hasName) {
        await form.getByLabel("Full Name").fill("Kofi Lutterodt");
      }
      const field = form.getByLabel(label);
      if (isSelect) {
        await field.selectOption(value);
      } else {
        await field.fill(value);
      }
      await form.getByRole("button", { name: "Send Message" }).click();

      const post = await postPromise;
      expect(post.json).toMatchObject({ [label.toLowerCase()]: value });
    });
  }
});
