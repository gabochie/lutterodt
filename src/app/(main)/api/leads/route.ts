import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.redirect(new URL("/?error=Invalid+email", request.url));
  }

  const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090";
  const pb = new PocketBase(pbUrl);

  try {
    await pb.collection("contacts").create({
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
