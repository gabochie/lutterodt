import { test, expect } from "@playwright/test";

// Proves the KV sliding-window limiter (src/lib/rate-limit.ts) engages:
// 10 posts from one IP succeed, a follow-up is rejected with 429 +
// Retry-After. A unique x-forwarded-for per run keeps this isolated from
// other specs. Tolerant of one fixed-window boundary crossing mid-run.
test("public writes throttle after the per-minute budget", async ({ request }) => {
  const ip = `10.9.9.${Math.floor(Math.random() * 200) + 1}`;
  const headers = { "x-forwarded-for": ip };
  const post = () =>
    request.post("/api/leads", {
      headers,
      data: {
        email: `rl-${Date.now()}-${Math.random().toString(36).slice(2)}@lutterodt.org`,
        name: "Rate",
        message: "limit probe",
      },
    });
  for (let i = 0; i < 10; i++) {
    expect((await post()).status(), `post ${i}`).toBe(200);
  }
  let throttled = false;
  let retryAfter: string | null = null;
  for (let i = 0; i < 5; i++) {
    const res = await post();
    if (res.status() === 429) {
      throttled = true;
      retryAfter = res.headers()["retry-after"] ?? null;
      break;
    }
  }
  expect(throttled).toBe(true);
  expect(Number(retryAfter)).toBeGreaterThanOrEqual(1);
});
