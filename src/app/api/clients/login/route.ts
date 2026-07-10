import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ensureOutreachTables } from "@/lib/outreach/d1";

export async function POST(request: NextRequest) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;
    await ensureOutreachTables(db);

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

    const token = Buffer.from(JSON.stringify({ cid: row.id, email: row.email, exp: Date.now() + 7 * 86400000 })).toString("base64url");
    const response = NextResponse.json({ ok: true, name: row.name });
    response.cookies.set("client_token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 604800,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
