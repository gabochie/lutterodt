import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { signClientToken } from "@/lib/cf/auth";

export async function POST(request: NextRequest) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;

    const { email, access_code } = await request.json();
    if (!email || !access_code) {
      return NextResponse.json({ error: "Email and access code are required" }, { status: 400 });
    }

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
