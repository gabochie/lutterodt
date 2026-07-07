import { cookies } from "next/headers";

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

export async function verifySession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    if (!token?.value) return false;

    const parts = token.value.split(".");
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
