import { NextResponse, NextRequest } from "next/server";
import { createContact } from "@/lib/cf/d1";
import { leadSchema, parseBody } from "@/lib/validate";
import { LIMITS, checkRateLimit, rateLimitedResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rate = await checkRateLimit(request, "leads", LIMITS.publicWrite);
  if (!rate.allowed) {
    const ct0 = request.headers.get("content-type") || "";
    if (ct0.includes("application/json")) return rateLimitedResponse(rate.retryAfter);
    return NextResponse.redirect(new URL("/?error=Too+many+requests", request.url));
  }
  let email = "", name = "", whatsapp = "", subject = "", message = "", category = "";

  const ct = request.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = await request.json();
    email = body.email || "";
    name = body.name || "";
    whatsapp = body.whatsapp || "";
    subject = body.subject || "";
    message = body.message || "";
    category = body.category || "";
  } else {
    const formData = await request.formData();
    email = (formData.get("email") as string) || "";
    name = (formData.get("name") as string) || "";
    whatsapp = (formData.get("whatsapp") as string) || "";
    subject = (formData.get("subject") as string) || "";
    message = (formData.get("message") as string) || "";
    category = (formData.get("category") as string) || "";
  }

  const parsed = parseBody(leadSchema, { email, name, whatsapp, subject, message, category });
  if (!parsed.ok) {
    if (ct.includes("application/json")) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    return NextResponse.redirect(new URL("/?error=Invalid+email", request.url));
  }
  const input = parsed.data;

  try {
    await createContact({ email: input.email, name: input.name, whatsapp: input.whatsapp, subject: input.subject || "Website Enquiry", message: input.message, category: input.category || "lead", status: "new" });

    if (ct.includes("application/json")) {
      return NextResponse.json({ ok: true, message: "Message received. We'll be in touch." });
    }
    return NextResponse.redirect(new URL("/?success=Message+sent", request.url));
  } catch {
    if (ct.includes("application/json")) {
      return NextResponse.json({ error: "Could not register" }, { status: 500 });
    }
    return NextResponse.redirect(new URL("/?error=Could+not+register", request.url));
  }
}
