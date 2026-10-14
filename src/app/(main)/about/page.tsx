import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "@/components/shared/Tag";
import { PageHero } from "@/components/shared/PageHero";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export const metadata: Metadata = {
  title: "About — The Lutterodt Institute",
  description: "The Lutterodt Renaissance is the digital arm of the Lutterodt Institute — preserving family heritage and building a lasting institution for every branch of the Lutterodt family.",
  alternates: { canonical: "/about" },
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
        title="A permanent home for every Lutterodt"
        description="The Renaissance is the digital face of the Lutterodt Institute: documenting, connecting, and uplifting the global Lutterodt family. Every profile, every story, every project — building toward an institution that will outlive us."
      />

      <section className="py-[108px]">
        <div className="container-main">
          <div className="grid grid-cols-[1fr_1fr] max-md:grid-cols-1 gap-16 items-center">
            <div>
              <Tag>Origin</Tag>
              <h2 className="text-[clamp(30px,3.4vw,44px)] mt-[14px]">One family&apos;s record, built to endure</h2>
              <p className="mt-[18px] text-fg/70 text-[16px]">
                The Lutterodt family spans generations, branches, and continents. This project exists to document that family — connecting its branches, preserving its stories, and building a permanent record that carries the Lutterodt name forward for generations. What began as a family archive is growing into the Lutterodt Institute, and this website is its public face.
              </p>
              <p className="mt-[18px] text-fg/70 text-[16px]">
                The Renaissance is not yet a formally chartered family institution with a committee or governing board. It is currently stewarded transparently, with the hope that the family will recognise it, contribute to it, and one day take stewardship of it. Every profile, every story, every project on this site is a step toward that institution.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1000&auto=format&fit=crop"
              alt="Archive of old family photographs"
              width={1000}
              height={1250}
              loading="lazy"
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
            <p className="mt-4 text-[16.5px] text-fg/68 max-w-[540px]">These are the standards every decision on this platform is measured against.</p>
          </div>
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-10">
            {values.map((v) => (
              <ScrollReveal key={v.num}>
                <div>
                  <div className="font-mono text-[12px] text-gold-dim mb-[14px]">{v.num}</div>
                  <h3 className="text-[20px] mb-[10px]">{v.title}</h3>
                  <p className="text-fg/65 text-[14.5px]">{v.description}</p>
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
              width={1000}
              height={1250}
              loading="lazy"
              className="w-full aspect-[4/5] object-cover"
            />
            <div>
              <Tag>Stewardship</Tag>
              <h2 className="text-[clamp(30px,3.4vw,44px)] mt-[14px]">Stewarded today, family-governed tomorrow</h2>
              <p className="mt-[18px] text-fg/70 text-[16px]">
                The Lutterodt Institute is currently stewarded by one person — built and funded independently, with the long-term goal of becoming a family-governed institution. There is no Renaissance Committee, no elected congress, no formal structure yet. That is the destination, not the starting point.
              </p>
              <p className="mt-[18px] text-fg/70 text-[16px]">
                The end goal is a properly constituted Institute — with a board, a charter, family representation from every branch, and a clear succession plan that ensures the work continues regardless of who founded it. Every contribution, every connection made through this site brings that future closer.
              </p>
              <p className="mt-[22px] font-mono text-[11px] tracking-[0.14em] uppercase text-fg-muted dark:text-ivory/70">
                Commissioned by Paulina Lutterodt Missions · Built by Gabochie DevLab
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[108px] bg-ivory-dim">
        <div className="container-main">
          <div className="grid grid-cols-[0.8fr_1.2fr] max-md:grid-cols-1 gap-12 items-center max-w-4xl mx-auto">
            <img
              src="https://gideonabochie.org/assets/images/headshot.jpg"
              alt="Gideon Borketey Tieku-Bortei — Founder"
              width={750}
              height={1000}
              loading="lazy"
              className="w-full aspect-[3/4] object-cover rounded-lg"
            />
            <div>
              <Tag>Founder</Tag>
              <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">Gideon Borketey Tieku-Bortei</h2>
              <p className="text-gold-dim text-[14px] font-mono tracking-wider mt-1 mb-5">Gideon Abochie · Gabochie Design · GideonAbochie Studio</p>
              <p className="text-fg/70 text-[15px]">
                I am an architect and web designer — founder of Gabochie Design, a construction and real estate intelligence platform serving Ghana and the diaspora, and GideonAbochie Studio, a creative teaching ministry. I steward the Lutterodt Institute to serve every branch of our family, building a permanent institution for the global Lutterodt family. The creative services I offer through this site — web design and architectural design — directly fund that mission.
              </p>
              <div className="flex gap-3 mt-6">
                <a href="/services" className="btn-gold text-[12px]">View Services</a>
                <a href="https://wa.me/233243262019" target="_blank" rel="noopener noreferrer" className="btn-primary text-[12px]">Book a Consultation</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-burgundy-ink text-center py-[72px] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(198,161,91,0.14),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(47,74,60,0.35),transparent_50%)] pointer-events-none" />
        <div className="container-main relative z-10">
          <Tag onDark className="justify-center flex">The Lutterodt Institute</Tag>
          <h2 className="text-ivory text-[clamp(30px,3.4vw,44px)] max-w-[26ch] mx-auto mt-[18px] mb-[20px]">A Renaissance is not a return to the past — it is the past, put to use building what comes next</h2>
          <p className="text-ivory/70 max-w-[56ch] mx-auto mb-[34px]">From a shared record to a lasting institution. Every profile documented, every connection made, every project funded is a step toward the Lutterodt Institute — a permanent home for the family&apos;s heritage.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/sponsor" className="btn-gold">Support the Institute</Link>
            <Link href="/history" className="btn-outline-ivory">Explore the History</Link>
          </div>
        </div>
      </section>
    </>
  );
}
