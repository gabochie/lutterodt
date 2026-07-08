import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifySession } from "@/lib/cf/auth";

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

export async function GET() {
  if (!(await verifySession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = await getDB();
    const { results } = await db.prepare("SELECT * FROM timeline_events ORDER BY year ASC").all();
    return NextResponse.json({ entries: results || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifySession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = await getDB();
    const body = await request.json();
    const { meta } = await db.prepare(
      "INSERT INTO timeline_events (year, category, title, description, filter, images) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(body.year || "", body.category || "", body.title || "", body.description || "", body.filter || "", body.images || "[]").run();
    return NextResponse.json({ ok: true, id: meta?.last_row_id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
