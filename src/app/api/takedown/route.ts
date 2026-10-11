import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createDraft } from "@/lib/outreach/research";
import { parseBody, takedownSchema } from "@/lib/validate";
import { LIMITS, checkRateLimit, clientIp, rateLimitedResponse } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { log } from "@/lib/log";

/**
 * Public data-subject request intake (Phase 4.1).
 *
 * Correction/removal requests become research_drafts(kind=correction) for
 * committee review in /outreach/review — nothing is auto-applied. The
 * response is identical whether the profile exists, so the endpoint can't
 * be used to probe the directory.
 */
export async function POST(request: NextRequest) {
  const rate = await checkRateLimit(request, "takedown", LIMITS.publicWrite);
  if (!rate.allowed) return rateLimitedResponse(rate.retryAfter);

  try {
    const raw = (await request.json()) as { turnstileToken?: string };
    const captcha = await verifyTurnstile(raw.turnstileToken, clientIp(request));
    if (!captcha.ok) {
      return NextResponse.json({ error: "Captcha verification failed. Please try again." }, { status: 400 });
    }

    const parsed = parseBody(takedownSchema, raw);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const input = parsed.data;

    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;

    const subject = input.profile_name || input.profile_id || "unspecified profile";
    await createDraft(db, {
      kind: "correction",
      profile_id: input.profile_id,
      name: input.profile_name || subject,
      claims: [
        {
          field: input.kind === "removal" ? "removal-request" : "correction-request",
          value: input.details.slice(0, 2000),
          sources: [`requester: ${input.name}${input.email ? ` <${input.email}>` : ""}`],
          confidence: "low",
        },
      ],
      summary: `${input.kind === "removal" ? "REMOVAL" : "CORRECTION"} requested by ${input.name} for ${subject}`,
    });

    log.info("takedown.request_received", { kind: input.kind, profile: subject.slice(0, 80) });

    return NextResponse.json(
      {
        ok: true,
        message:
          "Thank you. Your request has been recorded and will be reviewed by the archive committee within 14 days.",
      },
      { status: 202 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
