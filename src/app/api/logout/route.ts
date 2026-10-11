import { NextResponse, NextRequest } from "next/server";
import { destroySession } from "@/lib/cf/auth";

export async function GET(request: NextRequest) {
  const session = await destroySession();
  const response = NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  response.cookies.set(session.name, session.value, session.options as Record<string, unknown>);
  return response;
}
