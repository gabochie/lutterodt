import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ensureOutreachTables } from "@/lib/outreach/d1";

export async function POST(request: NextRequest) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;
    await ensureOutreachTables(db);

    const { name, email, phone, service_interest, message } = await request.json();
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    await db.prepare(
      "INSERT INTO service_leads (name, email, phone, service_interest, message, status, created_at) VALUES (?, ?, ?, ?, ?, 'new', ?)"
    ).bind(name, email, phone || "", service_interest || "", message || "", now).run();

    return NextResponse.json({ ok: true, message: "Thank you. We'll be in touch soon." }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
