import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
  const pb = new PocketBase(pbUrl);

  try {
    await pb.collection("users").authWithPassword(email, password);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Login failed";
    return NextResponse.redirect(new URL("/login?error=" + encodeURIComponent(msg), request.url));
  }

  const cookieValue = JSON.stringify({ token: pb.authStore.token, record: pb.authStore.record });
  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set("pb_auth", cookieValue, {
    path: "/",
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    maxAge: 1209600,
  });

  return response;
}
