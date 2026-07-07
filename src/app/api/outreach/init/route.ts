/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { outreachProfiles, blindSpots } from "@/data/outreach-profiles";
import { ensureOutreachTables, slugify } from "@/lib/outreach/d1";
import { verifySession } from "@/lib/cf/auth";

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

// POST /api/outreach/init — one-time D1 seed
export async function POST() {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = await getDB();
    await ensureOutreachTables(db);

    // Seed profiles (skip existing — id is PK so INSERT OR IGNORE)
    const stmt = db.prepare(
      "INSERT OR IGNORE INTO outreach_profiles (id, name, dob, category, country, achievement, has_letter, letter_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    const now = new Date().toISOString();
    for (const p of outreachProfiles) {
      await stmt.bind(p.id, p.name, p.dob || "", p.category, p.country, p.achievement, p.hasLetter ? 1 : 0, p.hasLetter ? "draft" : "none", now, now).run();
    }

    // Seed blind spots
    const bsStmt = db.prepare(
      "INSERT OR IGNORE INTO outreach_blind_spots (id, title, priority, status, progress, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    for (const bs of blindSpots) {
      await bsStmt.bind(bs.id, bs.title, bs.priority, bs.status, bs.progress, now, now).run();
    }

    return NextResponse.json({ ok: true, profiles: outreachProfiles.length, blindSpots: blindSpots.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
