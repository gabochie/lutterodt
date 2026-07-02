"use client";

import { Target, Users, Handshake, Shield, Building2, Lightbulb, ArrowRight, ScrollText, Globe, Network } from "lucide-react";

const phases = [
  { num: "0", title: "The Global Lutterodt Network", icon: Globe, goal: "Create a founding network before writing significant code." },
  { num: "1", title: "Build The Coalition", icon: Users, goal: "Form founding committee, define governance, map the global network." },
  { num: "2", title: "Launch & Listen", icon: Handshake, goal: "Conduct listening campaign, collect archives, publish newsletters, begin fundraising." },
  { num: "3", title: "Build The MVP", icon: Building2, goal: "Launch Phase 1 platform, onboard contributors, expand historical collections." },
  { num: "4", title: "Scale & Sustain", icon: Lightbulb, goal: "Host the first virtual renaissance summit, review progress, plan Phase 2." },
];

const foundingRoles = [
  { role: "Chairperson", responsibility: "Vision and coordination" },
  { role: "Secretary", responsibility: "Documentation and meetings" },
  { role: "Historian", responsibility: "Heritage research" },
  { role: "Archivist", responsibility: "Collect family records" },
  { role: "Technology Lead", responsibility: "Product oversight" },
  { role: "Legal Advisor", responsibility: "Governance and privacy" },
  { role: "Finance Lead", responsibility: "Budgeting and fundraising" },
  { role: "Communications Lead", responsibility: "Newsletters and outreach" },
  { role: "Diaspora Coordinator", responsibility: "International engagement" },
];

const fundraisingStages = [
  {
    stage: "Stage 1",
    title: "Founding Contributions",
    description: "Modest one-time contributions from founding supporters to fund planning and the first prototype.",
    tiers: ["Founding Supporter", "Founding Patron", "Legacy Builder"],
  },
  {
    stage: "Stage 2",
    title: "Family Membership",
    description: "Optional annual memberships with benefits including early access, exclusive webinars, members-only newsletters, and voting privileges.",
    tiers: [],
  },
  {
    stage: "Stage 3",
    title: "Major Family Patrons",
    description: "Approach family members with capacity for larger contributions by presenting a clear vision, governance structure, roadmap, budget, and expected impact.",
    tiers: [],
  },
  {
    stage: "Stage 4",
    title: "Grants",
    description: "Cultural heritage preservation, digital archives, education, genealogy, community development, youth engagement.",
    tiers: [],
  },
  {
    stage: "Stage 5",
    title: "Corporate Sponsorship",
    description: "Partnerships for annual congresses, scholarship initiatives, heritage digitization, and educational programs with banks, tech companies, law firms, and businesses.",
    tiers: [],
  },
];

const governanceDocs = [
  "Vision and Mission",
  "Terms of Reference",
  "Code of Conduct",
  "Financial Transparency Policy",
  "Privacy Policy",
  "Data Governance Policy",
  "Volunteer Guidelines",
];

const roadmapQuarter = [
  { quarter: "Q1", focus: "Form founding committee, define governance, map the global network" },
  { quarter: "Q2", focus: "Conduct listening campaign, collect archives, publish newsletters, begin fundraising" },
  { quarter: "Q3", focus: "Launch Phase 1 MVP, onboard contributors, expand historical collections" },
  { quarter: "Q4", focus: "Host the first virtual renaissance summit, review progress, plan Phase 2" },
];

export default function AdminStrategyPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-burgundy-ink">Strategy</h1>
          <p className="text-charcoal/50 text-[14px] mt-1">The Lutterodt Renaissance — Institutional Strategy</p>
        </div>
        <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-2 bg-burgundy/10 text-burgundy border border-burgundy/20">Phase 0: Pre-Founding</span>
      </div>

      {/* Core thesis banner */}
      <div className="bg-burgundy-ink text-ivory p-8 mb-10 border border-line-on-dark">
        <Target className="w-6 h-6 text-gold-dim mb-4" />
        <p className="font-display text-[22px] leading-snug max-w-3xl">
          A project like The Lutterodt Renaissance is not fundamentally a software project — it is an institution-building project. The website is simply one of the tools.
        </p>
        <div className="mt-6 flex items-center gap-4 text-ivory/70 font-mono text-[11px] tracking-wider">
          <span className="bg-gold/15 text-gold-light px-3 py-1.5">First Principle</span>
          <span>The platform follows the institution, not the other way around.</span>
        </div>
      </div>

      {/* Better Sequence */}
      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6 mb-10">
        <div className="border border-line bg-ivory p-6">
          <h3 className="font-mono text-[10px] tracking-widest uppercase text-charcoal/40 mb-4">Typical Approach</h3>
          <div className="flex items-center gap-3 text-charcoal/60 text-[14px]">
            <span className="px-3 py-1.5 bg-red-50 text-red-600 font-mono text-[10px] tracking-wider">Risky</span>
            <span>Build website</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Find users</span>
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Raise money</span>
          </div>
        </div>
        <div className="border border-gold/30 bg-gold/5 p-6">
          <h3 className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mb-4">The Lutterodt Sequence</h3>
          <div className="flex flex-wrap items-center gap-3 text-charcoal text-[14px]">
            <span className="px-3 py-1.5 bg-forest/10 text-forest font-mono text-[10px] tracking-wider">Recommended</span>
            <span>Build coalition</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold-dim" />
            <span>Define governance</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold-dim" />
            <span>Raise seed funding</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold-dim" />
            <span>Build MVP</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold-dim" />
            <span>Grow community</span>
          </div>
        </div>
      </div>

      {/* Five phases bar */}
      <div className="grid grid-cols-5 max-md:grid-cols-2 gap-0 border border-line mb-10">
        {phases.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="p-5 text-center border-r border-line last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0">
              <Icon className="w-5 h-5 mx-auto text-gold-dim mb-2" />
              <div className="font-mono text-[9px] tracking-widest uppercase text-gold-dim mb-1">Phase {p.num}</div>
              <div className="font-display text-[14px] text-burgundy-ink leading-tight mb-1">{p.title}</div>
              <p className="text-charcoal/50 text-[11px] leading-snug">{p.goal}</p>
            </div>
          );
        })}
      </div>

      {/* Phase 0: The Global Lutterodt Network */}
      <div className="mb-10 border border-line bg-ivory">
        <div className="px-6 py-5 border-b border-line flex items-center gap-4">
          <Globe className="w-6 h-6 text-gold-dim" />
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">Phase 0 — Pre-Founding</span>
            <h2 className="font-display text-[22px] text-burgundy-ink">The Global Lutterodt Network</h2>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <p className="text-charcoal/70 text-[14px] leading-relaxed">
              Identify and connect Lutterodt family members worldwide who can contribute through leadership,
              historical knowledge, archives, technology, legal expertise, finance, communications, fundraising,
              research, and mentorship. Think of it as creating a <strong className="text-burgundy">Founding Circle</strong>.
            </p>
          </div>

          {/* Step 1: Founding Committee */}
          <div>
            <h3 className="font-display text-[16px] text-burgundy-ink mb-3 flex items-center gap-2">
              <span className="w-5 h-[1px] bg-gold inline-block" />
              Step 1: Form a Founding Committee
            </h3>
            <p className="text-charcoal/60 text-[13px] mb-4">
              Aim for a small, capable group (around 8–15 people) representing different skills and locations.
            </p>
            <div className="overflow-x-auto border border-line">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line font-mono text-[10px] tracking-widest uppercase text-gold-dim bg-ivory-dim/50">
                    <th className="px-5 py-3 font-normal w-[200px]">Role</th>
                    <th className="px-5 py-3 font-normal">Responsibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {foundingRoles.map((r, i) => (
                    <tr key={i} className="hover:bg-ivory-dim/30 transition-colors">
                      <td className="px-5 py-3 font-display text-[14px] text-burgundy">{r.role}</td>
                      <td className="px-5 py-3 text-charcoal/60 text-[13.5px]">{r.responsibility}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Step 2: Map the Global Family */}
          <div>
            <h3 className="font-display text-[16px] text-burgundy-ink mb-3 flex items-center gap-2">
              <span className="w-5 h-[1px] bg-gold inline-block" />
              Step 2: Map the Global Family
            </h3>
            <p className="text-charcoal/60 text-[13px] mb-4">
              Create an initial directory capturing key information about each family member.
            </p>
            <div className="grid grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-3">
              {["Country", "City", "Family branch", "Profession", "Skills", "Areas of interest", "Willingness to volunteer"].map((item, i) => (
                <div key={i} className="px-4 py-3 border border-line bg-ivory-dim/30 text-charcoal/70 text-[13px]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Listening Campaign */}
          <div>
            <h3 className="font-display text-[16px] text-burgundy-ink mb-3 flex items-center gap-2">
              <span className="w-5 h-[1px] bg-gold inline-block" />
              Step 3: Launch a Listening Campaign
            </h3>
            <p className="text-charcoal/60 text-[13px] mb-4">
              Instead of announcing a finished vision, ask questions that invite participation.
            </p>
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3">
              {[
                "What family traditions should be preserved?",
                "What historical materials do you have?",
                "What would make this platform valuable to you?",
                "How would you like future generations to benefit?",
              ].map((q, i) => (
                <div key={i} className="px-5 py-4 border border-line bg-gold/5 text-charcoal/80 text-[13.5px] italic">
                  &ldquo;{q}&rdquo;
                </div>
              ))}
            </div>
            <p className="text-charcoal/50 text-[12px] mt-3 font-mono tracking-wider">
            People are more likely to support what they have helped shape.
            </p>
          </div>
        </div>
      </div>

      {/* Fundraising Strategy */}
      <div className="mb-10 border border-line bg-ivory">
        <div className="px-6 py-5 border-b border-line flex items-center gap-4">
          <ScrollText className="w-6 h-6 text-gold-dim" />
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">Diversified Revenue</span>
            <h2 className="font-display text-[22px] text-burgundy-ink">Fundraising Strategy</h2>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {fundraisingStages.map((fs, i) => (
            <div key={i} className="border border-line p-5">
              <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                <div>
                  <span className="font-mono text-[9px] tracking-widest uppercase text-gold-dim">{fs.stage}</span>
                  <h3 className="font-display text-[16px] text-burgundy-ink">{fs.title}</h3>
                </div>
                {fs.tiers.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {fs.tiers.map((tier, ti) => (
                      <span key={ti} className="font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 bg-burgundy/5 text-burgundy border border-burgundy/10">{tier}</span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-charcoal/60 text-[13.5px]">{fs.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Build The Community First */}
      <div className="mb-10 border border-line bg-ivory">
        <div className="px-6 py-5 border-b border-line flex items-center gap-4">
          <Network className="w-6 h-6 text-gold-dim" />
          <div>
            <h2 className="font-display text-[22px] text-burgundy-ink">Build the Community First</h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-charcoal/70 text-[14px] leading-relaxed mb-5">
            Before launching the website, establish communication channels. The website then becomes the permanent home for content generated by an already engaged community.
          </p>
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-3">
            {[
              "Email newsletter",
              "WhatsApp communities (managed carefully)",
              "Quarterly virtual town halls",
              "Family interviews",
              "Heritage spotlight series",
            ].map((ch, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border border-line text-charcoal/70 text-[13.5px]">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                {ch}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Governance */}
      <div className="mb-10 border border-line bg-ivory">
        <div className="px-6 py-5 border-b border-line flex items-center gap-4">
          <Shield className="w-6 h-6 text-gold-dim" />
          <div>
            <h2 className="font-display text-[22px] text-burgundy-ink">Governance Matters</h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-charcoal/70 text-[14px] leading-relaxed mb-5">
            Institutional trust is built on transparent governance. This is particularly important when managing family records and donations.
          </p>
          <div className="flex flex-wrap gap-2">
            {governanceDocs.map((doc, i) => (
              <span key={i} className="font-mono text-[10px] tracking-wider uppercase px-3 py-2 bg-forest/5 text-forest border border-forest/10">{doc}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 12-Month Roadmap */}
      <div className="mb-10 border border-line bg-ivory">
        <div className="px-6 py-5 border-b border-line flex items-center gap-4">
          <Building2 className="w-6 h-6 text-gold-dim" />
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">Implementation</span>
            <h2 className="font-display text-[22px] text-burgundy-ink">12-Month Roadmap</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line font-mono text-[10px] tracking-widest uppercase text-gold-dim bg-ivory-dim/50">
                <th className="px-6 py-4 font-normal w-[120px]">Quarter</th>
                <th className="px-6 py-4 font-normal">Focus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {roadmapQuarter.map((q, i) => (
                <tr key={i} className="hover:bg-ivory-dim/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-display text-[18px] text-burgundy">{q.quarter}</span>
                  </td>
                  <td className="px-6 py-4 text-charcoal/70 text-[14px]">{q.focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scalable Vision */}
      <div className="border border-gold/30 bg-gold/5 p-8">
        <Lightbulb className="w-6 h-6 text-gold-dim mb-4" />
        <h2 className="font-display text-[22px] text-burgundy-ink mb-3">A Scalable Vision</h2>
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
          <div className="border border-line bg-ivory p-5">
            <span className="font-mono text-[9px] tracking-widest uppercase text-charcoal/40">Current Scope</span>
            <p className="text-charcoal/70 text-[14px] mt-2">
              If you build this as <strong className="text-burgundy">The Lutterodt Renaissance Platform</strong>, it serves one family.
            </p>
          </div>
          <div className="border border-gold/30 bg-ivory p-5">
            <span className="font-mono text-[9px] tracking-widest uppercase text-gold-dim">The Larger Vision</span>
            <p className="text-charcoal/70 text-[14px] mt-2">
              If you build the underlying software as a <strong className="text-burgundy">Family Legacy OS</strong>, then The Lutterodt Renaissance becomes the flagship implementation of a platform that can later be adapted for other families, clans, traditional authorities, alumni associations, and diaspora communities.
            </p>
          </div>
        </div>
        <div className="mt-5 px-5 py-4 border border-gold/20 bg-gold/10 text-charcoal/80 text-[13px] leading-relaxed">
          That distinction can make the initiative more attractive to funders because they are investing not only in preserving one family&apos;s heritage but also in developing a reusable model for cultural preservation and community building across Africa and the global diaspora.
        </div>
      </div>
    </div>
  );
}
