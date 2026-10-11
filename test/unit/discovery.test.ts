import { describe, expect, it } from "vitest";
import {
  estimateCategory,
  estimateCountry,
  extractName,
  normalizeCountry,
} from "@/lib/outreach/discovery";

describe("estimateCategory", () => {
  it("scores keyword matches", () => {
    expect(estimateCategory("Staff surgeon at the city hospital")).toBe("healthcare");
    expect(estimateCategory("CEO and founder of a fintech startup")).toBe("business");
    expect(estimateCategory("family picnic photos")).toBe("uncategorized");
  });
});

describe("estimateCountry", () => {
  it("matches domains and place names", () => {
    expect(estimateCountry("news from Accra", "https://example.com/x")).toBe("Ghana");
    expect(estimateCountry("London office", "https://example.co.uk/y")).toBe(
      "United Kingdom"
    );
    expect(estimateCountry("nothing recognizable", "https://example.net/")).toBe("");
  });
});

describe("normalizeCountry", () => {
  it("maps legacy variants to canonical codes", () => {
    expect(normalizeCountry("United Kingdom")).toBe("UK");
    expect(normalizeCountry("United States")).toBe("USA");
    expect(normalizeCountry("Ghana")).toBe("Ghana");
  });
});

describe("extractName", () => {
  it("pulls a full name preceding the family surname", () => {
    expect(extractName("Kwame Lutterodt | Engineer", "works in Accra")).toContain(
      "Lutterodt"
    );
    expect(extractName("Random article", "nothing relevant here")).toBe("");
  });
});
