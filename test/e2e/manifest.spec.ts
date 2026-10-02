import { test, expect } from "./fixtures/site";

test.describe("PWA manifest", () => {
  test("serves a valid manifest with standalone display and an id", async ({
    page,
  }) => {
    const response = await page.request.get("/manifest.webmanifest");
    expect(response.status()).toBe(200);

    const manifest = await response.json();
    expect(manifest).toBeTruthy();
    expect(manifest.id).toBe("/");
    expect(manifest.name).toContain("Lutterodt");
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/");
    expect(manifest.theme_color).toBeTruthy();
  });

  test("advertises any, maskable and apple touch icons", async ({ page }) => {
    const response = await page.request.get("/manifest.webmanifest");
    const manifest = await response.json();

    type ManifestIcon = {
      src?: string;
      sizes?: string;
      type?: string;
      purpose?: string;
    };
    const icons: ManifestIcon[] = manifest.icons ?? [];

    const purposes = icons.map((icon) => icon.purpose ?? "any");
    expect(purposes).toContain("any");
    expect(purposes).toContain("maskable");

    const sizes = icons.map((icon) => icon.sizes ?? "");
    expect(sizes.join(" ")).toContain("192x192");
    expect(sizes.join(" ")).toContain("512x512");

    const srcs = icons.map((icon) => icon.src ?? "");
    expect(srcs).toContain("/apple-touch-icon.png");
  });

  test("serves the service worker as javascript", async ({ page }) => {
    const response = await page.request.get("/sw.js");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("javascript");
  });
});