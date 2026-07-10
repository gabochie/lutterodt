import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateSponsorshipLetterHtml } from "@/lib/outreach/sponsor-letter";
import { ensureOutreachTables } from "@/lib/outreach/d1";
import { verifyRequestAuth } from "@/lib/cf/auth";

const TIERS = [
  { name: "Patron", amount: "$10,000+", benefits: "Naming rights on a major exhibit, permanent recognition in the Digital Museum, private tour for 10 guests at the Neo-Manor (when built), annual impact report, featured listing on all project materials." },
  { name: "Benefactor", amount: "$5,000–$9,999", benefits: "Named attribution on a gallery wing, recognition in the Digital Museum, private tour for 4 guests, annual impact report." },
  { name: "Supporter", amount: "$1,000–$4,999", benefits: "Recognition in the Digital Museum contributors wall, exclusive digital content access, newsletter updates." },
  { name: "Friend", amount: "Up to $999", benefits: "Listing in the Friends of the Renaissance roll, newsletter updates, digital thank-you card." },
];

export async function GET() {
  return NextResponse.json({ tiers: TIERS });
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
      ).bind(`sponsor-${slug}`, name, html, email, now, now).run();

      await db.prepare(
        "INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, ?, ?, ?)"
      ).bind(`sponsor-${slug}`, "sponsorship-letter-queued", `Sponsorship letter queued for ${name} <${email}>`, now).run();
    }

    return NextResponse.json({ html, name, email, organization, queued: !!queue });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
