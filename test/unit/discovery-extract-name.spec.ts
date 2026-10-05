import { test, expect } from "@playwright/test";

import { extractName, isPersonName } from "../../src/lib/outreach/discovery";

// Every title below is a real Brave result seen during pipeline runs, either
// producing a correct profile or producing junk. A regression here means the
// directory silently accumulates non-person entries.
const CASES: { title: string; snippet: string; expected: string }[] = [
  // Real people.
  { title: "Bettina Lutterodt - LinkedIn", snippet: "Proprietor at Aragon House Peterborough", expected: "Bettina Lutterodt" },
  { title: "Dr. Georgina Lutterodt - Ghana News", snippet: "Former ambassador", expected: "Georgina Lutterodt" },
  { title: "Jan van Lutterodt (@jan) / Twitter", snippet: "Profile", expected: "Jan van Lutterodt" },
  { title: "Ascan Lutteroth - Wikipedia", snippet: "German landscape painter", expected: "Ascan Lutteroth" },
  { title: "Cyril Lutterodt - Forbes 30 Under 30", snippet: "Venture capital", expected: "Cyril Lutterodt" },
  { title: "Isabelle Lutterodt", snippet: "Senior Producer at Major LCM", expected: "Isabelle Lutterodt" },
  { title: "Gerrard Samuel Lutterodt", snippet: "Infosec practitioner", expected: "Gerrard Samuel Lutterodt" },
  { title: "Frederick G. C. Lutterodt", snippet: "Archivist", expected: "Frederick G. C. Lutterodt" },
  { title: "George A. G. Lutterodt", snippet: "Photographer", expected: "George A. G. Lutterodt" },
  { title: "Nicholas Haldane-Lutterodt", snippet: "Doctor", expected: "Nicholas Haldane-Lutterodt" },
  { title: "Mailis Meier-Lutterodt", snippet: "Estonia", expected: "Mailis Meier-Lutterodt" },

  // Junk that must never become a profile.
  { title: "Lutterodt-Quarcoo family history", snippet: "Genealogy", expected: "" },
  { title: "Meaning of the surname Lutterodt | Geneanet", snippet: "Discover the origin", expected: "" },
  { title: "Lutterodt Name Meaning, Family History, Family Crest", snippet: "History", expected: "" },
  { title: "Wikimedia Commons: Category:Lutterodt", snippet: "Media", expected: "" },
  { title: "Lutterodt photographers - Flickr", snippet: "Photos", expected: "" },
  { title: "What Does The Name Lutterodt Mean?", snippet: "Name meaning", expected: "" },
  { title: "_photo_placeholder", snippet: "image", expected: "" },
  { title: "lutterodt.com", snippet: "domain", expected: "" },
  { title: "People in the UK with the name Lutterodt", snippet: "Given name", expected: "" },
  { title: "Police disclose why Counsellor Lutterodt", snippet: "Crime", expected: "" },
  { title: "Lutterodt arrested", snippet: "Accra court", expected: "" },
  { title: "Lutterodt first", snippet: "team news", expected: "" },
];

test.describe("discovery.extractName", () => {
  for (const { title, snippet, expected } of CASES) {
    test(`extracts ${JSON.stringify(expected)} from ${JSON.stringify(title)}`, () => {
      expect(extractName(title, snippet)).toBe(expected);
    });
  }

  test("does not splice a name across the title/snippet boundary", () => {
    // The surname ends the title and a capitalised word opens the snippet.
    // Matching on "${title} ${snippet}" invented the person "Lutterodt Crime".
    expect(extractName("Police disclose why Counsellor Lutterodt", "Crime Update")).toBe("");
  });
});

test.describe("discovery.isPersonName", () => {
  const junk = [
    "Lutterodt Family",
    "Lutterodt Name",
    "Lutterodt Surname",
    "Lutterodt and",
    "Lutterodt photographers",
    "Meaning of the surname Lutterodt",
    "Wikimedia Commons Lutterodt",
    "What Does The Name Lutterodt",
    "Counsellor Lutterodt",
    "Ambassador Lutterodt",
    "Artists Christopher Lutterodt",
    "people in the UK with the name Lutterodt",
    "lutterodt.com",
    "lutterodt's group>",
    "lutterodt MD",
  ];

  for (const name of junk) {
    test(`rejects ${JSON.stringify(name)}`, () => {
      expect(isPersonName(name)).toBe(false);
    });
  }

  const people = [
    "Bettina Lutterodt",
    "Ascan Lutteroth",
    "Jan van Lutterodt",
    "Frederick G. C. Lutterodt",
    "George A. G. Lutterodt",
    "Gerrard Samuel Lutterodt",
    "Nicholas Haldane-Lutterodt",
    "Mailis Meier-Lutterodt",
    "Georgina T. Wood",
    "fredricka lutterodt",
  ];

  for (const name of people) {
    test(`accepts ${JSON.stringify(name)}`, () => {
      expect(isPersonName(name)).toBe(true);
    });
  }
});