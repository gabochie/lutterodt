import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ensureOutreachTables } from "@/lib/outreach/d1";

function verifyClient(request: NextRequest): boolean {
  const token = request.cookies.get("client_token")?.value;
  if (!token) return false;
  try {
    const data = JSON.parse(Buffer.from(token, "base64url").toString());
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!verifyClient(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;
    await ensureOutreachTables(db);

    const { results } = await db.prepare(
      "SELECT * FROM client_services_catalog WHERE active = 1 ORDER BY sort_order ASC"
    ).all();

    return NextResponse.json(results || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
