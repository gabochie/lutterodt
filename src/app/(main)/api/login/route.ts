import { NextResponse } from "next/server";
import { getAdminPassword, createSession } from "@/lib/cf/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const expected = getAdminPassword();
  const pwSource = process.env.ADMIN_PASSWORD ? "from env" : "from fallback";

  if (password !== expected) {
    return NextResponse.redirect(
      new URL(`/login?error=Invalid+credentials&pw=${pwSource}&len=${expected.length}`, request.url)
    );
  }

  const session = await createSession(email || "admin@lutterodt.org");
  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set(session.name, session.value, session.options as any);

  return response;
}
