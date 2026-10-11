import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { parseBody, registerSchema } from "@/lib/validate";
import { LIMITS, checkRateLimit, clientIp, rateLimitedResponse } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  const rate = await checkRateLimit(request, "clients-register", LIMITS.publicWrite);
  if (!rate.allowed) return rateLimitedResponse(rate.retryAfter);
  try {
    const raw = (await request.json()) as { turnstileToken?: string };
    const captcha = await verifyTurnstile(raw.turnstileToken, clientIp(request));
    if (!captcha.ok) {
      return NextResponse.json({ error: "Captcha verification failed. Please try again." }, { status: 400 });
    }
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;

    const parsed = parseBody(registerSchema, raw);
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
