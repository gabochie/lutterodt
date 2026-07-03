import { NextResponse, NextRequest } from "next/server";
import { getSetting, setSetting } from "@/lib/pocketbase/settings";

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
  const authCookie = request.cookies.get("pb_auth");
  if (!authCookie) {
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
      subtitle: "Phase 1 — 8–12 Weeks",
      goal: "Create a beautiful, trustworthy digital home that introduces the vision and begins preserving family history.",
      status: "in_progress",
      sections: [
        {
          title: "Backend & Database (PocketBase)",
          items: [
            { text: "PocketBase server setup (v0.39.5)", status: "completed" },
            { text: "Create collections: users, articles, timeline_events, gallery_items, contacts, settings", status: "completed" },
            { text: "Superuser auth for settings CRUD", status: "completed" },
            { text: "Storage buckets for media uploads", status: "pending" },
            { text: "Row-level security / API rules", status: "pending" },
          ],
        },
        {
          title: "Authentication",
          items: [
            { text: "Login page + API route", status: "completed" },
            { text: "Session cookie management (pb_auth)", status: "completed" },
            { text: "Route protection middleware (proxy)", status: "completed" },
            { text: "Logout", status: "completed" },
            { text: "Password reset flow", status: "pending" },
            { text: "Role-based access (admin / editor / contributor)", status: "pending" },
          ],
        },
        {
          title: "Public Website",
          items: [
            { text: "Coming soon landing page with lead capture", status: "completed" },
            { text: "FullSite component with hero, stats, cards, gallery preview", status: "completed" },
            { text: "Coming Soon toggle in admin Settings", status: "completed" },
            { text: "About page — vision, mission, values, governance", status: "pending" },
            { text: "History page — storytelling, milestones", status: "pending" },
            { text: "Interactive timeline (public)", status: "pending" },
            { text: "Family Tree viewer (read-only)", status: "pending" },
            { text: "Legacy Gallery (public)", status: "pending" },
            { text: "Family Stories / News (public)", status: "pending" },
            { text: "Events page", status: "pending" },
            { text: "Join / Contact page", status: "pending" },
          ],
        },
        {
          title: "Admin CMS — CRUD APIs & Wiring",
          items: [
            { text: "Articles CRUD API + wire list/new/edit to live data", status: "pending" },
            { text: "Timeline CRUD API + wire list/create/edit/delete", status: "pending" },
            { text: "Gallery CRUD API + file upload + wire grid", status: "pending" },
            { text: "Contacts API — live data from leads + contact form", status: "pending" },
            { text: "Events management — collection, admin CRUD", status: "pending" },
            { text: "Users / Members management — list, roles", status: "pending" },
            { text: "Media Library — uploaded assets browser", status: "pending" },
          ],
        },
        {
          title: "Analytics & Dashboard",
          items: [
            { text: "Live PocketBase stats on admin dashboard", status: "pending" },
            { text: "GA4 integration (placeholder script + configurable ID)", status: "pending" },
            { text: "Activity / audit logging for admin actions", status: "pending" },
            { text: "Lead conversion tracking", status: "pending" },
          ],
        },
        {
          title: "Deployment",
          items: [
            { text: "Deploy Next.js to Cloudflare Pages", status: "pending" },
            { text: "Host PocketBase on server / VPS", status: "pending" },
            { text: "Configure custom domain (lutterodt.org)", status: "pending" },
            { text: "HTTPS / SSL setup", status: "pending" },
            { text: "Backup strategy for PocketBase data", status: "pending" },
          ],
        },
      ],
      deliverables: [
        "PocketBase backend (database, auth, storage)",
        "Public website (coming soon + full site)",
        "Admin CMS dashboard with live stats",
        "Authentication (login, session, proxy)",
        "Articles / Timeline / Gallery CRUD",
        "Contact & lead management",
        "Events management",
        "Google Analytics integration",
        "Production deployment",
      ],
    },
    {
      num: "02",
      title: "The Family Network",
      subtitle: "Phase 2 — Community",
      goal: "Now the website becomes alive with member profiles, directories, and community tools.",
      status: "pending",
      sections: [
        {
          title: "Member Dashboard",
          items: [
            { text: "Profile — biography, education, career, projects", status: "pending" },
            { text: "Family branch, skills, location, interests, photos", status: "pending" },
          ],
        },
        {
          title: "Family Directory",
          items: [
            { text: "Search by surname, branch, profession, country, city", status: "pending" },
          ],
        },
        {
          title: "Messaging & Calendar",
          items: [
            { text: "Private messaging", status: "pending" },
            { text: "Announcements & notifications", status: "pending" },
            { text: "Family calendar (birthdays, anniversaries, reunions)", status: "pending" },
          ],
        },
        {
          title: "Event System",
          items: [
            { text: "RSVP, tickets, attendance", status: "pending" },
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
      goal: "This is where the platform becomes unique — AI-powered history and genealogy.",
      status: "pending",
      sections: [
        {
          title: "AI Historian",
          items: [
            { text: "Natural language Q&A about family history", status: "pending" },
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
      goal: "Now it becomes an institution — academy, foundation, digital museum.",
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
    { sprint: "Sprint 2", focus: "PocketBase backend — collections, auth, settings", status: "completed" },
    { sprint: "Sprint 3", focus: "Coming soon page + lead capture + proxy auth", status: "completed" },
    { sprint: "Sprint 4", focus: "Admin dashboard with live stats + analytics", status: "in_progress" },
    { sprint: "Sprint 5", focus: "Articles CRUD API + admin wiring", status: "pending" },
    { sprint: "Sprint 6", focus: "Timeline CRUD API + admin wiring", status: "pending" },
    { sprint: "Sprint 7", focus: "Gallery CRUD API + file upload + admin wiring", status: "pending" },
    { sprint: "Sprint 8", focus: "Contacts / leads live data + events management", status: "pending" },
    { sprint: "Sprint 9", focus: "Public pages — About, History, Timeline, Gallery, Stories", status: "pending" },
    { sprint: "Sprint 10", focus: "Public pages — Family Tree, Events, Join, Contact", status: "pending" },
    { sprint: "Sprint 11", focus: "Production deployment — Cloudflare, custom domain, SSL, backup", status: "pending" },
  ],
};
