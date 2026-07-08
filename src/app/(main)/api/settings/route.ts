import { NextResponse, NextRequest } from "next/server";
import { getSetting, setSetting } from "@/lib/cf/kv";
import { verifyRequestCookie } from "@/lib/cf/auth";

export async function GET() {
  const value = await getSetting("coming_soon");
  return NextResponse.json({ coming_soon: value === "true" });
}

export async function POST(request: NextRequest) {
  if (!(await verifyRequestCookie(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const value = body.coming_soon === true ? "true" : "false";
  await setSetting("coming_soon", value);

  return NextResponse.json({ coming_soon: value === "true" });
}
