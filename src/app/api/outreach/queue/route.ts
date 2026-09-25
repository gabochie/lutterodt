/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ensureOutreachTables } from "@/lib/outreach/d1";
import { sanitizeLetterHtml } from "@/lib/outreach/sanitize";
import { verifyRequestAuth } from "@/lib/cf/auth";

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

export async function GET(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = await getDB();
    await ensureOutreachTables(db);
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "";
    let sql = "SELECT * FROM outreach_queue";
    const params: any[] = [];
    if (status) { sql += " WHERE status = ?"; params.push(status); }
    sql += " ORDER BY scheduled_date ASC, created_at ASC";
    const { results } = await db.prepare(sql).bind(...params).all();
    return NextResponse.json(results || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = await getDB();
    await ensureOutreachTables(db);
    const body = await request.json();
    const { profile_id, name, letter_html, recipient_email, scheduled_date } = body;
    if (!profile_id || !name || !letter_html) {
      return NextResponse.json({ error: "profile_id, name, and letter_html required" }, { status: 400 });
    }
    const safeHtml = sanitizeLetterHtml(String(letter_html));
    const now = new Date().toISOString();
    const { meta } = await db.prepare(
      "INSERT INTO outreach_queue (profile_id, name, status, letter_html, scheduled_date, recipient_email, created_at, updated_at) VALUES (?, ?, 'pending', ?, ?, ?, ?, ?)"
    ).bind(profile_id, name, safeHtml, scheduled_date || "", recipient_email || "", now, now).run();

    // Update profile status
    await db.prepare("UPDATE outreach_profiles SET letter_status = 'queued', updated_at = ? WHERE id = ?").bind(now, profile_id).run();
    await db.prepare("INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, 'queued', ?, ?)").bind(profile_id, `Letter queued for ${name}`, now).run();

    return NextResponse.json({ id: meta?.last_row_id, profile_id, ok: true }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = await getDB();
    const body = await request.json();
    const { id, status, error, resend_email_id, sent_at, scheduled_date } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const now = new Date().toISOString();
    const updates = ["updated_at = ?"];
    const params: any[] = [now];
    if (status) { updates.push("status = ?"); params.push(status); }
    if (error !== undefined) { updates.push("error = ?"); params.push(error); }
    if (resend_email_id) { updates.push("resend_email_id = ?"); params.push(resend_email_id); }
    if (sent_at) { updates.push("sent_at = ?"); params.push(sent_at); }
    if (scheduled_date) { updates.push("scheduled_date = ?"); params.push(scheduled_date); }
    params.push(id);
    await db.prepare(`UPDATE outreach_queue SET ${updates.join(", ")} WHERE id = ?`).bind(...params).run();
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
