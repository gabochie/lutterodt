"use client";

import { useEffect, useState } from "react";

export function ComingSoonGate({ children }: { children: React.ReactNode }) {
  const [showOverlay, setShowOverlay] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setShowOverlay(data?.coming_soon === true);
      })
      .catch(() => setShowOverlay(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const r = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, whatsapp }),
      });
      if (!r.ok) {
        setError("Could not register. Try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Try again.");
    }
    setSubmitting(false);
  }

  if (showOverlay === null) {
    return <div className="min-h-screen bg-burgundy-ink" />;
  }

  if (showOverlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-burgundy-ink overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(198,161,91,0.10),transparent_60%),radial-gradient(circle_at_80%_20%,rgba(47,74,60,0.20),transparent_50%)] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold-dim/8 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gold-dim/6 rounded-full pointer-events-none" />
        <div className="relative z-10 w-full max-w-xl text-center">
          <svg className="w-16 h-16 mx-auto mb-6" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="19" stroke="#C6A15B" strokeWidth="1" />
            <path d="M20 7L23.5 16.5L33 20L23.5 23.5L20 33L16.5 23.5L7 20L16.5 16.5L20 7Z" stroke="#E4C989" strokeWidth="1.1" />
            <circle cx="20" cy="20" r="3" fill="#C6A15B" />
          </svg>
          <p className="font-mono text-[10.5px] tracking-[0.25em] uppercase text-gold-dim mb-3">Coming Soon</p>
          <h1 className="text-ivory text-[clamp(36px,5.6vw,64px)] font-display font-[560] leading-tight mb-4">
            The Lutterodt<br />
            <em className="italic font-[440] text-gold-light">Renaissance</em>
          </h1>
          <p className="text-ivory/60 text-[16px] max-w-[44ch] mx-auto leading-relaxed mb-8">
            A permanent digital archive of the Lutterodt family&mdash;six generations of history, heritage, and home.
          </p>

          {submitted ? (
            <div className="max-w-sm mx-auto mb-10">
              <p className="text-gold-light text-[15px]">Thank you! We will keep you posted when we launch.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto mb-6">
              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-white/10 border border-gold-dim/30 text-ivory text-[14px] placeholder:text-ivory/30 focus:outline-none focus:border-gold-dim transition-colors"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-white/10 border border-gold-dim/30 text-ivory text-[14px] placeholder:text-ivory/30 focus:outline-none focus:border-gold-dim transition-colors"
                />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => { setWhatsapp(e.target.value); setError(""); }}
                  placeholder="WhatsApp number (optional)"
                  className="w-full px-4 py-3 bg-white/10 border border-gold-dim/30 text-ivory text-[14px] placeholder:text-ivory/30 focus:outline-none focus:border-gold-dim transition-colors"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-gold disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Notify Me"}
                </button>
              </div>
              {error && <p className="mt-2 text-red-400 text-[12px]">{error}</p>}
            </form>
          )}

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="mailto:gabochie@gmail.com" className="btn-gold">Get in Touch</a>
            <a href="https://wa.me/233243262019" target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp</a>
          </div>
          <div className="mt-12 flex items-center justify-center gap-6 text-ivory/30 font-mono text-[10px] tracking-widest uppercase">
            <a href="/login" className="hover:text-gold-light transition-colors">Admin</a>
            <span className="w-[1px] h-3 bg-ivory/15" />
            <a href="/coming-soon" className="hover:text-gold-light transition-colors">Funders</a>
            <span className="w-[1px] h-3 bg-ivory/15" />
            <span>Ghana · Germany · USA · UK · Netherlands</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
