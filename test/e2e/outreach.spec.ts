import { test, expect } from "./fixtures/site";
import type { Page } from "@playwright/test";

const OUTREACH_ROUTES = [
  "/outreach",
  "/outreach/queue",
  "/outreach/discover",
  "/outreach/review",
  "/outreach/blind-spots",
];

const QUEUE_PAYLOAD = [
  {
    id: 1,
    profile_id: "ascan-lutteroth",
    name: "Ascan Lutteroth",
    status: "pending",
    scheduled_date: "2026-02-01",
    recipient_email: "",
    error: "",
    created_at: "2026-01-20",
  },
  {
    id: 2,
    profile_id: "georgina-lutterodt",
    name: "Georgina Lutterodt",
    status: "sent",
    scheduled_date: "2026-01-25",
    recipient_email: "g@example.com",
    error: "",
    created_at: "2026-01-18",
  },
];

const PROFILES_PAYLOAD = {
  profiles: [
    {
      id: "ascan-lutteroth",
      name: "Ascan Lutteroth",
      country: "Germany",
      category: "Historical",
      achievement: "Landscape painter of the Düsseldorf school",
      dob: "1842-10-05",
      bio: "German landscape painter.",
      letter_status: "none",
    },
  ],
};

const STATS_PAYLOAD = {
  total: 205,
  withLetters: 12,
  blindSpots: 18,
  queue: { pending: 4, sent: 8 },
  categories: [{ category: "historical", c: 51 }],
};

const DRAFTS_PAYLOAD = {
  drafts: [
    {
      id: 7,
      kind: "enrichment",
      profile_id: "ascan-lutteroth",
      name: "Ascan Lutteroth",
      claims_json: JSON.stringify([
        {
          field: "dob",
          value: "5 October 1842",
          sources: ["Deutsche Biographie", "Wikipedia"],
          confidence: "high",
        },
      ]),
      summary: "Date of birth confirmed",
      status: "draft",
      reviewed_by: "",
      reviewed_at: "",
      created_at: "2026-01-20",
    },
  ],
  counts: { draft: 1, approved: 3, rejected: 0 },
};

async function signInAsAdmin(page: Page) {
  await page.context().addCookies([
    {
      name: "admin_token",
      value: "e2e-admin-token",
      domain: "localhost",
      path: "/",
    },
  ]);
}

test.describe("outreach console access control", () => {
  for (const route of OUTREACH_ROUTES) {
    test(`${route} redirects an unauthenticated visitor to login`, async ({
      page,
    }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      await expect(page).toHaveURL(/\/login\?redirect=/, { timeout: 15_000 });
      await expect(
        page.getByRole("heading", { name: "Admin Login" })
      ).toBeVisible();
      await expect(page.getByText("Outreach Console")).toHaveCount(0);
    });
  }
});

test.describe("outreach console", () => {
  test("the dashboard renders pipeline statistics", async ({
    page,
    stubApi,
  }) => {
    await stubApi("**/api/outreach/stats", 200, STATS_PAYLOAD);
    await signInAsAdmin(page);

    await page.goto("/outreach", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { name: "Outreach Console" })
    ).toBeVisible();
    await expect(page.getByText("Total Profiles")).toBeVisible();
    await expect(page.getByText("205")).toBeVisible();
    await expect(page.getByText("Blind Spots", { exact: true })).toBeVisible();
  });

  test("the queue page lists profiles and queue counts", async ({
    page,
    stubApi,
  }) => {
    await stubApi("**/api/outreach/queue", 200, QUEUE_PAYLOAD);
    await stubApi("**/api/outreach/profiles*", 200, PROFILES_PAYLOAD);
    await signInAsAdmin(page);

    await page.goto("/outreach/queue", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { name: "Letter Queue" })
    ).toBeVisible();
    await expect(page.getByText("1 sent, 1 pending")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Profiles Ready for Letters (1)" })
    ).toBeVisible();
    await expect(page.getByText("Ascan Lutteroth").first()).toBeVisible();
    await expect(page.getByText("Germany · Historical")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Generate & Preview" })
    ).toBeVisible();
  });

  test("a generated letter is previewed and queued through the harness", async ({
    page,
    stubApi,
  }) => {
    await stubApi("**/api/outreach/queue", 200, QUEUE_PAYLOAD);
    await stubApi("**/api/outreach/profiles*", 200, PROFILES_PAYLOAD);
    await stubApi("**/api/outreach/generate", 200, {
      html: "<div class='page'><p>Dear Ascan,</p></div>",
    });
    await signInAsAdmin(page);

    await page.goto("/outreach/queue", { waitUntil: "domcontentloaded" });

    const generateRequest = page.waitForRequest((request) =>
      request.url().includes("/api/outreach/generate")
    );
    await page.getByRole("button", { name: "Generate & Preview" }).click();

    const request = await generateRequest;
    expect(request.method()).toBe("POST");
    expect(request.postDataJSON()).toMatchObject({
      name: "Ascan Lutteroth",
      country: "Germany",
    });

    await expect(page.getByText("Preview: Ascan Lutteroth")).toBeVisible();
    await expect(page.getByText("Dear Ascan,")).toBeVisible();

    const queueRequest = page.waitForRequest((r) =>
      r.url().includes("/api/outreach/queue") && r.method() === "POST"
    );
    await page.getByRole("button", { name: "Queue for Sending" }).click();

    const queued = await queueRequest;
    expect(queued.postDataJSON()).toMatchObject({
      profile_id: "ascan-lutteroth",
      name: "Ascan Lutteroth",
    });
  });

  test("letter preview HTML is not executed in the browser", async ({
    page,
    stubApi,
  }) => {
    await stubApi("**/api/outreach/queue", 200, QUEUE_PAYLOAD);
    await stubApi("**/api/outreach/profiles*", 200, PROFILES_PAYLOAD);
    await stubApi("**/api/outreach/generate", 200, {
      html: "<img src=x onerror=\"window.__letterXss = true\">",
    });
    await signInAsAdmin(page);

    await page.goto("/outreach/queue", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Generate & Preview" }).click();

    await expect(page.getByText("Preview: Ascan Lutteroth")).toBeVisible();
    await page.waitForTimeout(1500);
    const executed = await page.evaluate(() =>
      Boolean((window as unknown as { __letterXss?: boolean }).__letterXss)
    );
    expect(executed, "letter HTML must not execute script").toBe(false);
    await expect(page.locator(".letter-preview [onerror]")).toHaveCount(0);
    await expect(page.locator(".letter-preview script")).toHaveCount(0);
  });

  test("the review page refuses to approve without a reviewer name", async ({
    page,
    stubApi,
  }) => {
    await stubApi("**/api/outreach/drafts?status=draft", 200, DRAFTS_PAYLOAD);
    await signInAsAdmin(page);

    await page.goto("/outreach/review", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { name: "Research Review" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "draft (1)" })).toBeVisible();

    await page.getByText("Ascan Lutteroth").click();
    await expect(
      page.getByRole("button", { name: "Approve & Apply" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Approve & Apply" }).click();
    await expect(
      page.getByText("Enter your reviewer name first")
    ).toBeVisible();
  });

  test("approving a draft records the reviewer through the harness", async ({
    page,
    stubApi,
  }) => {
    await stubApi("**/api/outreach/drafts?status=draft", 200, DRAFTS_PAYLOAD);
    await stubApi("**/api/outreach/drafts", 200, {
      applied: [{ field: "dob" }],
      skipped: [],
    });
    await signInAsAdmin(page);

    await page.goto("/outreach/review", { waitUntil: "domcontentloaded" });

    await page.getByPlaceholder("Reviewer name").fill("Ama Lutterodt");
    await page.getByText("Ascan Lutteroth").click();

    const patchRequest = page.waitForRequest(
      (request) =>
        request.url().includes("/api/outreach/drafts") &&
        request.method() === "PATCH"
    );

    await page.getByRole("button", { name: "Approve & Apply" }).click();

    const request = await patchRequest;
    expect(request.postDataJSON()).toMatchObject({
      id: 7,
      action: "approve",
      reviewer: "Ama Lutterodt",
    });

    await expect(page.getByText("Draft #7 approved")).toBeVisible();
  });

  test("the review page shows each claim with its sources", async ({
    page,
    stubApi,
  }) => {
    await stubApi("**/api/outreach/drafts?status=draft", 200, DRAFTS_PAYLOAD);
    await signInAsAdmin(page);

    await page.goto("/outreach/review", { waitUntil: "domcontentloaded" });
    await page.getByText("Ascan Lutteroth").click();

    await expect(page.getByText("1 claim · Date of birth confirmed")).toBeVisible();
    await expect(page.getByText("5 October 1842")).toBeVisible();
    await expect(page.getByText("high")).toBeVisible();
    await expect(
      page.getByText("Sources (2): Deutsche Biographie · Wikipedia")
    ).toBeVisible();
  });

  test("discover reports a duplicate instead of adding the profile", async ({
    page,
    stubApi,
  }) => {
    await stubApi("**/api/outreach/profiles", 409, {
      message: "Possible duplicate found.",
      matches: [{ id: "ascan-lutteroth", name: "Ascan Lutteroth" }],
    });
    await signInAsAdmin(page);

    await page.goto("/outreach/discover", { waitUntil: "domcontentloaded" });

    await expect(
      page.getByRole("heading", { name: "Discover a Lutterodt" })
    ).toBeVisible();

    await page
      .locator('input[placeholder="e.g. Kwame Lutterodt"]')
      .fill("Kwame Lutterodt");
    await page
      .locator('textarea[placeholder="Describe what this Lutterodt does, their profession, accomplishments..."]')
      .fill("Architect in Accra.");
    await page.getByRole("button", { name: "Add to Database" }).click();

    await expect(page.getByText("Possible duplicate found.")).toBeVisible();
  });

  test("a new discovery is added through the harness", async ({
    page,
    stubApi,
  }) => {
    await stubApi("**/api/outreach/profiles", 200, {
      id: "kwame-lutterodt",
      name: "Kwame Lutterodt",
    });
    await signInAsAdmin(page);

    await page.goto("/outreach/discover", { waitUntil: "domcontentloaded" });

    const postRequest = page.waitForRequest(
      (request) =>
        request.url().includes("/api/outreach/profiles") &&
        request.method() === "POST"
    );

    await page
      .locator('input[placeholder="e.g. Kwame Lutterodt"]')
      .fill("Kwame Lutterodt");
    await page
      .locator('textarea[placeholder="Describe what this Lutterodt does, their profession, accomplishments..."]')
      .fill("Architect in Accra.");
    await page.getByRole("button", { name: "Add to Database" }).click();

    const request = await postRequest;
    expect(request.postDataJSON()).toMatchObject({
      name: "Kwame Lutterodt",
      achievement: "Architect in Accra.",
    });

    await expect(
      page.getByText("Added Kwame Lutterodt (kwame-lutterodt)")
    ).toBeVisible();
  });

  test("the console never calls the live send or daily endpoints", async ({
    page,
  }) => {
    await signInAsAdmin(page);
    await page.goto("/outreach", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: "Outreach Console" })
    ).toBeVisible();

    const statuses = await page.evaluate(async () => {
      const results: Record<string, number> = {};
      for (const path of ["/api/outreach/send", "/api/outreach/daily"]) {
        const response = await fetch(path, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "{}",
        });
        results[path] = response.status;
      }
      return results;
    });

    expect(statuses["/api/outreach/send"]).toBe(503);
    expect(statuses["/api/outreach/daily"]).toBe(503);
  });
});
