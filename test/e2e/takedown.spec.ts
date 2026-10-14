import { test, expect } from "@playwright/test";
// Rate-limit isolation: distinct egress IP per spec file so suites
// never share a throttle bucket.
test.use({ extraHTTPHeaders: { "x-forwarded-for": "10.21.0.18" } });

// Data-subject intake: identical responses regardless of outcome (no oracle),
// validation enforced, committee draft filed.
test("takedown requests are accepted without leaking directory state", async ({
  request,
}) => {
  const body = {
    name: "Test Requester",
    email: "requester@lutterodt.org",
    profile_name: "Nobody Real Lutterodt",
    kind: "removal",
    details: "This listing should not exist, please remove it entirely.",
  };
  const first = await request.post("/api/takedown", { data: body });
  expect(first.status()).toBe(202);
  const firstJson = (await first.json()) as { message?: string };
  expect(firstJson.message).toContain("14 days");

  const second = await request.post("/api/takedown", { data: body });
  expect(second.status()).toBe(202);
  expect(await second.json()).toEqual(await first.json());

  const invalid = await request.post("/api/takedown", {
    data: { ...body, details: "short" },
  });
  expect(invalid.status()).toBe(400);
});

test("takedown page renders the request form", async ({ page }) => {
  await page.goto("/takedown", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: "Correct or remove a listing" })
  ).toBeVisible();
});
