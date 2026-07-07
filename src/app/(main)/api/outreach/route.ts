import { NextResponse, NextRequest } from "next/server";
import { getSetting, setSetting } from "@/lib/cf/kv";
import { verifySession } from "@/lib/cf/auth";
import { profiles } from "@/data/profiles";
import { categoryLabels } from "@/data/profiles";

export type OutreachStatus = "not_sent" | "sent" | "replied" | "meeting_booked" | "declined" | "follow_up";
export type OutreachChannel = "" | "email" | "linkedin" | "phone" | "mail" | "whatsapp" | "other";

export interface OutreachRecord {
  profileId: string;
  name: string;
  category: string;
  country: string;
  letter: string;
  status: OutreachStatus;
  channel: OutreachChannel;
  dateSent: string | null;
  notes: string;
  lastContacted: string | null;
}

function seedFromProfiles(): OutreachRecord[] {
  return profiles.map((p) => ({
    profileId: p.id,
    name: p.name,
    category: categoryLabels[p.category] || p.category,
    country: p.country,
    letter: p.letter,
    status: "not_sent" as OutreachStatus,
    channel: "" as OutreachChannel,
    dateSent: null,
    notes: "",
    lastContacted: null,
  }));
}

export async function GET() {
  const value = await getSetting("outreach");
  if (!value) {
    return NextResponse.json(seedFromProfiles());
  }
  try {
    return NextResponse.json(JSON.parse(value));
  } catch {
    return NextResponse.json(seedFromProfiles());
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifySession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  await setSetting("outreach", JSON.stringify(body));
  return NextResponse.json(body);
}
