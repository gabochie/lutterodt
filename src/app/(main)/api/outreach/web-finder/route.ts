/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifySession } from "@/lib/cf/auth";

interface Candidate {
  name: string;
  snippet: string;
  url: string;
  source: string;
  estimatedCategory: string;
  estimatedCountry: string;
}

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

async function searchBrave(query: string, apiKey: string): Promise<{ results: Candidate[]; source: string }> {
  if (!apiKey) return { results: [], source: "brave (no key)" };
  try {
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=20`;
    const res = await fetch(url, {
      headers: { "X-Subscription-Token": apiKey, "Accept": "application/json" },
    });
    if (!res.ok) return { results: [], source: `brave (${res.status})` };
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
  } catch {
    return { results: [], source: "brave (error)" };
  }
}

async function searchGoogle(query: string, apiKey: string, cx: string): Promise<{ results: Candidate[]; source: string }> {
  if (!apiKey || !cx) return { results: [], source: "google (no key)" };
  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) return { results: [], source: `google (${res.status})` };
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
  } catch {
    return { results: [], source: "google (error)" };
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const query = (body.query || "Lutterodt").trim();
    if (query.length < 2) {
      return NextResponse.json({ error: "Query too short" }, { status: 400 });
    }

    const { env } = await getCloudflareContext({ async: true });

    let result = await searchDuckDuckGo(query);
    if (result.results.length === 0) {
      result = await searchBrave(query, (env.BRAVE_API_KEY as string) || "");
    }
    if (result.results.length === 0) {
      result = await searchGoogle(query, (env.GOOGLE_API_KEY as string) || "", (env.GOOGLE_CX as string) || "");
    }

    return NextResponse.json({
      results: result.results,
      source: result.source,
      total: result.results.length,
      query,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
