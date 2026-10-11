import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { signClientToken } from "@/lib/cf/auth";
import { loginSchema, parseBody } from "@/lib/validate";
import { LIMITS, checkRateLimit, rateLimitedResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Counted before credential verification so brute force burns budget too.
  const rate = await checkRateLimit(request, "clients-login", LIMITS.login);
  if (!rate.allowed) return rateLimitedResponse(rate.retryAfter);
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;

    const parsed = parseBody(loginSchema, await request.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const { email, access_code } = parsed.data;

    const row = await db.prepare(
      "SELECT id, name, email, status FROM clients WHERE email = ? AND access_code = ? AND status = 'active'"
    ).bind(email, access_code).first();

    if (!row) {
      return NextResponse.json({ error: "Invalid credentials or account not active" }, { status: 401 });
    }

    const token = await signClientToken({ cid: row.id as number, email: row.email as string, exp: Date.now() + 7 * 86400000 });
    const response = NextResponse.json({ ok: true, name: row.name });
    response.cookies.set("client_token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 604800,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
