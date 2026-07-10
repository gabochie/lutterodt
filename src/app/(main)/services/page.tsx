"use client";

import { useState } from "react";
import { Tag } from "@/components/shared/Tag";
import { PageHero } from "@/components/shared/PageHero";

const serviceAreas = [
  {
    title: "Building in Ghana",
    desc: "Architectural design, construction cost intelligence, contractor vetting, and permit navigation. Drawing on years of experience at Gabochie Design — helping diaspora builders turn their vision into reality.",
  },
  {
    title: "Websites for Diaspora Businesses",
    desc: "Custom websites for clinics, law firms, consultancies, retail, and real estate professionals. Modern, mobile-first, built to generate leads — serving clients across North America.",
  },
  {
    title: "Real Estate Advisory",
    desc: "Land search and verification, acquisition guidance, ROI analysis, and project feasibility. Making informed decisions in Ghana's property market.",
  },
];

export default function ServicesPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service_interest: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/clients/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Something went wrong");
      }
      setStatus("success");
      setForm({ name: "", email: "", phone: "", service_interest: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Services"
        tag="Serving the Family"
        title="How I can help you build"
        description="I serve the Lutterodt family first. Whether you're building a home in Ghana, launching a diaspora business, or investing in real estate — let's talk. No obligations, no pressure."
      />

      <section className="py-[108px]">
        <div className="container-main">
          <div className="max-w-2xl mb-14">
            <Tag>What I Offer</Tag>
            <h2 className="text-[clamp(28px,3.2vw,40px)] mt-[14px]">Services for the family</h2>
            <p className="mt-3 text-[15px] text-charcoal/68">
              These are the areas I know best. If something else is on your mind, reach out anyway — I&rsquo;ll point you in the right direction or find someone who can help.
            </p>
          </div>
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6 max-w-4xl">
            {serviceAreas.map((s) => (
              <div key={s.title} className="bg-ivory-dim rounded-lg p-8">
                <h3 className="text-[20px] font-display font-[550] text-burgundy-ink mb-3">{s.title}</h3>
                <p className="text-[14px] text-charcoal/68 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[72px] bg-ivory-dim">
        <div className="container-main">
          <div className="grid grid-cols-[1fr_1fr] max-md:grid-cols-1 gap-12 items-center max-w-4xl mx-auto">
            <div>
              <Tag>Relationship First</Tag>
              <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">Let&rsquo;s start with a conversation</h2>
              <p className="mt-3 text-[15px] text-charcoal/68">
                I don&rsquo;t publish prices because every project is different — and because I want to understand your needs before talking about numbers. Tell me what you&rsquo;re working on, and I&rsquo;ll reach out personally.
              </p>
              <p className="mt-4 text-[15px] text-charcoal/68">
                Once we&rsquo;ve worked together, you&rsquo;ll get access to a private dashboard with the full range of services, pricing, and project tracking.
              </p>
            </div>

            <div>
              {status === "success" ? (
                <div className="bg-white border border-green-200 rounded-lg p-8 text-center">
                  <p className="text-[18px] font-medium text-green-800">Thank you.</p>
                  <p className="text-[14px] text-green-700/70 mt-2">I&rsquo;ll reach out within 48 hours to learn more about your project.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-mono text-[11px] tracking-widest uppercase text-charcoal/50 mb-1.5">Name *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-white border border-line px-4 py-3 text-[15px] outline-none focus:border-gold-dim" placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] tracking-widest uppercase text-charcoal/50 mb-1.5">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-white border border-line px-4 py-3 text-[15px] outline-none focus:border-gold-dim" placeholder="email@example.com" />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] tracking-widest uppercase text-charcoal/50 mb-1.5">Phone (WhatsApp preferred)</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full bg-white border border-line px-4 py-3 text-[15px] outline-none focus:border-gold-dim" placeholder="+233..." />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] tracking-widest uppercase text-charcoal/50 mb-1.5">I&rsquo;m interested in</label>
                    <select value={form.service_interest} onChange={e => setForm(f => ({ ...f, service_interest: e.target.value }))} className="w-full bg-white border border-line px-4 py-3 text-[15px] outline-none focus:border-gold-dim">
                      <option value="">Select...</option>
                      <option value="Building in Ghana">Building in Ghana</option>
                      <option value="Website for my business">Website for my business</option>
                      <option value="Real estate advisory">Real estate advisory</option>
                      <option value="Not sure yet — let's talk">Not sure yet — let&rsquo;s talk</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] tracking-widest uppercase text-charcoal/50 mb-1.5">Tell me about your project</label>
                    <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full bg-white border border-line px-4 py-3 text-[15px] outline-none focus:border-gold-dim resize-none" rows={3} placeholder="What are you working on?" />
                  </div>
                  {status === "error" && <p className="text-red-600 text-[14px]">{errorMsg}</p>}
                  <button type="submit" disabled={status === "loading"} className="btn-gold w-full disabled:opacity-50">
                    {status === "loading" ? "Sending..." : "Send — I'll reach out"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-[72px]">
        <div className="container-main text-center max-w-2xl">
          <Tag>Already a client?</Tag>
          <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">Access your dashboard</h2>
          <p className="mt-3 text-[15px] text-charcoal/68 mb-6">
            Log in with the access code you received after onboarding to view the full service catalog, project status, and more.
          </p>
          <a href="/dashboard/login" className="btn-gold inline-block">Client Portal Login</a>
        </div>
      </section>
    </>
  );
}
