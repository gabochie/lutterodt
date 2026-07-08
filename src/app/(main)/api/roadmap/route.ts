import { NextResponse, NextRequest } from "next/server";
import { getSetting, setSetting } from "@/lib/cf/kv";
import { verifySession } from "@/lib/cf/auth";

export async function GET() {
  const value = await getSetting("roadmap");
  if (!value) {
    return NextResponse.json(initialRoadmap);
  }
  try {
    return NextResponse.json(JSON.parse(value));
  } catch {
    return NextResponse.json(initialRoadmap);
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  await setSetting("roadmap", JSON.stringify(body));
  return NextResponse.json(body);
}

const initialRoadmap = {
  phases: [
    {
      num: "01",
      title: "Foundation (MVP)",
      subtitle: "Phase 1 — Complete",
      goal: "A deployed, authenticated, content-managed digital home with a live directory and an autonomous outreach pipeline.",
      status: "completed",
      sections: [
        {
          title: "Backend & Database",
          items: [
            { text: "Cloudflare KV namespace for settings (coming_soon, roadmap, budget, outreach)", status: "completed" },
            { text: "Cloudflare D1 database for structured data (contacts, outreach, profiles)", status: "completed" },
            { text: "HMAC-signed session cookie auth (no external dependency)", status: "completed" },
            { text: "D1 schema — outreach_profiles, outreach_queue, outreach_log tables", status: "completed" },
            { text: "Row-level security / API rules", status: "pending" },
          ],
        },
        {
          title: "Authentication",
          items: [
            { text: "Login page + API route", status: "completed" },
            { text: "HMAC-signed admin session cookie with 14-day expiry", status: "completed" },
            { text: "Cookie parse fallback for Cloudflare Workers edge", status: "completed" },
            { text: "Bearer token auth for cron (CRON_SECRET)", status: "completed" },
            { text: "Logout", status: "completed" },
            { text: "Password reset flow", status: "pending" },
          ],
        },
        {
          title: "Public Website",
          items: [
            { text: "Coming soon landing page with 3-field lead capture", status: "completed" },
            { text: "FullSite component with hero, stats, cards, gallery preview", status: "completed" },
            { text: "Coming Soon toggle in admin Settings", status: "completed" },
            { text: "About page — vision, mission, values, governance", status: "completed" },
            { text: "History page — storytelling, milestones", status: "completed" },
            { text: "Interactive timeline (public)", status: "pending" },
            { text: "Family Tree viewer (read-only)", status: "pending" },
            { text: "Legacy Gallery (public)", status: "completed" },
            { text: "Family Stories / News (public)", status: "pending" },
            { text: "Events page", status: "pending" },
            { text: "Contact page with form", status: "completed" },
          ],
        },
        {
          title: "Family Directory",
          items: [
            { text: "/directory with search/filter (name, category, country)", status: "completed" },
            { text: "82 individual profile pages (SSG)", status: "completed" },
            { text: "Profiles cover 7 countries, 8 professions, 77+ individuals", status: "completed" },
            { text: "Sponsorship tiers (Free / Patron / Scholar / Guardian)", status: "completed" },
            { text: "/verify page (linked from directory)", status: "pending" },
          ],
        },
        {
          title: "Admin CMS Pages",
          items: [
            { text: "Admin dashboard with live stats + daily pipeline widget", status: "completed" },
            { text: "Articles list + edit + new pages (UI only, needs API wiring)", status: "completed" },
            { text: "Timeline list + create/edit/delete (UI only, needs API wiring)", status: "completed" },
            { text: "Gallery grid + upload (UI only, needs API wiring)", status: "completed" },
            { text: "Contacts inbox (UI only, needs live data wiring)", status: "completed" },
            { text: "Budget tracker", status: "completed" },
            { text: "Strategy page with progress bars", status: "completed" },
            { text: "Prelaunch checklist (persisted to KV)", status: "completed" },
            { text: "Settings page (Coming Soon toggle, env vars display)", status: "completed" },
            { text: "Roadmap page (persisted to KV)", status: "completed" },
          ],
        },
        {
          title: "Outreach Pipeline",
          items: [
            { text: "Daily pipeline endpoint (GET status, POST run)", status: "completed" },
            { text: "DDG web search + Brave/Google fallback for discovery", status: "completed" },
            { text: "Dedup by normalized name + auto-import new profiles", status: "completed" },
            { text: "Shared letter generation library (src/lib/outreach/letter.ts)", status: "completed" },
            { text: "Queue system with scheduled_date support", status: "completed" },
            { text: "Scheduler calendar UI (/admin/scheduler)", status: "completed" },
            { text: "Web Finder manual discovery tool", status: "completed" },
            { text: "GitHub Actions cron (daily at 08:00 UTC)", status: "completed" },
            { text: "Auto-fill next 30 days in scheduler", status: "completed" },
          ],
        },
        {
          title: "Command Center & Autonomy",
          items: [
            { text: "Command Center page (6-panel cockpit UI)", status: "completed" },
            { text: "Pipeline Pulse — status, last run, Run Now", status: "completed" },
            { text: "Queue Radar — pending/sent/need-letter counts", status: "completed" },
            { text: "Discovery Feed — new profiles, coverage %", status: "completed" },
            { text: "Sending Log — last 10 outreach events", status: "completed" },
            { text: "System Health — 7-point check (secrets, D1, KV)", status: "completed" },
            { text: "Master Switch — big toggle (default OFF / safe mode)", status: "completed" },
            { text: "Resend email sender + dry-run wrapper", status: "completed" },
            { text: "System health API endpoint", status: "completed" },
            { text: "Logs API endpoint", status: "completed" },
            { text: "Auto-send step in daily pipeline (gated by toggle)", status: "completed" },
            { text: "Set up real RESEND_API_KEY", status: "pending" },
            { text: "Add bounce/retry webhook for Resend delivery events", status: "pending" },
            { text: "Add daily summary email notification to admin", status: "pending" },
          ],
        },
        {
          title: "Analytics & Dashboard",
          items: [
            { text: "Live D1 stats on admin dashboard", status: "completed" },
            { text: "GA4 integration (script in layout + configurable ID)", status: "completed" },
            { text: "Activity / audit logging for admin actions", status: "pending" },
            { text: "Lead conversion tracking", status: "pending" },
          ],
        },
        {
          title: "Deployment & Operations",
          items: [
            { text: "Deploy Next.js to Cloudflare Workers", status: "completed" },
            { text: "Environment variables set in Cloudflare dashboard", status: "completed" },
            { text: "KV namespace + D1 database created", status: "completed" },
            { text: "D1 tables created via schema.sql", status: "completed" },
            { text: "Custom domain (lutterodt.org) configured", status: "completed" },
            { text: "HTTPS / SSL via Cloudflare", status: "completed" },
            { text: "CRON_SECRET set on Cloudflare", status: "completed" },
            { text: "RESEND_API_KEY set on Cloudflare", status: "completed" },
            { text: "R2 cache for OpenNext", status: "pending" },
            { text: "D1 backup strategy (export to R2)", status: "pending" },
            { text: "Error monitoring (Sentry or similar)", status: "pending" },
          ],
        },
        {
          title: "Family Research (via Outreach Pipeline)",
          items: [
            { text: "82 profiles discovered and documented (69 living + 8 historical + 5 auto-imported)", status: "completed" },
            { text: "Countries: Ghana, UK, USA, Canada, Germany, Denmark, China, UAE, Estonia, Mexico", status: "completed" },
            { text: "German Lutteroth branch — Johann Lutterodt (Estonia)", status: "completed" },
            { text: "Women who married out (nth-generation search via pipeline)", status: "in_progress" },
            { text: "Historical / Census gaps — Germany 1600s–1800s parish records", status: "in_progress" },
            { text: "Contemporary Ghana domestic — unlisted professionals across 16 regions", status: "in_progress" },
            { text: "Scandinavian / Nordic branch — Danish colonial records, Swedish Lutteroths", status: "pending" },
            { text: "Sports & Entertainment — athletes, musicians, actors", status: "pending" },
            { text: "Younger generation — students & early-career professionals (LinkedIn)", status: "in_progress" },
            { text: "The Netherlands presence — Dutch Lutterodt descendants", status: "pending" },
            { text: "African diaspora beyond Ghana — Nigeria, Liberia, Sierra Leone, Gambia", status: "pending" },
            { text: "Obituaries & death notices — GhanaWeb, MyJoyOnline, Modern Ghana archives", status: "pending" },
          ],
        },
      ],
      deliverables: [
        "Cloudflare KV + D1 backend",
        "Public website (full site + coming soon)",
        "Admin CMS (12 pages, all built)",
        "HMAC-signed cookie authentication",
        "Family directory (82 profiles, 7 countries)",
        "Outreach pipeline (auto-discover, queue, schedule)",
        "Command Center (6-panel cockpit with safe mode)",
        "GitHub Actions cron (08:00 UTC daily)",
        "GA4 analytics integration",
        "Production deployment at lutterodt.org",
      ],
    },
    {
      num: "02",
      title: "The Family Network",
      subtitle: "Phase 2 — Community (In Progress)",
      goal: "Wiring the admin CRUD pages to live APIs, completing missing public pages, and enabling email outreach.",
      status: "in_progress",
      sections: [
        {
          title: "Admin CRUD — Wire to Live APIs",
          items: [
            { text: "Wire Articles admin to D1-backed API", status: "pending" },
            { text: "Wire Timeline admin to D1-backed API", status: "pending" },
            { text: "Wire Gallery admin to D1-backed API + file upload", status: "pending" },
            { text: "Wire Contacts admin to live leads + contact form data", status: "pending" },
            { text: "Create Events management API + admin UI", status: "pending" },
            { text: "Create Media Library for uploaded assets", status: "pending" },
          ],
        },
        {
          title: "Missing Public Pages",
          items: [
            { text: "Create /verify page (linked from directory profile cards)", status: "pending" },
            { text: "Create public interactive timeline", status: "pending" },
            { text: "Create Family Stories / News (public feed)", status: "pending" },
            { text: "Create Events page (public)", status: "pending" },
            { text: "Create Family Tree viewer (read-only)", status: "pending" },
            { text: "Add sitemap.xml and robots.txt", status: "pending" },
            { text: "Add social sharing metadata to all pages", status: "pending" },
          ],
        },
        {
          title: "Email Outreach (Go Live)",
          items: [
            { text: "Replace placeholder RESEND_API_KEY with real key", status: "pending" },
            { text: "Add bounce/retry webhook for Resend delivery events", status: "pending" },
            { text: "Add daily summary email notification to admin", status: "pending" },
            { text: "Test send flow end-to-end (queue → send → delivery)", status: "pending" },
            { text: "Activate autonomous mode (Master Switch ON)", status: "pending" },
          ],
        },
        {
          title: "Directory Enhancements",
          items: [
            { text: "Add contact_email field to outreach_profiles (for sending)", status: "completed" },
            { text: "Add letter_status tracking (none → new → queued → sent)", status: "completed" },
            { text: "Add advanced search (surname, branch, city)", status: "pending" },
            { text: "Add profile photo / avatar support", status: "pending" },
            { text: "Add family branch tagging", status: "pending" },
          ],
        },
        {
          title: "Member Features",
          items: [
            { text: "Member registration / self-claim profile", status: "pending" },
            { text: "Member dashboard — biography, education, career", status: "pending" },
            { text: "Private messaging between members", status: "pending" },
            { text: "Family calendar (birthdays, anniversaries, reunions)", status: "pending" },
            { text: "Announcements & notifications", status: "pending" },
          ],
        },
        {
          title: "Event System",
          items: [
            { text: "RSVP, tickets, attendance tracking", status: "pending" },
            { text: "Livestream & photo uploads", status: "pending" },
          ],
        },
        {
          title: "Mentorship & Business",
          items: [
            { text: "Mentorship matching (elders → youth)", status: "pending" },
            { text: "Business directory (family-owned businesses)", status: "pending" },
          ],
        },
      ],
    },
    {
      num: "03",
      title: "Legacy Intelligence",
      subtitle: "Phase 3 — AI & Archives",
      goal: "AI-powered history and genealogy — photo restoration, natural language Q&A, automated storytelling.",
      status: "pending",
      sections: [
        {
          title: "AI Historian",
          items: [
            { text: "Natural language Q&A about family history", status: "pending" },
            { text: "RAG pipeline over family documents + profile data", status: "pending" },
          ],
        },
        {
          title: "AI Archive",
          items: [
            { text: "Upload photos, letters, newspapers — AI extracts names, dates, locations", status: "pending" },
          ],
        },
        {
          title: "AI Storytelling",
          items: [
            { text: "Upload old photo → AI restores → adds context → produces article", status: "pending" },
          ],
        },
        {
          title: "Interactive Family Map",
          items: [
            { text: "Geographic view of family members worldwide", status: "pending" },
          ],
        },
        {
          title: "Genealogy Engine",
          items: [
            { text: "Visual relationship explorer (You → Parents → Grandparents → Entire branch)", status: "pending" },
          ],
        },
        {
          title: "Heritage Vault",
          items: [
            { text: "Secure archive for wills, constitutions, historic records", status: "pending" },
          ],
        },
      ],
    },
    {
      num: "04",
      title: "Global Renaissance",
      subtitle: "Phase 4 — Institution",
      goal: "Become an institution — academy, foundation, digital museum, and annual congress.",
      status: "pending",
      sections: [
        {
          title: "Family Academy",
          items: [
            { text: "Courses: leadership, entrepreneurship, family history", status: "pending" },
            { text: "Certificates", status: "pending" },
          ],
        },
        {
          title: "Scholarship Portal",
          items: [
            { text: "Applications, review, awards, reporting", status: "pending" },
          ],
        },
        {
          title: "Foundation",
          items: [
            { text: "Projects, donations, transparency dashboards", status: "pending" },
          ],
        },
        {
          title: "Digital Museum",
          items: [
            { text: "3D galleries, immersive storytelling, VR-ready architecture", status: "pending" },
          ],
        },
        {
          title: "Annual Congress Platform",
          items: [
            { text: "Registration, voting, agenda, streaming, minutes, awards", status: "pending" },
          ],
        },
        {
          title: "Research Centre",
          items: [
            { text: "Academic publications, journals, oral history collections", status: "pending" },
          ],
        },
        {
          title: "AI Family Assistant",
          items: [
            { text: "Personalised greetings, updates, and heritage discoveries", status: "pending" },
          ],
        },
      ],
    },
  ],
  sprints: [
    { sprint: "Sprint 1", focus: "Branding, UI system, design language", status: "completed" },
    { sprint: "Sprint 2", focus: "Cloudflare KV + D1 — namespaces, schema, bindings", status: "completed" },
    { sprint: "Sprint 3", focus: "Coming soon page + lead capture + HMAC auth", status: "completed" },
    { sprint: "Sprint 4", focus: "Admin dashboard with live stats + GA4 analytics", status: "completed" },
    { sprint: "Sprint 5", focus: "Admin CMS pages — Articles, Timeline, Gallery, Contacts (UI)", status: "completed" },
    { sprint: "Sprint 6", focus: "Admin pages — Budget, Strategy, Prelaunch, Roadmap, Settings", status: "completed" },
    { sprint: "Sprint 7", focus: "Family directory — 77 profiles, SSG pages, search/filter, sponsorship", status: "completed" },
    { sprint: "Sprint 8", focus: "Public pages — About, History, Gallery, Contact, legal pages", status: "completed" },
    { sprint: "Sprint 9", focus: "Auth hardening — cookie fallback for Workers edge, Settings 401 fix", status: "completed" },
    { sprint: "Sprint 10", focus: "Production deployment — custom domain, SSL, env vars, KV/D1 creation", status: "completed" },
    { sprint: "Sprint 11", focus: "Outreach pipeline — DDG search, dedup, auto-import, letter generation", status: "completed" },
    { sprint: "Sprint 12", focus: "Queue management + Scheduler calendar UI + reschedule/remove", status: "completed" },
    { sprint: "Sprint 13", focus: "Command Center — 6-panel cockpit, health checks, logs endpoint", status: "completed" },
    { sprint: "Sprint 14", focus: "Autonomous system — email utility, send endpoint, Master Switch toggle", status: "completed" },
    { sprint: "Sprint 15", focus: "GitHub Actions cron + CRON_SECRET + daily pipeline auto-send", status: "completed" },
    { sprint: "Sprint 16", focus: "Wire admin CRUD pages to live D1 APIs (Articles, Timeline, Gallery)", status: "pending" },
    { sprint: "Sprint 17", focus: "Missing public pages — /verify, interactive timeline, Events, Family Tree", status: "pending" },
    { sprint: "Sprint 18", focus: "Email go-live — real RESEND_API_KEY, bounce webhook, daily summary", status: "pending" },
    { sprint: "Sprint 19", focus: "SEO polish — sitemap, robots.txt, OG images, social sharing", status: "pending" },
    { sprint: "Sprint 20", focus: "Error monitoring (Sentry) + D1 backup (R2) + Workers limit review", status: "pending" },
  ],
};
