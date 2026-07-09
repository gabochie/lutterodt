<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:anchored-summary -->
# Anchored Session Summary

## Goal
Exhaustively identify every notable living Lutterodt globally, document them in a master directory, create personalized branded outreach letters, and build the full archive pipeline.

## Stats (current)
- **Total profiles documented:** 205 in D1 (from 77; ~60 junk entries removed during cleanup)
- **Total outreach letters on desktop:** 265 HTML files
- **Professional categories:** 10 (Historical 51, Business 45, Healthcare 20, Creative 18, Academia 18, Engineering 12, Law 11, Service 9, Sports 6, Uncategorized 10)
- **Countries represented:** Ghana (57), USA (47), Germany (34), UK (26), Mexico (11), Gold Coast (8), Canada (4), Denmark (3), Sweden (2), Estonia (2), Spain (1), France (1), China (1), UAE (1), Netherlands (1)
- **Continents:** 6 (Africa, Europe, North America, South America via Mexico, Middle East, Asia via China)
- **Confirmed DOBs:** 15 (7%)
- **LinkedIn URLs:** 15 (7%)
- **Emails:** 3 (1%)
- **Blank achievements:** 0 (100% filled)
- **Blank countries:** 1 (<1%)

## Data Quality Improvements (current session)
- **Cleaned ~60 junk entries** — removed search snippets, article titles, non-person entries from database
- **Normalized countries** — merged UK/United Kingdom (→UK), United States (→USA), filled 12 blank countries
- **Added 15 DOBs** — Georgina Lutterodt (8 Jun 1947), Johann Lutterodt (20 Jun 1989), Isabelle Lutterodt (1975), Ascan Lutteroth (5 Oct 1842), Ascan Lutteroth (Maler), plus 11 pre-existing
- **Added 15 LinkedIn URLs** — Clement Lutterodt, Cyril Lutterodt, Christof Lutteroth, Francis Lutterodt, Freda Lutterodt, Prof. Herman Lutterodt, Johann Lutterodt, Michael Lutterodt (Davies), Edward Lutterodt, Gerrard Samuel Lutterodt, Henry Lutterodt (Nestle UK), Davis Lutterodt, Helbert Lutterodt, Emmanuel Lutterodt, Rodger Lutterodt
- **Added 3 emails** — Clement Lutterodt, Christof Lutteroth, Isabelle Lutterodt
- **Better achievements** — enriched ~30+ profiles with detailed professional bios
- **Added 9 new profiles** — Mailis Meier-Lutterodt (Estonia), Alexander Lutterodt Philip (Spain), Rodjer Lutterodt (USA), Theresa Lutterodt (UK), Augustina Lutterodt (UK), Gresham Lutterodt (UK), Philip Alex Lutterodt (UK), Bettina Lutterodt (UK), plus earlier batch
- **Merged 3 duplicates** — Georgina Lutterodt / Her Ladyship Georgina T. Wood, Herman Lutterodt / Prof. Herman Lutterodt, William Lutterodt / William Lutterodt (CEO)
- **Fixed bad merge** — Re-identified Cyril Lutterodt (Forbes VC, UK) ≠ Cyril George Carstensen Lutterodt (marriage counselor, Ghana/USA) as different people
- **Family connections documented** — Clement Lutterodt (Howard) + Dr. Sarah Lutterodt (Oxford) = Isabelle Lutterodt (LA curator, b. 1975)
- **Major discovery:** Ascan Lutteroth (5 Oct 1842–2 Feb 1923) — German landscape painter with Wikipedia page, Düsseldorfer Malerschule

## Contact Database (newly discovered)
- **Rodger Lutterodt** — Managing Director, Zesty Knowledge Advertising Ghana Ltd; prev. MMRS Ogilvy
- **Nicholina Lutterodt** — Head of IT & Copyright Royalties, Bucks Music Group Ltd, London
- **William Lutterodt** — Senior Operations Manager, LAZ Parking, Edmonton, Canada
- **Emmanuel Lutterodt** — MBM Stockholm School of Economics, Brand Strategy (Sweden-based, distinct from Ghana marketer)
- **Herman Lutterodt** — Senior Lecturer, Food Science & Technology, KNUST. PhD U Maryland
- **Michael Lutterodt** — Senior Partner, Global Head Strategy & Transformation, Davies Consulting, London
- **Bettina Lutterodt** — Proprietor, Aragon House, Peterborough, UK

## Remaining Gaps
- **190 profiles without DOB** — most are genealogical entries or less-public individuals; hard to find
- **190 without LinkedIn** — some may not have public profiles
- **202 without email** — emails rarely public
- **10 uncategorized** — includes James Lutterodt (father of deceased NSMQ star), Conrad Lutterodt, Phillipina Lutterodt, Tobias Lutterodt, Sarah Yssing Lutterodt
- **No photo/avatar field** — schema lacks image_url column (would need migration)

## Emerging Patterns (updated)
- **Cybersecurity cluster:** Edward, Gerrard Samuel, Helbert (aspiring), Nicholas Haldane-Lutterodt — 4 infosec
- **Academia cluster:** Clement (Howard), Herman (KNUST), Sarah (Oxford/PhD), Christof (Bath), Melissa (Copenhagen), Freda (education), Helbert (Harvard) — 7+ 
- **Forbes 30 Under 30:** Cyril Lutterodt
- **Medical cluster:** Dr. Christopher, Dr. Alfred, Dr. Melissa, Martha Gyansa-Lutterodt, Rodger MacScott, Nicholina Haldane-Lutterodt — 6+ doctors
- **Data center niche:** Davis Lutterodt (Apollo MCE)
- **UK as diaspora hub:** 26 UK-based Lutterodts across finance, tech, education, medicine, construction
- **Estonia:** Johann Lutterodt + Mailis Meier-Lutterodt — 2 in Baltic states
- **Spanish frontier:** Alexander Lutterodt Philip (Madrid) — first Spain-based Lutterodt
- **Art cluster:** Ascan Lutteroth (German painter), Isabelle Lutterodt (LA curator), George A.G. Lutterodt (historical photographer), Freda Lutterodt (poet/painter)

## Next Steps
1. **Send letters** — 195 queued outreach letters ready (via LinkedIn, email, phone)
2. **Build db.lutterodt.org** — Phase 2+ with live 205-profile directory
3. **Add photo field** — Profile photos from LinkedIn/Google would improve quality significantly
4. **Fill remaining DOBs** — Could try Ancestry, FamilySearch, or genealogical databases
5. **Add Brave Search API key** — Would enable deeper discovery beyond DuckDuckGo limits

## Key Files
- `C:\Users\user\Desktop\lutt letters\research-task-list.html` — Research tracker + Build Roadmap
- `C:\Users\user\Desktop\lutt letters\letters\` — 265 HTML outreach letters
- `src/app/api/outreach/profiles/route.ts` — D1 CRUD API for outreach profiles
- `src/lib/outreach/d1.ts` — D1 schema, normalizeName, slugify helpers
<!-- END:anchored-summary -->
