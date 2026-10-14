"use client";

import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Loader2, X, Check } from "lucide-react";

interface Entry { id: number; year: string; title: string; category: string; created_at: string; }

const categories = ["All", "Births", "Achievements", "Businesses", "Public Service", "Education", "National"];

export default function AdminTimelinePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ year: "", title: "", category: "Achievements", description: "" });

  const fetchEntries = async () => {
    setLoading(true);
    const res = await fetch("/api/timeline");
    if (res.ok) { const d = await res.json(); setEntries(d.entries || []); }
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, []);

  const openNew = () => { setEditId(null); setForm({ year: "", title: "", category: "Achievements", description: "" }); setShowForm(true); };

  const openEdit = (e: Entry) => { setEditId(e.id); setForm({ year: e.year, title: e.title, category: e.category, description: "" }); setShowForm(true); };

  const save = async () => {
    if (!form.year || !form.title) return;
    const url = editId ? `/api/timeline/${editId}` : "/api/timeline";
    const method = editId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false); fetchEntries();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/timeline/${id}`, { method: "DELETE" });
    fetchEntries();
  };

  const filtered = filter === "All" ? entries : entries.filter((e) => e.category === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-heading">Timeline</h1>
          <p className="text-fg/50 text-[14px] mt-1">Manage historical timeline entries</p>
        </div>
        <button onClick={openNew} className="btn btn-primary text-[12px]"><Plus className="w-4 h-4" /> Add Entry</button>
      </div>

      {showForm && (
        <div className="mb-6 p-5 bg-ivory-dim border border-line">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-[15px] text-heading">{editId ? "Edit Entry" : "New Entry"}</h3>
            <button onClick={() => setShowForm(false)} className="text-fg/40 hover:text-fg"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-4 mb-4">
            <input placeholder="Year (e.g. 1847)" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="border border-line bg-transparent px-3 py-2 text-[14px] text-fg focus:outline-0 focus:border-azure" />
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-line bg-transparent px-3 py-2 text-[14px] text-fg focus:outline-0 focus:border-azure" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border border-line bg-transparent px-3 py-2 text-[14px] text-fg focus:outline-0 focus:border-azure">
              {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="btn btn-primary text-[11px]"><Check className="w-3.5 h-3.5" /> {editId ? "Update" : "Create"}</button>
            <button onClick={() => setShowForm(false)} className="btn btn-outline text-[11px]">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`font-mono text-[10.5px] tracking-widest uppercase px-4 py-2 border transition-colors ${filter === c ? "border-azure bg-azure text-ivory" : "border-line text-fg/50 hover:border-charcoal/30"}`}>{c}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gold-dim" /></div>
      ) : (
        <div className="bg-surface border border-line divide-y divide-line">
          {filtered.map((entry) => (
            <div key={entry.id} className="px-6 py-4 flex items-center justify-between hover:bg-ivory-dim/50 transition-colors">
              <div className="flex items-center gap-6">
                <span className="font-mono text-[14px] text-gold-dim font-[500] w-[60px]">{entry.year}</span>
                <div>
                  <div className="text-[14px] text-fg">{entry.title}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-mono text-[9.5px] tracking-wider uppercase text-success-text bg-forest/5 px-2 py-0.5">{entry.category}</span>
                    <span className="font-mono text-[10px] text-fg/40">{new Date(entry.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(entry)} className="p-1.5 text-fg/40 hover:text-accent-text transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(entry.id)} className="p-1.5 text-fg/40 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
