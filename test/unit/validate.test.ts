import { describe, expect, it } from "vitest";
import {
  leadSchema,
  parseBody,
  profileCreateSchema,
  profilePatchSchema,
  registerSchema,
  subscribeSchema,
  takedownSchema,
} from "@/lib/validate";

describe("registerSchema", () => {
  it("accepts a valid enquiry and trims + lowercases email", () => {
    const r = parseBody(registerSchema, {
      name: "  Ama  ",
      email: "AMA@Example.COM",
      message: "hello",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.name).toBe("Ama");
      expect(r.data.email).toBe("ama@example.com");
    }
  });

  it("rejects bad email and overlong names", () => {
    expect(parseBody(registerSchema, { name: "A", email: "nope" }).ok).toBe(false);
    expect(
      parseBody(registerSchema, { name: "x".repeat(121), email: "a@b.co" }).ok
    ).toBe(false);
  });
});

describe("subscribeSchema", () => {
  it("requires explicit consent", () => {
    expect(
      parseBody(subscribeSchema, { email: "a@b.co", consent: false }).ok
    ).toBe(false);
    expect(parseBody(subscribeSchema, { email: "a@b.co", consent: true }).ok).toBe(
      true
    );
  });
});

describe("leadSchema", () => {
  it("keeps name optional but caps everything", () => {
    const r = parseBody(leadSchema, { email: "a@b.co", message: "x".repeat(2001) });
    expect(r.ok).toBe(false);
    const ok = parseBody(leadSchema, { email: "a@b.co" });
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.data.name).toBe("");
  });
});

describe("profileCreateSchema", () => {
  it("requires a 2+ char name, defaults the rest", () => {
    expect(parseBody(profileCreateSchema, { name: "A" }).ok).toBe(false);
    const r = parseBody(profileCreateSchema, { name: "Kwame Lutterodt" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.category).toBe("uncategorized");
      expect(r.data.achievement).toBe("");
    }
  });
});

describe("profilePatchSchema", () => {
  it("requires id plus at least one valid field", () => {
    expect(parseBody(profilePatchSchema, { id: "x" }).ok).toBe(false);
    expect(parseBody(profilePatchSchema, { name: "Y" }).ok).toBe(false);
    expect(
      parseBody(profilePatchSchema, { id: "x", category: "business" }).ok
    ).toBe(true);
  });

  it("caps letter_html at 200KB", () => {
    expect(
      parseBody(profilePatchSchema, { id: "x", letter_html: "y".repeat(200_001) }).ok
    ).toBe(false);
  });

  it("rejects unknown letter_status values", () => {
    expect(
      parseBody(profilePatchSchema, { id: "x", letter_status: "published" }).ok
    ).toBe(false);
  });
});

describe("takedownSchema", () => {
  it("needs a described issue and a valid kind", () => {
    expect(
      parseBody(takedownSchema, {
        name: "A",
        kind: "removal",
        details: "too short",
      }).ok
    ).toBe(false);
    expect(
      parseBody(takedownSchema, {
        name: "A",
        kind: "erase-everything",
        details: "0123456789abcdef",
      }).ok
    ).toBe(false);
    expect(
      parseBody(takedownSchema, {
        name: "A",
        profile_name: "Kwame Lutterodt",
        kind: "correction",
        details: "The birth year is wrong, it should be 1961.",
      }).ok
    ).toBe(true);
  });
});
