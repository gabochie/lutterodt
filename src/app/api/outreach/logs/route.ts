import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyRequestAuth } from "@/lib/cf/auth";
import { errMessage } from "@/lib/utils";

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

export async function GET(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    const logs = await db.prepare(
      "SELECT id, profile_id, action, details, created_at FROM outreach_log ORDER BY created_at DESC LIMIT ?"
    ).bind(limit).all<{ id: number; profile_id: string; action: string; details: string; created_at: string }>();

    const count = await db.prepare("SELECT COUNT(*) as c FROM outreach_log").first<{ c: number }>();

    return NextResponse.json({
      logs: logs.results || [],
      total: count?.c || 0,
    });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}
