import {
  type DbResearchDraft,
  type ResearchClaim,
  type ResearchDraftKind,
} from "./d1";

export type { DbResearchDraft, ResearchClaim, ResearchDraftKind };

// Draft-only research engine. The agent (or a human) writes drafts;
// nothing reaches outreach_profiles except through approveDraft(),
// which enforces the 2-source verification bar.

export const APPLYABLE_FIELDS = [
  "dob",
  "contact_linkedin",
  "contact_email",
  "category",
  "country",
  "image_url",
] as const;

export type ApplyableField = (typeof APPLYABLE_FIELDS)[number];

export function parseClaims(draft: DbResearchDraft): ResearchClaim[] {
  try {
    const raw = JSON.parse(draft.claims_json || "[]");
    return Array.isArray(raw) ? (raw as ResearchClaim[]) : [];
  } catch {
    return [];
  }
}

/** Verification bar: 2+ independent sources and at least medium confidence. */
export function claimMeetsBar(claim: ResearchClaim): boolean {
  const sources = (claim.sources || []).filter((s) => s && s.trim().length > 0);
  const unique = new Set(sources.map((s) => s.trim().toLowerCase()));
  if (unique.size < 2) return false;
  if (claim.confidence === "low") return false;
  if (!claim.value || !claim.value.trim()) return false;
  return true;
}

export function isApplyableField(field: string): field is ApplyableField {
  return (APPLYABLE_FIELDS as readonly string[]).includes(field);
}

/** Achievement text is only auto-applied at high confidence + 2 sources. */
export function achievementMeetsBar(claim: ResearchClaim): boolean {
  return claimMeetsBar(claim) && claim.confidence === "high";
}

export async function createDraft(
  db: D1Database,
  input: {
    kind: ResearchDraftKind;
    profile_id?: string;
    name: string;
    claims: ResearchClaim[];
    summary?: string;
  }
): Promise<number> {
  const now = new Date().toISOString();
  const res = await db
    .prepare(
      "INSERT INTO research_drafts (kind, profile_id, name, claims_json, summary, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'draft', ?, ?)"
    )
    .bind(
      input.kind,
      input.profile_id || "",
      input.name,
      JSON.stringify(input.claims || []),
      input.summary || "",
      now,
      now
    )
    .run();
  const id = Number(res.meta.last_row_id);
  await db
    .prepare(
      "INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, ?, ?, ?)"
    )
    .bind(
      input.profile_id || `draft-${id}`,
      "research-draft-created",
      `Draft #${id} (${input.kind}) created for ${input.name}`,
      now
    )
    .run();
  return id;
}

export interface ApprovalResult {
  applied: { field: string; value: string }[];
  skipped: { field: string; reason: string }[];
}

/**
 * Human review gate: applies qualifying scalar claims to the live profile.
 * Non-qualifying claims are reported back, never silently written.
 */
export async function approveDraft(
  db: D1Database,
  draftId: number,
  reviewer: string
): Promise<ApprovalResult> {
  const draft = await db
    .prepare("SELECT * FROM research_drafts WHERE id = ?")
    .bind(draftId)
    .first<DbResearchDraft>();
  if (!draft) throw new Error(`Draft #${draftId} not found`);
  if (draft.status === "approved") throw new Error(`Draft #${draftId} already approved`);

  const claims = parseClaims(draft);
  const applied: ApprovalResult["applied"] = [];
  const skipped: ApprovalResult["skipped"] = [];

  if (draft.kind === "enrichment" || draft.kind === "correction") {
    if (!draft.profile_id) throw new Error(`Draft #${draftId} has no profile_id`);
    const sets: string[] = [];
    const params: string[] = [];
    for (const claim of claims) {
      const field = claim.field;
      if (field === "achievement") {
        if (achievementMeetsBar(claim)) {
          sets.push("achievement = ?");
          params.push(claim.value.trim());
          applied.push({ field, value: claim.value.trim() });
        } else {
          skipped.push({ field, reason: "needs high confidence + 2 independent sources" });
        }
        continue;
      }
      if (!isApplyableField(field)) {
        skipped.push({ field, reason: "field is not auto-applyable; edit profile manually" });
        continue;
      }
      if (!claimMeetsBar(claim)) {
        skipped.push({ field, reason: "needs 2 independent sources + medium confidence" });
        continue;
      }
      sets.push(`${field} = ?`);
      params.push(claim.value.trim());
      applied.push({ field, value: claim.value.trim() });
    }
    if (sets.length > 0) {
      const now = new Date().toISOString();
      sets.push("updated_at = ?");
      params.push(now, draft.profile_id);
      await db
        .prepare(`UPDATE outreach_profiles SET ${sets.join(", ")} WHERE id = ?`)
        .bind(...params)
        .run();
    }
  } else {
    // new_profile + story_lead drafts never auto-write; reviewer creates them manually.
    for (const claim of claims) {
      skipped.push({ field: claim.field, reason: "kind requires manual creation by reviewer" });
    }
  }

  const now = new Date().toISOString();
  await db
    .prepare(
      "UPDATE research_drafts SET status = 'approved', reviewed_by = ?, reviewed_at = ?, updated_at = ? WHERE id = ?"
    )
    .bind(reviewer, now, now, draftId)
    .run();
  await db
    .prepare(
      "INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, ?, ?, ?)"
    )
    .bind(
      draft.profile_id || `draft-${draftId}`,
      "research-draft-approved",
      `Draft #${draftId} approved by ${reviewer}: ${applied.length} applied, ${skipped.length} skipped`,
      now
    )
    .run();
  return { applied, skipped };
}

export async function rejectDraft(
  db: D1Database,
  draftId: number,
  reviewer: string,
  reason?: string
): Promise<void> {
  const now = new Date().toISOString();
  await db
    .prepare(
      "UPDATE research_drafts SET status = 'rejected', reviewed_by = ?, reviewed_at = ?, updated_at = ? WHERE id = ?"
    )
    .bind(reviewer, now, now, draftId)
    .run();
  await db
    .prepare(
      "INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, 'research-draft-rejected', ?, ?)"
    )
    .bind(
      `draft-${draftId}`,
      `Draft #${draftId} rejected by ${reviewer}${reason ? `: ${reason}` : ""}`,
      now
    )
    .run();
}
