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
      title: "Site Completeness",
      items: [
        { text: "Create /verify page (directory links to it)", status: "pending" },
        { text: "Wire contact form to POST /api/leads", status: "pending" },
        { text: "Wire Articles admin CRUD to backend API", status: "pending" },
        { text: "Wire Timeline admin page to backend API", status: "pending" },
        { text: "Wire Gallery admin page to backend API", status: "pending" },
        { text: "Wire Contacts admin page to backend API", status: "pending" },
        { text: "Remove ComingSoonGate flash on load", status: "completed" },
        { text: "Verify all 31 routes return 200", status: "pending" },
        { text: "Fix /outreach letter file links (point to letters dir)", status: "pending" },
      ],
    },
    {
      title: "Testing & CI",
      items: [
        { text: "Add ts-jest to devDependencies", status: "pending" },
        { text: "Write core tests for API routes", status: "pending" },
        { text: "Verify build succeeds in CI pipeline", status: "pending" },
        { text: "Set up Cypress e2e tests or remove test:e2e script", status: "pending" },
      ],
    },
    {
      title: "Security",
      items: [
        { text: "Remove hardcoded credentials from test files", status: "pending" },
        { text: "Add auth middleware for route protection", status: "pending" },
        { text: "Rotate AUTH_SECRET for production", status: "pending" },
        { text: "Rotate ADMIN_PASSWORD for production", status: "pending" },
        { text: "Review env vars — no secrets exposed client-side", status: "pending" },
      ],
    },
    {
      title: "Content & SEO",
      items: [
        { text: "Review all directory profiles for accuracy", status: "pending" },
        { text: "Verify legal pages (privacy, terms, cookies, copyright, disclaimer)", status: "pending" },
        { text: "Update meta tags and OG images for all pages", status: "pending" },
        { text: "Set up GA4 / analytics tracking", status: "pending" },
        { text: "Add social sharing metadata", status: "pending" },
        { text: "Add sitemap.xml and robots.txt", status: "pending" },
      ],
    },
    {
      title: "Infrastructure",
      items: [
        { text: "Verify CDN caching configuration", status: "pending" },
        { text: "Set up error monitoring (Sentry or similar)", status: "pending" },
        { text: "Review Cloudflare Workers limits (CPU, memory, subrequests)", status: "pending" },
        { text: "Set up D1 backup strategy (export to R2)", status: "pending" },
        { text: "Validate custom domain DNS and SSL", status: "pending" },
      ],
    },
    {
      title: "Launch Day",
      items: [
        { text: "Turn off \"Coming Soon\" mode in Settings", status: "pending" },
        { text: "Deploy final production build", status: "pending" },
        { text: "Verify all routes return 200 on live domain", status: "pending" },
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
