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
    a: "The Lutterodt Renaissance and the Lutterodt Institute are stewarded by founder Gideon Borketey Tieku-Bortei on behalf of the global Lutterodt family, with the goal of growing into a family-governed institution over time. There is no formal committee or elected body yet.",
  },
  {
    q: "How is support used?",
    a: "Every contribution goes directly toward the archive itself — server infrastructure, digital preservation, the 3D museum, and community programming. A detailed impact report is shared annually with all supporters.",
  },
  {
    q: "Is my personal data safe?",
    a: "We only include information that is already public or that the individual has consented to. We never publish contact details without permission.",
  },
  {
    q: "What is the Lutterodt Institute?",
    a: "The Lutterodt Institute is the envisioned permanent institution that will one day house the family archive, the Digital Museum, the Neo-Manor, and cultural programming for the global diaspora. The Renaissance website is the digital arm of that Institute — built now, so the foundation is ready when the full institution is realised.",
  },
  {
    q: "How can I support the project?",
    a: "The most valuable contributions right now are non-financial — materials, nominations, research, and introductions. If you would like to discuss supporting the work in another way, get in touch and we will take it from there.",
  },
];

export function SponsorClient() {
  const [stats, setStats] = useState<DirStats | null>(null);

  useEffect(() => {
    fetch("/api/directory")
      .then((r) => r.json())
      .then((d) => setStats({ totalProfiles: d.totalProfiles, livingProfiles: d.livingProfiles, countries: d.countries, continents: d.continents }))
      .catch(() => {});
  }, []);

  const totalProfiles = stats?.totalProfiles ?? 208;
  const countryCount = stats?.countries?.length ?? 16;
  const continents = stats?.continents ?? 6;
  const livingProfiles = stats?.livingProfiles ?? 140;

  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Support & Get Involved"
        tag="The Lutterodt Institute"
        title="Help build an institution that will outlive us"
        description={`${totalProfiles} Lutterodts documented across ${countryCount} countries. The Renaissance is the digital arm of the Lutterodt Institute — the Digital Museum, the Neo-Manor, and the permanent archive.`}
      />

      {/* Support */}
      <section className="py-[72px]">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto">
            <Tag>Support</Tag>
            <h2 className="text-[clamp(28px,3.2vw,40px)] mt-[14px]">
              This work is carried by the family, for the family
            </h2>
            <p className="mt-4 text-[16px] text-charcoal/68">
              Right now the most meaningful way to support the Lutterodt Institute is to contribute what only you can — photographs, documents, stories, nominations, and research. Every contribution brings the permanent archive closer.
            </p>
            <div className="mt-8">
              <Link href="/contact" className="btn-gold inline-block">Get in Touch</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="py-[72px] bg-ivory-dim">
        <div className="container-main">
          <div className="text-center mb-12">
            <Tag>Initiatives</Tag>
            <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">What the Institute is building</h2>
          </div>
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 max-w-4xl mx-auto">
            {[
              { title: "The Digital Archive", desc: "A searchable online record of every notable Lutterodt — biographies, photographs, genealogical links.", status: "Live" },
              { title: "3D Digital Museum", desc: "An interactive virtual museum exploring Lutterodt history through immersive exhibits, archival documents, and multimedia storytelling.", status: "In development" },
              { title: "Neo-Lutterodt Manor", desc: "A physical heritage centre in Accra, Ghana — housing physical archives, exhibition space, and cultural programming for the global diaspora.", status: "Planned" },
              { title: "Digital Heritage Network", desc: "A platform connecting Lutterodts worldwide for mentorship, collaboration, and cultural exchange.", status: "Planned" },
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
              There are many ways to contribute to the archive — here is where to start.
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
            Whether you are here to learn, to contribute, or to find your place in the family tree — we welcome you.
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