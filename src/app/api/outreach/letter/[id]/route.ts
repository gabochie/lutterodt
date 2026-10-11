import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyRequestAuth } from "@/lib/cf/auth";
import { verifyClientToken } from "@/lib/cf/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get("client_token")?.value;
  const isClient = token ? await verifyClientToken(token) : null;
  if (!(await verifyRequestAuth(request)) && !isClient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}