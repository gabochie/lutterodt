import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyRequestAuth } from "@/lib/cf/auth";
import { errMessage } from "@/lib/utils";

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

export async function GET(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = await getDB();
    const { results } = await db.prepare("SELECT * FROM contacts ORDER BY created_at DESC").all();
    return NextResponse.json({ contacts: results || [] });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}
