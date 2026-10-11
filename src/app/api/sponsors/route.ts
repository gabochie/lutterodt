import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateSponsorshipLetterHtml } from "@/lib/outreach/sponsor-letter";
import { sanitizeLetterHtml } from "@/lib/outreach/sanitize";
import { ensureOutreachTables } from "@/lib/outreach/d1";
import { verifyRequestAuth } from "@/lib/cf/auth";
import { errMessage } from "@/lib/utils";

const CONTRIBUTION_TYPES = [
  {
    name: "Archive materials",
    need: "Highest priority",
    detail:
      "Photographs, letters, certificates, church and civil registers, newspaper cuttings, business ledgers, audio and video. This is the one category that cannot be bought or crowdsourced, and it decays every year it waits.",
  },
  {
    name: "Profile verification",
    need: "Highest priority",
    detail:
      "Around 190 of 205 directory profiles still lack a confirmed date of birth or a verified career. Family members are the only authoritative source for a family archive.",
  },
  {
    name: "Oral history",
    need: "Urgent",
    detail:
      "Recorded testimony in any language. This is the only asset with a hard expiry date, because it lives and dies with the person holding it.",
  },
  {
    name: "Introductions",
    need: "High leverage",
    detail:
      "A named person in your network who would be right for a specific need. Costs you nothing and is worth more than most in-kind gifts.",
  },
  {
    name: "Professional services",
    need: "On request",
    detail:
      "Legal review of privacy and copyright terms, accounting, graphic design, translation and transcription, photography, hosting and storage.",
  },
  {
    name: "Financial",
    need: "Secondary",
    detail:
      "There are no fixed tiers or amounts. Funding conversations start from what you would like to make possible, not from a pre-set band.",
  },
];

export async function GET() {
  return NextResponse.json({ contributionTypes: CONTRIBUTION_TYPES });
}

export async function POST(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, organization, contactPerson, queue } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "name and email are required" }, { status: 400 });
    }

    const html = generateSponsorshipLetterHtml({
      name,
      email,
      contactPerson: contactPerson || name,
      organization,
    });

    if (queue) {
      const { env } = await getCloudflareContext({ async: true });
      const db = env.LUTTERODT_D1 as D1Database;
      await ensureOutreachTables(db);

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const now = new Date().toISOString();

      await db.prepare(
        "INSERT INTO outreach_queue (profile_id, name, status, letter_html, recipient_email, created_at, updated_at) VALUES (?, ?, 'pending', ?, ?, ?, ?)"
      ).bind(`sponsor-${slug}`, name, sanitizeLetterHtml(html), email, now, now).run();

      await db.prepare(
        "INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, ?, ?, ?)"
      ).bind(`sponsor-${slug}`, "sponsorship-letter-queued", `Sponsorship letter queued for ${name} <${email}>`, now).run();
    }

    return NextResponse.json({ html, name, email, organization, queued: !!queue });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}
