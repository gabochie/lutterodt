"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Activity,
  Clock,
  Send,
  Users,
  Shield,
  ToggleLeft,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Power,
  PowerOff,
  RefreshCw,
  Calendar,
  Loader2,
  ExternalLink,
  ChevronRight,
  Zap,
  Mail,
  Search,
  BarChart3,
  FileText,
} from "lucide-react";

type HealthCheck = { name: string; status: "ok" | "missing" | "error"; detail: string };

export default function CommandCenterPage() {
  const [daily, setDaily] = useState<any>(null);
  const [health, setHealth] = useState<{ healthy: boolean; checks: HealthCheck[] } | null>(null);
  const [autonomous, setAutonomous] = useState<{ enabled: boolean } | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [runningPipeline, setRunningPipeline] = useState(false);

  const fetchAll = async () => {
    const [dailyRes, healthRes, autoRes, logsRes] = await Promise.all([
      fetch("/api/outreach/daily").then(r => r.ok ? r.json() : null),
      fetch("/api/outreach/health").then(r => r.ok ? r.json() : null),
      fetch("/api/settings/autonomous").then(r => r.ok ? r.json() : null),
      fetch("/api/outreach/logs?limit=10").then(r => r.ok ? r.json() : null),
    ]);
    setDaily(dailyRes);
    setHealth(healthRes);
    setAutonomous(autoRes);
    setLogs(logsRes?.logs || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const toggleAutonomous = async () => {
    setToggling(true);
    try {
      const res = await fetch("/api/settings/autonomous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !autonomous?.enabled }),
      });
      if (res.ok) {
        const data = await res.json();
        setAutonomous({ enabled: data.enabled });
      }
    } finally { setToggling(false); }
  };

  const runPipeline = async () => {
    setRunningPipeline(true);
    try {
      const res = await fetch("/api/outreach/daily", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setDaily(data);
      }
    } finally { setRunningPipeline(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-gold-dim" />
    </div>
  );

  const todayStatus = daily?.today?.hasPendingLetter ? "pending" : "idle";
  const stats = daily?.stats || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-[650] tracking-tight text-burgundy-ink flex items-center gap-3">
            <Zap className="w-7 h-7 text-gold" />
            Command Center
          </h1>
          <p className="text-sm text-charcoal/50 mt-1">Mission control for the autonomous outreach pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
            autonomous?.enabled
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
          )}>
            <span className={cn(
              "w-2 h-2 rounded-full",
              autonomous?.enabled ? "bg-green-500" : "bg-amber-500"
            )} />
            {autonomous?.enabled ? "LIVE" : "SAFE MODE"}
          </span>
          <span className="text-xs text-charcoal/40 font-mono">
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Panel 1: Pipeline Pulse */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-line p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-charcoal/70 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-gold-dim" />
              Pipeline Pulse
            </h2>
            <button
              onClick={runPipeline}
              disabled={runningPipeline}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-burgundy-ink text-ivory text-xs rounded-md hover:bg-burgundy-ink/90 transition-colors disabled:opacity-50"
            >
              {runningPipeline ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              Run Now
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className={cn(
                "w-3 h-3 rounded-full",
                todayStatus === "pending" ? "bg-green-500" : "bg-yellow-400"
              )} />
              <span className="text-sm text-charcoal/70">
                {todayStatus === "pending" ? "Today's letter ready" : "Awaiting today's run"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-3.5 h-3.5 text-charcoal/40" />
              <span className="text-sm text-charcoal/60">
                Cron scheduled: <span className="font-medium text-charcoal/80">08:00 UTC daily</span>
              </span>
            </div>

            {daily?.auto_send && (
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-xs",
                daily.auto_send.sent ? "bg-green-50 text-green-700" :
                daily.auto_send.dryRun ? "bg-amber-50 text-amber-700" :
                "bg-red-50 text-red-700"
              )}>
                {daily.auto_send.sent ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                 daily.auto_send.dryRun ? <AlertTriangle className="w-3.5 h-3.5" /> :
                 <XCircle className="w-3.5 h-3.5" />}
                {daily.auto_send.sent ? "Auto-sent via autonomous pipeline" :
                 daily.auto_send.dryRun ? "Dry run: would have sent" :
                 `Send failed: ${daily.auto_send.error}`}
              </div>
            )}
          </div>
        </div>

        {/* Panel 2: Queue Radar */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-line p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-gold-dim" />
            <h2 className="text-sm font-semibold text-charcoal/70 uppercase tracking-wider">Queue Radar</h2>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-burgundy-ink/5 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-burgundy-ink">{stats.pendingInQueue || 0}</div>
              <div className="text-[10px] uppercase tracking-wider text-charcoal/50">Pending</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-700">{stats.totalSent || 0}</div>
              <div className="text-[10px] uppercase tracking-wider text-green-600/60">Sent</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-700">{stats.noLetter || 0}</div>
              <div className="text-[10px] uppercase tracking-wider text-amber-600/60">Need Letter</div>
            </div>
          </div>

          {daily?.today?.pendingLetter ? (
            <div className="bg-burgundy-ink/5 rounded-lg p-3">
              <div className="text-xs text-charcoal/50 mb-1">Today's letter</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-burgundy-ink truncate">{daily.today.pendingLetter.name}</span>
                <FileText className="w-3.5 h-3.5 text-gold-dim shrink-0" />
              </div>
            </div>
          ) : (
            <div className="text-xs text-charcoal/40 text-center py-4">No letter scheduled for today</div>
          )}
        </div>

        {/* Panel 3: Discovery Feed */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-line p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-gold-dim" />
            <h2 className="text-sm font-semibold text-charcoal/70 uppercase tracking-wider">Discovery Feed</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-burgundy-ink/5 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-burgundy-ink">{stats.totalProfiles || 0}</div>
              <div className="text-[10px] uppercase tracking-wider text-charcoal/50">Total Profiles</div>
            </div>
            <div className="bg-burgundy-ink/5 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-burgundy-ink">
                {stats.totalProfiles ? Math.round(((stats.totalProfiles - (stats.noLetter || 0)) / stats.totalProfiles) * 100) : 0}%
              </div>
              <div className="text-[10px] uppercase tracking-wider text-charcoal/50">Coverage</div>
            </div>
          </div>

          {daily?.search && (
            <div className="text-xs text-charcoal/60 space-y-1">
              <div className="flex justify-between"><span>New today</span><span className="font-medium">{daily.search.new}</span></div>
              <div className="flex justify-between"><span>Duplicates skipped</span><span className="font-medium">{daily.search.duplicates}</span></div>
              <div className="flex justify-between"><span>Source</span><span className="font-medium font-mono">{daily.search.source}</span></div>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Logs + Health + Master Switch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Panel 4: Sending Log */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-line p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Send className="w-4 h-4 text-gold-dim" />
            <h2 className="text-sm font-semibold text-charcoal/70 uppercase tracking-wider">Sending Log</h2>
          </div>

          {logs.length === 0 ? (
            <div className="text-xs text-charcoal/40 text-center py-6">No events yet</div>
          ) : (
            <div className="space-y-2">
              {logs.map((log: any) => (
                <div key={log.id} className="flex items-start gap-3 py-1.5 border-b border-line/50 last:border-0">
                  <span className={cn(
                    "w-2 h-2 rounded-full mt-1 shrink-0",
                    log.action === "sent" || log.action === "auto-sent" ? "bg-green-500" :
                    log.action === "queued" || log.action === "discovered" ? "bg-blue-500" :
                    log.action === "dry-run" || log.action === "auto-dry-run" ? "bg-amber-400" :
                    log.action === "send-failed" ? "bg-red-500" :
                    "bg-gray-400"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-charcoal/70 truncate">{log.details}</div>
                    <div className="text-[10px] font-mono text-charcoal/40">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-charcoal/30 uppercase shrink-0">{log.action}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel 5: System Health */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-line p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-gold-dim" />
            <h2 className="text-sm font-semibold text-charcoal/70 uppercase tracking-wider">System Health</h2>
          </div>

          <div className="space-y-3">
            {(health?.checks || []).map((check, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {check.status === "ok" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : check.status === "missing" ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm text-charcoal/70">{check.name}</span>
                </div>
                <span className={cn(
                  "text-[10px] font-mono truncate max-w-[140px] text-right",
                  check.status === "ok" ? "text-green-600" :
                  check.status === "missing" ? "text-amber-600" :
                  "text-red-600"
                )}>
                  {check.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 6: Master Switch */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-line p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ToggleLeft className="w-4 h-4 text-gold-dim" />
            <h2 className="text-sm font-semibold text-charcoal/70 uppercase tracking-wider">Master Switch</h2>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <button
              onClick={toggleAutonomous}
              disabled={toggling}
              className={cn(
                "relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500",
                autonomous?.enabled
                  ? "bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-200"
                  : "bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-200",
                toggling && "opacity-60 animate-pulse"
              )}
            >
              {toggling ? (
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              ) : autonomous?.enabled ? (
                <Power className="w-10 h-10 text-white" />
              ) : (
                <PowerOff className="w-10 h-10 text-white" />
              )}
            </button>

            <div className="text-center mt-4">
              <div className={cn(
                "text-lg font-bold",
                autonomous?.enabled ? "text-green-700" : "text-amber-700"
              )}>
                {autonomous?.enabled ? "AUTONOMOUS" : "SAFE MODE"}
              </div>
              <p className="text-xs text-charcoal/50 mt-1 max-w-[200px]">
                {autonomous?.enabled
                  ? "Pipeline will auto-send letters when cron runs"
                  : "Pipeline stops after enqueue — no emails sent"}
              </p>
            </div>

            <div className="mt-4 w-full border-t border-line pt-4">
              <div className="text-[10px] uppercase tracking-widest text-charcoal/40 text-center mb-2">Quick Actions</div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/admin/outreach"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-burgundy-ink/5 rounded-lg text-xs text-burgundy-ink hover:bg-burgundy-ink/10 transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Stats
                </a>
                <a
                  href="/admin/scheduler"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-burgundy-ink/5 rounded-lg text-xs text-burgundy-ink hover:bg-burgundy-ink/10 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
