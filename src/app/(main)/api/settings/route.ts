import { NextResponse, NextRequest } from "next/server";
import { getSetting, setSetting } from "@/lib/cf/kv";
import { getAdminPassword } from "@/lib/cf/auth";

const COOKIE_NAME = "admin_token";

function getSecret(): string {
  return process.env.AUTH_SECRET || "dev-auth-secret-change-in-production";
}

function fromB64(data: string): string {
  return Buffer.from(data, "base64url").toString("utf8");
}

async function verifyToken(tokenValue: string): Promise<boolean> {
  try {
    const parts = tokenValue.split(".");
    if (parts.length !== 2) return false;
    const payload = fromB64(parts[0]);
    const sigB64 = parts[1];
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", encoder.encode(getSecret()),
      { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
    );
    const sig = Buffer.from(sigB64, "base64url");
    const valid = await crypto.subtle.verify("HMAC", key, sig, encoder.encode(payload));
    if (!valid) return false;
    const data = JSON.parse(payload);
    if (data.exp < Date.now()) return false;
    return true;
  } catch { return false; }
}

function isAuthenticated(request: NextRequest): boolean {
  // Method 1: Direct Cookie header parse
  const rawCookie = request.headers.get("cookie") || "";
  for (const part of rawCookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${COOKIE_NAME}=`)) {
      return true;  // cookie exists
    }
  }
  // Method 2: NextRequest cookies API
  if (request.cookies.get(COOKIE_NAME)?.value) return true;
  return false;
}

function getCredential(request: NextRequest): string | null {
  // Try Authorization header
  const auth = request.headers.get("authorization") || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  // Try cookie via raw header
  const rawCookie = request.headers.get("cookie") || "";
  for (const part of rawCookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${COOKIE_NAME}=`)) {
      return trimmed.slice(COOKIE_NAME.length + 1);
    }
  }
  // Try cookie via API
  return request.cookies.get(COOKIE_NAME)?.value || null;
}

export async function GET() {
  const value = await getSetting("coming_soon");
  return NextResponse.json({ coming_soon: value === "true" });
}

export async function POST(request: NextRequest) {
  const credential = getCredential(request);
  if (!credential) {
    return NextResponse.json({ error: "Unauthorized: no credential found" }, { status: 401 });
  }
  const valid = await verifyToken(credential);
  if (!valid) {
    return NextResponse.json({ error: "Unauthorized: invalid credential" }, { status: 401 });
  }

  const body = await request.json();
  const value = body.coming_soon === true ? "true" : "false";
  await setSetting("coming_soon", value);

  return NextResponse.json({ coming_soon: value === "true" });
}
