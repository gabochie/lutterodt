import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ensureOutreachTables } from "@/lib/outreach/d1";

function verifyClient(request: NextRequest): { id: number; email: string } | null {
  const token = request.cookies.get("client_token")?.value;
  if (!token) return null;
  try {
    const data = JSON.parse(Buffer.from(token, "base64url").toString());
    if (data.exp > Date.now()) return { id: data.cid, email: data.email };
  } catch {
    /* ignore */
  }
  return null;
}

export async function GET(request: NextRequest) {
  const client = verifyClient(request);
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
