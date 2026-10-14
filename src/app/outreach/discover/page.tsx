"use client";

import { useState } from "react";

interface DuplicateMatch {
  id: string;
  name: string;
  country: string;
  category: string;
}

interface AddedProfile {
  id: string;
  name: string;
  achievement?: string;
  category?: string;
  country?: string;
  dob?: string;
}

const categories = ["academia", "healthcare", "law", "business", "creative", "service", "engineering", "historical"];

const countries = [
  "Ghana", "United Kingdom", "United States", "Canada", "Germany", "China",
  "Denmark", "United Arab Emirates", "Estonia", "Mexico", "Gold Coast", "Other"
];

export default function DiscoverPage() {
  const [form, setForm] = useState({
    name: "", dob: "", category: "business", country: "Ghana",
    achievement: "", contact_email: "", contact_linkedin: "", notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; matches?: DuplicateMatch[] } | null>(null);
  const [lastAdded, setLastAdded] = useState<AddedProfile | null>(null);
  const [preview, setPreview] = useState<{ name: string; html: string } | null>(null);
  const [generating, setGenerating] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const r = await fetch("/api/outreach/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (r.status === 409) {
        setResult({ ok: false, message: data.message || "Possible duplicate found.", matches: data.matches });
      } else if (r.ok) {
        setResult({ ok: true, message: `Added ${data.name} (${data.id})` });
        setLastAdded(data);
        setForm({ name: "", dob: "", category: "business", country: "Ghana", achievement: "", contact_email: "", contact_linkedin: "", notes: "" });
      } else {
        setResult({ ok: false, message: data.error || "Failed to add" });
      }
    } catch {
      setResult({ ok: false, message: "Network error" });
    }
    setSubmitting(false);
  }

  async function generateLetter() {
    if (!lastAdded) return;
    setGenerating(true);
    try {
      const gen = await fetch("/api/outreach/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lastAdded.name,
          achievement: lastAdded.achievement || form.achievement,
          category: lastAdded.category || form.category,
          country: lastAdded.country || form.country,
          dob: lastAdded.dob || form.dob,
        }),
      });
      const letter = await gen.json();
      if (gen.ok) setPreview({ name: lastAdded.name, html: letter.html });
    } catch {}
    setGenerating(false);
  }

  return (
    <div>
      <h1 className="text-[clamp(22px,2.5vw,30px)] font-display text-heading mb-2">Discover a Lutterodt</h1>
      <p className="text-fg/50 text-[14px] mb-8">
        Add a newly discovered Lutterodt to the database. The system checks for duplicates automatically.
      </p>

      {result && (
        <div className={`mb-6 p-4 border ${
          result.ok ? "border-forest/20 bg-forest/5" : "border-azure/20 bg-azure/5"
        }`}>
          <p className="text-[13px]">{result.message}</p>
          {result.ok && lastAdded && (
            <button onClick={generateLetter} disabled={generating}
              className="btn-gold text-[10px] mt-3 px-3 py-1.5 disabled:opacity-50">
              {generating ? "Generating..." : "Generate Letter"}
            </button>
          )}
          {result.matches && result.matches.length > 0 && (
            <div className="mt-3">
              <p className="font-mono text-[10px] tracking-widest uppercase text-accent-text mb-2">Potential duplicates:</p>
              {result.matches.map((m) => (
                <div key={m.id} className="text-[12px] text-fg/70 mb-1">
                  {m.name} &middot; {m.country} &middot; {m.category}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl bg-surface border border-line p-6 space-y-4">
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">Full Name *</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 border border-line bg-surface text-[14px] focus:outline-none focus:border-gold-dim" placeholder="e.g. Kwame Lutterodt" />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">Date of Birth</label>
            <input value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
              className="w-full px-3 py-2 border border-line bg-surface text-[14px] focus:outline-none focus:border-gold-dim" placeholder="e.g. 1985 or 15 Mar 1990" />
          </div>
        </div>

        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">Category *</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full px-3 py-2 border border-line bg-surface text-[14px] focus:outline-none focus:border-gold-dim">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">Country</label>
            <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
              className="w-full px-3 py-2 border border-line bg-surface text-[14px] focus:outline-none focus:border-gold-dim">
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">Achievement / Bio *</label>
          <textarea required value={form.achievement} onChange={e => setForm(f => ({ ...f, achievement: e.target.value }))}
            className="w-full px-3 py-2 border border-line bg-surface text-[14px] focus:outline-none focus:border-gold-dim min-h-[100px]"
            placeholder="Describe what this Lutterodt does, their profession, accomplishments..." />
        </div>

        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">Email (optional)</label>
            <input type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))}
              className="w-full px-3 py-2 border border-line bg-surface text-[14px] focus:outline-none focus:border-gold-dim" />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">LinkedIn (optional)</label>
            <input value={form.contact_linkedin} onChange={e => setForm(f => ({ ...f, contact_linkedin: e.target.value }))}
              className="w-full px-3 py-2 border border-line bg-surface text-[14px] focus:outline-none focus:border-gold-dim" />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">Notes</label>
          <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="w-full px-3 py-2 border border-line bg-surface text-[14px] focus:outline-none focus:border-gold-dim min-h-[60px]"
            placeholder="Where did you find this person? Any context..." />
        </div>

        <button type="submit" disabled={submitting}
          className="btn-primary disabled:opacity-50">
          {submitting ? "Checking for duplicates..." : "Add to Database"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="font-mono text-[10.5px] tracking-widest uppercase text-gold-dim mb-3">How dedup works</h3>
        <div className="bg-surface border border-line p-4 text-[13px] text-fg/70 leading-relaxed">
          <p>Before adding a new profile, the system:</p>
          <ol className="list-decimal ml-5 mt-2 space-y-1">
            <li>Normalizes the name (lowercase, removes special characters)</li>
            <li>Checks for exact matches in the database</li>
            <li>Checks if one name contains the other</li>
            <li>Checks for matching email or LinkedIn URL</li>
          </ol>
          <p className="mt-2">If a potential duplicate is found, you will see it and can decide whether to proceed or skip.</p>
        </div>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6" onClick={() => setPreview(null)}>
          <div className="bg-card max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-line px-5 py-3 flex items-center justify-between z-10">
              <span className="font-mono text-[10px] tracking-widest uppercase text-fg/40">Preview: {preview.name}</span>
              <div className="flex gap-2">
                <button onClick={() => setPreview(null)} className="btn-ghost text-[10px] px-3 py-1.5">Close</button>
                <button onClick={() => { setPreview(null); }}
                  className="btn-gold text-[10px] px-4 py-1.5">Go to Queue</button>
              </div>
            </div>
            <div className="letter-preview" dangerouslySetInnerHTML={{ __html: preview.html }} />
          </div>
        </div>
      )}

      <style>{`
        .letter-preview { background: #faf8f5; }
        .letter-preview .page { max-width: 680px; margin: 0 auto; padding: 48px 56px; background: #fff; }
        .letter-preview .brand { text-align: center; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 1px solid #6E520C; }
        .letter-preview .brand svg { width: 40px; height: 40px; margin-bottom: 10px; }
        .letter-preview .brand h1 { font-size: 18px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: #0A2470; }
        .letter-preview .brand p { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: #6E520C; }
        .letter-preview .date { font-size: 13px; color: #5F5E59; margin-bottom: 28px; }
        .letter-preview .salutation { font-size: 15px; margin-bottom: 18px; }
        .letter-preview .body p { font-size: 14px; margin-bottom: 16px; color: #33322E; line-height: 1.7; }
        .letter-preview .highlight { border-left: 3px solid #6E520C; padding: 14px 18px; margin: 20px 0; background: #F7F7F4; font-style: italic; color: #0A2470; font-size: 14px; }
        .letter-preview .cta { margin-top: 24px; padding-top: 20px; border-top: 1px solid #E4E6EC; }
        .letter-preview .signoff { margin-top: 36px; }
        .letter-preview .signoff .name { font-size: 16px; font-weight: 600; color: #0A2470; margin-top: 18px; }
        .letter-preview .signoff .role { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #6E520C; }
        .letter-preview .footer { margin-top: 32px; padding-top: 16px; text-align: center; font-size: 10px; color: #6B6A65; }
      `}</style>
    </div>
  );
}
