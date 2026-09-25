"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

interface QueueItem {
  id: number;
  profile_id: string;
  name: string;
  status: string;
  scheduled_date: string;
  recipient_email: string;
  error: string;
  created_at: string;
}

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{ name: string; html: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/outreach/queue").then(r => r.json()),
      fetch("/api/outreach/profiles?letter_status=none&limit=50").then(r => r.json()),
    ]).then(([q, p]) => {
      setQueue(Array.isArray(q) ? q : []);
      setProfiles(p.profiles || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function previewLetter(profile: any) {
    setGenerating(profile.id);
    setError("");
    try {
      const gen = await fetch("/api/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          achievement: profile.achievement,
          category: profile.category,
          country: profile.country,
          dob: profile.dob,
          bio: profile.bio,
        }),
      });
      const letter = await gen.json();
      if (gen.ok) setPreview({ name: profile.name, html: letter.html });
      else setError(letter.error);
    } catch { setError("Failed to generate preview"); }
    setGenerating(null);
  }

  async function queuePreviewed() {
    if (!preview) return;
    setGenerating("queue");
    setError("");
    const profile = profiles.find(p => p.name === preview.name);
    if (!profile) { setError("Profile not found"); setGenerating(null); return; }
    try {
      const q = await fetch("/api/outreach/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id: profile.id, name: profile.name, letter_html: preview.html }),
      });
      const result = await q.json();
      if (q.ok) {
        setPreview(null);
        const [queueRes, profRes] = await Promise.all([
          fetch("/api/outreach/queue").then(r => r.json()),
          fetch("/api/outreach/profiles?letter_status=none&limit=50").then(r => r.json()),
        ]);
        setQueue(Array.isArray(queueRes) ? queueRes : []);
        setProfiles(profRes.profiles || []);
      } else {
        setError(result.error || "Failed to queue");
      }
    } catch { setError("Failed to queue"); }
    setGenerating(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[clamp(22px,2.5vw,30px)] font-display text-heading">Letter Queue</h1>
          <p className="text-fg/50 text-[13px] mt-1">
            {queue.filter(q => q.status === "sent").length} sent, {queue.filter(q => q.status === "pending").length} pending
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 border border-burgundy/20 bg-burgundy/5 text-accent-text text-[13px]">{error}</div>
      )}

      {loading && <p className="text-fg/50 text-[13px]">Loading...</p>}

      {!loading && (
        <>
          {profiles.length > 0 && (
            <div className="mb-8">
              <h2 className="font-mono text-[10.5px] tracking-widest uppercase text-gold-dim mb-3">
                Profiles Ready for Letters ({profiles.length})
              </h2>
              <div className="bg-surface border border-line divide-y divide-line">
                {profiles.map((p) => (
                  <div key={p.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-[14px]">{p.name}</div>
                      <div className="text-[12px] text-fg/50">{p.country} &middot; {p.category}</div>
                    </div>
                    <button
                      onClick={() => previewLetter(p)}
                      disabled={generating === p.id}
                      className="btn-gold text-[10px] px-4 py-2 disabled:opacity-50"
                    >
                      {generating === p.id ? "Generating..." : "Generate & Preview"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="font-mono text-[10.5px] tracking-widest uppercase text-gold-dim mb-3">Current Queue</h2>
          {queue.length === 0 ? (
            <div className="bg-surface border border-line p-8 text-center text-fg/50 text-[13px]">
              No letters in the queue. Generate letters from profiles above.
            </div>
          ) : (
            <div className="bg-surface border border-line">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Name</th>
                    <th className="text-left font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Status</th>
                    <th className="text-left font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Scheduled</th>
                    <th className="text-left font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {queue.map((item) => (
                    <tr key={item.id} className="hover:bg-ivory-dim/50">
                      <td className="px-4 py-3 text-[14px]">{item.name}</td>
                      <td className="px-4 py-3">
                        <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 ${
                          item.status === "sent" ? "bg-forest/10 text-success-text" :
                          item.status === "failed" ? "bg-burgundy/10 text-accent-text" :
                          "bg-gold-dim/10 text-gold-dim"
                        }`}>{item.status}</span>
                      </td>
                      <td className="px-4 py-3 text-[13px] text-fg/50">{item.scheduled_date || "—"}</td>
                      <td className="px-4 py-3 text-[13px] text-fg/50">{item.created_at?.slice(0, 10) || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6" onClick={() => setPreview(null)}>
          <div className="bg-card max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-line px-5 py-3 flex items-center justify-between z-10">
              <span className="font-mono text-[10px] tracking-widest uppercase text-fg/40">Preview: {preview.name}</span>
              <div className="flex gap-2">
                <button onClick={() => setPreview(null)} className="btn-ghost text-[10px] px-3 py-1.5">Close</button>
                <button
                  onClick={queuePreviewed}
                  disabled={generating === "queue"}
                  className="btn-gold text-[10px] px-4 py-1.5 disabled:opacity-50"
                >
                  {generating === "queue" ? "Queueing..." : "Queue for Sending"}
                </button>
              </div>
            </div>
            <div className="letter-preview" dangerouslySetInnerHTML={{ __html: preview.html }} />
          </div>
        </div>
      )}

      <style>{`
        .letter-preview { background: #faf8f5; }
        .letter-preview .page { max-width: 680px; margin: 0 auto; padding: 48px 56px; background: #fff; }
        .letter-preview .brand { text-align: center; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 1px solid #c6a15b; }
        .letter-preview .brand svg { width: 40px; height: 40px; margin-bottom: 10px; }
        .letter-preview .brand h1 { font-size: 18px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: #5a2d2a; }
        .letter-preview .brand p { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: #c6a15b; }
        .letter-preview .date { font-size: 13px; color: #6b5a4a; margin-bottom: 28px; }
        .letter-preview .salutation { font-size: 15px; margin-bottom: 18px; }
        .letter-preview .body p { font-size: 14px; margin-bottom: 16px; color: #3d2b1a; line-height: 1.7; }
        .letter-preview .highlight { border-left: 3px solid #c6a15b; padding: 14px 18px; margin: 20px 0; background: #faf6ef; font-style: italic; color: #5a2d2a; font-size: 14px; }
        .letter-preview .cta { margin-top: 24px; padding-top: 20px; border-top: 1px solid #e8ddd0; }
        .letter-preview .signoff { margin-top: 36px; }
        .letter-preview .signoff .name { font-size: 16px; font-weight: 600; color: #5a2d2a; margin-top: 18px; }
        .letter-preview .signoff .role { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #c6a15b; }
        .letter-preview .footer { margin-top: 32px; padding-top: 16px; text-align: center; font-size: 10px; color: #a09080; }
      `}</style>
    </div>
  );
}
