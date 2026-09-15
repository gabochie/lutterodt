import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "@/components/shared/Tag";
import { PageHero } from "@/components/shared/PageHero";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export const metadata: Metadata = {
  title: "Projects",
  description: "The initiatives and vision behind the Lutterodt Renaissance — the digital archive, 3D museum, manor restoration and heritage network.",
};

const projects = [
  {
    id: "archive",
    title: "Lutterodt Renaissance",
    tag: "Live",
    status: "Active",
    summary: "The family legacy OS you are on right now — a searchable directory of 200+ Lutterodt profiles, a historical timeline, photographic gallery, outreach pipeline, and the living family tree.",
    highlights: [
      "205 documented profiles across 16 countries and 6 continents",
      "Historical timeline spanning 1790 to present",
      "Automated outreach system for family engagement",
      "Event hub for reunions and gatherings",
    ],
    href: "/directory",
    cta: "Browse the Directory",
  },
  {
    id: "museum",
    title: "Lutterodt Digital Museum",
    tag: "Concept",
    status: "Seeking Sponsorship",
    summary: "A browser-based 3D museum where visitors walk through a reconstructed 19th-century Lutterodt compound overlooking the Atlantic at Osu. Seven exhibition halls, interactive exhibits, and an AI-guided historical narrator.",
    highlights: [
      "Origins Hall — migration maps, trade routes, historical documents",
      "Photography Gallery — restored works from the Lutterodt studio archive",
      "Merchant Hall — interactive cocoa, palm oil and maritime trade exhibits",
      "Living Family Tree — dynamic 3D genealogy with biographies and oral histories",
    ],
    href: null,
    cta: null,
  },
  {
    id: "manor",
    title: "Neo-Lutterodt Manor",
    tag: "Concept",
    status: "Seeking Sponsorship",
    summary: "An architectural vision that reimagines the historic Lutterodt family compound as a 21st-century heritage estate — blending authentic Ga-Danish proportions with contemporary Ghanaian craftsmanship and smart-home technology.",
    highlights: [
      "Authentic Ga-Danish colonial architecture with modern adaptation",
      "Courtyard gardens, library, archives and family museum on site",
      "Innovation lab and Renaissance Hall for community programmes",
      "Solar-powered with restored 19th-century craftsmanship",
    ],
    href: null,
    cta: null,
  },
  {
    id: "network",
    title: "Digital Heritage Network",
    tag: "Vision",
    status: "Seeking Partners",
    summary: "A platform extending beyond one family — connecting the histories of influential Ghanaian families into a virtual Heritage District where visitors walk between reconstructed historic estates.",
    highlights: [
      "Partner families: Bruce, Bannerman, Richter, Brew, Vanderpuije, Hansen",
      "Shared infrastructure for digitisation, archiving and storytelling",
      "Connected virtual estates forming a cultural tourism corridor",
      "Open-source tools for family historians across the diaspora",
    ],
    href: null,
    cta: null,
  },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Projects"
        tag="Vision & Roadmap"
        title="Building the Renaissance"
        description="From the digital archive you are browsing to a 3D museum, a restored manor, and a network of family histories — these are the initiatives that make up the Lutterodt Renaissance."
      />

      <section className="py-[108px]">
        <div className="container-main">
          <div className="flex items-center justify-between mb-3">
            <Tag>Active</Tag>
          </div>
          <h2 className="text-[clamp(28px,3vw,40px)] mb-4">Live now</h2>
          <p className="text-charcoal/68 text-[16px] max-w-[58ch] mb-10">
            The directory and archive are already live and growing. Every other project on this page is a future initiative seeking sponsorship, partners, or specialist collaboration.
          </p>

          <div className="border border-line rounded-lg p-8 md:p-10 bg-ivory-dim/40">
            <div className="grid md:grid-cols-[1fr_1.3fr] gap-8 items-start">
              <div>
                <h3 className="text-[24px] mb-3">Lutterodt Renaissance</h3>
                <p className="text-charcoal/72 text-[15px] leading-relaxed mb-5">
                  The family legacy OS you are using right now. A searchable directory of 200+ Lutterodt profiles spanning 16 countries and 6 continents, with a historical timeline, photographic gallery, outreach pipeline, and event hub.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-3 text-[14.5px] text-charcoal/70">
                    <span className="text-gold-dim mt-[3px] shrink-0">&#x2022;</span>
                    205 documented profiles, 10 professional categories
                  </li>
                  <li className="flex items-start gap-3 text-[14.5px] text-charcoal/70">
                    <span className="text-gold-dim mt-[3px] shrink-0">&#x2022;</span>
                    Timeline from 1790 to present, gallery of 50+ images
                  </li>
                  <li className="flex items-start gap-3 text-[14.5px] text-charcoal/70">
                    <span className="text-gold-dim mt-[3px] shrink-0">&#x2022;</span>
                    Automated outreach system connecting living relatives
                  </li>
                  <li className="flex items-start gap-3 text-[14.5px] text-charcoal/70">
                    <span className="text-gold-dim mt-[3px] shrink-0">&#x2022;</span>
                    Event hub for reunions, research and media enquiries
                  </li>
                </ul>
                <Link href="/directory" className="btn-primary">Browse the Directory</Link>
              </div>
              <div className="relative rounded-md overflow-hidden border border-line">
                <img
                  src="/images/projects/concept-interior-01.jpg"
                  alt="Lutterodt Renaissance website concept"
                  width={1536}
                  height={1024}
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
                <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-ivory/60 text-[10px] px-3 py-1.5">
                  AI-generated concept visualisation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[108px] bg-ivory-dim/30">
        <div className="container-main">
          <Tag>Concepts</Tag>
          <h2 className="text-[clamp(28px,3vw,40px)] mt-3 mb-3">Future initiatives</h2>
          <p className="text-charcoal/68 text-[16px] max-w-[58ch] mb-12">
            These projects are in concept phase. Each one is an opportunity for sponsorship, collaboration or specialist partnership. The images below are AI-generated visualisations and may not reflect final designs.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal>
              <div className="border border-line rounded-lg overflow-hidden bg-white h-full flex flex-col">
                <div className="relative">
                  <img
                    src="/images/projects/concept-museum-01.jpg"
                    alt="Digital museum concept"
                    width={1024}
                    height={1536}
                    loading="lazy"
                    className="w-full h-[220px] object-cover"
                  />
                  <span className="absolute top-3 left-3 font-mono text-[10px] tracking-widest uppercase bg-burgundy-ink text-ivory px-2.5 py-1 rounded-sm">Seeking Sponsorship</span>
                  <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-ivory/60 text-[10px] px-3 py-1.5">
                    AI-generated concept visualisation
                  </p>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <Tag>Concept</Tag>
                  <h3 className="text-[22px] mt-3 mb-2">Lutterodt Digital Museum</h3>
                  <p className="text-[14px] text-charcoal/68 leading-relaxed mb-4 flex-1">
                    A browser-based 3D museum where visitors walk through a reconstructed 19th-century Lutterodt compound overlooking the Atlantic at Osu. Seven exhibition halls — from Origins Hall and the Photography Gallery to the Living Family Tree and Renaissance Hall — with interactive exhibits and an AI-guided narrator.
                  </p>
                  <ul className="space-y-1.5 mb-5">
                    <li className="text-[13px] text-charcoal/65 flex items-start gap-2">
                      <span className="text-gold-dim shrink-0">&#x2022;</span>
                      Immersive 3D halls with clickable artifacts and stories
                    </li>
                    <li className="text-[13px] text-charcoal/65 flex items-start gap-2">
                      <span className="text-gold-dim shrink-0">&#x2022;</span>
                      Restored Lutterodt photography in dedicated gallery
                    </li>
                    <li className="text-[13px] text-charcoal/65 flex items-start gap-2">
                      <span className="text-gold-dim shrink-0">&#x2022;</span>
                      Dynamic 3D family tree with biographies and oral histories
                    </li>
                    <li className="text-[13px] text-charcoal/65 flex items-start gap-2">
                      <span className="text-gold-dim shrink-0">&#x2022;</span>
                      Multi-language AI tour guide and interactive quizzes
                    </li>
                  </ul>
                  <Link href="/contact" className="btn-outline text-center text-[13px]">Enquire about sponsoring</Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="border border-line rounded-lg overflow-hidden bg-white h-full flex flex-col">
                <div className="relative">
                  <img
                    src="/images/projects/concept-manor-01.jpg"
                    alt="Neo-Lutterodt Manor concept"
                    width={1536}
                    height={1024}
                    loading="lazy"
                    className="w-full h-[220px] object-cover"
                  />
                  <span className="absolute top-3 left-3 font-mono text-[10px] tracking-widest uppercase bg-burgundy-ink text-ivory px-2.5 py-1 rounded-sm">Seeking Sponsorship</span>
                  <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-ivory/60 text-[10px] px-3 py-1.5">
                    AI-generated concept visualisation
                  </p>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <Tag>Concept</Tag>
                  <h3 className="text-[22px] mt-3 mb-2">Neo-Lutterodt Manor</h3>
                  <p className="text-[14px] text-charcoal/68 leading-relaxed mb-4 flex-1">
                    A respectful evolution of the family's architectural heritage — blending authentic Ga-Danish proportions with contemporary Ghanaian craftsmanship, smart-home technology, and a solar-powered footprint. The estate would house a family museum, archive, library, and innovation lab.
                  </p>
                  <ul className="space-y-1.5 mb-5">
                    <li className="text-[13px] text-charcoal/65 flex items-start gap-2">
                      <span className="text-gold-dim shrink-0">&#x2022;</span>
                      Restored colonial craftsmanship with modern adaptation
                    </li>
                    <li className="text-[13px] text-charcoal/65 flex items-start gap-2">
                      <span className="text-gold-dim shrink-0">&#x2022;</span>
                      Courtyard gardens, library, archives and Renaissance Hall
                    </li>
                    <li className="text-[13px] text-charcoal/65 flex items-start gap-2">
                      <span className="text-gold-dim shrink-0">&#x2022;</span>
                      Innovation lab and community programme spaces
                    </li>
                    <li className="text-[13px] text-charcoal/65 flex items-start gap-2">
                      <span className="text-gold-dim shrink-0">&#x2022;</span>
                      Solar-powered with sustainable 21st-century infrastructure
                    </li>
                  </ul>
                  <Link href="/contact" className="btn-outline text-center text-[13px]">Enquire about sponsoring</Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-[108px]">
        <div className="container-main">
          <div className="max-w-[640px]">
            <Tag>Vision</Tag>
            <h2 className="text-[clamp(28px,3vw,40px)] mt-3 mb-3">Digital Heritage Network</h2>
            <p className="text-charcoal/68 text-[16px] leading-relaxed mb-8">
              A platform that extends beyond a single family. The same infrastructure built for the Lutterodt Renaissance — digitisation, archiving, storytelling — can serve other influential Ghanaian families, forming a connected virtual Heritage District.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {["Bruce", "Bannerman", "Richter", "Brew", "Vanderpuije", "Hansen"].map((family) => (
              <div key={family} className="border border-line rounded-lg p-5 text-center hover:border-gold-dim/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-ivory-dim flex items-center justify-center mx-auto mb-3">
                  <span className="font-display text-[18px] text-gold-dim">{family[0]}</span>
                </div>
                <h4 className="text-[16px] font-medium mb-1">{family}</h4>
                <p className="text-[12.5px] text-charcoal/55">Partner family</p>
              </div>
            ))}
          </div>

          <div className="border border-line rounded-lg p-8 md:p-10 bg-burgundy-ink text-ivory">
            <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">
              <div>
                <Tag onDark>Get Involved</Tag>
                <h3 className="text-ivory text-[clamp(22px,2.6vw,32px)] mt-3 mb-3">Sponsor a project</h3>
                <p className="text-ivory/68 text-[15px] leading-relaxed mb-6">
                  Every project on this page is looking for partners. Whether you are a cultural foundation, a technology sponsor, an academic institution, or a family member who wants to help build — reach out and we will share the roadmap, budget and milestones.
                </p>
                <Link href="/contact" className="btn-gold">Contact the Committee</Link>
              </div>
              <div className="relative rounded-md overflow-hidden border border-ivory/15">
                <img
                  src="/images/projects/concept-museum-03.jpg"
                  alt="Sponsorship concept"
                  width={1149}
                  height={1369}
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
                <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-ivory/60 text-[10px] px-3 py-1.5">
                  AI-generated concept visualisation
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-[12px] text-charcoal/45 text-center">
            All concept images on this page are AI-generated visualisations. They are intended to communicate direction and ambition, not final design. Emblems, personalities and architectural details depicted may be fictitious or interpreted.
          </p>
        </div>
      </section>
    </>
  );
}
