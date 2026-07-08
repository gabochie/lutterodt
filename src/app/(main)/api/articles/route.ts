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
    const { results } = await db.prepare("SELECT * FROM articles ORDER BY created_at DESC").all();
    return NextResponse.json({ articles: results || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifySession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = await getDB();
    const body = await request.json();
    const now = new Date().toISOString();
    const { meta } = await db.prepare(
      "INSERT INTO articles (title, content, excerpt, category, status, author, featured_image, published_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(
      body.title || "", body.content || "", body.excerpt || "", body.category || "", body.status || "draft",
      body.author || "Admin", body.featured_image || "", body.status === "published" ? now : null, now, now
    ).run();
    return NextResponse.json({ ok: true, id: meta?.last_row_id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
