import { getSetting } from "@/lib/pocketbase/settings";
import { FullSite } from "@/components/home/FullSite";
import { Tag } from "@/components/shared/Tag";
import { StatCell } from "@/components/shared/StatCell";

function ComingSoon() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-burgundy-ink overflow-hidden px-6">
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
          <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="mailto:gabochie@gmail.com" className="btn-gold">Get in Touch</a>
            <a href="https://wa.me/233243262019" target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp</a>
          </div>
            <a href="https://wa.me/233243262019" target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp</a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest uppercase text-ivory/40 animate-pulse">
          Scroll to learn more
        </div>
      </section>

      {/* Vision */}
      <section className="py-[108px] bg-burgundy-ink text-ivory relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(198,161,91,0.06),transparent_50%)] pointer-events-none" />
        <div className="container-main relative z-10">
          <Tag onDark>Our Vision</Tag>
          <h2 className="text-ivory text-[clamp(28px,3.4vw,42px)] font-display mt-[18px] mb-6 max-w-[18ch] leading-tight">
            A permanent digital record&mdash;for the family, by the family
          </h2>
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-12">
            <div>
              <p className="text-ivory/70 text-[16px] leading-relaxed">
                The Lutterodt Renaissance is more than an archive&mdash;it is a commitment to preserve and share the story of six generations, spanning four continents, from the earliest documented arrival to the present day.
              </p>
              <p className="text-ivory/70 text-[16px] leading-relaxed mt-4">
                Every photograph, letter, ledger and oral history is being digitised, catalogued and made accessible in a single living record so that those who come next can always find their place in the story.
              </p>
            </div>
            <div>
              <p className="text-ivory/70 text-[16px] leading-relaxed">
                We believe that family history is not just a record of the past&mdash;it is a foundation for the future. By building this archive, we are creating a cultural asset that strengthens identity, connects the diaspora, and preserves the Lutterodt name for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-charcoal text-ivory">
        <div className="container-main">
          <div className="grid grid-cols-4 max-md:grid-cols-2">
            <StatCell number="6" label="Generations Recorded" />
            <StatCell number="140+" label="Historical Records" />
            <StatCell number="1847" label="Earliest Entry" />
            <StatCell number="4" label="Continents Reached" />
          </div>
        </div>
      </section>

      {/* What We're Building */}
      <section className="py-[108px]">
        <div className="container-main">
          <Tag>What We&apos;re Building</Tag>
          <h2 className="text-[clamp(28px,3.4vw,42px)] mt-[18px] mb-14">A living archive built for the future</h2>
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-[2px] bg-line">
            <div className="bg-ivory p-[34px] pb-[30px]">
              <Tag>Feature</Tag>
              <h3 className="text-[21px] mt-[14px] mb-[10px]">Digital Archive</h3>
              <p className="text-charcoal/66 text-[14.5px]">
                A searchable, chronological record of every known milestone&mdash;births, migrations, businesses, homes and reunions&mdash;each with verified sources, images and context.
              </p>
            </div>
            <div className="bg-ivory p-[34px] pb-[30px]">
              <Tag>Feature</Tag>
              <h3 className="text-[21px] mt-[14px] mb-[10px]">Community Platform</h3>
              <p className="text-charcoal/66 text-[14.5px]">
                A space for family members across the diaspora to connect, share stories and photographs, contribute records, and stay informed about gatherings and milestones.
              </p>
            </div>
            <div className="bg-ivory p-[34px] pb-[30px]">
              <Tag>Feature</Tag>
              <h3 className="text-[21px] mt-[14px] mb-[10px]">Built to Last</h3>
              <p className="text-charcoal/66 text-[14.5px]">
                Modern, performant architecture deployed on Cloudflare&apos;s global network&mdash;ensuring fast access from anywhere, permanent storage, and a foundation that can grow with the family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="bg-burgundy-ink text-ivory py-[108px] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(198,161,91,0.10),transparent_45%)] pointer-events-none" />
        <div className="container-main relative z-10">
          <Tag onDark>Progress</Tag>
          <h2 className="text-ivory text-[clamp(28px,3.4vw,42px)] mt-[18px] mb-10">What we have achieved so far</h2>
          <div className="max-w-2xl">
            <div className="flex gap-4 mb-8">
              <div className="w-[1px] shrink-0 bg-gold-dim/30" />
              <div>
                <p className="text-gold-light font-mono text-[11px] tracking-widest uppercase">Complete</p>
                <p className="text-ivory/80 mt-1 text-[15px]">Core archive platform built and deployed online</p>
              </div>
            </div>
            <div className="flex gap-4 mb-8">
              <div className="w-[1px] shrink-0 bg-gold-dim/30" />
              <div>
                <p className="text-gold-light font-mono text-[11px] tracking-widest uppercase">Complete</p>
                <p className="text-ivory/80 mt-1 text-[15px]">140+ historical records digitised and catalogued</p>
              </div>
            </div>
            <div className="flex gap-4 mb-8">
              <div className="w-[1px] shrink-0 bg-gold-dim/30" />
              <div>
                <p className="text-gold-light font-mono text-[11px] tracking-widest uppercase">Coming August 2026</p>
                <p className="text-ivory/80 mt-1 text-[15px]">Renaissance Family Congress in Accra&mdash;official archive unveiling</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[1px] shrink-0 bg-gold-dim/30" />
              <div>
                <p className="text-gold-light font-mono text-[11px] tracking-widest uppercase">Phase 2</p>
                <p className="text-ivory/80 mt-1 text-[15px]">Member accounts, private family tree, collaborative storytelling and mobile app</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funding */}
      <section className="py-[108px]">
        <div className="container-main">
          <Tag>Funding & Support</Tag>
          <h2 className="text-[clamp(28px,3.4vw,42px)] mt-[18px] mb-4">
            A production-grade archive costs about $1,000 per year
          </h2>
          <p className="text-charcoal/66 text-[16px] max-w-[640px] mb-12">
            Here is how the annual budget is allocated to keep the Lutterodt Renaissance online, secure and growing:
          </p>
          <div className="grid grid-cols-3 max-md:grid-cols-1 gap-6 mb-12">
            <div className="border border-line rounded-sm p-6">
              <p className="font-mono text-[10.5px] tracking-widest uppercase text-gold-dim mb-2">Infrastructure</p>
              <p className="text-[28px] font-display text-burgundy-ink">$432</p>
              <p className="text-charcoal/50 text-[13px] mt-2">Cloud hosting, file storage, email service, domain renewal and automated backups</p>
            </div>
            <div className="border border-line rounded-sm p-6">
              <p className="font-mono text-[10.5px] tracking-widest uppercase text-gold-dim mb-2">Digitisation</p>
              <p className="text-[28px] font-display text-burgundy-ink">$300</p>
              <p className="text-charcoal/50 text-[13px] mt-2">Scanning equipment, OCR software and professional catalogue management</p>
            </div>
            <div className="border border-line rounded-sm p-6">
              <p className="font-mono text-[10.5px] tracking-widest uppercase text-gold-dim mb-2">Development</p>
              <p className="text-[28px] font-display text-burgundy-ink">$300</p>
              <p className="text-charcoal/50 text-[13px] mt-2">Feature development, security updates, maintenance support and new capabilities</p>
            </div>
          </div>
          <div className="bg-burgundy-ink text-ivory p-8 rounded-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <Tag onDark>Support the Renaissance</Tag>
                <h3 className="text-ivory text-[24px] font-display mt-3 mb-2">Help us preserve the record</h3>
                <p className="text-ivory/60 text-[14px] max-w-[500px]">
                  Whether through a grant, an impact investment or a personal contribution&mdash;every bit of support brings the archive closer to permanence. Reach out to learn more or to discuss partnership opportunities.
                </p>
              </div>
              <div className="flex gap-3 shrink-0 flex-wrap">
                <a href="mailto:gabochie@gmail.com" className="btn-gold">Contact Us About Funding</a>
                <a href="https://wa.me/233243262019" target="_blank" rel="noopener noreferrer" className="btn-ghost">WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Connected */}
      <section className="py-[72px] bg-charcoal text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(198,161,91,0.08),transparent_60%)] pointer-events-none" />
        <div className="container-main relative z-10">
          <Tag onDark className="justify-center flex">Stay Connected</Tag>
          <h2 className="text-ivory text-[clamp(28px,3.4vw,38px)] max-w-[20ch] mx-auto mt-[18px] mb-[22px]">Be part of the Lutterodt Renaissance</h2>
          <p className="text-ivory/60 max-w-[52ch] mx-auto mb-[34px]">
            Whether you are a family member, a historian or a supporter&mdash;we would love to hear from you.
          </p>
          <a href="mailto:gabochie@gmail.com" className="btn-gold">Get in Touch</a>
          <p className="mt-10 text-ivory/30 font-mono text-[10px] tracking-widest uppercase">
            Accra · London
          </p>
        </div>
      </section>
    </>
  );
}

export default async function Home() {
  const comingSoon = await getSetting("coming_soon");

  if (comingSoon !== "false") {
    return <ComingSoon />;
  }

  return <FullSite />;
}
