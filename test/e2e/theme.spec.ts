import { test, expect } from "./fixtures/site";

const CREST = 'header img[src="/logo/lutterodt-crest-200.webp"]';

function toggle(page: import("@playwright/test").Page) {
  return page.getByRole("button", { name: /Switch to (dark|light) theme/ }).first();
}

test.describe("theme and crest polarity", () => {
  test("defaults to light with the crest visible", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
    await expect(page.locator(CREST)).toBeVisible();
  });

  test("the crest stays visible in dark mode and the choice persists", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    await toggle(page).click();

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(page.locator(CREST)).toBeVisible();

    const stored = await page.evaluate(() => localStorage.getItem("theme"));
    expect(stored).toBe("dark");
  });

  test("the crest is not clipped or hidden in dark mode", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");
    await toggle(page).click();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    const box = await page.locator(CREST).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);

    const hidden = await page.evaluate(() => {
      const node = document.querySelector<HTMLElement>(
        'header img[src="/logo/lutterodt-crest-200.webp"]'
      );
      if (!node) return true;
      const style = window.getComputedStyle(node);
      return (
        style.display === "none" ||
        style.visibility === "hidden" ||
        Number(style.opacity) === 0
      );
    });

    expect(hidden).toBe(false);
  });

  test("theme survives a full page reload", async ({ page, gotoSite }) => {
    await gotoSite("/");
    await toggle(page).click();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("header").first().waitFor({ state: "visible" });

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(page.locator(CREST)).toBeVisible();
  });

  test("honours the system dark preference on a first visit", async ({
    page,
    gotoSite,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await gotoSite("/");

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(page.locator(CREST)).toBeVisible();
  });

  test("toggling back to light keeps the crest visible", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    await toggle(page).click();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    await toggle(page).click();
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
    await expect(page.locator(CREST)).toBeVisible();
  });
});
