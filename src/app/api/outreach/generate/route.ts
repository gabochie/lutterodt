/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from "next/server";
import { verifyRequestAuth } from "@/lib/cf/auth";
import { generateLetterHtml } from "@/lib/outreach/letter";

export async function POST(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { name, achievement, category, country, dob, bio } = body;
    if (!name || !achievement) {
      return NextResponse.json({ error: "name and achievement required" }, { status: 400 });
    }
    const html = generateLetterHtml({
      name,
      achievement,
      category: category || "uncategorized",
      country: country || "Unknown",
      dob,
      bio,
      isHistorical: category === "historical" || category === "History",
    });
    return NextResponse.json({ html });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
