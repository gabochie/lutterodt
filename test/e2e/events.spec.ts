import { test, expect, type Page } from "./fixtures/site";

async function expiredLiveCopy(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const patterns = [
      /happening now/i,
      /live now/i,
      /watch live from/i,
      /real-time check-?ins/i,
      /check back during the reunion/i,
    ];
    const hits: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const text = (node.textContent || "").trim();
      if (text && patterns.some((p) => p.test(text))) hits.push(text);
      node = walker.nextNode();
    }
    return hits;
  });
}

test.describe("expired event messaging", () => {
  test("the homepage no longer advertises the reunion as live", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");
    expect(await expiredLiveCopy(page)).toEqual([]);

    const pulsing = page.locator("span,div", {
      hasText: /^\s*Live\s*$/,
    });
    const count = await pulsing.count();
    for (let i = 0; i < count; i += 1) {
      const cls = (await pulsing.nth(i).getAttribute("class")) || "";
      expect(cls, "no element styled as a pulsing live badge").not.toMatch(
        /animate-pulse/
      );
    }
  });

  test("the homepage presents London as the next gathering", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");
    await expect(
      page.getByText("Diaspora Branch Reunion").first()
    ).toBeVisible();
    await expect(
      page.getByText("Next — 2 October 2026 · London").first()
    ).toBeVisible();
  });

  test("the past gatherings are labelled as past, not upcoming", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/");
    await expect(page.getByText("Past — Recap").first()).toBeVisible();
    await expect(
      page.getByText("Upcoming — Events", { exact: true })
    ).toHaveCount(0);
  });

  test("/reunion-2026 is framed as a record of a finished event", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/reunion-2026");
    expect(await expiredLiveCopy(page)).toEqual([]);

    await expect(
      page.getByRole("heading", { name: "What happened in Copenhagen" })
    ).toBeVisible();
    await expect(page.getByText("Recap", { exact: true }).first()).toBeVisible();
  });

  test("/reunion-2026 points forward to contributing memories", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/reunion-2026");
    await expect(
      page.getByRole("link", { name: "Share Your Memories" })
    ).toHaveAttribute("href", "/contact?intent=testimony");
  });

  test("/live is framed as the reunion record", async ({ page, gotoSite }) => {
    await gotoSite("/live");
    expect(await expiredLiveCopy(page)).toEqual([]);
    await expect(
      page.getByRole("heading", { name: "Who was there" })
    ).toBeVisible();
  });

  test("the contact sidebar shows the next gathering, not a finished one", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/contact");
    await expect(page.getByText("Next gathering")).toBeVisible();
    await expect(
      page.getByText("2 October 2026 · London")
    ).toBeVisible();
    await expect(page.getByText("Reunion happening now")).toHaveCount(0);
  });
});

test.describe("sponsor page alignment", () => {
  test("contribution calls to action carry their intent", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/sponsor");
    await expect(
      page.getByRole("link", { name: "Contribute Materials" }).first()
    ).toHaveAttribute("href", "/contact?intent=materials");
    await expect(
      page.getByRole("link", { name: "Verify a Profile" }).first()
    ).toHaveAttribute("href", "/contact?intent=verify");
  });

  test("no unbuilt institution is promised as a use of funds", async ({
    page,
    gotoSite,
  }) => {
    await gotoSite("/sponsor");
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/community programming/i);
  });
});
