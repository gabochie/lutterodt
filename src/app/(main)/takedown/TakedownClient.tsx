"use client";

import { useState, FormEvent } from "react";
import { PageHero } from "@/components/shared/PageHero";
import { TurnstileWidget } from "@/components/shared/TurnstileWidget";

type Status = "idle" | "sending" | "done" | "error";

/**
 * Public data-subject request form (Phase 4.1). Posts to /api/takedown,
 * which files a committee-reviewed draft — nothing is auto-applied.
 */
export function TakedownClient() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    profile_name: "",
    kind: "correction",
    details: "",
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/takedown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken: captchaToken }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("done");
      setMessage(data.message || "Request recorded.");
      setForm({ name: "", email: "", profile_name: "", kind: "correction", details: "" });
      setCaptchaToken(null);
      setCaptchaReset((n) => n + 1);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const inputCls =
    "w-full px-3 py-2 border border-line bg-surface text-[14px] focus:outline-none focus:border-gold-dim";

  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Correction & Removal"
        tag="Your Rights"
        title="Correct or remove a listing"
        description="If a directory profile about you (or someone you represent) is wrong or should not be listed, tell us here. The archive committee reviews every request within 14 days."
      />
      <section className="py-[72px]">
        <div className="container-main max-w-2xl">
          {status === "done" ? (
            <div className="bg-surface border border-line p-8 text-center" role="status">
              <p className="text-[16px]">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-surface border border-line p-6 space-y-4">
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
                <div>
                  <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">Your Name *</label>
                  <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">Your Email (for follow-up)</label>
                  <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">Profile This Concerns *</label>
                <input
                  required
                  value={form.profile_name}
                  onChange={(e) => set("profile_name", e.target.value)}
                  placeholder="e.g. Ama Lutterodt — or paste the directory link"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">Request Type *</label>
                <select value={form.kind} onChange={(e) => set("kind", e.target.value)} className={inputCls}>
                  <option value="correction">Correct inaccurate details</option>
                  <option value="removal">Remove the listing</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-[10px] tracking-widest uppercase text-fg/50 mb-1.5">Details *</label>
                <textarea
                  required
                  value={form.details}
                  onChange={(e) => set("details", e.target.value)}
                  placeholder="What is wrong, or why should the listing be removed?"
                  className={`${inputCls} min-h-[120px]`}
                />
              </div>
              {status === "error" && <p role="alert" className="text-red-600 text-[14px]">{message}</p>}
              <TurnstileWidget onToken={setCaptchaToken} resetSignal={captchaReset} />
              <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-50">
                {status === "sending" ? "Sending..." : "Submit Request"}
              </button>
              <p className="text-[12.5px] text-fg/50">
                Historical records of deceased persons are preserved as heritage and are out of scope for removal.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
