CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  name TEXT DEFAULT '',
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
