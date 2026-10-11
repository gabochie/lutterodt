import { NextResponse } from "next/server";
import { getRecordCount } from "@/lib/cf/d1";

export async function GET() {
  const [articles, timeline, gallery, contacts] = await Promise.all([
    getRecordCount("articles"),
    getRecordCount("timeline_events"),
    getRecordCount("gallery_items"),
    getRecordCount("contacts"),
  ]);

  return NextResponse.json({
    articles,
    timeline,
    gallery,
    contacts,
    settings: 0,
  });
}
