import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyRequestAuth } from "@/lib/cf/auth";
import { errMessage } from "@/lib/utils";

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyRequestAuth(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const db = await getDB();
    const body = await request.json();
    if (body.status) {
      await db.prepare("UPDATE contacts SET status = ? WHERE id = ?").bind(body.status, id).run();
    }
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
    await db.prepare("DELETE FROM contacts WHERE id = ?").bind(id).run();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}
