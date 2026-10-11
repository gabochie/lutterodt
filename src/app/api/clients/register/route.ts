import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { ensureOutreachTables } from "@/lib/outreach/d1";
import { isValidEmail, normalizeEmail } from "@/lib/newsletter/store";

const MAX_NAME = 120;
const MAX_PHONE = 40;
const MAX_INTEREST = 120;
const MAX_MESSAGE = 2000;

export async function POST(request: NextRequest) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;
    await ensureOutreachTables(db);

    const { name, email, phone, service_interest, message } = await request.json();
    const cleanName = typeof name === "string" ? name.trim().slice(0, MAX_NAME) : "";
    const cleanEmail = typeof email === "string" ? normalizeEmail(email) : "";
    const cleanPhone = typeof phone === "string" ? phone.trim().slice(0, MAX_PHONE) : "";
    const cleanInterest = typeof service_interest === "string" ? service_interest.trim().slice(0, MAX_INTEREST) : "";
    const cleanMessage = typeof message === "string" ? message.trim().slice(0, MAX_MESSAGE) : "";

    if (!cleanName || !cleanEmail) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    const now = new Date().toISOString();
    await db.prepare(
      "INSERT INTO service_leads (name, email, phone, service_interest, message, status, created_at) VALUES (?, ?, ?, ?, ?, 'new', ?)"
    ).bind(cleanName, cleanEmail, cleanPhone, cleanInterest, cleanMessage, now).run();

    return NextResponse.json({ ok: true, message: "Thank you. We'll be in touch soon." }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
