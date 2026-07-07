import { NextResponse } from "next/server";
import { createContact } from "@/lib/cf/d1";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
  } catch {
    return NextResponse.redirect(new URL("/?error=Could+not+register", request.url));
  }

  return NextResponse.redirect(new URL("/?success=You+are+on+the+list", request.url));
}
