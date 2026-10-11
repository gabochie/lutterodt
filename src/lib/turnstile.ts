/**
 * Cloudflare Turnstile bot protection (Phase 2.3).
 *
 * Setup (one-time, Cloudflare dashboard → Turnstile → Add widget):
 *   - TURNSTILE_SECRET_KEY        → Worker secret (server verification)
 *   - NEXT_PUBLIC_TURNSTILE_SITE_KEY → GitHub Actions + Worker env (widget)
 *
 * Until both are set everything still works: the widget renders nothing and
 * verification is skipped. /api/outreach/health reports the wiring state so
 * the gap stays visible instead of silently unprotected.
 */

export function turnstileConfigured(): boolean {
  return !!process.env.TURNSTILE_SECRET_KEY;
}

export function turnstileSiteKey(): string {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
}

interface VerifyOutcome {
  ok: boolean;
  /** True when verification was skipped because no secret is configured. */
  unconfigured?: boolean;
}

export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string
): Promise<VerifyOutcome> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, unconfigured: true };
  if (!token || typeof token !== "string" || token.length > 4096) {
    return { ok: false };
  }
  try {
    const params = new URLSearchParams({ secret, response: token });
    if (remoteIp && remoteIp !== "unknown") params.set("remoteip", remoteIp);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    if (!res.ok) return { ok: false };
    const data = (await res.json()) as { success?: boolean };
    return { ok: data.success === true };
  } catch {
    // Fail closed on network error when a secret IS configured: a bot that
    // can break egress to Cloudflare shouldn't get a free pass.
    return { ok: false };
  }
}
