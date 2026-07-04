"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, RefreshCw, Plus, Trash2 } from "lucide-react";

interface BudgetItem {
  item: string;
  cost: number;
  type: "one-time" | "monthly" | "annual";
}

interface BudgetData {
  build: BudgetItem[];
  monthly: BudgetItem[];
  annual: BudgetItem[];
}

type SectionKey = "build" | "monthly" | "annual";

const sectionLabels: Record<SectionKey, string> = {
  build: "Build Costs (One-Time)",
  monthly: "Monthly Run Costs",
  annual: "1-Year Maintenance Budget",
};

const sectionDescriptions: Record<SectionKey, string> = {
  build: "Initial setup and launch expenses",
  monthly: "Recurring costs to keep the platform running",
  annual: "Full-year projection including development & content",
};

export default function AdminBudgetPage() {
  const [data, setData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionKey | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/budget")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (mounted && d) setData(d); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const persist = useCallback(async (next: BudgetData) => {
    setSaving(true);
    try {
      await fetch("/api/budget", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
    } catch {}
    setSaving(false);
  }, []);

  const updateCost = (section: SectionKey, idx: number, cost: number) => {
    if (!data) return;
    const next = structuredClone(data);
    next[section][idx].cost = cost;
    setData(next);
    persist(next);
  };

  const updateItem = (section: SectionKey, idx: number, item: string) => {
    if (!data) return;
    const next = structuredClone(data);
    next[section][idx].item = item;
    setData(next);
    persist(next);
  };

  const addItem = (section: SectionKey) => {
    if (!data) return;
    const next = structuredClone(data);
    next[section].push({ item: "New item", cost: 0, type: section === "build" ? "one-time" : section === "monthly" ? "monthly" : "annual" });
    setData(next);
    persist(next);
  };

  const removeItem = (section: SectionKey, idx: number) => {
    if (!data) return;
    const next = structuredClone(data);
    next[section].splice(idx, 1);
    setData(next);
    persist(next);
  };

  const sumSection = (items: BudgetItem[]) => items.reduce((a, b) => a + b.cost, 0);

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
        <p className="text-charcoal/50 text-[14px] mb-4">Could not load budget data.</p>
        <button onClick={() => window.location.reload()} className="btn btn-outline text-[12px]">Retry</button>
      </div>
    );
  }

  const totalBuild = sumSection(data.build);
  const totalMonthly = sumSection(data.monthly);
  const totalAnnual = sumSection(data.annual);
  const grandTotal = totalBuild + totalAnnual;

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-burgundy-ink">Budget & Run Costs</h1>
          <p className="text-charcoal/50 text-[14px] mt-1">Transparent budget breakdown for fundraising</p>
        </div>
        <div className="flex items-center gap-3">
          {saving && <RefreshCw className="w-4 h-4 text-charcoal/30 animate-spin" />}
          <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-2 bg-forest/10 text-forest border border-forest/20">Editable</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4 mb-10">
        <div className="bg-ivory border border-line p-5">
          <div className="font-mono text-[9px] tracking-widest uppercase text-gold-dim mb-1">Build (one-time)</div>
          <div className="font-display text-[28px] text-burgundy-ink">${totalBuild.toFixed(2)}</div>
        </div>
        <div className="bg-ivory border border-line p-5">
          <div className="font-mono text-[9px] tracking-widest uppercase text-gold-dim mb-1">Monthly run</div>
          <div className="font-display text-[28px] text-burgundy-ink">${totalMonthly.toFixed(2)}</div>
        </div>
        <div className="bg-ivory border border-line p-5">
          <div className="font-mono text-[9px] tracking-widest uppercase text-gold-dim mb-1">Annual maintenance</div>
          <div className="font-display text-[28px] text-burgundy-ink">${totalAnnual.toFixed(2)}</div>
        </div>
        <div className="bg-burgundy-ink border border-line-on-dark p-5">
          <div className="font-mono text-[9px] tracking-widest uppercase text-gold-dim mb-1">Year 1 Grand Total</div>
          <div className="font-display text-[28px] text-gold-light">${grandTotal.toFixed(2)}</div>
        </div>
      </div>

      {/* Sections */}
      {(Object.keys(sectionLabels) as SectionKey[]).map((section) => {
        const items = data[section];
        const total = sumSection(items);
        const isEditing = editingSection === section;

        return (
          <div key={section} className="mb-8 border border-line bg-ivory">
            <div className="px-6 py-4 border-b border-line flex items-center justify-between">
              <div>
                <h2 className="font-display text-[16px] text-burgundy-ink">{sectionLabels[section]}</h2>
                <p className="text-charcoal/50 text-[12px] mt-0.5">{sectionDescriptions[section]}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[14px] text-burgundy font-[500]">${total.toFixed(2)}</span>
                <button
                  onClick={() => setEditingSection(isEditing ? null : section)}
                  className={`font-mono text-[9.5px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                    isEditing
                      ? "bg-burgundy text-ivory border-burgundy"
                      : "border-line text-charcoal/50 hover:border-charcoal/30"
                  }`}
                >
                  {isEditing ? "Done" : "Edit"}
                </button>
              </div>
            </div>

            <div className="divide-y divide-line">
              {items.map((entry, i) => (
                <div key={i} className="px-6 py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <input
                        value={entry.item}
                        onChange={(e) => updateItem(section, i, e.target.value)}
                        className="w-full bg-transparent border-0 border-b border-line py-1 text-[13.5px] text-charcoal focus:outline-0 focus:border-burgundy"
                      />
                    ) : (
                      <span className="text-[13.5px] text-charcoal/70">{entry.item}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[10px] text-charcoal/30">$</span>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={entry.cost}
                        onChange={(e) => updateCost(section, i, parseFloat(e.target.value) || 0)}
                        className="w-24 bg-transparent border-0 border-b border-line py-1 text-[13.5px] text-charcoal text-right font-mono focus:outline-0 focus:border-burgundy"
                      />
                    ) : (
                      <span className="font-mono text-[13.5px] text-charcoal w-24 text-right">{entry.cost.toFixed(2)}</span>
                    )}
                    {isEditing && (
                      <button onClick={() => removeItem(section, i)} className="p-1 text-charcoal/30 hover:text-red-600 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="px-6 py-3 border-t border-line">
                <button
                  onClick={() => addItem(section)}
                  className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-burgundy hover:text-burgundy/70 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Item
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Grand total bar */}
      <div className="border border-gold/30 bg-gold/5 p-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-[18px] text-burgundy-ink">Year 1 Total Investment</h3>
          <p className="text-charcoal/50 text-[13px] mt-1">Build costs + 12 months of operation & maintenance</p>
        </div>
        <div className="text-right">
          <div className="font-display text-[36px] text-burgundy-ink">${grandTotal.toFixed(2)}</div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">~${(grandTotal / 12).toFixed(2)}/month</div>
        </div>
      </div>
    </div>
  );
}
