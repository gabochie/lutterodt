import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "@/components/shared/Tag";
import { PageHero } from "@/components/shared/PageHero";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export const metadata: Metadata = {
  title: "About — The Lutterodt Institute",
  description: "The Lutterodt Renaissance is the digital arm of the Lutterodt Institute — a personal initiative to preserve family heritage and build a lasting institution in honour of a Lutterodt mother.",
};

const values = [
  {
    num: "01",
    title: "Preserve, faithfully",
    description: "Records are catalogued with their sources intact. Where an account is disputed or incomplete, we say so rather than smoothing it over.",
  },
  {
    num: "02",
    title: "Include every branch",
    description: "The archive is built to represent all branches of the family — at home and across the diaspora — equally.",
  },
  {
    num: "03",
    title: "Build for the long term",
    description: "The technical foundation is chosen to still make sense in twenty years, not just to look impressive at launch.",
  },
  {
    num: "04",
    title: "Open the door, carefully",
    description: "The public can see the family's history; only the family can add to it. Access and editing rights are deliberately separated.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="About"
        tag="The Lutterodt Institute"
        title="Building a legacy for my mother — and for every Lutterodt"
        description="The Renaissance is the digital face of the Lutterodt Institute: a personal initiative to document, connect, and uplift the global Lutterodt family. Every profile, every story, every project — building toward an institution that will outlive us."
      />

      <section className="py-[108px]">
        <div className="container-main">
          <div className="grid grid-cols-[1fr_1fr] max-md:grid-cols-1 gap-16 items-center">
            <div>
              <Tag>Origin</Tag>
              <h2 className="text-[clamp(30px,3.4vw,44px)] mt-[14px]">A son&apos;s tribute, becoming a family&apos;s institution</h2>
              <p className="mt-[18px] text-charcoal/70 text-[16px]">
                My mother is a Lutterodt. This project began as a way to honour her — by documenting the family she comes from, connecting the branches she belongs to, and building something that carries her name forward for generations. What started as a personal archive grew into the Lutterodt Institute, and this website is its public face.
              </p>
              <p className="mt-[18px] text-charcoal/70 text-[16px]">
                The Renaissance is not an official family project with a committee or a charter. It is one person&apos;s initiative, built transparently, with the hope that the family will recognise it, contribute to it, and one day take stewardship of it. Every profile, every story, every project on this site is a step toward that institution.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1000&auto=format&fit=crop"
              alt="Archive of old family photographs"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-[108px] bg-ivory-dim">
        <div className="container-main">
          <div className="max-w-[640px] mb-14">
            <Tag>Mission</Tag>
            <h2 className="text-[clamp(30px,3.4vw,44px)] mt-[18px]">Four commitments guide the work</h2>
            <p className="mt-4 text-[16.5px] text-charcoal/68 max-w-[540px]">These are the standards every decision on this platform is measured against.</p>
          </div>
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-10">
            {values.map((v) => (
              <ScrollReveal key={v.num}>
                <div>
                  <div className="font-mono text-[12px] text-gold-dim mb-[14px]">{v.num}</div>
                  <h3 className="text-[20px] mb-[10px]">{v.title}</h3>
                  <p className="text-charcoal/65 text-[14.5px]">{v.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[108px]">
        <div className="container-main">
          <div className="grid grid-cols-[1fr_1fr] max-md:grid-cols-1 gap-16 items-center">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop"
              alt="Family gathering"
              className="w-full aspect-[4/5] object-cover"
            />
            <div>
              <Tag>Stewardship</Tag>
              <h2 className="text-[clamp(30px,3.4vw,44px)] mt-[14px]">Built by one, meant for all</h2>
              <p className="mt-[18px] text-charcoal/70 text-[16px]">
                The Lutterodt Institute is currently a solo initiative — founded and run by one person, funded out of pocket, and built with the long-term goal of becoming a family-governed institution. There is no Renaissance Committee, no elected congress, no formal structure. That is the destination, not the starting point.
              </p>
              <p className="mt-[18px] text-charcoal/70 text-[16px]">
                The end goal is a properly constituted Institute — with a board, a charter, family representation from every branch, and a clear succession plan that ensures the work continues regardless of who founded it. Every sponsorship, every contribution, every connection made through this site brings that future closer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-burgundy-ink text-center py-[72px] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(198,161,91,0.14),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(47,74,60,0.35),transparent_50%)] pointer-events-none" />
        <div className="container-main relative z-10">
          <Tag onDark className="justify-center flex">The Lutterodt Institute</Tag>
          <h2 className="text-ivory text-[clamp(30px,3.4vw,44px)] max-w-[26ch] mx-auto mt-[18px] mb-[20px]">A Renaissance is not a return to the past — it is the past, put to use building what comes next</h2>
          <p className="text-ivory/70 max-w-[56ch] mx-auto mb-[34px]">From a personal tribute to a lasting institution. Every profile documented, every connection made, every project funded is a step toward the Lutterodt Institute — a permanent home for the family&apos;s heritage.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/sponsor" className="btn-gold">Support the Institute</Link>
            <Link href="/history" className="btn-outline-ivory">Explore the History</Link>
          </div>
        </div>
      </section>
    </>
  );
}
