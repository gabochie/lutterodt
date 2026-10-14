"use client";

import { useEffect, useState } from "react";

interface Claim {
  field: string;
  value: string;
  sources: string[];
  confidence: "low" | "medium" | "high";
}

interface Draft {
  id: number;
  kind: string;
  profile_id: string;
  name: string;
  claims_json: string;
  summary: string;
  status: string;
  reviewed_by: string;
  reviewed_at: string;
  created_at: string;
}

const KIND_LABEL: Record<string, string> = {
  enrichment: "Enrichment",
  new_profile: "New profile",
  story_lead: "Story lead",
  correction: "Correction",
};

function parseClaims(d: Draft): Claim[] {
  try {
    const raw = JSON.parse(d.claims_json || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export default function ReviewPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState("draft");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [reviewer, setReviewer] = useState("");
  const [acting, setActing] = useState<number | null>(null);
  const [result, setResult] = useState<{ id: number; applied: { field: string; value: string }[]; skipped: { field: string; reason: string }[] } | null>(null);

  async function load(status: string) {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`/api/outreach/drafts?status=${status}`);
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed to load drafts");
      setDrafts(d.drafts || []);
      setCounts(d.counts || {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load drafts");
    }
    setLoading(false);
  }

  useEffect(() => { load(filter); }, [filter]);

  async function review(id: number, action: "approve" | "reject") {
    if (!reviewer.trim()) { setError("Enter your reviewer name first"); return; }
    setActing(id);
    setError("");
    setResult(null);
    try {
      const r = await fetch("/api/outreach/drafts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, reviewer: reviewer.trim() }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || `Failed to ${action}`);
      if (action === "approve" && (d.applied || d.skipped)) {
        setResult({ id, applied: d.applied || [], skipped: d.skipped || [] });
      }
      await load(filter);
    } catch (e) {
      setError(e instanceof Error ? e.message : `Failed to ${action}`);
    }
    setActing(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[clamp(22px,2.5vw,30px)] font-display text-heading">Research Review</h1>
          <p className="text-fg/50 text-[13px] mt-1">
            Draft-only gate: nothing reaches live profiles except through your approval.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={reviewer}
            onChange={e => setReviewer(e.target.value)}
            placeholder="Reviewer name"
            className="bg-surface border border-line px-3 py-2 text-[13px] text-fg outline-none focus:border-gold-dim transition-colors w-40"
          />
          {(["draft", "approved", "rejected"] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`font-mono text-[10px] tracking-widest uppercase px-3 py-2 border transition-colors ${
                filter === s
                  ? "bg-azure text-ivory border-azure"
                  : "bg-surface text-fg/60 border-line hover:border-gold-dim"
              }`}
            >
              {s} ({counts[s] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 border border-azure/20 bg-azure/5 text-accent-text text-[13px]">{error}</div>
      )}

      {result && (
        <div className="mb-4 p-4 border border-forest/20 bg-forest/5 text-[13px]">
          <div className="font-medium text-success-text mb-2">Draft #{result.id} approved</div>
          {result.applied.length > 0 && (
            <div className="mb-1">
              <span className="font-mono text-[10px] tracking-widest uppercase text-fg/50">Applied: </span>
              {result.applied.map(a => `${a.field}`).join(", ")}
            </div>
          )}
          {result.skipped.length > 0 && (
            <div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-fg/50">Skipped (needs 2 sources / manual edit): </span>
              {result.skipped.map(s => `${s.field} — ${s.reason}`).join("; ")}
            </div>
          )}
        </div>
      )}

      {loading && <p className="text-fg/50 text-[13px]">Loading...</p>}

      {!loading && drafts.length === 0 && (
        <div className="bg-surface border border-line p-8 text-center text-fg/50 text-[13px]">
          No {filter} drafts. The Research Agent will file enrichment, new-profile, story-lead, and correction drafts here for your review.
        </div>
      )}

      {!loading && drafts.length > 0 && (
        <div className="space-y-3">
          {drafts.map(d => {
            const claims = parseClaims(d);
            const open = expanded === d.id;
            return (
              <div key={d.id} className="bg-surface border border-line">
                <button
                  onClick={() => setExpanded(open ? null : d.id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-ivory-dim/50"
                >
                  <div>
                    <span className="font-mono text-[9px] tracking-widest uppercase text-gold-dim mr-2">
                      #{d.id} · {KIND_LABEL[d.kind] || d.kind}
                    </span>
                    <span className="text-[15px]">{d.name}</span>
                    <div className="text-[12px] text-fg/50 mt-0.5">
                      {claims.length} claim{claims.length === 1 ? "" : "s"}
                      {d.summary ? ` · ${d.summary}` : ""}
                      {d.status !== "draft" && d.reviewed_by ? ` · reviewed by ${d.reviewed_by}` : ""}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-fg/40">{open ? "−" : "+"}</span>
                </button>
                {open && (
                  <div className="px-4 pb-4 border-t border-line pt-3">
                    {claims.map((c, i) => (
                      <div key={i} className="mb-3 last:mb-0 bg-ivory-dim/40 border border-line p-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="font-mono text-[10px] tracking-widest uppercase text-accent-text">{c.field}</span>
                          <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 ${
                            c.confidence === "high" ? "bg-forest/10 text-success-text" :
                            c.confidence === "medium" ? "bg-gold-dim/10 text-gold-dim" :
                            "bg-azure/10 text-accent-text"
                          }`}>{c.confidence}</span>
                        </div>
                        <div className="text-[14px] mt-1.5 break-words">{c.value}</div>
                        <div className="text-[12px] text-fg/50 mt-1.5">
                          Sources ({(c.sources || []).length}): {(c.sources || []).join(" · ") || "none listed"}
                        </div>
                      </div>
                    ))}
                    {d.status === "draft" && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => review(d.id, "approve")}
                          disabled={acting === d.id}
                          className="btn-gold text-[10px] px-4 py-2 disabled:opacity-50"
                        >
                          {acting === d.id ? "Working..." : "Approve & Apply"}
                        </button>
                        <button
                          onClick={() => review(d.id, "reject")}
                          disabled={acting === d.id}
                          className="btn-ghost text-[10px] px-4 py-2 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
