"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FileText,
  Clock,
  Image,
  MessageSquare,
  Loader2,
  Search,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
} from "lucide-react";

const statConfig = [
  { label: "Articles", key: "articles", icon: FileText, color: "text-accent-text" },
  { label: "Timeline Entries", key: "timeline", icon: Clock, color: "text-gold-dim" },
  { label: "Gallery Items", key: "gallery", icon: Image, color: "text-success-text" },
  { label: "Contact Requests", key: "contacts", icon: MessageSquare, color: "text-accent-text" },
];

const recentArticles = [
  { title: "Auntie Comfort on the War Years", status: "Published", date: "28 Jun 2026", author: "Admin" },
  { title: "London Branch Marks 40 Years", status: "Published", date: "15 Jun 2026", author: "Admin" },
  { title: "Digitising the 1950s Ledgers", status: "Draft", date: "10 Jun 2026", author: "Admin" },
];

const recentContacts = [
  { name: "Dr. Kwame Lutterodt", subject: "Research Request", date: "Today", status: "New" },
  { name: "Grace Naa Lutterodt", subject: "Join Interest", date: "Yesterday", status: "Read" },
  { name: "BBC StoryWorks", subject: "Media Enquiry", date: "2 days ago", status: "New" },
];

type Stats = Record<string, number>;

interface DailyStatus {
  ok: boolean;
  today: { date: string; hasPendingLetter: boolean; pendingLetter: { id: number; profile_id: string; name: string; status: string } | null };
  stats: { totalProfiles: number; noLetter: number; pendingInQueue: number; totalSent: number };
}

interface DailyResult {
  ok: boolean;
  search: { total: number; new: number; duplicates: number; errors: number; source: string };
  today_letter: { id: number; profile_id: string; name: string; status: string; hasLetterHtml: boolean } | null;
  stats: { totalProfiles: number; noLetter: number; pendingInQueue: number; totalSent: number };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [daily, setDaily] = useState<DailyStatus | null>(null);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<DailyResult | null>(null);
  const [letterDetail, setLetterDetail] = useState<{ name: string; html: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/outreach/daily")
      .then((r) => r.json())
      .then((d) => { setDaily(d); setDailyLoading(false); })
      .catch(() => setDailyLoading(false));
  }, []);

  const fetchPendingLetter = useCallback(async (letterId: number) => {
    try {
      const r = await fetch("/api/outreach/queue?status=pending");
      const items: { id: number; name: string; letter_html: string }[] = await r.json();
      const match = items.find((i) => i.id === letterId);
      if (match) {
        setLetterDetail({ name: match.name, html: match.letter_html });
      }
    } catch { /* ignore */ }
  }, []);

  const runPipeline = useCallback(async () => {
    setRunning(true);
    setResult(null);
    setLetterDetail(null);
    try {
      const r = await fetch("/api/outreach/daily", { method: "POST" });
      const d: DailyResult = await r.json();
      setResult(d);
      setDaily({
        ok: true,
        today: { date: d.today_letter?.id ? new Date().toISOString().split("T")[0] : "", hasPendingLetter: !!d.today_letter, pendingLetter: d.today_letter ? { id: d.today_letter.id, profile_id: d.today_letter.profile_id, name: d.today_letter.name, status: d.today_letter.status } : null },
        stats: d.stats,
      });
      if (d.today_letter?.id) {
        fetchPendingLetter(d.today_letter.id);
      }
    } catch {
      setResult({ ok: false, search: { total: 0, new: 0, duplicates: 0, errors: 0, source: "" }, today_letter: null, stats: { totalProfiles: 0, noLetter: 0, pendingInQueue: 0, totalSent: 0 } });
    }
    setRunning(false);
  }, [fetchPendingLetter]);

  const copyLetter = useCallback(() => {
    if (letterDetail?.html) {
      navigator.clipboard.writeText(letterDetail.html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [letterDetail]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-heading">Dashboard</h1>
        <p className="text-fg/50 text-[14px] mt-1">Overview of the Lutterodt Renaissance Archive</p>
      </div>

      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4 mb-10">
        {statConfig.map((stat) => {
          const Icon = stat.icon;
          const value = stats ? stats[stat.key] : null;
          return (
            <div key={stat.label} className="bg-surface border border-line p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className="font-mono text-[10px] tracking-widest uppercase text-fg/40">{stat.label}</span>
              </div>
              <div className="font-display text-[32px] text-heading">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-fg/20" /> : value ?? "—"}
              </div>
              <div className="font-mono text-[10px] tracking-wider text-fg/40 mt-1">
                {loading ? "" : `Total records`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Pipeline Section */}
      <div className="bg-surface border border-line mb-6">
        <div className="px-6 py-4 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Send className="w-5 h-5 text-gold-dim" />
            <h2 className="font-display text-[16px] text-heading">Daily Outreach Pipeline</h2>
          </div>
          <div className="flex items-center gap-3">
            {daily && !dailyLoading && (
              <div className="font-mono text-[10px] text-fg/40">
                {daily.today.date} — {daily.stats.totalProfiles} profiles · {daily.stats.pendingInQueue} queued · {daily.stats.totalSent} sent
              </div>
            )}
            <button
              onClick={runPipeline}
              disabled={running}
              className="font-mono text-[11px] tracking-widest uppercase px-5 py-3 border border-gold-dim text-gold-dim hover:bg-gold-dim/5 transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {running ? "Running..." : "Run Daily Pipeline"}
            </button>
          </div>
        </div>

        <div className="p-6">
          {dailyLoading ? (
            <div className="flex items-center gap-2 text-fg/40 text-[13px]">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading pipeline status...
            </div>
          ) : (
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
              {/* Left: Today's Status & Controls */}
              <div>
                <div className="mb-4">
                  <div className="font-mono text-[10px] tracking-widest uppercase text-fg/40 mb-2">Today&apos;s Letter</div>
                  {daily?.today.hasPendingLetter ? (
                    <div className="flex items-center gap-2 text-success-text">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[14px]">
                        Queued for <strong>{daily.today.pendingLetter?.name}</strong>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gold-dim">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-[14px]">No letter queued for today</span>
                    </div>
                  )}
                </div>

                {/* Last run result summary */}
                {result && (
                  <div className="space-y-2 text-[13px]">
                    <div className="font-mono text-[10px] tracking-widest uppercase text-fg/40 mb-1">Last Run</div>
                    {result.search && (
                      <div className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-fg/40" />
                        <span className="text-fg/60">Searched via <strong>{result.search.source}</strong> — {result.search.total} candidates, <span className="text-success-text">{result.search.new} new</span>, {result.search.duplicates} duplicates, {result.search.errors} errors</span>
                      </div>
                    )}
                    {result.today_letter ? (
                      <div className="flex items-center gap-2">
                        <Send className="w-3.5 h-3.5 text-success-text" />
                        <span className="text-success-text">Letter queued for <strong>{result.today_letter.name}</strong></span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-gold-dim" />
                        <span className="text-gold-dim">No profile available to queue</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Letter preview */}
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-fg/40 mb-2">Today&apos;s Letter</div>
                {(daily?.today.hasPendingLetter && letterDetail) ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[14px] text-fg">{letterDetail.name}</span>
                      <button
                        onClick={copyLetter}
                        className="flex items-center gap-1 font-mono text-[10px] tracking-wider px-2.5 py-1 border border-line text-fg/50 hover:text-accent-text hover:border-azure transition-colors"
                      >
                        {copied ? (
                          <><CheckCircle2 className="w-3 h-3" /> Copied</>
                        ) : (
                          <><Copy className="w-3 h-3" /> Copy HTML</>
                        )}
                      </button>
                      <a
                        href={`/admin/outreach?profile=${letterDetail.name}`}
                        className="flex items-center gap-1 font-mono text-[10px] tracking-wider px-2.5 py-1 border border-line text-fg/50 hover:text-accent-text hover:border-azure transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> View in Queue
                      </a>
                    </div>
                    <div className="border border-line bg-card max-h-[300px] overflow-auto p-3 text-[11px] leading-relaxed text-fg/60">
                      <div dangerouslySetInnerHTML={{ __html: letterDetail.html.slice(0, 600) + "..." }} />
                    </div>
                  </div>
                ) : daily?.today.hasPendingLetter ? (
                  <button
                    onClick={() => daily.today.pendingLetter && fetchPendingLetter(daily.today.pendingLetter.id)}
                    className="font-mono text-[11px] text-gold-dim hover:text-accent-text transition-colors"
                  >
                    Load letter preview
                  </button>
                ) : (
                  <div className="text-[13px] text-fg/40 italic">Run the pipeline to generate today&apos;s letter</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
        <div className="bg-surface border border-line">
          <div className="px-6 py-4 border-b border-line flex items-center justify-between">
            <h2 className="font-display text-[16px] text-heading">Recent Articles</h2>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">Manage</span>
          </div>
          <div className="divide-y divide-line">
            {recentArticles.map((article, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-[14px] text-fg">{article.title}</div>
                  <div className="font-mono text-[10px] text-fg/40 mt-1">{article.date} · {article.author}</div>
                </div>
                <span className={`font-mono text-[9.5px] tracking-widest uppercase px-2.5 py-1 ${
                  article.status === "Published"
                    ? "bg-forest/10 text-success-text"
                    : "bg-gold-dim/10 text-gold-dim"
                }`}>
                  {article.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-line">
          <div className="px-6 py-4 border-b border-line flex items-center justify-between">
            <h2 className="font-display text-[16px] text-heading">Contact Requests</h2>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">Inbox</span>
          </div>
          <div className="divide-y divide-line">
            {recentContacts.map((contact, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-[14px] text-fg">{contact.name}</div>
                  <div className="text-[12.5px] text-fg/50">{contact.subject}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] text-fg/40">{contact.date}</div>
                  <span className={`font-mono text-[9.5px] tracking-widest uppercase ${
                    contact.status === "New" ? "text-accent-text" : "text-fg/30"
                  }`}>
                    {contact.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-[16px] text-heading mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {["New Article", "Add Timeline Entry", "Upload to Gallery", "View Contacts", "Web Finder", "Outreach Queue"].map((action) => (
            <a
              key={action}
              href={`/admin/${action.toLowerCase().replace(/\s+/g, "-")}`}
              className="font-mono text-[11px] tracking-widest uppercase px-5 py-3 border border-line text-fg/60 hover:border-azure hover:text-accent-text transition-colors bg-surface inline-block"
            >
              {action}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
