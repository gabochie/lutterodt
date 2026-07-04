"use client";

import Link from "next/link";
import { Plus, Edit3, Trash2, Eye } from "lucide-react";
import { useState } from "react";

const articles = [
  { id: "1", title: "Auntie Comfort on the War Years", status: "Published", date: "28 Jun 2026", author: "Admin", category: "Oral History" },
  { id: "2", title: "London Branch Marks 40 Years", status: "Published", date: "15 Jun 2026", author: "Admin", category: "Family News" },
  { id: "3", title: "Digitising the 1950s Ledgers", status: "Draft", date: "10 Jun 2026", author: "Admin", category: "Heritage" },
  { id: "4", title: "The Harbour Road House — A History", status: "Draft", date: "5 Jun 2026", author: "Admin", category: "Heritage" },
  { id: "5", title: "2026 Renaissance Congress Announcement", status: "Published", date: "1 Jun 2026", author: "Admin", category: "Family News" },
];

export default function AdminArticlesPage() {
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const filtered = articles.filter((a) => {
    if (filter === "published") return a.status === "Published";
    if (filter === "draft") return a.status === "Draft";
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-burgundy-ink">Articles</h1>
          <p className="text-charcoal/50 text-[14px] mt-1">Manage family stories, news, and heritage articles</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="btn btn-primary text-[12px]"
        >
          <Plus className="w-4 h-4" />
          New Article
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0 border-b border-line mb-6">
        {(["all", "published", "draft"] as const).map((f) => (
          <button
            key={f}
            className={`font-mono text-[11px] tracking-widest uppercase py-3 px-6 border-b-2 transition-colors ${
              filter === f
                ? "text-burgundy border-burgundy"
                : "text-charcoal/40 border-transparent hover:text-charcoal/60"
            }`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-ivory border border-line overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line font-mono text-[10px] tracking-widest uppercase text-gold-dim">
              <th className="px-6 py-4 font-normal">Title</th>
              <th className="px-6 py-4 font-normal">Category</th>
              <th className="px-6 py-4 font-normal">Status</th>
              <th className="px-6 py-4 font-normal">Date</th>
              <th className="px-6 py-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((article) => (
              <tr key={article.id} className="hover:bg-ivory-dim/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-[14px] text-charcoal">{article.title}</div>
                  <div className="font-mono text-[10px] text-charcoal/40 mt-0.5">{article.author}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-[10px] tracking-wider uppercase text-forest bg-forest/5 px-2.5 py-1">{article.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-mono text-[9.5px] tracking-widest uppercase px-2.5 py-1 ${
                    article.status === "Published"
                      ? "bg-forest/10 text-forest"
                      : "bg-gold-dim/10 text-gold-dim"
                  }`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-[12px] text-charcoal/50">{article.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-charcoal/40 hover:text-burgundy transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 text-charcoal/40 hover:text-burgundy transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 text-charcoal/40 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
