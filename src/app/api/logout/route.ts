import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const response = NextResponse.redirect(new URL("/login", origin));
  response.cookies.set("pb_auth", "", { path: "/", maxAge: 0 });
  return response;
}
