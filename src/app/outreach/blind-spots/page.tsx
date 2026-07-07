"use client";

import { useEffect, useState } from "react";

export default function BlindSpotsPage() {
  const [spots, setSpots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/outreach/blind-spots")
      .then(r => r.json())
      .then(d => { setSpots(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? spots : spots.filter(s => s.status === filter || s.priority === filter);
  const overallProgress = spots.length > 0
    ? Math.round(spots.reduce((sum, s) => sum + (s.progress || 0), 0) / spots.length)
    : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[clamp(22px,2.5vw,30px)] font-display text-burgundy-ink">Research Blind Spots</h1>
          <p className="text-charcoal/50 text-[13px] mt-1">
            {spots.filter(s => s.status === "open").length} open &middot; {spots.filter(s => s.status === "partial" || s.status === "in-progress").length} in progress
          </p>
        </div>
        <div className="text-right">
          <div className="font-display text-[28px] text-gold-dim">{overallProgress}%</div>
          <div className="font-mono text-[9px] tracking-widest uppercase text-charcoal/40">Overall Progress</div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "open", "in-progress", "partial", "high", "medium"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
              filter === f ? "bg-burgundy text-ivory border-burgundy" : "border-line text-charcoal/50 hover:border-charcoal/30"
            }`}>
            {f === "in-progress" ? "In Progress" : f}
          </button>
        ))}
      </div>

      {loading && <p className="text-charcoal/50 text-[13px]">Loading...</p>}

      {!loading && (
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
          {filtered.map((spot) => (
            <div key={spot.id} className="bg-ivory border border-line p-5">
              <div className="flex items-center justify-between mb-2">
                <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 ${
                  spot.priority === "high" ? "bg-burgundy/10 text-burgundy" : "bg-gold-dim/10 text-gold-dim"
                }`}>{spot.priority} priority</span>
                <span className={`font-mono text-[9px] tracking-widest uppercase ${
                  spot.status === "open" ? "text-charcoal/30" :
                  spot.status === "in-progress" ? "text-gold-dim" :
                  "text-forest"
                }`}>{spot.status}</span>
              </div>
              <h3 className="text-[16px] font-[500] mb-2">{spot.title}</h3>
              <div className="mt-3">
                <div className="h-1.5 bg-charcoal/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold-dim rounded-full transition-all" style={{ width: `${spot.progress}%` }} />
                </div>
                <span className="font-mono text-[10px] tracking-widest text-charcoal/40 mt-1 block">{spot.progress}% mapped</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
