"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, CheckCircle2, Circle, ListChecks, RefreshCw, Rocket } from "lucide-react";

interface CheckItem {
  text: string;
  status: "pending" | "completed";
}

interface CheckCategory {
  title: string;
  items: CheckItem[];
}

interface PrelaunchData {
  categories: CheckCategory[];
}

const nextStatus = (s: CheckItem["status"]): CheckItem["status"] =>
  s === "pending" ? "completed" : "pending";

export default function AdminPrelaunchPage() {
  const [data, setData] = useState<PrelaunchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch("/api/prelaunch")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleItem = useCallback(
    (catIdx: number, itemIdx: number) => {
      if (!data || saving) return;
      const updated = {
        ...data,
        categories: data.categories.map((cat, ci) =>
          ci === catIdx
            ? {
                ...cat,
                items: cat.items.map((item, ii) =>
                  ii === itemIdx ? { ...item, status: nextStatus(item.status) } : item
                ),
              }
            : cat
        ),
      };
      setData(updated);
      setSaving(true);
      fetch("/api/prelaunch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      })
        .then(() => setSaving(false))
        .catch(() => setSaving(false));
    },
    [data, saving]
  );

  const total = data?.categories.reduce((s, c) => s + c.items.length, 0) ?? 0;
  const done = data?.categories.reduce((s, c) => s + c.items.filter((i) => i.status === "completed").length, 0) ?? 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  if (loading) {
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
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-burgundy-ink">Prelaunch Checklist</h1>
          <p className="text-charcoal/50 text-[14px] mt-1">
            Everything needed before the site goes live
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 text-[13px] text-charcoal/40 hover:text-charcoal transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="mb-8 bg-white rounded-sm border border-line p-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="relative w-full h-2.5 bg-charcoal/5 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gold-dim rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[14px] font-medium text-charcoal whitespace-nowrap">
            {done}/{total} ({pct}%)
          </span>
        </div>
        {pct === 100 && (
          <div className="flex items-center gap-2 text-forest text-[14px] font-medium">
            <Rocket className="w-4 h-4" />
            All items complete — ready to launch!
          </div>
        )}
      </div>

      <div className="space-y-6">
        {data?.categories.map((cat, catIdx) => {
          const catDone = cat.items.filter((i) => i.status === "completed").length;
          return (
            <div key={cat.title} className="bg-white rounded-sm border border-line">
              <div className="flex items-center justify-between px-6 py-4 border-b border-line">
                <h2 className="font-display text-[16px] text-burgundy-ink">{cat.title}</h2>
                <span className="text-[12px] text-charcoal/40 font-mono">
                  {catDone}/{cat.items.length}
                </span>
              </div>
              <div className="divide-y divide-line">
                {cat.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => toggleItem(catIdx, itemIdx)}
                    disabled={saving}
                    className="w-full flex items-start gap-4 px-6 py-3.5 text-left hover:bg-charcoal/[0.02] transition-colors disabled:opacity-50"
                  >
                    {item.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 text-forest shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-charcoal/20 shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-[14px] leading-relaxed ${
                        item.status === "completed"
                          ? "text-charcoal/40 line-through"
                          : "text-charcoal"
                      }`}
                    >
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
