"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  Image,
  MessageSquare,
  Loader2,
} from "lucide-react";

const statConfig = [
  { label: "Articles", key: "articles", icon: FileText, color: "text-burgundy" },
  { label: "Timeline Entries", key: "timeline", icon: Clock, color: "text-gold-dim" },
  { label: "Gallery Items", key: "gallery", icon: Image, color: "text-forest" },
  { label: "Contact Requests", key: "contacts", icon: MessageSquare, color: "text-burgundy" },
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-burgundy-ink">Dashboard</h1>
        <p className="text-charcoal/50 text-[14px] mt-1">Overview of the Lutterodt Renaissance Archive</p>
      </div>

      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-4 mb-10">
        {statConfig.map((stat) => {
          const Icon = stat.icon;
          const value = stats ? stats[stat.key] : null;
          return (
            <div key={stat.label} className="bg-ivory border border-line p-6">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className="font-mono text-[10px] tracking-widest uppercase text-charcoal/40">{stat.label}</span>
              </div>
              <div className="font-display text-[32px] text-burgundy-ink">
                {loading ? <Loader2 className="w-6 h-6 animate-spin text-charcoal/20" /> : value ?? "—"}
              </div>
              <div className="font-mono text-[10px] tracking-wider text-charcoal/40 mt-1">
                {loading ? "" : `Total records`}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 max-md:grid-cols-1 gap-6">
        <div className="bg-ivory border border-line">
          <div className="px-6 py-4 border-b border-line flex items-center justify-between">
            <h2 className="font-display text-[16px] text-burgundy-ink">Recent Articles</h2>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">Manage</span>
          </div>
          <div className="divide-y divide-line">
            {recentArticles.map((article, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-[14px] text-charcoal">{article.title}</div>
                  <div className="font-mono text-[10px] text-charcoal/40 mt-1">{article.date} · {article.author}</div>
                </div>
                <span className={`font-mono text-[9.5px] tracking-widest uppercase px-2.5 py-1 ${
                  article.status === "Published"
                    ? "bg-forest/10 text-forest"
                    : "bg-gold-dim/10 text-gold-dim"
                }`}>
                  {article.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ivory border border-line">
          <div className="px-6 py-4 border-b border-line flex items-center justify-between">
            <h2 className="font-display text-[16px] text-burgundy-ink">Contact Requests</h2>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gold-dim">Inbox</span>
          </div>
          <div className="divide-y divide-line">
            {recentContacts.map((contact, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-[14px] text-charcoal">{contact.name}</div>
                  <div className="text-[12.5px] text-charcoal/50">{contact.subject}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] text-charcoal/40">{contact.date}</div>
                  <span className={`font-mono text-[9.5px] tracking-widest uppercase ${
                    contact.status === "New" ? "text-burgundy" : "text-charcoal/30"
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
        <h2 className="font-display text-[16px] text-burgundy-ink mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {["New Article", "Add Timeline Entry", "Upload to Gallery", "View Contacts"].map((action) => (
            <button
              key={action}
              className="font-mono text-[11px] tracking-widest uppercase px-5 py-3 border border-line text-charcoal/60 hover:border-burgundy hover:text-burgundy transition-colors bg-ivory"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
