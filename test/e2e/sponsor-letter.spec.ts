import { test, expect } from "@playwright/test";
import { generateSponsorshipLetterHtml } from "../../src/lib/outreach/sponsor-letter";

const sponsor = {
  name: "Family Register",
  contactPerson: "Ama Lutterodt",
  email: "ama@example.com",
  organization: "The Lutterodt Family Trust",
};

test.describe("sponsorship letter", () => {
  test("does not promise institutions or assets that do not exist", () => {
    const html = generateSponsorshipLetterHtml(sponsor);

    for (const claim of [
      /Neo-Lutterodt Manor/i,
      /3D Digital Museum/i,
      /land acquisition/i,
      /construction of/i,
      /community programming/i,
      /naming rights/i,
    ]) {
      expect(html, `must not claim ${claim}`).not.toMatch(claim);
    }
  });

  test("does not publish cash tiers", () => {
    const html = generateSponsorshipLetterHtml(sponsor);

    for (const amount of [/\$10,000/, /\$5,000/, /\$1,000/, /\$\d[\d,]*\s*[-–—+]/]) {
      expect(html, `must not publish the amount ${amount}`).not.toMatch(amount);
    }
  });

  test("asks for the things only a family member can supply", () => {
    const html = generateSponsorshipLetterHtml(sponsor);

    expect(html).toMatch(/Archive materials/i);
    expect(html).toMatch(/Oral history/i);
    expect(html).toMatch(/Profile verification/i);
    expect(html).toMatch(/Introductions/i);
  });

  test("is internally consistent about the continent count", () => {
    const html = generateSponsorshipLetterHtml(sponsor);

    expect(html).not.toMatch(/Four Continents/i);
    expect(html).toMatch(/Six Continents/i);
    expect(html).toMatch(/6 continents/i);
  });

  test("escapes profile-controlled values", () => {
    const html = generateSponsorshipLetterHtml({
      ...sponsor,
      contactPerson: '<img src=x onerror="alert(1)">',
      organization: "<script>alert(2)</script>",
    });

    expect(html).not.toMatch(/<img src=x/i);
    expect(html).not.toMatch(/<script>alert/i);
    expect(html).toContain("&lt;img src=x");
    expect(html).toContain("&lt;script&gt;");
  });
});
