import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifySession, verifyRequestAuth } from "@/lib/cf/auth";
import { errMessage } from "@/lib/utils";

export async function GET() {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { env } = await getCloudflareContext({ async: true });
    const mode = await env.LUTTERODT_KV.get("autonomous_mode");
    return NextResponse.json({
      enabled: mode === "true",
      raw: mode,
    });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { enabled } = await request.json();
    const val = enabled === true ? "true" : "false";

    const { env } = await getCloudflareContext({ async: true });
    await env.LUTTERODT_KV.put("autonomous_mode", val);

    return NextResponse.json({
      enabled: val === "true",
      message: val === "true"
        ? "Autonomous mode activated — pipeline will now auto-send letters"
        : "Autonomous mode deactivated — pipeline is in dry-run mode",
    });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}
