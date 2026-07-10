import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { event, data } = payload;

    if (event === "charge.completed" && data.status === "successful") {
      const { env } = await getCloudflareContext({ async: true });
      const db = env.LUTTERODT_D1 as D1Database;

      await db.prepare(
        "INSERT INTO outreach_logs (event, details) VALUES (?, ?)"
      ).bind(
        "flutterwave:payment",
        JSON.stringify({
          tx_ref: data.tx_ref,
          amount: data.amount,
          currency: data.currency,
          customer: data.customer?.email,
          service: data.meta?.service || "Creative services",
          flw_id: data.id,
        })
      ).run();
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
