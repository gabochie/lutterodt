import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ensureOutreachTables } from "@/lib/outreach/d1";
import { verifyClientToken } from "@/lib/cf/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("client_token")?.value;
  const client = token ? await verifyClientToken(token) : null;
  if (!client) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;
    await ensureOutreachTables(db);

    // For now return service_leads as basic project list
    const { results } = await db.prepare(
      "SELECT id, service_interest, message, status, created_at FROM service_leads WHERE email = ? ORDER BY created_at DESC"
    ).bind(client.email).all();

    return NextResponse.json(results || []);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
