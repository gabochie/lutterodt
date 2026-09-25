"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, CheckCircle2, Circle, RefreshCw, ShieldCheck, Clock, ListChecks, Rocket } from "lucide-react";

interface CheckItem {
  text: string;
  status: "pending" | "completed";
  autoDetected: boolean;
  detail?: string;
}

interface CheckCategory {
  title: string;
  items: CheckItem[];
}

interface PrelaunchResponse {
  categories: CheckCategory[];
  total: number;
  done: number;
  checkedAt: string;
}

export default function AdminPrelaunchPage() {
  const [data, setData] = useState<PrelaunchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch("/api/prelaunch")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleManual = useCallback((text: string, status: "pending" | "completed") => {
    setSaving(text);
    fetch("/api/prelaunch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", text, status }),
    })
      .then(() => { setSaving(null); fetchData(); })
      .catch(() => setSaving(null));
  }, [fetchData]);

  const pct = data && data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gold-dim" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-heading">Prelaunch Checklist</h1>
          <p className="text-fg/50 text-[14px] mt-1">
            Status is auto-detected where possible — shows live system state
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 text-[13px] text-fg/40 hover:text-fg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Checking..." : "Re-check all"}
        </button>
      </div>

      <div className="mb-8 bg-card rounded-sm border border-line p-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 h-2.5 bg-charcoal/5 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gold-dim rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[14px] font-medium text-fg whitespace-nowrap">
            {data?.done}/{data?.total} ({pct}%)
          </span>
        </div>
        <div className="flex items-center justify-between mt-3">
          {pct === 100 ? (
            <div className="flex items-center gap-2 text-success-text text-[14px] font-medium">
              <Rocket className="w-4 h-4" />
              All items complete — ready to launch!
            </div>
          ) : (
            <span />
          )}
          {data?.checkedAt && (
            <div className="flex items-center gap-1.5 text-[12px] text-fg/30">
              <Clock className="w-3 h-3" />
              Last checked: {new Date(data.checkedAt).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {data?.categories.map((cat) => {
          const catDone = cat.items.filter((i) => i.status === "completed").length;
          return (
            <div key={cat.title} className="bg-card rounded-sm border border-line">
              <div className="flex items-center justify-between px-6 py-4 border-b border-line">
                <h2 className="font-display text-[16px] text-heading">{cat.title}</h2>
                <span className="text-[12px] text-fg/40 font-mono">
                  {catDone}/{cat.items.length}
                </span>
              </div>
              <div className="divide-y divide-line">
                {cat.items.map((item) => {
                  const isSaving = saving === item.text;
                  return (
                    <div
                      key={item.text}
                      className="group flex items-start gap-4 px-6 py-3.5"
                    >
                      {item.autoDetected ? (
                        item.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-success-text shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-fg/20 shrink-0 mt-0.5" />
                        )
                      ) : (
                        <button
                          onClick={() => toggleManual(item.text, item.status === "pending" ? "completed" : "pending")}
                          disabled={isSaving}
                          className="shrink-0 mt-0.5 disabled:opacity-50"
                        >
                          {item.status === "completed" ? (
                            <CheckCircle2 className="w-5 h-5 text-success-text hover:text-success-text/70 transition-colors" />
                          ) : (
                            <Circle className="w-5 h-5 text-fg/20 hover:text-fg/40 transition-colors" />
                          )}
                        </button>
                      )}
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-[14px] leading-relaxed ${
                            item.status === "completed"
                              ? "text-fg/40 line-through"
                              : "text-fg"
                          }`}
                        >
                          {item.text}
                        </span>
                        {item.detail && (
                          <span className="ml-2 text-[11px] text-fg/30 font-mono">
                            {item.detail}
                          </span>
                        )}
                      </div>
                      <span
                        className={`shrink-0 text-[10px] font-mono uppercase tracking-wider mt-1 ${
                          item.autoDetected ? "text-fg/20" : "text-gold-dim/40"
                        }`}
                        title={item.autoDetected ? "Auto-detected — live system check" : "Manual — click to toggle"}
                      >
                        {item.autoDetected ? (
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            auto
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <ListChecks className="w-3 h-3" />
                            manual
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
