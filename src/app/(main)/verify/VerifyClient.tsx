"use client";

import { useState } from "react";
import Link from "next/link";

export function VerifyClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [relation, setRelation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject: "Identity Verification", message: `Family relation: ${relation}` }),
    });
    if (res.ok) setSubmitted(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20">
      <div className="container-main max-w-lg">
        <div className="text-center mb-10">
          <span className="font-mono text-[10.5px] tracking-[0.25em] uppercase text-gold-dim">Family Directory</span>
          <h1 className="text-[clamp(28px,3.5vw,40px)] font-display text-burgundy-ink mt-2">Verify Your Identity</h1>
          <p className="text-charcoal/60 text-[15px] mt-3 max-w-[40ch] mx-auto">
            Submit your details to verify your family connection and unlock the full directory.
          </p>
        </div>

        {submitted ? (
          <div className="text-center p-10 border border-line bg-ivory-dim">
            <div className="w-14 h-14 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="font-display text-[20px] text-burgundy-ink mb-2">Thank You</h2>
            <p className="text-charcoal/60 text-[14px] mb-6">Your verification request has been submitted. We will review and get back to you.</p>
            <Link href="/directory" className="btn btn-primary">Back to Directory</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-mono text-[10.5px] tracking-widest uppercase text-charcoal/55 block mb-2">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full border border-line bg-transparent px-4 py-3 text-[15px] text-charcoal focus:outline-0 focus:border-burgundy" placeholder="Your full name" />
            </div>
            <div>
              <label className="font-mono text-[10.5px] tracking-widest uppercase text-charcoal/55 block mb-2">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-line bg-transparent px-4 py-3 text-[15px] text-charcoal focus:outline-0 focus:border-burgundy" placeholder="your@email.com" />
            </div>
            <div>
              <label className="font-mono text-[10.5px] tracking-widest uppercase text-charcoal/55 block mb-2">Family Relation</label>
              <textarea required value={relation} onChange={(e) => setRelation(e.target.value)} rows={3}
                className="w-full border border-line bg-transparent px-4 py-3 text-[15px] text-charcoal focus:outline-0 focus:border-burgundy resize-none" placeholder="How are you related to the Lutterodt family? Share any details that help verify your connection." />
            </div>
            <button type="submit" className="btn btn-primary w-full justify-center">Submit Verification</button>
          </form>
        )}
      </div>
    </div>
  );
}