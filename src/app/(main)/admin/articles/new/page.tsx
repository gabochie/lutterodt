"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Oral History");
  const [status, setStatus] = useState("draft");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, status, content, author: "Admin" }),
    });
    setSaving(false);
    if (res.ok) router.push("/admin/articles");
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/articles" className="text-charcoal/40 hover:text-charcoal transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-burgundy-ink">New Article</h1>
          <p className="text-charcoal/50 text-[14px] mt-1">Add a family story, news item or heritage article</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); save(); }}>
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
          <div className="field">
            <label className="font-mono text-[10.5px] tracking-widest uppercase text-charcoal/55 block mb-2">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full border-0 border-b border-line bg-transparent py-3 px-1 font-body text-[15px] text-charcoal focus:outline-0 focus:border-burgundy" placeholder="Article title" />
          </div>
          <div className="field">
            <label className="font-mono text-[10.5px] tracking-widest uppercase text-charcoal/55 block mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full border-0 border-b border-line bg-transparent py-3 px-1 font-body text-[15px] text-charcoal focus:outline-0 focus:border-burgundy">
              <option>Oral History</option><option>Family News</option><option>Heritage</option><option>Interview</option><option>Article</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label className="font-mono text-[10.5px] tracking-widest uppercase text-charcoal/55 block mb-2">
            Content <span className="text-charcoal/30 normal-case">(Markdown supported)</span>
          </label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={16}
            className="w-full border border-line bg-transparent py-3 px-4 font-body text-[14px] text-charcoal focus:outline-0 focus:border-burgundy resize-vertical font-mono" placeholder="Write your article here..." />
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-[10.5px] tracking-widest uppercase text-charcoal/55">Status</span>
          <div className="flex gap-2">
            {["draft", "published"].map((s) => (
              <button key={s} type="button" onClick={() => setStatus(s)}
                className={`font-mono text-[10.5px] tracking-widest uppercase px-4 py-2 border transition-colors ${status === s ? "border-burgundy bg-burgundy text-ivory" : "border-line text-charcoal/50 hover:border-charcoal/30"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="btn btn-primary">{saving ? "Saving..." : "Save Article"}</button>
          <Link href="/admin/articles" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
