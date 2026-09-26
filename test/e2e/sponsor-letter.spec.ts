import { test, expect } from "./fixtures/site";
import { generateSponsorshipLetterHtml } from "../../src/lib/outreach/sponsor-letter";

const baseSponsor = {
  name: "Acme Heritage Trust",
  contactPerson: "Ama Mensah",
  email: "ama@example.com",
};

test.describe("sponsorship letter honesty", () => {
  test("promises no institution that does not exist", () => {
    const html = generateSponsorshipLetterHtml(baseSponsor);

    expect(html).not.toMatch(/3D Digital Museum/i);
    expect(html).not.toMatch(/Neo-?Lutterodt Manor|Neo-Manor/i);
    expect(html).not.toMatch(/land acquisition/i);
    expect(html).not.toMatch(/when built/i);
    expect(html).not.toMatch(/community programming/i);
  });

  test("quotes no cash tiers or fixed amounts", () => {
    const html = generateSponsorshipLetterHtml(baseSponsor);

    expect(html).not.toMatch(/\$\d/);
    expect(html).not.toMatch(/Sponsorship Tiers/i);
    expect(html).toMatch(/no tiers and no minimum/i);
  });

  test("asks for the in-kind contributions the archive is actually short of", () => {
    const html = generateSponsorshipLetterHtml(baseSponsor);

    for (const label of [
      "Archive materials",
      "Profile verification",
      "Oral history",
      "Introductions",
      "Professional services",
    ]) {
      expect(html, `missing ask: ${label}`).toContain(label);
    }
  });

  test("escapes interpolated recipient and organisation fields", () => {
    const html = generateSponsorshipLetterHtml({
      ...baseSponsor,
      contactPerson: '<img src=x onerror="alert(1)">',
      organization: "<script>alert(2)</script>",
    });

    expect(html).not.toContain("<img");
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&lt;img");
    expect(html).toContain("&lt;script&gt;");
  });

  test("keeps the continent count consistent with the body", () => {
    const html = generateSponsorshipLetterHtml(baseSponsor);

    expect(html).toMatch(/Six Continents/);
    expect(html).toMatch(/6 continents<\/strong>/);
    expect(html).not.toMatch(/Four Continents/);
  });
});
