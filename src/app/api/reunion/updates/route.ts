import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyRequestAuth } from "@/lib/cf/auth";
import { errMessage } from "@/lib/utils";

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;
    const { results } = await db.prepare(
      "SELECT * FROM reunion_updates ORDER BY created_at DESC LIMIT 100"
    ).all();
    return NextResponse.json(results || []);
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;
    const body = await request.json();
    const { attendee_name, message, photo_url } = body;
    if (!attendee_name) {
      return NextResponse.json({ error: "attendee_name is required" }, { status: 400 });
    }
    const now = new Date().toISOString();
    const { meta } = await db.prepare(
      "INSERT INTO reunion_updates (attendee_name, message, photo_url, created_at) VALUES (?, ?, ?, ?)"
    ).bind(attendee_name, message || "", photo_url || "", now).run();
    return NextResponse.json({ id: meta?.last_row_id, ok: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}
