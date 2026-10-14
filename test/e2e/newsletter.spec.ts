import { test, expect } from "./fixtures/site";
// Rate-limit isolation: distinct egress IP per spec file so suites
// never share a throttle bucket.
test.use({ extraHTTPHeaders: { "x-forwarded-for": "10.21.0.16" } });

const EMAIL_FIELD = "#newsletter-email";
const CONSENT = "#newsletter-consent input[type='checkbox']";
const SUBSCRIBE = 'button:has-text("Subscribe")';
const SUCCESS = /check your inbox|check .*@.* for a confirmation link|almost there/i;

test.describe("footer newsletter double opt-in", () => {
  test("renders the quarterly copy, a labelled field and a consent checkbox", async ({
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
    await expect(page.locator(CONSENT)).toBeVisible();
    await expect(page.locator("#newsletter-consent")).toContainText(
      /quarterly archive bulletin/i
    );
  });

  test("subscribe stays disabled until consent is given", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    await expect(page.locator(SUBSCRIBE)).toBeDisabled();
    await page.locator(EMAIL_FIELD).fill("needs-consent@lutterodt.org");
    await expect(page.locator(SUBSCRIBE)).toBeDisabled();

    await page.locator(CONSENT).check();
    await expect(page.locator(SUBSCRIBE)).toBeEnabled();
  });

  test("a consented signup posts consent and asks for confirmation", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    let payload: Record<string, unknown> | null = null;
    await page.route("**/api/newsletter/subscribe", async (route) => {
      payload = route.request().postDataJSON();
      return route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          status: "pending",
          message: "Almost there — check family@lutterodt.org for a confirmation link.",
        }),
      });
    });

    await page.locator(EMAIL_FIELD).fill("family@lutterodt.org");
    await page.locator(CONSENT).check();
    await page.locator(SUBSCRIBE).click();

    await expect(page.getByRole("status")).toContainText(/confirmation link/i);
    expect(payload).toMatchObject({
      email: "family@lutterodt.org",
      consent: true,
    });
  });

  test("never claims a subscription before confirmation", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    await page.route("**/api/newsletter/subscribe", (route) =>
      route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          status: "pending",
          message: "Almost there — check family@lutterodt.org for a confirmation link.",
        }),
      })
    );

    await page.locator(EMAIL_FIELD).fill("family@lutterodt.org");
    await page.locator(CONSENT).check();
    await page.locator(SUBSCRIBE).click();

    // The old copy said "Subscribed. Welcome to the archive bulletin."
    // before anything was confirmed, which is the claim this guards against.
    await expect(page.getByText(/subscribed\. welcome/i)).toHaveCount(0);
    await expect(page.getByRole("status")).toContainText(SUCCESS);
  });

  test("the browser blocks a malformed address before any request", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    let called = false;
    await page.route("**/api/newsletter/subscribe", (route) => {
      called = true;
      return route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, status: "pending" }),
      });
    });

    await page.locator(EMAIL_FIELD).fill("not-an-email");
    await page.locator(CONSENT).check();
    await page.locator(SUBSCRIBE).click();

    expect(called).toBe(false);
  });

  test("a server rejection surfaces the reason and keeps the address", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    await page.route("**/api/newsletter/subscribe", (route) =>
      route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({
          error: "We could not send the confirmation email. Please try again.",
        }),
      })
    );

    const field = page.locator(EMAIL_FIELD);
    await field.fill("fail@lutterodt.org");
    await page.locator(CONSENT).check();
    await page.locator(SUBSCRIBE).click();

    await expect(page.locator("footer [role='alert']")).toContainText(
      /could not send the confirmation/i
    );
    await expect(field).toHaveValue("fail@lutterodt.org");
  });

  test("a network failure never shows a false confirmation", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    await page.route("**/api/newsletter/subscribe", (route) => route.abort("failed"));

    await page.locator(EMAIL_FIELD).fill("offline@lutterodt.org");
    await page.locator(CONSENT).check();
    await page.locator(SUBSCRIBE).click();

    await expect(page.locator("footer [role='alert']")).toContainText(/network error/i);
    await expect(page.getByRole("status")).toHaveCount(0);
  });

  test("a successful signup clears the field and the consent box", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    await page.route("**/api/newsletter/subscribe", (route) =>
      route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, status: "pending", message: "Check your inbox." }),
      })
    );

    await page.locator(EMAIL_FIELD).fill("clear-me@lutterodt.org");
    await page.locator(CONSENT).check();
    await page.locator(SUBSCRIBE).click();

    await expect(page.getByRole("status")).toBeVisible();
    await expect(page.locator(EMAIL_FIELD)).toHaveValue("");
    await expect(page.locator(CONSENT)).not.toBeChecked();
  });
});

test.describe("newsletter opt-in endpoints", () => {
  test("rejects a subscription without consent", async ({ request }) => {
    const res = await request.post("/api/newsletter/subscribe", {
      data: { email: "no-consent@lutterodt.org" },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects a malformed address", async ({ request }) => {
    const res = await request.post("/api/newsletter/subscribe", {
      data: { email: "nope", consent: true },
    });
    expect(res.status()).toBe(400);
  });

  test("does not confirm from a bare token GET, so scanners cannot opt in", async ({
    request,
  }) => {
    const res = await request.get("/api/newsletter/confirm?token=abcdefghijklmnop");
    expect(res.status()).toBe(202);
    const body = (await res.json()) as { applied?: boolean };
    expect(body.applied).toBe(false);
  });

  test("rejects an unknown confirmation token", async ({ request }) => {
    const res = await request.get(
      "/api/newsletter/confirm?token=doesnotexistatall&apply=1"
    );
    expect(res.status()).toBe(400);
  });

  test("rejects a missing token on both endpoints", async ({ request }) => {
    expect((await request.get("/api/newsletter/confirm")).status()).toBe(400);
    expect((await request.get("/api/newsletter/unsubscribe")).status()).toBe(400);
  });

  test("an unknown unsubscribe token 404s rather than erroring", async ({
    request,
  }) => {
    const res = await request.get(
      "/api/newsletter/unsubscribe?token=doesnotexistatall"
    );
    expect(res.status()).toBe(404);
  });

  test("the confirm and unsubscribe pages render", async ({ page }) => {
    for (const path of ["/newsletter/confirm", "/newsletter/unsubscribe"]) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `status for ${path}`).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("a tokenless confirm page explains the problem instead of failing", async ({
    page,
  }) => {
    await page.goto("/newsletter/confirm", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: "This link is incomplete" })
    ).toBeVisible();
  });

  test("full lifecycle: subscribe, confirm, unsubscribe against the real store", async ({
    request,
  }) => {
    const email = `flow-${Date.now()}@lutterodt.org`;

    const subscribe = await request.post("/api/newsletter/subscribe", {
      data: { email, name: "Flow", consent: true },
    });
    expect(subscribe.status()).toBe(202);
    const sub = (await subscribe.json()) as {
      delivery?: string;
      confirmToken?: string;
      unsubscribeToken?: string;
      message?: string;
    };
    // No RESEND_API_KEY locally, so a dry run surfaces the tokens for the loop.
    expect(sub.delivery).toBe("dry-run");
    expect(sub.confirmToken).toBeTruthy();
    expect(sub.unsubscribeToken).toBeTruthy();
    expect(sub.message).toContain("confirmation link");

    const pending = await (await request.get("/api/newsletter/subscribe")).json() as {
      pending: number;
      confirmed: number;
    };
    const before = pending.confirmed;

    const confirm = await request.get(
      `/api/newsletter/confirm?token=${sub.confirmToken}&apply=1`
    );
    expect(confirm.status()).toBe(200);
    expect(((await confirm.json()) as { status?: string }).status).toBe("confirmed");

    const after = await (await request.get("/api/newsletter/subscribe")).json() as {
      confirmed: number;
    };
    expect(after.confirmed).toBe(before + 1);

    const again = await request.get(
      `/api/newsletter/confirm?token=${sub.confirmToken}&apply=1`
    );
    expect(again.status()).toBe(400);

    const unsub = await request.get(
      `/api/newsletter/unsubscribe?token=${sub.unsubscribeToken}`
    );
    expect(unsub.status()).toBe(200);
    expect(((await unsub.json()) as { status?: string }).status).toBe("unsubscribed");

    const done = await (await request.get("/api/newsletter/subscribe")).json() as {
      confirmed: number;
      unsubscribed: number;
    };
    expect(done.confirmed).toBe(after.confirmed - 1);
    expect(done.unsubscribed).toBeGreaterThan(0);
  });
});
