import { NextResponse, NextRequest } from "next/server";
import PocketBase from "pocketbase";
import { getSetting, setSetting } from "@/lib/pocketbase/settings";

export async function GET() {
  const value = await getSetting("coming_soon");
  return NextResponse.json({ coming_soon: value === "true" });
}

export async function POST(request: NextRequest) {
  const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
  const pb = new PocketBase(pbUrl);

  const authCookie = request.cookies.get("pb_auth");
  if (authCookie) {
    pb.authStore.loadFromCookie(`pb_auth=${authCookie.value}`);
  }

  try {
    if (pb.authStore.isValid) {
      await pb.collection("users").authRefresh();
    }
  } catch {
    pb.authStore.clear();
  }

  if (!pb.authStore.isValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const value = body.coming_soon === true ? "true" : "false";
  await setSetting("coming_soon", value);

  return NextResponse.json({ coming_soon: value === "true" });
}
