import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ensureOutreachTables } from "@/lib/outreach/d1";
import { verifyRequestAuth } from "@/lib/cf/auth";
import { errMessage } from "@/lib/utils";

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

export async function GET(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = await getDB();
    await ensureOutreachTables(db);
    const { results } = await db.prepare("SELECT * FROM outreach_blind_spots ORDER BY priority DESC, progress ASC").all();
    return NextResponse.json(results || []);
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = await getDB();
    await ensureOutreachTables(db);
    const body = await request.json();
    const { id, title, priority = "medium", status = "open", progress = 0 } = body;
    if (!id || !title) return NextResponse.json({ error: "id and title required" }, { status: 400 });
    const now = new Date().toISOString();
    await db.prepare(
      "INSERT OR REPLACE INTO outreach_blind_spots (id, title, priority, status, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM outreach_blind_spots WHERE id = ?), ?), ?)"
    ).bind(id, title, priority, status, progress, id, now, now).run();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}
