import type { Metadata } from "next";
import { Tag } from "@/components/shared/Tag";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Services — Lutterodt Institute",
  description: "Web design and architectural design services that fund the Lutterodt Institute. Every project builds a permanent institution for the family.",
};

const services = [
  {
    title: "Web Design",
    tag: "Digital",
    desc: "Modern, conversion-optimised websites for North American businesses. From free audit to full redesign — fixed pricing, hand-coded, delivered in 6–9 weeks.",
    deliverables: ["Custom responsive design", "Mobile-first development", "Conversion rate optimisation", "SEO migration & setup"],
    startingFrom: "$2,999 USD",
  },
  {
    title: "Architectural Design",
    tag: "Built Environment",
    desc: "Residential plans, 3D visualisation, and construction intelligence. Drawing on years of experience at Gabochie Design serving clients across Ghana and the diaspora.",
    deliverables: ["Floor plans & elevations", "3D renderings", "Material selection", "Cost estimation"],
    startingFrom: "$5,000 USD",
  },
];

export default function ServicesPage() {
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
              { step: "03", title: "Proceeds fund the Institute", desc: "Every dollar goes toward the Lutterodt Institute — the Digital Museum, the Neo-Manor, and the permanent archive." },
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

      {/* Free audit CTA */}
      <section className="bg-burgundy-ink py-[64px]">
        <div className="container-main text-center">
          <Tag onDark className="justify-center flex">Free Audit</Tag>
          <h2 className="text-ivory text-[clamp(26px,3vw,36px)] mt-[14px] mb-3 max-w-[24ch] mx-auto">Not sure if you need a redesign? Get a free website audit</h2>
          <p className="text-ivory/70 text-[15px] mb-6 max-w-[48ch] mx-auto">Enter your URL, get your score in 60 seconds. No obligation, no credit card.</p>
          <a href="https://gideonabochie.com/#audit" target="_blank" rel="noopener noreferrer" className="btn-gold inline-block">Get My Free Score</a>
        </div>
      </section>

      {/* Portfolio / Results */}
      <section className="py-[72px]">
        <div className="container-main">
          <div className="text-center mb-12">
            <Tag>Results</Tag>
            <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">Real redesigns, real results</h2>
            <p className="mt-3 text-[15px] text-charcoal/68">Web design projects for North American businesses — measurable outcomes, not just pretty screenshots.</p>
          </div>
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-[2px] bg-line max-w-4xl mx-auto mb-10">
            <div className="bg-ivory-dim p-[28px] text-center">
              <div className="text-[32px] font-display font-[600] text-burgundy-ink">161+</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mt-1">Sites Analyzed</div>
            </div>
            <div className="bg-ivory-dim p-[28px] text-center">
              <div className="text-[32px] font-display font-[600] text-burgundy-ink">30</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mt-1">States Covered</div>
            </div>
            <div className="bg-ivory-dim p-[28px] text-center">
              <div className="text-[32px] font-display font-[600] text-burgundy-ink">40–60%</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mt-1">Avg Engagement Lift</div>
            </div>
          </div>
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6 max-w-4xl mx-auto">
            <div className="bg-ivory-dim rounded-lg p-7 text-left">
              <div className="text-[32px] mb-2">★★★★★</div>
              <p className="text-[14px] text-charcoal/70 italic mb-4">&ldquo;Our online bookings increased 47% within 60 days of launch. The design finally matches the quality of care we provide.&rdquo;</p>
              <div className="text-[14px] font-medium">Dr. Rebecca Torres</div>
              <div className="text-[12px] text-charcoal/50">Beverly Hills Medical Group</div>
              <div className="mt-3 text-gold-dim text-[13px] font-mono">+47% Online Bookings</div>
            </div>
            <div className="bg-ivory-dim rounded-lg p-7 text-left">
              <div className="text-[32px] mb-2">★★★★★</div>
              <p className="text-[14px] text-charcoal/70 italic mb-4">&ldquo;We went from a dated 2010 site to a modern platform that actually generates qualified leads.&rdquo;</p>
              <div className="text-[14px] font-medium">Marcus Johnson</div>
              <div className="text-[12px] text-charcoal/50">CEO, Atlas Fabrication</div>
              <div className="mt-3 text-gold-dim text-[13px] font-mono">3x Lead Generation</div>
            </div>
            <div className="bg-ivory-dim rounded-lg p-7 text-left">
              <div className="text-[32px] mb-2">★★★★★</div>
              <p className="text-[14px] text-charcoal/70 italic mb-4">&ldquo;Mobile traffic conversions up 52%. The new site is fast, professional, and clients constantly compliment the experience.&rdquo;</p>
              <div className="text-[14px] font-medium">Sarah Liu</div>
              <div className="text-[12px] text-charcoal/50">Smith &amp; Associates Law</div>
              <div className="mt-3 text-gold-dim text-[13px] font-mono">+52% Mobile Conversions</div>
            </div>
          </div>
          <div className="text-center mt-10">
            <a href="https://gideonabochie.com/#portfolio" target="_blank" rel="noopener noreferrer" className="text-gold-dim text-[13px] font-mono tracking-wider uppercase hover:underline">
              View full portfolio on gideonabochie.com →
            </a>
          </div>
        </div>
      </section>

      {/* Platform projects */}
      <section className="py-[72px] bg-ivory-dim">
        <div className="container-main">
          <div className="text-center mb-10">
            <Tag>Platforms</Tag>
            <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">Other projects</h2>
          </div>
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 max-w-3xl mx-auto">
            <a href="https://gabochiedesign.com" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg p-8 text-center hover:bg-ivory transition-colors">
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mb-2">Gabochie Design</div>
              <h3 className="text-[18px] mb-2">Construction Intelligence Platform</h3>
              <p className="text-[13px] text-charcoal/60">3+ tools, 500+ users, 98% accuracy — serving Ghana&apos;s construction professionals.</p>
            </a>
            <a href="https://gideonabochie.org" target="_blank" rel="noopener noreferrer" className="bg-white rounded-lg p-8 text-center hover:bg-ivory transition-colors">
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mb-2">GideonAbochie Studio</div>
              <h3 className="text-[18px] mb-2">School of Creativity, Love & Wisdom</h3>
              <p className="text-[13px] text-charcoal/60">Bible-based teaching platform with courses, books, and a growing TikTok community.</p>
            </a>
          </div>
        </div>
      </section>

      {/* Payment */}
      <section className="py-[72px] bg-ivory-dim">
        <div className="container-main text-center max-w-lg">
          <Tag>Payment</Tag>
          <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">How to pay</h2>
          <p className="mt-3 text-[15px] text-charcoal/68 mb-6">
            After booking a consultation, I&rsquo;ll send you the bank transfer details (SWIFT) and an invoice. All payments are by direct bank transfer — no third-party processors.
          </p>
          <a href="https://wa.me/233243262019" target="_blank" rel="noopener noreferrer" className="btn-gold inline-block">Request Payment Details</a>
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
              { q: "What does a project cost?", a: "Web design starts from $2,999 USD (Starter), $5,999 (Growth), or $9,999 (Enterprise). Architectural design from $5,000 USD. Get a free website audit first, then book a consultation for a fixed quote." },
              { q: "How do I pay?", a: "All payments are by direct bank transfer. After booking a consultation, I'll send you the SWIFT details and an invoice. I can bill in USD, GHS, GBP, or EUR depending on your preference." },
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
