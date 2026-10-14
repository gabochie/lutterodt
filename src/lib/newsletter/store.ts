import { getCloudflareContext } from "@opennextjs/cloudflare";
import { siteConfig } from "@/config/site";

const CONFIRM_TTL_DAYS = 30;

export type SubscriberStatus = "pending" | "confirmed" | "unsubscribed";

export interface Subscriber {
  id: number;
  email: string;
  name: string;
  status: SubscriberStatus;
  confirm_token: string;
  unsubscribe_token: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
}

async function getDB(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return env.LUTTERODT_D1 as D1Database;
}

/**
 * Newsletter subscribers live in their own table rather than in `contacts`,
 * so an opted-in subscriber is never conflated with a contact enquiry and can
 * be exported or honoured as a suppression list independently.
 */
function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Registers (or re-registers) a subscriber in the pending state.
 *
 * Re-subscribing an unsubscribed address issues a fresh confirmation token so
 * the person genuinely re-consents. A pending address is left untouched to
 * avoid sending duplicate confirmation mail on a double submit.
 */
export async function subscribe(email: string, name = "", source = "footer"): Promise<{
  status: "pending" | "already_pending" | "resubscribed";
  confirmToken: string;
  unsubscribeToken: string;
  email: string;
}> {
  const db = await getDB();

  const address = normalizeEmail(email);
  const existing = await db
    .prepare("SELECT * FROM newsletter_subscribers WHERE email = ?")
    .bind(address)
    .first<Subscriber>();

  const now = new Date().toISOString();

  if (existing && existing.status === "pending") {
    return {
      status: "already_pending",
      confirmToken: existing.confirm_token,
      unsubscribeToken: existing.unsubscribe_token,
      email: address,
    };
  }

  if (existing && existing.status === "confirmed") {
    return {
      status: "already_pending",
      confirmToken: existing.confirm_token,
      unsubscribeToken: existing.unsubscribe_token,
      email: address,
    };
  }

  const confirmToken = randomToken();
  const unsubscribeToken = existing?.unsubscribe_token || randomToken();

  if (existing) {
    await db
      .prepare(
        "UPDATE newsletter_subscribers SET status = 'pending', name = ?, confirm_token = ?, " +
          "confirmed_at = NULL, unsubscribed_at = NULL, source = ? WHERE email = ?"
      )
      .bind(name || existing.name, confirmToken, source, address)
      .run();
    return { status: "resubscribed", confirmToken, unsubscribeToken, email: address };
  }

  await db
    .prepare(
      "INSERT INTO newsletter_subscribers (email, name, status, confirm_token, unsubscribe_token, source, created_at) " +
        "VALUES (?, ?, 'pending', ?, ?, ?, ?)"
    )
    .bind(address, name, confirmToken, unsubscribeToken, source, now)
    .run();

  return { status: "pending", confirmToken, unsubscribeToken, email: address };
}

/** Confirms a pending subscription. Returns false for unknown or stale tokens. */
export async function confirmSubscription(confirmToken: string): Promise<boolean> {
  if (!confirmToken) return false;
  const db = await getDB();

  const row = await db
    .prepare(
      "SELECT id, created_at FROM newsletter_subscribers WHERE confirm_token = ? AND status = 'pending'"
    )
    .bind(confirmToken)
    .first<{ id: number; created_at: string }>();

  if (!row) return false;

  // Confirmation links expire so a leaked old mail cannot silently re-consent.
  const created = Date.parse(`${row.created_at.replace(" ", "T")}Z`);
  if (Number.isFinite(created) && Date.now() - created > CONFIRM_TTL_DAYS * 86_400_000) {
    return false;
  }

  await db
    .prepare(
      "UPDATE newsletter_subscribers SET status = 'confirmed', confirmed_at = ? WHERE id = ?"
    )
    .bind(new Date().toISOString(), row.id)
    .run();

  return true;
}

/** Unsubscribes. Safe to call repeatedly. */
export async function unsubscribe(unsubscribeToken: string): Promise<boolean> {
  if (!unsubscribeToken) return false;
  const db = await getDB();

  const row = await db
    .prepare(
      "SELECT id, status FROM newsletter_subscribers WHERE unsubscribe_token = ?"
    )
    .bind(unsubscribeToken)
    .first<{ id: number; status: string }>();

  if (!row) return false;
  if (row.status === "unsubscribed") return true;

  await db
    .prepare(
      "UPDATE newsletter_subscribers SET status = 'unsubscribed', unsubscribed_at = ? WHERE id = ?"
    )
    .bind(new Date().toISOString(), row.id)
    .run();

  return true;
}

export async function listConfirmedSubscribers(): Promise<{ email: string; name: string }[]> {
  const db = await getDB();
  const { results } = await db
    .prepare(
      "SELECT email, name FROM newsletter_subscribers WHERE status = 'confirmed' ORDER BY created_at"
    )
    .all<{ email: string; name: string }>();
  return results || [];
}

export async function countSubscribers(): Promise<{ pending: number; confirmed: number; unsubscribed: number }> {
  const db = await getDB();
  const row = await db
    .prepare(
      "SELECT " +
        "SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending, " +
        "SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed, " +
        "SUM(CASE WHEN status = 'unsubscribed' THEN 1 ELSE 0 END) AS unsubscribed " +
        "FROM newsletter_subscribers"
    )
    .first<{ pending: number | null; confirmed: number | null; unsubscribed: number | null }>();

  return {
    pending: row?.pending || 0,
    confirmed: row?.confirmed || 0,
    unsubscribed: row?.unsubscribed || 0,
  };
}

function siteBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  return `https://${siteConfig.domain}`;
}

export function buildConfirmUrl(confirmToken: string): string {
  return `${siteBaseUrl()}/newsletter/confirm?token=${encodeURIComponent(confirmToken)}`;
}

export function buildUnsubscribeUrl(unsubscribeToken: string): string {
  return `${siteBaseUrl()}/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function confirmationEmailHtml(params: {
  name?: string;
  confirmUrl: string;
  unsubscribeUrl: string;
}): string {
  const greeting = params.name ? `Hello ${escapeHtml(params.name)},` : "Hello,";
  return `<!doctype html>
<html><body style="margin:0;background:#0B0A0F;font-family:Georgia,serif;color:#F5F1E8;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <p style="font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:#FAA110;margin:0 0 24px;">The Lutterodt Renaissance</p>
    <h1 style="font-size:24px;line-height:1.3;margin:0 0 16px;color:#F5F1E8;">Confirm your subscription</h1>
    <p style="font-size:15px;line-height:1.7;color:rgba(245,241,232,.75);margin:0 0 20px;">${greeting}</p>
    <p style="font-size:15px;line-height:1.7;color:rgba(245,241,232,.75);margin:0 0 28px;">Please confirm that you would like to receive the quarterly archive bulletin. We will only write a few times a year, and you can stop at any time.</p>
    <p style="margin:0 0 28px;">
      <a href="${params.confirmUrl}" style="display:inline-block;background:#FAA110;color:#0B0A0F;padding:14px 26px;text-decoration:none;font-family:ui-monospace,monospace;font-size:12px;letter-spacing:.15em;text-transform:uppercase;">Confirm subscription</a>
    </p>
    <p style="font-size:13px;line-height:1.7;color:rgba(245,241,232,.5);margin:0 0 8px;">If the button does not work, copy this link into your browser:<br><span style="word-break:break-all;">${params.confirmUrl}</span></p>
    <hr style="border:none;border-top:1px solid rgba(245,241,232,.12);margin:28px 0;">
    <p style="font-size:12px;line-height:1.7;color:rgba(245,241,232,.45);margin:0;">You are receiving this because someone entered this address on ${siteConfig.domain}.<br><a href="${params.unsubscribeUrl}" style="color:rgba(245,241,232,.45);">Unsubscribe</a> if you would rather not hear from us.</p>
  </div>
</body></html>`;
}
