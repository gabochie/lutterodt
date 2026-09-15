"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Tag } from "@/components/shared/Tag";
import { PageHero } from "@/components/shared/PageHero";

interface DirStats {
  totalProfiles: number;
  livingProfiles: number;
  countries: string[];
  continents: number;
}

interface Tier {
  name: string;
  amount: string;
  benefits: string;
}

const ways = [
  {
    title: "Get in Touch",
    body: "Whether you are a Lutterodt, a researcher, or simply curious about this family -- we would like to hear from you. Reach out and we will connect.",
    cta: "Contact Us",
    href: "/contact",
  },
  {
    title: "Nominate a Lutterodt",
    body: "Know a Lutterodt who should be in the directory? We research every nomination and add profiles based on public records and consent. No one is listed without care.",
    cta: "Nominate Someone",
    href: "/contact",
  },
  {
    title: "Contribute",
    body: "If you have photographs, documents, or stories about the Lutterodt family, we are interested in preserving them. Every contribution helps us build a more complete picture.",
    cta: "Contribute Materials",
    href: "/contact",
  },
];

const faqs = [
  {
    q: "How do you verify profiles?",
    a: "Every profile is researched through public records, professional registries, academic databases, and LinkedIn. We cross-reference multiple sources before listing anyone.",
  },
  {
    q: "Can I request a profile to be removed or updated?",
    a: "Yes. This is your family record. Contact us and we will update or remove any profile immediately at the individual's request.",
  },
  {
    q: "Who is behind this project?",
    a: "The Lutterodt Renaissance and the Lutterodt Institute are a personal initiative founded by one person — a son of a Lutterodt mother, building a permanent institution in her honour. There is no formal committee or elected body; the goal is to grow this into a family-governed institution over time.",
  },
  {
    q: "How are sponsorship funds used?",
    a: "Every contribution goes directly toward server infrastructure, digital preservation, 3D museum development, land acquisition for the Neo-Manor, and community programming. A detailed impact report is shared annually with all sponsors.",
  },
  {
    q: "Is my personal data safe?",
    a: "We only include information that is already public or that the individual has consented to. We never publish contact details without permission.",
  },
  {
    q: "Can I sponsor via bank transfer?",
    a: "Yes. Bank account details (SWIFT code) are provided on request. Contact us via WhatsApp or the contact form and we will send the details within 24 hours. This is the simplest way to contribute without third-party payment processors.",
  },
  {
    q: "What is the Lutterodt Institute?",
    a: "The Lutterodt Institute is the envisioned permanent institution that will one day house the family archive, the Digital Museum, the Neo-Manor, and cultural programming for the global diaspora. The Renaissance website is the digital arm of that Institute — built now, so the foundation is ready when the full institution is realised.",
  },
  {
    q: "How can I support the project?",
    a: "You can sponsor via bank transfer (SWIFT details provided on request through WhatsApp or the contact form), or request a sponsorship packet for bespoke partnership options. Non-financial contributions — materials, nominations, research — are equally valuable.",
  },
];

export function SponsorClient() {
  const [stats, setStats] = useState<DirStats | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [form, setForm] = useState({ name: "", email: "", organization: "", contactPerson: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/directory")
      .then((r) => r.json())
      .then((d) => setStats({ totalProfiles: d.totalProfiles, livingProfiles: d.livingProfiles, countries: d.countries, continents: d.continents }))
      .catch(() => {});
    fetch("/api/sponsors")
      .then((r) => r.json())
      .then((d) => setTiers(d.tiers || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, queue: true }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Request failed");
      }
      setStatus("success");
      setForm({ name: "", email: "", organization: "", contactPerson: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Request failed");
    }
  };

  const totalProfiles = stats?.totalProfiles ?? 208;
  const countryCount = stats?.countries?.length ?? 16;
  const continents = stats?.continents ?? 6;
  const livingProfiles = stats?.livingProfiles ?? 140;

  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Sponsor & Get Involved"
        tag="The Lutterodt Institute"
        title="Help build an institution that will outlive us"
        description={`${totalProfiles} Lutterodts documented across ${countryCount} countries. The Renaissance is the digital arm of the Lutterodt Institute — your sponsorship funds the Digital Museum, the Neo-Manor, and the permanent archive.`}
      />

      {/* Sponsorship tiers */}
      <section className="py-[72px]">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Tag>Sponsorship</Tag>
            <h2 className="text-[clamp(28px,3.2vw,40px)] mt-[14px]">
              Become a sponsor of the Lutterodt Institute
            </h2>
            <p className="mt-4 text-[16px] text-charcoal/68">
              Every contribution goes directly toward building the Lutterodt Institute — a permanent institution housing the Digital Museum, the Neo-Manor, and the family archive. From a personal tribute to a lasting legacy.
            </p>
          </div>

          <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-[2px] bg-line max-w-5xl mx-auto mb-12">
            {tiers.map((tier) => (
              <div key={tier.name} className="bg-ivory p-[28px] pb-[32px] flex flex-col">
                <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">Tier</div>
                <h3 className="text-[22px] font-display font-[550] text-burgundy-ink mt-1">{tier.name}</h3>
                <div className="text-[28px] font-display font-[600] text-burgundy mt-2 mb-3">{tier.amount}</div>
                <p className="text-[13px] text-charcoal/68 leading-relaxed flex-1">{tier.benefits}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="#packet" className="btn-gold inline-block">Request Sponsorship Packet</Link>
          </div>

          <div className="max-w-lg mx-auto mt-10 p-6 bg-ivory-dim rounded-lg border border-line text-center">
            <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mb-2">Also available</div>
            <h3 className="text-[18px] font-display font-[550] text-burgundy-ink">Sponsor via Bank Transfer</h3>
            <p className="text-[14px] text-charcoal/68 mt-2 mb-4">
              Prefer to transfer directly? Bank account details (SWIFT) are provided on request. Contact us and we&rsquo;ll send the information within 24 hours.
            </p>
            <a href="https://wa.me/233243262019" target="_blank" rel="noopener noreferrer" className="text-gold-dim text-[13px] font-mono tracking-wider uppercase hover:underline">
              Request bank details via WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* Projects being sponsored */}
      <section className="py-[72px] bg-ivory-dim">
        <div className="container-main">
          <div className="text-center mb-12">
            <Tag>Initiatives</Tag>
            <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">Four initiatives your sponsorship powers</h2>
          </div>
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 max-w-4xl mx-auto">
            {[
              { title: "The Digital Archive", desc: "A searchable online record of every notable Lutterodt — biographies, photographs, genealogical links. Live at lutterodt.org with 208 profiles.", status: "Live" },
              { title: "3D Digital Museum", desc: "An interactive virtual museum exploring Lutterodt history through immersive exhibits, archival documents, and multimedia storytelling.", status: "Seeking Sponsorship" },
              { title: "Neo-Lutterodt Manor", desc: "A physical heritage centre in Accra, Ghana — housing physical archives, exhibition space, and cultural programming for the global diaspora.", status: "Seeking Sponsorship" },
              { title: "Digital Heritage Network", desc: "A platform connecting Lutterodts worldwide for mentorship, collaboration, and cultural exchange.", status: "Seeking Partners" },
            ].map((p) => (
              <div key={p.title} className="bg-ivory p-[28px] pb-[30px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[17px] font-display font-[550] text-burgundy-ink">{p.title}</h3>
                  <span className="font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-sm bg-burgundy/8 text-burgundy">{p.status}</span>
                </div>
                <p className="text-[14px] text-charcoal/68 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Sponsorship Packet form */}
      <section id="packet" className="py-[72px]">
        <div className="container-main max-w-xl">
          <div className="text-center mb-10">
            <Tag>Request Packet</Tag>
            <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">Request a sponsorship packet</h2>
            <p className="mt-3 text-[15px] text-charcoal/68">
              Enter your details and we will send you a personalised sponsorship prospectus with case studies, timelines, and bespoke partnership options.
            </p>
          </div>

          {status === "success" ? (
            <div className="bg-[#e6f7e6] border border-[#4caf50] rounded-sm p-[28px] text-center">
              <p className="text-[16px] font-medium text-[#2e7d32]">Sponsorship packet requested successfully.</p>
              <p className="text-[14px] text-[#2e7d32]/70 mt-2">Check your email for the personalised prospectus.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-mono text-[11px] tracking-widest uppercase text-charcoal/50 mb-1.5">Your Name *</label>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-ivory border border-line px-4 py-3 text-[15px] text-charcoal outline-none focus:border-gold-dim transition-colors" placeholder="Full name" />
              </div>
              <div>
                <label className="block font-mono text-[11px] tracking-widest uppercase text-charcoal/50 mb-1.5">Email Address *</label>
                <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full bg-ivory border border-line px-4 py-3 text-[15px] text-charcoal outline-none focus:border-gold-dim transition-colors" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block font-mono text-[11px] tracking-widest uppercase text-charcoal/50 mb-1.5">Organisation</label>
                <input value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))} className="w-full bg-ivory border border-line px-4 py-3 text-[15px] text-charcoal outline-none focus:border-gold-dim transition-colors" placeholder="Company, foundation, or institution" />
              </div>
              <div>
                <label className="block font-mono text-[11px] tracking-widest uppercase text-charcoal/50 mb-1.5">Contact Person (if different)</label>
                <input value={form.contactPerson} onChange={e => setForm(p => ({ ...p, contactPerson: e.target.value }))} className="w-full bg-ivory border border-line px-4 py-3 text-[15px] text-charcoal outline-none focus:border-gold-dim transition-colors" placeholder="Name of decision-maker" />
              </div>
              {status === "error" && <p className="text-red-600 text-[14px]">{errorMsg}</p>}
              <button type="submit" disabled={status === "loading"} className="btn-gold w-full text-center disabled:opacity-50">
                {status === "loading" ? "Sending..." : "Request Sponsorship Packet"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-[72px] bg-ivory-dim">
        <div className="container-main text-center">
          <Tag>Project Progress</Tag>
          <h2 className="text-[clamp(28px,3.2vw,40px)] mt-[14px] max-w-[26ch] mx-auto">
            A family archive being built, one profile at a time.
          </h2>
          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-[2px] bg-line mt-10 max-w-3xl mx-auto">
            <div className="bg-ivory p-[22px] text-center">
              <div className="text-[32px] font-display font-[600] text-burgundy-ink">{totalProfiles}</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mt-1">Profiles</div>
            </div>
            <div className="bg-ivory p-[22px] text-center">
              <div className="text-[32px] font-display font-[600] text-burgundy-ink">{countryCount}</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mt-1">Countries</div>
            </div>
            <div className="bg-ivory p-[22px] text-center">
              <div className="text-[32px] font-display font-[600] text-burgundy-ink">{continents}</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mt-1">Continents</div>
            </div>
            <div className="bg-ivory p-[22px] text-center">
              <div className="text-[32px] font-display font-[600] text-burgundy-ink">{livingProfiles}</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mt-1">Living Notables</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to be involved (non-financial) */}
      <section className="py-[108px]">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Tag>Get Involved</Tag>
            <h2 className="text-[clamp(28px,3.2vw,40px)] mt-[14px]">
              Other ways to be part of this
            </h2>
            <p className="mt-4 text-[16px] text-charcoal/68">
              Not ready to sponsor? You can still contribute to the archive in meaningful ways.
            </p>
          </div>

          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-[2px] bg-line max-w-4xl mx-auto">
            {ways.map((way) => (
              <div key={way.title} className="bg-ivory p-[32px] pb-[36px] flex flex-col">
                <h3 className="text-[22px] font-display font-[550] text-burgundy-ink">{way.title}</h3>
                <p className="mt-3 text-[14.5px] text-charcoal/68 leading-relaxed flex-1">{way.body}</p>
                <Link href={way.href} className="mt-[24px] text-center text-[12px] tracking-widest uppercase py-3 rounded-sm transition-all font-medium bg-burgundy text-ivory hover:bg-burgundy-deep">{way.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-[72px] bg-ivory-dim">
        <div className="container-main max-w-3xl">
          <div className="text-center mb-12">
            <Tag>Questions</Tag>
            <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">Frequently asked questions</h2>
          </div>
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[2px] bg-line">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-ivory p-[28px] pb-[30px]">
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
          <Tag onDark className="justify-center flex">Keep in Touch</Tag>
          <h2 className="text-ivory text-[clamp(28px,3.2vw,40px)] max-w-[22ch] mx-auto mt-[18px] mb-[22px]">
            Every Lutterodt has a place in this record
          </h2>
          <p className="text-ivory/70 max-w-[48ch] mx-auto mb-[34px]">
            Whether you are here to sponsor, to learn, to contribute, or to find your place in the family tree — we welcome you.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/directory" className="btn-gold">Browse the Directory</Link>
            <Link href="/contact" className="btn-ghost">Get in Touch</Link>
          </div>
        </div>
      </section>
    </>
  );
}