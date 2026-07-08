import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ensureOutreachTables, normalizeName, slugify } from "@/lib/outreach/d1";
import { generateLetterHtml } from "@/lib/outreach/letter";
import { verifyRequestAuth } from "@/lib/cf/auth";

interface Candidate {
  name: string;
  snippet: string;
  url: string;
  source: string;
  estimatedCategory: string;
  estimatedCountry: string;
}

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
  engineering: ["engineer", "software", "developer", "architect", "analyst", "technical", "infrastructure", "cyber", "devops", "programmer", "data"],
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

function extractName(title: string, snippet: string): string {
  const full = `${title} ${snippet}`;
  const surnameMatch = full.match(/Lutterodt|Lutteroth|Lutterodt-Quarcoo|Mills-Lutterodt/i);
  if (!surnameMatch) return "";

  const beforePipe = title.split(/[|—–·•]/)[0].trim();
  const surname = surnameMatch[0];

  const namePatterns = [
    new RegExp(`([A-Z][a-z]+(?:[-'][A-Z][a-z]+)?\\s+)+${surname}`, 'i'),
    new RegExp(`${surname}\\s+[A-Z][a-z]+`, 'i'),
  ];

  for (const pattern of namePatterns) {
    const m = full.match(pattern);
    if (m) return m[0].trim();
  }

  const words = beforePipe.split(/\s+/);
  const idx = words.findIndex((w: string) => w.match(new RegExp(surname, 'i')));
  if (idx >= 0) {
    const start = Math.max(0, idx - 2);
    const end = Math.min(words.length, idx + 2);
    return words.slice(start, end).join(" ");
  }

  return beforePipe;
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
    const sMatch = block.match(/class="result__snippet">([\s\S]*?)<\/a>/i);
    if (!aMatch) continue;

    const url = aMatch[1].replace(/&amp;/g, "&");
    const title = aMatch[2].replace(/<[^>]*>/g, "").trim();
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

async function searchFallback(query: string, env: any): Promise<{ results: Candidate[]; source: string }> {
  // Brave fallback
  const braveKey = env.BRAVE_API_KEY as string;
  if (braveKey) {
    try {
      const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=20`;
      const res = await fetch(url, {
        headers: { "X-Subscription-Token": braveKey, "Accept": "application/json" },
      });
      if (res.ok) {
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
      }
    } catch { /* fall through */ }
  }

  // Google fallback
  const googleKey = env.GOOGLE_API_KEY as string;
  const googleCx = env.GOOGLE_CX as string;
  if (googleKey && googleCx) {
    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${googleKey}&cx=${googleCx}&q=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      if (res.ok) {
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
      }
    } catch { /* fall through */ }
  }

  return { results: [], source: "none" };
}

function normalizeCountry(raw: string): string {
  return COUNTRY_MAP[raw] || raw;
}

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

export async function GET(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDB();
    await ensureOutreachTables(db);

    const today = new Date().toISOString().split("T")[0];

    // Check if there's already a pending item for today
    const existingToday = await db.prepare(
      "SELECT id, profile_id, name, letter_html, status FROM outreach_queue WHERE scheduled_date = ? AND status = 'pending' LIMIT 1"
    ).bind(today).first<{ id: number; profile_id: string; name: string; letter_html: string; status: string }>();

    // Get queue stats
    const pendingCount = await db.prepare("SELECT COUNT(*) as c FROM outreach_queue WHERE status = 'pending'").first<{ c: number }>();
    const sentCount = await db.prepare("SELECT COUNT(*) as c FROM outreach_queue WHERE status = 'sent'").first<{ c: number }>();
    const totalProfiles = await db.prepare("SELECT COUNT(*) as c FROM outreach_profiles").first<{ c: number }>();
    const noLetterCount = await db.prepare("SELECT COUNT(*) as c FROM outreach_profiles WHERE letter_status IN ('none','new')").first<{ c: number }>();

    return NextResponse.json({
      ok: true,
      today: {
        date: today,
        hasPendingLetter: !!existingToday,
        pendingLetter: existingToday ? {
          id: existingToday.id,
          profile_id: existingToday.profile_id,
          name: existingToday.name,
          status: existingToday.status,
        } : null,
      },
      stats: {
        totalProfiles: totalProfiles?.c || 0,
        noLetter: noLetterCount?.c || 0,
        pendingInQueue: pendingCount?.c || 0,
        totalSent: sentCount?.c || 0,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDB();
    await ensureOutreachTables(db);

    const today = new Date().toISOString().split("T")[0];
    const summary: {
      search: { total: number; new: number; duplicates: number; errors: number; source: string };
      today_letter: any;
      stats: any;
    } = {
      search: { total: 0, new: 0, duplicates: 0, errors: 0, source: "" },
      today_letter: null,
      stats: {},
    };

    // === STEP 1: Search for new Lutterodts ===
    let searchResult = await searchDuckDuckGo("Lutterodt");
    if (searchResult.results.length === 0) {
      const { env } = await getCloudflareContext({ async: true });
      searchResult = await searchFallback("Lutterodt", env);
    }
    summary.search.total = searchResult.results.length;
    summary.search.source = searchResult.source;

    // === STEP 2: Dedup and auto-import new profiles ===
    const existing = await db.prepare(
      "SELECT id, name FROM outreach_profiles"
    ).all<{ id: string; name: string }>();

    const existingNormals = new Set((existing.results || []).map((p: any) => normalizeName(p.name)));

    for (const cand of searchResult.results) {
      const normalized = normalizeName(cand.name);
      if (existingNormals.has(normalized)) {
        summary.search.duplicates++;
        continue;
      }

      // Check containment both ways
      let isDuplicate = false;
      for (const en of existingNormals) {
        if (en.includes(normalized) || normalized.includes(en)) {
          isDuplicate = true;
          break;
        }
      }
      if (isDuplicate) {
        summary.search.duplicates++;
        continue;
      }

      // Import new profile
      const id = slugify(cand.name);
      const now = new Date().toISOString();
      const country = normalizeCountry(cand.estimatedCountry);

      try {
        await db.prepare(
          "INSERT INTO outreach_profiles (id, name, dob, category, country, achievement, notes, letter_status, created_at, updated_at) VALUES (?, ?, '', ?, ?, ?, ?, 'new', ?, ?)"
        ).bind(
          id, cand.name, cand.estimatedCategory, country,
          cand.snippet.slice(0, 500),
          `Auto-imported from ${cand.source}: ${cand.url}`,
          now, now
        ).run();

        await db.prepare(
          "INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, 'discovered', ?, ?)"
        ).bind(id, `Auto-imported via daily pipeline: ${cand.name} (${country})`, now).run();

        existingNormals.add(normalized);
        summary.search.new++;
      } catch {
        summary.search.errors++;
      }
    }

    // === STEP 3: Check if there's already a pending letter for today ===
    const existingToday = await db.prepare(
      "SELECT id, profile_id, name, letter_html, status FROM outreach_queue WHERE scheduled_date = ? AND status = 'pending' LIMIT 1"
    ).bind(today).first<{ id: number; profile_id: string; name: string; letter_html: string; status: string }>();

    // === STEP 4: Find next profile without a letter and enqueue ===
    let queuedToday = existingToday;
    if (!queuedToday) {
      // Priority: 'new' (auto-imported) → 'none' (known but no letter)
      const nextProfile = await db.prepare(
        "SELECT id, name, category, country, achievement, dob, letter_status FROM outreach_profiles WHERE letter_status IN ('new', 'none') ORDER BY CASE letter_status WHEN 'new' THEN 0 ELSE 1 END, created_at ASC LIMIT 1"
      ).first<{ id: string; name: string; category: string; country: string; achievement: string; dob: string; letter_status: string }>();

      if (nextProfile) {
        const letterHtml = generateLetterHtml({
          name: nextProfile.name,
          achievement: nextProfile.achievement || "is a member of the Lutterodt family whose story deserves to be told",
          category: nextProfile.category,
          country: nextProfile.country,
          dob: nextProfile.dob || undefined,
        });

        const now = new Date().toISOString();
        const { meta } = await db.prepare(
          "INSERT INTO outreach_queue (profile_id, name, status, letter_html, scheduled_date, created_at, updated_at) VALUES (?, ?, 'pending', ?, ?, ?, ?)"
        ).bind(nextProfile.id, nextProfile.name, letterHtml, today, now, now).run();

        await db.prepare(
          "UPDATE outreach_profiles SET letter_status = 'queued', updated_at = ? WHERE id = ?"
        ).bind(now, nextProfile.id).run();

        await db.prepare(
          "INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, 'queued', ?, ?)"
        ).bind(nextProfile.id, `Daily pipeline: letter queued for ${nextProfile.name}`, now).run();

        queuedToday = {
          id: meta?.last_row_id as number,
          profile_id: nextProfile.id,
          name: nextProfile.name,
          letter_html: letterHtml,
          status: "pending",
        };
      }
    }

    // === STEP 5: Gather stats ===
    const [pendingCount, sentCount, totalProfiles, noLetterCount] = await Promise.all([
      db.prepare("SELECT COUNT(*) as c FROM outreach_queue WHERE status = 'pending'").first<{ c: number }>(),
      db.prepare("SELECT COUNT(*) as c FROM outreach_queue WHERE status = 'sent'").first<{ c: number }>(),
      db.prepare("SELECT COUNT(*) as c FROM outreach_profiles").first<{ c: number }>(),
      db.prepare("SELECT COUNT(*) as c FROM outreach_profiles WHERE letter_status IN ('none','new')").first<{ c: number }>(),
    ]);

    summary.today_letter = queuedToday ? {
      id: queuedToday.id,
      profile_id: queuedToday.profile_id,
      name: queuedToday.name,
      status: queuedToday.status,
      hasLetterHtml: !!queuedToday.letter_html,
    } : null;

    summary.stats = {
      totalProfiles: totalProfiles?.c || 0,
      noLetter: noLetterCount?.c || 0,
      pendingInQueue: pendingCount?.c || 0,
      totalSent: sentCount?.c || 0,
    };

    return NextResponse.json({ ok: true, ...summary });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
