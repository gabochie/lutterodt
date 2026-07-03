"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, CheckCircle2, Circle, PlayCircle, RefreshCw } from "lucide-react";

type ItemStatus = "pending" | "in_progress" | "completed";

interface RoadmapItem {
  text: string;
  status: ItemStatus;
}

interface RoadmapSection {
  title: string;
  items: RoadmapItem[];
}

interface RoadmapPhase {
  num: string;
  title: string;
  subtitle: string;
  goal: string;
  status: ItemStatus;
  sections: RoadmapSection[];
  deliverables?: string[];
}

interface RoadmapSprint {
  sprint: string;
  focus: string;
  status: ItemStatus;
}

interface RoadmapData {
  phases: RoadmapPhase[];
  sprints: RoadmapSprint[];
}

const statusIcon = (s: ItemStatus) => {
  switch (s) {
    case "completed": return <CheckCircle2 className="w-4 h-4 text-forest" />;
    case "in_progress": return <PlayCircle className="w-4 h-4 text-gold-dim" />;
    default: return <Circle className="w-4 h-4 text-charcoal/20" />;
  }
};

const statusLabel = (s: ItemStatus) => {
  switch (s) {
    case "completed": return "Done";
    case "in_progress": return "In Progress";
    default: return "Pending";
  }
};

const statusColor = (s: ItemStatus) => {
  switch (s) {
    case "completed": return "bg-forest/10 text-forest border-forest/20";
    case "in_progress": return "bg-gold-dim/10 text-gold-dim border-gold-dim/20";
    default: return "bg-charcoal/5 text-charcoal/40 border-charcoal/10";
  }
};

const nextStatus = (s: ItemStatus): ItemStatus => {
  switch (s) {
    case "pending": return "in_progress";
    case "in_progress": return "completed";
    case "completed": return "pending";
  }
};

export default function AdminRoadmapPage() {
  const [data, setData] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchRoadmap = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/roadmap");
      if (r.ok) setData(await r.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchRoadmap(); }, [fetchRoadmap]);

  const persist = useCallback(async (next: RoadmapData) => {
    setSaving(true);
    try {
      await fetch("/api/roadmap", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
    } catch {}
    setSaving(false);
  }, []);

  const toggleItem = (phaseIdx: number, sectionIdx: number, itemIdx: number) => {
    if (!data) return;
    const next = structuredClone(data);
    const item = next.phases[phaseIdx].sections[sectionIdx].items[itemIdx];
    item.status = nextStatus(item.status);
    setData(next);
    persist(next);
  };

  const toggleSprint = (idx: number) => {
    if (!data) return;
    const next = structuredClone(data);
    next.sprints[idx].status = nextStatus(next.sprints[idx].status);
    setData(next);
    persist(next);
  };

  const completionRatio = (items: RoadmapItem[]) => {
    const done = items.filter((i) => i.status === "completed").length;
    return items.length > 0 ? `${done}/${items.length}` : "0/0";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-charcoal/30 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-charcoal/50 text-[14px] mb-4">Could not load roadmap.</p>
        <button onClick={fetchRoadmap} className="btn btn-outline text-[12px]">Retry</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-burgundy-ink">Build Roadmap</h1>
          <p className="text-charcoal/50 text-[14px] mt-1">The Lutterodt Renaissance — Product Build Roadmap</p>
        </div>
        <div className="flex items-center gap-3">
          {saving && <RefreshCw className="w-4 h-4 text-charcoal/30 animate-spin" />}
          <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-2 bg-forest/10 text-forest border border-forest/20">Phase 1: In Progress</span>
        </div>
      </div>

      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-0 border border-line mb-10">
        {data.phases.map((p, i) => {
          const phaseColors = [
            "bg-burgundy text-ivory border-burgundy",
            "bg-gold text-burgundy-ink border-gold",
            "bg-forest text-ivory border-forest",
            "bg-charcoal text-ivory border-charcoal",
          ];
          return (
            <div key={i} className="p-5 text-center border-r border-line last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0">
              <div className={`inline-block font-mono text-[9px] tracking-widest uppercase px-3 py-1 mb-2 border ${phaseColors[i]}`}>
                {statusLabel(p.status)}
              </div>
              <div className="font-display text-[18px] text-burgundy-ink">{p.title}</div>
            </div>
          );
        })}
      </div>

      {data.phases.map((phase, pi) => (
        <div key={pi} className="mb-10 border border-line bg-ivory">
          <div className="px-6 py-5 border-b border-line flex items-center gap-4">
            <span className="font-mono text-[28px] font-[500] text-gold-dim/30">{phase.num}</span>
            <div className="flex-1">
              <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">{phase.subtitle}</span>
              <h2 className="font-display text-[20px] text-burgundy-ink">{phase.title}</h2>
              <p className="text-charcoal/50 text-[13px] mt-0.5">{phase.goal}</p>
            </div>
            <span className={`font-mono text-[9.5px] tracking-widest uppercase px-3 py-1.5 border ${[
              "bg-burgundy/10 text-burgundy border-burgundy/20",
              "bg-gold-dim/10 text-gold-dim border-gold-dim/20",
              "bg-forest/10 text-forest border-forest/20",
              "bg-charcoal/10 text-charcoal border-charcoal/20",
            ][pi]}`}>
              {statusLabel(phase.status)}
            </span>
          </div>

          <div className="p-6 space-y-6">
            {phase.sections.map((section, si) => (
              <div key={si}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-[15px] text-burgundy flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-gold inline-block" />
                    {section.title}
                  </h3>
                  <span className="font-mono text-[9.5px] tracking-wider text-charcoal/30">
                    {completionRatio(section.items)}
                  </span>
                </div>
                <div className="space-y-1">
                  {section.items.map((item, ii) => (
                    <div
                      key={ii}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-ivory-dim/50 transition-colors cursor-pointer group"
                      onClick={() => toggleItem(pi, si, ii)}
                    >
                      <span className="shrink-0">{statusIcon(item.status)}</span>
                      <span className={`text-[13.5px] flex-1 ${item.status === "completed" ? "text-charcoal/40 line-through" : "text-charcoal/70"}`}>
                        {item.text}
                      </span>
                      <span className={`font-mono text-[8.5px] tracking-widest uppercase px-2 py-0.5 border opacity-0 group-hover:opacity-100 transition-opacity ${statusColor(item.status)}`}>
                        {statusLabel(item.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {phase.deliverables && phase.deliverables.length > 0 && (
            <div className="px-6 py-4 border-t border-line bg-ivory-dim/50">
              <h4 className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mb-2">Deliverables</h4>
              <div className="flex flex-wrap gap-2">
                {phase.deliverables.map((d, i) => (
                  <span key={i} className="font-mono text-[9.5px] tracking-wider uppercase px-2.5 py-1 bg-forest/5 text-forest border border-forest/10">{d}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="border border-line bg-ivory">
        <div className="px-6 py-4 border-b border-line flex items-center justify-between">
          <h2 className="font-display text-[16px] text-burgundy-ink">Development Sprints</h2>
          <span className="font-mono text-[9.5px] tracking-wider text-charcoal/30">
            {data.sprints.filter((s) => s.status === "completed").length}/{data.sprints.length}
          </span>
        </div>
        <div className="divide-y divide-line">
          {data.sprints.map((s, i) => (
            <div
              key={i}
              className="px-6 py-3 flex items-center gap-4 hover:bg-ivory-dim/50 transition-colors cursor-pointer group"
              onClick={() => toggleSprint(i)}
            >
              <span className="shrink-0">{statusIcon(s.status)}</span>
              <span className="font-mono text-[10px] tracking-widest text-gold-dim w-[80px] shrink-0">{s.sprint}</span>
              <div className="h-[1px] flex-1 bg-line" />
              <span className={`text-[13.5px] flex-1 ${s.status === "completed" ? "text-charcoal/40 line-through" : "text-charcoal/60"}`}>
                {s.focus}
              </span>
              <span className={`font-mono text-[8.5px] tracking-widest uppercase px-2 py-0.5 border opacity-0 group-hover:opacity-100 transition-opacity ${statusColor(s.status)}`}>
                {statusLabel(s.status)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
