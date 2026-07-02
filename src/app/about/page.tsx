import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "@/components/shared/Tag";
import { PageHero } from "@/components/shared/PageHero";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export const metadata: Metadata = {
  title: "About",
  description: "The vision, mission, values and governance behind the Lutterodt Renaissance — a digital legacy platform for the Lutterodt family.",
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
        tag="Vision & Governance"
        title="Why we built the Renaissance"
        description="Not a memorial, and not a museum piece — a working record, maintained by the family, for the family, built to outlast any one of us."
      />

      <section className="py-[108px]">
        <div className="container-main">
          <div className="grid grid-cols-[1fr_1fr] max-md:grid-cols-1 gap-16 items-center">
            <div>
              <Tag>Vision</Tag>
              <h2 className="text-[clamp(30px,3.4vw,44px)] mt-[14px]">A digital home the family will still be using in fifty years</h2>
              <p className="mt-[18px] text-charcoal/70 text-[16px]">
                Every generation has kept records in its own way — ledgers, photo albums, letters folded into Bibles. The Renaissance gathers all of it into one place, catalogued properly, and built on a foundation that can grow with the family rather than age out with the technology of the moment.
              </p>
              <p className="mt-[18px] text-charcoal/70 text-[16px]">
                We are building for two audiences at once: the elders who hold the memory, and the youth who will one day be asked to carry it.
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
              alt="Family committee meeting"
              className="w-full aspect-[4/5] object-cover"
            />
            <div>
              <Tag>Governance</Tag>
              <h2 className="text-[clamp(30px,3.4vw,44px)] mt-[14px]">Stewarded by the Renaissance Committee</h2>
              <p className="mt-[18px] text-charcoal/70 text-[16px]">
                The platform is overseen by the Lutterodt Renaissance Committee, made up of representatives from each branch of the family, elected at the biennial Congress. The committee approves new content, sets archival standards, and holds final responsibility for what is published.
              </p>
              <p className="mt-[18px] text-charcoal/70 text-[16px]">
                Day-to-day content — articles, timeline entries, gallery uploads — is managed by appointed archivists and editors, with all publishing decisions logged and auditable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-burgundy-ink text-center py-[72px] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(198,161,91,0.14),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(47,74,60,0.35),transparent_50%)] pointer-events-none" />
        <div className="container-main relative z-10">
          <Tag onDark className="justify-center flex">Why Renaissance?</Tag>
          <h2 className="text-ivory text-[clamp(30px,3.4vw,44px)] max-w-[26ch] mx-auto mt-[18px] mb-[20px]">Because a family&apos;s history deserves the same care as a nation&apos;s</h2>
          <p className="text-ivory/70 max-w-[56ch] mx-auto mb-[34px]">A renaissance is not a return to the past — it is the past, put to use in building what comes next. That is what this platform is for.</p>
          <Link href="/history" className="btn-gold">Explore the History</Link>
        </div>
      </section>
    </>
  );
}
