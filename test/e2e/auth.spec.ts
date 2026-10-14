import { test, expect } from "./fixtures/site";
// Rate-limit isolation: distinct egress IP per spec file so suites
// never share a throttle bucket.
test.use({ extraHTTPHeaders: { "x-forwarded-for": "10.21.0.12" } });

test.describe("outreach API authentication", () => {
  test("rejects a request with no credentials", async ({ request }) => {
    const response = await request.get("/api/outreach/health");

    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  test("rejects an empty bearer token", async ({ request }) => {
    const response = await request.get("/api/outreach/health", {
      headers: { Authorization: "Bearer " },
    });

    expect(response.status()).toBe(401);
  });

  test("rejects a bogus bearer token", async ({ request }) => {
    const response = await request.get("/api/outreach/health", {
      headers: { Authorization: "Bearer definitely-not-the-cron-secret" },
    });

    expect(response.status()).toBe(401);
  });
});

test.describe("admin login", () => {
  test("rejects the legacy default password", async ({ request }) => {
    const response = await request.post("/api/login", {
      form: { email: "admin@lutterodt.org", password: "admin" },
      maxRedirects: 0,
    });

    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).toContain(
      "error=Invalid+credentials"
    );
  });

  test("rejects a wrong password", async ({ request }) => {
    const response = await request.post("/api/login", {
      form: { email: "admin@lutterodt.org", password: "wrong-password-here" },
      maxRedirects: 0,
    });

    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).toContain(
      "error=Invalid+credentials"
    );
  });

  test("accepts the configured password and issues a session", async ({
    request,
  }) => {
    const response = await request.post("/api/login", {
      form: {
        email: "admin@lutterodt.org",
        password: "e2e-local-admin-password",
      },
      maxRedirects: 0,
    });

    expect(response.status()).toBe(307);
    expect(response.headers()["location"]).not.toContain("error");
    expect(response.headers()["set-cookie"]).toContain("admin_token");
  });
});
