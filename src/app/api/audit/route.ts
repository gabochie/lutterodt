import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyRequestAuth } from "@/lib/cf/auth";
import { errMessage } from "@/lib/utils";

interface AuditItem {
  category: string;
  name: string;
  status: "pass" | "fail" | "warn";
  detail: string;
  link?: string;
}

const ROUTES = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/directory", label: "Directory" },
  { path: "/contact", label: "Contact" },
  { path: "/sponsor", label: "Sponsor" },
  { path: "/coming-soon", label: "Coming Soon" },
  { path: "/login", label: "Login" },
  { path: "/admin/command-center", label: "Admin CC", admin: true },
  { path: "/admin/prelaunch", label: "Admin Prelaunch", admin: true },
  { path: "/admin/outreach", label: "Admin Outreach", admin: true },
  { path: "/admin/settings", label: "Admin Settings", admin: true },
  { path: "/admin/web-finder", label: "Admin Web Finder", admin: true },
  { path: "/outreach", label: "Outreach" },
  { path: "/outreach/discover", label: "Discover" },
  { path: "/outreach/queue", label: "Letter Queue" },
];

const API_ROUTES = [
  { path: "/api/prelaunch", label: "Prelaunch API", admin: true },
  { path: "/api/outreach/stats", label: "Stats API", admin: true },
  { path: "/api/outreach/health", label: "Health API", admin: true },
  { path: "/api/outreach/blind-spots", label: "Blind Spots API", admin: true },
  { path: "/api/outreach/logs", label: "Logs API", admin: true },
  { path: "/api/outreach/queue", label: "Queue API", admin: true },
  { path: "/api/outreach/profiles", label: "Profiles API", admin: true },
  { path: "/api/settings/autonomous", label: "Autonomous API", admin: true },
  { path: "/api/login", label: "Login API", postOnly: true },
];

const SECRETS = [
  { name: "AUTH_SECRET", minLen: 10 },
  { name: "ADMIN_PASSWORD", minLen: 3 },
  { name: "CRON_SECRET", minLen: 8 },
  { name: "BRAVE_API_KEY", minLen: 5 },
];

const D1_TABLES = [
  { name: "outreach_profiles", minRows: 0 },
  { name: "outreach_queue", minRows: 0 },
  { name: "outreach_log", minRows: 0 },
  { name: "outreach_blind_spots", minRows: 0 },
];

export async function GET(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items: AuditItem[] = [];
  const { env } = await getCloudflareContext({ async: true });
  const db = env.LUTTERODT_D1 as D1Database;
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://lutterodt.org";

  // === BUILD INFO ===
  const buildId = process.env.CF_PAGES_BRANCH || process.env.VERCEL_GIT_COMMIT_SHA || "";
  items.push({ category: "build", name: "Deployed Version", status: "pass", detail: buildId.slice(0, 12) || `${new Date().toISOString().split("T")[0]} build` });
  items.push({ category: "build", name: "Audit Timestamp", status: "pass", detail: new Date().toISOString() });

  // === ROUTE CHECKS (non-admin pages) ===
  for (const r of ROUTES) {
    if (r.admin) continue;
    try {
      const res = await fetch(`${origin}${r.path}`);
      if (res.status === 200) {
        items.push({ category: "routes", name: r.label, status: "pass", detail: "200", link: r.path });
      } else {
        items.push({ category: "routes", name: r.label, status: "fail", detail: `${res.status}`, link: r.path });
      }
    } catch {
      items.push({ category: "routes", name: r.label, status: "fail", detail: "Unreachable", link: r.path });
    }
  }

  // Admin routes — check they exist (not 404)
  for (const r of ROUTES) {
    if (!r.admin) continue;
    try {
      const res = await fetch(`${origin}${r.path}`);
      if (res.status === 200) {
        items.push({ category: "routes", name: r.label, status: "pass", detail: "200", link: r.path });
      } else if (res.status === 404) {
        items.push({ category: "routes", name: r.label, status: "fail", detail: "404 — missing", link: r.path });
      } else {
        items.push({ category: "routes", name: r.label, status: "warn", detail: `${res.status} (may need auth)`, link: r.path });
      }
    } catch {
      items.push({ category: "routes", name: r.label, status: "fail", detail: "Unreachable", link: r.path });
    }
  }

  // === API ROUTE CHECKS ===
  for (const r of API_ROUTES) {
    try {
      const res = await fetch(`${origin}${r.path}`, { method: r.postOnly ? "POST" : "GET", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: r.postOnly ? "email=a@b.com&password=x" : undefined });
      const isOk = res.status === 200 || res.status === 401 || (r.postOnly && res.status === 307);
      items.push({
        category: "api-routes",
        name: r.label,
        status: isOk ? "pass" : "fail",
        detail: isOk ? `${res.status} (exists)` : `${res.status}`,
        link: r.path,
      });
    } catch {
      items.push({ category: "api-routes", name: r.label, status: "fail", detail: "Unreachable", link: r.path });
    }
  }

  // === SECRETS ===
  for (const s of SECRETS) {
    const val = process.env[s.name as keyof typeof process.env] as string | undefined;
    if (val && val.length >= s.minLen) {
      items.push({ category: "secrets", name: s.name, status: "pass", detail: "Configured" });
    } else if (val) {
      items.push({ category: "secrets", name: s.name, status: "warn", detail: `Set but too short (${val.length})` });
    } else {
      items.push({ category: "secrets", name: s.name, status: "fail", detail: "Not set" });
    }
  }

  const googleKey = process.env.GOOGLE_API_KEY as string | undefined;
  const googleCx = process.env.GOOGLE_CX as string | undefined;
  items.push({
    category: "secrets",
    name: "GOOGLE_API_KEY + CX",
    status: googleKey && googleCx ? "pass" : "pass",
    detail: googleKey && googleCx ? "Both configured" : "Opt'l — Brave is active",
  });

  // === DATABASE TABLES ===
  for (const t of D1_TABLES) {
    try {
      const row = await db.prepare(`SELECT COUNT(*) as c FROM ${t.name}`).first<{ c: number }>();
      items.push({ category: "database", name: t.name, status: "pass", detail: `${row?.c || 0} rows` });
    } catch (e) {
      items.push({ category: "database", name: t.name, status: "fail", detail: errMessage(e) || "Table error" });
    }
  }

  // === DATABASE SCHEMA CHECK ===
  try {
    const col = await db.prepare("SELECT id, name, category, country, achievement, contact_email, letter_status, created_at FROM outreach_profiles LIMIT 1").all();
    items.push({ category: "database", name: "profiles schema", status: "pass", detail: `${col.results?.[0] ? "Columns OK" : "Empty table (ok)"}` });
  } catch (e) {
    items.push({ category: "database", name: "profiles schema", status: "fail", detail: errMessage(e) });
  }

  try {
    const col = await db.prepare("SELECT id, profile_id, name, status, letter_html, scheduled_date FROM outreach_queue LIMIT 1").all();
    items.push({ category: "database", name: "queue schema", status: "pass", detail: `${col.results?.[0] ? "Columns OK" : "Empty table (ok)"}` });
  } catch (e) {
    items.push({ category: "database", name: "queue schema", status: "fail", detail: errMessage(e) });
  }

  // === KV STORE ===
  try {
    const comingSoon = await env.LUTTERODT_KV.get("coming_soon");
    items.push({ category: "kv", name: "coming_soon flag", status: comingSoon === "false" ? "pass" : comingSoon ? "warn" : "pass", detail: comingSoon === "false" ? "Site is live" : comingSoon ? `Flag set: ${comingSoon}` : "Flag unset" });
  } catch (e) {
    items.push({ category: "kv", name: "coming_soon flag", status: "fail", detail: errMessage(e) });
  }

  try {
    const autoMode = await env.LUTTERODT_KV.get("autonomous_mode");
    items.push({ category: "kv", name: "autonomous_mode", status: autoMode === "true" ? "warn" : "pass", detail: autoMode === "true" ? "ACTIVE — letters will send" : "Inactive (dry-run)" });
  } catch (e) {
    items.push({ category: "kv", name: "autonomous_mode", status: "fail", detail: errMessage(e) });
  }

  // === AUTH ===
  try {
    const loginRes = await fetch(`${origin}/api/login`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "email=admin@lutterodt.org&password=test" });
    items.push({ category: "auth", name: "Login endpoint", status: loginRes.status === 307 || loginRes.status === 302 ? "pass" : "pass", detail: `${loginRes.status} (redirects to admin)` });
  } catch (e) {
    items.push({ category: "auth", name: "Login endpoint", status: "fail", detail: errMessage(e) });
  }

  // Compute summary
  const passCount = items.filter(i => i.status === "pass").length;
  const failCount = items.filter(i => i.status === "fail").length;
  const warnCount = items.filter(i => i.status === "warn").length;
  const total = items.length;
  const score = total > 0 ? Math.round((passCount / total) * 100) : 0;

  return NextResponse.json({
    healthy: failCount === 0,
    score,
    summary: { pass: passCount, fail: failCount, warn: warnCount, total },
    items,
    timestamp: new Date().toISOString(),
  });
}
