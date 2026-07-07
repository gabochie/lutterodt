/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ensureOutreachTables } from "@/lib/outreach/d1";
import { verifySession } from "@/lib/cf/auth";

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

export async function GET() {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = await getDB();
    await ensureOutreachTables(db);

    const [total, hasLetters, statusCounts, queueCounts, blindSpotCounts] = await Promise.all([
      db.prepare("SELECT COUNT(*) as c FROM outreach_profiles").first<{ c: number }>(),
      db.prepare("SELECT COUNT(*) as c FROM outreach_profiles WHERE has_letter = 1").first<{ c: number }>(),
      db.prepare("SELECT letter_status, COUNT(*) as c FROM outreach_profiles GROUP BY letter_status").all<{ letter_status: string; c: number }>(),
      db.prepare("SELECT status, COUNT(*) as c FROM outreach_queue GROUP BY status").all<{ status: string; c: number }>(),
      db.prepare("SELECT COUNT(*) as c FROM outreach_blind_spots").first<{ c: number }>(),
    ]);

    const byStatus: Record<string, number> = {};
    (statusCounts.results || []).forEach((r: any) => { byStatus[r.letter_status] = r.c; });
    const queueByStatus: Record<string, number> = {};
    (queueCounts.results || []).forEach((r: any) => { queueByStatus[r.status] = r.c; });

    const categories = await db.prepare("SELECT category, COUNT(*) as c FROM outreach_profiles GROUP BY category ORDER BY c DESC").all();

    return NextResponse.json({
      total: total?.c || 0,
      withLetters: hasLetters?.c || 0,
      statusBreakdown: byStatus,
      queue: queueByStatus,
      blindSpots: blindSpotCounts?.c || 0,
      categories: categories.results || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
