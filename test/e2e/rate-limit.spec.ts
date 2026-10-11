import { test, expect } from "@playwright/test";

// Proves the KV sliding-window limiter (src/lib/rate-limit.ts) engages:
// 10 posts from one IP succeed, the 11th is rejected with 429 + Retry-After.
// A unique x-forwarded-for per run keeps this isolated from other specs.
test("public writes throttle after the per-minute budget", async ({ request }) => {
  const ip = `10.9.9.${Math.floor(Math.random() * 200) + 1}`;
  const headers = { "x-forwarded-for": ip };
  let lastStatus = 0;
  for (let i = 0; i < 11; i++) {
    const res = await request.post("/api/leads", {
      headers,
      data: {
        email: `rl-${Date.now()}-${i}@lutterodt.org`,
        name: "Rate",
        message: "limit probe",
      },
    });
    lastStatus = res.status();
    if (i < 10) expect(res.status(), `post ${i}`).toBe(200);
  }
  expect(lastStatus).toBe(429);
  const retryAfter = await request
    .post("/api/leads", {
      headers,
      data: { email: "rl-final@lutterodt.org", name: "Rate", message: "x" },
    })
    .then((r) => r.headers()["retry-after"]);
  expect(Number(retryAfter)).toBeGreaterThanOrEqual(1);
});
