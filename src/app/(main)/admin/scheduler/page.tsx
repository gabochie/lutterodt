"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ChevronLeft, ChevronRight, Loader2, Calendar as CalIcon,
  CheckCircle2, Clock, X, Plus,
} from "lucide-react";

interface Profile {
  id: string; name: string; category: string; country: string;
  achievement: string; letter_status: string;
}

interface QueueItem {
  id: number; profile_id: string; name: string; status: string;
  letter_html: string; scheduled_date: string; sent_at: string;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date); d.setDate(d.getDate() + n); return d;
}

export default function SchedulerPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [scheduling, setScheduling] = useState(false);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + monthOffset;
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDow = firstDay.getDay();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profRes, pendRes, sentRes] = await Promise.all([
        fetch("/api/outreach/profiles?limit=200").then(r => r.json()),
        fetch("/api/outreach/queue?status=pending").then(r => r.json()),
        fetch("/api/outreach/queue?status=sent").then(r => r.json()),
      ]);
      setProfiles(profRes.profiles || []);
      setQueue([...(pendRes || []), ...(sentRes || [])]);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const queueByDate: Record<string, QueueItem> = {};
  for (const item of queue) {
    if (item.scheduled_date) queueByDate[item.scheduled_date] = item;
  }

  const availableProfiles = profiles.filter(
    p => p.letter_status === "none" || p.letter_status === "new"
  );

  function getDays(): { date: string; day: number; item?: QueueItem; isPast: boolean }[] {
    const days: { date: string; day: number; item?: QueueItem; isPast: boolean }[] = [];
    for (let i = 0; i < startDow; i++) {
      days.push({ date: "", day: 0, isPast: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = formatDate(new Date(year, month, d));
      days.push({ date, day: d, item: queueByDate[date], isPast: date < todayStr() });
    }
    return days;
  }

  async function scheduleProfile(profileId: string) {
    if (!selectedDate) return;
    setScheduling(true);
    try {
      const prof = profiles.find(p => p.id === profileId);
      if (!prof) return;

      // Generate letter
      const gen = await fetch("/api/outreach/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: prof.name, achievement: prof.achievement || "",
          category: prof.category, country: prof.country,
        }),
      });
      const { html } = await gen.json();

      // Enqueue
      await fetch("/api/outreach/queue", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          profile_id: profileId, name: prof.name,
          letter_html: html, scheduled_date: selectedDate,
        }),
      });

      setShowPicker(false);
      setSelectedDate(null);
      fetchData();
    } catch { /* ignore */ }
    setScheduling(false);
  }

  async function rescheduleItem(itemId: number, newDate: string) {
    await fetch("/api/outreach/queue", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: itemId, scheduled_date: newDate }),
    });
    fetchData();
  }

  async function unqueueItem(itemId: number) {
    await fetch("/api/outreach/queue", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: itemId, status: "cancelled" }),
    });
    setSelectedItem(null);
    fetchData();
  }

  async function autoFill() {
    setScheduling(true);
    const today = todayStr();
    const pendingDates = new Set(queue.filter(q => q.status === "pending").map(q => q.scheduled_date));
    const available = [...availableProfiles];
    let idx = 0;

    for (let i = 0; i < 30 && idx < available.length; i++) {
      const date = formatDate(addDays(new Date(), i));
      if (date < today || pendingDates.has(date)) continue;
      const prof = available[idx++];
      if (!prof) break;

      try {
        const gen = await fetch("/api/outreach/generate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: prof.name, achievement: prof.achievement || "",
            category: prof.category, country: prof.country,
          }),
        });
        const { html } = await gen.json();
        await fetch("/api/outreach/queue", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            profile_id: prof.id, name: prof.name,
            letter_html: html, scheduled_date: date,
          }),
        });
      } catch { /* skip */ }
    }
    setScheduling(false);
    fetchData();
  }

  const days = getDays();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[clamp(24px,2.5vw,32px)] font-display text-heading">Scheduler</h1>
          <p className="text-fg/50 text-[14px] mt-1">Plan and manage daily outreach letters</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={autoFill}
            disabled={scheduling || availableProfiles.length === 0}
            className="font-mono text-[11px] tracking-widest uppercase px-5 py-3 border border-gold-dim text-gold-dim hover:bg-gold-dim/5 transition-colors disabled:opacity-40 flex items-center gap-2"
          >
            {scheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Auto-Fill Next 30 Days
          </button>
          <button
            onClick={fetchData}
            className="font-mono text-[11px] tracking-widest uppercase px-4 py-3 border border-line text-fg/50 hover:text-accent-text hover:border-burgundy transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] max-lg:grid-cols-1 gap-6">
        {/* Calendar */}
        <div className="bg-surface border border-line">
          <div className="px-6 py-4 border-b border-line flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalIcon className="w-5 h-5 text-gold-dim" />
              <h2 className="font-display text-[16px] text-heading">
                {MONTHS[month]} {year}
              </h2>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setMonthOffset(m => m - 1)} className="p-2 text-fg/50 hover:text-accent-text transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setMonthOffset(0)} className="px-2 py-1 font-mono text-[10px] text-fg/40 hover:text-accent-text">Today</button>
              <button onClick={() => setMonthOffset(m => m + 1)} className="p-2 text-fg/50 hover:text-accent-text transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-fg/20" />
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => (
                  <div key={d} className="font-mono text-[9.5px] tracking-widest uppercase text-fg/40 text-center py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {days.map((d, i) => {
                  if (!d.date) return <div key={`e${i}`} />;
                  const item = d.item;
                  const isToday = d.date === todayStr();
                  const isSelected = d.date === selectedDate;

                  return (
                    <div
                      key={d.date}
                      onClick={() => {
                        if (item && item.status === "pending") {
                          setSelectedItem(item);
                          setShowPicker(false);
                        } else if (!d.isPast && !item) {
                          setSelectedDate(d.date);
                          setShowPicker(true);
                          setSelectedItem(null);
                        }
                      }}
                      className={`relative aspect-square p-1.5 border border-line/30 cursor-pointer transition-colors flex flex-col items-center justify-center ${
                        isToday ? "bg-gold-dim/10 border-gold-dim/40" : ""
                      } ${isSelected ? "ring-2 ring-gold-dim" : ""} ${
                        d.isPast && !item ? "opacity-30 pointer-events-none" : "hover:bg-line/20"
                      }`}
                    >
                      <span className={`font-mono text-[12px] ${isToday ? "text-accent-text font-bold" : "text-fg/70"}`}>
                        {d.day}
                      </span>
                      {item && (
                        <span title={item.name} className={`mt-0.5 w-2 h-2 rounded-full ${
                          item.status === "sent" ? "bg-forest" : "bg-gold-dim"
                        }`} />
                      )}
                      {item && (
                        <span className="font-mono text-[7px] text-fg/40 mt-0.5 leading-tight text-center truncate w-full">
                          {item.name.split(" ").slice(-1)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-5 mt-4 pt-3 border-t border-line/50">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold-dim" />
                  <span className="font-mono text-[9px] text-fg/40">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-forest" />
                  <span className="font-mono text-[9px] text-fg/40">Sent</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-line/50 border border-line" />
                  <span className="font-mono text-[9px] text-fg/40">Empty</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected day picker */}
          {showPicker && selectedDate && (
            <div className="bg-surface border border-line p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-[14px] text-heading">
                  Schedule: {selectedDate}
                </h3>
                <button onClick={() => { setShowPicker(false); setSelectedDate(null); }}>
                  <X className="w-4 h-4 text-fg/40 hover:text-accent-text" />
                </button>
              </div>
              {availableProfiles.length === 0 ? (
                <p className="text-[13px] text-fg/50">No profiles available. All have letters queued or sent.</p>
              ) : (
                <div className="space-y-1 max-h-[300px] overflow-auto">
                  {availableProfiles.map(p => (
                    <button
                      key={p.id}
                      onClick={() => scheduleProfile(p.id)}
                      disabled={scheduling}
                      className="w-full text-left px-3 py-2 text-[13px] border border-line hover:border-gold-dim hover:bg-gold-dim/5 transition-colors disabled:opacity-50"
                    >
                      <span className="text-fg">{p.name}</span>
                      <span className="font-mono text-[9px] text-fg/40 ml-2">{p.country} · {p.category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selected queue item details */}
          {selectedItem && (
            <div className="bg-surface border border-line p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-[14px] text-heading">{selectedItem.name}</h3>
                <button onClick={() => setSelectedItem(null)}>
                  <X className="w-4 h-4 text-fg/40 hover:text-accent-text" />
                </button>
              </div>
              <div className="space-y-2 text-[13px]">
                <div className="flex items-center gap-2 text-fg/60">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Scheduled: {selectedItem.scheduled_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedItem.status === "sent" ? (
                    <><CheckCircle2 className="w-3.5 h-3.5 text-success-text" /><span className="text-success-text">Sent</span></>
                  ) : (
                    <><Clock className="w-3.5 h-3.5 text-gold-dim" /><span className="text-gold-dim">Pending</span></>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  {selectedItem.status === "pending" && (
                    <>
                      <input
                        type="date"
                        defaultValue={selectedItem.scheduled_date}
                        onChange={(e) => rescheduleItem(selectedItem.id, e.target.value)}
                        className="flex-1 px-2 py-1.5 border border-line text-[12px] font-mono text-fg/60"
                      />
                      <button
                        onClick={() => unqueueItem(selectedItem.id)}
                        className="font-mono text-[10px] tracking-wider px-3 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Queue summary */}
          <div className="bg-surface border border-line p-4">
            <h3 className="font-display text-[14px] text-heading mb-3">Queue Summary</h3>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-fg/60">Total profiles</span>
                <span className="font-mono text-fg">{profiles.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg/60">Available to schedule</span>
                <span className="font-mono text-success-text">{availableProfiles.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg/60">Pending letters</span>
                <span className="font-mono text-gold-dim">{queue.filter(q => q.status === "pending").length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg/60">Sent letters</span>
                <span className="font-mono text-success-text">{queue.filter(q => q.status === "sent").length}</span>
              </div>
            </div>
          </div>

          {/* Upcoming queue list */}
          <div className="bg-surface border border-line p-4">
            <h3 className="font-display text-[14px] text-heading mb-3">Upcoming</h3>
            {queue.filter(q => q.status === "pending").sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date)).slice(0, 10).length === 0 ? (
              <p className="text-[13px] text-fg/50">No upcoming letters scheduled.</p>
            ) : (
              <div className="space-y-1 max-h-[300px] overflow-auto">
                {queue.filter(q => q.status === "pending").sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date)).slice(0, 10).map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedItem(item); setShowPicker(false); setSelectedDate(null); }}
                    className="w-full text-left px-3 py-2 text-[13px] border border-line hover:border-gold-dim transition-colors flex items-center justify-between"
                  >
                    <span className="text-fg">{item.name}</span>
                    <span className="font-mono text-[9.5px] text-gold-dim">{item.scheduled_date}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
