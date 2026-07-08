import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const COOKIE_NAME = "admin_token";

function getSecret(): string {
  return process.env.AUTH_SECRET || "dev-auth-secret-change-in-production";
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin";
}

function toB64(data: string): string {
  return Buffer.from(data, "utf8").toString("base64url");
}

function fromB64(data: string): string {
  return Buffer.from(data, "base64url").toString("utf8");
}

export async function createSession(email: string) {
  const exp = Date.now() + 14 * 24 * 60 * 60 * 1000;
  const payload = JSON.stringify({ email, exp });

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sigBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const sigB64 = Buffer.from(new Uint8Array(sigBuffer)).toString("base64url");

  return {
    name: COOKIE_NAME,
    value: toB64(payload) + "." + sigB64,
    options: {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 1209600,
    },
  };
}

export async function destroySession() {
  return {
    name: COOKIE_NAME,
    value: "",
    options: {
      path: "/",
      maxAge: 0,
    },
  };
}

function parseCookieHeader(cookieHeader: string): string | null {
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${COOKIE_NAME}=`)) {
      return trimmed.slice(COOKIE_NAME.length + 1);
    }
  }
  return null;
}

async function verifyToken(tokenValue: string): Promise<boolean> {
  try {
    const parts = tokenValue.split(".");
    if (parts.length !== 2) return false;

    const payload = fromB64(parts[0]);
    const sigB64 = parts[1];

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(getSecret()),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sig = Buffer.from(sigB64, "base64url");
    const valid = await crypto.subtle.verify("HMAC", key, sig, encoder.encode(payload));

    if (!valid) return false;

    const data = JSON.parse(payload);
    if (data.exp < Date.now()) return false;

    return true;
  } catch {
    return false;
  }
}

export function getCronSecret(): string {
  return process.env.CRON_SECRET || "";
}

export async function verifyRequestCookie(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return token ? verifyToken(token) : false;
}

export async function verifyRequestAuth(request: NextRequest): Promise<boolean> {
  // First try session cookie via NextRequest (most reliable)
  if (await verifyRequestCookie(request)) return true;
  // Then try cookies() from next/headers
  if (await verifySession()) return true;
  // Fall back to Authorization: Bearer <cron-secret>
  const auth = request.headers.get("authorization") || "";
  if (auth.startsWith("Bearer ") && auth.slice(7) === getCronSecret()) return true;
  return false;
}

export async function verifySession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    if (token?.value) return verifyToken(token.value);
  } catch {
    // cookies() may fail in some edge contexts — fall through to raw header
  }

  try {
    const headersList = await headers();
    const raw = headersList.get("cookie") || "";
    const value = parseCookieHeader(raw);
    if (value) return verifyToken(value);
  } catch {
    // headers() may also fail — fall through to false
  }

  return false;
}
