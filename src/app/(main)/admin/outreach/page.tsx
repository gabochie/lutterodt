"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  Search,
  RefreshCw,
  ExternalLink,
  Filter,
} from "lucide-react";
import type { OutreachRecord, OutreachStatus, OutreachChannel } from "@/lib/outreach/types";

const statusLabels: Record<OutreachStatus, string> = {
  not_sent: "Not Sent",
  sent: "Sent",
  replied: "Replied",
  meeting_booked: "Meeting Booked",
  declined: "Declined",
  follow_up: "Follow Up",
};

const statusColors: Record<OutreachStatus, string> = {
  not_sent: "bg-charcoal/5 text-fg/40 border-charcoal/10",
  sent: "bg-blue-50 text-blue-600 border-blue-200",
  replied: "bg-emerald-50 text-emerald-600 border-emerald-200",
  meeting_booked: "bg-purple-50 text-purple-600 border-purple-200",
  declined: "bg-red-50 text-red-500 border-red-200",
  follow_up: "bg-amber-50 text-amber-600 border-amber-200",
};

const channelLabels: Record<OutreachChannel, string> = {
  "": "—",
  email: "Email",
  linkedin: "LinkedIn",
  phone: "Phone",
  mail: "Mail",
  whatsapp: "WhatsApp",
  other: "Other",
};

const statusCycle: OutreachStatus[] = [
  "not_sent", "sent", "replied", "meeting_booked", "follow_up", "declined",
];

export default function AdminOutreach() {
  const [records, setRecords] = useState<OutreachRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OutreachStatus | "all">("all");
  const [editId, setEditId] = useState<string | null>(null);
  const [editRecord, setEditRecord] = useState<OutreachRecord | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/outreach");
      if (r.ok) setRecords(await r.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const persist = useCallback(async (next: OutreachRecord[]) => {
    setSaving(true);
    try {
      await fetch("/api/outreach", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
    } catch {}
    setSaving(false);
  }, []);

  const updateRecord = (id: string, updates: Partial<OutreachRecord>) => {
    const next = records.map((r) => r.profileId === id ? { ...r, ...updates } : r);
    setRecords(next);
    persist(next);
  };

  const cycleStatus = (id: string) => {
    const record = records.find((r) => r.profileId === id);
    if (!record) return;
    const idx = statusCycle.indexOf(record.status);
    const nextStatus = statusCycle[(idx + 1) % statusCycle.length];
    updateRecord(id, {
      status: nextStatus,
      dateSent: nextStatus === "sent" && !record.dateSent
        ? new Date().toISOString().slice(0, 10)
        : record.dateSent,
      lastContacted: nextStatus !== "not_sent"
        ? new Date().toISOString().slice(0, 10)
        : record.lastContacted,
    });
  };

  const openEdit = (record: OutreachRecord) => {
    setEditId(record.profileId);
    setEditRecord({ ...record });
  };

  const saveEdit = () => {
    if (!editRecord) return;
    updateRecord(editRecord.profileId, editRecord);
    setEditId(null);
    setEditRecord(null);
  };

  const filtered = records.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.name.toLowerCase().includes(q) &&
          !r.country.toLowerCase().includes(q) &&
          !r.category.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const counts = {
    total: records.length,
    not_sent: records.filter((r) => r.status === "not_sent").length,
    sent: records.filter((r) => r.status === "sent").length,
    replied: records.filter((r) => r.status === "replied").length,
    meeting_booked: records.filter((r) => r.status === "meeting_booked").length,
    declined: records.filter((r) => r.status === "declined").length,
    follow_up: records.filter((r) => r.status === "follow_up").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-fg/30 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-heading">Outreach</h1>
          <p className="text-fg/50 text-[14px] mt-1">Track outreach to all {records.length} notable Lutterodts worldwide</p>
        </div>
        <div className="flex items-center gap-3">
          {saving && <RefreshCw className="w-4 h-4 text-fg/30 animate-spin" />}
          <button onClick={fetchData} className="font-mono text-[10px] tracking-widest uppercase px-4 py-2 border border-line text-fg/50 hover:text-fg transition-colors">
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-6 max-md:grid-cols-3 max-sm:grid-cols-2 gap-3 mb-8">
        {(["total", "not_sent", "sent", "replied", "meeting_booked", "declined"] as const).map((key) => (
          <div key={key} className="bg-surface border border-line p-4 text-center">
            <div className="font-display text-[26px] text-heading">
              {key === "total" ? counts.total : counts[key]}
            </div>
            <div className="font-mono text-[9px] tracking-widest uppercase text-fg/40 mt-1">
              {key === "total" ? "Total" : statusLabels[key]}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg/30" />
          <input
            type="text"
            placeholder="Search name, country, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-[13px] border border-line bg-surface text-fg focus:outline-none focus:border-gold-dim transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-fg/30" />
          {(["all", "not_sent", "sent", "replied", "meeting_booked", "declined", "follow_up"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`font-mono text-[9px] tracking-widest uppercase px-2.5 py-1.5 border transition-colors ${
                filterStatus === s
                  ? "bg-azure text-ivory border-azure"
                  : "bg-surface text-fg/50 border-line hover:border-charcoal/30"
              }`}
            >
              {s === "all" ? "All" : statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-line overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line">
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3 w-8">#</th>
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Name</th>
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Category</th>
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Country</th>
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Status</th>
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Channel</th>
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Date Sent</th>
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3">Letter</th>
              <th className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 px-4 py-3 w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((record, i) => (
              <tr
                key={record.profileId}
                className="hover:bg-ivory-dim/50 transition-colors cursor-pointer"
                onClick={() => openEdit(record)}
              >
                <td className="px-4 py-3 font-mono text-[11px] text-fg/30">{i + 1}</td>
                <td className="px-4 py-3">
                  <span className="text-[13.5px] text-fg">{record.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[12px] text-fg/60">{record.category}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[12px] text-fg/60">{record.country}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 border cursor-pointer ${statusColors[record.status]} inline-block`}
                    onClick={(e) => { e.stopPropagation(); cycleStatus(record.profileId); }}
                    title="Click to cycle status"
                  >
                    {statusLabels[record.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-[10px] text-fg/50">{channelLabels[record.channel]}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-[10px] text-fg/50">{record.dateSent || "—"}</span>
                </td>
                <td className="px-4 py-3">
                  {record.letter ? (
                    <a
                      href={record.letter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-gold-dim hover:text-gold transition-colors font-mono text-[10px] tracking-wider"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-fg/20 font-mono text-[10px]">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(record); }}
                    className="font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 border border-line text-fg/40 hover:text-fg hover:border-charcoal/30 transition-colors"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-fg/40 text-[14px]">
                  No records match your search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editId && editRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-6" onClick={() => { setEditId(null); setEditRecord(null); }}>
          <div className="bg-surface w-full max-w-lg border border-line" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-line flex items-center justify-between">
              <h2 className="font-display text-[17px] text-heading">{editRecord.name}</h2>
              <button onClick={() => { setEditId(null); setEditRecord(null); }} className="text-fg/40 hover:text-fg transition-colors text-[18px]">&times;</button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Category</label>
                  <p className="text-[14px] text-fg/70">{editRecord.category}</p>
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Country</label>
                  <p className="text-[14px] text-fg/70">{editRecord.country}</p>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Status</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(statusLabels) as [OutreachStatus, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setEditRecord({ ...editRecord, status: key, dateSent: key !== "not_sent" && !editRecord.dateSent ? new Date().toISOString().slice(0, 10) : editRecord.dateSent, lastContacted: key !== "not_sent" ? new Date().toISOString().slice(0, 10) : editRecord.lastContacted })}
                      className={`font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                        editRecord.status === key
                          ? "bg-azure text-ivory border-azure"
                          : "bg-surface text-fg/50 border-line hover:border-charcoal/30"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Channel</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(channelLabels) as [OutreachChannel, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setEditRecord({ ...editRecord, channel: key })}
                      className={`font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                        editRecord.channel === key
                          ? "bg-azure text-ivory border-azure"
                          : "bg-surface text-fg/50 border-line hover:border-charcoal/30"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Date Sent</label>
                  <input
                    type="date"
                    value={editRecord.dateSent || ""}
                    onChange={(e) => setEditRecord({ ...editRecord, dateSent: e.target.value || null })}
                    className="w-full px-3 py-2 text-[13px] border border-line bg-surface text-fg focus:outline-none focus:border-gold-dim transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Last Contacted</label>
                  <input
                    type="date"
                    value={editRecord.lastContacted || ""}
                    onChange={(e) => setEditRecord({ ...editRecord, lastContacted: e.target.value || null })}
                    className="w-full px-3 py-2 text-[13px] border border-line bg-surface text-fg focus:outline-none focus:border-gold-dim transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Notes</label>
                <textarea
                  value={editRecord.notes}
                  onChange={(e) => setEditRecord({ ...editRecord, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-[13px] border border-line bg-surface text-fg focus:outline-none focus:border-gold-dim transition-colors resize-none"
                  placeholder="Outreach notes, response details, follow-up reminders..."
                />
              </div>

              {editRecord.letter && (
                <div>
                  <label className="block font-mono text-[9px] tracking-widest uppercase text-fg/40 mb-1.5">Letter</label>
                  <a
                    href={editRecord.letter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-gold-dim hover:text-gold transition-colors font-mono text-[11px] tracking-wider"
                  >
                    Open outreach letter <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-line flex items-center justify-end gap-3">
              <button
                onClick={() => { setEditId(null); setEditRecord(null); }}
                className="font-mono text-[10px] tracking-widest uppercase px-5 py-2.5 border border-line text-fg/50 hover:text-fg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="font-mono text-[10px] tracking-widest uppercase px-5 py-2.5 bg-azure text-ivory hover:bg-azure-ink transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
