import { NextResponse, NextRequest } from "next/server";
import { createContact } from "@/lib/cf/d1";

export async function POST(request: NextRequest) {
  let email = "";

  // Accept both JSON and form-data
  const ct = request.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = await request.json();
    email = body.email || "";
  } else {
    const formData = await request.formData();
    email = (formData.get("email") as string) || "";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (ct.includes("application/json")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    return NextResponse.redirect(new URL("/?error=Invalid+email", request.url));
  }

  try {
    await createContact({
      email,
      name: "",
      subject: "Coming Soon Lead",
      message: "",
      category: "lead",
      status: "new",
    });

    if (ct.includes("application/json")) {
      return NextResponse.json({ ok: true, message: "You are on the list" });
    }
    return NextResponse.redirect(new URL("/?success=You+are+on+the+list", request.url));
  } catch {
    if (ct.includes("application/json")) {
      return NextResponse.json({ error: "Could not register" }, { status: 500 });
    }
    return NextResponse.redirect(new URL("/?error=Could+not+register", request.url));
  }
}
