-- 0003_profile_source: provenance for directory profiles (Phase 4.2).
--
-- Records HOW each profile entered the archive (manual research, batch
-- discovery import, family submission, takedown-request context). Supports
-- the data-subject rights flow: correction/removal requests reference the
-- source when the committee reviews them.
--
-- Note: D1 has no ADD COLUMN IF NOT EXISTS. Wrangler records applied
-- migrations per database, so each file runs exactly once — never add a
-- column here that 0001 already creates.

ALTER TABLE outreach_profiles ADD COLUMN source TEXT DEFAULT '';
