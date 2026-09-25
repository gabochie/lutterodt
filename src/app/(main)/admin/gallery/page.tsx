"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";

interface Item { id: number; src: string; title: string; tag: string; alt: string; created_at: string; }

const categories = ["All", "Photographs", "Events", "Homes", "Documents"];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ src: "", title: "", tag: "Photographs", alt: "" });

  const fetchItems = async () => {
    setLoading(true);
    const res = await fetch("/api/gallery");
    if (res.ok) { const d = await res.json(); setItems(d.items || []); }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const addItem = async () => {
    if (!form.src) return;
    await fetch("/api/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false); setForm({ src: "", title: "", tag: "Photographs", alt: "" }); fetchItems();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const filtered = filter === "All" ? items : items.filter((i) => i.tag === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-heading">Gallery</h1>
          <p className="text-fg/50 text-[14px] mt-1">Manage the family legacy gallery</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary text-[12px]"><Plus className="w-4 h-4" /> Add Image</button>
      </div>

      {showForm && (
        <div className="mb-6 p-5 bg-ivory-dim border border-line">
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4 mb-4">
            <input placeholder="Image URL" value={form.src} onChange={(e) => setForm({ ...form, src: e.target.value })}
              className="border border-line bg-transparent px-3 py-2 text-[14px] text-fg focus:outline-0 focus:border-burgundy" />
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-line bg-transparent px-3 py-2 text-[14px] text-fg focus:outline-0 focus:border-burgundy" />
            <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="border border-line bg-transparent px-3 py-2 text-[14px] text-fg focus:outline-0 focus:border-burgundy">
              {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
            </select>
            <input placeholder="Alt text" value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })}
              className="border border-line bg-transparent px-3 py-2 text-[14px] text-fg focus:outline-0 focus:border-burgundy" />
          </div>
          <div className="flex gap-2">
            <button onClick={addItem} className="btn btn-primary text-[11px]">Add to Gallery</button>
            <button onClick={() => setShowForm(false)} className="btn btn-outline text-[11px]">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`font-mono text-[10.5px] tracking-widest uppercase px-4 py-2 border transition-colors ${filter === c ? "border-burgundy bg-burgundy text-ivory" : "border-line text-fg/50 hover:border-charcoal/30"}`}>{c}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gold-dim" /></div>
      ) : (
        <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-surface border border-line group">
              <div className="aspect-[4/3] overflow-hidden bg-charcoal">
                <img src={item.src} alt={item.alt || item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="text-[14px] text-fg">{item.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[9.5px] tracking-wider uppercase text-success-text bg-forest/5 px-2 py-0.5">{item.tag}</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
                  <span className="font-mono text-[9.5px] text-fg/40">{new Date(item.created_at).toLocaleDateString()}</span>
                  <button onClick={() => remove(item.id)} className="p-1 text-fg/30 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
