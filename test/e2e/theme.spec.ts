import { test, expect } from "./fixtures/site";

const LIGHT_CREST = 'header img[src="/logo/lutterodt-logo-200.webp"]';
const DARK_CREST =
  'header img[src="/logo/lutterodt-dark-black-01010A-800.webp"]';

function toggle(page: import("@playwright/test").Page) {
  return page.getByRole("button", { name: /Switch to (dark|light) theme/ }).first();
}

test.describe("theme and crest polarity", () => {
  test("defaults to light with exactly one crest visible", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
    await expect(page.locator(LIGHT_CREST)).toBeVisible();
    await expect(page.locator(DARK_CREST)).toBeHidden();
  });

  test("toggling to dark swaps to the dark crest and persists the choice", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    await toggle(page).click();

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(page.locator(DARK_CREST)).toBeVisible();
    await expect(page.locator(LIGHT_CREST)).toBeHidden();

    const stored = await page.evaluate(() => localStorage.getItem("theme"));
    expect(stored).toBe("dark");
  });

  test("exactly one crest is visible in dark mode", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");
    await toggle(page).click();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    const visible = await page.evaluate((selector) => {
      const nodes = Array.from(document.querySelectorAll(selector.replace("header ", "")));
      return nodes.filter((node) => {
        const style = window.getComputedStyle(node);
        return style.display !== "none" && style.visibility !== "hidden";
      }).length;
    }, LIGHT_CREST);

    expect(visible).toBe(1);
  });

  test("theme survives a full page reload", async ({ page, gotoSite }) => {
    await gotoSite("/");
    await toggle(page).click();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("header").first().waitFor({ state: "visible" });

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(page.locator(DARK_CREST)).toBeVisible();
  });

  test("honours the system dark preference on a first visit", async ({
    page,
    gotoSite,
  }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await gotoSite("/");

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(page.locator(DARK_CREST)).toBeVisible();
  });

  test("toggling back to light restores the light crest", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");

    await toggle(page).click();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    await toggle(page).click();
    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
    await expect(page.locator(LIGHT_CREST)).toBeVisible();
    await expect(page.locator(DARK_CREST)).toBeHidden();
  });
});
