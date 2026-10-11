# Lutterodt Renaissance

A living digital archive and family directory for the Lutterodt family — documenting every notable Lutterodt, preserving the family's history, and building toward a permanent, family-governed Institute.

## Stack

- **Framework:** Next.js 16 (App Router), deployed on Cloudflare Workers via OpenNext
- **Data:** Cloudflare D1 (SQLite), KV for sessions/cache
- **Auth:** Signed session cookies + HMAC-signed client tokens
- **Styling:** Tailwind CSS v4 + CVA + tw-animate-css
- **Search/AI:** MCP SDK

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.dev.vars` from `.dev.vars.example` and fill in real secrets:
   - `AUTH_SECRET` — at least 32 characters. Never use the example value in production.
   - `ADMIN_PASSWORD` — at least 8 characters.
   - Plus D1/KV binding IDs for production.

3. Run the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Local production build (`next build --webpack`) |
| `npm run preview` | OpenNext build + local Cloudflare preview |
| `npm run deploy` | OpenNext build + deploy to Cloudflare Workers |
| `npm run upload` | OpenNext build + generate upload assets |
| `npm run lint` | ESLint over `src/` |
| `npm run typecheck` | TypeScript type checking |
| `npm run cf-typegen` | Regenerate `cloudflare-env.d.ts` from `wrangler.json` |

## Environment Variables

| Variable | Required | Notes |
| --- | --- | --- |
| `AUTH_SECRET` | Yes | ≥ 32 chars; signs admin sessions and client tokens |
| `ADMIN_PASSWORD` | Yes | ≥ 8 chars; admin login |
| `D1` binding | Yes | Outreach profiles, contacts, gallery, timeline, etc. |
| `KV` binding | Yes | Sessions |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4 measurement ID (`G-…`) |
| `NEXT_PUBLIC_CLARITY_ID` | No | Microsoft Clarity project ID |

Do not commit `.dev.vars`, `.env*`, or build output containing baked-in environment variables.

## Project Structure

- `src/app/(main)/` — public pages (home, gallery, history, directory, services, sponsor, verify, contact, projects, reunion, outreach admin)
- `src/app/api/` — current API routes (clients, outreach pipeline, sponsors, reunion, admin)
- `src/app/(main)/api/` — public-site API (leads, gallery, timeline, directory, settings, stats, articles)
- `src/lib/cf/` — Cloudflare bindings, D1 helpers, auth utilities
- `src/components/` — shared UI (Card, Tag, ScrollReveal, GalleryItem, Footer, Navbar)

## Security

- `AUTH_SECRET` and `ADMIN_PASSWORD` are validated at startup — the app refuses to boot with missing or default-length values.
- All `/api/admin/*`, `/api/outreach/*`, and outreach letter endpoints require an authenticated admin session (or a signed client token where appropriate).
- Security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy) are set in `next.config.ts`.

## Deployment on Cloudflare

```bash
npm run deploy
```

Custom domain: `lutterodt.org`. The open-site gateway (`ContentGate`) reads `coming_soon` from `/api/settings`; disable it on every environment before public launch.