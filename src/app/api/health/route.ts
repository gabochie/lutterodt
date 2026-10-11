import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { errMessage } from "@/lib/utils";

/**
 * Public liveness probe (Phase 2.2). Deliberately exposes NO secrets,
 * counts, or content — only reachability. The detailed, authenticated
 * diagnostics live at /api/outreach/health.
 *
 * Used by: Production Smoke workflow, uptime monitors, load balancers.
 * Always returns 200 with a body; callers check `healthy === true`.
 */
export async function GET() {
  const started = Date.now();
  let d1: { ok: boolean; detail: string } = { ok: false, detail: "unchecked" };
  let kv: { ok: boolean; detail: string } = { ok: false, detail: "unchecked" };

  try {
    const { env } = await getCloudflareContext({ async: true });
    try {
      await env.LUTTERODT_D1.prepare("SELECT 1").first();
      d1 = { ok: true, detail: "reachable" };
    } catch (err) {
      d1 = { ok: false, detail: errMessage(err, "unreachable") };
    }
    try {
      // Read-only probe of an innocuous key; absence is fine, errors are not.
      await env.LUTTERODT_KV.get("coming_soon");
      kv = { ok: true, detail: "reachable" };
    } catch (err) {
      kv = { ok: false, detail: errMessage(err, "unreachable") };
    }
  } catch (err) {
    const detail = errMessage(err, "no runtime context");
    d1 = { ok: false, detail };
    kv = { ok: false, detail };
  }

  return NextResponse.json({
    healthy: d1.ok && kv.ok,
    d1,
    kv,
    latencyMs: Date.now() - started,
    timestamp: new Date().toISOString(),
  });
}
