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
    a: "This is an independent community project led by members of the Lutterodt family. We are not affiliated with any institution or corporation.",
  },
  {
    q: "Is my personal data safe?",
    a: "We only include information that is already public or that the individual has consented to. We never publish contact details without permission.",
  },
  {
    q: "How can I support the project?",
    a: "The best way to support us is to get in touch. Whether you want to contribute materials, nominate a family member, or simply learn more -- we welcome your involvement.",
  },
];

export default function SponsorPage() {
  const [stats, setStats] = useState<DirStats | null>(null);

  useEffect(() => {
    fetch("/api/directory")
      .then((r) => r.json())
      .then((d) => setStats({ totalProfiles: d.totalProfiles, livingProfiles: d.livingProfiles, countries: d.countries, continents: d.continents }))
      .catch(() => {});
  }, []);

  const totalProfiles = stats?.totalProfiles ?? 77;
  const countryCount = stats?.countries?.length ?? 11;
  const continents = stats?.continents ?? 6;
  const livingProfiles = stats?.livingProfiles ?? 69;

  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Get Involved"
        tag="The Lutterodt Renaissance"
        title="Help us build a complete record of the Lutterodt family"
        description={`We have documented ${totalProfiles} Lutterodts across ${countryCount} countries and ${continents} continents. If you are a Lutterodt or know one, we would like to hear from you.`}
      />

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

      <section className="py-[108px]">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Tag>Get Involved</Tag>
            <h2 className="text-[clamp(28px,3.2vw,40px)] mt-[14px]">
              Ways to be part of this
            </h2>
            <p className="mt-4 text-[16px] text-charcoal/68">
              This project grows with every person who reaches out. Here is how you can be involved.
            </p>
          </div>

          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-[2px] bg-line max-w-4xl mx-auto">
            {ways.map((way) => (
              <div
                key={way.title}
                className="bg-ivory p-[32px] pb-[36px] flex flex-col"
              >
                <h3 className="text-[22px] font-display font-[550] text-burgundy-ink">
                  {way.title}
                </h3>
                <p className="mt-3 text-[14.5px] text-charcoal/68 leading-relaxed flex-1">
                  {way.body}
                </p>
                <Link
                  href={way.href}
                  className="mt-[24px] text-center text-[12px] tracking-widest uppercase py-3 rounded-sm transition-all font-medium bg-burgundy text-ivory hover:bg-burgundy-deep"
                >
                  {way.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[72px] bg-ivory-dim">
        <div className="container-main max-w-3xl">
          <div className="text-center mb-12">
            <Tag>Questions</Tag>
            <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">Frequently asked questions</h2>
          </div>
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[2px] bg-line">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-ivory p-[28px] pb-[30px]">
                <h3 className="text-[16px] font-display font-[550] text-burgundy-ink mb-[10px]">
                  {faq.q}
                </h3>
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
            Whether you are here to learn, to contribute, or to find your place in the family tree -- we welcome you.
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
