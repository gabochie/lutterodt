import { NextResponse, NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { generateLetterHtml } from "@/lib/outreach/letter";
import { isAutonomousMode, sendLetter } from "@/lib/outreach/email";
import { verifyCronAuth } from "@/lib/cf/auth";
import { searchQuery, batchSearch, importCandidates, enrichAndQueue, discoverContactEmail, BATCH_QUERIES } from "@/lib/outreach/discovery";
import { errMessage } from "@/lib/utils";

export async function GET(request: NextRequest) {
  if (!(await verifyCronAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;

    const today = new Date().toISOString().split("T")[0];

    const existingToday = await db.prepare(
      "SELECT id, profile_id, name, letter_html, status FROM outreach_queue WHERE scheduled_date = ? AND status = 'pending' LIMIT 1"
    ).bind(today).first<{ id: number; profile_id: string; name: string; letter_html: string; status: string }>();

    const [pendingCount, sentCount, totalProfiles, noLetterCount] = await Promise.all([
      db.prepare("SELECT COUNT(*) as c FROM outreach_queue WHERE status = 'pending'").first<{ c: number }>(),
      db.prepare("SELECT COUNT(*) as c FROM outreach_queue WHERE status = 'sent'").first<{ c: number }>(),
      db.prepare("SELECT COUNT(*) as c FROM outreach_profiles").first<{ c: number }>(),
      db.prepare("SELECT COUNT(*) as c FROM outreach_profiles WHERE letter_status IN ('none','new')").first<{ c: number }>(),
    ]);

    return NextResponse.json({
      ok: true,
      today: {
        date: today,
        hasPendingLetter: !!existingToday,
        pendingLetter: existingToday ? {
          id: existingToday.id,
          profile_id: existingToday.profile_id,
          name: existingToday.name,
          status: existingToday.status,
        } : null,
      },
      stats: {
        totalProfiles: totalProfiles?.c || 0,
        noLetter: noLetterCount?.c || 0,
        pendingInQueue: pendingCount?.c || 0,
        totalSent: sentCount?.c || 0,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyCronAuth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const isBatch = searchParams.get("batch") === "true";
  const count = Math.min(Math.max(parseInt(searchParams.get("count") || (isBatch ? "20" : "1")), 1), 100);

  try {
    const { env } = await getCloudflareContext({ async: true });
    const db = env.LUTTERODT_D1 as D1Database;

    const result: {
      mode: string;
      search: unknown;
      import: unknown;
      enrichment: unknown;
      queue: unknown;
      auto_send: unknown;
      stats: unknown;
    } = {
      mode: isBatch ? "batch" : "daily",
      search: null,
      import: null,
      enrichment: null,
      queue: null,
      auto_send: null,
      stats: null,
    };

    // === STEP 1: Discovery ===
    if (isBatch) {
      const batch = await batchSearch(BATCH_QUERIES, env);
      result.search = {
        totalCandidates: batch.allCandidates.length,
        perQuery: batch.perQuery,
      };
      // Import all new candidates
      const imported = await importCandidates(batch.allCandidates, db);
      result.import = imported;
      // Enrich and queue for new imports + existing profiles needing letters
      const queued = await enrichAndQueue(imported.imported, db, env, count);
      result.enrichment = { enriched: queued.enriched };
      result.queue = { queued: queued.queued, count: queued.queued.length };
    } else {
      // Original daily mode: single search, single queue
      const searchResult = await searchQuery("Lutterodt", env);
      result.search = { totalCandidates: searchResult.results.length, source: searchResult.source };

      const imported = await importCandidates(searchResult.results, db);
      result.import = imported;

      // Check existing pending for today
      const today = new Date().toISOString().split("T")[0];
      const existingToday = await db.prepare(
        "SELECT id, profile_id, name, letter_html, status FROM outreach_queue WHERE scheduled_date = ? AND status = 'pending' LIMIT 1"
      ).bind(today).first<{ id: number; profile_id: string; name: string; letter_html: string; status: string }>();
      let queuedToday = existingToday;

      if (!queuedToday) {
        const nextProfile = await db.prepare(
          "SELECT id, name, category, country, achievement, dob, letter_status, contact_email FROM outreach_profiles WHERE letter_status IN ('new', 'none') ORDER BY CASE letter_status WHEN 'new' THEN 0 ELSE 1 END, created_at ASC LIMIT 1"
        ).first<{ id: string; name: string; category: string; country: string; achievement: string; dob: string; letter_status: string; contact_email: string }>();

        if (nextProfile) {
          // Try to enrich contact email
          if (!nextProfile.contact_email) {
            const enrichment = await discoverContactEmail(nextProfile.name, nextProfile.country || "", env);
            if (enrichment.email) {
              await db.prepare("UPDATE outreach_profiles SET contact_email = ?, contact_linkedin = ?, updated_at = ? WHERE id = ?")
                .bind(enrichment.email, enrichment.linkedin, new Date().toISOString(), nextProfile.id).run();
              await db.prepare("INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, 'enriched', ?, ?)")
                .bind(nextProfile.id, `Found email: ${enrichment.email}`, new Date().toISOString()).run();
            }
          }

          const letterHtml = generateLetterHtml({
            name: nextProfile.name,
            achievement: nextProfile.achievement || "is a member of the Lutterodt family whose story deserves to be told",
            category: nextProfile.category,
            country: nextProfile.country,
            dob: nextProfile.dob || undefined,
          });

          const now = new Date().toISOString();
          const { meta } = await db.prepare(
            "INSERT INTO outreach_queue (profile_id, name, status, letter_html, scheduled_date, created_at, updated_at) VALUES (?, ?, 'pending', ?, ?, ?, ?)"
          ).bind(nextProfile.id, nextProfile.name, letterHtml, today, now, now).run();

          await db.prepare("UPDATE outreach_profiles SET letter_status = 'queued', updated_at = ? WHERE id = ?")
            .bind(now, nextProfile.id).run();
          await db.prepare("INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, 'queued', ?, ?)")
            .bind(nextProfile.id, `Daily pipeline: letter queued for ${nextProfile.name}`, now).run();

          queuedToday = { id: meta?.last_row_id as number, profile_id: nextProfile.id, name: nextProfile.name, letter_html: letterHtml, status: "pending" };
        }
      }

      result.queue = { queued: queuedToday ? [{ id: queuedToday.id, profile_id: queuedToday.profile_id, name: queuedToday.name }] : [], count: queuedToday ? 1 : 0 };
    }

    // === STEP 5: Auto-send if autonomous mode is on ===
    if (await isAutonomousMode()) {
      const pendingItems = await db.prepare(
        "SELECT q.id, q.profile_id, q.name, q.letter_html, p.contact_email FROM outreach_queue q LEFT JOIN outreach_profiles p ON q.profile_id = p.id WHERE q.status = 'pending' AND p.contact_email != '' AND p.contact_email IS NOT NULL LIMIT 1"
      ).first<{ id: number; profile_id: string; name: string; letter_html: string; contact_email: string }>();

      if (pendingItems?.contact_email) {
        const sendResult = await sendLetter({
          to: pendingItems.contact_email,
          subject: `Discovering Our Heritage — A Letter from The Lutterodt Renaissance`,
          html: pendingItems.letter_html,
          profileName: pendingItems.name,
        });
        if (sendResult.sent) {
          await db.prepare("UPDATE outreach_queue SET status = 'sent', sent_at = ?, resend_email_id = ?, updated_at = ? WHERE id = ?")
            .bind(new Date().toISOString(), sendResult.resendId || "", new Date().toISOString(), pendingItems.id).run();
          await db.prepare("UPDATE outreach_profiles SET letter_status = 'sent', updated_at = ? WHERE id = ?")
            .bind(new Date().toISOString(), pendingItems.profile_id).run();
          await db.prepare("INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, 'auto-sent', ?, ?)")
            .bind(pendingItems.profile_id, `Auto-sent to ${pendingItems.contact_email}`, new Date().toISOString()).run();
          result.auto_send = { sent: true, profile: pendingItems.name };
        } else if (sendResult.dryRun) {
          await db.prepare("INSERT INTO outreach_log (profile_id, action, details, created_at) VALUES (?, 'auto-dry-run', ?, ?)")
            .bind(pendingItems.profile_id, `Dry run: would send to ${pendingItems.contact_email}`, new Date().toISOString()).run();
          result.auto_send = { dryRun: true };
        } else {
          result.auto_send = { sent: false, error: sendResult.error };
        }
      } else {
        result.auto_send = { skipped: true, reason: "No pending items with contact email" };
      }
    } else {
      result.auto_send = { dryRun: true, reason: "Autonomous mode is OFF" };
    }

    // === STEP 6: Gather stats ===
    const [pendingCount, sentCount, totalProfiles, noLetterCount] = await Promise.all([
      db.prepare("SELECT COUNT(*) as c FROM outreach_queue WHERE status = 'pending'").first<{ c: number }>(),
      db.prepare("SELECT COUNT(*) as c FROM outreach_queue WHERE status = 'sent'").first<{ c: number }>(),
      db.prepare("SELECT COUNT(*) as c FROM outreach_profiles").first<{ c: number }>(),
      db.prepare("SELECT COUNT(*) as c FROM outreach_profiles WHERE letter_status IN ('none','new')").first<{ c: number }>(),
    ]);

    result.stats = {
      totalProfiles: totalProfiles?.c || 0,
      noLetter: noLetterCount?.c || 0,
      pendingInQueue: pendingCount?.c || 0,
      totalSent: sentCount?.c || 0,
    };

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json({ error: errMessage(err) }, { status: 500 });
  }
}
