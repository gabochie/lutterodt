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

async function openTab(page: Page, tab: string) {
  await page.getByRole("button", { name: tab, exact: true }).click();
  await expect(page.getByRole("button", { name: tab, exact: true })).toHaveClass(
    /border-burgundy/
  );
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

  test("defaults to the archive material contribution tab", async ({ page }) => {
    await expect(
      page.getByText("anything", { exact: false }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Contribute Materials", exact: true })
    ).toHaveClass(/border-burgundy/);
    await expect(
      contactForm(page).getByLabel("What you have")
    ).toBeVisible();
  });

  test("general enquiry posts every field and confirms receipt", async ({
    page,
  }) => {
    await openTab(page, "General");
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
    await openTab(page, "General");
    await stubApi("**/api/leads", 500, { error: "rejected" });
    const form = contactForm(page);

    await form.getByLabel("Full Name").fill("Ama Lutterodt");
    await form.getByLabel("Email Address").fill("ama@example.com");
    await form.getByLabel("Message").fill("Testing the failure path.");
    await form.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText(ERROR_TEXT)).toBeVisible();
  });

  test("a network failure surfaces an error banner", async ({ page }) => {
    await openTab(page, "General");
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
      await openTab(page, tab);
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
      await form.getByLabel("Email Address").fill("kofi@example.com");
      await form.getByRole("button", { name: "Send Message" }).click();

      const post = await postPromise;
      expect(post.json?.message, `${label} must reach the API`).toContain(
        `${label}: ${value}`
      );
    });
  }
});

test.describe("archive intake paths", () => {
  test.beforeEach(async ({ gotoSite }) => {
    await gotoSite("/contact");
  });

  test("material contributions post every field and record consent", async ({
    page,
  }) => {
    const postPromise = capturePost(page, "/api/leads");
    const form = contactForm(page);

    await form.getByLabel("Full Name").fill("Kofi Lutterodt");
    await form.getByLabel("Email Address").fill("kofi@example.com");
    await form.getByLabel("What you have").selectOption("Photographs");
    await form
      .getByLabel("Which branch or town")
      .fill("Harz, Germany");
    await form
      .getByLabel("Details, names and dates you can recall")
      .fill("Three family portraits, circa 1954, with names pencilled on the reverse.");
    await form.getByRole("checkbox").check();
    await form.getByRole("button", { name: "Send Message" }).click();

    const post = await postPromise;
    expect(post.json).toMatchObject({
      category: "materials",
      subject: "Archive Material Contribution",
      name: "Kofi Lutterodt",
      email: "kofi@example.com",
    });
    expect(post.json?.message).toContain("What you have: Photographs");
    expect(post.json?.message).toContain("Which branch or town: Harz, Germany");
    expect(post.json?.message).toContain("circa 1954");
    expect(post.json?.message).toContain("Consent and usage rights: accepted");

    await expect(page.getByText(SUCCESS_TEXT)).toBeVisible();
  });

  test("a material contribution without consent never reaches the API", async ({
    page,
  }) => {
    let posted = false;
    page.on("request", (request) => {
      if (request.url().includes("/api/leads")) posted = true;
    });

    const form = contactForm(page);
    await form.getByLabel("Email Address").fill("kofi@example.com");
    await form.getByLabel("What you have").selectOption("Photographs");
    // consent deliberately left unchecked
    await form.getByRole("button", { name: "Send Message" }).click();

    await expect(contactForm(page)).toBeVisible();
    expect(posted, "consent is required before anything is stored").toBe(false);
  });

  test("oral history posts testimony and records consent", async ({ page }) => {
    await openTab(page, "Share Memories");
    const postPromise = capturePost(page, "/api/leads");
    const form = contactForm(page);

    await form.getByLabel("Full Name").fill("Ama Lutterodt");
    await form.getByLabel("Email Address").fill("ama@example.com");
    await form.getByLabel("Who this is about").fill("Georgina Lutterodt");
    await form.getByLabel("Years or period covered").fill("1947-1970");
    await form
      .getByLabel("What you remember")
      .fill("She kept every letter that came into the house, in a tin under the bed.");
    await form.getByRole("checkbox").check();
    await form.getByRole("button", { name: "Send Message" }).click();

    const post = await postPromise;
    expect(post.json).toMatchObject({
      category: "testimony",
      subject: "Oral History Contribution",
    });
    expect(post.json?.message).toContain("Who this is about: Georgina Lutterodt");
    expect(post.json?.message).toContain("Years or period covered: 1947-1970");
    expect(post.json?.message).toContain("tin under the bed");
    expect(post.json?.message).toContain("Consent and usage rights: accepted");
  });

  test("profile verification posts the correction and its source", async ({
    page,
  }) => {
    await openTab(page, "Verify a Profile");
    const postPromise = capturePost(page, "/api/leads");
    const form = contactForm(page);

    await form.getByLabel("Full Name").fill("Kofi Lutterodt");
    await form.getByLabel("Email Address").fill("kofi@example.com");
    await form.getByLabel("Profile to check").fill("Ascan Lutteroth, Germany");
    await form.getByLabel("What is wrong or missing").fill("Born 1843, not 1842.");
    await form.getByLabel("How you know").fill("His gravestone in Friedrichsfelde.");
    await form.getByRole("button", { name: "Send Message" }).click();

    const post = await postPromise;
    expect(post.json).toMatchObject({
      category: "verify",
      subject: "Profile Verification",
    });
    expect(post.json?.message).toContain("Profile to check: Ascan Lutteroth, Germany");
    expect(post.json?.message).toContain("What is wrong or missing: Born 1843, not 1842.");
    expect(post.json?.message).toContain("How you know: His gravestone in Friedrichsfelde.");
  });

  test("a testimony submission without consent never reaches the API", async ({
    page,
  }) => {
    await openTab(page, "Share Memories");
    let posted = false;
    page.on("request", (request) => {
      if (request.url().includes("/api/leads")) posted = true;
    });

    const form = contactForm(page);
    await form.getByLabel("Email Address").fill("ama@example.com");
    await form.getByLabel("Who this is about").fill("Georgina Lutterodt");
    await form.getByRole("button", { name: "Send Message" }).click();

    await expect(contactForm(page)).toBeVisible();
    expect(posted, "consent is required before testimony is stored").toBe(false);
  });
});

test.describe("intake deep links", () => {
  for (const intent of ["materials", "testimony", "verify", "general"]) {
    test(`?intent=${intent} selects the matching tab`, async ({
      page,
      gotoSite,
    }) => {
      await gotoSite(`/contact?intent=${intent}`);
      const labels: Record<string, string> = {
        materials: "Contribute Materials",
        testimony: "Share Memories",
        verify: "Verify a Profile",
        general: "General",
      };
      await expect(
        page.getByRole("button", { name: labels[intent], exact: true })
      ).toHaveClass(/border-burgundy/);
    });
  }

  test("an unknown intent falls back to the materials tab", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/contact?intent=nonsense");
    await expect(
      page.getByRole("button", { name: "Contribute Materials", exact: true })
    ).toHaveClass(/border-burgundy/);
  });
});

test.describe("consent and usage rights", () => {
  test("publishes the terms and links to each intake path", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/contribute/consent");

    await expect(
      page.getByRole("heading", { name: "What happens to what you send us" })
    ).toBeVisible();
    await expect(page.getByText("You keep copyright.", { exact: false })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Contribute Materials" })
    ).toHaveAttribute("href", "/contact?intent=materials");
    await expect(
      page.getByRole("link", { name: "Share Your Memories" })
    ).toHaveAttribute("href", "/contact?intent=testimony");
    await expect(
      page.getByRole("link", { name: "Verify a Profile" })
    ).toHaveAttribute("href", "/contact?intent=verify");
  });

  test("the consent notice on the form links to the terms", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/contact?intent=materials");
    await expect(
      page.getByRole("link", { name: "consent and usage rights" })
    ).toHaveAttribute("href", "/contribute/consent");
  });
});
