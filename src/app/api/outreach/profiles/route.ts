import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ensureOutreachTables, normalizeName, slugify } from "@/lib/outreach/d1";
import { verifySession } from "@/lib/cf/auth";

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

export async function GET(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = await getDB();
    await ensureOutreachTables(db);

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const country = url.searchParams.get("country") || "";
    const letterStatus = url.searchParams.get("letter_status") || "";
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 200);
    const offset = parseInt(url.searchParams.get("offset") || "0");

    let sql = "SELECT id, name, dob, category, country, achievement, has_letter, letter_status, contact_email, contact_linkedin, notes, created_at, updated_at FROM outreach_profiles WHERE 1=1";
    const params: any[] = [];

    if (search) {
      sql += " AND (LOWER(name) LIKE ? OR LOWER(achievement) LIKE ?)";
      const q = `%${search.toLowerCase()}%`;
      params.push(q, q);
    }
    if (category) { sql += " AND category = ?"; params.push(category); }
    if (country) { sql += " AND country = ?"; params.push(country); }
    if (letterStatus) { sql += " AND letter_status = ?"; params.push(letterStatus); }

    const countSql = sql.replace(/SELECT .+ FROM/, "SELECT COUNT(*) as c FROM");
    const countResult = await db.prepare(countSql).bind(...params).first<{ c: number }>();

    sql += " ORDER BY name LIMIT ? OFFSET ?";
    params.push(limit, offset);
    const { results } = await db.prepare(sql).bind(...params).all();

    return NextResponse.json({ profiles: results, total: countResult?.c || 0 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/outreach/profiles — add a new Lutterodt (with dedup)
export async function POST(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = await getDB();
    await ensureOutreachTables(db);

    const body = await request.json();
    const { name, dob, category, country, achievement, contact_email = "", contact_linkedin = "", notes = "" } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Name is required (min 2 chars)" }, { status: 400 });
    }

    // Dedup check: normalize name, search for exact or partial matches
    const normalized = normalizeName(name);
    const existing = await db.prepare(
      "SELECT id, name, category, country, achievement FROM outreach_profiles"
    ).all<{ id: string; name: string; category: string; country: string; achievement: string }>();

    const matches = (existing.results || []).filter((p: any) => {
      const pNorm = normalizeName(p.name);
      // Exact match after normalization
      if (pNorm === normalized) return true;
      // One contains the other
      if (pNorm.includes(normalized) || normalized.includes(pNorm)) return true;
      // Same email/LinkedIn
      if (contact_email && p.contact_email === contact_email) return true;
      if (contact_linkedin && p.contact_linkedin === contact_linkedin) return true;
      return false;
    });

    if (matches.length > 0) {
      return NextResponse.json({
        error: "Possible duplicate found",
        matches,
        message: "A profile with a similar name or contact already exists. Review matches or use ?force=true to add anyway.",
      }, { status: 409 });
    }

    const id = slugify(name);
    const now = new Date().toISOString();

    await db.prepare(
      "INSERT INTO outreach_profiles (id, name, dob, category, country, achievement, contact_email, contact_linkedin, notes, letter_status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'none', ?, ?)"
    ).bind(id, name.trim(), dob || "", category || "uncategorized", country || "", achievement || "", contact_email, contact_linkedin, notes, now, now).run();

    // Log the discovery
    await db.prepare(
      "INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, 'discovered', ?, ?)"
    ).bind(id, `New Lutterodt added: ${name} (${country})`, now).run();

    return NextResponse.json({ id, name, ok: true }, { status: 201 });
  } catch (err: any) {
    // Handle unique constraint violation
    if (err.message?.includes("UNIQUE")) {
      return NextResponse.json({ error: "A profile with this slug already exists. Try a more specific name." }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/outreach/profiles — update profile
export async function PATCH(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = await getDB();
    const body = await request.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const now = new Date().toISOString();
    const updates: string[] = [];
    const params: any[] = [];
    for (const [k, v] of Object.entries(fields)) {
      if (["name", "dob", "category", "country", "achievement", "letter_status", "letter_html", "contact_email", "contact_linkedin", "notes", "has_letter"].includes(k)) {
        updates.push(`${k} = ?`);
        params.push(v);
      }
    }
    if (updates.length === 0) return NextResponse.json({ error: "No valid fields" }, { status: 400 });

    updates.push("updated_at = ?");
    params.push(now);
    params.push(id);

    await db.prepare(`UPDATE outreach_profiles SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
