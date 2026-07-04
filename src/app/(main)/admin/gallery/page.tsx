"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const initialItems = [
  { id: "1", thumb: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=200&auto=format&fit=crop", title: "The Lutterodt Household", category: "Photographs", year: "1952", added: "20 Jun 2026" },
  { id: "2", thumb: "https://images.unsplash.com/photo-1512635776656-9db3095f2e97?q=80&w=200&auto=format&fit=crop", title: "Trading House Accounts", category: "Documents", year: "1921", added: "20 Jun 2026" },
  { id: "3", thumb: "https://images.unsplash.com/photo-1461783436728-0a9217714694?q=80&w=200&auto=format&fit=crop", title: "Harbour Road, Looking East", category: "Homes", year: "1930s", added: "18 Jun 2026" },
  { id: "4", thumb: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=200&auto=format&fit=crop", title: "House Restoration Feast", category: "Events", year: "1986", added: "18 Jun 2026" },
  { id: "5", thumb: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?q=80&w=200&auto=format&fit=crop", title: "Harbour Road House, Restored", category: "Homes", year: "2019", added: "15 Jun 2026" },
  { id: "6", thumb: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=200&auto=format&fit=crop", title: "Emmanuel's Graduation", category: "Photographs", year: "1968", added: "15 Jun 2026" },
];

const categories = ["All", "Photographs", "Events", "Homes", "Documents"];

export default function AdminGalleryPage() {
  const [filter, setFilter] = useState("All");
  const [items] = useState(initialItems);

  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-burgundy-ink">Gallery</h1>
          <p className="text-charcoal/50 text-[14px] mt-1">Manage the family legacy gallery</p>
        </div>
        <button className="btn btn-primary text-[12px]">
          <Plus className="w-4 h-4" />
          Upload Images
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

      {/* Gallery grid */}
      <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-ivory border border-line group">
            <div className="aspect-[4/3] overflow-hidden bg-charcoal">
              <img src={item.thumb} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="text-[14px] text-charcoal">{item.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-[9.5px] tracking-wider uppercase text-forest bg-forest/5 px-2 py-0.5">{item.category}</span>
                <span className="font-mono text-[10px] text-charcoal/40">{item.year}</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
                <span className="font-mono text-[9.5px] text-charcoal/40">{item.added}</span>
                <button className="p-1 text-charcoal/30 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
