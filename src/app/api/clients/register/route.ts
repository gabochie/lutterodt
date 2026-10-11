import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { parseBody, registerSchema } from "@/lib/validate";

export async function POST(request: NextRequest) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;

    const parsed = parseBody(registerSchema, await request.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const { name, email, phone, service_interest, message } = parsed.data;

    const now = new Date().toISOString();
    await db.prepare(
      "INSERT INTO service_leads (name, email, phone, service_interest, message, status, created_at) VALUES (?, ?, ?, ?, ?, 'new', ?)"
    ).bind(name, email, phone, service_interest, message, now).run();

    return NextResponse.json({ ok: true, message: "Thank you. We'll be in touch soon." }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
