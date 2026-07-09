"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Activity, Clock, Send, Shield, ToggleLeft, Play, CheckCircle2, XCircle, AlertTriangle,
  Power, PowerOff, Calendar, Loader2, FileText, Zap, Mail, Search,
  BarChart3, Sparkles, ChevronDown, ChevronUp, Database, UserPlus, Copy, Globe,
} from "lucide-react";

type HealthCheck = { name: string; status: "ok" | "missing" | "error"; detail: string };

interface InitialData {
  daily: any;
  health: { healthy: boolean; checks: HealthCheck[] } | null;
  autonomous: { enabled: boolean } | null;
  logs: any[];
  audit: any;
  error?: string;
  sessionToken?: string;
}

function authHeaders(token: string): Record<string, string> {
  return { "Authorization": `Bearer ${token}` };
}

export function CommandCenterClient({ initial }: { initial: InitialData }) {
  const token = initial.sessionToken || "";
  const [daily, setDaily] = useState<any>(initial.daily);
  const [health] = useState<{ healthy: boolean; checks: HealthCheck[] } | null>(initial.health);
  const [autonomous, setAutonomous] = useState<{ enabled: boolean } | null>(initial.autonomous);
  const [logs] = useState<any[]>(initial.logs);
  const [toggling, setToggling] = useState(false);
  const [runningPipeline, setRunningPipeline] = useState(false);
  const [runningBatch, setRunningBatch] = useState(false);
  const [batchResult, setBatchResult] = useState<any>(null);
  const [batchSize, setBatchSize] = useState(25);
  const [showQueryBreakdown, setShowQueryBreakdown] = useState(false);
  const [error, setError] = useState<string | null>(initial.error || null);

  const toggleAutonomous = async () => {
    setToggling(true);
    try {
      const res = await fetch("/api/settings/autonomous", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(token) },
        body: JSON.stringify({ enabled: !autonomous?.enabled }),
      });
      if (res.ok) {
        const data = await res.json();
        setAutonomous({ enabled: data.enabled });
      } else {
        setError(`Toggle failed: ${res.status}`);
      }
    } catch (e: any) {
      setError(`Toggle error: ${e.message}`);
    } finally { setToggling(false); }
  };

  const runPipeline = async () => {
    setRunningPipeline(true);
    try {
      const res = await fetch("/api/outreach/daily", { method: "POST", headers: authHeaders(token) });
      if (res.ok) {
        setDaily(await res.json());
      } else {
        setError(`Pipeline run failed: ${res.status}`);
      }
    } catch (e: any) {
      setError(`Pipeline error: ${e.message}`);
    } finally { setRunningPipeline(false); }
  };

  const runBatchDiscovery = async () => {
    setRunningBatch(true);
    setBatchResult(null);
    try {
      const res = await fetch(`/api/outreach/daily?batch=true&count=${batchSize}`, { method: "POST", headers: authHeaders(token) });
      if (res.ok) {
        const data = await res.json();
        setBatchResult(data);
      } else {
        const err = await res.text().catch(() => "Unknown error");
        setBatchResult({ error: `HTTP ${res.status}: ${err.slice(0, 200)}` });
      }
    } catch (e: any) {
      setBatchResult({ error: e.message });
    } finally { setRunningBatch(false); }
  };

  const todayStatus = daily?.today?.hasPendingLetter ? "pending" : "idle";
  const stats = daily?.stats || {};

  return (
    <div className="space-y-8">
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-medium">Dismiss</button>
        </div>
      )}

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
            autonomous?.enabled ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
          )}>
            <span className={cn("w-2 h-2 rounded-full", autonomous?.enabled ? "bg-green-500" : "bg-amber-500")} />
            {autonomous?.enabled ? "LIVE" : "SAFE MODE"}
          </span>
          <span className="text-xs text-charcoal/40 font-mono">
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Row 1: Pipeline Pulse + Queue Radar + Discovery Feed */}
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
              <span className={cn("w-3 h-3 rounded-full", todayStatus === "pending" ? "bg-green-500" : "bg-yellow-400")} />
              <span className="text-sm text-charcoal/70">
                {todayStatus === "pending" ? "Today&apos;s letter ready" : "Awaiting today&apos;s run"}
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
                daily.auto_send.dryRun ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
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
              <div className="text-xs text-charcoal/50 mb-1">Today&apos;s letter</div>
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
        </div>
      </div>

      {/* Row 2: Batch Discovery */}
      <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-gradient-to-r from-burgundy-ink/5 to-transparent">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-gold-dim" />
            <h2 className="text-sm font-semibold text-charcoal/70 uppercase tracking-wider">Batch Discovery</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-charcoal/50">Queue up to</span>
              <select
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value))}
                disabled={runningBatch}
                className="text-xs border border-line rounded px-2 py-1 bg-ivory text-charcoal font-medium focus:outline-none focus:border-gold-dim"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-xs text-charcoal/50">letters</span>
            </div>
            <button
              onClick={runBatchDiscovery}
              disabled={runningBatch}
              className="flex items-center gap-1.5 px-4 py-2 bg-gold-dim text-ivory text-xs font-medium rounded-md hover:bg-gold-dim/90 transition-colors disabled:opacity-50"
            >
              {runningBatch ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Discovering...</>
              ) : (
                <><UserPlus className="w-3.5 h-3.5" /> Batch Discover</>
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
            <div className="bg-burgundy-ink/5 rounded-lg p-4 text-center">
              <Database className="w-4 h-4 text-gold-dim mx-auto mb-1.5" />
              <div className="text-xl font-bold text-burgundy-ink">{batchResult?.search?.totalCandidates ?? "—"}</div>
              <div className="text-[10px] uppercase tracking-wider text-charcoal/50">Found</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <UserPlus className="w-4 h-4 text-green-600 mx-auto mb-1.5" />
              <div className="text-xl font-bold text-green-700">{batchResult?.import?.imported?.length ?? "—"}</div>
              <div className="text-[10px] uppercase tracking-wider text-green-600/60">Imported</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <Copy className="w-4 h-4 text-amber-600 mx-auto mb-1.5" />
              <div className="text-xl font-bold text-amber-700">{batchResult?.import?.duplicates ?? "—"}</div>
              <div className="text-[10px] uppercase tracking-wider text-amber-600/60">Duplicates</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Mail className="w-4 h-4 text-blue-600 mx-auto mb-1.5" />
              <div className="text-xl font-bold text-blue-700">{batchResult?.enrichment?.enriched ?? "—"}</div>
              <div className="text-[10px] uppercase tracking-wider text-blue-600/60">Emails Found</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <FileText className="w-4 h-4 text-purple-600 mx-auto mb-1.5" />
              <div className="text-xl font-bold text-purple-700">{batchResult?.queue?.count ?? "—"}</div>
              <div className="text-[10px] uppercase tracking-wider text-purple-600/60">Letters Queued</div>
            </div>
          </div>

          {runningBatch && (
            <div className="mb-5">
              <div className="relative h-2 bg-charcoal/5 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-dim to-gold rounded-full animate-pulse" style={{ width: "60%" }} />
              </div>
              <p className="text-xs text-charcoal/40 mt-1.5">Searching 15 queries, importing new profiles, enriching contacts...</p>
            </div>
          )}

          {batchResult?.error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5" />
              {batchResult.error}
            </div>
          )}

          {batchResult?.search?.perQuery && (
            <div>
              <button
                onClick={() => setShowQueryBreakdown(!showQueryBreakdown)}
                className="flex items-center gap-1.5 text-xs text-charcoal/50 hover:text-charcoal/70 transition-colors mb-3"
              >
                {showQueryBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                Query breakdown ({batchResult.search.perQuery.length} queries)
              </button>
              {showQueryBreakdown && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {batchResult.search.perQuery.map((q: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-charcoal/[0.02] rounded px-3 py-1.5">
                      <span className="text-xs text-charcoal/70 truncate max-w-[200px]">{q.query}</span>
                      <span className="text-[10px] font-mono text-charcoal/40 whitespace-nowrap ml-2">{q.count} · {q.source}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {batchResult?.import?.imported?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-line">
              <div className="text-xs text-charcoal/50 mb-2">Newly imported profiles:</div>
              <div className="max-h-24 overflow-y-auto space-y-1">
                {batchResult.import.imported.map((p: any, i: number) => (
                  <div key={i} className="text-xs text-charcoal/70 flex items-center gap-2">
                    <Globe className="w-3 h-3 text-green-500 shrink-0" />
                    {p.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 4: Logs + Health + Master Switch */}
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
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {logs.map((log: any) => (
                <div key={log.id} className="flex items-start gap-3 py-1.5 border-b border-line/50 last:border-0">
                  <span className={cn(
                    "w-2 h-2 rounded-full mt-1 shrink-0",
                    log.action === "sent" || log.action === "auto-sent" ? "bg-green-500" :
                    log.action === "queued" || log.action === "discovered" ? "bg-blue-500" :
                    log.action === "enriched" ? "bg-purple-400" :
                    log.action === "dry-run" || log.action === "auto-dry-run" ? "bg-amber-400" :
                    log.action === "send-failed" ? "bg-red-500" : "bg-gray-400"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-charcoal/70 truncate">{log.details}</div>
                    <div className="text-[10px] font-mono text-charcoal/40">{new Date(log.created_at).toLocaleString()}</div>
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
                  {check.status === "ok" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                   check.status === "missing" ? <AlertTriangle className="w-4 h-4 text-amber-400" /> :
                   <XCircle className="w-4 h-4 text-red-500" />}
                  <span className="text-sm text-charcoal/70">{check.name}</span>
                </div>
                <span className={cn(
                  "text-[10px] font-mono truncate max-w-[140px] text-right",
                  check.status === "ok" ? "text-green-600" :
                  check.status === "missing" ? "text-amber-600" : "text-red-600"
                )}>{check.detail}</span>
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
              <div className={cn("text-lg font-bold", autonomous?.enabled ? "text-green-700" : "text-amber-700")}>
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
                <a href="/admin/outreach" className="flex items-center justify-center gap-1.5 px-3 py-2 bg-burgundy-ink/5 rounded-lg text-xs text-burgundy-ink hover:bg-burgundy-ink/10 transition-colors">
                  <BarChart3 className="w-3.5 h-3.5" /> Stats
                </a>
                <a href="/admin/scheduler" className="flex items-center justify-center gap-1.5 px-3 py-2 bg-burgundy-ink/5 rounded-lg text-xs text-burgundy-ink hover:bg-burgundy-ink/10 transition-colors">
                  <Calendar className="w-3.5 h-3.5" /> Schedule
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
