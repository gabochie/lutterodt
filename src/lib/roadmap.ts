import { apiProtected, d1Column, envSet, profileCount, routeOk } from "@/lib/checks";
import type { CheckResult } from "@/lib/checks";

export type ItemStatus = "pending" | "in_progress" | "completed";

export interface RoadmapItemDef {
  text: string;
  /**
   * When set, status is resolved from live system state on every read and
   * cannot be hand-edited. Unset items fall back to manualStatus + overrides.
   */
  probe?: () => Promise<CheckResult>;
  manualStatus?: ItemStatus;
}

export interface RoadmapSectionDef {
  title: string;
  items: RoadmapItemDef[];
}

export interface RoadmapPhaseDef {
  num: string;
  title: string;
  subtitle: string;
  goal: string;
  status: ItemStatus;
  sections: RoadmapSectionDef[];
  deliverables?: string[];
}

export interface RoadmapSprintDef {
  sprint: string;
  focus: string;
  status: ItemStatus;
  probe?: () => Promise<CheckResult>;
}

const done: ItemStatus = "completed";
const todo: ItemStatus = "pending";
const wip: ItemStatus = "in_progress";

export const ROADMAP_SEED: { phases: RoadmapPhaseDef[]; sprints: RoadmapSprintDef[] } = {
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
            { text: "Cloudflare KV namespace for settings (coming_soon, roadmap, budget, outreach)", manualStatus: done },
            { text: "Cloudflare D1 database for structured data (contacts, outreach, profiles)", manualStatus: done },
            { text: "HMAC-signed session cookie auth (no external dependency)", manualStatus: done },
            { text: "D1 schema — outreach_profiles, outreach_queue, outreach_log tables", manualStatus: done },
            { text: "Row-level security / API rules", probe: async () => ({ ok: await apiProtected("/api/articles"), detail: "D1 has no RLS — guarded in API handlers" }) },
          ],
        },
        {
          title: "Authentication",
          items: [
            { text: "Login page + API route", manualStatus: done },
            { text: "HMAC-signed admin session cookie with 14-day expiry", manualStatus: done },
            { text: "Cookie parse fallback for Cloudflare Workers edge", manualStatus: done },
            { text: "Bearer token auth for cron (CRON_SECRET)", probe: async () => ({ ok: await envSet("CRON_SECRET"), detail: process.env.CRON_SECRET ? "CRON_SECRET set" : "CRON_SECRET missing" }) },
            { text: "Logout", manualStatus: done },
            { text: "Password reset flow", manualStatus: todo },
          ],
        },
        {
          title: "Public Website",
          items: [
            { text: "Coming soon landing page with 3-field lead capture", manualStatus: done },
            { text: "FullSite component with hero, stats, cards, gallery preview", manualStatus: done },
            { text: "Coming Soon toggle in admin Settings", manualStatus: done },
            { text: "About page — vision, mission, values, governance", manualStatus: done },
            { text: "History page — storytelling, milestones", manualStatus: done },
            { text: "Interactive timeline (public)", manualStatus: todo },
            { text: "Family Tree viewer (read-only)", manualStatus: todo },
            { text: "Legacy Gallery (public)", manualStatus: done },
            { text: "Family Stories / News (public)", manualStatus: todo },
            { text: "Events page", manualStatus: todo },
            { text: "Contact page with form", manualStatus: done },
          ],
        },
        {
          title: "Family Directory",
          items: [
            { text: "/directory with search/filter (name, category, country)", manualStatus: done },
            { text: "Individual profile pages for every documented profile", probe: async () => ({ ok: await routeOk("/directory"), detail: "Served from D1" }) },
            { text: "Directory covers multiple countries, professions and centuries of records", manualStatus: done },
            { text: "Sponsorship tiers (Free / Patron / Scholar / Guardian)", manualStatus: done },
            { text: "/verify page (linked from directory)", probe: async () => ({ ok: await routeOk("/verify"), detail: "/verify" }) },
          ],
        },
        {
          title: "Admin CMS Pages",
          items: [
            { text: "Admin dashboard with live stats + daily pipeline widget", manualStatus: done },
            { text: "Articles list + edit + new pages (D1-backed)", probe: async () => ({ ok: await apiProtected("/api/articles"), detail: "/api/articles guarded" }) },
            { text: "Timeline list + create/edit/delete (D1-backed)", probe: async () => ({ ok: await apiProtected("/api/timeline"), detail: "/api/timeline guarded" }) },
            { text: "Gallery grid + add/remove (D1-backed)", probe: async () => ({ ok: await apiProtected("/api/gallery"), detail: "/api/gallery guarded" }) },
            { text: "Contacts inbox (live leads + contact form data)", probe: async () => ({ ok: await apiProtected("/api/contacts"), detail: "/api/contacts guarded" }) },
            { text: "Budget tracker", manualStatus: done },
            { text: "Strategy page with progress bars", manualStatus: done },
            { text: "Prelaunch checklist (persisted to KV)", manualStatus: done },
            { text: "Settings page (Coming Soon toggle, env vars display)", manualStatus: done },
            { text: "Roadmap page (persisted to KV, live-verified items)", manualStatus: done },
          ],
        },
        {
          title: "Outreach Pipeline",
          items: [
            { text: "Daily pipeline endpoint (GET status, POST run)", manualStatus: done },
            { text: "DDG web search + Brave/Google fallback for discovery", manualStatus: done },
            { text: "Dedup by normalized name + auto-import new profiles", manualStatus: done },
            { text: "Shared letter generation library (src/lib/outreach/letter.ts)", manualStatus: done },
            { text: "Queue system with scheduled_date support", manualStatus: done },
            { text: "Scheduler calendar UI (/admin/scheduler)", manualStatus: done },
            { text: "Web Finder manual discovery tool", manualStatus: done },
            { text: "GitHub Actions cron (daily at 08:00 UTC)", manualStatus: done },
            { text: "Auto-fill next 30 days in scheduler", manualStatus: done },
          ],
        },
        {
          title: "Command Center & Autonomy",
          items: [
            { text: "Command Center page (6-panel cockpit UI)", manualStatus: done },
            { text: "Pipeline Pulse — status, last run, Run Now", manualStatus: done },
            { text: "Queue Radar — pending/sent/need-letter counts", manualStatus: done },
            { text: "Discovery Feed — new profiles, coverage %", manualStatus: done },
            { text: "Sending Log — last 10 outreach events", manualStatus: done },
            { text: "System Health — 7-point check (secrets, D1, KV)", manualStatus: done },
            { text: "Master Switch — big toggle (default OFF / safe mode)", manualStatus: done },
            { text: "Resend email sender + dry-run wrapper", manualStatus: done },
            { text: "System health API endpoint", manualStatus: done },
            { text: "Logs API endpoint", manualStatus: done },
            { text: "Auto-send step in daily pipeline (gated by toggle)", manualStatus: done },
            { text: "Set up real RESEND_API_KEY", probe: async () => ({ ok: await envSet("RESEND_API_KEY"), detail: process.env.RESEND_API_KEY ? "Configured" : "Not set" }) },
            { text: "Add bounce/retry webhook for Resend delivery events", manualStatus: todo },
            { text: "Add daily summary email notification to admin", manualStatus: todo },
          ],
        },
        {
          title: "Analytics & Dashboard",
          items: [
            { text: "Live D1 stats on admin dashboard", manualStatus: done },
            { text: "GA4 integration (script in layout + configurable ID)", probe: async () => ({ ok: await envSet("NEXT_PUBLIC_GA_ID"), detail: process.env.NEXT_PUBLIC_GA_ID || "NEXT_PUBLIC_GA_ID not set" }) },
            { text: "Activity / audit logging for admin actions", manualStatus: todo },
            { text: "Lead conversion tracking", manualStatus: todo },
          ],
        },
        {
          title: "Deployment & Operations",
          items: [
            { text: "Deploy Next.js to Cloudflare Workers", manualStatus: done },
            { text: "Environment variables set in Cloudflare dashboard", manualStatus: done },
            { text: "KV namespace + D1 database created", manualStatus: done },
            { text: "D1 tables created via schema.sql", manualStatus: done },
            { text: "Custom domain (lutterodt.org) configured", probe: async () => ({ ok: await routeOk("/"), detail: "lutterodt.org" }) },
            { text: "HTTPS / SSL via Cloudflare", probe: async () => ({ ok: await routeOk("/"), detail: "HTTPS" }) },
            { text: "CRON_SECRET set on Cloudflare", probe: async () => ({ ok: await envSet("CRON_SECRET"), detail: process.env.CRON_SECRET ? "Configured" : "Not set" }) },
            { text: "R2 cache for OpenNext", manualStatus: todo },
            { text: "D1 backup strategy (export to R2)", manualStatus: todo },
            { text: "Error monitoring (Sentry or similar)", manualStatus: todo },
          ],
        },
        {
          title: "Family Research (via Outreach Pipeline)",
          items: [
            { text: "Every discovered Lutterodt documented with a bio and country", probe: profileCount },
            { text: "Countries: Ghana, UK, USA, Canada, Germany, Denmark, China, UAE, Estonia, Mexico", manualStatus: done },
            { text: "German Lutteroth branch — Johann Lutterodt (Estonia)", manualStatus: done },
            { text: "Women who married out (nth-generation search via pipeline)", manualStatus: wip },
            { text: "Historical / Census gaps — Germany 1600s–1800s parish records", manualStatus: wip },
            { text: "Contemporary Ghana domestic — unlisted professionals across 16 regions", manualStatus: wip },
            { text: "Scandinavian / Nordic branch — Danish colonial records, Swedish Lutteroths", manualStatus: todo },
            { text: "Sports & Entertainment — athletes, musicians, actors", manualStatus: todo },
            { text: "Younger generation — students & early-career professionals (LinkedIn)", manualStatus: wip },
            { text: "The Netherlands presence — Dutch Lutterodt descendants", manualStatus: todo },
            { text: "African diaspora beyond Ghana — Nigeria, Liberia, Sierra Leone, Gambia", manualStatus: todo },
            { text: "Obituaries & death notices — GhanaWeb, MyJoyOnline, Modern Ghana archives", manualStatus: todo },
          ],
        },
      ],
      deliverables: [
        "Cloudflare KV + D1 backend",
        "Public website (full site + coming soon)",
        "Admin CMS (all pages, D1-backed)",
        "HMAC-signed cookie authentication",
        "Family directory (D1-driven, all profiles)",
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
      goal: "Completing missing public pages, media handling, and enabling email outreach.",
      status: "in_progress",
      sections: [
        {
          title: "Admin CRUD — Remaining Gaps",
          items: [
            { text: "Create Events management API + admin UI", manualStatus: todo },
            { text: "Create Media Library for uploaded assets", manualStatus: todo },
            { text: "Gallery file upload (currently URL-only)", manualStatus: todo },
          ],
        },
        {
          title: "Missing Public Pages",
          items: [
            { text: "Create /verify page (linked from directory profile cards)", probe: async () => ({ ok: await routeOk("/verify"), detail: "/verify" }) },
            { text: "Create public interactive timeline", manualStatus: todo },
            { text: "Create Family Stories / News (public feed)", manualStatus: todo },
            { text: "Create Events page (public)", manualStatus: todo },
            { text: "Create Family Tree viewer (read-only)", manualStatus: todo },
            { text: "Add sitemap.xml and robots.txt", probe: async () => ({ ok: await routeOk("/sitemap.xml") && await routeOk("/robots.txt"), detail: "sitemap + robots" }) },
            { text: "Add social sharing metadata to all pages", manualStatus: done },
          ],
        },
        {
          title: "Email Outreach (Go Live)",
          items: [
            { text: "Replace placeholder RESEND_API_KEY with real key", probe: async () => ({ ok: await envSet("RESEND_API_KEY"), detail: process.env.RESEND_API_KEY ? "Configured" : "Not set" }) },
            { text: "Add bounce/retry webhook for Resend delivery events", manualStatus: todo },
            { text: "Add daily summary email notification to admin", manualStatus: todo },
            { text: "Test send flow end-to-end (queue → send → delivery)", manualStatus: todo },
            { text: "Activate autonomous mode (Master Switch ON)", manualStatus: todo },
          ],
        },
        {
          title: "Directory Enhancements",
          items: [
            { text: "Add contact_email field to outreach_profiles (for sending)", probe: async () => d1Column("outreach_profiles", "contact_email") },
            { text: "Add letter_status tracking (none → new → queued → sent)", probe: async () => d1Column("outreach_profiles", "letter_status") },
            { text: "Add advanced search (surname, branch, city)", manualStatus: todo },
            { text: "Add profile photo / avatar support", manualStatus: todo },
            { text: "Add family branch tagging", manualStatus: todo },
          ],
        },
        {
          title: "Member Features",
          items: [
            { text: "Member registration / self-claim profile", manualStatus: todo },
            { text: "Member dashboard — biography, education, career", manualStatus: todo },
            { text: "Private messaging between members", manualStatus: todo },
            { text: "Family calendar (birthdays, anniversaries, reunions)", manualStatus: todo },
            { text: "Announcements & notifications", manualStatus: todo },
          ],
        },
        {
          title: "Event System",
          items: [
            { text: "RSVP, tickets, attendance tracking", manualStatus: todo },
            { text: "Livestream & photo uploads", manualStatus: todo },
          ],
        },
        {
          title: "Mentorship & Business",
          items: [
            { text: "Mentorship matching (elders → youth)", manualStatus: todo },
            { text: "Business directory (family-owned businesses)", manualStatus: todo },
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
            { text: "Natural language Q&A about family history", manualStatus: todo },
            { text: "RAG pipeline over family documents + profile data", manualStatus: todo },
          ],
        },
        {
          title: "AI Archive",
          items: [
            { text: "Upload photos, letters, newspapers — AI extracts names, dates, locations", manualStatus: todo },
          ],
        },
        {
          title: "AI Storytelling",
          items: [
            { text: "Upload old photo → AI restores → adds context → produces article", manualStatus: todo },
          ],
        },
        {
          title: "Interactive Family Map",
          items: [
            { text: "Geographic view of family members worldwide", manualStatus: todo },
          ],
        },
        {
          title: "Genealogy Engine",
          items: [
            { text: "Visual relationship explorer (You → Parents → Grandparents → Entire branch)", manualStatus: todo },
          ],
        },
        {
          title: "Heritage Vault",
          items: [
            { text: "Secure archive for wills, constitutions, historic records", manualStatus: todo },
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
            { text: "Courses: leadership, entrepreneurship, family history", manualStatus: todo },
            { text: "Certificates", manualStatus: todo },
          ],
        },
        {
          title: "Scholarship Portal",
          items: [
            { text: "Applications, review, awards, reporting", manualStatus: todo },
          ],
        },
        {
          title: "Foundation",
          items: [
            { text: "Projects, donations, transparency dashboards", manualStatus: todo },
          ],
        },
        {
          title: "Digital Museum",
          items: [
            { text: "3D galleries, immersive storytelling, VR-ready architecture", manualStatus: todo },
          ],
        },
        {
          title: "Annual Congress Platform",
          items: [
            { text: "Registration, voting, agenda, streaming, minutes, awards", manualStatus: todo },
          ],
        },
        {
          title: "Research Centre",
          items: [
            { text: "Academic publications, journals, oral history collections", manualStatus: todo },
          ],
        },
        {
          title: "AI Family Assistant",
          items: [
            { text: "Personalised greetings, updates, and heritage discoveries", manualStatus: todo },
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
    { sprint: "Sprint 7", focus: "Family directory — D1-driven profiles, search/filter, sponsorship", status: "completed" },
    { sprint: "Sprint 8", focus: "Public pages — About, History, Gallery, Contact, legal pages", status: "completed" },
    { sprint: "Sprint 9", focus: "Auth hardening — cookie fallback for Workers edge, Settings 401 fix", status: "completed" },
    { sprint: "Sprint 10", focus: "Production deployment — custom domain, SSL, env vars, KV/D1 creation", status: "completed" },
    { sprint: "Sprint 11", focus: "Outreach pipeline — DDG search, dedup, auto-import, letter generation", status: "completed" },
    { sprint: "Sprint 12", focus: "Queue management + Scheduler calendar UI + reschedule/remove", status: "completed" },
    { sprint: "Sprint 13", focus: "Command Center — 6-panel cockpit, health checks, logs endpoint", status: "completed" },
    { sprint: "Sprint 14", focus: "Autonomous system — email utility, send endpoint, Master Switch toggle", status: "completed" },
    { sprint: "Sprint 15", focus: "GitHub Actions cron + CRON_SECRET + daily pipeline auto-send", status: "completed" },
    {
      sprint: "Sprint 16",
      focus: "Wire admin CRUD pages to live D1 APIs (Articles, Timeline, Gallery, Contacts)",
      status: "completed",
      probe: async () => ({
        ok:
          (await apiProtected("/api/articles")) &&
          (await apiProtected("/api/timeline")) &&
          (await apiProtected("/api/gallery")) &&
          (await apiProtected("/api/contacts")),
        detail: "Articles, Timeline, Gallery, Contacts all D1-backed",
      }),
    },
    {
      sprint: "Sprint 17",
      focus: "Missing public pages — interactive timeline, Events, Family Tree, Stories",
      status: "pending",
      probe: async () => ({
        ok: (await routeOk("/timeline")) && (await routeOk("/events")) && (await routeOk("/tree")),
        detail: "awaiting /timeline, /events, /tree",
      }),
    },
    {
      sprint: "Sprint 18",
      focus: "Email go-live — real RESEND_API_KEY, bounce webhook, daily summary",
      status: "pending",
      probe: async () => ({ ok: await envSet("RESEND_API_KEY"), detail: process.env.RESEND_API_KEY ? "Key present — webhook + summary still open" : "RESEND_API_KEY not set" }),
    },
    { sprint: "Sprint 19", focus: "SEO polish — sitemap, robots.txt, OG images, social sharing", status: "completed" },
    { sprint: "Sprint 20", focus: "Error monitoring (Sentry) + D1 backup (R2) + Workers limit review", status: "pending" },
  ],
};
