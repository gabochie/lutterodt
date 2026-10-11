import { NextResponse } from "next/server";
import { createSession, getAdminPassword } from "@/lib/cf/auth";
import { LIMITS, checkRateLimit, rateLimitedResponse } from "@/lib/rate-limit";

function timingSafeEqualString(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(request: Request) {
  const rate = await checkRateLimit(request, "admin-login", LIMITS.login);
  if (!rate.allowed) return rateLimitedResponse(rate.retryAfter);

  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  let adminPassword: string;
  try {
    adminPassword = getAdminPassword();
  } catch {
    return NextResponse.json(
      { error: "Admin login is not configured" },
      { status: 503 }
    );
  }

  if (!password || !timingSafeEqualString(password, adminPassword)) {
    return NextResponse.redirect(
      new URL("/login?error=Invalid+credentials", request.url)
    );
  }

  const session = await createSession(email || "admin@lutterodt.org");
  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set(session.name, session.value, session.options as Record<string, unknown>);

  return response;
}
