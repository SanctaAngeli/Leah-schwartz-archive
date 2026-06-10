# Site Review & The 100x Plan — June 2026

*A full walkthrough of every route (30 pages, desktop + mobile, automated console/layout audit), conducted 2026-06-09. Companion to the May review (`SITE_REVIEW.md`), which mostly shipped. This one is about what the site has become since: enormous, often beautiful, and badly in need of an editor.*

---

## TL;DR

**The site doesn't need more features. It needs curation, rhythm, and a floor plan.**

There are ~30 routes. The best things on the site — the Color Atlas, the studio table-top, The Last Paintings, the infinite canvas, the dark lightbox — are genuinely museum-grade. But:

1. **Four signature experiences are linked from nowhere.** `/constellation`, `/walk`, `/last-paintings`, and `/daily` have zero inbound links. They are unreachable except by typing the URL. Entire sprints of finished, beautiful work are invisible to every visitor.
2. **Five zombie v1 pages are still reachable** — `/eras`, `/story`, `/classic`, `/tour`, `/timeline`, `/curated` — showing **the wrong birth year (1945)**, gray placeholder rectangles, and the era buckets the May review killed. `/timeline` is linked from six places, including the search modal.
3. **Text and art live in separate rooms.** `/her-words` is a 34,000-pixel page with 15 images on it. `/life` is 18,000px of mostly prose. Theme rooms open with an essay wall before a single painting. This is the inverse of her book, where no spread is far from a picture.
4. **The production build is broken.** `npm run build` fails on two TypeScript errors. The site cannot ship right now.
5. Dozens of small polish breaks (catalogued below) — duplicated headings, OCR typos in her prose, section headings baked into paragraph text, colliding nav on mobile artwork pages, a forced 2-second preloader on every visit.

The 100x version is not 100 new features. It is: **a lobby that says who she was, five wings instead of thirty doors, art every few paragraphs, one motion language, and zero broken rooms.**

---

## Part 1 — What is excellent (protect these)

| Page | Why it works |
|---|---|
| `/` front door | One painting on deckled paper, her name, silence. Right instinct, needs three small additions (below). |
| `/canvas` | The strongest "see her work" experience. Dense, wandering, alive. |
| `/atlas` | "A Lifetime in Color" is the most beautiful data-art on the site. Stunning even at thumbnail size. |
| `/studio` (table-top) | The painted desk with her palette, brushes, notebooks, photos — best page-top on the site. |
| `/last-paintings` | "A quiet room" — reverent, slower, exactly right. *And no one can find it.* |
| Artwork lightbox | Dark wall, zoom, her words beside the piece, related rail. Museum-grade (desktop). |
| `/pairings` | Editorial, restrained, lovely. |
| `/places` | Clean map, good pins. |

The bones are not the problem. **The building has no floor plan and half the wings are unlit.**

---

## Part 2 — The audit (evidence)

### 2.1 Broken / wrong (fix this week)

| # | Issue | Where | Evidence |
|---|---|---|---|
| B1 | **Production build fails** — `tsc -b` errors on unused vars | `Navigation.tsx:25` (`goToRandomArtwork`), `proseLinker.ts:64` (`full`) | `npm run build` exits non-zero |
| B2 | **Wrong birth year "1945–2004"** on two reachable pages | `/eras` (LandingPage), `/story` (ScrollStoryPage) | Screenshots; she was born 1920 |
| B3 | **Zombie v1 pages reachable**: gray placeholder boxes, invented chapters ("Early Years", "Mature Work"), dead era buckets | `/eras`, `/story`, `/classic`, `/tour`, `/timeline`, `/curated` | `/timeline` shows "Four decades" (she painted six+) over grey cards |
| B4 | **Stale links point into the zombies** | `SearchModal`, `ExplorationChoiceModal`, `useKeyboardShortcuts`, `LandingPage`, `ScrollStoryPage` → `/timeline` | grep: 6 files link `/timeline` |
| B5 | **Orphaned signature pages — zero inbound links** | `/constellation`, `/walk`, `/last-paintings`, `/daily` | grep: 0 files link to any of them |
| B6 | **React duplicate-key errors** (5×) | `/index` | console: "Encountered two children with the same key" |
| B7 | **Framer scroll-measurement warning + visible mid-scroll layout breakage** (text overlaps nav, hard dark→light seam) | `/studio-visit`, `/story` | console warning + screenshot at 30% depth |
| B8 | **Mobile artwork page**: global nav pill collides with lightbox close/♥ buttons; painting not visible above the fold | `/artwork/:id` at 390px | screenshot |
| B9 | **G-chord table stale**: `g h` and `g d` both go to `/`; label says "Home (Painting of the Day)" — no longer true | `useGlobalShortcuts.tsx:16` | code |
| B10 | **WebGL GPU stall** (`ReadPixels`) from watercolor shader on every page | `WatercolorShader` / `AccentWashShader` | console, High severity |
| B11 | Canvas tooltip says "⌘+scroll to zoom" on touch devices | `/canvas` mobile | screenshot |
| B12 | Active section pill renders blank (label invisible) on mobile reader | `/her-words` at 390px | screenshot |

### 2.2 Content & typography breaks

| # | Issue | Where |
|---|---|---|
| C1 | **Section headings baked into paragraph text**: "TRAVEL I used to be so petrified…", "FRANCE We have, at various times…" | chapter essays on `/themes/:id`, prose data |
| C2 | **Tagline/heading duplication**: tagline rendered twice on every theme room; "Autobiography" heading appears twice consecutively on `/her-words` | `ThemesPage`, `HerWordsPage` |
| C3 | **OCR errors in her prose** ("Most of these still ides are watercolors", "8x1 1") | prose markdown + artwork quotes |
| C4 | **"In Leah's own words" sometimes shows catalog caption dumps**, not prose ("GIRL WITH ARM, 1935 watercolor, 8x1 1 JEANETTE…") | artwork detail panel |
| C5 | "Autobiography — 0 works" dead card | `/themes` grid |
| C6 | Naming inconsistency for identical destinations: nav says **Gallery/Canvas/Leah's Story/Eras**; front door says **Themes/Paintings/Her Story/Eras**; the `/eras` URL is a different page entirely | Navigation vs FrontDoorPage |
| C7 | Theme cards are `<div>`s, not links — no cmd+click, no keyboard access, no crawlability | `ThemesPage` |
| C8 | Inconsistent crops on theme cards (white slabs on card edges; one card crop includes the book's printed caption text) | `/themes` |

### 2.3 Experience problems (the real subject of this review)

**E1 — The front door doesn't introduce her.** No dates, no "watercolorist", no line in her voice. The painting is secretly a "watch intro" button (hover-only hint a first-timer will never see) — and clicking a painting should show the painting, not launch a video-like overlay. The signature Z-axis entrance is effectively undiscoverable.

**E2 — The text walls.** Page heights measured: `/her-words` 34,423px (15 images); `/life` 18,057px; `/themes/travel` 22,370px; `/at-her-age` 22,987px. At 25% and 60% scroll depth on `/her-words` there is literally nothing on screen but justified prose. Harry's instinct is exactly right: nobody is given a reason to keep scrolling. Her book never does this — the book is pictures with prose breathing between them.

**E3 — No path.** Every page is a dead end: you finish a theme room and the only move is the nav pill. A museum always shows you the next room. There is no "continue" anywhere on the site.

**E4 — One nav, two vocabularies, thirty rooms.** Nine nav items, seven foot-directory items (different labels), ~30 routes, and the best rooms in none of them. Engagement features meant to make the site *returnable* (daily painting) are orphaned.

**E5 — Motion is inconsistent.** Each page invented its own entrance. Clicking art sometimes opens a modal, sometimes a route, with a generic crossfade; nothing carries the painting from grid to close-up. The 2-second forced preloader (`PagePreloader minDuration={2000}`) makes every first paint feel slow — polish in reverse.

**E6 — `/at-her-age` collapses mid-page** into an undifferentiated 289-image grid — the photo-of-her-at-that-age pairing (the emotional engine) gets lost.

---

## Part 3 — The 100x Plan

> Organizing idea: **the site is a museum.** A museum has a lobby, a handful of wings, wall text *next to* the art in measured doses, a docent route through the rooms, and a reason to come back. Every decision below follows from that.

### Sprint R1 — "No broken rooms" (triage; ~1 day of focused work)

1. Fix the two TS errors; production build green again. *(B1)*
2. **Delete the zombies.** Remove `/eras`, `/story`, `/classic`, `/tour`, `/timeline`, `/curated` routes and their page files (git history preserves them). Redirect each old path to its living equivalent (`/eras→/at-her-age`, `/story→/`, `/timeline→/at-her-age`, `/tour→/themes`, `/curated→/themes`, `/classic→/`). Purge the six stale in-app links. *(B2–B4)*
3. Fix duplicate keys on `/index`; fix the G-chord table (`g d → /daily`, labels); fix Framer scroll-container warnings and the `/studio-visit` mid-scroll overlap. *(B6, B7, B9)*
4. Mobile artwork view: suppress the global nav when the lightbox is open; painting above the fold; device-aware canvas hint; fix the blank active pill in the reader. *(B8, B11, B12)*
5. Kill the forced preloader minimum (or show it only while fonts/hero actually load). Instant first paint. *(E5)*
6. Watercolor shader: stop the ReadPixels stall, pause when tab hidden, honor `prefers-reduced-motion`. *(B10)*
7. Content QA pass: strip inline ALL-CAPS headings into real `<h3>`s; de-dupe taglines/headings; script-assisted OCR sweep of the prose (flag suspect tokens, hand-fix); "Autobiography 0 works" card routes to `/her-words`; theme cards become real links; recrop the broken theme-card heroes. *(C1–C8)*

*Ship criterion: every reachable page is correct, every fact is true, build is green.*

### Sprint R2 — The floor plan (information architecture)

**One lobby, five wings, one vocabulary.**

```
/                  THE LOBBY
                   today's painting (daily rotation absorbed into the front door)
                   name · 1920–2004 · one line · one quote in her voice
                   five doors + quiet "Watch the intro" pill

/paintings         WING 1 · THE WORK
                   canvas (hero entry) · themes/12 chapters · atlas ·
                   obsessions · pairings · the last paintings

/her-story         WING 2 · THE LIFE
                   her words (the autobiography, re-paced) · at her age ·
                   life-chapters content merged here

/places            WING 3 · THE WORLD
                   map · regions · travel chapters cross-linked

/studio            WING 4 · THE PRACTICE
                   table-top hub (already built!) · studio visit 1985 ·
                   walk with her

/about             WING 5 · THE ARCHIVE
                   bio · family · estate/contact · the index ·
                   constellation · preservation/API
```

Concretely:

1. **Nav pill: exactly six items** — Paintings · Her Story · Places · Studio · About (+ search). Same labels on the front door, in search, in shortcuts, everywhere. One name per place, forever. *(E4, C6)*
2. **Each wing gets a landing room** — a beautiful, art-forward directory page (the studio table-top already shows the pattern: it's a *scene*, not a menu). This is where the orphans get adopted: Atlas, Obsessions, Pairings, Last Paintings become large painted cards inside Paintings; Walk With Her and Studio Visit live in Studio; Constellation lives in About/Index. **Zero orphan routes** — enforce with a CI check that every route has ≥1 inbound link.
3. **The lobby answers "who is she" in five seconds**: add `1920 – 2004 · watercolors · Mill Valley, California` under her name, plus one rotating Caveat pull-quote. Make the **daily painting** *be* the lobby painting ("Today's painting · June 9") — the return ritual moves to the front door where it can actually work. Painting click = open the painting; "Watch the intro" becomes a visible quiet pill. *(E1)*
4. **"Continue" doors on every page.** A small fixed-bottom rail at the end of every room: *"Next room → The Color Atlas"*. Define one curated walking route through the whole museum (lobby → canvas → a theme → atlas → obsessions → pairings → last paintings → her words → studio → places → about). A first-time visitor who only ever presses "continue" sees the entire site in order. *(E3)*

### Sprint R3 — Art between the words (the reading experience)

The single highest-impact change for the "feels like homework" problem:

1. **Build one `ProseFlow` component** that takes a prose section + its mentioned artworks/photos and renders a fixed rhythm: **never more than ~5 paragraphs without a visual event** — a full-width painting moment (with her caption), a photograph, or a Caveat pull-quote acting as a section break. Mentions already exist in the data (`mentioned_artworks`, photo classifications); fall back to same-chapter works when a stretch has no mentions. Deterministic, with a per-section override file for hand-curation.
2. **Split `/her-words` into one route per section** (`/her-story/immigrants`…): reading time badge ("6 min"), progress hairline, prev/next section doors, end-of-section painting rail. A 34,000px page becomes fourteen 2–4k pages with momentum. Apply the same treatment to `/life` content — then **merge `/life` into Her Story** (they are the same story told twice; keep the best of both).
3. **Theme rooms: art first.** Open on a full-bleed hero painting + 2–3 sentence excerpt; grid begins immediately; the full chapter essay is interleaved **between grid rows** (one paragraph block every 6–8 works) rather than stacked on top. *(E2)*
4. **`/at-her-age`: keep the pairing, lose the dump.** Each life-section shows the photo of her + a *curated* 6–10 works (not all 289); "see all from these years" expands. The slider stays — it's the emotional spine. *(E6)*
5. **About becomes one screen** of orientation (portrait, five facts, doors to Her Story/Family/Estate) instead of a long scroll competing with Her Story.

### Sprint R4 — One motion language (feeling & polish)

1. **The signature move: shared-element transitions.** Click any painting anywhere → the thumbnail itself glides and grows into the lightbox (Framer Motion `layoutId`), like stepping toward a wall. Back = it returns. This one pattern, applied everywhere, is most of the "Apple feel". 
2. **One entrance, sitewide**: fade-up 16px / 0.5s / 60ms stagger, defined once (a `<Reveal>` primitive), used by every page. Delete per-page variants.
3. **Page transitions**: ≤300ms crossfade with 8px directional drift; consider replacing `AnimatePresence mode="wait"` (which inserts a blank beat between every page) with an overlapping transition.
4. **Hover grammar**: paintings scale 1.02 with shadow lift; UI pills get background shifts; nothing else moves. Audio tick stays optional.
5. **Performance budget**: virtualize/paginate anything >40 images; `fetchpriority="high"` on each page's hero; preconnect fonts; cap the shader's framebuffer and pause it off-screen. Target: first paint < 1s on a normal connection, no scroll jank on `/at-her-age`.
6. **Reduced-motion audit**: every animation has a calm fallback.

### Sprint R5 — Returnable (after R1–R4, not before)

1. Daily painting in the lobby (done in R2) + tiny "yesterday" link for the ritual.
2. **Letters to Leah** (already in the Sprint 10 backlog) — the one feature that makes the archive a gathering place rather than a monument. Needs the tiny backend.
3. Per-artwork OG/social cards generated at build time, so any shared painting unfurls beautifully.
4. The Sketchbook flipbook (backlog) — strongest "come back for the next notebook" content.

### What we will *not* do

- No new top-level routes. New ideas become rooms inside wings.
- No feature ships without an inbound link from a wing landing.
- No page may show more than ~5 consecutive paragraphs without art.
- Nothing that competes with the paintings (the May rules still stand).

---

## Suggested order & effort

| Sprint | Effort (focused) | Outcome |
|---|---|---|
| R1 triage | ~1–2 days | Nothing broken, nothing false, build ships |
| R2 floor plan | ~3–4 days | Six doors, zero orphans, a natural path |
| R3 reading | ~3–4 days | Her voice with art breathing through it |
| R4 motion | ~2–3 days | One language; the gallery feel |
| R5 returnable | ~2 days + backend Q | Reasons to come back |

R1 is unambiguous and could start immediately. R2 changes the sitemap, R3 merges `/life` into Her Story — both worth a yes from Harry before building. Once approved, fold this into `PLAN.md` as Sprints 11–15 per the living-document convention.

---

*Audit artifacts: 70+ screenshots (desktop 1280×800 + mobile 390×844) and a per-route console/layout report were generated with Playwright; metrics quoted above (page heights, image counts, inbound-link counts) come from that run. The walkthrough script lives outside the repo (`/tmp/leah-review/`) and can be re-run any time.*
