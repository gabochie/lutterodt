# Lutterodt — Production-Grade MVP Audit

**Date:** 2026-10-11 | **Auditor:** senior dev + DevOps | **Scope:** full repo (`src/`, `scripts/`, `.github/`, `wrangler.jsonc`, `next.config.ts`, `package.json`)
**Stack:** Next.js 16.2.10 (App Router) + React 19 + Tailwind v4 + OpenNext Cloudflare + D1 + KV. Deployed as `lutterodt` Worker, custom domain `lutterodt.org`.
**Working tree:** clean on `master`. `typecheck` passes. `lint` fails (~40+ errors, see §5).

> Verdict: **strong vibe-coded foundation, not yet production-grade.** Auth model is sound, security headers are good, E2E breadth (18 spec files) is impressive. But quality gates don't gate, DB has no migrations, public write endpoints have no rate limiting, there are two API trees and two sources of truth, and there is zero observability/backup. Fix P0s before any public launch handling PII at scale.

---

## 1. P0 — Must fix before production (launch blockers)

### P0-1. Quality gates don't gate (lint + E2E are advisory)
- **Evidence:** `.github/workflows/ci-cd.yml:26-28` (`lint` has `continue-on-error: true`, comment "pre-existing debt"), `:36` (`e2e` has `continue-on-error: true`). Live `npm run lint` output confirms ~40+ `no-explicit-any` errors shipping on every merge (`CommandCenterClient.tsx:14,17,18,29,32,36,55,69,86,323,338,362`, `command-center/page.tsx:18,23,63,66`, `admin/page.tsx:80`, all `(main)/api/*` routes) + `react/no-unescaped-entities` in `admin/page.tsx:179,222,256` + unused imports (`admin/clients/page.tsx:4`, `admin/scheduler/page.tsx:6`, `admin/web-finder/page.tsx:4`).
- **Risk:** type-safety theater. `any` in every API catch block + admin client means refactors silently break; lint debt grows unbounded.
- **Fix:** one `any`-cleanup sprint (replace with `unknown` + `errMessage()` helper already in `src/lib/utils.ts`), fix entities/unused imports, then flip both jobs to blocking (`continue-on-error: false`).

### P0-2. No rate limiting on public write endpoints (spam/abuse → D1/KV/Resend burn)
- **Evidence:** `src/app/api/clients/register/route.ts:5-20` (no validation beyond `name && email`, no email-format check, no honeypot/captcha, no throttle — inserts into `service_leads` unconditionally), `src/app/api/newsletter/subscribe/route.ts` (good: double opt-in, identical responses, consent required — but still no per-IP throttle), `(main)/api/leads`, `(main)/api/prelaunch`, `flutterwave/initialize` (all unauthenticated by design). Grep shows **zero** rate-limit code in `src/`.
- **Risk:** bot spams leads/newsletter → D1 fills with junk, Resend quota burns on confirmation emails, confirmation-email oracle via timing (minor). Cloudflare WAF rate-limiting rules are not in repo (not-as-code).
- **Fix:** add edge rate limiting (KV-backed sliding window or Cloudflare Rate Limiting Rules as code + documented in `wrangler.jsonc` comment); add Turnstile on `register` + `subscribe` + `contact`; add `isValidEmail` check to `clients/register` (reuse `lib/newsletter/store.ts:isValidEmail`).

### P0-3. [FIXED 2026-10-11] Numbered migrations own the schema
- `migrations/0001_init.sql` consolidates all 14 tables + 3 hot-path indexes (verified: applies cleanly to local D1, 18 commands). `ensureOutreachTables`, `ensureSubscribersTable`, and both inline `ALTER TABLE` try/catch blocks deleted; all 18 per-request call sites removed. `wrangler.jsonc` sets `migrations_dir`; `npm run db:migrate:{local,remote}` added; deploy job applies remote migrations before shipping.
- _(Original issue kept for history: schema was managed by per-request `ensureOutreachTables()` + inline ALTER try/catch — DDL races, silent failures, no versioning.)_
- _(Original issue kept for history: schema was managed by per-request `ensureOutreachTables()` + inline ALTER try/catch — DDL races, silent failures, no versioning. Evidence was `src/lib/outreach/d1.ts:76-106`, `src/lib/cf/d1.ts:19`, per-request calls in every API route.)_

### P0-4. [REMOVED 2026-10-11] Flutterwave integration deleted
- **Decision:** payments via Flutterwave removed entirely per owner request. Deleted `src/app/api/flutterwave/{initialize,webhook}/`, removed `FLUTTERWAVE_SECRET_HASH` from `.dev.vars.example` + `README.md`.
- **Follow-up:** rotate/delete `FLUTTERWAVE_SECRET_KEY` + `FLUTTERWAVE_SECRET_HASH` from Cloudflare secrets + GitHub Actions secrets if set; confirm no dashboard webhook still points at `/api/flutterwave/webhook` (it will now 404). If payments return, design as isolated provider module with migration-created ledger table (never `ensure*` per request) + idempotency on `tx_ref`.
- _(Original bug, kept for history: webhook inserted into `outreach_logs` (plural) but schema has `outreach_log` (singular), with `catch { return ok:true }` hiding the loss.)_

### P0-5. No observability, no backup, no alerting on cron/smoke
- **Evidence:** zero Sentry/OTel/logging infra in `package.json`; `console.error` only in `newsletter/subscribe:74`. `daily-outreach.yml` curls `POST /api/outreach/daily` with no status-code check/retry/notify; `smoke.yml` runs daily prod smoke with no notification; `open-next.config.ts:8` R2 incremental cache commented out; `docs/` has only `style-guide.md`.
- **Risk:** first production incident = blind. Cron silently stops → nobody knows. D1 has no export-to-R2 backup (`checks.ts:234` lists it as manual/pending).
- **Fix:** add Sentry (or Cloudflare Workers Observability + Tail Workers), D1→R2 nightly export + restore runbook, cron/smoke failure alerts (Slack/email via GitHub Actions `if: failure()`), `/api/health` with D1/KV checks wired to smoke test.

---

## 2. P1 — Fix before scaling (high priority)

| # | Finding | Evidence | Fix |
|---|---------|----------|-----|
| P1-1 | **Two API trees, two auth helpers.** `src/app/api/*` (26 routes, uses `verifyRequestAuth` = cookie OR Bearer cron) vs `src/app/(main)/api/*` (~articles/contacts/directory/timeline/gallery/settings/stats/leads/budget/prelaunch/outreach…, uses `verifySession` = cookie only). Same concepts, different paths (`/api/contacts` vs `/(main)/api/contacts`). Cron Bearer token works on one tree but not the other. | grep: 93 auth-call sites; `(main)/api/contacts/route.ts:11` vs `api/outreach/profiles/route.ts:13` | Consolidate to single `src/app/api/` tree; deprecate `(main)/api` with 301s; standardize on `verifyRequestAuth`. Document route inventory (see §7). |
| P1-2 | **Dual source of truth: `src/data/*.ts` vs D1.** `src/data/profiles.ts` (728 lines, ~100+ entries), `outreach-profiles.ts`, `timeline.ts`, `gallery.ts`, `stats.ts` vs D1 (205 profiles). `init/route.ts:4` seeds from stale file. `site.ts:14-18` hardcodes `records: "140+"`, `continents: "4"` vs actual 205/6. `categoryLabels` copy-pasted in `profiles.ts:11-32` AND `DirectoryClient.tsx:8-19` (divergent: one adds `sports`). | `site.ts`, `profiles.ts`, `DirectoryClient.tsx:45` | Single source = D1. Generate `src/data/*` from D1 (build-time export) or delete; derive `site.ts` stats from `/api/stats`; dedupe `categoryLabels` into one module. |
| P1-3 | **Zero edge caching on documents.** `next.config.ts:29-32` sets `Cache-Control: public, max-age=0, s-maxage=0, must-revalidate` on `/(.*)` — every navigation hits Worker + D1. R2 incremental cache commented out. | `next.config.ts:29-44`, `open-next.config.ts:8`, `public/_headers` | Scope no-cache to HTML shell only; enable R2 incremental cache; cache `/api/stats`, sitemap, directory GETs with `s-maxage` + revalidation. |
| P1-4 | **Auth nits: 14-day admin session, no rotation/revocation; client access-code stored plaintext; `destroySession` drops flags.** `auth.ts:35` (`exp = +14d`), `:63-72` (clears cookie without `httpOnly/secure/sameSite`), `clients/login/route.ts:17-19` (compares `access_code` in SQL — plaintext at rest), no login rate limit / lockout. Cron secret via `getCronSecret()` accepts any non-empty string (`auth.ts:115-118`). | `auth.ts`, `clients/login` | Shorten admin TTL (24h + sliding refresh), add token version/revocation via KV, hash access codes (SHA-256 + pepper), mirror cookie flags on destroy, enforce `CRON_SECRET` min length, add login throttling. |
| P1-5 | **Outreach discovery is fragile + expensive.** DDG HTML scraping (`discovery.ts:126-163` splits on `<div class="result `), regex name extraction (`:92-114`), category keyword counting (`:69-77`), sequential `discoverContactEmail` (4 search queries × per-profile, `:274-305`) inside `enrichAndQueue` loop (`:357-402`). Daily cron + 5-query batch can exceed Workers CPU/subrequest limits; no timeout/budget; `BATCH_QUERIES` only 5. `importCandidates` loads entire table into memory for dedup (`:308-309`). | `discovery.ts`, `daily/route.ts:80-149` | Time-box searches (`AbortSignal.timeout`), cap enrichment per run (e.g. 5), move batch to paginated queue + Durable Object/Workflow, push dedup into SQL (`WHERE normalized = ?`), add `BRAVE_API_KEY` (already supported, unset). |
| P1-6 | **Input validation is ad-hoc; zod installed but unused on API boundary.** `clients/register` checks `name && email` only; `profiles PATCH` allowlists keys (`profiles/route.ts:132`) but no value-length caps (letter_html unbounded → D1 2MB row risk); `contacts/[id]`, `articles` use `any`. `zod` is in deps (`package.json:35`) but no route imports it. | `package.json:35`, API routes | Add zod schemas per route (email format, max lengths, enum `category`/`letter_status`), return 400 with field errors; cap `letter_html` (~200KB) + `achievement` (~2KB). |
| P1-7 | **Build job doesn't build what ships.** CI `build` runs `next build`, deploy runs `opennextjs-cloudflare build` — Worker-bundle breakage only surfaces on `master` deploy. No preview envs; `wrangler.jsonc` has no `env` stanza (single prod worker). | `ci-cd.yml:57-76`, `wrangler.jsonc` | CI `build` = `opennextjs-cloudflare build`; add `preview` deploy for PRs (`workers.dev`), add `env { preview, production }`. |
| P1-8 | **PII/GDPR gap: 205 profiles with DOB/email/LinkedIn, no consent/takedown flow.** Newsletter has double opt-in + unsubscribe (exemplary), but directory profiles are scraped + auto-imported (`importCandidates`) with no consent record, no `right-to-erasure` endpoint, no retention policy, no privacy notice for profiled individuals. `DELETE /profiles` exists but is admin-only with no public request path. | `discovery.ts:307-343`, `profiles/route.ts:151-170` | Add public takedown/correction request form → `research_drafts` (`correction` kind already exists) + SLA; add consent-source field per profile; privacy notice for data subjects; DPA for Resend/Cloudflare. |

---

## 3. P2 — Harden soon (medium)

- **Bundle bloat:** `framer-motion ^12.42.2` has zero imports in `src/` — remove (~100KB+). Two Card systems (`shared/Card.tsx:14` vs `ui/card.tsx:5`) + `shared/FilterChip/Tag/PageHero` vs `ui/*` — pick one design language. `eslint.config.mjs:24` disables `@next/next/no-img-element` globally — re-enable and migrate `shared/Card` raw `<img>` to `next/image` (or Cloudflare Images binding already in `wrangler.jsonc:21-23`).
- **Sanitizer is hand-rolled regex** (`sanitize.ts:31-58`): allowlist approach is reasonable (strips `script/iframe/object/embed/form`, validates `href` via `SAFE_URL`), but `style` attr is fully allowed (CSS exfiltration via `url()`/`expression`), `src` on `img` is not in allowlist yet `img` tag is (broken images), unquoted attrs edge cases. Consider `isomorphic-dompurify` or at minimum strip `url(` from styles + add `src` to URL-checked attrs.
- **Secrets hygiene is good but brittle:** `.env.local` + `.dev.vars` exist locally, both gitignored (`.gitignore:38,55`), `git ls-files` shows no secrets — pass. But `.dev.vars.example` documents real var names; `checks.ts:180-184` references old defaults (`dev-auth-secret-change-in-production`, `admin`) that no longer match — update or remove to avoid confusion. Add `gitleaks`/`trufflehog` CI step.
- **`verifyRequestAuth` accepts 4 credential paths** (`auth.ts:125-139`: raw cookie header, Next cookies, `next/headers`, Bearer cron) — resilient on Workers, but Bearer cron secret also authorizes **every** admin/outreach endpoint, not just cron-safe ones. Scope Bearer to `GET /daily` status + `POST /daily` only; require cookie session for destructive routes (DELETE profile, autonomous toggle, send).
- **D1 `getRecordCount(table)` interpolates table name** (`cf/d1.ts:40`) + `d1Column(table, column)` interpolates both (`checks.ts:57`) — safe today (callers pass constants), but expose no user input to them; add allowlist assertion.
- **No unit tests** (only Playwright E2E, Chromium-desktop only, full `build && start` per local run). Add Vitest for `sanitize`, `discovery` (extractName/estimateCategory), `auth` (HMAC round-trip), zod schemas. Add Firefox/WebKit + mobile Playwright projects, axe a11y, Lighthouse budget.
- **SEO/PWA mostly good** (`layout.tsx` metadata, `sitemap.ts` D1-driven, `manifest.ts`, `robots.txt`, `sw.js`) — verify `opengraph-image.tsx` sizes, add OG `images` in `layout.tsx:58-66`, confirm `theme anti-FOUC` + `InstallPrompt` don't double-register SW.
- **Git hygiene:** recent log shows Worker/generated-file churn (`Delete worker.js`, `Update wrangler.jsonc`, `Delete discovery-extract-name.spec.ts`) — now clean. Add Dependabot/Renovate + `npm audit` step; `lucide-react 1.23.0` is 30+ minors behind latest 1.x — bump.

---

## 4. What's working (keep)

- HMAC-SHA256 signed sessions (`auth.ts:34-61,84-113`) with startup secret validation, `httpOnly/lax`, dual cookie-parse fallback for Workers — correct pattern.
- Auth coverage is broad: 93 guard sites; every `/api/outreach/*`, `/api/admin/*`, letter endpoints gated.
- Security headers (CSP/HSTS/X-Frame-DENY/Permissions-Policy) in `next.config.ts:3-27` — above vibe-code baseline.
- Newsletter double opt-in with identical responses + consent enforcement (`subscribe/route.ts:22-55`) — privacy-exemplary; extend the pattern to directory takedowns.
- `.gitignore` covers `.next/.open-next/dist/.wrangler/.env*` and `git ls-files` confirms no build output or secrets committed.
- E2E breadth (18 specs: auth, admin, outreach, newsletter, gate, isolation, PWA…) + daily prod smoke — rare for vibe-coded projects.

---

## 5. Debt ledger (concrete)

| Item | Location | Size |
|------|----------|------|
| `any` in admin + API | `CommandCenterClient.tsx` (12×), `command-center/page.tsx` (4×), `admin/page.tsx:80`, all `(main)/api/*` | ~40 errors |
| Unescaped entities | `admin/page.tsx:179,222,256` | 3 errors |
| Unused imports | `admin/clients/page.tsx:4`, `admin/scheduler/page.tsx:6`, `web-finder/page.tsx:4`, `(main)/api/contacts/route.ts:1` | 4 warnings |
| `no-img-element` disabled globally | `eslint.config.mjs:24` | 1 rule |
| Stale hardcoded stats | `site.ts:14-18` (140+/4 vs 205/6) | 2 values |
| Duplicated category labels | `profiles.ts:11-32` + `DirectoryClient.tsx:8-19` | 1 module to extract |
| Dead dep | `framer-motion` (0 imports) | ~100KB |
| Dual Card systems | `shared/Card.tsx` vs `ui/card.tsx` | 1 to delete |

---

## 6. MVP roadmap (phased, each phase shippable)

### Phase 0 — Stop the bleeding (1–2 days)
- [x] Remove Flutterwave entirely (deleted `api/flutterwave/`, scrubbed `.dev.vars.example` + `README.md`; rotate/delete Cloudflare/GH secrets). Done 2026-10-11.
- [ ] `clients/register`: add `isValidEmail` + max-length caps (name 120, message 2K).
- [ ] `CRON_SECRET` min-length enforcement (≥32) in `getCronSecret()`.
- [ ] Mirror cookie flags in `destroySession()`.
- [ ] Update `checks.ts:180-184` default-value references.

### Phase 1 — Quality gates + migrations (3–5 days)
- [x] `any`-cleanup sprint → `lint` + `e2e` blocking in `ci-cd.yml` (done 2026-10-11: 92 problems → 0, `--max-warnings 0`). _(P0-1 closed.)_
- [x] Numbered D1 migrations (`migrations/0001_init.sql`) + migrate scripts; per-request `ensure*` + inline ALTERs deleted. _(P0-3 closed.)_
- [x] CI `build` = `opennextjs-cloudflare build` (new `build:worker` script, verified locally); PR preview deploys via `--env preview` job. _(P1-7 closed, pending one-time preview DB/KV creation.)_
- [x] Zod schemas on all public write routes (`register`, `subscribe`, `leads`, `prelaunch`, `contacts`, `profiles POST/PATCH`); cap `letter_html`. _(P1-6 closed: new `src/lib/validate.ts`, E2E 149 passed.)_

### Phase 2 — Abuse + observability (3–5 days)
- [ ] KV sliding-window rate limiting on public writes + login; Cloudflare Rate Limiting Rules documented.
- [ ] Turnstile on `register`/`subscribe`/`contact`.
- [ ] Sentry (or Workers Observability) + `/api/health` (D1+KV) wired to smoke.
- [ ] D1→R2 nightly export + restore runbook in `docs/runbook.md`.
- [ ] Cron/smoke `if: failure()` alerts.

### Phase 3 — Architecture consolidation (1 week)
- [ ] Merge `(main)/api` → `api/` with 301s; standardize on `verifyRequestAuth`; publish route inventory (§7) in `docs/api.md`.
- [ ] Single source of truth: D1 → generate `src/data/*` at build or delete; derive `site.ts` stats from API; extract shared `categoryLabels`.
- [ ] Scope Bearer-cron to read-only/cron-safe routes; hash client access codes; shorten admin TTL + KV revocation.
- [ ] Discovery hardening: timeouts, per-run caps, SQL-side dedup, paginated queue worker.

### Phase 4 — Privacy + launch readiness (3–5 days)
- [ ] Public takedown/correction flow → `research_drafts(correction)` + SLA + admin review UI.
- [ ] Data-subject privacy notice + consent-source column + retention policy.
- [ ] R2 incremental cache + scoped `Cache-Control`; remove `framer-motion` / unify Card system; re-enable `no-img-element`.
- [ ] Vitest unit suite (sanitize, discovery, auth, schemas) + axe + Lighthouse budget + Firefox/WebKit projects.
- [ ] `docs/` runbook: env matrix, deploy, rollback, backup/restore, incident playbook. Then launch.

---

## 7. Route inventory (observed, ~56 routes)

**`src/app/api/` (24 files):** `audit`, `admin/clients`, `clients/{login,register,projects,services}`, `newsletter/{subscribe,confirm,unsubscribe}`, `outreach/{profiles,queue,send,daily,generate,init,drafts,logs,stats,health,blind-spots}`, `reunion/{updates,settings}`, `sponsors`, `settings/autonomous`. _(Flutterwave `{initialize,webhook}` removed 2026-10-11.)_
**`src/app/(main)/api/` (~19 files):** `articles`, `articles/[id]`, `timeline`, `timeline/[id]`, `gallery`, `gallery/[id]`, `directory`, `directory/[id]`, `contacts`, `contacts/[id]`, `leads`, `budget`, `login`, `login/check`, `logout`, `prelaunch`, `roadmap`, `settings`, `stats`, `outreach`, `outreach/letter/[id]`, `outreach/web-finder`.
**Pages (~40 `.tsx` incl. route groups):** `(main)` public pages (home, gallery, history, directory, services, sponsor, verify, contact, projects, reunion, outreach admin), `admin/*` (command-center, scheduler, web-finder, clients), `coming-soon`, error/not-found/global-error layouts.
**Action:** consolidate to one tree (Phase 3); until then, keep this table updated in `docs/api.md`.

---

## 8. Env matrix (required for prod)

| Var | Where | Notes |
|-----|-------|-------|
| `AUTH_SECRET` | Cloudflare secret + `.dev.vars` | ≥32 chars; startup-validated (`auth.ts:6-14`) |
| `ADMIN_PASSWORD` | Cloudflare secret + `.dev.vars` | ≥8 chars (`auth.ts:16-24`) |
| `CRON_SECRET` | Cloudflare secret + GH Actions | enforce ≥32 (P0-5/P1-4) |
| `RESEND_API_KEY` | Cloudflare secret | required for actual sends; dry-run otherwise (`email.ts:28-31`) |
| `BRAVE_API_KEY` / `GOOGLE_API_KEY`+`CX` | Cloudflare secret (optional) | Brave preferred; DDG fallback |
| `NEXT_PUBLIC_GA_ID` / `CLARITY_ID` | Cloudflare env | analytics, optional |
| D1 (`LUTTERODT_D1`) + KV (`LUTTERODT_KV`) | `wrangler.jsonc:24-37` | add `env { preview, production }` (P1-7) |

`.dev.vars`, `.env*` gitignored and uncommitted — verified clean. Never bake secrets into `dist/` (gitignored).

**Secret audit 2026-10-11 (Cloudflare dashboard vs code):** `ADMIN_PASSWORD`, `AUTH_SECRET`, `BRAVE_API_KEY`, `CRON_SECRET`, `RESEND_API_KEY` all present and all read by code ✓. No Flutterwave leftovers in CF ✓. **PocketBase removed:** `NEXT_PUBLIC_POCKETBASE_URL` / `POCKETBASE_SUPERUSER_EMAIL` / `POCKETBASE_SUPERUSER_PASSWORD` existed in CF + `ci-cd.yml` deploy env but zero code references (grep whole repo: only `ci-cd.yml:100-102`) — dead leftover, passthrough deleted from CI; delete the three secrets from CF + GitHub Actions secrets. **GA gap:** `NEXT_PUBLIC_GA_ID` sits in CF secrets but `NEXT_PUBLIC_*` values bake in at CI build time, and the deploy job never passes it → analytics is silently dead in prod. Either pass it in the deploy env or drop it; same for `NEXT_PUBLIC_CLARITY_ID` (not set anywhere).

---

*Next step: pick up Phase 0. Each box is a shippable PR. Ask to start with P0-4 + Phase 0 validation hardening.*
