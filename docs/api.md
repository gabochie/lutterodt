# API Inventory

Single tree: `src/app/api/`. (Phase 3.1 merged the legacy
`src/app/(main)/api/` group into it. Route groups never affected URLs, so no
client changes were needed.)

Auth legend: **cookie** = admin session cookie (or raw Cookie header on
Workers); **cron** = `Authorization: Bearer <CRON_SECRET>` (cron-safe
read/run endpoints); **client** = HMAC `client_token` cookie; **open** = no
auth. All guards live in `src/lib/cf/auth.ts`.

## Public site

| Method + path | Auth | Notes |
|---|---|---|
| GET `/api/health` | open | Liveness: D1/KV reachability only, no secrets |
| GET `/api/directory`, `/api/directory/[id]` | open | Family directory (verified-cookie gating inside) |
| GET `/api/stats` | open | Aggregate counts |
| GET `/api/settings` | open | `coming_soon` flag for the gate |
| POST `/api/leads` | open, rate-limited + captcha | Contact form → `contacts` |
| POST `/api/login` | open, rate-limited | Admin login (form post → redirect) |
| GET `/api/logout` | open | Clears session |
| GET `/api/login/check` | cookie/cron | Session probe |
| GET `/api/prelaunch` | open | Launch checklist state |
| GET `/api/roadmap` | open | Roadmap content |
| GET `/api/articles`, `/api/articles/[id]` | cookie/cron | CMS reads are admin-only |
| PUT/POST/DELETE articles, timeline, gallery, contacts, budget | cookie/cron | Admin CRUD |
| POST `/api/prelaunch` | cookie/cron | Toggle checklist overrides |
| GET `/api/outreach` (tracker) | cookie/cron | Manual outreach board (KV) |
| GET `/api/outreach/letter/[id]` | cookie/cron/client | Letter render |
| POST `/api/outreach/web-finder` | cookie/cron | Ad-hoc web search |

## Outreach pipeline (`/api/outreach/*`)

All cookie/cron. Pipeline order: `daily` (discover → import → queue →
optionally auto-send) → `queue` → `send`.

| Path | Purpose |
|---|---|
| `profiles` GET/POST/PATCH/DELETE | D1 profile CRUD + dedup |
| `queue` GET/POST/PATCH | Letter queue |
| `send` POST | Send one queued letter (Resend or dry-run) |
| `daily` GET/POST | Status + run (add `?batch=true&count=N`) |
| `generate` POST | Render letter HTML without queueing |
| `init` POST | One-time seed from `src/data/outreach-profiles.ts` |
| `drafts` GET/PATCH | Research-draft review gate |
| `logs`, `stats`, `health`, `blind-spots` | Ops visibility |

## Clients, newsletter, reunion, sponsors

| Method + path | Auth | Notes |
|---|---|---|
| POST `/api/clients/register` | open, rate-limited + captcha | Service lead intake |
| POST `/api/clients/login` | open, rate-limited | Issues `client_token` |
| GET `/api/clients/services`, `/api/clients/projects` | client | Portal data |
| POST `/api/newsletter/subscribe` | open, rate-limited + captcha | Double opt-in |
| GET `/api/newsletter/confirm`, `/unsubscribe` | open, token | Token links (length-capped) |
| GET `/api/reunion/updates` | open | Public feed |
| POST `/api/reunion/updates` | cookie/cron | Posting is admin-only |
| GET/POST `/api/reunion/settings` | cookie/cron | |
| GET `/api/sponsors` | open | Contribution types |
| POST `/api/sponsors` | cookie/cron | Generate (+optionally queue) letter |
| GET `/api/audit` | cookie/cron | Environment audit |
| GET/POST `/api/settings/autonomous` | cookie/cron | Auto-send kill switch (KV) |
| GET/POST `/api/admin/clients` | cookie/cron | Client management |
| POST `/api/budget` | cookie/cron | Admin budget store (KV) |

## Conventions for new endpoints

1. Put the file under `src/app/api/` (never a route-group copy).
2. Guard with `verifyRequestAuth(request)` (admin) or `verifyClientToken` (portal).
3. Parse bodies with a schema from `src/lib/validate.ts`.
4. Rate-limit public writes via `src/lib/rate-limit.ts`.
5. Errors via `errMessage(err)`; structured events via `src/lib/log.ts`.
6. Schema changes go in `migrations/` — never `ensure*()` in request code.
