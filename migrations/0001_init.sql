-- 0001_init: consolidated baseline schema for lutterodt-db.
--
-- Replaces all per-request ensure*() DDL (ensureOutreachTables,
-- ensureSubscribersTable, inline ALTER TABLE try/catch). Applies cleanly to
-- both fresh and existing databases: every statement is IF NOT EXISTS, so
-- re-running against production (which already has these tables) is a no-op.
--
-- Apply locally:  npm run db:migrate:local
-- Apply to prod:   npm run db:migrate:remote  (also runs automatically on deploy)

-- --- Content tables (previously src/lib/cf/schema.sql) ---

CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  name TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  subject TEXT DEFAULT '',
  message TEXT DEFAULT '',
  category TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  category TEXT DEFAULT '',
  status TEXT DEFAULT 'draft',
  author TEXT DEFAULT '',
  featured_image TEXT DEFAULT '',
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS timeline_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year TEXT NOT NULL,
  category TEXT DEFAULT '',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  filter TEXT DEFAULT '',
  images TEXT DEFAULT '[]',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  src TEXT NOT NULL,
  alt TEXT DEFAULT '',
  tag TEXT DEFAULT '',
  title TEXT DEFAULT '',
  filter TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

-- --- Outreach pipeline (previously ensureOutreachTables) ---

CREATE TABLE IF NOT EXISTS outreach_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  dob TEXT DEFAULT '',
  category TEXT DEFAULT 'uncategorized',
  country TEXT DEFAULT '',
  achievement TEXT DEFAULT '',
  has_letter INTEGER DEFAULT 0,
  letter_status TEXT DEFAULT 'none',
  letter_html TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  contact_linkedin TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  created_at TEXT DEFAULT '',
  updated_at TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS outreach_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  letter_html TEXT DEFAULT '',
  scheduled_date TEXT DEFAULT '',
  sent_at TEXT DEFAULT '',
  recipient_email TEXT DEFAULT '',
  resend_email_id TEXT DEFAULT '',
  error TEXT DEFAULT '',
  created_at TEXT DEFAULT '',
  updated_at TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS outreach_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT DEFAULT '',
  created_at TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS outreach_blind_spots (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  progress INTEGER DEFAULT 0,
  created_at TEXT DEFAULT '',
  updated_at TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS research_drafts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT DEFAULT 'enrichment',
  profile_id TEXT DEFAULT '',
  name TEXT NOT NULL,
  claims_json TEXT DEFAULT '[]',
  summary TEXT DEFAULT '',
  status TEXT DEFAULT 'draft',
  reviewed_by TEXT DEFAULT '',
  reviewed_at TEXT DEFAULT '',
  created_at TEXT DEFAULT '',
  updated_at TEXT DEFAULT ''
);

-- --- Client services / reunion ---

CREATE TABLE IF NOT EXISTS reunion_updates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attendee_name TEXT NOT NULL,
  message TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  created_at TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS client_services_catalog (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT DEFAULT '',
  pricing TEXT DEFAULT '',
  deliverables TEXT DEFAULT '',
  active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT '',
  updated_at TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT DEFAULT '',
  access_code TEXT NOT NULL,
  status TEXT DEFAULT 'lead',
  notes TEXT DEFAULT '',
  created_at TEXT DEFAULT '',
  updated_at TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS service_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  service_interest TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  created_at TEXT DEFAULT ''
);

-- --- Newsletter (previously ensureSubscribersTable) ---

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  name TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  confirm_token TEXT NOT NULL,
  unsubscribe_token TEXT NOT NULL,
  confirmed_at TEXT,
  unsubscribed_at TEXT,
  source TEXT DEFAULT 'footer',
  created_at TEXT DEFAULT (datetime('now'))
);

-- --- Hot-path indexes (every request hits these filters) ---

CREATE INDEX IF NOT EXISTS idx_queue_status_date ON outreach_queue (status, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_profiles_letter_status ON outreach_profiles (letter_status);
CREATE INDEX IF NOT EXISTS idx_log_profile ON outreach_log (profile_id);
