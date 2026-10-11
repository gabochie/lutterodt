import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyRequestAuth } from "@/lib/cf/auth";
import { errMessage } from "@/lib/utils";

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyRequestAuth(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const db = await getDB();
    const article = await db.prepare("SELECT * FROM articles WHERE id = ?").bind(id).first();
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ article });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyRequestAuth(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const db = await getDB();
    const body = await request.json();
    const now = new Date().toISOString();
    await db.prepare(
      "UPDATE articles SET title = ?, content = ?, excerpt = ?, category = ?, status = ?, author = ?, featured_image = ?, published_at = COALESCE(?, published_at), updated_at = ? WHERE id = ?"
    ).bind(
      body.title || "", body.content || "", body.excerpt || "", body.category || "", body.status || "draft",
      body.author || "Admin", body.featured_image || "", body.status === "published" ? now : null, now, id
    ).run();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyRequestAuth(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const db = await getDB();
    await db.prepare("DELETE FROM articles WHERE id = ?").bind(id).run();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}
