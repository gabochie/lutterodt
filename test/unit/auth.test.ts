import { beforeEach, describe, expect, it } from "vitest";
import {
  hashAccessCode,
  signClientToken,
  timingSafeEqualString,
  verifyAccessCode,
  verifyClientToken,
} from "@/lib/cf/auth";

beforeEach(() => {
  process.env.AUTH_SECRET = "unit-test-secret-that-is-long-enough-12345";
});

describe("timingSafeEqualString", () => {
  it("compares in constant time semantics", () => {
    expect(timingSafeEqualString("abc", "abc")).toBe(true);
    expect(timingSafeEqualString("abc", "abd")).toBe(false);
    expect(timingSafeEqualString("abc", "abcd")).toBe(false);
  });
});

describe("client tokens", () => {
  it("round-trips sign/verify and rejects tampering + expiry", async () => {
    const token = await signClientToken({
      cid: 7,
      email: "client@example.com",
      exp: Date.now() + 60_000,
    });
    expect(await verifyClientToken(token)).toEqual({
      cid: 7,
      email: "client@example.com",
    });
    expect(await verifyClientToken(token.slice(0, -2) + "xx")).toBeNull();

    const expired = await signClientToken({
      cid: 7,
      email: "client@example.com",
      exp: Date.now() - 1_000,
    });
    expect(await verifyClientToken(expired)).toBeNull();
  });
});

describe("access codes", () => {
  it("hashes deterministically per account and verifies both paths", async () => {
    const a = await hashAccessCode("Client@Example.com", "CODE-1");
    const b = await hashAccessCode("client@example.com", "CODE-1");
    const c = await hashAccessCode("other@example.com", "CODE-1");
    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).toMatch(/^[0-9a-f]{64}$/);

    expect(
      await verifyAccessCode("client@example.com", "CODE-1", {
        access_code: "",
        access_code_hash: a,
      })
    ).toBe(true);
    expect(
      await verifyAccessCode("client@example.com", "WRONG", {
        access_code: "",
        access_code_hash: a,
      })
    ).toBe(false);
    expect(
      await verifyAccessCode("client@example.com", "CODE-1", {
        access_code: "CODE-1",
        access_code_hash: "",
      })
    ).toBe(true);
  });
});
