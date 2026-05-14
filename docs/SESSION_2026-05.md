# Session Log — May 13–14, 2026

*A summary of everything that landed across one long working session. Six sprints shipped, the site went from v2.6 to v3, and a real cinematic entrance was built from scratch in three.js.*

---

## Starting point

Site was at v2.6 with the infinite canvas just landed. Major issues:
- The Painting-of-the-Day was acting as the home page (with yesterday/tomorrow buttons), which was sending first-time visitors back out
- The top nav was hidden on `/` until interaction
- `/places` was crashing (`react-leaflet@5` incompatibility with React 18) and trapping visitors
- Gallery had three awkward "era" buckets when the book itself was already organized into 12 themes
- Several pages (Her Words, Studio, About) were text-rich but image-poor

---

## Strategic docs written first

Before shipping any code, three documents were committed so the work had a frame:

- **`docs/SITE_REVIEW.md`** — opinionated critique of v2.6: where the visitor journey is, where it breaks, the three urgent fixes, a proposed home page sketch, IA recommendations
- **`docs/IDEAS.md`** — 21 ambitious feature ideas across five categories (cinematic, voice, discovery layers, living archive, tactile/sensory) with a curated top three
- **`docs/PLAN.md`** updated to v3 with six new sprints (5 through 10)

---

## Sprint 5 — Front door & escape routes ✅

**Goal:** First-time visitors land on a real home and can navigate without getting stuck.

- **New home page** at `/` ([`FrontDoorPage`](../src/pages/FrontDoorPage.tsx)) — Mt. Tam from Sonoma as hero, her name + dates, pull-quote in Caveat, three pill paths (See her work / Read her story / Browse themes), nav always visible
- **Moved DailyPage to `/daily`** — kept the daily-rotation ritual as a destination, dropped the yesterday/tomorrow chrome
- **Fixed `/places` crash** — downgraded `react-leaflet` from 5 to 4 (React 18 compat); cleared Vite cache
- **Escapable ErrorBoundary** — added a "Back to home" link beside "Try Again" so crashed pages never trap visitors
- **Merged `/gallery` → `/themes`** — added a `<Navigate>` redirect, removed "Old Stuff & Early Voice" / "Road & Landscape" / "Home, People & Travel" era buckets from the nav, dropped "stuff" terminology

---

## Sprint 6 — Visual richness in existing pages ✅

**Goal:** Make the pages we have feel like the book opening up, not transcripts.

- **Photos inline in `/her-words`** — replaced the horizontal photo strip at the top with photographs interleaved between prose chunks throughout the section. Added a `chunkParagraphs()` helper to split markdown by paragraph boundaries.
- **Painting thumbs inline in `/her-words`** — when Leah names a painting in her prose, its thumbnail floats in the right margin next to the mention. Used `markFirstArtworkLinks()` to add `#first` to only the first occurrence so we don't get duplicates.
- **Studio enrichment** — moved the studio photos to the top of the page (answering "who" before the words do), added a watercolor exemplar (Pale Pink Rose with Cosmos) floating beside "How she found watercolor", and a darker oil (Migraine) beside "When the work stalled"
- **About enrichment** (deferred the full split) — added two photos floating in the margins, the Herman portrait beside the marriage paragraph, a deeper paragraph from the autobiography (the divorce story, BEADING COLLEGE), inline links to the sons' `/people/:id` pages, and a prominent "A life in chapters →" pill
- **Living Watercolor Backdrop** — sitewide subtle radial washes in chapter accent colors, drifting slowly. `WatercolorBackdrop` component, respects `prefers-reduced-motion`.

---

## Sprint 7 — Data-art trio ✅

**Goal:** Three new features built purely from existing data, high beauty-to-effort.

- **Color Atlas** at `/atlas` — wrote a Python script (`scripts/extract_palettes.py`) that uses PIL median-cut quantization to extract a 5-color palette from each of the 267 paintings, writes to `src/data/palettes.json`. The page shows the palettes as a strip of vertical stripes, one per painting, sortable by book order / chapter / hue / lightness. Hover any stripe to see the painting and its swatches.
- **Obsessions** at `/obsessions` — 15 hand-curated clusters in `src/data/obsessions.ts` (Mt. Tam, irises, Naxos, Bolinas, Petaluma, Gello, self-portraits, pears, persimmons, onions, roses, kitchens, Marin, side streets, markets), each matching paintings by title pattern with a short curatorial note
- **At Her Age** at `/at-her-age` — slider through 8 life eras with photo + paintings + caption at each one. Hand-curated `PHOTO_OVERRIDE` map to pin known-good photographs to specific eras (`p028_02.jpg` "Daniel and Me" for Art School era, `p029_02.jpg` Leah-in-profile for Mill Valley, etc.).

---

## Sprint 7 polish ✅

After the sprint, fixed three things the user called out:

- **Discoverability** — the tiny dot-separated row of secondary links at the bottom of the home was burying everything; replaced with a clearly-labeled "More ways in" grid of cards
- **At Her Age timeline** — eras were overlapping (Travel 1980–99 covered Prolific 1975–89); made ranges non-overlapping. Layout center-aligned (title, age, caption, photo, paintings all on the center axis). Showed every painting from the era, not just 8. Keyboard ← → wired up.
- **Color Atlas preview** — hover card enlarged from a 96px thumb to a proper 224px painting card with bigger swatches and dimensions
- **Nav direct access** — Atlas / Obsessions / Eras now sit alongside Home / Gallery / Canvas / Story / Studio / About
- **Obsessions centered** — matched the At Her Age layout treatment
- **Era state in URL** — `/at-her-age?era=ID` so clicking into an artwork and returning lands you on the era you were viewing instead of resetting to Childhood

---

## Sprint 8 — Navigation evolves ✅

**Goal:** New ways into the work that complement the canvas.

- **The Last Paintings** at `/last-paintings` — deep cream parchment background, paintings shown one per row at generous size, slow fade-in on scroll, curatorial note in serif italic beside each. Opens with the chrysanthemums passage from her autobiography. Hand-curated set of 14 works from Interiors, late Still-Lifes, and Japanese-influenced Flowers.
- **Constellation as destination** at `/constellation` — promoted the existing `<Constellation>` component from a hidden toggle inside `/index` to its own peer page. Three bubble clusters (88 people, 99 subjects, 68 places) sized by mention count.
- **Walk With Her** at `/walk` — guided 8-painting tour. Painting fades up large on a dark gallery wall, her own words fade in below as a caption. Pause / prev / next / Esc / keyboard ← → / space all wired up. Segmented progress bar at top. Audio hookup is pending the user-provided file.

---

## Sprint 9 — Cinematic moments ✅

**Goal:** The signature moments people remember and share.

### Studio Visit at `/studio-visit`
Long-scroll narrative arriving at her Mill Valley studio in 1985. Alternating dark and parchment scenes, parallax-translated photos and paintings, her own words at each beat: the easel by the window, the kit, the Bellini on the wall, Mt. Tam through the glass, the kitchen downstairs. Closes with "She painted in that studio until 2003."

### Z-axis Entrance — three iterations until it landed
This one took several swings.

**v1 (failed)** — scattered paintings in 3D CSS-transform space with the camera flying past them. User's feedback: "I really don't like it. It's all black. The word Leah Schwartz is obscured. The arts are all overlapping. Could be taller and bigger. Could feel longer. The bezier curve slowed at the end doesn't work, because you're coming into nothing."

**v2 (CSS-3D corridor)** — restructured as two walls of paintings with the camera dollying down a hallway. Still had rendering quirks (home-page bleed-through during flight) and the CSS-3D ceiling on visual quality was real.

**v3 (three.js, the one that landed)** — installed `three`, `@react-three/fiber@8`, `@react-three/drei@9` (the React 18-compatible line). Built [`GalleryCorridor3D`](../src/components/home/GalleryCorridor3D.tsx):

- **Real 3D scene**: floor, ceiling, two side walls, back wall
- **Light gallery aesthetic** (changed from dark on user feedback): cream walls (`#EBE2D0`), warm beige floor, soft cream ceiling, cream fog that fades distance to bright haze
- **Real painting textures** on PlaneGeometry meshes — used `thumbPath` (~600px) rather than the 300dpi scans for GPU upload performance
- **~60 paintings** packed at 4-unit spacing on alternating walls, gallery-sized (3.4–4.5 world units wide)
- **Hero painting at the back wall** — Mt. Tam from Sonoma, the same painting that's the home page hero, so the camera flies directly into it and the corridor "becomes" the home
- **Performance tuning**: corridor length 135 units (halved from 270 for stutter fix), single hemisphere light + 3 accent point lights (was 30+ point lights), thumb textures
- **Constant-velocity flight** — 5.5 seconds, pure linear interpolation (no easing curves), user feedback was that "fast/slow/fast" pacing felt wrong

Triggered by a clear **▶ WATCH INTRO** pill on the home hero painting; splash shows just her name + ENTER; clicking ENTER plays the flythrough; cross-fades into the home.

---

## What's on GitHub now

All shipped to `main` on [SanctaAngeli/Leah-schwartz-archive](https://github.com/SanctaAngeli/Leah-schwartz-archive).

Routes that exist now:
- `/` — front door (hero painting + name + quote + 3 paths, with Watch intro button)
- `/canvas` — infinite draggable canvas
- `/themes` — the gallery (12 chapters)
- `/her-words` — autobiography reader (now image-rich)
- `/pairings` — curated diptychs
- `/places` — world map (fixed)
- `/studio` — the studio (now image-rich)
- `/about` — biography (now image-rich)
- `/atlas` — Color Atlas
- `/obsessions` — Subjects she returned to
- `/at-her-age` — Slider through 84 years
- `/constellation` — Index Constellation as a destination
- `/walk` — Walk With Her (guided tour)
- `/last-paintings` — A quiet room for the late work
- `/studio-visit` — Scrollytelling studio visit
- `/daily` — the daily painting ritual (moved off `/`)

Plus everything that was already there: `/index`, `/life`, `/people/:id`, `/subjects/:id`, `/themes/:id`, `/places/:id`, `/artwork/:id`, `/preservation`, etc.

---

## What's still in the plan (Sprint 10)

Not started — partly because some items depend on you:

- **The Sketchbook** — digital flipbook of her travel notebooks. Needs notebook page extraction from the book PDF (`leah-extraction/`).
- **Watercolor Sandbox** — browser-native watercolor simulator on `/studio`
- **Letters to Leah** — visitor sentences accumulating on the home. Needs a lightweight backend.
- **David's selections** — a curated tour with David's chosen paintings and his own commentary. Needs David's prose.

Also pending: **ambient audio for Walk With Her** — the page is wired and ready, just needs the audio file.

---

## Open questions that came up

None that block shipping. Everything that needs an answer to land is captured as a Sprint 10 dependency above.

---

## Files added this session

```
docs/SITE_REVIEW.md              — strategic critique
docs/IDEAS.md                    — 21 candidate features
docs/SESSION_2026-05.md          — this file
docs/PLAN.md                     — updated with Sprints 5–10 and v3 changelog
scripts/extract_palettes.py      — Python PIL palette extraction
src/data/palettes.json           — 267 painting palettes (5 colors each)
src/data/obsessions.ts           — 15 hand-curated subject clusters
src/pages/FrontDoorPage.tsx      — new home
src/pages/CanvasPage.tsx         — infinite canvas (from earlier in session)
src/pages/ColorAtlasPage.tsx
src/pages/ObsessionsPage.tsx
src/pages/AtHerAgePage.tsx
src/pages/LastPaintingsPage.tsx
src/pages/ConstellationPage.tsx
src/pages/WalkWithHerPage.tsx
src/pages/StudioVisitPage.tsx
src/components/canvas/InfiniteCanvas.tsx
src/components/home/EntranceOverlay.tsx       — splash + corridor controller
src/components/home/GalleryCorridor3D.tsx     — three.js corridor scene
src/components/ui/WatercolorBackdrop.tsx      — sitewide soft washes
src/utils/canvasLayout.ts        — masonry layout for canvas
```

---

*The next session should pick up with whatever's most important from Sprint 10, or any polish that comes from spending real time on the live site.*
