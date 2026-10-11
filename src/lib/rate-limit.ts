import { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * KV-backed fixed-window rate limiter (Phase 2.1).
 *
 * Abuse-throttling, not billing: KV has no atomic increment, so concurrent
 * bursts can slip a few requests past the limit. That is acceptable here —
 * the goal is to make bot spam and credential stuffing expensive, with
 * Cloudflare Rate Limiting Rules as the outer layer (see docs/runbook.md).
 *
 * Limits are deliberately modest: real humans never hit 10 form posts/min.
 */

export interface RateLimit {
  /** Max requests per window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
}

export const LIMITS = {
  /** Public form writes: register, subscribe, leads. */
  publicWrite: { limit: 10, windowSeconds: 60 },
  /** Login: brute-force sensitive, counts attempts (even 401s). */
  login: { limit: 5, windowSeconds: 60 },
  /** Token links: generous, scanners pre-fetch. */
  tokenLink: { limit: 30, windowSeconds: 60 },
} satisfies Record<string, RateLimit>;

export function clientIp(request: NextRequest | Request): string {
  // Cloudflare Workers set cf-connecting-ip; NextRequest handles it as a header.
  const cfIp = request.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp.slice(0, 64);
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded.slice(0, 64);
  return "unknown";
}

export interface RateCheck {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets (for Retry-After). */
  retryAfter: number;
}

/**
 * Returns allowed=false when the caller exhausted the budget.
 * Fail-open: if KV is unreachable we allow the request (availability over
 * strictness for a family archive; abuse is bounded by the outer CF rules).
 */
export async function checkRateLimit(
  request: NextRequest | Request,
  scope: string,
  { limit, windowSeconds }: RateLimit
): Promise<RateCheck> {
  const ip = clientIp(request);
  // No attributable IP (local dev / test harness without proxy headers):
  // limiting would throttle all traffic as one bucket, so skip. Production
  // Workers always set cf-connecting-ip.
  if (ip === "unknown") {
    return { allowed: true, remaining: limit, retryAfter: 0 };
  }
  try {
    const { env } = await getCloudflareContext({ async: true });
    const key = `rl:${scope}:${ip}`;
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - (now % windowSeconds);

    const raw = await env.LUTTERODT_KV.get(key);
    if (!raw) {
      await env.LUTTERODT_KV.put(key, JSON.stringify({ count: 1, windowStart }), {
        expirationTtl: windowSeconds * 2,
      });
      return { allowed: true, remaining: limit - 1, retryAfter: 0 };
    }

    let state: { count: number; windowStart: number };
    try {
      state = JSON.parse(raw) as { count: number; windowStart: number };
    } catch {
      state = { count: 0, windowStart };
    }

    if (state.windowStart !== windowStart) {
      state = { count: 1, windowStart };
      await env.LUTTERODT_KV.put(key, JSON.stringify(state), {
        expirationTtl: windowSeconds * 2,
      });
      return { allowed: true, remaining: limit - 1, retryAfter: 0 };
    }

    if (state.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfter: windowStart + windowSeconds - now,
      };
    }

    state.count += 1;
    await env.LUTTERODT_KV.put(key, JSON.stringify(state), {
      expirationTtl: windowSeconds * 2,
    });
    return { allowed: true, remaining: limit - state.count, retryAfter: 0 };
  } catch {
    return { allowed: true, remaining: limit, retryAfter: 0 };
  }
}

export function rateLimitedResponse(retryAfter: number) {
  return Response.json(
    { error: "Too many requests. Please slow down and try again." },
    { status: 429, headers: { "Retry-After": String(Math.max(retryAfter, 1)) } }
  );
}
