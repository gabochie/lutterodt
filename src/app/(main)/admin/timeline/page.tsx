"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2 } from "lucide-react";

const initialEntries = [
  { id: "1", year: "1847", title: "The First Landing", category: "Businesses", date: "Added 20 Jun 2026" },
  { id: "2", year: "1889", title: "Birth of Joseph Kwame Lutterodt", category: "Births", date: "Added 20 Jun 2026" },
  { id: "3", year: "1921", title: "The Trading House Opens", category: "Businesses", date: "Added 18 Jun 2026" },
  { id: "4", year: "1943", title: "Wartime Rationing Committee", category: "Public Service", date: "Added 18 Jun 2026" },
  { id: "5", year: "1968", title: "First of the Family to Read Law", category: "Education", date: "Added 15 Jun 2026" },
  { id: "6", year: "1982", title: "Appointment to National Planning Commission", category: "National", date: "Added 15 Jun 2026" },
  { id: "7", year: "1986", title: "Harbour Road House Restored", category: "Achievements", date: "Added 12 Jun 2026" },
  { id: "8", year: "1994", title: "The London Branch Begins", category: "Births", date: "Added 12 Jun 2026" },
  { id: "9", year: "2019", title: "Harbour Road House Restored, Again", category: "Achievements", date: "Added 10 Jun 2026" },
  { id: "10", year: "2026", title: "The Renaissance Archive Launches", category: "Achievements", date: "Added 10 Jun 2026" },
];

const categories = ["All", "Births", "Achievements", "Businesses", "Public Service", "Education", "National"];

export default function AdminTimelinePage() {
  const [filter, setFilter] = useState("All");
  const [entries] = useState(initialEntries);

  const filtered = filter === "All" ? entries : entries.filter((e) => e.category === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-burgundy-ink">Timeline</h1>
          <p className="text-charcoal/50 text-[14px] mt-1">Manage historical timeline entries</p>
        </div>
        <button className="btn btn-primary text-[12px]">
          <Plus className="w-4 h-4" />
          Add Entry
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`font-mono text-[10.5px] tracking-widest uppercase px-4 py-2 border transition-colors ${
              filter === c
                ? "border-burgundy bg-burgundy text-ivory"
                : "border-line text-charcoal/50 hover:border-charcoal/30"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="bg-ivory border border-line divide-y divide-line">
        {filtered.map((entry) => (
          <div key={entry.id} className="px-6 py-4 flex items-center justify-between hover:bg-ivory-dim/50 transition-colors">
            <div className="flex items-center gap-6">
              <span className="font-mono text-[14px] text-gold-dim font-[500] w-[60px]">{entry.year}</span>
              <div>
                <div className="text-[14px] text-charcoal">{entry.title}</div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-[9.5px] tracking-wider uppercase text-forest bg-forest/5 px-2 py-0.5">{entry.category}</span>
                  <span className="font-mono text-[10px] text-charcoal/40">{entry.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-charcoal/40 hover:text-burgundy transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
              <button className="p-1.5 text-charcoal/40 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
