"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  CheckCircle2,
  Circle,
  PlayCircle,
  RefreshCw,
  ShieldCheck,
  ListChecks,
  Clock,
  RotateCcw,
} from "lucide-react";

type ItemStatus = "pending" | "in_progress" | "completed";

interface RoadmapItem {
  text: string;
  status: ItemStatus;
  autoDetected: boolean;
  detail?: string;
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
  done: number;
  total: number;
  percent: number;
}

interface RoadmapSprint {
  sprint: string;
  focus: string;
  status: ItemStatus;
  autoDetected: boolean;
  detail?: string;
}

interface RoadmapResponse {
  phases: RoadmapPhase[];
  sprints: RoadmapSprint[];
  totals: {
    items: number;
    done: number;
    pending: number;
    percent: number;
    sprintsDone: number;
    sprintsTotal: number;
    autoVerified: number;
  };
  syncedAt: string;
}

const statusIcon = (s: ItemStatus) => {
  switch (s) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4 text-success-text" />;
    case "in_progress":
      return <PlayCircle className="w-4 h-4 text-gold-dim" />;
    default:
      return <Circle className="w-4 h-4 text-fg/20" />;
  }
};

const statusLabel = (s: ItemStatus) => {
  switch (s) {
    case "completed":
      return "Done";
    case "in_progress":
      return "In Progress";
    default:
      return "Pending";
  }
};

const statusColor = (s: ItemStatus) => {
  switch (s) {
    case "completed":
      return "bg-forest/10 text-success-text border-forest/20";
    case "in_progress":
      return "bg-gold-dim/10 text-gold-dim border-gold-dim/20";
    default:
      return "bg-charcoal/5 text-fg/40 border-charcoal/10";
  }
};

const phaseBadgeColor = [
  "bg-burgundy/10 text-accent-text border-burgundy/20",
  "bg-gold-dim/10 text-gold-dim border-gold-dim/20",
  "bg-forest/10 text-success-text border-forest/20",
  "bg-charcoal/10 text-fg border-charcoal/20",
];

const phaseSolidColor = [
  "bg-burgundy text-ivory border-burgundy",
  "bg-gold text-heading border-gold",
  "bg-forest text-ivory border-forest",
  "bg-charcoal text-ivory border-charcoal",
];

export default function AdminRoadmapPage() {
  const [data, setData] = useState<RoadmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/roadmap")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = useCallback(
    async (text: string) => {
      setSaving(text);
      await fetch("/api/roadmap", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "toggle", text }),
      }).catch(() => {});
      setSaving(null);
      load();
    },
    [load]
  );

  const reset = useCallback(async () => {
    if (!confirm("Reset all manual roadmap statuses back to their tracked defaults? Auto-verified items are unaffected.")) return;
    setSaving("__reset__");
    await fetch("/api/roadmap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    }).catch(() => {});
    setSaving(null);
    load();
  }, [load]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-fg/30 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-fg/50 text-[14px] mb-4">Could not load roadmap.</p>
        <button onClick={load} className="btn btn-outline text-[12px]">
          Retry
        </button>
      </div>
    );
  }

  const { totals } = data;
  const activePhase = data.phases.find((p) => p.status === "in_progress") ?? data.phases[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-heading">Build Roadmap</h1>
          <p className="text-fg/50 text-[14px] mt-1">
            {totals.autoVerified} items verified against live system state · {totals.items - totals.autoVerified}{" "}
            tracked manually
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saving && <RefreshCw className="w-4 h-4 text-fg/30 animate-spin" />}
          <span
            className={`font-mono text-[10px] tracking-widest uppercase px-3 py-2 border ${
              activePhase ? phaseBadgeColor[data.phases.indexOf(activePhase)] : phaseBadgeColor[0]
            }`}
          >
            {activePhase ? `${activePhase.num} — ${statusLabel(activePhase.status)}` : "—"}
          </span>
          <button
            onClick={reset}
            disabled={!!saving}
            title="Reset manual statuses to tracked defaults"
            className="flex items-center gap-1.5 text-[12px] text-fg/40 hover:text-fg transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 text-[13px] text-fg/40 hover:text-fg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Syncing..." : "Re-sync"}
          </button>
        </div>
      </div>

      <div className="bg-card border border-line p-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 h-2.5 bg-charcoal/5 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gold-dim rounded-full transition-all duration-500"
              style={{ width: `${totals.percent}%` }}
            />
          </div>
          <span className="text-[14px] text-fg whitespace-nowrap">
            {totals.done}/{totals.items} ({totals.percent}%)
          </span>
        </div>
        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <span className="font-mono text-[10px] tracking-widest uppercase text-fg/30">
            Sprints {totals.sprintsDone}/{totals.sprintsTotal} · {totals.pending} open
          </span>
          {data.syncedAt && (
            <span className="flex items-center gap-1.5 text-[12px] text-fg/30">
              <Clock className="w-3 h-3" />
              Synced {new Date(data.syncedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-0 border border-line mb-10">
        {data.phases.map((p, i) => (
          <div
            key={p.num}
            className="p-5 text-center border-r border-line last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0"
          >
            <div className={`inline-block font-mono text-[9px] tracking-widest uppercase px-3 py-1 mb-2 border ${phaseSolidColor[i]}`}>
              {statusLabel(p.status)}
            </div>
            <div className="font-display text-[18px] text-heading">{p.title}</div>
            <div className="font-mono text-[9.5px] text-fg/30 mt-1">
              {p.done}/{p.total} · {p.percent}%
            </div>
          </div>
        ))}
      </div>

      {data.phases.map((phase, pi) => (
        <div key={phase.num} className="mb-10 border border-line bg-surface">
          <div className="px-6 py-5 border-b border-line flex items-center gap-4">
            <span className="font-mono text-[28px] font-[500] text-gold-dim/30">{phase.num}</span>
            <div className="flex-1">
              <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">{phase.subtitle}</span>
              <h2 className="font-display text-[20px] text-heading">{phase.title}</h2>
              <p className="text-fg/50 text-[13px] mt-0.5">{phase.goal}</p>
            </div>
            <div className="text-right">
              <span className={`font-mono text-[9.5px] tracking-widest uppercase px-3 py-1.5 border ${phaseBadgeColor[pi]}`}>
                {statusLabel(phase.status)}
              </span>
              <div className="font-mono text-[9.5px] text-fg/30 mt-1.5">
                {phase.done}/{phase.total} · {phase.percent}%
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {phase.sections.map((section, si) => (
              <div key={si}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-[15px] text-accent-text flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-gold inline-block" />
                    {section.title}
                  </h3>
                  <span className="font-mono text-[9.5px] tracking-wider text-fg/30">
                    {section.items.filter((i) => i.status === "completed").length}/{section.items.length}
                  </span>
                </div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isSaving = saving === item.text;
                    const content = (
                      <>
                        <span className="shrink-0">{statusIcon(item.status)}</span>
                        <span className="flex-1 min-w-0">
                          <span
                            className={`text-[13.5px] ${
                              item.status === "completed" ? "text-fg/40 line-through" : "text-fg/70"
                            }`}
                          >
                            {item.text}
                          </span>
                          {item.detail && (
                            <span className="block font-mono text-[10px] text-fg/30 mt-0.5">{item.detail}</span>
                          )}
                        </span>
                        <span
                          className={`shrink-0 font-mono text-[8.5px] tracking-widest uppercase px-2 py-0.5 border ${
                            item.autoDetected ? "text-fg/20 border-transparent" : `${statusColor(item.status)} opacity-0 group-hover:opacity-100 transition-opacity`
                          }`}
                          title={item.autoDetected ? "Verified live against the running system" : "Manual — click to cycle status"}
                        >
                          {item.autoDetected ? (
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              live
                            </span>
                          ) : (
                            statusLabel(item.status)
                          )}
                        </span>
                      </>
                    );

                    return item.autoDetected ? (
                      <div
                        key={item.text}
                        className="flex items-start gap-3 px-4 py-2.5 group"
                        title="Verified live against the running system"
                      >
                        {content}
                      </div>
                    ) : (
                      <div
                        key={item.text}
                        role="button"
                        tabIndex={0}
                        aria-label={`${item.text} — currently ${statusLabel(item.status)}`}
                        onClick={() => !isSaving && toggle(item.text)}
                        onKeyDown={(e) => {
                          if ((e.key === "Enter" || e.key === " ") && !isSaving) {
                            e.preventDefault();
                            toggle(item.text);
                          }
                        }}
                        className="flex items-start gap-3 px-4 py-2.5 hover:bg-ivory-dim/50 transition-colors cursor-pointer group"
                      >
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {phase.deliverables && phase.deliverables.length > 0 && (
            <div className="px-6 py-4 border-t border-line bg-ivory-dim/50">
              <h4 className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mb-2">Deliverables</h4>
              <div className="flex flex-wrap gap-2">
                {phase.deliverables.map((d, i) => (
                  <span
                    key={i}
                    className="font-mono text-[9.5px] tracking-wider uppercase px-2.5 py-1 bg-forest/5 text-success-text border border-forest/10"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="border border-line bg-surface">
        <div className="px-6 py-4 border-b border-line flex items-center justify-between">
          <h2 className="font-display text-[16px] text-heading">Development Sprints</h2>
          <span className="font-mono text-[9.5px] tracking-wider text-fg/30">
            {data.totals.sprintsDone}/{data.totals.sprintsTotal}
          </span>
        </div>
        <div className="divide-y divide-line">
          {data.sprints.map((s) => (
            <div key={s.sprint} className="px-6 py-3 flex items-center gap-4 group" title={s.detail || undefined}>
              <span className="shrink-0">{statusIcon(s.status)}</span>
              <span className="font-mono text-[10px] tracking-widest text-gold-dim w-[80px] shrink-0">{s.sprint}</span>
              <div className="h-[1px] flex-1 bg-line" />
              <span
                className={`text-[13.5px] flex-1 ${s.status === "completed" ? "text-fg/40 line-through" : "text-fg/60"}`}
              >
                {s.focus}
              </span>
              {s.autoDetected && (
                <span className="shrink-0 font-mono text-[8.5px] tracking-widest uppercase text-fg/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  live
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase text-fg/25">
        <ListChecks className="w-3 h-3" />
        Items marked live re-check themselves against the deployed system on every load
      </p>
    </div>
  );
}
