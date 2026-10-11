import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyRequestAuth } from "@/lib/cf/auth";
import { errMessage } from "@/lib/utils";

const ID_KEY = "reunion:livestream_id";
const LIVE_KEY = "reunion:livestream_live";

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const livestream_id = (await env.LUTTERODT_KV.get(ID_KEY)) || "";
    const livestream_live = (await env.LUTTERODT_KV.get(LIVE_KEY)) === "true";
    return NextResponse.json({ livestream_id, livestream_live });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { livestream_id, livestream_live } = await request.json();
    const { env } = await getCloudflareContext({ async: true });
    if (livestream_id !== undefined) await env.LUTTERODT_KV.put(ID_KEY, livestream_id || "");
    if (livestream_live !== undefined) await env.LUTTERODT_KV.put(LIVE_KEY, livestream_live === true ? "true" : "false");
    const result = {
      livestream_id: (await env.LUTTERODT_KV.get(ID_KEY)) || "",
      livestream_live: (await env.LUTTERODT_KV.get(LIVE_KEY)) === "true",
      ok: true,
    };
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}
