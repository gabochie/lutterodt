import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ensureOutreachTables } from "@/lib/outreach/d1";
import { CommandCenterClient } from "./CommandCenterClient";

export const dynamic = "force-dynamic";

async function fetchInitialData() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;
    const kv = env.LUTTERODT_KV as KVNamespace;
    await ensureOutreachTables(db);

    const today = new Date().toISOString().split("T")[0];

    const [existingToday, pendingCount, sentCount, totalProfiles, noLetterCount, logs, autoMode] = await Promise.all([
      db.prepare("SELECT id, profile_id, name, status FROM outreach_queue WHERE scheduled_date = ? AND status = 'pending' LIMIT 1").bind(today).first<any>(),
      db.prepare("SELECT COUNT(*) as c FROM outreach_queue WHERE status = 'pending'").first<{ c: number }>(),
      db.prepare("SELECT COUNT(*) as c FROM outreach_queue WHERE status = 'sent'").first<{ c: number }>(),
      db.prepare("SELECT COUNT(*) as c FROM outreach_profiles").first<{ c: number }>(),
      db.prepare("SELECT COUNT(*) as c FROM outreach_profiles WHERE letter_status IN ('none','new')").first<{ c: number }>(),
      db.prepare("SELECT id, profile_id, action, details, created_at FROM outreach_log ORDER BY created_at DESC LIMIT 10").all<any>(),
      kv.get("autonomous_mode"),
    ]);

    // Health checks
    const healthChecks: { name: string; status: "ok" | "missing" | "error"; detail: string }[] = [
      { name: "AUTH_SECRET", status: (process.env.AUTH_SECRET?.length ?? 0) > 10 ? "ok" : "missing", detail: process.env.AUTH_SECRET ? `${process.env.AUTH_SECRET.slice(0, 4)}...` : "Not set" },
      { name: "ADMIN_PASSWORD", status: (process.env.ADMIN_PASSWORD?.length ?? 0) > 3 ? "ok" : "missing", detail: process.env.ADMIN_PASSWORD ? "Set" : "Not set" },
      { name: "CRON_SECRET", status: (process.env.CRON_SECRET?.length ?? 0) > 8 ? "ok" : "missing", detail: process.env.CRON_SECRET ? "Set" : "Not set" },
      { name: "RESEND_API_KEY", status: process.env.RESEND_API_KEY?.startsWith("re_") ? "ok" : "missing", detail: process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.slice(0, 7)}...` : "Not set" },
      { name: "D1 Database", status: "ok", detail: `${totalProfiles?.c || 0} profiles` },
      { name: "KV Store", status: "ok", detail: autoMode !== null ? `autonomous_mode: ${autoMode}` : "autonomous_mode: (unset)" },
      { name: "Autonomous Mode", status: autoMode === "true" ? "ok" : "missing", detail: autoMode === "true" ? "ACTIVE" : "Inactive (dry-run)" },
    ];

    const dailyData = {
      today: {
        date: today,
        hasPendingLetter: !!existingToday,
        pendingLetter: existingToday ? { id: existingToday.id, profile_id: existingToday.profile_id, name: existingToday.name, status: existingToday.status } : null,
      },
      stats: {
        totalProfiles: totalProfiles?.c || 0,
        noLetter: noLetterCount?.c || 0,
        pendingInQueue: pendingCount?.c || 0,
        totalSent: sentCount?.c || 0,
      },
    };

    return {
      daily: dailyData,
      health: { healthy: healthChecks.every(c => c.status === "ok"), checks: healthChecks },
      autonomous: { enabled: autoMode === "true" },
      logs: logs.results || [],
      audit: null as any,
    };
  } catch (err: any) {
    return { daily: null, health: null, autonomous: null, logs: [], audit: null, error: err.message };
  }
}

export default async function CommandCenterPage() {
  const initial = await fetchInitialData();
  return <CommandCenterClient initial={initial} />;
}
