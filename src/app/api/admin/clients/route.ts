import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { hashAccessCode, verifyRequestAuth } from "@/lib/cf/auth";

export async function GET(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;

    const { results } = await db.prepare(
      "SELECT c.id, c.name, c.email, c.phone, c.status, c.notes, c.created_at, c.updated_at, (c.access_code_hash != '' AND c.access_code_hash IS NOT NULL) as code_set, COALESCE(sl.service_interest, '') as latest_interest FROM clients c LEFT JOIN (SELECT email, service_interest, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) as rn FROM service_leads) sl ON c.email = sl.email AND sl.rn = 1 ORDER BY c.created_at DESC"
    ).all();

    return NextResponse.json(results || []);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;

    const { id, name, email, phone, access_code, status, notes } = await request.json();
    const now = new Date().toISOString();

    // A supplied code is hashed before storage and returned ONCE so the admin
    // can share it; it is never readable again afterwards. Empty means
    // "keep the existing code".
    const newCode = typeof access_code === "string" ? access_code.trim() : "";
    // Login normalizes email to lowercase (loginSchema), so hash with the
    // same normalization or new codes will never verify.
    const newHash = newCode ? await hashAccessCode((email || "").toLowerCase().trim(), newCode) : null;

    if (!id || id === 0) {
      await db.prepare(
        "INSERT INTO clients (name, email, phone, access_code, access_code_hash, status, notes, created_at, updated_at) VALUES (?, ?, ?, '', ?, ?, ?, ?, ?)"
      ).bind(name, email, phone || "", newHash || "", status || "active", notes || "", now, now).run();
    } else {
      await db.prepare(
        "UPDATE clients SET name = COALESCE(?, name), email = COALESCE(?, email), phone = COALESCE(?, phone), access_code = CASE WHEN ? IS NOT NULL THEN '' ELSE access_code END, access_code_hash = COALESCE(?, access_code_hash), status = COALESCE(?, status), notes = COALESCE(?, notes), updated_at = ? WHERE id = ?"
      ).bind(name || null, email || null, phone || null, newHash, newHash, status || null, notes || null, now, id).run();
    }

    return NextResponse.json({ ok: true, access_code: newCode || undefined });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
