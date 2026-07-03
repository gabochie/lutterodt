"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";

const articles = [
  { id: "1", title: "Auntie Comfort on the War Years", status: "Published", date: "28 Jun 2026", author: "Admin", category: "Oral History", content: "## Auntie Comfort on the War Years\n\nA recorded conversation on rationing, resilience and keeping the trading house open through 1943.\n\nDuring the war years, the family trading house on Harbour Road became a gathering point for the community. Auntie Comfort recalls how they managed to keep the business running despite shortages and uncertainty." },
  { id: "2", title: "London Branch Marks 40 Years", status: "Published", date: "15 Jun 2026", author: "Admin", category: "Family News", content: "## London Branch Marks 40 Years\n\nThe London branch of the Lutterodt family celebrated four decades of community and connection." },
  { id: "3", title: "Digitising the 1950s Ledgers", status: "Draft", date: "10 Jun 2026", author: "Admin", category: "Heritage", content: "## Digitising the 1950s Ledgers\n\nWork is underway to digitise the family's historical ledgers from the 1950s." },
  { id: "4", title: "The Harbour Road House — A History", status: "Draft", date: "5 Jun 2026", author: "Admin", category: "Heritage", content: "## The Harbour Road House\n\nBuilt in 1923 and restored in 2019, the family home remains the site of every Renaissance gathering." },
  { id: "5", title: "2026 Renaissance Congress Announcement", status: "Published", date: "1 Jun 2026", author: "Admin", category: "Family News", content: "## 2026 Renaissance Congress\n\nSave the date for the annual Lutterodt Renaissance Congress." },
];

export default function EditArticlePage() {
  const params = useParams();
  const article = articles.find((a) => a.id === params.id);

  const [title, setTitle] = useState(article?.title ?? "");
  const [category, setCategory] = useState(article?.category ?? "Oral History");
  const [status, setStatus] = useState(article?.status ?? "Draft");
  const [content, setContent] = useState(article?.content ?? "");

  if (!article) {
    return (
      <div className="text-center py-20">
        <h1 className="font-display text-[22px] text-burgundy-ink mb-2">Article Not Found</h1>
        <p className="text-charcoal/50 text-[14px] mb-6">No article exists with this ID.</p>
        <Link href="/admin/articles" className="btn btn-outline">Back to Articles</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/articles" className="text-charcoal/40 hover:text-charcoal transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-burgundy-ink">Edit Article</h1>
            <p className="text-charcoal/50 text-[14px] mt-1">{article.title}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 font-mono text-[10.5px] tracking-widest uppercase text-red-500 hover:text-red-600 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
          <div className="field">
            <label className="font-mono text-[10.5px] tracking-widest uppercase text-charcoal/55 block mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-0 border-b border-line bg-transparent py-3 px-1 font-body text-[15px] text-charcoal focus:outline-0 focus:border-burgundy"
              placeholder="Article title"
            />
          </div>
          <div className="field">
            <label className="font-mono text-[10.5px] tracking-widest uppercase text-charcoal/55 block mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-0 border-b border-line bg-transparent py-3 px-1 font-body text-[15px] text-charcoal focus:outline-0 focus:border-burgundy"
            >
              <option>Oral History</option>
              <option>Family News</option>
              <option>Heritage</option>
              <option>Interview</option>
              <option>Article</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label className="font-mono text-[10.5px] tracking-widest uppercase text-charcoal/55 block mb-2">
            Content <span className="text-charcoal/30 normal-case">(Markdown supported)</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="w-full border border-line bg-transparent py-3 px-4 font-body text-[14px] text-charcoal focus:outline-0 focus:border-burgundy resize-vertical font-mono"
            placeholder="Write your article here..."
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-[10.5px] tracking-widest uppercase text-charcoal/55">Status</span>
          <div className="flex gap-2">
            {["Draft", "Published"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`font-mono text-[10.5px] tracking-widest uppercase px-4 py-2 border transition-colors ${
                  status === s
                    ? "border-burgundy bg-burgundy text-ivory"
                    : "border-line text-charcoal/50 hover:border-charcoal/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn btn-primary">Save Changes</button>
          <Link href="/admin/articles" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
