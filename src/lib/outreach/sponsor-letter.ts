const CSS = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,'Times New Roman',Times,serif;color:#2a1a0e;background:#faf8f5;line-height:1.7}.page{max-width:720px;margin:60px auto;padding:60px 64px;background:#fff;box-shadow:0 2px 24px rgba(0,0,0,0.06)}.brand{text-align:center;margin-bottom:48px;padding-bottom:32px;border-bottom:1px solid #c6a15b}.brand svg{width:48px;height:48px;margin-bottom:12px}.brand h1{font-size:20px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:#5a2d2a}.brand p{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#c6a15b;margin-top:4px}.date{font-size:14px;color:#6b5a4a;margin-bottom:32px}.salutation{font-size:16px;margin-bottom:20px}.body p{font-size:15px;margin-bottom:18px;color:#3d2b1a}.body strong{color:#5a2d2a}.highlight{border-left:3px solid #c6a15b;padding:16px 20px;margin:24px 0;background:#faf6ef;font-style:italic;color:#5a2d2a}.tier-table{margin:28px 0;border-collapse:collapse;width:100%}.tier-table th{background:#5a2d2a;color:#fff;font-size:12px;text-transform:uppercase;letter-spacing:.08em;padding:12px 16px;text-align:left;font-weight:600}.tier-table td{padding:14px 16px;font-size:14px;border-bottom:1px solid #e8ddd0;color:#3d2b1a}.tier-table tr:nth-child(even) td{background:#faf6ef}.tier-table .amount{font-weight:600;color:#5a2d2a;white-space:nowrap}.cta-box{margin:28px 0;padding:28px 32px;background:#faf6ef;border:1px solid #c6a15b;text-align:center}.cta-box h3{font-size:18px;color:#5a2d2a;margin-bottom:8px}.cta-box p{font-size:14px;color:#3d2b1a;margin-bottom:0}.cta-box .email{font-size:16px;color:#5a2d2a;font-weight:600;margin-top:8px}.signoff{margin-top:40px}.signoff p{font-size:14px;margin-bottom:2px;color:#3d2b1a}.signoff .name{font-size:18px;font-weight:600;color:#5a2d2a;margin-top:20px}.signoff .role{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#c6a15b;margin-top:2px}.signoff .contact{font-size:13px;color:#6b5a4a;margin-top:12px;line-height:1.6}.footer{margin-top:40px;padding-top:20px;border-top:1px solid #e8ddd0;text-align:center;font-size:11px;color:#a09080;letter-spacing:.05em;text-transform:uppercase}`;

const SVG_LOGO = `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="#C6A15B" stroke-width="1" /><path d="M20 7L23.5 16.5L33 20L23.5 23.5L20 33L16.5 23.5L7 20L16.5 16.5L20 7Z" stroke="#E4C989" stroke-width="1.1" /><circle cx="20" cy="20" r="3" fill="#C6A15B" /></svg>`;

const TIERS = [
  { name: "Patron", amount: "$10,000+", benefits: "Naming rights on a major exhibit, permanent recognition in the Digital Museum, private tour for 10 guests at the Neo-Manor (when built), annual impact report, featured listing on all project materials." },
  { name: "Benefactor", amount: "$5,000–$9,999", benefits: "Named attribution on a gallery wing, recognition in the Digital Museum, private tour for 4 guests, annual impact report." },
  { name: "Supporter", amount: "$1,000–$4,999", benefits: "Recognition in the Digital Museum contributors wall, exclusive digital content access, newsletter updates." },
  { name: "Friend", amount: "Up to $999", benefits: "Listing in the Friends of the Renaissance roll, newsletter updates, digital thank-you card." },
];

export interface SponsorProfile {
  name: string;
  contactPerson?: string;
  email: string;
  organization?: string;
  notes?: string;
}

export function generateSponsorshipLetterHtml(sponsor: SponsorProfile): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const recipient = sponsor.contactPerson || sponsor.name;
  const salutation = `Dear ${recipient},`;

  const orgLine = sponsor.organization
    ? `<p>I am writing to you on behalf of <strong>${sponsor.organization}</strong> regarding a unique opportunity to partner with <strong>The Lutterodt Renaissance</strong> — a permanent digital and physical archive preserving six generations of Lutterodt family history across six continents.</p>`
    : `<p>I am writing to share a unique opportunity to partner with <strong>The Lutterodt Renaissance</strong> — a permanent digital and physical archive preserving six generations of Lutterodt family history across six continents.</p>`;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sponsorship Opportunity — The Lutterodt Renaissance</title><style>${CSS}</style></head><body><div class="page"><div class="brand">${SVG_LOGO}<h1>The Lutterodt Renaissance</h1><p>A Permanent Digital Archive • Six Generations • Four Continents</p></div><p class="date">${date}</p><p class="salutation">${salutation}</p><div class="body">
<p>The Lutterodt name has travelled from the Harz Mountains of Germany to the shores of Ghana, and from there across the Atlantic to the Americas, into northern Europe, and beyond. Today our archive documents <strong>208 Lutterodts</strong> across <strong>16 countries</strong> and <strong>6 continents</strong> — a global family whose story deserves a permanent home.</p>

${orgLine}

<h2 style="color:#5a2d2a;font-size:17px;margin:32px 0 16px 0;font-weight:600">Four Initiatives, One Mission</h2>

<p><strong>1. The Digital Archive (live at lutterodt.org)</strong><br>
A searchable online record of every notable Lutterodt — biographies, photographs, genealogical links, and oral histories. Already hosting 208 profiles with 265 personalised heritage letters generated.</p>

<p><strong>2. The 3D Digital Museum (seeking sponsorship)</strong><br>
An interactive virtual museum where visitors can explore Lutterodt history through immersive exhibits, archival documents, and multimedia storytelling. Built on web standards — no app download required.</p>

<p><strong>3. The Neo-Lutterodt Manor (seeking sponsorship)</strong><br>
A physical heritage centre in Accra, Ghana — a meeting place for the global Lutterodt diaspora, housing physical archives, exhibition space, and a cultural programming venue.</p>

<p><strong>4. The Digital Heritage Network (seeking partners)</strong><br>
A platform connecting Lutterodts worldwide for mentorship, collaboration, and cultural exchange — turning a family name into a lasting global community.</p>

<div class="highlight">"Every family name carries a story. The Lutterodt name — carried from the Harz mountains of Germany to the shores of Ghana, and now across six continents — deserves to be preserved for generations yet to come."</div>

<h2 style="color:#5a2d2a;font-size:17px;margin:32px 0 16px 0;font-weight:600">Sponsorship Tiers</h2>

<table class="tier-table">
<tr><th>Tier</th><th>Contribution</th><th>Benefits</th></tr>
${TIERS.map(t => `<tr><td><strong>${t.name}</strong></td><td class="amount">${t.amount}</td><td>${t.benefits}</td></tr>`).join("")}
</table>

<p>Sponsorship contributions directly fund: server infrastructure and digital preservation, exhibit design and development for the 3D Museum, land acquisition and construction of the Neo-Manor, community programming and diaspora events.</p>

<div class="cta-box">
<h3>Request a Sponsorship Packet</h3>
<p>We would be delighted to send you a detailed sponsorship prospectus with case studies, timelines, and bespoke partnership options tailored to your organisation's goals.</p>
<p class="email">hello@lutterodt.org</p>
</div>

<p>Thank you for considering this invitation. The Lutterodt Renaissance is a labour of love — one that will outlive us all. With your support, it will stand as a permanent monument to a family whose story is as global as it is Ghanaian.</p>

<p>I look forward to the possibility of partnering with you.</p>

<div class="signoff">
<p>With warm regards,</p>
<p class="name">Gideon Tieku-Bortei</p>
<p class="role">Founder, The Lutterodt Renaissance Project</p>
<div class="contact">P.O.Box SK 2125, Sakumono, Tema, Accra, Ghana<br>hello@lutterodt.org<br>+233 243 262 019</div>
</div>

<div class="footer">The Lutterodt Renaissance • lutterodt.org</div>
</div></div></body></html>`;
}
