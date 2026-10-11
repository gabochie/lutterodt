import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Automated accessibility floor: no critical/serious violations on the
// highest-traffic public pages. Human review still owns the admin console.
const PAGES = ["/", "/contact", "/directory", "/takedown", "/privacy"];

test.describe("accessibility baseline", () => {
  for (const path of PAGES) {
    test(`${path} has no critical accessibility violations`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      const blocking = results.violations.filter((v) =>
        ["critical", "serious"].includes(v.impact || "")
      );
      expect(
        blocking.map((v) => `${v.id}: ${v.nodes.length} node(s)`),
        `axe violations on ${path}`
      ).toEqual([]);
    });
  }
});
