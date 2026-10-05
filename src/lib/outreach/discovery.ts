import { normalizeName, slugify } from "./d1";
import { generateLetterHtml } from "./letter";

export interface Candidate {
  name: string;
  snippet: string;
  url: string;
  source: string;
  estimatedCategory: string;
  estimatedCountry: string;
}

export interface DiscoveryResult {
  found: Candidate[];
  imported: { name: string; id: string }[];
  duplicates: number;
  errors: number;
  queries: number;
}

export interface EnrichmentResult {
  email: string;
  linkedin: string;
  source: string;
}

export interface BatchQueueResult {
  queued: { id: number; profile_id: string; name: string }[];
  skipped: number;
}

export const BATCH_QUERIES = [
  "Lutterodt",
  "Lutteroth",
  "Lutterodt-Quarcoo",
  "Mills-Lutterodt",
  '"Lutteroth" family',
];

const COUNTRY_MAP: Record<string, string> = {
  "United Kingdom": "UK",
  "United States": "USA",
  "Gold Coast": "GoldCoast",
};

const categoryKeywords: Record<string, string[]> = {
  academia: ["professor", "lecturer", "research", "phd", "ph.d", "university", "institute", "dean", "scholar", "academic", "faculty", "postdoc", "researcher", "scientist"],
  healthcare: ["doctor", "nurse", "surgeon", "physician", "clinical", "hospital", "medical", "pharmacy", "dentist", "cardiologist", "neurologist", "practitioner"],
  law: ["lawyer", "attorney", "solicitor", "barrister", "judge", "legal", "counsel", "notary", "litigator", "advocate"],
  business: ["ceo", "founder", "co-founder", "director", "manager", "executive", "entrepreneur", "president", "partner", "consultant", "owner", "chairman", "board"],
  engineering: ["engineer", "software", "developer", "architect", "analyst", "technical", "infrastructure", "cyber", "devops", "programmer", "data", "security"],
  creative: ["artist", "musician", "writer", "designer", "photographer", "film", "creative", "producer", "painter", "poet", "author"],
  service: ["teacher", "pastor", "driver", "cook", "chef", "administrator", "assistant", "officer", "clerk", "minister", "reverend"],
};

const countryIndicators: [string, RegExp[]][] = [
  ["Ghana", [/.com\.gh/i, /ghana/i, /accra/i, /kumasi/i, /ghanaweb/i, /modernghana/i]],
  ["United Kingdom", [/\.co\.uk/i, /\.uk\b/i, /london/i, /\buk\b/i, /england/i, /british/i]],
  ["United States", [/\.com\b/i, /\busa\b/i, /\bunited states\b/i, /new york/i, /california/i, /texas/i]],
  ["Canada", [/\.ca\b/i, /canada/i, /toronto/i, /ontario/i, /vancouver/i]],
  ["Germany", [/\.de\b/i, /germany/i, /berlin/i, /hamburg/i, /deutschland/i, /lutteroth/i]],
  ["Denmark", [/\.dk\b/i, /denmark/i, /copenhagen/i, /danmark/i]],
  ["Netherlands", [/\.nl\b/i, /netherlands/i, /holland/i, /amsterdam/i]],
  ["Estonia", [/\.ee\b/i, /estonia/i, /tallinn/i]],
  ["China", [/\.cn\b/i, /china/i, /shanghai/i, /beijing/i]],
  ["Mexico", [/\.mx\b/i, /mexico/i]],
];

function estimateCategory(text: string): string {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    scores[cat] = keywords.reduce((s, kw) => s + (lower.includes(kw) ? 1 : 0), 0);
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best && best[1] > 0 ? best[0] : "uncategorized";
}

function estimateCountry(text: string, url: string): string {
  for (const [country, patterns] of countryIndicators) {
    for (const p of patterns) {
      if (p.test(text) || p.test(url)) return country;
    }
  }
  return "";
}

function normalizeCountry(raw: string): string {
  return COUNTRY_MAP[raw] || raw;
}

// Words that appear in titles about the surname or the family but never in a
// person's own name. A title containing one of these is describing the family,
// not a specific person, and must not become a profile.
const NON_PERSON_WORDS = new Set([
  "the", "and", "of", "in", "on", "at", "to", "for", "from", "with", "about",
  "meaning", "name", "surname", "last", "family", "families", "genealogy",
  "genealogical", "history", "origin", "origins", "ancestry", "ancestors",
  "descendants", "lineage", "tree", "records", "archive", "archives",
  "wikipedia", "wikimedia", "commons", "category", "categories", "list",
  "lists", "index", "portal", "site", "website", "home", "page", "pages",
  "blog", "news", "forum", "photographers", "photographer", "photography",
  "photos", "gallery", "counsellor", "counselor", "directory", "profiles",
  "profile", "lookup", "search", "results", "faq", "help", "contact", "us",
  "vs", "versus", "is", "are", "was", "were", "top", "best", "new", "all",
  "wikipediaorg", "wikidata", "everything", "guide", "guides", "tips",
"people", "known", "famous", "notable", "immigrants", "immigrant",
  "migration", "migrations", "settlers", "settler", "descendant", "roots",
  "line", "lines", "house", "houses", "estate",
  "political", "narrative", "narratives", "honoured", "honored",
  "artists", "artist", "wikipedia", "entries", "entry", "topic", "topics",
  "media", "mean", "means", "given", "givenname", "frequency", "variants",
  "notes", "note", "sources", "source", "references", "citation",
  "arrested", "arrest", "disclose", "disclosed", "police", "charged",
  "sentenced", "acquitted", "convicted", "murder", "murdered", "probe",
  "investigation", "jailed", "fraud", "scam", "obituary", "funeral",
  "lawsuit", "sued", "divorce", "wedding", "anniversary", "tribute",
  "how", "why", "who", "what", "when", "where", "which", "does", "did",
  "is", "are", "was", "were", "has", "have", "had", "can", "will",
]);

// Lowercase nobiliary and patronymic particles that legitimately appear
// inside a real name, e.g. "Jan van Lutterodt" or "Mills-Lutterodt".
const NAME_PARTICLES = new Set([
  "van", "von", "de", "del", "der", "den", "da", "dos", "das", "do",
  "la", "le", "mac", "mc", "of", "y", "bin", "ibn", "al", "af", "av",
  "ter", "ten", "op", "vander", "zur", "zum",
]);

// A name part is only a name part if it is capitalised. This is what
// separates a person from a news headline: "Lutterodt arrested" and
// "Police disclose why Counsellor Lutterodt" both contain lowercase words
// that the surname regex happily swallows, because it is case-insensitive.
export function isCapitalisedNamePart(token: string): boolean {
  const letters = token.replace(/[^\w'-]/g, "");
  if (!letters) return false;
  if (NAME_PARTICLES.has(letters.toLowerCase())) return true;
  // Middle initial, e.g. "Georgina T. Wood".
  if (/^[A-Z]\.?$/.test(token)) return true;
  return /^[A-Z]/.test(letters);
}

// Titles and honorifics that may precede or follow a real person's name. These
// are stripped before validating rather than treated as a rejection.
const HONORIFICS = new Set([
  "dr", "prof", "professor", "mr", "mrs", "ms", "miss", "rev", "reverend",
  "hon", "sir", "dame", "lord", "lady", "ambassador", "amb", "capt", "captain",
  "col", "colonel", "gen", "general", "sen", "senator", "rep", "president",
  "her", "his", "their", "ladyship", "lordship", "majesty", "pastor", "father",
  "chief", "judge", "justice", "baron", "earl", "duke", "count", "countess",
  "attorney", "counsel", "counsellor", "counselor",
  "nurse", "doctor", "engineer", "director", "ceo", "md", "phd", "mba",
  "nee", "born", "b", "c", "d", "jr", "sr", "ii", "iii", "iv",
]);

function stripHonorifics(name: string): string {
  return name
    .replace(/\([^)]*\)/g, " ")          // drop parentheticals: "(photographer)", "(nee Lutterodt)"
    .replace(/\b[A-Z]\./g, " ")           // drop standalone initials: "George A. G. Lutterodt"
    .split(/\s+/)
    .filter((word) => {
      const lower = word.toLowerCase().replace(/[^\w-]/g, "");
      if (!lower) return false;
      if (HONORIFICS.has(lower)) return false;
      // Single capital letters are initials, e.g. "Georgina T. Wood".
      if (/^[A-Z]$/.test(word)) return false;
      return true;
    })
    .join(" ")
    .trim();
}

// Rejects titles that describe the family, a surname, or a website rather than
// a person. Real names with initials, honorifics or parentheticals still pass:
// those are stripped before the keyword check.
export function isPersonName(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return false;

  // HTML entities and markup never appear in a real name.
  if (/[&<>{}|#_]/.test(trimmed)) return false;
  // Bare domains such as "lutterodt.com".
  if (/\.[a-z]{2,4}$/i.test(trimmed) && !trimmed.includes(" ")) return false;

  const cleaned = stripHonorifics(trimmed);
  if (!cleaned) return false;

  const words = cleaned.split(/\s+/).filter(Boolean);
  // A person has a forename and a surname, sometimes with middle names.
  if (words.length < 2 || words.length > 4) return false;

  // Some sources are entirely lowercase, e.g. "fredricka lutterodt". Only
  // allow that when there is no uppercase anywhere and the surname is present,
  // so this stays too narrow to admit a lowercase sentence fragment.
  if (cleaned === cleaned.toLowerCase() && !words.some(isCapitalisedNamePart)) {
    return /lutterodt/i.test(cleaned);
  }

  for (const word of words) {
    const lower = word.toLowerCase().replace(/[^\w-]/g, "");
    if (NON_PERSON_WORDS.has(lower)) return false;
    // A bare number is a list position, not a name part.
    if (/^\d+$/.test(lower)) return false;
    // Every remaining part must look like a capitalised name part.
    if (!isCapitalisedNamePart(word)) return false;
  }

  return true;
}

export function extractName(title: string, snippet: string): string {
  // Longest alternatives first, otherwise "Lutterodt" wins over the hyphenated
  // "Meier-Lutterodt" / "Haldane-Lutterodt" / "Lutterodt-Quarcoo" forms and the
  // forename is lost. The generic branch catches any "Surname-Lutterodt".
  const SURNAME_RE = /[A-Za-z]+-Lutterodt|Lutterodt-Quarcoo|Lutterodt|Lutteroth/i;

  // Title and snippet are matched separately. Joining them with a space lets a
  // pattern span the boundary and invent names such as "Lutterodt Crime" from
  // a headline that ends with the surname and a snippet that starts with a word.
  for (const source of [title, snippet]) {
    const surnameMatch = source.match(SURNAME_RE);
    if (!surnameMatch) continue;
    const surname = surnameMatch[0];
const namePatterns = [
      // Forename (plus optional middle names or initials) before the surname,
      // e.g. "Bettina Lutterodt" or "Frederick G. C. Lutterodt".
      new RegExp(`[A-Z][a-z]+(?:[-'][A-Z][a-z]+)?(?:\\s+(?:[A-Z][a-z]+|[A-Z]\\.))*\\s+${surname}`, "i"),
      // Surname first, e.g. "Lutterodt Bettina".
      new RegExp(`${surname}\\s+[A-Z][a-z]+`, "i"),
    ];
    for (const pattern of namePatterns) {
      const m = source.match(pattern);
      if (m && isPersonName(m[0].trim())) return m[0].trim();
    }
  }

  // Fall back to the words surrounding the surname in the title, but only if
  // the result still looks like a person. Previously this returned the whole
  // page title, which turned entries like "Meaning of the surname Lutterodt"
  // into profiles.
  const beforePipe = title.split(/[|—–·•]/)[0].trim();
  const surnameMatch = beforePipe.match(SURNAME_RE);
  if (surnameMatch) {
    const surname = surnameMatch[0];
const words = beforePipe.split(/\s+/);
    const escaped = surname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const idx = words.findIndex((w: string) => w.match(new RegExp(escaped, 'i')));
    if (idx >= 0) {
      // Walk back from the surname over capitalised tokens only, so a headline
      // like "Police disclose why Counsellor Lutterodt" yields just the surname
      // and is rejected, while "Frederick G. C. Lutterodt" yields the full name.
      let start = idx;
      while (start > 0 && idx - start < 3 && isCapitalisedNamePart(words[start - 1])) start--;
      const candidate = words.slice(start, idx + 1).join(" ");
      if (isPersonName(candidate)) return candidate;
    }
  }

  return "";
}

function extractEmail(text: string): string | null {
  const m = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return m ? m[0].toLowerCase() : null;
}

function extractLinkedin(text: string): string | null {
  const m = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s"')>]+/);
  return m ? m[0].replace(/[&?].*$/, "").replace(/\/$/, "") : null;
}

async function searchDuckDuckGo(query: string): Promise<{ results: Candidate[]; source: string }> {
  const url = "https://html.duckduckgo.com/html/";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml",
    },
    body: `q=${encodeURIComponent(query)}`,
  });
  if (!res.ok) return { results: [], source: "ddg (failed)" };
  const html = await res.text();
  if (html.length < 500) return { results: [], source: "ddg (empty)" };
  const results: Candidate[] = [];
  const divs = html.split('<div class="result ');
  for (let i = 1; i < divs.length; i++) {
    const block = divs[i];
    const aMatch = block.match(/<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!aMatch) continue;
    const url = aMatch[1].replace(/&amp;/g, "&");
    const title = aMatch[2].replace(/<[^>]*>/g, "").trim();
    const sMatch = block.match(/class="result__snippet">([\s\S]*?)<\/a>/i);
    const snippet = sMatch ? sMatch[1].replace(/<[^>]*>/g, "").trim() : "";
    const name = extractName(title, snippet);
    if (!name) continue;
    const combined = `${title} ${snippet}`;
    results.push({
      name,
      snippet: snippet.slice(0, 300),
      url,
      source: "duckduckgo",
      estimatedCategory: estimateCategory(combined),
      estimatedCountry: estimateCountry(combined, url),
    });
  }
  return { results, source: "duckduckgo" };
}

async function searchBrave(query: string, braveKey: string): Promise<{ results: Candidate[]; source: string }> {
  try {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=20`;
    const res = await fetch(url, {
      headers: { "X-Subscription-Token": braveKey, "Accept": "application/json" },
    });
    if (!res.ok) return { results: [], source: "brave (failed)" };
    const data = await res.json() as any;
    const webResults = data?.web?.results || [];
    const results: Candidate[] = [];
    for (const r of webResults) {
      const name = extractName(r.title || "", r.description || "");
      if (!name) continue;
      results.push({
        name,
        snippet: (r.description || "").slice(0, 300),
        url: r.url || "",
        source: "brave",
        estimatedCategory: estimateCategory(`${r.title || ""} ${r.description || ""}`),
        estimatedCountry: estimateCountry(`${r.title || ""} ${r.description || ""}`, r.url || ""),
      });
    }
    return { results, source: "brave" };
  } catch { return { results: [], source: "brave (error)" }; }
}

async function searchGoogle(query: string, googleKey: string, googleCx: string): Promise<{ results: Candidate[]; source: string }> {
  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${googleKey}&cx=${googleCx}&q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) return { results: [], source: "google (failed)" };
    const data = await res.json() as any;
    const items = data.items || [];
    const results: Candidate[] = [];
    for (const item of items) {
      const name = extractName(item.title || "", item.snippet || "");
      if (!name) continue;
      results.push({
        name,
        snippet: (item.snippet || "").slice(0, 300),
        url: item.link || "",
        source: "google",
        estimatedCategory: estimateCategory(`${item.title || ""} ${item.snippet || ""}`),
        estimatedCountry: estimateCountry(`${item.title || ""} ${item.snippet || ""}`, item.link || ""),
      });
    }
    return { results, source: "google" };
  } catch { return { results: [], source: "google (error)" }; }
}

export async function searchQuery(query: string, env: any): Promise<{ results: Candidate[]; source: string }> {
  // Brave first when configured (higher quality); DDG fallback; Google last.
  // NOTE: Brave free tier is ~2,000 queries/month — batch discovery stays small by design.
  const braveKey = env.BRAVE_API_KEY as string;
  if (braveKey) {
    const brave = await searchBrave(query, braveKey);
    if (brave.results.length > 0) return brave;
  }
  const ddg = await searchDuckDuckGo(query);
  if (ddg.results.length > 0) return ddg;
  const googleKey = env.GOOGLE_API_KEY as string;
  const googleCx = env.GOOGLE_CX as string;
  if (googleKey && googleCx) {
    const google = await searchGoogle(query, googleKey, googleCx);
    if (google.results.length > 0) return google;
  }
  return { results: [], source: "none" };
}

async function runBatches(queries: string[], env: any, batchSize = 5): Promise<PromiseSettledResult<{ results: Candidate[]; source: string }>[]> {
  const results: PromiseSettledResult<{ results: Candidate[]; source: string }>[] = [];
  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(q => searchQuery(q, env)));
    results.push(...batchResults);
  }
  return results;
}

export async function batchSearch(queries: string[], env: any): Promise<{ allCandidates: Candidate[]; perQuery: { query: string; count: number; source: string }[] }> {
  const allCandidates: Candidate[] = [];
  const perQuery: { query: string; count: number; source: string }[] = [];
  const seenUrls = new Set<string>();
  const seenNames = new Set<string>();

  const results = await runBatches(queries, env, 5);

  for (let i = 0; i < queries.length; i++) {
    const r = results[i];
    if (r.status === "fulfilled") {
      let count = 0;
      for (const c of r.value.results) {
        const key = normalizeName(c.name) + c.url;
        if (!seenUrls.has(key)) {
          seenUrls.add(key);
          seenNames.add(normalizeName(c.name));
          allCandidates.push(c);
          count++;
        }
      }
      perQuery.push({ query: queries[i], count, source: r.value.source });
    } else {
      perQuery.push({ query: queries[i], count: 0, source: "error" });
    }
  }

  return { allCandidates, perQuery };
}

export async function discoverContactEmail(name: string, country: string, env: any): Promise<EnrichmentResult> {
  const queries = [
    `"${name}" email`,
    `"${name}" contact`,
    `"${name}" linkedin`,
  ];
  if (country) queries.push(`"${name}" ${country}`);

  let foundEmail = "";
  let foundLinkedin = "";
  let source = "";

  for (const query of queries) {
    const search = await searchQuery(query, env);
    if (search.results.length === 0) continue;

    for (const r of search.results) {
      if (!foundEmail) {
        const email = extractEmail(`${r.snippet} ${r.url}`);
        if (email) { foundEmail = email; source = search.source; }
      }
      if (!foundLinkedin) {
        const li = extractLinkedin(r.snippet);
        if (li) foundLinkedin = li;
      }
      if (foundEmail && foundLinkedin) break;
    }
    if (foundEmail && foundLinkedin) break;
  }

  return { email: foundEmail, linkedin: foundLinkedin, source };
}

export async function importCandidates(candidates: Candidate[], db: D1Database): Promise<{ imported: { name: string; id: string }[]; duplicates: number; errors: number; rejected: number }> {
  const existing = await db.prepare("SELECT id, name FROM outreach_profiles").all<{ id: string; name: string }>();
  const existingNormals = new Set((existing.results || []).map((p: any) => normalizeName(p.name)));

  const imported: { name: string; id: string }[] = [];
  let duplicates = 0;
  let errors = 0;
  let rejected = 0;

  for (const cand of candidates) {
    // Defence in depth. extractName already filters titles that describe the
    // surname rather than a person, but candidates can arrive from other
    // sources too, so re-check before writing anything.
    if (!isPersonName(cand.name)) { rejected++; continue; }

    const normalized = normalizeName(cand.name);
    if (existingNormals.has(normalized)) { duplicates++; continue; }
    let isDuplicate = false;
    for (const en of existingNormals) {
      if (en.includes(normalized) || normalized.includes(en)) { isDuplicate = true; break; }
    }
    if (isDuplicate) { duplicates++; continue; }

    const id = slugify(cand.name);
    const now = new Date().toISOString();
    const country = normalizeCountry(cand.estimatedCountry);

    try {
      await db.prepare(
        "INSERT INTO outreach_profiles (id, name, dob, category, country, achievement, notes, letter_status, created_at, updated_at) VALUES (?, ?, '', ?, ?, ?, ?, 'new', ?, ?)"
      ).bind(id, cand.name, cand.estimatedCategory, country, cand.snippet.slice(0, 500), `Auto-imported from ${cand.source}: ${cand.url}`, now, now).run();

      await db.prepare(
        "INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, 'discovered', ?, ?)"
      ).bind(id, `Auto-imported via batch discovery: ${cand.name} (${country})`, now).run();

      existingNormals.add(normalized);
      imported.push({ name: cand.name, id });
    } catch { errors++; }
  }

  return { imported, duplicates, errors, rejected };
}

export async function enrichAndQueue(
  profileIds: { id: string; name: string }[],
  db: D1Database,
  env: any,
  maxLetters: number = 20
): Promise<{ queued: { id: number; profile_id: string; name: string }[]; enriched: number; skipped: number }> {
  const queued: { id: number; profile_id: string; name: string }[] = [];
  let enriched = 0;
  let skipped = 0;

  const today = new Date().toISOString().split("T")[0];

  for (const p of profileIds.slice(0, maxLetters)) {
    const profile = await db.prepare(
      "SELECT id, name, category, country, achievement, dob, contact_email FROM outreach_profiles WHERE id = ?"
    ).bind(p.id).first<{ id: string; name: string; category: string; country: string; achievement: string; dob: string; contact_email: string }>();

    if (!profile) { skipped++; continue; }

    // Enrich contact email if missing
    if (!profile.contact_email) {
      const enrichment = await discoverContactEmail(profile.name, profile.country, env);
      if (enrichment.email) {
        await db.prepare("UPDATE outreach_profiles SET contact_email = ?, contact_linkedin = ?, updated_at = ? WHERE id = ?")
          .bind(enrichment.email, enrichment.linkedin, new Date().toISOString(), profile.id).run();

        await db.prepare("INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, 'enriched', ?, ?)")
          .bind(profile.id, `Found email: ${enrichment.email} via ${enrichment.source}`, new Date().toISOString()).run();

        enriched++;
        profile.contact_email = enrichment.email;
      }
    }

    // Generate and queue letter
    const letterHtml = generateLetterHtml({
      name: profile.name,
      achievement: profile.achievement || "is a member of the Lutterodt family whose story deserves to be told",
      category: profile.category,
      country: profile.country,
      dob: profile.dob || undefined,
    });

    const now = new Date().toISOString();
    try {
      const { meta } = await db.prepare(
        "INSERT INTO outreach_queue (profile_id, name, status, letter_html, scheduled_date, created_at, updated_at) VALUES (?, ?, 'pending', ?, ?, ?, ?)"
      ).bind(profile.id, profile.name, letterHtml, today, now, now).run();

      await db.prepare("UPDATE outreach_profiles SET letter_status = 'queued', updated_at = ? WHERE id = ?")
        .bind(now, profile.id).run();

      await db.prepare("INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, 'queued', ?, ?)")
        .bind(profile.id, `Batch queue: letter queued for ${profile.name}`, now).run();

      queued.push({ id: meta?.last_row_id as number, profile_id: profile.id, name: profile.name });
    } catch { skipped++; }
  }

  return { queued, enriched, skipped };
}
