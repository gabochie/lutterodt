"use client";

import { useEffect, useState, useCallback } from "react";
import { Tag } from "@/components/shared/Tag";

interface Update {
  id: number;
  attendee_name: string;
  message: string;
  photo_url: string;
  created_at: string;
}

export function ReunionLiveFeed() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ attendee_name: "", message: "" });
  const [posting, setPosting] = useState(false);
  const [now, setNow] = useState<number | null>(null);

  const fetchUpdates = useCallback(async () => {
    try {
      const res = await fetch("/api/reunion/updates");
      if (res.ok) {
        const data = await res.json();
        setUpdates(data);
        setNow(Date.now());
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 30000);
    return () => clearInterval(interval);
  }, [fetchUpdates]);

  useEffect(() => {
    fetch("/api/login/check").then(r => r.json()).then(d => setIsAdmin(d.authenticated)).catch(() => {});
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.attendee_name.trim()) return;
    setPosting(true);
    try {
      await fetch("/api/reunion/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendee_name: form.attendee_name.trim(), message: form.message.trim() }),
      });
      setForm({ attendee_name: "", message: "" });
      await fetchUpdates();
    } catch {}
    setPosting(false);
  };

  const timeAgo = (iso: string) => {
    if (now === null) return "";
    const diff = now - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 0) return "just now";
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  return (
    <section id="live-feed" className="py-[108px] bg-surface">
      <div className="container-main">
        <div className="max-w-[640px] mb-12">
          <Tag>Attendee Record</Tag>
          <h2 className="text-[clamp(28px,3.2vw,40px)] mt-[18px]">Who was there</h2>
          <p className="mt-3 text-[15px] text-fg/68">
            Check-ins recorded at the Copenhagen reunion, 9–11 July 2026. The feed remains open, so anyone who attended can still be added.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {updates.length === 0 ? (
            <div className="text-center py-16 text-fg/40">
              <div className="text-[48px] mb-4">📍</div>
              <p className="text-[16px]">No check-ins recorded yet. If you attended, please ask the admin to add you.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map((u) => (
                <div key={u.id} className="flex gap-4 items-start bg-ivory-dim rounded-lg p-5">
                  <div className="w-10 h-10 rounded-full bg-burgundy text-ivory flex items-center justify-center text-[15px] font-medium shrink-0">
                    {u.attendee_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="font-medium text-[15px] text-heading">{u.attendee_name}</span>
                      <span className="font-mono text-[11px] text-fg/40 tracking-wider">{timeAgo(u.created_at)}</span>
                    </div>
                    {u.message && <p className="text-[14px] text-fg/70 mt-1">{u.message}</p>}
                    {u.photo_url && (
                      <img src={u.photo_url} alt="" loading="lazy" className="mt-3 rounded max-h-64 w-auto object-cover" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {isAdmin && (
            <form onSubmit={handlePost} className="mt-10 p-6 bg-ivory-dim rounded-lg border border-line">
              <h3 className="text-[16px] font-medium text-heading mb-4">Post a check-in</h3>
              <div className="space-y-3">
                <input
                  required
                  value={form.attendee_name}
                  onChange={e => setForm(f => ({ ...f, attendee_name: e.target.value }))}
                  placeholder="Attendee name"
                  className="w-full bg-card border border-line px-4 py-2.5 text-[14px] outline-none focus:border-gold-dim"
                />
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Message (optional)"
                  rows={2}
                  className="w-full bg-card border border-line px-4 py-2.5 text-[14px] outline-none focus:border-gold-dim resize-none"
                />
                <button type="submit" disabled={posting} className="bg-burgundy text-ivory text-[12px] tracking-widest uppercase py-2.5 px-6 rounded-sm hover:bg-burgundy-deep transition-colors disabled:opacity-50">
                  {posting ? "Posting..." : "Post Update"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
