import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyRequestAuth } from "@/lib/cf/auth";

interface HealthCheck {
  name: string;
  status: "ok" | "missing" | "error";
  detail: string;
}

export async function GET(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checks: HealthCheck[] = [];

  // 1. AUTH_SECRET
  checks.push({
    name: "AUTH_SECRET",
    status: process.env.AUTH_SECRET && process.env.AUTH_SECRET.length > 10 ? "ok" : "missing",
    detail: process.env.AUTH_SECRET ? `${process.env.AUTH_SECRET.slice(0, 4)}...` : "Not set",
  });

  // 2. ADMIN_PASSWORD
  checks.push({
    name: "ADMIN_PASSWORD",
    status: process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length > 3 ? "ok" : "missing",
    detail: process.env.ADMIN_PASSWORD ? "Set" : "Not set",
  });

  // 3. CRON_SECRET
  checks.push({
    name: "CRON_SECRET",
    status: process.env.CRON_SECRET && process.env.CRON_SECRET.length > 8 ? "ok" : "missing",
    detail: process.env.CRON_SECRET ? "Set" : "Not set — cron jobs will fail",
  });

  // 4. RESEND_API_KEY
  checks.push({
    name: "RESEND_API_KEY",
    status: process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith("re_") ? "ok" : "missing",
    detail: process.env.RESEND_API_KEY
      ? `${process.env.RESEND_API_KEY.slice(0, 7)}...`
      : "Not set — email sending disabled",
  });

  // 5. D1 Database
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;
    const result = await db.prepare("SELECT COUNT(*) as c FROM outreach_profiles").first<{ c: number }>();
    checks.push({
      name: "D1 Database",
      status: "ok",
      detail: `${result?.c || 0} profiles`,
    });
  } catch (err: any) {
    checks.push({
      name: "D1 Database",
      status: "error",
      detail: err.message || "Unreachable",
    });
  }

  // 6. KV Store
  try {
    const { env } = await getCloudflareContext({ async: true });
    const test = await env.LUTTERODT_KV.get("coming_soon");
    checks.push({
      name: "KV Store",
      status: "ok",
      detail: test !== null ? "coming_soon: " + test : "coming_soon: (unset)",
    });
  } catch (err: any) {
    checks.push({
      name: "KV Store",
      status: "error",
      detail: err.message || "Unreachable",
    });
  }

  // 7. Autonomous Mode
  try {
    const { env } = await getCloudflareContext({ async: true });
    const mode = await env.LUTTERODT_KV.get("autonomous_mode");
    checks.push({
      name: "Autonomous Mode",
      status: mode === "true" ? "ok" : "missing",
      detail: mode === "true" ? "ACTIVE — auto-sending enabled" : "Inactive (dry-run mode)",
    });
  } catch {
    checks.push({
      name: "Autonomous Mode",
      status: "error",
      detail: "Cannot read setting",
    });
  }

  const allOk = checks.every(c => c.status === "ok");

  return NextResponse.json({
    healthy: allOk,
    checks,
    timestamp: new Date().toISOString(),
  });
}
