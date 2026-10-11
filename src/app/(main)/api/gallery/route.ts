import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifySession } from "@/lib/cf/auth";
import { errMessage } from "@/lib/utils";

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

export async function GET() {
  if (!(await verifySession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = await getDB();
    const { results } = await db.prepare("SELECT * FROM gallery_items ORDER BY created_at DESC").all();
    return NextResponse.json({ items: results || [] });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifySession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = await getDB();
    const body = await request.json();
    const { meta } = await db.prepare(
      "INSERT INTO gallery_items (src, alt, tag, title, filter) VALUES (?, ?, ?, ?, ?)"
    ).bind(body.src || "", body.alt || "", body.tag || "", body.title || "", body.filter || "").run();
    return NextResponse.json({ ok: true, id: meta?.last_row_id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}
