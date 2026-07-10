"use client";

import { useState } from "react";
import { Tag } from "@/components/shared/Tag";
import { PageHero } from "@/components/shared/PageHero";

const services = [
  {
    title: "Web Design",
    tag: "Digital",
    desc: "Custom websites, brand presence, and digital strategy. Built for professionals, diaspora builders, and organisations who want a site that works as hard as they do.",
    deliverables: ["Responsive design", "Content structure", "SEO foundation", "Hosting setup"],
    startingFrom: "2,500 GHS",
  },
  {
    title: "Architectural Design",
    tag: "Built Environment",
    desc: "Residential plans, 3D visualisation, and construction intelligence. Drawing on years of experience at Gabochie Design serving clients across Ghana and the diaspora.",
    deliverables: ["Floor plans & elevations", "3D renderings", "Material selection", "Cost estimation"],
    startingFrom: "5,000 GHS",
  },
];

export default function ServicesPage() {
  const [showForm, setShowForm] = useState(false);
  const [payment, setPayment] = useState({ name: "", email: "", amount: "", description: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/flutterwave/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payment.amount,
          email: payment.email,
          name: payment.name,
          description: payment.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment initiation failed");
      window.location.href = data.link;
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
        tag="Creative Services"
        title="Design services that build more than projects"
        description="Every project I take on funds the Lutterodt Institute. Your website or architectural design gets my full professional attention — and the proceeds go toward something that will outlive us both."
      />

      {/* Service cards */}
      <section className="py-[108px]">
        <div className="container-main">
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 max-w-4xl mx-auto">
            {services.map((s) => (
              <div key={s.title} className="bg-ivory-dim rounded-lg p-8 flex flex-col">
                <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mb-2">{s.tag}</div>
                <h3 className="text-[22px] font-display font-[550] text-burgundy-ink">{s.title}</h3>
                <p className="text-[14px] text-charcoal/68 mt-3 mb-5 leading-relaxed">{s.desc}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {s.deliverables.map((d) => (
                    <li key={d} className="text-[13px] text-charcoal/60 flex items-center gap-2">
                      <span className="text-gold-dim">✓</span> {d}
                    </li>
                  ))}
                </ul>
                <div className="text-[13px] text-charcoal/50 font-mono tracking-wider mb-4">Starting from <span className="text-burgundy font-medium">{s.startingFrom}</span></div>
                <a
                  href="https://wa.me/233243262019"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-burgundy text-ivory text-[12px] tracking-widest uppercase py-3 text-center rounded-sm hover:bg-burgundy-deep transition-colors"
                >
                  Book a Consultation
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-[72px] bg-ivory-dim">
        <div className="container-main">
          <div className="text-center mb-14">
            <Tag>How It Works</Tag>
            <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">Your project funds a legacy</h2>
          </div>
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-8 max-w-3xl mx-auto">
            {[
              { step: "01", title: "Book a consultation", desc: "Tell me about your project via WhatsApp or the contact form. We'll discuss scope, timeline, and budget." },
              { step: "02", title: "I deliver the work", desc: "Web design or architectural plans — delivered on time, at professional standards. You own the output." },
              { step: "03", title: "Proceeds fund the Institute", desc: "Every cedi goes toward the Lutterodt Institute — the Digital Museum, the Neo-Manor, and the permanent archive." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="font-mono text-[28px] text-gold-dim mb-3">{item.step}</div>
                <h3 className="text-[18px] mb-2">{item.title}</h3>
                <p className="text-[14px] text-charcoal/65">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio / Past work */}
      <section className="py-[72px]">
        <div className="container-main">
          <div className="text-center mb-12">
            <Tag>Portfolio</Tag>
            <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">See previous work</h2>
            <p className="mt-3 text-[15px] text-charcoal/68">Browse past projects across web design and architectural design.</p>
          </div>
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 max-w-3xl mx-auto">
            <a href="https://gabochiedesign.com" target="_blank" rel="noopener noreferrer" className="bg-ivory-dim rounded-lg p-8 text-center hover:bg-ivory transition-colors">
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mb-2">Gabochie Design</div>
              <h3 className="text-[18px] mb-2">Construction Intelligence Platform</h3>
              <p className="text-[13px] text-charcoal/60">3+ tools, 500+ users, 98% accuracy — serving Ghana&apos;s construction professionals.</p>
            </a>
            <a href="https://gideonabochie.org" target="_blank" rel="noopener noreferrer" className="bg-ivory-dim rounded-lg p-8 text-center hover:bg-ivory transition-colors">
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mb-2">GideonAbochie Studio</div>
              <h3 className="text-[18px] mb-2">School of Creativity, Love & Wisdom</h3>
              <p className="text-[13px] text-charcoal/60">Bible-based teaching platform with courses, books, and a growing TikTok community.</p>
            </a>
          </div>
        </div>
      </section>

      {/* Make a Payment */}
      <section className="py-[72px] bg-ivory-dim">
        <div className="container-main max-w-lg">
          <div className="text-center mb-10">
            <Tag>Payment</Tag>
            <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">Make a payment</h2>
            <p className="mt-3 text-[15px] text-charcoal/68">
              Existing client? Pay for your project here. First time? Book a consultation above first.
            </p>
          </div>

          {!showForm ? (
            <div className="text-center">
              <button onClick={() => setShowForm(true)} className="btn-gold">
                Pay via Flutterwave
              </button>
              <p className="mt-4 text-[13px] text-charcoal/50">
                All major cards accepted. Secure checkout by Flutterwave.
              </p>
              <div className="mt-6 p-4 bg-white rounded-lg border border-line text-left">
                <p className="text-[13px] text-charcoal/60">
                  <strong className="text-charcoal">Prefer bank transfer?</strong> SWIFT details available on request —&nbsp;
                  <a href="https://wa.me/233243262019" target="_blank" rel="noopener noreferrer" className="text-gold-dim hover:underline">contact via WhatsApp</a>.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] tracking-widest uppercase text-charcoal/50 mb-1.5">Full Name *</label>
                <input required value={payment.name} onChange={e => setPayment(p => ({ ...p, name: e.target.value }))} className="w-full bg-white border border-line px-4 py-3 text-[15px] text-charcoal outline-none focus:border-gold-dim" placeholder="Your full name" />
              </div>
              <div>
                <label className="block font-mono text-[11px] tracking-widest uppercase text-charcoal/50 mb-1.5">Email Address *</label>
                <input required type="email" value={payment.email} onChange={e => setPayment(p => ({ ...p, email: e.target.value }))} className="w-full bg-white border border-line px-4 py-3 text-[15px] text-charcoal outline-none focus:border-gold-dim" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block font-mono text-[11px] tracking-widest uppercase text-charcoal/50 mb-1.5">Amount (GHS) *</label>
                <input required type="number" min="1" value={payment.amount} onChange={e => setPayment(p => ({ ...p, amount: e.target.value }))} className="w-full bg-white border border-line px-4 py-3 text-[15px] text-charcoal outline-none focus:border-gold-dim" placeholder="e.g. 2500" />
              </div>
              <div>
                <label className="block font-mono text-[11px] tracking-widest uppercase text-charcoal/50 mb-1.5">Description</label>
                <textarea value={payment.description} onChange={e => setPayment(p => ({ ...p, description: e.target.value }))} className="w-full bg-white border border-line px-4 py-3 text-[15px] text-charcoal outline-none focus:border-gold-dim resize-none" rows={2} placeholder="Web design, architectural plans, etc." />
              </div>
              {status === "error" && <p className="text-red-600 text-[14px]">{errorMsg}</p>}
              <button type="submit" disabled={status === "loading"} className="btn-gold w-full disabled:opacity-50">
                {status === "loading" ? "Redirecting to payment..." : "Pay Now"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-[13px] text-charcoal/50 hover:text-charcoal w-full text-center mt-2">Cancel</button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-[72px]">
        <div className="container-main max-w-3xl">
          <div className="text-center mb-12">
            <Tag>Questions</Tag>
            <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">Frequently asked questions</h2>
          </div>
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[2px] bg-line">
            {[
              { q: "What does a project cost?", a: "Every project is different. Web design starts from 2,500 GHS, architectural design from 5,000 GHS. Book a free consultation and I'll give you a fixed quote." },
              { q: "Can I pay in USD or other currency?", a: "Flutterwave supports multiple currencies. Contact me via WhatsApp and I'll send a custom payment link in your preferred currency." },
              { q: "Where does the money go?", a: "100% of service proceeds fund the Lutterodt Institute — the Digital Museum, the Neo-Manor, and the family archive. A transparent impact report is shared annually." },
              { q: "What if I'm not satisfied?", a: "I work iteratively with your feedback throughout the project. If you're not happy at any stage, we adjust until you are. Your satisfaction is my reputation." },
            ].map((faq) => (
              <div key={faq.q} className="bg-ivory-dim p-[28px] pb-[30px]">
                <h3 className="text-[16px] font-display font-[550] text-burgundy-ink mb-[10px]">{faq.q}</h3>
                <p className="text-[14px] text-charcoal/68 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-burgundy-ink text-ivory text-center py-[72px] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(198,161,91,0.10),transparent_50%)] pointer-events-none" />
        <div className="container-main relative z-10">
          <Tag onDark className="justify-center flex">Get Started</Tag>
          <h2 className="text-ivory text-[clamp(28px,3.2vw,40px)] max-w-[22ch] mx-auto mt-[18px] mb-[22px]">
            Ready to build something that matters?
          </h2>
          <p className="text-ivory/70 max-w-[48ch] mx-auto mb-[34px]">
            Your project gets my full attention. The proceeds build a permanent institution for the Lutterodt family. Everyone wins.
          </p>
          <a href="https://wa.me/233243262019" target="_blank" rel="noopener noreferrer" className="btn-gold inline-block">
            Book a Free Consultation
          </a>
        </div>
      </section>
    </>
  );
}
