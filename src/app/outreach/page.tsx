"use client";

import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export default function OutreachPage() {
  const [stats, setStats] = useState<Any>(null);
  const [loading, setLoading] = useState(true);
  const [initStatus, setInitStatus] = useState<string>("");

  async function fetchStats() {
    try {
      const r = await fetch("/api/outreach/stats");
      if (r.ok) setStats(await r.json());
      else setInitStatus("Database not initialized yet. Click init.");
    } catch { setInitStatus("Failed to load."); }
    setLoading(false);
  }

  useEffect(() => {
    fetchStats();
  }, []);

  async function initDB() {
    setInitStatus("Initializing...");
    try {
      const r = await fetch("/api/outreach/init", { method: "POST" });
      const data = await r.json();
      if (r.ok) {
        setInitStatus(`Seeded ${data.profiles} profiles, ${data.blindSpots} blind spots`);
        fetchStats();
      } else {
        setInitStatus(`Error: ${data.error}`);
      }
    } catch { setInitStatus("Init failed."); }
  }

  return (
    <div>
      <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-burgundy-ink mb-2">Outreach Console</h1>
      <p className="text-charcoal/50 text-[14px] mb-8">
        Find every Lutterodt globally. Generate, schedule, and send one letter per day.
      </p>

      {initStatus && (
        <div className="mb-6 p-4 bg-ivory border border-line flex items-center justify-between">
          <span className="text-[13px]">{initStatus}</span>
          {initStatus.includes("not initialized") && (
            <button onClick={initDB} className="btn-primary text-[11px] px-4 py-2">Initialize Database</button>
          )}
        </div>
      )}

      {!loading && !stats && (
        <div className="mb-6 p-6 bg-ivory border border-line text-center">
          <p className="text-charcoal/50 text-[14px] mb-3">Database not seeded yet.</p>
          <button onClick={initDB} className="btn-primary">Seed Database from Profiles</button>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-ivory border border-line p-6 animate-pulse">
              <div className="h-3 bg-charcoal/5 rounded w-20 mb-4" />
              <div className="h-8 bg-charcoal/5 rounded w-16" />
            </div>
          ))}
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4 mb-8">
            <StatCard label="Total Profiles" value={stats.total} />
            <StatCard label="With Letters" value={stats.withLetters} />
            <StatCard label="Blind Spots" value={stats.blindSpots} />
            <StatCard label="In Queue" value={stats.queue?.pending || 0} />
          </div>

          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 mb-8">
            <div className="bg-ivory border border-line p-6">
              <h3 className="font-mono text-[10.5px] tracking-widest uppercase text-gold-dim mb-4">Categories</h3>
              <div className="space-y-2">
                {(stats.categories || []).map((c: { category: string; c: number }) => (
                  <div key={c.category} className="flex items-center justify-between text-[13px]">
                    <span className="capitalize">{c.category}</span>
                    <span className="font-mono text-[12px] text-charcoal/50">{c.c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-ivory border border-line p-6">
              <h3 className="font-mono text-[10.5px] tracking-widest uppercase text-gold-dim mb-4">Letter Status</h3>
              <div className="space-y-2">
                {Object.entries(stats.statusBreakdown || {}).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between text-[13px]">
                    <span className="capitalize">{status}</span>
                    <span className="font-mono text-[12px] text-charcoal/50">{String(count)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-ivory border border-line p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-[10.5px] tracking-widest uppercase text-gold-dim">Quick Actions</h3>
              <span className="font-mono text-[9.5px] tracking-widest uppercase text-gold-dim">One letter per day</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/outreach/queue" className="btn-primary text-[11px]">View Queue</a>
              <a href="/outreach/discover" className="btn-outline text-[11px]">Discover New Lutterodts</a>
              <a href="/outreach/blind-spots" className="btn-outline text-[11px]">Research Gaps</a>
              <a href="/admin" className="btn-ghost text-[11px]">Back to Admin</a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-ivory border border-line p-6">
      <div className="font-mono text-[10px] tracking-widest uppercase text-charcoal/40 mb-2">{label}</div>
      <div className="font-display text-[32px] text-burgundy-ink">{value}</div>
    </div>
  );
}
