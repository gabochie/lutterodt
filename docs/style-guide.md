# Lutterodt Style Guide (repo unified doc)

Two brands, one pattern language. This doc codifies the **lutterodt.org archive system**
and its boundary with the **Lutterodt Operations corporate identity**.
Source of truth for Operations artwork/rules:
`GABOCHIE CORP/LUTTERODT OPERATIONS/logo/Style guide/` (desktop, v1.0 + tokens v1.1).

## Part 1 — lutterodt.org archive system (`src/app/globals.css`)

### Tokens
- Burgundy `#5C1A2B` / deep `#3A0F1C` / ink `#2A0B14` · Gold `#C6A15B` / light `#E4C989` / dim `#8C744A`
- Ivory `#FAF6EF` / dim `#F1EADA` · Charcoal `#211D1A` · Forest `#2F4A3C`
- Display Fraunces · Body Inter · Mono IBM Plex Mono (eyebrows, record links)
- Radius: cards/inputs `2px` (sharp editorial); **buttons `--radius-btn: 999px` (pill)**

### Buttons (all six, base styles apply to every variant)
`btn-primary` burgundy · `btn-gold` gold · `btn-ghost` transparent/ivory border (dark bg)
`btn-outline` burgundy border (light bg) · `btn-outline-ivory` ivory border (dark bg).
All: pill, 14×26 padding, 13px uppercase, 0.05em tracking, 250ms hover lift.
Rule: never two solid primaries side-by-side — pair solid + ghost/outline.

### Patterns
- Eyebrow: mono 11.5px uppercase + 22px × 1px rule + 10px gap (`Tag` component)
- Hero: `PageHero` (breadcrumb, tag, title, description) · Sections: `container-main` 1220px, 108px editorial / 72px gallery
- Archive grids: 3-col cards over 2px hairline, 4/3 image with 600ms zoom to 1.045
- Stats band: 4-col, 34px display numerals, mono 10.5px labels (`StatCell`)
- Footer: charcoal, 4-col `[1.4fr_1fr_1fr_1.2fr]`, newsletter + legal bar

## Part 2 — Two-brand boundary (binding)

| | lutterodt.org (family archive) | Lutterodt Operations (corporate) |
|---|---|---|
| Mark | Archive coin (SVG sparkle) | Crest seal (lions/crown/motto) — artwork frozen, never redrawn/recolored |
| Palette | Burgundy/ivory | Navy `#001D95/#020A3D`, gold, green — never mixed into archive surfaces |
| Voice | Family stewardship, no figures | "Ideals in operation", formal stewardship |
| Favicon/OG | Coin set | Crest set (Operations surfaces only) |

### Rules
1. Crest appears on lutterodt.org in **one place only**: footer "Operated by" lockup
   (white tile, ≤64px, allowlisted `public/logo/` derivative, aspect locked 1.42:1).
2. About stewardship uses the **wordmark** (`LUTTERODT`, Georgia serif, tracked) — never a
   second crest (one-crest-per-viewport rule).
3. Forbidden: crest in nav/hero; navy reskin of archive; crest on non-paired backgrounds;
   crest below 120px wide (use wordmark); source PNGs (1.4–2MB) in `public/`.
4. Shared patterns (deliberate convergence): type roles, pill buttons, eyebrows,
   hairline grids, 4-col footer. Patterns shared; palettes never.
5. Desktop guide is the appeal court for crest disputes; this doc is the appeal court
   for archive disputes.
