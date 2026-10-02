import { test, expect } from "./fixtures/site";

test("reproduce offline fallback failure", async ({ page, gotoSite }) => {
  test.setTimeout(120_000);

  const reqs: string[] = [];
  page.on("requestfailed", (r) => reqs.push(`${r.method()} ${r.url()} :: ${r.failure()?.errorText}`));
  page.on("request", (r) => {
    if (r.url().includes("/terms") || r.url().includes("/offline")) reqs.push(`>> ${r.method()} ${r.url()}`);
  });

  await gotoSite("/");
  await page.waitForTimeout(1000);
  await page.goto("/offline", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  await page.context().setOffline(true);

  const response = await page.goto("/terms", { waitUntil: "domcontentloaded" });
  console.log("STATUS:", response?.status());
  console.log("URL:", page.url());
  await page.waitForTimeout(2000);

  const body = await page.evaluate(() => document.body.innerText.slice(0, 400));
  console.log("BODY TEXT:", JSON.stringify(body));
  const headings = await page.getByRole("heading").allTextContents();
  console.log("HEADINGS:", JSON.stringify(headings));
  console.log("REQUESTS:", JSON.stringify(reqs.slice(0, 30), null, 2));

  expect(response?.status()).toBe(200);
});