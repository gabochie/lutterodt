"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";

interface ArticleData { id: number; title: string; content: string; category: string; status: string; author: string; }

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("draft");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/api/articles/${params.id}`).then(r => r.ok ? r.json() : null).then(data => {
      if (data?.article) {
        setArticle(data.article);
        setTitle(data.article.title);
        setCategory(data.article.category);
        setStatus(data.article.status);
        setContent(data.article.content);
      }
      setLoading(false);
    });
  }, [params.id]);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/articles/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, status, content }),
    });
    setSaving(false);
    if (res.ok) router.push("/admin/articles");
  };

  const remove = async () => {
    if (!confirm("Delete this article?")) return;
    await fetch(`/api/articles/${params.id}`, { method: "DELETE" });
    router.push("/admin/articles");
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-gold-dim" /></div>;
  if (!article) return (
    <div className="text-center py-20">
      <h1 className="font-display text-[22px] text-heading mb-2">Article Not Found</h1>
      <p className="text-fg/50 text-[14px] mb-6">No article exists with this ID.</p>
      <Link href="/admin/articles" className="btn btn-outline">Back to Articles</Link>
    </div>
  );

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/articles" className="text-fg/40 hover:text-fg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-heading">Edit Article</h1>
            <p className="text-fg/50 text-[14px] mt-1">{article.title}</p>
          </div>
        </div>
        <button onClick={remove} className="flex items-center gap-2 font-mono text-[10.5px] tracking-widest uppercase text-red-500 hover:text-red-600 transition-colors">
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); save(); }}>
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
          <div className="field">
            <label className="font-mono text-[10.5px] tracking-widest uppercase text-fg/55 block mb-2">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full border-0 border-b border-line bg-transparent py-3 px-1 font-body text-[15px] text-fg focus:outline-0 focus:border-azure" placeholder="Article title" />
          </div>
          <div className="field">
            <label className="font-mono text-[10.5px] tracking-widest uppercase text-fg/55 block mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full border-0 border-b border-line bg-transparent py-3 px-1 font-body text-[15px] text-fg focus:outline-0 focus:border-azure">
              <option>Oral History</option><option>Family News</option><option>Heritage</option><option>Interview</option><option>Article</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label className="font-mono text-[10.5px] tracking-widest uppercase text-fg/55 block mb-2">
            Content <span className="text-fg/30 normal-case">(Markdown supported)</span>
          </label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16}
            className="w-full border border-line bg-transparent py-3 px-4 font-body text-[14px] text-fg focus:outline-0 focus:border-azure resize-vertical font-mono" placeholder="Write your article here..." />
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-[10.5px] tracking-widest uppercase text-fg/55">Status</span>
          <div className="flex gap-2">
            {["draft", "published"].map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)}
                className={`font-mono text-[10.5px] tracking-widest uppercase px-4 py-2 border transition-colors ${status === s ? "border-azure bg-azure text-ivory" : "border-line text-fg/50 hover:border-charcoal/30"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="btn btn-primary">{saving ? "Saving..." : "Save Changes"}</button>
          <Link href="/admin/articles" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
