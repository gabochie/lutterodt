import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ensureOutreachTables } from "@/lib/outreach/d1";

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;
    await ensureOutreachTables(db);

    const { results } = await db.prepare(
      "SELECT c.*, COALESCE(sl.service_interest, '') as latest_interest FROM clients c LEFT JOIN (SELECT email, service_interest, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as rn FROM service_leads) sl ON c.email = sl.email AND sl.rn = 1 ORDER BY c.created_at DESC"
    ).all();

    return NextResponse.json(results || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;
    await ensureOutreachTables(db);

    const { id, name, email, phone, access_code, status, notes } = await request.json();
    const now = new Date().toISOString();

    if (!id || id === 0) {
      // Create new client
      await db.prepare(
        "INSERT INTO clients (name, email, phone, access_code, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(name, email, phone || "", access_code || "", status || "active", notes || "", now, now).run();
    } else {
      await db.prepare(
        "UPDATE clients SET name = COALESCE(?, name), email = COALESCE(?, email), phone = COALESCE(?, phone), access_code = COALESCE(?, access_code), status = COALESCE(?, status), notes = COALESCE(?, notes), updated_at = ? WHERE id = ?"
      ).bind(name || null, email || null, phone || null, access_code || null, status || null, notes || null, now, id).run();
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
