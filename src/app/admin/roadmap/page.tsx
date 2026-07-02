"use client";

const phases = [
  {
    num: "01",
    title: "Foundation (MVP)",
    subtitle: "Phase 1 — 8–12 Weeks",
    goal: "Create a beautiful, trustworthy digital home that introduces the vision and begins preserving family history.",
    sections: [
      { title: "Backend & Database (Supabase)", items: ["Create Supabase project (PostgreSQL database)", "Define schema: users, roles, articles, timeline_events, gallery_items, albums, media_assets, contacts, join_requests, pages, settings, audit_logs", "Set up Supabase Auth (email/password, magic links, Google Sign-In)", "Configure storage buckets: photos, videos, documents, audio, portraits, timeline", "Enable Row-Level Security (RLS) policies for data protection", "Environment configuration — project URL, anon key, service role key"] },
      { title: "Public Website", items: ["Homepage — cinematic hero, mission, values, timeline preview, featured ancestors, news, CTA", "About — The Renaissance, why now, objectives, governance", "History — interactive timeline (1700 → today)", "Family Tree (read-only) — search, zoom, relationship navigation", "Legacy Gallery — photos, documents, historic newspapers, videos", "Family Stories — blog, articles, oral histories", "Contact — membership enquiry, volunteer, donations"] },
      { title: "Authentication", items: ["Login / Register / Forgot Password"] },
      { title: "Admin CMS", items: ["Dashboard overview", "Manage: articles, photos, members, events, timeline entries"] },
    ],
    deliverables: ["Supabase backend (database, auth, storage, RLS)", "Public website (Next.js + Tailwind)", "Admin CMS dashboard", "Authentication (email, magic links, RBAC)", "Interactive timeline", "Legacy gallery", "Family Tree Viewer (read-only)", "Contact & join forms"],
  },
  {
    num: "02",
    title: "The Family Network",
    subtitle: "Phase 2 — Community",
    goal: "Now the website becomes alive.",
    sections: [
      { title: "Member Dashboard", items: ["Profile with biography, education, career, projects, businesses", "Family branch, skills, location, interests, photos"] },
      { title: "Family Directory", items: ["Search by surname, branch, profession, country, city, school, interests"] },
      { title: "Messaging", items: ["Private messaging", "Announcements", "Notifications"] },
      { title: "Family Calendar", items: ["Birthdays", "Anniversaries", "Meetings", "Reunions", "Events"] },
      { title: "Event System", items: ["RSVP", "Tickets", "Attendance", "Livestream", "Photo uploads"] },
      { title: "Mentorship", items: ["Young members connect with lawyers, doctors, entrepreneurs, engineers, academics"] },
      { title: "Business Directory", items: ["Family-owned businesses", "Investment opportunities", "Professional services"] },
    ],
  },
  {
    num: "03",
    title: "Legacy Intelligence",
    subtitle: "Phase 3 — AI & Archives",
    goal: "This is where the platform becomes unique.",
    sections: [
      { title: "AI Historian", items: ["Ask questions: 'Who founded this branch?', 'How am I related to...', 'Show all educators'"] },
      { title: "AI Archive", items: ["Upload photos, letters, books, newspapers", "AI extracts names, dates, locations, events, relationships"] },
      { title: "AI Storytelling", items: ["Upload old photo → AI restores → adds context → produces article → narrates video"] },
      { title: "Interactive Family Map", items: ["Click Accra, London, New York, Cape Coast, Toronto", "See who lives there, family businesses, historic homes"] },
      { title: "Genealogy Engine", items: ["Visual relationship explorer: You → Parents → Grandparents → Great-grandparents → Entire branch"] },
      { title: "Heritage Vault", items: ["Secure archive: family constitution, wills, historic records, private collections"] },
    ],
  },
  {
    num: "04",
    title: "Global Renaissance",
    subtitle: "Phase 4 — Institution",
    goal: "Now it becomes an institution.",
    sections: [
      { title: "Family Academy", items: ["Courses: leadership, entrepreneurship, family history, AI literacy, financial literacy", "Certificates"] },
      { title: "Scholarship Portal", items: ["Applications", "Review", "Awards", "Reporting"] },
      { title: "Foundation", items: ["Projects", "Donations", "Transparency", "Impact dashboards"] },
      { title: "Digital Museum", items: ["Immersive storytelling", "3D galleries", "Historic homes", "Interactive exhibits", "VR-ready architecture"] },
      { title: "Annual Congress Platform", items: ["Registration", "Voting", "Agenda", "Streaming", "Minutes", "Awards"] },
      { title: "Research Centre", items: ["Academic publications", "Family journals", "Books", "Oral history collections", "Research requests"] },
      { title: "AI Family Assistant", items: ['"Hello Nana, welcome back. Two cousins graduated today. Your branch reunion is in three weeks. Your grandfather appears in this newly digitized newspaper."'] },
    ],
  },
];

const sprints = [
  { sprint: "Sprint 1", focus: "Supabase project setup — database schema, auth, storage, RLS" },
  { sprint: "Sprint 2", focus: "Branding, UI system, design language" },
  { sprint: "Sprint 3", focus: "Public website and CMS" },
  { sprint: "Sprint 4", focus: "Authentication and member profiles" },
  { sprint: "Sprint 5", focus: "Interactive family tree and timeline" },
  { sprint: "Sprint 6", focus: "Archive, gallery, and document management" },
  { sprint: "Sprint 7", focus: "Events, messaging, and community tools" },
  { sprint: "Sprint 8", focus: "AI historian and intelligent search" },
  { sprint: "Sprint 9", focus: "Business directory, mentorship, and philanthropy" },
  { sprint: "Sprint 10", focus: "Digital museum and immersive experiences" },
  { sprint: "Sprint 11", focus: "Performance, accessibility, security, and production launch" },
];

export default function AdminRoadmapPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-burgundy-ink">Build Roadmap</h1>
          <p className="text-charcoal/50 text-[14px] mt-1">The Lutterodt Renaissance — Product Build Roadmap v1.0</p>
        </div>
        <div className="flex gap-3">
          <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-2 bg-forest/10 text-forest border border-forest/20">Phase 1: In Progress</span>
        </div>
      </div>

      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-0 border border-line mb-10">
        {[
          { phase: "Phase 1", label: "Foundation", color: "bg-burgundy text-ivory" },
          { phase: "Phase 2", label: "Community", color: "bg-gold text-burgundy-ink" },
          { phase: "Phase 3", label: "Legacy Intelligence", color: "bg-forest text-ivory" },
          { phase: "Phase 4", label: "Global Renaissance", color: "bg-charcoal text-ivory" },
        ].map((p, i) => (
          <div key={i} className="p-5 text-center border-r border-line last:border-r-0 max-md:border-r-0 max-md:border-b max-md:last:border-b-0">
            <div className={`inline-block font-mono text-[9px] tracking-widest uppercase px-3 py-1 ${p.color} mb-2`}>{p.phase}</div>
            <div className="font-display text-[18px] text-burgundy-ink">{p.label}</div>
          </div>
        ))}
      </div>

      {phases.map((phase) => (
        <div key={phase.num} className="mb-10 border border-line bg-ivory">
          <div className="px-6 py-5 border-b border-line flex items-center gap-4">
            <span className="font-mono text-[28px] font-[500] text-gold-dim/30">{phase.num}</span>
            <div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">{phase.subtitle}</span>
              <h2 className="font-display text-[20px] text-burgundy-ink">{phase.title}</h2>
              <p className="text-charcoal/50 text-[13px] mt-0.5">{phase.goal}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {phase.sections.map((section, si) => (
              <div key={si}>
                <h3 className="font-display text-[15px] text-burgundy mb-3 flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-gold inline-block" />
                  {section.title}
                </h3>
                <ul className="grid grid-cols-2 max-md:grid-cols-1 gap-x-8 gap-y-1.5">
                  {section.items.map((item, ii) => (
                    <li key={ii} className="text-charcoal/60 text-[13.5px] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {phase.deliverables && (
            <div className="px-6 py-4 border-t border-line bg-ivory-dim/50">
              <h4 className="font-mono text-[10px] tracking-widest uppercase text-gold-dim mb-2">Deliverables</h4>
              <div className="flex flex-wrap gap-2">
                {phase.deliverables.map((d, i) => (
                  <span key={i} className="font-mono text-[9.5px] tracking-wider uppercase px-2.5 py-1 bg-forest/5 text-forest border border-forest/10">{d}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Sprints */}
      <div className="border border-line bg-ivory">
        <div className="px-6 py-4 border-b border-line">
          <h2 className="font-display text-[16px] text-burgundy-ink">Development Sprints</h2>
        </div>
        <div className="divide-y divide-line">
          {sprints.map((s, i) => (
            <div key={i} className="px-6 py-3 flex items-center gap-4">
              <span className="font-mono text-[10px] tracking-widest text-gold-dim w-[80px] shrink-0">{s.sprint}</span>
              <div className="h-[1px] flex-1 bg-line" />
              <span className="text-charcoal/60 text-[13.5px]">{s.focus}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
