import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;

    const letter = await db.prepare(
      "SELECT letter_html FROM outreach_queue WHERE profile_id = ? AND letter_html IS NOT NULL AND letter_html != '' ORDER BY created_at DESC LIMIT 1"
    ).bind(id).first<{ letter_html: string }>();

    if (!letter?.letter_html) {
      return NextResponse.json({ error: "No letter found" }, { status: 404 });
    }

    return new NextResponse(letter.letter_html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
