export const LETTER_CSS = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,'Times New Roman',Times,serif;color:#2a1a0e;background:#faf8f5;line-height:1.7}.page{max-width:720px;margin:60px auto;padding:60px 64px;background:#fff;box-shadow:0 2px 24px rgba(0,0,0,0.06)}.brand{text-align:center;margin-bottom:48px;padding-bottom:32px;border-bottom:1px solid #c6a15b}.brand svg{width:48px;height:48px;margin-bottom:12px}.brand h1{font-size:20px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:#5a2d2a}.brand p{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#c6a15b;margin-top:4px}.date{font-size:14px;color:#6b5a4a;margin-bottom:32px}.salutation{font-size:16px;margin-bottom:20px}.body p{font-size:15px;margin-bottom:18px;color:#3d2b1a}.body strong{color:#5a2d2a}.highlight{border-left:3px solid #c6a15b;padding:16px 20px;margin:24px 0;background:#faf6ef;font-style:italic;color:#5a2d2a}.cta{margin-top:28px;padding-top:24px;border-top:1px solid #e8ddd0}.cta p{font-size:15px;margin-bottom:6px}.signoff{margin-top:40px}.signoff p{font-size:14px;margin-bottom:2px;color:#3d2b1a}.signoff .name{font-size:18px;font-weight:600;color:#5a2d2a;margin-top:20px}.signoff .role{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#c6a15b;margin-top:2px}.signoff .contact{font-size:13px;color:#6b5a4a;margin-top:12px;line-height:1.6}.footer{margin-top:40px;padding-top:20px;border-top:1px solid #e8ddd0;text-align:center;font-size:11px;color:#a09080;letter-spacing:.05em;text-transform:uppercase}@media print{.page{box-shadow:none;margin:0;padding:40px}body{background:#fff}}@media(max-width:600px){.page{padding:32px 24px;margin:20px}}`;

export const SVG_LOGO = `<svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="#C6A15B" stroke-width="1" /><path d="M20 7L23.5 16.5L33 20L23.5 23.5L20 33L16.5 23.5L7 20L16.5 16.5L20 7Z" stroke="#E4C989" stroke-width="1.1" /><circle cx="20" cy="20" r="3" fill="#C6A15B" /></svg>`;

const CATEGORY_LABELS: Record<string, string> = {
  academia: "academia",
  healthcare: "healthcare",
  law: "law",
  business: "business",
  creative: "the creative arts",
  service: "service",
  engineering: "engineering and technology",
  "civil-service": "civil service",
};

const COUNTRY_DESC: Record<string, string> = {
  Ghana: "here in Ghana",
  UK: "across the Atlantic in the United Kingdom",
  USA: "in the United States",
  Germany: "in Germany — the land of our shared ancestral roots",
  Canada: "in Canada",
  Denmark: "in Denmark",
  Estonia: "in Estonia — a new Lutterodt frontier in the Baltics",
  UAE: "in the United Arab Emirates",
  China: "in China",
  Mexico: "in Mexico",
  GoldCoast: "on the Gold Coast",
};

const COUNTRY_HERITAGE: Record<string, string> = {
  Ghana: "here on home soil",
  UK: "abroad, while maintaining your connection to Ghanaian heritage",
  USA: "abroad, while maintaining your connection to Ghanaian heritage",
  Germany: "in your homeland, while maintaining your connection to the broader Lutterodt story",
  Canada: "abroad, while maintaining your connection to Ghanaian heritage",
};

const DISCOVERY_OPENINGS = [
  "It is a rare and wonderful thing to discover someone who shares a name and a heritage across the miles. When I came across your profile in the course of my research, I knew immediately that yours was a story worth telling.",
  "One of the great joys of building this archive has been the thrill of discovery — finding Lutterodts I never knew existed, scattered across continents, each with a story as rich as the next. Your name surfaced in my research, and I was immediately struck by your work.",
  "I have spent the past months tracing the Lutterodt name across the globe, from the Harz Mountains of Germany to the shores of Ghana and beyond. Your profile emerged as one of the most compelling discoveries.",
  "Every Lutterodt I have found has added a new thread to the tapestry of our family story. Your profile, which I was fortunate enough to come across, adds a thread of particular distinction.",
];

const ACHIEVEMENT_INTROS = [
  "Your work — {achievement} — speaks to a dedication and excellence that deserves to be remembered.",
  "Reading that you {achievement}, I felt a sense of pride for what our name continues to represent in the world.",
  "What stood out to me most was this: {achievement}. It is the kind of accomplishment that belongs in the permanent record.",
  "Your profile notes that you {achievement} — a remarkable achievement by any measure.",
];

const DIASPORA_PARAGRAPHS: Record<string, string[]> = {
  UK: [
    "The United Kingdom has been home to Lutterodts for generations. From the earliest students who travelled to Britain for education, to the professionals and leaders who now call it home, the UK chapter of our story is one of ambition and achievement.",
    "Your place in that chapter is significant. To be a Lutterodt making a mark in the UK is to carry forward a tradition of excellence that began decades ago.",
  ],
  USA: [
    "America has welcomed Lutterodts who have gone on to shape its universities, its healthcare, and its culture. Your presence in the United States places you in an important diaspora community.",
    "The American Lutterodt story is still being written, and you are a vital part of that unfolding narrative.",
  ],
};

const GENERATION_MARKERS: Record<string, string> = {
  "19": "You belong to a generation of Lutterodts who came of age in an era of transformation — carrying the family name into new fields, new technologies, and new parts of the world.",
  "20": "You belong to a generation of Lutterodts who have built and achieved across continents, carrying the name forward with distinction into the 20th century and beyond.",
  "21": "You represent the newest generation of Lutterodts making your mark on the world. Your story is one of the fresh chapters being written in our family's ongoing narrative.",
};

const CLOSINGS = [
  "I would be honoured if you would visit lutterodt.org and see where your profile sits in the broader tapestry. Any thoughts, corrections, or contributions you might offer would be deeply valued.",
  "I warmly invite you to explore the archive at lutterodt.org. If you have photographs, memories, or reflections you would be willing to share, they would find a proud home in this permanent record.",
  "The archive is built to serve the family — past, present, and future. I would welcome your visit to lutterodt.org, and would be especially grateful for anything you might wish to add to your profile from your own memory or collection.",
];

function salutation(name: string, isHistorical: boolean): string {
  const title = name.startsWith("Prof.") ? "Professor" :
    name.startsWith("Dr.") ? "Dr." :
    name.startsWith("Pharm. Dr.") ? "Dr." : "";
  const last = name.replace(/^(Prof\.|Dr\.|Pharm\. Dr\.)\s+/, "").split(" ").slice(-1)[0];
  if (title && !isHistorical) return `Dear ${title} ${last},`;
  return `Dear ${name.split(" ")[0]},`;
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
  return h;
}

function generateModernBody(profile: {
  name: string; achievement: string; category: string; country: string; dob?: string; bio?: string;
}): string {
  const seed = hash(profile.name);
  const countryDesc = COUNTRY_DESC[profile.country] || `in ${profile.country}`;
  const heritage = COUNTRY_HERITAGE[profile.country] || "across the global diaspora";
  const opening = pick(DISCOVERY_OPENINGS, seed);
  const achievementLine = pick(ACHIEVEMENT_INTROS, seed + 1).replace("{achievement}", profile.achievement);

  const genLine = (() => {
    if (profile.dob && profile.dob.length >= 4) {
      const prefix = profile.dob.substring(0, 2);
      const marker = GENERATION_MARKERS[prefix + "00"] || GENERATION_MARKERS[prefix] || "";
      if (marker) return `<p>${marker}</p>`;
    }
    return "";
  })();

  const diasporaPara = DIASPORA_PARAGRAPHS[profile.country];
  const diasporaHtml = diasporaPara
    ? `<p>${diasporaPara[0]}</p><p>${diasporaPara[1]}</p>`
    : `<p>To discover a Lutterodt making an impact ${countryDesc} is a reminder that our family's reach extends far beyond any single border. Your work ${heritage} adds a new dimension to the Lutterodt story.</p>`;

  const bioPara = profile.bio ? `<p>${profile.bio}</p>` : "";

  return `<p>${opening}</p>
<p>${achievementLine}</p>
${bioPara}
<p><strong>The Lutterodt Renaissance</strong> is a permanent digital archive of the Lutterodt family — six generations spanning Ghana, the UK, Germany, the USA, and beyond. It holds photographs, letters, oral histories, and records in a searchable, permanent online archive at <strong>lutterodt.org</strong>.</p>
${genLine}
${diasporaHtml}
<div class="highlight">Your story is part of a larger narrative — one that began with Georg August Lutterodt in 1790 and now spans six continents. This archive exists to ensure that narrative is never lost.</div>
<p>${pick(CLOSINGS, seed + 2)}</p>
<div class="cta"><p>I look forward to the possibility of connecting.</p><p>With warm regards,</p></div>`;
}

function generateHistoricalBody(profile: {
  name: string; achievement: string; category?: string; country?: string;
}): string {
  const countryDesc = profile.country ? COUNTRY_DESC[profile.country] || `in ${profile.country}` : "";
  const countryPhrase = countryDesc ? ` ${countryDesc}` : "";
  return `<p>I am writing to honour and document the life and legacy of ${profile.name}, whose story is recorded as part of the Lutterodt family history${countryPhrase}.</p>
<p>${profile.name} ${profile.achievement}</p>
<p>The <strong>Lutterodt Renaissance</strong> is a permanent digital archive of the Lutterodt family — six generations spanning Ghana, the UK, Germany, the USA, and beyond. It holds photographs, letters, oral histories, and records in a searchable, permanent online archive at <strong>lutterodt.org</strong>.</p>
<div class="highlight">Every family name carries a story. The Lutterodt name — carried from the Harz mountains of Germany to the shores of Ghana, and now across six continents — deserves to be preserved for generations yet to come.</div>
<p>This profile is part of the permanent public record. If any descendants have photographs, stories, or documents to contribute, we would welcome them.</p>
<div class="cta"><p>With respect,</p></div>`;
}

export function generateLetterHtml(profile: {
  name: string; achievement: string; category: string; country: string; dob?: string; bio?: string; isHistorical?: boolean;
}): string {
  const body = profile.isHistorical
    ? generateHistoricalBody(profile)
    : generateModernBody(profile);

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Letter to ${profile.name} — The Lutterodt Renaissance</title><style>${LETTER_CSS}</style></head><body><div class="page"><div class="brand">${SVG_LOGO}<h1>The Lutterodt Renaissance</h1><p>A Permanent Digital Archive • Six Generations • Four Continents</p></div><p class="date">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p><p class="salutation">${salutation(profile.name, !!profile.isHistorical)}</p><div class="body">${body}</div><div class="signoff"><p class="name">Gideon Tieku-Bortei</p><p class="role">Founder, The Lutterodt Renaissance Project</p><div class="contact">P.O.Box SK 2125, Sakumono, Tema, Accra, Ghana<br>hello@lutterodt.org<br>+233 243 262 019</div></div><div class="footer">The Lutterodt Renaissance • lutterodt.org</div></div></body></html>`;
}
