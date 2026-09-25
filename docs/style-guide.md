# Lutterodt Style Guide (repo unified doc)

Two brands, one pattern language. This doc codifies the **lutterodt.org archive system**
and its boundary with the **Lutterodt Operations corporate identity**.
Source of truth for Operations artwork/rules:
`GABOCHIE CORP/LUTTERODT OPERATIONS/logo/Style guide/` (desktop, v1.0 + tokens v1.1).

## Part 1 — Canonical tokens (`src/app/globals.css`)

**lutterodt.org is the canonical public surface for the Lutterodt identity.** The
Operations crest is the same mark, not a second brand. One palette, one system.

### Palette (frozen from the crest)
- Blue `#001D95` primary · `#0A2290` hover · `#051860` active · `#020A3D` dark sections · `#EEF1FF` tint
- Gold `#FBC829` highlight on dark · `#EEAD16` buttons/icons on dark · `#996C16` text on light
- Green `#015F23` primary (lions) · `#0A7A30` light — accents only, never body text on white
- Red `#E30303` accent · Ink `#0B0D12` · Black `#01010A` · Paper `#F7F7F4` · Line `#E4E6EC`
- Muted `#5A6170` · Text-on-dark `#F2F4FF` · Muted-on-dark `#A9B1CC`

### Legacy token names (kept so existing markup keeps working)
`burgundy`→`#001D95`, `burgundy-deep`→`#0A2290`, `burgundy-ink`→`#020A3D`,
`gold`→`#EEAD16`, `gold-light`→`#FBC829`, `gold-dim`→`996C16`,
`ivory`→`#F7F7F4`, `ivory-dim`→`#EEF1FF`, `charcoal`→`#01010A`,
`forest`→`#015F23`, `forest-light`→`#0A7A30`.
These are **aliases, not a second palette** — never reintroduce the old burgundy values.

### Type, radius, buttons
- Display Fraunces · Body Inter · Mono IBM Plex Mono (eyebrows, record links)
- Cards/inputs `2px`; **buttons `--radius-btn: 999px` (pill)**
- `btn-primary` blue `#001D95`/white · `btn-gold` `#EEAD16` on `#020A3D`
- `btn-outline` blue border, hover wash `#EEF1FF` · `btn-ghost` / `btn-outline-ivory` ivory border, hover gold
- Never two solid primaries side-by-side — pair solid + ghost/outline
- Focus ring: `3px #FBC829`, offset 2. Selection: `#001D95` bg, white text.

### Contrast floors (enforced)
- Body ≥ 4.5:1, large ≥ 3:1, UI ≥ 3:1. On `#01010A`/`#020A3D`, `text-ivory/55` is the
  floor for small text (`/40` = 3.5:1 and `/45` = 4.19:1 FAIL — do not reintroduce).
- Gold `#FBC829` on white ≈ 1.6:1 — gold is never body text on light; use `#996C16`.
- Green never body text on white below 16px bold.

### Patterns
- Eyebrow: mono 11.5px uppercase + 22px × 1px rule + 10px gap (`Tag`)
- Hero: `PageHero` · Sections: `container-main` 1220px, 108px editorial / 72px gallery
- Archive grids: 3-col cards over 2px hairline, 4/3 image, 600ms zoom to 1.045
- Stats band: 4-col, 34px display numerals, mono 10.5px labels (`StatCell`)
- Footer: `#01010A`, 4-col `[1.4fr_1fr_1fr_1.2fr]`, newsletter + legal bar

## Part 2 — Mark usage rules (binding)

The crest artwork is **frozen** — never redrawn, recolored, stretched, or cropped.

1. **Wordmark below 120px.** Below 120px wide the motto is illegible and the lions muddy
   — use the `LUTTERODT` text wordmark (Georgia/Fraunces serif, tracked caps). This governs
   the footer, nav, and any inline mention. Never ship a small crest as an image.
2. **Surface pairing is exact.** Primary light crest → `#FFFFFF`/`#F7F7F4` only.
   Dark hero → flattened `lutterodt-dark-black-01010A-*` on `#01010A`/`#020A3D` only.
   `lutterodt-dark-transparent-*` is composited-only, never standalone, never on light.
3. **Never** the white-fill crest as a boxed image on dark/navy/black backgrounds.
4. **Footer** is a wordmark lockup: `LUTTERODT | Lutterodt Operations` in the legal bar.
5. Photography: navy duotone, gold-hour, high contrast, no pastel. Crest prohibited over
   busy photo without an 88% white scrim (primary) or 72% navy scrim (flattened dark).
   Crest never as a watermark below 8% opacity.
6. **Blocked from publish:** source PNGs (`lutterodt logo.png` 1.4MB,
   `lutterodt logo png.png` 2MB, `web/dark/*transparent*.png` 551–1109KB, `web/*full.png`).
   Only the derivatives in `public/logo/` may ship.
7. Archive coin SVG (nav/footer/favicon) is recolored to brand blue + gold, and is the
   correct mark at favicon sizes. Desktop Operations guide remains the appeal court for
   crest artwork disputes; this doc governs the web surfaces.

## Part 3 — Dormant / out of scope
`src/lib/outreach/letter.ts`, `src/lib/outreach/sponsor-letter.ts` and the
`/outreach/*` letter previews still carry the legacy warm-brown letter palette and the
old sponsor tier figures. They are unwired and draft-only; reskin them deliberately or
retire them — do not let them drift into public pages.
