import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
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

    const { results } = await db.prepare(
      "SELECT * FROM client_services_catalog WHERE active = 1 ORDER BY sort_order ASC"
    ).all();

    return NextResponse.json(results || []);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}