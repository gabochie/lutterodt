export interface DbProfile {
  id: string;
  name: string;
  dob: string;
  category: string;
  country: string;
  achievement: string;
  has_letter: number;
  letter_status: string;
  letter_html: string;
  contact_email: string;
  contact_linkedin: string;
  notes: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface DbQueueItem {
  id: number;
  profile_id: string;
  name: string;
  status: string;
  letter_html: string;
  scheduled_date: string;
  sent_at: string;
  recipient_email: string;
  resend_email_id: string;
  error: string;
  created_at: string;
  updated_at: string;
}

export interface DbBlindSpot {
  id: string;
  title: string;
  priority: string;
  status: string;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface DbLogEntry {
  id: number;
  profile_id: string;
  action: string;
  details: string;
  created_at: string;
}

export async function ensureOutreachTables(db: D1Database): Promise<void> {
  await db.prepare(
    "CREATE TABLE IF NOT EXISTS outreach_profiles (id TEXT PRIMARY KEY, name TEXT NOT NULL, dob TEXT DEFAULT '', category TEXT DEFAULT 'uncategorized', country TEXT DEFAULT '', achievement TEXT DEFAULT '', has_letter INTEGER DEFAULT 0, letter_status TEXT DEFAULT 'none', letter_html TEXT DEFAULT '', contact_email TEXT DEFAULT '', contact_linkedin TEXT DEFAULT '', notes TEXT DEFAULT '', image_url TEXT DEFAULT '', created_at TEXT DEFAULT '', updated_at TEXT DEFAULT '')"
  ).run();
  // Migration: add image_url column for existing tables
  try { await db.prepare("ALTER TABLE outreach_profiles ADD COLUMN image_url TEXT DEFAULT ''").run(); } catch { /* already exists */ }
  await db.prepare(
    "CREATE TABLE IF NOT EXISTS outreach_queue (id INTEGER PRIMARY KEY AUTOINCREMENT, profile_id TEXT NOT NULL, name TEXT NOT NULL, status TEXT DEFAULT 'pending', letter_html TEXT DEFAULT '', scheduled_date TEXT DEFAULT '', sent_at TEXT DEFAULT '', recipient_email TEXT DEFAULT '', resend_email_id TEXT DEFAULT '', error TEXT DEFAULT '', created_at TEXT DEFAULT '', updated_at TEXT DEFAULT '')"
  ).run();
  await db.prepare(
    "CREATE TABLE IF NOT EXISTS outreach_log (id INTEGER PRIMARY KEY AUTOINCREMENT, profile_id TEXT NOT NULL, action TEXT NOT NULL, details TEXT DEFAULT '', created_at TEXT DEFAULT '')"
  ).run();
  await db.prepare(
    "CREATE TABLE IF NOT EXISTS outreach_blind_spots (id TEXT PRIMARY KEY, title TEXT NOT NULL, priority TEXT DEFAULT 'medium', status TEXT DEFAULT 'open', progress INTEGER DEFAULT 0, created_at TEXT DEFAULT '', updated_at TEXT DEFAULT '')"
  ).run();
  await db.prepare(
    "CREATE TABLE IF NOT EXISTS reunion_updates (id INTEGER PRIMARY KEY AUTOINCREMENT, attendee_name TEXT NOT NULL, message TEXT DEFAULT '', photo_url TEXT DEFAULT '', created_at TEXT DEFAULT '')"
  ).run();
}

export function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

export function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
