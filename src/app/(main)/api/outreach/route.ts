import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getSetting, setSetting } from "@/lib/cf/kv";
import { verifyRequestAuth } from "@/lib/cf/auth";

export type OutreachStatus = "not_sent" | "sent" | "replied" | "meeting_booked" | "declined" | "follow_up";
export type OutreachChannel = "" | "email" | "linkedin" | "phone" | "mail" | "whatsapp" | "other";

export interface OutreachRecord {
  profileId: string;
  name: string;
  category: string;
  country: string;
  letter: string | null;
  status: OutreachStatus;
  channel: OutreachChannel;
  dateSent: string | null;
  notes: string;
  lastContacted: string | null;
}

const categoryLabels: Record<string, string> = {
  academia: "Academia",
  business: "Business",
  creative: "Creative",
  engineering: "Engineering & Tech",
  healthcare: "Healthcare",
  historical: "Historical",
  law: "Law",
  service: "Service",
  sports: "Sports",
};

export async function GET(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;

    // Fetch all profiles from D1
    const { results: d1Profiles } = await db.prepare(
      "SELECT id, name, category, country, letter_status FROM outreach_profiles ORDER BY name"
    ).all<{ id: string; name: string; category: string; country: string; letter_status: string }>();

    // Fetch queued letters for profile_id mapping
    const { results: queuedItems } = await db.prepare(
      "SELECT DISTINCT profile_id FROM outreach_queue WHERE letter_html IS NOT NULL AND letter_html != ''"
    ).all<{ profile_id: string }>();

    const hasQueuedLetter = new Set((queuedItems || []).map((q) => q.profile_id));

    // Load existing outreach status from KV
    const statusMap = new Map<string, Partial<OutreachRecord>>();
    const stored = await getSetting("outreach");
    if (stored) {
      try {
        const parsed: OutreachRecord[] = JSON.parse(stored);
        for (const r of parsed) {
          statusMap.set(r.profileId, {
            status: r.status,
            channel: r.channel,
            dateSent: r.dateSent,
            notes: r.notes,
            lastContacted: r.lastContacted,
          });
        }
      } catch { /* ignore parse errors */ }
    }

    const records: OutreachRecord[] = (d1Profiles || []).map((p) => {
      const existing = statusMap.get(p.id);
      return {
        profileId: p.id,
        name: p.name,
        category: categoryLabels[p.category] || p.category,
        country: p.country,
        letter: hasQueuedLetter.has(p.id) ? `/api/outreach/letter/${p.id}` : null,
        status: existing?.status || "not_sent",
        channel: existing?.channel || "",
        dateSent: existing?.dateSent || null,
        notes: existing?.notes || "",
        lastContacted: existing?.lastContacted || null,
      };
    });

    return NextResponse.json(records);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  await setSetting("outreach", JSON.stringify(body));
  return NextResponse.json(body);
}
