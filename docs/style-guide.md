# Lutterodt Style Guide (repo unified doc)

Commissioned by **Paulina Lutterodt Missions (PLM)** · Built by **Gabochie DevLab**.

One brand, one pattern language. This doc codifies the **lutterodt.org archive system**.
Lane A heraldic alignment: palette and mark derive from the Lutterodt
achievement (per pale Azure/Argent, Or arrows, Gules crown caps).

## Part 1 — Canonical tokens (`src/app/globals.css`)

### Palette (sampled from the achievement)
- Azure `#1B5FC1` primary · `#144A9E` hover · `#0A2470` dark sections (was `#020A3D`)
- Or (gold) `#FAA110` buttons/icons on dark — measured from the crossed arrows
- Gold `#FBC829` highlight on dark · `#996C16` legacy text-on-light (shrinking) · `#6E520C` `gold-ink` small text on light · `#57534E` `fg-muted`
- Green `#015F23` primary · `#0A7A30` light — accents only, never body text on white
- Gules `#D1051C` errors-only (crown red; also `--destructive`) — never brand decoration
- Ink `#0B0D12` · Black `#01010A` · Paper `#F7F7F4` · Line `#E4E6EC`
- Muted `#5A6170` · Text-on-dark `#F2F4FF` · Muted-on-dark `#A9B1CC`
- Steel `#9FB3C8` available as a supporting neutral (helm); argent == Paper

### Token names (burgundy retired 2026-10)
`azure`→`#1B5FC1`, `azure-deep`→`#144A9E`, `azure-ink`→`#0A2470`,
`gold`→`#FAA110`, `gold-light`→`#FBC829`, `gold-dim`→`#996C16`,
`gold-ink`→`#6E520C`, `gules`→`#D1051C`,
`ivory`→`#F7F7F4`, `ivory-dim`→`#EEF1FF`, `charcoal`→`#01010A`,
`forest`→`#015F23`, `forest-light`→`#0A7A30`.
`burgundy*` names are gone — never reintroduce them (nor the old navy values
`#001D95`/`#0A2290`/`#020A3D`, nor champagne `#C6A15B`/`#EEAD16`, nor maroon
`#5a2d2a`). Grep-verify: zero hits for `burgundy`, `#001D95`, `#C6A15B`.

### Type, radius, buttons
- Display Fraunces · Body Inter · Mono IBM Plex Mono (eyebrows, record links)
- Cards/inputs `2px`; **buttons `--radius-btn: 999px` (pill)**
- `btn-primary` azure `#1B5FC1`/white · `btn-gold` `#FAA110` on `#0A2470`
- `btn-outline` azure border, hover wash `#EEF1FF` · `btn-ghost` / `btn-outline-ivory` ivory border, hover gold
- Never two solid primaries side-by-side — pair solid + ghost/outline
- Focus ring: `3px #FBC829`, offset 2. Selection: `#1B5FC1` bg, white text.

### Contrast floors (enforced)
- Body ≥ 4.5:1, large ≥ 3:1, UI ≥ 3:1. On `#01010A`/`#0A2470`, `text-ivory/55` is the
  floor for small text (`/40` = 3.5:1 and `/45` = 4.19:1 FAIL — do not reintroduce).
- Gold `#FBC829` on white ≈ 1.6:1 — gold is never body text on light; use `#6E520C`.
- Green never body text on white below 16px bold.
- Text on light grounds: `gold-ink`/`fg-muted` (or darker) for ≤12px microcopy;
  `dark:` pairs (`gold-light`, `ivory/70`) wherever the surface flips dark.

### Patterns
- Eyebrow: mono 11.5px uppercase + 22px × 1px rule + 10px gap (`Tag`)
- Hero: `PageHero` · Sections: `container-main` 1220px, 108px editorial / 72px gallery
- Archive grids: 3-col cards over 2px hairline, 4/3 image, 600ms zoom to 1.045
- Stats band: 4-col, 34px display numerals, mono 10.5px labels (`StatCell`)
- Footer: `#01010A`, 4-col `[1.4fr_1fr_1fr_1.2fr]`, newsletter + legal bar

## Part 2 — Mark usage rules (binding)

The achievement artwork is **frozen** — never redrawn, recolored, stretched, or cropped.

1. **Single mark.** The heraldic achievement (`public/logo/lutterodt-crest-*`)
   is the only crest. The white-background oval and its dark cuts are retired
   and deleted — zero references must remain (`rg` verify).
2. **Transparent ground.** The crest carries its own contrast on light and dark;
   no dark-cut variant exists or is needed. Never box it on a mismatched field.
3. **Square aspect.** The mark is 1:1 — `Crest` renders square boxes
   (`h-9 w-9`, `md:h-11 md:w-11`); callers must not reintroduce oval ratios.
4. **Small sizes.** Below ~64px the achievement muddies — favicons use the
   dedicated `favicon-crest-*` exports (checked at 32px). Never ship the
   200px webp where a favicon belongs.
5. **Footer** is a wordmark lockup: `LUTTERODT | Commissioned by Paulina
   Lutterodt Missions · Built by Gabochie DevLab` in the legal bar.
6. Photography: azure-tinted duotone, gold-hour, high contrast, no pastel. Crest
   prohibited over busy photo without an 88% white scrim (primary) or 72%
   azure-ink scrim (dark). Crest never as a watermark below 8% opacity.
7. **Blocked from publish:** the 2.7MB black-background source
   (`lutterodth familiy crest.png` — note filename typo, never copy it into
   the repo) and any un-optimized export. Only the derivatives in
   `public/logo/` may ship.
8. OG/social cards embed the 400px transparent PNG as a data URI
   (`src/lib/brand/crestImage.ts`, ≤400KB); keep the embed in sync when the
   master changes.

## Part 3 — Done (was: dormant letter palettes)

`src/lib/outreach/letter.ts`, `src/lib/outreach/sponsor-letter.ts` and the
`/outreach/*` letter previews were reskinned 2026-10 to heraldic tokens
(azure-ink headings, gold-ink accents, paper/hairline grounds, crossed-arrow
mark replacing the legacy star; "Four Continents" → "Six Continents" fixed).
Newsletter email accents moved to Or `#FAA110`.
