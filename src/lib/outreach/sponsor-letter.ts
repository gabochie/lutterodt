const CSS = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,'Times New Roman',Times,serif;color:#2a1a0e;background:#faf8f5;line-height:1.7}.page{max-width:720px;margin:60px auto;padding:60px 64px;background:#fff;box-shadow:0 2px 24px rgba(0,0,0,0.06)}.brand{text-align:center;margin-bottom:48px;padding-bottom:32px;border-bottom:1px solid #6E520C}.brand svg{width:48px;height:48px;margin-bottom:12px}.brand h1{font-size:20px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:#0A2470}.brand p{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#6E520C;margin-top:4px}.date{font-size:14px;color:#5F5E59;margin-bottom:32px}.salutation{font-size:16px;margin-bottom:20px}.body p{font-size:15px;margin-bottom:18px;color:#33322E}.body strong{color:#0A2470}.highlight{border-left:3px solid #6E520C;padding:16px 20px;margin:24px 0;background:#F7F7F4;font-style:italic;color:#0A2470}.tier-table{margin:28px 0;border-collapse:collapse;width:100%}.tier-table th{background:#0A2470;color:#fff;font-size:12px;text-transform:uppercase;letter-spacing:.08em;padding:12px 16px;text-align:left;font-weight:600}.tier-table td{padding:14px 16px;font-size:14px;border-bottom:1px solid #E4E6EC;color:#33322E}.tier-table tr:nth-child(even) td{background:#F7F7F4}.tier-table .amount{font-weight:600;color:#0A2470;white-space:nowrap}.cta-box{margin:28px 0;padding:28px 32px;background:#F7F7F4;border:1px solid #6E520C;text-align:center}.cta-box h3{font-size:18px;color:#0A2470;margin-bottom:8px}.cta-box p{font-size:14px;color:#33322E;margin-bottom:0}.cta-box .email{font-size:16px;color:#0A2470;font-weight:600;margin-top:8px}.signoff{margin-top:40px}.signoff p{font-size:14px;margin-bottom:2px;color:#33322E}.signoff .name{font-size:18px;font-weight:600;color:#0A2470;margin-top:20px}.signoff .role{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#6E520C;margin-top:2px}.signoff .contact{font-size:13px;color:#5F5E59;margin-top:12px;line-height:1.6}.footer{margin-top:40px;padding-top:20px;border-top:1px solid #E4E6EC;text-align:center;font-size:11px;color:#6B6A65;letter-spacing:.05em;text-transform:uppercase}`;

const SVG_LOGO = `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="#6E520C" stroke-width="1" /><path d="M12 28L26 14" stroke="#1B5FC1" stroke-width="2.2" stroke-linecap="round" /><path d="M26 14l-6.5.8M26 14l-.8 6.5" stroke="#1B5FC1" stroke-width="2.2" stroke-linecap="round" /><path d="M28 28L14 14" stroke="#1B5FC1" stroke-width="2.2" stroke-linecap="round" opacity="0.45" /></svg>`;

import { escapeHtml } from "./sanitize";

const CONTRIBUTION_TYPES = [
  {
    name: "Archive materials",
    need: "Highest priority",
    benefits:
      "Photographs, letters, certificates, church and civil registers, newspaper cuttings, business ledgers, audio and video. The one category that cannot be bought or crowdsourced — and it decays every year it waits.",
  },
  {
    name: "Profile verification",
    need: "Highest priority",
    benefits:
      "Around 190 of 205 directory profiles still lack a confirmed date of birth or a verified career. Family members are the only authoritative source for a family archive.",
  },
  {
    name: "Oral history",
    need: "Urgent",
    benefits:
      "Recorded testimony in any language. The only asset with a hard expiry date, because it lives and dies with the person holding it.",
  },
  {
    name: "Introductions",
    need: "High leverage",
    benefits:
      "A named person in your network who would be right for a specific need. Costs you nothing, and is worth more than most in-kind gifts.",
  },
  {
    name: "Professional services",
    need: "On request",
    benefits:
      "Legal review of privacy and copyright terms, accounting, graphic design, translation and transcription, photography, hosting and storage.",
  },
  {
    name: "Financial",
    need: "Secondary",
    benefits:
      "No fixed tiers and no minimum. Funding conversations start from what you would like to make possible.",
  },
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
  const recipient = escapeHtml(sponsor.contactPerson || sponsor.name);
  const salutation = `Dear ${recipient},`;

  const orgLine = sponsor.organization
    ? `<p>I am writing to you on behalf of <strong>${escapeHtml(sponsor.organization)}</strong> to ask whether you might help <strong>The Lutterodt Renaissance</strong> — a digital archive preserving Lutterodt family history across six continents.</p>`
    : `<p>I am writing to ask whether you might help <strong>The Lutterodt Renaissance</strong> — a digital archive preserving Lutterodt family history across six continents.</p>`;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sponsorship Opportunity — The Lutterodt Renaissance</title><style>${CSS}</style></head><body><div class="page"><div class="brand">${SVG_LOGO}<h1>The Lutterodt Renaissance</h1><p>A Digital Archive • Six Generations • Six Continents</p></div><p class="date">${date}</p><p class="salutation">${salutation}</p><div class="body">
<p>The Lutterodt name has travelled from the Harz Mountains of Germany to the shores of Ghana, and from there across the Atlantic to the Americas, into northern Europe, and beyond. The archive is live at <strong>lutterodt.org</strong> and already documents <strong>205 Lutterodts</strong> across <strong>15 countries</strong> on <strong>6 continents</strong>.</p>

${orgLine}

<p>Most of what this archive still needs cannot be bought. It has to come from the family. That is why I am writing to you.</p>

<h2 style="color:#0A2470;font-size:17px;margin:32px 0 16px 0;font-weight:600">Where the archive actually stands</h2>

<p><strong>Documented and live</strong><br>
A searchable directory of notable Lutterodts — biographies, achievements, countries, professional categories, and verified profile records — alongside the outreach pipeline that keeps it growing.</p>

<p><strong>Not yet done</strong><br>
Roughly 190 profiles have no confirmed date of birth. Around 190 have no public professional profile. Almost every profile still lacks a photograph. None of this is public search work; it is family knowledge that exists only in someone's head or in a shoebox.</p>

<div class="highlight">"The most valuable thing in this archive is not the data I can find. It is the data that only a Lutterodt can supply."</div>

<h2 style="color:#0A2470;font-size:17px;margin:32px 0 16px 0;font-weight:600">How you can help</h2>

<table class="tier-table">
<tr><th>Contribution</th><th>Urgency</th><th>What it looks like</th></tr>
${CONTRIBUTION_TYPES.map(t => `<tr><td><strong>${t.name}</strong></td><td class="amount">${t.need}</td><td>${t.benefits}</td></tr>`).join("")}
</table>

<p>Where money is involved, there are no tiers and no minimum. Hosting and long-term storage, digitisation equipment, legal review of the privacy and copyright terms, transcription, research and recording are the costs that genuinely exist right now — and I am happy to account for them plainly.</p>

<div class="cta-box">
<h3>Three ways to start</h3>
<p>Send any materials you are holding, correct a profile you recognise, or simply tell me who else in the family might know something I do not. A referral is genuinely useful.</p>
<p class="email">hello@lutterodt.org</p>
</div>

<p>Thank you for reading this. I would rather ask you for something honest and small than promise you a building.</p>

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
