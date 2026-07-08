import { NextResponse, NextRequest } from "next/server";
import { getSetting, setSetting } from "@/lib/cf/kv";
import { verifySession } from "@/lib/cf/auth";

interface CheckItem {
  text: string;
  status: "pending" | "completed";
}

interface CheckCategory {
  title: string;
  items: CheckItem[];
}

interface PrelaunchData {
  categories: CheckCategory[];
}

const defaultChecklist: PrelaunchData = {
  categories: [
    {
      title: "Core Pages & Routes",
      items: [
        { text: "Create /verify page (directory links to it)", status: "pending" },
        { text: "Wire contact form to POST /api/leads", status: "completed" },
        { text: "Wire Articles admin CRUD to backend API", status: "pending" },
        { text: "Wire Timeline admin page to backend API", status: "pending" },
        { text: "Wire Gallery admin page to backend API", status: "pending" },
        { text: "Wire Contacts admin page to backend API", status: "pending" },
        { text: "Create /outreach/discover, /outreach/send pages", status: "pending" },
        { text: "Remove ComingSoonGate flash on load", status: "completed" },
        { text: "Verify all 134 routes build and deploy", status: "completed" },
      ],
    },
    {
      title: "Authentication & Security",
      items: [
        { text: "Add auth middleware for route protection", status: "completed" },
        { text: "HMAC-signed cookie session with 14-day expiry", status: "completed" },
        { text: "Fallback cookie parse for Cloudflare Workers edge", status: "completed" },
        { text: "Bearer token auth for cron (CRON_SECRET)", status: "completed" },
        { text: "Rotate AUTH_SECRET for production", status: "pending" },
        { text: "Rotate ADMIN_PASSWORD for production", status: "pending" },
        { text: "Review env vars — no secrets exposed client-side", status: "pending" },
        { text: "Remove hardcoded credentials from test files", status: "pending" },
      ],
    },
    {
      title: "Outreach Pipeline",
      items: [
        { text: "Daily outreach endpoint (GET status, POST run)", status: "completed" },
        { text: "DDG search + Brave/Google fallback for discovery", status: "completed" },
        { text: "Dedup + auto-import new profiles", status: "completed" },
        { text: "Letter generation shared library (src/lib/outreach/letter.ts)", status: "completed" },
        { text: "Queue system with scheduled_date support", status: "completed" },
        { text: "Scheduler calendar UI (/admin/scheduler)", status: "completed" },
        { text: "System health endpoint (/api/outreach/health)", status: "completed" },
        { text: "Logs endpoint (/api/outreach/logs)", status: "completed" },
        { text: "Command Center (/admin/command-center) with 6 panels", status: "completed" },
        { text: "Autonomous mode toggle (KV setting, default OFF)", status: "completed" },
        { text: "Email sending utility (Resend API + dry-run wrapper)", status: "completed" },
        { text: "Send endpoint (/api/outreach/send)", status: "completed" },
        { text: "GitHub Actions cron (daily at 08:00 UTC)", status: "completed" },
        { text: "Set up real RESEND_API_KEY on Cloudflare", status: "pending" },
        { text: "Add bounce/retry webhook for Resend delivery events", status: "pending" },
        { text: "Add daily summary email notification", status: "pending" },
      ],
    },
    {
      title: "Content & SEO",
      items: [
        { text: "Review all 82 directory profiles for accuracy", status: "pending" },
        { text: "Verify legal pages (privacy, terms, cookies, copyright, disclaimer)", status: "pending" },
        { text: "Update meta tags and OG images for all pages", status: "pending" },
        { text: "Set up GA4 / analytics tracking", status: "completed" },
        { text: "Add social sharing metadata", status: "pending" },
        { text: "Add sitemap.xml and robots.txt", status: "pending" },
        { text: "Generate 61+ outreach letters as HTML", status: "completed" },
      ],
    },
    {
      title: "Infrastructure & Reliability",
      items: [
        { text: "Verify CDN caching configuration", status: "pending" },
        { text: "Set up error monitoring (Sentry or similar)", status: "pending" },
        { text: "Review Cloudflare Workers limits (CPU, memory, subrequests)", status: "pending" },
        { text: "Set up D1 backup strategy (export to R2)", status: "pending" },
        { text: "Validate custom domain DNS and SSL", status: "completed" },
        { text: "82 profiles seeded in D1 database", status: "completed" },
        { text: "CRON_SECRET set on Cloudflare", status: "completed" },
        { text: "RESEND_API_KEY set on Cloudflare", status: "completed" },
      ],
    },
    {
      title: "Launch Day",
      items: [
        { text: "Turn off \"Coming Soon\" mode in Settings", status: "pending" },
        { text: "Deploy final production build", status: "pending" },
        { text: "Verify all routes return 200 on live domain", status: "pending" },
        { text: "Confirm CRON pipeline fires autonomously", status: "pending" },
        { text: "Monitor error logs for first 24 hours", status: "pending" },
        { text: "Announce launch to family", status: "pending" },
      ],
    },
  ],
};

export async function GET() {
  const value = await getSetting("prelaunch");
  if (!value) {
    return NextResponse.json(defaultChecklist);
  }
  try {
    return NextResponse.json(JSON.parse(value));
  } catch {
    return NextResponse.json(defaultChecklist);
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  await setSetting("prelaunch", JSON.stringify(body));
  return NextResponse.json(body);
}
