"use client";

import Link from "next/link";
import { Plus, Edit3, Trash2, Eye, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Article { id: number; title: string; status: string; category: string; author: string; created_at: string; }

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    setLoading(true);
    const res = await fetch("/api/articles");
    if (res.ok) {
      const data = await res.json();
      setArticles(data.articles || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const deleteArticle = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    if (res.ok) fetchArticles();
  };

  const filtered = articles.filter((a) => {
    if (filter === "published") return a.status === "published";
    if (filter === "draft") return a.status === "draft";
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-heading">Articles</h1>
          <p className="text-fg/50 text-[14px] mt-1">Manage family stories, news, and heritage articles</p>
        </div>
        <Link href="/admin/articles/new" className="btn btn-primary text-[12px]">
          <Plus className="w-4 h-4" /> New Article
        </Link>
      </div>

      <div className="flex gap-0 border-b border-line mb-6">
        {(["all", "published", "draft"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`font-mono text-[11px] tracking-widest uppercase py-3 px-6 border-b-2 transition-colors ${filter === f ? "text-accent-text border-azure" : "text-fg/40 border-transparent hover:text-fg/60"}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-gold-dim" /></div>
      ) : (
        <div className="bg-surface border border-line overflow-x-auto">
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
                    <div className="text-[14px] text-fg">{article.title}</div>
                    <div className="font-mono text-[10px] text-fg/40 mt-0.5">{article.author}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-[10px] tracking-wider uppercase text-success-text bg-forest/5 px-2.5 py-1">{article.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-mono text-[9.5px] tracking-widest uppercase px-2.5 py-1 ${article.status === "published" ? "bg-forest/10 text-success-text" : "bg-gold-dim/10 text-gold-dim"}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-[12px] text-fg/50">{new Date(article.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/articles/${article.id}`} className="p-1.5 text-fg/40 hover:text-accent-text transition-colors"><Edit3 className="w-3.5 h-3.5" /></Link>
                      <Link href={`/admin/articles/${article.id}`} className="p-1.5 text-fg/40 hover:text-accent-text transition-colors"><Eye className="w-3.5 h-3.5" /></Link>
                      <button onClick={() => deleteArticle(article.id, article.title)} className="p-1.5 text-fg/40 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
