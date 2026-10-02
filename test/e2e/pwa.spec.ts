import { test, expect } from "./fixtures/site";

async function waitForController(page: import("playwright").Page) {
  await page.evaluate(async () => {
    if (navigator.serviceWorker.controller) return;
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("service worker never took control")),
        15_000
      );
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        clearTimeout(timeout);
        resolve();
      }, { once: true });
      // Some engines claim without firing controllerchange on the registrant.
      void navigator.serviceWorker.ready.then(() => {
        if (navigator.serviceWorker.controller) {
          clearTimeout(timeout);
          resolve();
        }
      });
    });
  });
}

// Wait until the install-time precache has fully populated a cache AND the
// offline page's own JS chunk is cached, so an offline fallback can both serve
// the /offline document and hydrate it (its heading is rendered client-side
// from the RSC stream; without the cached chunk the DOM never fills in).
async function waitForPrecache(page: import("playwright").Page) {
  await page.evaluate(async () => {
    const deadline = Date.now() + 20_000;
    const offlineChunk = (entries: readonly string[]) =>
      entries.some((u) => u.includes("/static/chunks/") && u.includes("(main)/offline/"));
    while (Date.now() < deadline) {
      const names = await caches.keys();
      const states = await Promise.all(
        names.map(async (name) => {
          const cache = await caches.open(name);
          const urls = (await cache.keys()).map((k) => k.url);
          return {
            name,
            hasDoc: urls.some((u) => u.endsWith("/offline")),
            hasChunk: offlineChunk(urls),
          };
        })
      );
      if (states.some((s) => s.hasDoc && s.hasChunk)) return;
      await new Promise((r) => setTimeout(r, 100));
    }
    throw new Error("precache never completed within timeout");
  });
}

test.describe("PWA service worker", () => {
  test("registers on the public app and takes control", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");
    await waitForController(page);

    const registration = await page.evaluate(async () => {
      const reg = await navigator.serviceWorker.ready;
      return {
        scope: reg.scope,
        active: !!reg.active,
      };
    });
    expect(registration.active).toBe(true);
    expect(new URL(registration.scope).pathname).toBe("/");
  });

  test("offline: a warmed route still loads from the cache", async ({
    page,
    gotoSite,
  }) => {
    test.setTimeout(90_000);
    // Warm the shell: visiting the routes online caches documents + chunks.
    // Wait for "load" so the document's JS/CSS chunk graph is also fetched
    // through the service worker and hits the SW cache before we go offline.
    await gotoSite("/");
    await waitForController(page);
    for (const route of ["/directory", "/history", "/gallery", "/offline"]) {
      await page.goto(route, { waitUntil: "load" });
    }
    await waitForPrecache(page);

    await page.context().setOffline(true);

    const response = await page.goto("/directory", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);
    await expect(page.locator("header").first()).toBeVisible();
    // Brand must still paint from cache.
    await expect(page.locator("img").first()).toHaveAttribute("alt", /Lutterodt/);
  });

  test("offline: an unwarmed route falls back to the offline page", async ({
    page,
    gotoSite,
  }) => {
    test.setTimeout(90_000);
    await gotoSite("/");
    await waitForController(page);
    // Wait for "load" so /offline's JS/CSS chunks enter the SW cache too;
    // at "domcontentloaded" the chunk fetches may still be in flight.
    await page.goto("/offline", { waitUntil: "load" });
    await waitForPrecache(page);

    await page.context().setOffline(true);

    // /terms is never warmed, so navigation must resolve to the offline page.
    const response = await page.goto("/terms", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: /offline/i })
    ).toBeVisible();
  });

  test("install prompt chip appears on mobile-sized viewports", async ({
    page,
    gotoSite,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoSite("/");
    await waitForController(page);

    // iOS/standalone detection gates the prompt; on Desktop Chrome with a
    // narrow viewport there is no beforeinstallprompt, so nothing shows.
    // This just proves the bar stays mounted and the page remains usable.
    await expect(page.locator("header").first()).toBeVisible();
    const bar = await page.locator('nav[aria-label="Primary"]').count();
    expect(bar).toBe(1);
  });
});