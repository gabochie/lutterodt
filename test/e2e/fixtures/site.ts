import { test as base, expect, type Page } from "@playwright/test";

const PROD_HOST = "lutterodt.org";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const PASSTHROUGH_MUTATIONS = new Set(["/api/login"]);

const BLOCKED_SEND_PATHS = [
  "/api/outreach/send",
  "/api/outreach/daily",
  "/api/outreach/discover",
];

type SiteFixtures = {
  gotoSite: (path: string) => Promise<void>;
  stubApi: (matcher: string | RegExp, status: number, body: unknown) => Promise<void>;
};

function isLocalRun(baseURL: string | undefined): boolean {
  return !baseURL || !baseURL.includes(PROD_HOST);
}

export const test = base.extend<SiteFixtures>({
  page: async ({ page, baseURL }, use) => {
    if (isLocalRun(baseURL)) {
      await page.route(/^https:\/\/lutterodt\.org\/.*/, (route) => route.abort());

      await page.route("**/api/**", async (route) => {
        const request = route.request();
        const path = new URL(request.url()).pathname;
        const method = request.method().toUpperCase();

        if (path === "/api/settings") {
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ coming_soon: false }),
          });
        }

        if (BLOCKED_SEND_PATHS.some((blocked) => path.startsWith(blocked))) {
          return route.fulfill({
            status: 503,
            contentType: "application/json",
            body: JSON.stringify({ error: "Outreach send path disabled in tests" }),
          });
        }

        if (
          MUTATING_METHODS.has(method) &&
          !PASSTHROUGH_MUTATIONS.has(path)
        ) {
          return route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ ok: true }),
          });
        }

        return route.continue();
      });
    }

    await use(page);
  },

  gotoSite: async ({ page }, use) => {
    await use(async (path: string) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.locator("header").first().waitFor({
        state: "visible",
        timeout: 20_000,
      });
    });
  },

  stubApi: async ({ page }, use) => {
    await use(async (matcher, status, body) => {
      await page.route(matcher, (route) =>
        route.fulfill({
          status,
          contentType: "application/json",
          body: JSON.stringify(body),
        })
      );
    });
  },
});

export type CapturedPost = {
  url: string;
  contentType: string;
  raw: string | null;
  json: Record<string, unknown> | null;
};

export async function capturePost(
  page: Page,
  urlPart: string
): Promise<CapturedPost> {
  const request = await page.waitForRequest(
    (candidate) =>
      candidate.method() === "POST" && candidate.url().includes(urlPart)
  );
  const raw = request.postData();
  let json: Record<string, unknown> | null = null;
  try {
    const parsed = request.postDataJSON();
    if (parsed && typeof parsed === "object") {
      json = parsed as Record<string, unknown>;
    }
  } catch {
    json = null;
  }
  return {
    url: request.url(),
    contentType: request.headers()["content-type"] ?? "",
    raw,
    json,
  };
}

export { expect };
export type { Page };
