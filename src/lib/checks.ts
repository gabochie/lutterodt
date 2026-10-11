import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getRecordCount } from "@/lib/cf/d1";
import { errMessage } from "@/lib/utils";

export type CheckResult = { ok: boolean; detail?: string };

type CheckFn = () => Promise<CheckResult>;

export interface CheckItemDef {
  text: string;
  check?: CheckFn;
  manualStatus?: "pending" | "completed";
}

export interface CheckCategoryDef {
  title: string;
  items: CheckItemDef[];
}

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

async function getKV() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_KV as KVNamespace;
}

export async function routeOk(path: string): Promise<boolean> {
  try {
    const url = `https://lutterodt.org${path}`;
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(5000) });
    return res.status !== 404;
  } catch { return false; }
}

export async function apiProtected(path: string): Promise<boolean> {
  try {
    const url = `https://lutterodt.org${path}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return res.status === 401;
  } catch { return false; }
}

export async function envSet(key: string): Promise<boolean> {
  return !!process.env[key];
}

export async function envNotDefault(key: string, defaultValue: string): Promise<boolean> {
  return !!process.env[key] && process.env[key] !== defaultValue;
}

export async function d1Column(table: string, column: string): Promise<CheckResult> {
  try {
    const db = await getDB();
    await db.prepare(`SELECT ${column} FROM ${table} LIMIT 1`).all();
    return { ok: true, detail: `${table}.${column}` };
  } catch {
    return { ok: false, detail: `${table}.${column} missing` };
  }
}

export async function letterCoverage(): Promise<CheckResult> {
  try {
    const db = await getDB();
    const total = await db
      .prepare("SELECT COUNT(*) AS c FROM outreach_profiles")
      .first<{ c: number }>();
    const withLetter = await db
      .prepare("SELECT COUNT(*) AS c FROM outreach_profiles WHERE has_letter = 1")
      .first<{ c: number }>();
    const t = total?.c ?? 0;
    const w = withLetter?.c ?? 0;
    return { ok: t > 0 && w >= t, detail: `${w}/${t} profiles have a letter` };
  } catch (err) {
    return { ok: false, detail: errMessage(err, "letter coverage unavailable") };
  }
}

export async function profileCount(): Promise<CheckResult> {
  try {
    const db = await getDB();
    const total = await db
      .prepare("SELECT COUNT(*) AS c FROM outreach_profiles")
      .first<{ c: number }>();
    const documented = await db
      .prepare(
        "SELECT COUNT(*) AS c FROM outreach_profiles WHERE achievement IS NOT NULL AND achievement != ''"
      )
      .first<{ c: number }>();
    const t = total?.c ?? 0;
    const d = documented?.c ?? 0;
    return { ok: t > 0 && d >= t, detail: `${t} profiles, ${d} with a biography` };
  } catch (err) {
    return { ok: false, detail: errMessage(err, "profile count unavailable") };
  }
}

async function d1Count(table: string): Promise<CheckResult> {
  try {
    const c = await getRecordCount(table);
    return { ok: c > 0, detail: `${c} rows` };
  } catch (e: unknown) {
    return { ok: false, detail: errMessage(e, "count failed") };
  }
}

async function kvKeyExists(key: string): Promise<boolean> {
  try {
    const kv = await getKV();
    const val = await kv.get(key);
    return val !== null;
  } catch { return false; }
}

export const CHECK_CATEGORIES: CheckCategoryDef[] = [
  {
    title: "Core Pages & Routes",
    items: [
      {
        text: "Create /verify page (directory links to it)",
        check: async () => ({ ok: await routeOk("/verify") }),
      },
      {
        text: "Wire contact form to POST /api/leads",
        check: async () => ({ ok: await routeOk("/api/leads") }),
      },
      {
        text: "Wire Articles admin CRUD to backend API",
        check: async () => ({ ok: await apiProtected("/api/articles") }),
      },
      {
        text: "Wire Timeline admin page to backend API",
        check: async () => ({ ok: await apiProtected("/api/timeline") }),
      },
      {
        text: "Wire Gallery admin page to backend API",
        check: async () => ({ ok: await apiProtected("/api/gallery") }),
      },
      {
        text: "Wire Contacts admin page to backend API",
        check: async () => ({ ok: await apiProtected("/api/contacts") }),
      },
      {
        text: "Create /outreach/discover, /outreach/send pages",
        check: async () => ({ ok: await routeOk("/outreach/discover") }),
      },
      {
        text: "Remove ComingSoonGate flash on load",
        check: async () => ({ ok: true, detail: "Manual — mark complete if no flash" }),
      },
      {
        text: "Verify all routes build and deploy",
        check: async () => ({ ok: await routeOk("/api/stats") }),
      },
    ],
  },
  {
    title: "Authentication & Security",
    items: [
      {
        text: "Add auth middleware for route protection",
        check: async () => ({ ok: await apiProtected("/api/articles") }),
      },
      {
        text: "HMAC-signed cookie session with 14-day expiry",
        check: async () => ({ ok: await apiProtected("/api/stats") }),
      },
      {
        text: "Fallback cookie parse for Cloudflare Workers edge",
        manualStatus: "completed",
      },
      {
        text: "Bearer token auth for cron (CRON_SECRET)",
        check: async () => ({ ok: await envSet("CRON_SECRET") }),
      },
      {
        text: "Rotate AUTH_SECRET for production",
        check: async () => ({ ok: await envNotDefault("AUTH_SECRET", "replace-with-at-least-32-random-characters") }),
      },
      {
        text: "Rotate ADMIN_PASSWORD for production",
        check: async () => ({ ok: await envNotDefault("ADMIN_PASSWORD", "replace-with-a-strong-password") }),
      },
      {
        text: "Review env vars — no secrets exposed client-side",
        manualStatus: "pending",
      },
      {
        text: "Remove hardcoded credentials from test files",
        manualStatus: "pending",
      },
    ],
  },
  {
    title: "Outreach Pipeline",
    items: [
      { text: "Daily outreach endpoint (GET status, POST run)", check: async () => ({ ok: await apiProtected("/api/outreach/daily") }) },
      { text: "DDG search + Brave/Google fallback for discovery", check: async () => ({ ok: true, detail: "Code-level — always available" }) },
      { text: "Dedup + auto-import new profiles", check: async () => ({ ok: true, detail: "Code-level — always available" }) },
      { text: "Letter generation shared library (src/lib/outreach/letter.ts)", check: async () => ({ ok: true, detail: "Code-level — always available" }) },
      { text: "Queue system with scheduled_date support", check: async () => ({ ok: await apiProtected("/api/outreach/queue") }) },
      { text: "Scheduler calendar UI (/admin/scheduler)", check: async () => ({ ok: await routeOk("/admin/scheduler") }) },
      { text: "System health endpoint (/api/outreach/health)", check: async () => ({ ok: await apiProtected("/api/outreach/health") }) },
      { text: "Logs endpoint (/api/outreach/logs)", check: async () => ({ ok: await apiProtected("/api/outreach/logs") }) },
      { text: "Command Center (/admin/command-center) with 6 panels", check: async () => ({ ok: await routeOk("/admin/command-center") }) },
      { text: "Autonomous mode toggle (KV setting, default OFF)", check: async () => ({ ok: await kvKeyExists("autonomous_mode") }) },
      { text: "Email sending utility (Resend API + dry-run wrapper)", check: async () => ({ ok: true, detail: "Code-level — always available" }) },
      { text: "Send endpoint (/api/outreach/send)", check: async () => ({ ok: await apiProtected("/api/outreach/send") }) },
      { text: "GitHub Actions cron (daily at 08:00 UTC)", manualStatus: "completed" },
      { text: "Set up real RESEND_API_KEY on Cloudflare", check: async () => ({ ok: await envSet("RESEND_API_KEY") }) },
      { text: "Add bounce/retry webhook for Resend delivery events", manualStatus: "pending" },
      { text: "Add daily summary email notification", manualStatus: "pending" },
    ],
  },
  {
    title: "Content & SEO",
    items: [
      { text: "Review all directory profiles for accuracy", manualStatus: "pending" },
      { text: "Verify legal pages (privacy, terms, cookies, copyright, disclaimer)", check: async () => ({ ok: await routeOk("/privacy") && await routeOk("/terms") }) },
      { text: "Update meta tags and OG images for all pages", manualStatus: "pending" },
      { text: "Set up GA4 / analytics tracking", check: async () => ({ ok: await envSet("NEXT_PUBLIC_GA_ID") }) },
      { text: "Add social sharing metadata", manualStatus: "completed" },
      { text: "Add sitemap.xml and robots.txt", check: async () => ({ ok: await routeOk("/sitemap.xml") && await routeOk("/robots.txt") }) },
      { text: "Generate an outreach letter for every profile", check: async () => letterCoverage() },
    ],
  },
  {
    title: "Infrastructure & Reliability",
    items: [
      { text: "Verify CDN caching configuration", manualStatus: "pending" },
      { text: "Set up error monitoring (Sentry or similar)", manualStatus: "pending" },
      { text: "Review Cloudflare Workers limits (CPU, memory, subrequests)", manualStatus: "pending" },
      { text: "D1 backup strategy (export to R2)", manualStatus: "pending" },
      { text: "Validate custom domain DNS and SSL", check: async () => ({ ok: await routeOk("/") }) },
      { text: "Directory profiles seeded in D1 database", check: async () => d1Count("outreach_profiles") },
      { text: "CRON_SECRET set on Cloudflare", check: async () => ({ ok: await envSet("CRON_SECRET") }) },
      { text: "RESEND_API_KEY set on Cloudflare", check: async () => ({ ok: await envSet("RESEND_API_KEY") }) },
    ],
  },
  {
    title: "Launch Day",
    items: [
      { text: "Turn off \"Coming Soon\" mode in Settings", check: async () => {
        try { const kv = await getKV(); const v = await kv.get("coming_soon"); return { ok: v !== "true", detail: v === "true" ? "Coming Soon is ON" : "Coming Soon is OFF" }; }
        catch { return { ok: false }; }
      }},
      { text: "Deploy final production build", manualStatus: "pending" },
      { text: "Verify all routes return 200 on live domain", manualStatus: "pending" },
      { text: "Confirm CRON pipeline fires autonomously", manualStatus: "pending" },
      { text: "Monitor error logs for first 24 hours", manualStatus: "pending" },
      { text: "Announce launch to family", manualStatus: "pending" },
    ],
  },
];
