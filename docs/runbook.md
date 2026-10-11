# Lutterodt Operations Runbook

How to deploy, defend, back up, and recover this site. Written for the owner
with no DevOps background — every procedure is copy-paste.

## 1. Environments & secrets

| Secret | GitHub Actions | Cloudflare Worker | Purpose |
|--------|---------------|-------------------|---------|
| `CLOUDFLARE_API_TOKEN` / `ACCOUNT_ID` | ✅ required | — | Deploy + migrate + backup from CI |
| `AUTH_SECRET` (≥32 chars) | — | ✅ secret | Signs admin + client sessions |
| `ADMIN_PASSWORD` (≥8 chars) | — | ✅ secret | Admin login |
| `CRON_SECRET` (≥16, rotate to 32) | ✅ required | ✅ secret | Daily pipeline + smoke auth |
| `RESEND_API_KEY` | — | ✅ secret | Real email sends (else dry-run) |
| `BRAVE_API_KEY` | — | ✅ secret | Discovery search (else DDG) |
| `NEXT_PUBLIC_GA_ID` | ✅ required | ✅ secret | Baked into bundle at CI build time |
| `NEXT_PUBLIC_CLARITY_ID` | ✅ required | ✅ secret | Same as above |
| `TURNSTILE_SECRET_KEY` | — | ✅ secret | Captcha verification (see §4) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ✅ required | ✅ secret | Captcha widget (see §4) |
| PocketBase trio | ❌ delete | ❌ delete | Dead legacy, code never reads them |

`NEXT_PUBLIC_*` values must exist in **both** places: GitHub feeds the
build, Cloudflare feeds runtime probes.

## 2. Deploy & rollback

- Push to `master` → CI runs lint → typecheck → E2E → worker-bundle build →
  D1 migrations → deploy. Watch it: `gh run list --branch master`.
- Rollback: `git revert <commit> && git push` (data migrations are additive,
  so reverting code never breaks the database).
- Preview a PR: open a pull request → `preview` job deploys to
  `lutterodt-preview.workers.dev`. One-time setup first:
  ```powershell
  wrangler d1 create lutterodt-db-preview
  wrangler kv namespace create LUTTERODT_KV_PREVIEW
  ```
  then paste the IDs into `wrangler.jsonc` → `env.preview`.

## 3. Defense in depth (abuse)

Three layers, cheapest first:

1. **In-app rate limiting** (`src/lib/rate-limit.ts`, KV sliding window):
   10/min per IP on public writes, 5/min on login. Fail-open if KV is down.
2. **Turnstile captcha** on contact / newsletter / services forms (§4).
3. **Cloudflare Rate Limiting Rules** (dashboard → Security → Rate limiting):
   create a rule matching `/api/*` at 100 req/min per IP with a 10-min
   timeout. This is the outer wall the app code assumes exists.

## 4. Turnstile setup (one-time, ~10 min)

1. Cloudflare dashboard → **Turnstile** → **Add widget** → name
   "lutterodt-forms", mode **Managed**, domains: `lutterodt.org`.
2. Copy the **site key** → GitHub Actions secret
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (+ Worker secret of the same name).
3. Copy the **secret key** → Worker secret `TURNSTILE_SECRET_KEY`.
4. Push to `master` (site key bakes into the bundle) and submit each form
   once. Admin → `/api/outreach/health` → "Turnstile" check flips to ok.

Until then the widget renders nothing and verification is skipped — the
health check keeps that gap visible.

## 5. Observability

- No Sentry by design (edge-runtime agents are brittle here). All
  significant events log as single-line JSON via `src/lib/log.ts`
  (`event`, `level`, fields).
- Cloudflare dashboard → **Workers & Pages** → `lutterodt` →
  **Observability** → enable. Then filter logs by event name, e.g.
  `newsletter.confirm_send_failed`.
- Local tail: `npx wrangler tail lutterodt --format json`.
- Liveness: `https://lutterodt.org/api/health` (public, no secrets).
  Detail: `/api/outreach/health` (admin auth).

## 6. Disaster recovery

- **Backups:** Sundays 03:00 UTC, `backup.yml` exports gzipped D1 snapshots
  to the `lutterodt-backups` R2 bucket. One-time setup:
  `wrangler r2 bucket create lutterodt-backups`. Verify monthly:
  `wrangler r2 object get lutterodt-backups/d1-<date>.sql.gz`.
- **Restore to a scratch DB first, never prod directly:**
  ```powershell
  wrangler d1 create lutterodt-db-restore
  # upload snapshot, then:
  wrangler d1 execute lutterodt-db-restore --remote --file=./restore.sql
  ```
  Point a preview worker at it, verify, then promote.
- **If the site is down:** check `/api/health` → worker logs → recent
  deploys (`gh run list`). Roll back code first (fast), restore data only
  if rows are actually missing.

## 8. Performance notes

- Images are raw `<img loading="lazy">` with explicit dimensions on purpose:
  `next/image` optimization has no server on Workers. If bandwidth becomes a
  concern, serve via the `IMAGES` binding (`/cdn-cgi/image/…`) before
  reaching for anything else.
- Documents are intentionally uncached at the edge (`s-maxage=0`) while the
  archive changes fast. When content stabilizes, enable the R2 incremental
  cache: create a bucket, uncomment `incrementalCache` in
  `open-next.config.ts`, and add the R2 binding. Until then, do not cache
  HTML — stale family data is worse than a slow page.
- `framer-motion` and the duplicate shadcn `ui/` system were removed
  (2026-10-11, zero imports). One design language: `shared/`.

## 7. Incident playbook

| Symptom | First check | Then |
|---------|------------|------|
| `[alert]` issue from daily pipeline | `/api/outreach/health` (D1? RESEND?) | Worker logs, re-run workflow manually |
| `[alert]` issue from smoke | `/api/health` | Last deploy diff, rollback if needed |
| `[alert]` issue from backup | R2 bucket exists? Token scopes? | Re-run, verify snapshot downloads |
| Spam wave in leads/newsletter | KV `rl:*` keys climbing? | Tighten CF rate rule, enable "Under Attack" mode temporarily |
| "Data collection isn't active" (GA) | Tag Assistant → DebugView | Property/stream mismatch (see audit history) |
