import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sendLetter } from "@/lib/outreach/email";
import { verifyRequestAuth } from "@/lib/cf/auth";
import { errMessage } from "@/lib/utils";

async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

export async function POST(request: NextRequest) {
  if (!(await verifyRequestAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDB();

    const { queue_id } = await request.json();
    if (!queue_id) {
      return NextResponse.json({ error: "queue_id required" }, { status: 400 });
    }

    const item = await db.prepare(
      "SELECT * FROM outreach_queue WHERE id = ?"
    ).bind(queue_id).first<{ id: number; profile_id: string; name: string; letter_html: string; recipient_email: string; status: string }>();

    if (!item) {
      return NextResponse.json({ error: "Queue item not found" }, { status: 404 });
    }

    if (item.status === "sent") {
      return NextResponse.json({ error: "Already sent" }, { status: 400 });
    }

    // Get recipient email from profile if not set on queue item
    let to = item.recipient_email;
    if (!to) {
      const profile = await db.prepare(
        "SELECT contact_email FROM outreach_profiles WHERE id = ?"
      ).bind(item.profile_id).first<{ contact_email: string }>();
      to = profile?.contact_email || "";
    }

    if (!to) {
      return NextResponse.json({ error: "No recipient email found for this profile" }, { status: 400 });
    }

    const result = await sendLetter({
      to,
      subject: `Discovering Our Heritage — A Letter from The Lutterodt Renaissance`,
      html: item.letter_html,
      profileName: item.name,
    });

    const now = new Date().toISOString();

    if (result.sent) {
      await db.prepare(
        "UPDATE outreach_queue SET status = 'sent', sent_at = ?, resend_email_id = ?, updated_at = ? WHERE id = ?"
      ).bind(now, result.resendId || "", now, item.id).run();

      await db.prepare(
        "UPDATE outreach_profiles SET letter_status = 'sent', updated_at = ? WHERE id = ?"
      ).bind(now, item.profile_id).run();

      await db.prepare(
        "INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, 'sent', ?, ?)"
      ).bind(item.profile_id, `Letter sent to ${to} via Resend (${result.resendId})`, now).run();
    } else if (result.dryRun) {
      await db.prepare(
        "INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, 'dry-run', ?, ?)"
      ).bind(item.profile_id, `Dry run: would send letter to ${to}`, now).run();
    } else {
      await db.prepare(
        "UPDATE outreach_queue SET error = ?, updated_at = ? WHERE id = ?"
      ).bind(result.error || "Unknown error", now, item.id).run();

      await db.prepare(
        "INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, 'send-failed', ?, ?)"
      ).bind(item.profile_id, `Failed to send to ${to}: ${result.error}`, now).run();
    }

    return NextResponse.json({
      ok: true,
      sent: result.sent,
      dryRun: result.dryRun,
      resendId: result.resendId,
      error: result.error,
      recipient: to,
    });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}
