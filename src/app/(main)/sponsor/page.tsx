import Link from "next/link";
import { Tag } from "@/components/shared/Tag";
import { PageHero } from "@/components/shared/PageHero";
import { directoryStats } from "@/data/stats";

const tiers = [
  {
    name: "Free Trial",
    price: "0",
    period: "",
    subtitle: "Explore the directory",
    features: [
      "Browse 77 documented profiles",
      "Search & filter by category, country",
      "View profile achievements",
      "See global family distribution",
    ],
    cta: "Browse Directory",
    href: "/directory",
    highlighted: false,
  },
  {
    name: "Patron",
    price: "3",
    period: "/month",
    subtitle: "Support the archive",
    features: [
      "Everything in Free Trial",
      "Full outreach letter access",
      "Early access to new profiles",
      "Name listed on sponsor wall",
      "Quarterly research update",
    ],
    cta: "Become a Patron",
    href: "/contact",
    highlighted: false,
  },
  {
    name: "Scholar",
    price: "7",
    period: "/month",
    subtitle: "Deepen the research",
    features: [
      "Everything in Patron",
      "Priority nomination of new profiles",
      "Behind-the-scenes research notes",
      "Vote on research priorities",
      "Direct line to the researcher",
    ],
    cta: "Become a Scholar",
    href: "/contact",
    highlighted: true,
  },
  {
    name: "Guardian",
    price: "15",
    period: "/month",
    subtitle: "Preserve the legacy",
    features: [
      "Everything in Scholar",
      "Founding sponsor badge on profile",
      "Annual family report",
      "Invitation to family gatherings",
      "Co-ownership of the project vision",
    ],
    cta: "Become a Guardian",
    href: "/contact",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "Where does my sponsorship go?",
    a: "Sponsorship funds ongoing research to find undocumented Lutterodts worldwide, maintain the directory platform, and build outreach infrastructure to connect family members across all 11 countries.",
  },
  {
    q: "Can I sponsor as a one-time gift?",
    a: "Yes. While monthly sponsorship powers sustained research, one-time contributions are welcome. Contact us and we will arrange it.",
  },
  {
    q: "How are new profiles verified?",
    a: "Every profile is researched through public records, professional registries, academic databases, and LinkedIn. We cross-reference multiple sources before listing anyone.",
  },
  {
    q: "Is my personal data safe?",
    a: "We only include information that is already public or that the individual has consented to. We never publish contact details without permission.",
  },
  {
    q: "What if I want to remove or update a profile?",
    a: "This is your record. Contact us and we will update or remove any profile immediately at the individual's request.",
  },
  {
    q: "Who is behind this project?",
    a: "This is an independent community project led by members of the Lutterodt family. We are not affiliated with any institution or corporation.",
  },
];

export default function SponsorPage() {
  return (
    <>
      <PageHero
        breadcrumb={{ label: "Home", href: "/" }}
        current="Sponsor"
        tag="Support the Lutterodt Family Database"
        title="Help us document every Lutterodt in the world"
        description="Your sponsorship keeps this directory free and funds the research to find Lutterodts we haven't yet reached across 11 countries and 6 continents."
      />

      <section className="py-[72px] bg-ivory-dim">
        <div className="container-main text-center">
          <Tag>Why Sponsor?</Tag>
          <h2 className="text-[clamp(28px,3.2vw,40px)] mt-[14px] max-w-[26ch] mx-auto">
            We have documented 77 Lutterodts so far. There are many more to find.
          </h2>
          <div className="grid grid-cols-4 max-md:grid-cols-2 gap-[2px] bg-line mt-10 max-w-3xl mx-auto">
            <div className="bg-ivory p-[22px] text-center">
              <div className="text-[32px] font-display font-[600] text-burgundy-ink">{directoryStats.totalProfiles}</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mt-1">Profiles</div>
            </div>
            <div className="bg-ivory p-[22px] text-center">
              <div className="text-[32px] font-display font-[600] text-burgundy-ink">{directoryStats.countries.length}</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mt-1">Countries</div>
            </div>
            <div className="bg-ivory p-[22px] text-center">
              <div className="text-[32px] font-display font-[600] text-burgundy-ink">{directoryStats.continents}</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mt-1">Continents</div>
            </div>
            <div className="bg-ivory p-[22px] text-center">
              <div className="text-[32px] font-display font-[600] text-burgundy-ink">{directoryStats.livingProfiles}</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mt-1">Living Notables</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[108px]">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Tag>Sponsorship Tiers</Tag>
            <h2 className="text-[clamp(28px,3.2vw,40px)] mt-[14px]">
              Choose how you want to support the work
            </h2>
            <p className="mt-4 text-[16px] text-charcoal/68">
              All tiers include free browsing of the directory. Sponsorship unlocks deeper access
              and directly funds the ongoing research.
            </p>
          </div>

          <div className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-[2px] bg-line">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`bg-ivory p-[32px] pb-[36px] flex flex-col relative ${
                  tier.highlighted ? "ring-2 ring-gold ring-inset" : ""
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-burgundy-ink font-mono text-[9px] tracking-widest uppercase px-3 py-1 rounded-sm">
                    Most Popular
                  </span>
                )}
                <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">
                  {tier.subtitle}
                </span>
                <h3 className="text-[28px] font-display font-[600] text-burgundy-ink mt-2">
                  {tier.name}
                </h3>
                <div className="mt-[6px] mb-[16px]">
                  <span className="text-[36px] font-display font-[600] text-burgundy-ink">
                    ${tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-charcoal/50 text-[14px] ml-1">{tier.period}</span>
                  )}
                </div>
                <ul className="list-none p-0 flex-1 flex flex-col gap-[10px]">
                  {tier.features.map((f) => (
                    <li key={f} className="text-[13.5px] text-charcoal/72 flex items-start gap-2">
                      <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0 mt-[2px]">
                        <circle cx="8" cy="8" r="6" stroke="#C6A15B" strokeWidth="1.2" />
                        <path d="M5 8.5l2 2 4-4" stroke="#C6A15B" strokeWidth="1.2" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`mt-[24px] text-center text-[12px] tracking-widest uppercase py-3 rounded-sm transition-all font-medium ${
                    tier.highlighted
                      ? "bg-gold text-burgundy-ink hover:bg-gold-light"
                      : tier.name === "Free Trial"
                      ? "border border-line text-charcoal/70 hover:border-burgundy hover:text-burgundy"
                      : "bg-burgundy text-ivory hover:bg-burgundy-deep"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[72px] bg-ivory-dim">
        <div className="container-main max-w-3xl">
          <div className="text-center mb-12">
            <Tag>Frequently Asked Questions</Tag>
            <h2 className="text-[clamp(26px,3vw,36px)] mt-[14px]">Everything you need to know</h2>
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
          <Tag onDark className="justify-center flex">Get Involved</Tag>
          <h2 className="text-ivory text-[clamp(28px,3.2vw,40px)] max-w-[22ch] mx-auto mt-[18px] mb-[22px]">
            Every Lutterodt has a place in this record
          </h2>
          <p className="text-ivory/70 max-w-[48ch] mx-auto mb-[34px]">
            Whether you sponsor, nominate a family member, or simply browse the directory --
            you are part of preserving this legacy for the next generation.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/directory" className="btn-gold">Browse the Directory</Link>
            <Link href="/contact" className="btn-ghost">Nominate a Lutterodt</Link>
          </div>
        </div>
      </section>
    </>
  );
}
