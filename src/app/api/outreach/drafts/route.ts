/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ensureOutreachTables } from "@/lib/outreach/d1";
import {
  approveDraft,
  createDraft,
  rejectDraft,
  type ResearchDraftKind,
  type ResearchClaim,
} from "@/lib/outreach/research";
import { verifyRequestAuth } from "@/lib/cf/auth";

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

const VALID_KINDS: ResearchDraftKind[] = ["enrichment", "new_profile", "story_lead", "correction"];
const VALID_STATUS = ["draft", "approved", "rejected"];

// GET /api/outreach/drafts?status=draft — review queue
export async function GET(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const db = await getDB();
    await ensureOutreachTables(db);
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "";
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 200);

    let sql =
      "SELECT id, kind, profile_id, name, claims_json, summary, status, reviewed_by, reviewed_at, created_at, updated_at FROM research_drafts WHERE 1=1";
    const params: any[] = [];
    if (status) {
      if (!VALID_STATUS.includes(status)) {
        return NextResponse.json({ error: "invalid status" }, { status: 400 });
      }
      sql += " AND status = ?";
      params.push(status);
    }
    sql += " ORDER BY created_at DESC LIMIT ?";
    params.push(limit);
    const { results } = await db.prepare(sql).bind(...params).all();
    const counts: Record<string, number> = {};
    for (const s of VALID_STATUS) {
      const row = await db
        .prepare("SELECT COUNT(*) as c FROM research_drafts WHERE status = ?")
        .bind(s)
        .first<{ c: number }>();
      counts[s] = row?.c || 0;
    }
    return NextResponse.json({ drafts: results, counts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/outreach/drafts — agent/human submits a draft (never writes live tables)
export async function POST(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { kind, profile_id, name, claims, summary } = body as {
      kind: ResearchDraftKind;
      profile_id?: string;
      name?: string;
      claims?: ResearchClaim[];
      summary?: string;
    };
    if (!kind || !VALID_KINDS.includes(kind)) {
      return NextResponse.json({ error: "kind must be one of: " + VALID_KINDS.join(", ") }, { status: 400 });
    }
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (!Array.isArray(claims) || claims.length === 0) {
      return NextResponse.json({ error: "at least one claim is required" }, { status: 400 });
    }
    for (const c of claims) {
      if (!c.field || !c.value) {
        return NextResponse.json({ error: "each claim needs field + value" }, { status: 400 });
      }
    }
    const db = await getDB();
    const id = await createDraft(db, {
      kind,
      profile_id: profile_id || "",
      name: name.trim(),
      claims,
      summary: summary || "",
    });
    return NextResponse.json({ id, status: "draft" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/outreach/drafts — human review gate: { id, action: "approve"|"reject", reviewer, reason? }
export async function PATCH(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { id, action, reviewer, reason } = body as {
      id?: number;
      action?: string;
      reviewer?: string;
      reason?: string;
    };
    if (!id || (action !== "approve" && action !== "reject")) {
      return NextResponse.json({ error: "id + action (approve|reject) required" }, { status: 400 });
    }
    if (!reviewer || !reviewer.trim()) {
      return NextResponse.json({ error: "reviewer is required" }, { status: 400 });
    }
    const db = await getDB();
    if (action === "approve") {
      const result = await approveDraft(db, Number(id), reviewer.trim());
      return NextResponse.json({ id, status: "approved", ...result });
    }
    await rejectDraft(db, Number(id), reviewer.trim(), reason || "");
    return NextResponse.json({ id, status: "rejected" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
