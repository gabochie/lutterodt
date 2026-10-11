-- 0002_client_code_hash: stop storing client access codes in plaintext.
--
-- New codes are hashed (SHA-256 + AUTH_SECRET pepper, see hashAccessCode in
-- src/lib/cf/auth.ts). Existing rows keep their plaintext code until the
-- owner's next successful login, which transparently upgrades them
-- (hash stored, plaintext blanked). Safe to re-run: IF NOT EXISTS.

ALTER TABLE clients ADD COLUMN access_code_hash TEXT DEFAULT '';
