# Leah Schwartz Digital Archive — Living Plan

**Status:** Active (v3 — Sprint 5 starting)
**Last updated:** 2026-05-13
**Owners:** Harry · Claude

> This is a **living document**. It is rewritten when direction changes, not appended to indefinitely. When something shifts — scope, architecture, a feature idea — edit this file first, then change code.
> A short **Changelog** lives at the bottom. Older versions: `docs/archive/`.

---

## ⚡ Sprint 5 — Front door & escape (current)

**Goal:** First-time visitors land on a real home, see who Leah is in five seconds, and can navigate any path without getting stuck.

1. [x] **New home page** — hero painting full-bleed + name + dates + one pull-quote in her voice (Caveat) + three pill paths: *See her work* (`/canvas`) · *Read her story* (`/her-words`) · *Browse themes* (`/themes`). Nav always visible.
2. [x] **Move DailyPage to `/daily`** — keep the daily-rotation ritual for returning visitors as a destination, but drop the yesterday/tomorrow chrome (it doesn't belong on the front door, and the time-traveling buttons confuse first-timers).
3. [x] **Fix `/places` crash** — `react-leaflet@5.0.0` is incompatible with React 18 (`TypeError: render2 is not a function` in `MapContainer`). Downgrade to `react-leaflet@4.x` and patch any v5-only API in `WorldMap.tsx`.
4. [x] **Escapable ErrorBoundary** — every error screen must show a visible "Back to home" link so crashed pages never trap visitors.
5. [x] **Merge `/gallery` → `/themes`** — the 12 book chapters are the gallery. Drop the "Old Stuff & Early Voice" / "Road & Landscape" / "Home, People & Travel" era buckets. Use the book's chapter names + taglines verbatim.

**Ship criteria:** A new visitor lands on `/`, learns who Leah is, picks one of three paths, and on every page can keep going or get home.

**Source documents:** See [SITE_REVIEW.md](SITE_REVIEW.md) for the full critique that produced this sprint.

---

## Sprint 6 — Visual richness in existing pages

Make the pages we have feel like the book opened up, not transcripts.

- [ ] **Inline photographs in `/her-words`** — wire the 74 photo candidates (already classified in `photos.json`) into the autobiography reader at the moments she describes them. Family in IMMIGRANTS, studio in WORK, Herman where he first appears.
- [ ] **Inline painting thumbnails in `/her-words`** — UPPERCASE title mentions are already linkified; add small marginal thumbnails of the actual painting beside the text. So when she names a piece, you see it.
- [ ] **Studio enrichment** (`/studio`) — at least one photo of her in the studio, work examples beside each philosophy paragraph (her brush technique → a watercolor where it shows), and a "tools" rail naming her actual materials.
- [ ] **About split** — `/about` (bio narrative, expanded with book content) · `/family` (Herman + Dan + Peter + Davy + parents, already in `people.json`) · `/estate` (©, contact, book credits, preservation links). Surface `/life` prominently from `/about`.
- [ ] **Living Watercolor Backdrop** — sitewide faint watercolor wash in the chapter accent color, generated on each page load, blooming and fading subtly. Makes the chrome itself feel painter-made.

---

## Sprint 7 — Data-art (signature beauty, no permissions)

Three new features built purely from existing data; highest beauty-to-effort ratio in the backlog.

- [ ] **Color Atlas** — extract dominant palettes from every painting (color-quantization library). Show her chromatic evolution as a horizontally-scrollable spectrum of her career: sober browns of the 1940s, Mediterranean blues of the 1970s travel years, blooming pinks of the late flower work. A temporal pigment analysis. Scholars love it; visitors find it stunning.
- [ ] **Subject Obsessions** — auto-cluster her recurring subjects (Mt. Tam, Herman, the stained-glass window, one pear, Naxos rooftops) by traversing `place_ids` / `people_ids` and INDEX co-occurrence. Each cluster sequenced by year so her treatment evolves visibly. The Pairings page gestures at this; expand into a full discovery layer.
- [ ] **At Her Age** — a slider across her 84 years divided into life-sections (Chicago childhood / New York art school / early Bay Area / Mill Valley + sons / travel decades / late work). For each section: a photograph of Leah at that age + the paintings she was making + a one-line caption of what was happening. (User will source additional photos as needed.)

---

## Sprint 8 — Navigation evolves

New ways into the work that complement the canvas.

- [ ] **`/constellation`** — promote Index Constellation from a hidden toggle to its own peer destination. Every person, place, subject is a node sized by mentions, edges glow on hover with the prose excerpts where the connection appears. Navigation by association — the **mind** of the archive made visual.
- [ ] **Walk With Her** — canvas autopilot. Press a button, the drag controls release, the canvas glides through a curated path through her career. On-screen captions appear (her own words from the chapter intros), ambient background audio plays (user to provide). Apple Maps Flyover for an artist's life. Six or seven curated walks, ~90 seconds each.
- [ ] **The Last Paintings** — a separate reverent room for the 2002–2004 work. Different design language: slower transitions, more white space, no glossy hover effects, paintings shown larger, her late words next to them. Treats the end with the gravity it deserves.

---

## Sprint 9 — Cinematic

The signature moments people remember and share.

- [ ] **Z-axis Entrance** — rebuilt from scratch with three.js for smoothness (the v1 attempt was janky). Once-only on first visit (cookie-gated). On landing: paintings hang in 3D space, the camera moves forward, paintings drift past on side walls, the deepest one resolves into the home's hero with her name centered. ~2 seconds total. Then the static home settles.
- [ ] **Studio Visit scrollytelling** — long-scroll narrative arriving at her Mill Valley studio in 1985. Parallax photographs, ambient sound (brush in water? gulls? typewriter?), her own words pulled at the right moments, paintings revealed on walls as you scroll past. Treats her like she's still there.

---

## Sprint 10 — Tactile & community

Things that grow over time, and things that feel like her medium.

- [ ] **The Sketchbook** — digital flipbook of her travel notebooks. Paper texture, sketches on one side and travel prose on the other, real page-turn animation. The most book-like artifact we can make. *Dependency: notebook page extraction from the book PDF; check `leah-extraction/` for unprocessed scans.*
- [ ] **Watercolor Sandbox** — a small browser-native watercolor simulator on `/studio`. Real bleeding pigments, paper grain, brush wetness. The visitor tries her medium. Save your sketch; a small gallery of visitor pieces accumulates.
- [ ] **Letters to Leah** — visitors can leave a single sentence after experiencing the site, addressed to her. Curated for tone. Accumulate on the home as a slow carousel and on a dedicated `/letters` page. *Dependency: lightweight backend (Google Sheet via Apps Script, or a tiny Vercel serverless function).*
- [ ] **David's selections** — a curated tour with David's chosen paintings and his own commentary/highlights. Replaces the "tours by family" idea — focused on one voice. *Dependency: David provides the selections and prose.*

---

## ✅ Sprint 1 — Make the content sing (shipped)

**Goal:** Every page draws from the real book content. Her voice is present, not just her pictures.

Priority order (top first is most impactful):

1. [x] Data foundation: real artworks, prose, photos wired in
2. [x] Home page (scroll-story) renders real artwork, not grey tiles
3. [x] Gallery / Themes / Locations / Favorites / Compare: real images
4. [x] Timeline: undated works get synthetic chapter-based years
5. [x] **`/her-words` Leah's Story** — section selector (14 sections), beautiful single-column typography, companion artwork grid for chapter sections
6. [x] **Artwork detail redux** — Leah's voice excerpt when she wrote about the piece, book-page provenance, "more in chapter" rail
7. [x] **Theme gallery pages** — chapter hero image, intro essay, tagline, artwork grid, continue-reading link
8. [x] **About page** — real biography: born Rock Island 1920, Herman, Mill Valley + Bolinas, her own quote
9. [x] **Link prose → artwork** — UPPERCASE title mentions in Leah's writing auto-link to the artwork detail
10. [x] **Location rollups** — INDEX parsed into `people.json`, `places.json`, `subjects.json`; 68 individual places across 11 regions

**Canvas (shipped 2026-05-13):**
33. [x] **Infinite draggable canvas** at `/canvas` — all 267 paintings laid out in a seamless column-masonry tile that pans, zooms, and repeats past its boundary; pixel-perfect tile-wrap verified; click any piece to open the existing lightbox without losing canvas position; pinch / ⌘+scroll to zoom, drag to pan with momentum, recenter button.

**Sprint 4 additions (shipped 2026-04-23):**
24. [x] **Em-dash sweep** — all `—` in source/UI/HTML replaced with `·` or hyphens; Leah's prose untouched
25. [x] **Lightbox** — dark gallery-wall fullscreen art viewer with 6x pan/zoom, slide-in info panel, keyboard nav (I/F/+/−/0/arrows/Esc)
26. [x] **Handwritten typography** — `font-leah` (Caveat) used for her tagline phrases sitewide: chapter taglines, section taglines, life-chapter subtitles, entity parentheticals
27. [x] **Painting of the Day at `/`** — single-painting home with daily deterministic rotation, yesterday/tomorrow, prose mention if she wrote about it, season hint
28. [x] **Curated Pairings** — `/pairings` hub + 8 hand-curated diptychs/triptychs: Mt. Tam returned to, Herman in her hands, The stained-glass window twice, One pear many times, Two views of Naxos, Petaluma River, Self-portraits, Bolinas house
29. [x] **Global keyboard shortcuts** — `/` search, `?` cheatsheet, `G`-prefix chords for all nav, `←/→` artwork nav, `I F + - 0` in lightbox
30. [x] **Index Constellation** — toggle on `/index` for a bubble-pack view of 88 people + 68 places + 99 subjects, sized by mentions, co-occurrence edges on hover
31. [x] **Seasonal accent** — site picks up a subtle color for Spring/Summer/Fall/Winter (visible on `/`)
32. [x] **Send as postcard** — compose dialog on any artwork, opens the visitor's mail client with a formatted email and deep link

**Sprint 3 additions (shipped 2026-04-23):**
17. [x] **People + Subject pages** — `/people/:id` and `/subjects/:id` show artworks + prose mentions + autobiography deep links
18. [x] **`/studio`** signature page — her kit, her influences, her philosophy, her techniques
19. [x] **`/life`** A Life in Chapters — 8 scroll-driven life eras with photos, prose, and paintings intercut
20. [x] **Per-page `<title>` + description** via `usePageMeta` hook; og + Twitter meta in `index.html`; schema.org Person JSON-LD
21. [x] **Preservation page + JSON API** — every catalog file published at `/api/*.json` for scholars
22. [x] **19 missing crops fallback** — each now points to its full-page scan at `/page-scans/page-XXX.jpg`, flagged `needs_crop: true`
23. [x] **Lazy-load audit** — every `<img>` in the codebase has `loading="lazy"`

**Sprint 2 additions (shipped 2026-04-22):**
11. [x] **INDEX Navigator** at `/index` — her whole back-of-book index, searchable, filterable by category, A–Z strip
12. [x] **Places page** at `/places` with world map (Leaflet + CARTO tiles), region-grouped list, per-place detail
13. [x] **Regions page** at `/locations` — 12 region hero cards with real images
14. [x] **Chromatic accent per chapter** — subtle tinted header + linked underline color on each themed gallery
15. [x] **Photo triage** — 74 candidates classified (68 photos / 6 paintings by chroma), displayed as a strip in Leah's Story per section
16. [x] **Site-wide search** rebuilt — includes pages, artworks, prose sections, people, places, subjects

**Ship criteria:** a new visitor who knows nothing about Leah can click through the site and come away with (a) a sense of who she was in her own voice, (b) the scope of her work, (c) a favorite painting with the story behind it.

---

## 0. One-line purpose

> Take the complete content of Leah's book — her ~270 paintings, 28,660 words of her own voice, the places she lived and traveled, and the people she knew — and turn it into a **digital experience that feels alive**, so her art and story are preserved for generations in a form that's more than a scanned PDF.

**What this is not:** a digital replica of the book. Anyone can buy the book. The web gives us interactivity, connection, and longevity the printed page can't. If a feature is essentially "read the book on screen," we don't build it.

---

## 1. Who Leah was (source of truth)

- **Leah Schwartz**, born Rock Island, Illinois, **28 July 1920** · died **2004**.
- Immigrant family (Polish-Jewish, Pannemanski → Greenfield at Ellis Island).
- Childhood in Chicago, Boston, Michigan; art school in New York.
- Married Herman Schwartz ("the remarkable Herman") — had sons Dan, Peter, and Davy.
- Rooted in **Mill Valley** (studio) and **Bolinas** (on the San Andreas Fault) from the 1960s on.
- Primarily a **watercolorist**, also oil, gouache, tempera, collage, ink.
- Travelled obsessively (with Herman) through France, Italy, Greece, Turkey, Japan, India, Nepal, Kenya, Britain, the American Desert, the High Sierra.
- Self-described compulsion: *"a need to preserve ephemeral things that I love to look at… one way of keeping a scrapbook."*
- Book self-published on **Strawberry Press, Mill Valley, California**.

The autobiography is explicit, funny, unsparing. Her voice is the site's greatest asset.

---

## 2. Content inventory (what we have to work with)

Sourced from the 309-page book PDF — fully extracted and catalogued in `/Users/harrylee/Developer/leah-extraction/`.

| | count | source |
|---|---|---|
| Authoritative artwork records | **267** | LIST OF PAINTINGS, pp 302–304 |
| Cropped artwork images (300 DPI) | **364** | automated detection, all 309 pages |
| Words of Leah's own prose | **28,660** | autobiography + chapter intros + travel notebooks |
| Photo candidates (Leah, family, studio) | **74** | crops from autobiography + chapter-intro pages |
| Full back-of-book INDEX | 5 pages | cross-reference: people · places · paintings · subjects |

**12 chapters** in the book, in order:
1. AUTOBIOGRAPHY
2. OLD STUFF *(salvage of thirty years)*
3. ABSTRACT *(trying to be trendy)*
4. SOCIAL COMMENT *(rising from yeasty times)*
5. ON THE ROAD *(facades of obscure lives)*
6. LANDSCAPE *(vanishing verdant valleys)*
7. STREET SCENES *(the random moment)*
8. PORTRAITS *(beauty and self-possession)*
9. STILL LIFE *(in love with simple objects)*
10. INTERIORS *(gimme shelter)*
11. FLOWERS *(in love with bloom)*
12. TRAVEL — 11 regions: France · Italy · Greece · Turkey · Japan · India · Nepal · Botanizing in Kenya · Britain · Desert · High Sierra

**Each chapter has its own opening essay** in Leah's voice. Each painting has a title, dimensions, often year, often medium, sometimes a collection note. The back of the book indexes subjects, people, and paintings to page numbers.

---

## 3. The big idea — five features that make it alive

The site is organized around **five signature experiences**. Each stands on its own; together they cover every piece of content we have.

### 3.1 The Index Navigator  *(signature)*
Leah's own back-of-book INDEX becomes the site's primary discovery layer. Every person, place, subject, and painting is a clickable node. Click "Mt. Tam" → see all 5 paintings, all 12 essay mentions, a map pin. Click "Herman" → every painting featuring him, every autobiography page he appears on. This makes the whole site self-cross-referential in a way a printed index can only hint at.

### 3.2 The World Map *(signature)*
Every painting pinned to where it was made. A clustered zoom: dense around Naxos, Gello, Kyoto, Bay Area; sparse across Britain, Africa, the American desert. Click a pin → the painting + Leah's notebook excerpt from that place. California has its own zoom (Mt. Tam, Bolinas, Mill Valley, San Francisco, Petaluma, Nicasio, Bolinas Soccer Team on the San Andreas Fault).

### 3.3 Leah, in Her Own Words *(signature)*
Her autobiography is its own masterpiece — funny, direct, unsparing. She already organized her own life story into named sections (*IMMIGRANTS · CHICAGO · TO MICHIGAN · THE TODDLER YEARS · WORK · CHILDREN …*). We don't re-curate it — we **present it as she wrote it**, section by section, in a single scrollable column with:
- Leah's voice in beautiful typography (EB Garamond + the handwritten display face for pull-quotes)
- **Photographs of her, family, and studio inline** at the moments she describes them
- **Every painting she mentions hoverable/tappable** to open its close-reading view
- Her section headings preserved verbatim ("*genetic baggage*", "*salvage of thirty years*")
- Chapter-intro essays from the 12 themes readable here too, not just in their galleries

This is the site's deepest experience. Not "read the book." Just her voice, given the stage it deserves.

### 3.4 Themed Galleries *(signature)*
The 12 book chapters, each their own digital room. Each gallery has its own visual pacing — STILL LIFE feels still; ON THE ROAD feels kinetic; FLOWERS feels close-up. The paintings in large, her intro essay framing the room, her quotes pulled as wall-text.

### 3.5 Artwork Close-Reading *(signature)*
Every painting gets a detail view. **The voice is the differentiator**: if Leah wrote about the piece (and she often did), her exact words appear next to it. The detail view always shows: her words → the painting → provenance (year, medium, dims, collection) → where it sits on map + timeline + theme. One click to neighbors in any of those dimensions.

### Where her prose lives
Her voice appears in **three complementary ways** across the site:
1. **As a destination** — the full autobiography is readable on `/her-words` (feature 3.3), as she structured it.
2. **As context next to art** — wherever she wrote about a specific painting, her exact words sit beside it in the close-reading view.
3. **As threads** — quotes surface on chapter-theme pages, on place pages (via map pins), and as a rotating Voice Card throughout the site.

Every quote records its source (book page + PDF page) so scholars can trace back. The original PDF is hosted for archivists but not featured. We're not "putting the book online" — we're giving her voice a digital home that the printed page couldn't.

---

## 4. Site architecture

```
HOME
  - Cinematic landing: single rotating hero painting,
    one Leah quote, entry points to each signature feature.

EXPLORE  (the five signatures, each a route)
  /themes               → 12 chapter galleries
  /places               → world map + California map
  /her-words            → full autobiography, section by section, in her voice
  /index                → Index Navigator (her own index, digitized)
  /gallery              → flat grid of all works (filterable)

ARTWORK  /w/<slug>      → close-reading view (voice + art + provenance)

ABOUT                   → biographical intro for newcomers,
                          estate/copyright/contact, book credits.

STUDIO                  → her tools, process, philosophy (quiet page).

DOWNLOAD-THE-BOOK       → the PDF, for archivists. Not featured.
```

**Global components** live across every page:
- **Voice Card** — Leah's photo + a pull-quote; rotates topically
- **Related Rail** — "on the same map pin," "same theme," "same decade"
- **Search** — Fuse.js across artworks + prose; keyboard-first

---

## 5. Design direction

### Keep from v1
- Gallery white (`#FAFAFA`) backgrounds, glassmorphism cards, pill shapes
- EB Garamond (headings) + Inter (UI)
- Framer Motion for organic animation with cubic-bezier easings
- "The art brings the texture" — no competing patterns

### Add (book-derived)
- **A handwritten display face** for Leah's voice quotes (Caveat / Homemade Apple / custom scan of her hand if samples exist). Used *sparingly* — this is the difference between "artist site" and "Leah's site."
- **Chapter signatures** — each of the 12 themes has a subtle chromatic accent pulled from a signature painting in that chapter (e.g. ABSTRACT uses Space Matter's red). Not loud — a hint.
- **Voice Card** pattern (above): a small floating component that layers her words next to her work wherever they touch.

### Avoid
- Loud animations, overlays on paintings, stock-photo vibes, scroll hijacking on deep-reading pages, anything that competes with the art.

---

## 6. Data schema (source of truth → JSON)

Artwork, Place, Person, and Prose are the four entity types.

```typescript
interface Artwork {
  id: string;                // slug, e.g. "mt-tam-from-sonoma"
  title: string;             // "MT. TAM FROM SONOMA"
  display_title: string;     // "Mt. Tam from Sonoma" (title-cased for display)
  book_page: number;         // page number in the printed book
  pdf_page: number;          // page number in the PDF scan
  chapter: string;           // one of the 12 chapter slugs
  region?: string;           // travel region slug, e.g. "greece"
  year?: string;             // "1975", "1975-77", "c.1950"
  medium?: string;           // "Watercolor" | "Oil" | "Gouache" | ...
  width_in?: number;         // inches
  height_in?: number;
  approx_dims?: boolean;     // true if "Approx. 14 x 20"
  is_set?: boolean;          // "Each 5 x 7" for multi-part works
  collection?: string;       // "Collection of Don Cohan"
  image_full: string;        // /artworks/full/<id>.jpg (cropped, 300 DPI)
  image_thumb: string;       // /artworks/thumb/<id>.jpg (≤600px long edge)
  place_ids: string[];       // locations depicted (e.g. ["mt-tam"])
  people_ids: string[];      // people depicted (e.g. ["herman-schwartz"])
  prose_refs: string[];      // prose excerpt ids that mention this work
  neighbors: {
    same_chapter: string[];
    same_year: string[];
    same_place: string[];
  };
}

interface Place {
  id: string;                // "mt-tam", "naxos", "rumuruti"
  name: string;
  region: string;            // "bay-area", "greece", "kenya", ...
  lat?: number;              // for world map
  lng?: number;
  description?: string;      // from Leah's own writing if available
  artwork_ids: string[];
  prose_refs: string[];
}

interface Person {
  id: string;                // "herman-schwartz", "dan-schwartz"
  name: string;
  relationship?: string;     // "husband", "son", "sister", "friend"
  biographical_note?: string;
  artwork_ids: string[];     // portraits of them
  prose_refs: string[];
}

interface ProseExcerpt {
  id: string;                // "autobiography/01-immigrants"
  chapter: string;           // "autobiography" | "travel" | etc.
  section_heading?: string;  // "IMMIGRANTS"
  section_tagline?: string;  // "genetic baggage"
  body_md: string;           // the prose, markdown
  source: {
    book_page_start: number;
    book_page_end: number;
    pdf_page_start: number;
    pdf_page_end: number;
  };
  mentioned_people: string[];
  mentioned_places: string[];
  mentioned_artworks: string[];
}
```

All IDs are slugs. All cross-references are by ID. The INDEX Navigator is literally a compiled view of these entities + their `*_refs` arrays.

---

## 7. Implementation phases

Phases are **deliberately incremental** — each phase leaves the site in a better state than before, and nothing has to be redone.

### Phase A — Data foundation *(next)*
- Normalize artwork list + cropped images into `public/artworks/` + `src/data/artworks.json`
- Normalize prose into `src/data/prose/*.md` per section
- Extract + normalize the INDEX (people, places) → `src/data/people.json`, `places.json`
- Geocode travel places for map use
- Review Leah-photo candidates, move confirmed ones into `public/photos/`

### Phase B — Flat gallery + close-reading
- `/gallery` route: filterable grid of all 267 works (chapter, region, medium, year)
- `/w/<slug>` artwork detail page with full voice + provenance + related rails
- Search bar (Fuse.js)

### Phase C — Themed galleries
- 12 chapter routes under `/themes/*`, each with chapter intro essay + paintings
- Subtle per-chapter chromatic accent
- Gallery→detail seamless transitions

### Phase D — The Index Navigator
- Digitized index, every subject a node
- Node page: all artworks + prose mentions + map pin(s) + linked people
- Index becomes the site's discovery spine

### Phase E — The World Map
- World + California maps, clustered pins
- Place page: artworks + Leah's travel-notebook excerpt + related themes

### Phase F — Leah, in Her Own Words
- `/her-words` route: full autobiography scroll, section by section, as she wrote it
- Photos of her/family inline at the moments she describes
- Every painting she mentions hoverable/tappable to open close-reading
- Chapter-intro essays reachable here too

### Phase G — Polish & preservation
- Performance tuning, accessibility audit, mobile optimization
- High-res zoomable artwork viewer (IIIF-style pan/zoom?)
- Book PDF hosted for archivists
- SEO / social cards / RSS of new pieces

Each phase is **shippable on its own**. Between phases we cut a release, deploy, and gather feedback.

---

## 8. Open questions / decisions to make

| # | Question | Default if unresolved |
|---|---|---|
| Q1 | Leah's handwriting samples — do we have any to digitize? | Use Caveat or similar until samples arrive |
| Q2 | Collection provenance ("Collection of Don Cohan") — public, private, or per-piece review? | Show publicly (they're printed in the book) until told otherwise |
| Q3 | Estate / copyright statement — who owns the rights and what's the license for display? | "© Estate of Leah Schwartz" in footer until verified |
| Q4 | Domain name — `leahschwartz.com`? `leahschwartz.art`? | TBD |
| Q5 | Audio: does Leah's son want recorded readings of her prose? | Not in scope until asked |
| Q6 | Contact for inquiries (sales? loans?) — email to use? | TBD |

**Put answers here, don't hunt for them in Slack/email later.**

---

## 9. Preservation principles

Because "for generations" is a real requirement:

- **Data is portable.** JSON, markdown, and image files. No proprietary CMS. Anyone with a folder of files can rebuild the site.
- **Images at highest available fidelity.** Full-size crops (300 DPI) preserved; thumbnails generated. Never replace originals with lossy versions.
- **Source citations in every prose excerpt** (book page + PDF page). Scholars can trace quotes back.
- **The PDF of the book is hosted, not hidden.** Archival-grade reference copy always retrievable.
- **Everything in a public git repo.** History is preserved. Forks are welcome.
- **Static hosting.** Netlify/Vercel for now; if either disappears, the static files work anywhere (S3, GitHub Pages, etc.).

---

## 10. Current state (scratchpad — update as work progresses)

**Last touched:** 2026-04-22
**Extraction complete** — all artwork, prose, and photo candidates are in `/Users/harrylee/Developer/leah-extraction/`. Ready for Phase A.

**Shipped:**
- v1 of site with placeholder data (leah-schwartz-archive repo on GitHub, public)
- Full PDF extraction pipeline

**In progress:** nothing

**Blocked by:** the Open Questions in §8 (answers not urgent for Phase A).

**Next action:** start Phase A — wire real artwork data into the existing React app.

---

## Changelog

- **2026-05-13 (v3)** — Sprint 5+ roadmap committed. Critical review of v2.6 produced [SITE_REVIEW.md](SITE_REVIEW.md) (urgent fixes: home page, `/places` crash, escapable ErrorBoundary, gallery/themes merge) and [IDEAS.md](IDEAS.md) (21 candidate features). Approved selections folded into six sprints: front door (5), visual richness (6), data-art (7) — Color Atlas / Subject Obsessions / At Her Age — navigation evolution (8) — Constellation as destination / Walk With Her / Last Paintings — cinematic (9) — Z-axis entrance rebuilt with three.js / Studio Visit scrollytelling — and tactile/community (10) — Sketchbook / Watercolor Sandbox / Letters to Leah / David's selections.
- **2026-05-13 (v2.6)** — Infinite draggable canvas shipped at `/canvas`. All 267 paintings in a column-masonry tile, pixel-perfect seamless wrap, click-to-lightbox, pan + pinch-zoom. Added as the canonical "see her work" path; will be the first click off the new home page once Sprint 5 lands.
- **2026-04-23 (v2.5)** — Sprint 4 "Feel alive." Em-dash sweep. Lightbox rebuild of artwork detail (dark gallery wall + 6x pan/zoom + slide-in panel + keyboard). Handwritten typography layer (`font-leah` / Caveat) for Leah's tagline phrases. Painting of the Day at `/` with daily rotation and seasonal accent. Curated Pairings at `/pairings` with 8 editorial diptychs. Global keyboard shortcuts (`/`, `?`, `G`-prefix chords). Index Constellation toggle: bubble-pack view of 88 people + 68 places + 99 subjects with co-occurrence edges. Seasonal accent rotation. Send-as-postcard on every artwork.
- **2026-04-23 (v2.4)** — Sprint 3: People (`/people/:id`) + Subject (`/subjects/:id`) detail pages with prose mentions. Studio (`/studio`) signature page — kit, influences, philosophy, technique reel. A Life in Chapters (`/life`) scroll experience across 8 biographical eras. Site-wide meta: per-page `<title>`/description via `usePageMeta`, og/twitter cards, JSON-LD person. Preservation page (`/preservation`) + public JSON API at `/api/*.json` + page-scan fallback for 19 un-cropped artworks. Lazy-load audit: every img uses native lazy loading.
- **2026-04-22 (v2.3)** — Sprint 2: INDEX parsed into people (88) / places (68) / subjects (99). Added `/index` Navigator, `/places` + `/places/:id` with Leaflet world map, restructured `/locations` as region rollup. Prose mentions of artwork titles now auto-link. Per-chapter chromatic accents applied to themed galleries. Photo candidates classified by chroma (68 photos / 6 paintings); displayed per-section in Leah's Story. Site-wide search rebuilt with new entity types.
- **2026-04-22 (v2.2)** — Sprint 1 content push. Built `/her-words` (14-section reader with chapter companions), rebuilt Themes with chapter-intro essays, added Leah's voice + book-page + chapter rail to artwork detail, rewrote About with real biographical facts. PlaceholderArtwork extended to render real images. Home page (scroll-story) restored at `/` with real images. Timeline falls back to chapter-based synthetic years for undated works.
- **2026-04-22 (v2.1)** — Restored Leah's autobiography as a signature feature (`/her-words`), reframed from "read the book" to "her voice given the stage it deserves." Added three-part model for how her prose lives on the site (destination · context · threads). Updated architecture and Phase F.
- **2026-04-22 (v2)** — Rewrote plan after full book extraction. Corrected birth year (1920, not 1945), expanded from Bay-Area-only to 12 chapters × 11 travel regions, added five-signature-experiences structure, added data schema, added preservation principles. Archived previous plan as `PLAN_v1_pre_book.md`.
- **2026-02 (v1)** — Initial plan, written before the book PDF was available. Focused on Bay Area locations and an "infinite gallery" z-axis entrance. Much of the design language (glassmorphism, gallery white, EB Garamond) carries forward.
