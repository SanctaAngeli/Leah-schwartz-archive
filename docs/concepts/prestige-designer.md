# Leah Schwartz Online — Design Specification

*Prestige-designer review. Source: complete 309-page scan of "Leah Schwartz: the life of a woman who managed to keep painting" (Strawberry Press, 1990), read first-hand. This is a specification, not a concept pitch. Where a decision could go two ways, I have made the call and given the reason.*

---

## 1. What I saw in the book

I read the jacket, the front matter, the autobiography, four chapter openings, the plates, the travel diary, the LIST OF PAINTINGS, and the INDEX. The findings that drive every decision below:

**The book is already designed, and designed well.** Noreen Poli's 1990 layout (digitally set in ITC Galliard, per the copyright page) is a quiet, confident system: one painting per page floating in generous warm white; chapter openers that are a Galliard caps headline plus a lowercase italic subtitle ("STILL LIFE / *in love with simple objects*") above a single ~65-character column pushed to the right half of the spread, leaving the left half empty; captions in a small condensed sans, set in caps, hung at the image edge. The web site's job is not to invent a design language. It is to translate this one — and fix the few things print could not do (search, cross-reference, scale, zoom).

**Her voice is the second collection.** The captions are not registrar captions; they are anecdotes: "THE MEADOWS, approx. 16x20 (collection of D. & M. Forbes). This was The Last Roadhouse in our area, maybe the last anywhere. It has vanished." "UCHISAR, CAPPODOCIA, 5x8. Awoke at 5 a.m. to the sound of the muezzin calling from the village across the canyon…" The chapter subtitles are wry one-liners ("MICHIGAN — *how I stopped learning French and started shovelling manure*"). Any template that reduces these to metadata fields kills the book's personality. The caption is content, and it must be typeset as prose, not as a data table.

**The watercolors live or die by their paper whites.** *White Floating Roses*, *Mt. Tam from Sonoma*, *Machu Puchare* — these paintings use the white of the sheet as a color. The book prints them on a warm cream stock; the unpainted paper inside the image reads *whiter and cooler* than the page around it, which makes the paintings glow. On screen this means: the page background must never be the same value as the paper inside the scans, or the images dissolve at their edges. A background slightly darker and warmer than the artwork's paper white is the single most important color decision on the site.

**The work is intimate in scale.** The LIST OF PAINTINGS is full of 5×7s, 5×8s, 4×7s — paintings the size of a postcard, alongside 48×72 collages. A grid that renders everything the same size lies about the work. Real-size display (we have physical dimensions for all 267) is a meaningful, honest feature, not a gimmick.

**Her hand is everywhere.** The huge pale-gray signature across the title page, the handwritten "Alcatraz, Bay Bridge, San Francisco from Sausalito, 1948" annotations on the drawings, the signature inside nearly every painting, the Strawberry Press tree she drew herself. The site should use her actual signature (from the title page scan) as the identity mark — never a typeset logo.

**What would kill it:** dark mode as default (watercolor on black looks like slides on a lightbox — wrong medium); parallax and scroll-jacking; cropping paintings to fill hero containers; AI upscaling or "enhancement"; a museum-y neutral tone of voice anywhere near her words; treating the 1990 book as raw material to be dismembered rather than an artifact to be honored.

---

## 2. THE STRUCTURE

### Sitemap

```
/                      Home
/paintings             The collection (all 267, filter/sort)
/paintings/:slug       Artwork page (THE template)
/book                  Her book, readable (autobiography + chapters, her 28,660 words)
/book/:section         A section/chapter of the prose
/life                  Chronology + the 74 photographs
/index                 Her index, digitized (people / places / subjects) + map
/about                 The estate page: about Leah, about the book, contact, colophon
```

Five primary navigation items: **Paintings · Book · Life · Index · About.** Wordmark = her signature, top left, links home.

Five is the ceiling. David Zwirner runs on six; the best catalogue raisonné sites (Calder Foundation, the Munch Museum's eMunch, the Mondrian catalogue) run on four to six. Anything more and the first ten seconds are spent parsing chrome instead of looking at painting. No mega-menu, no dropdowns on first level. Search is an icon (and `/` shortcut) opening a full-screen overlay that searches paintings, prose, and index entries in one box — the pattern from MoMA and the Met, and the single highest-value utility on an archive site.

### The homepage

**One painting, nearly full-bleed on warm white, her signature, the subtitle, one line of her prose, and the door into the collection.** Specifically:

1. **Hero:** a single painting shown complete (not cropped), centered, occupying ~70% of viewport height on a field of the site background. Rotates per visit from a curated set of 8–10 of the strongest images (the jacket irises, *White Floating Roses*, *Mt. Tam from Sonoma*, *Petaluma River with Farm*, *The Meadows*, *Takayama Bridge*, *Machu Puchare*…). Caption in the book's convention, small, beneath. This is the Gagosian/Zwirner exhibition-page pattern: the work first, at gallery scale, no headline competing with it.
2. **Identity:** her signature (the title-page scan, cleaned, as SVG-traced or high-res transparent PNG) with the book's own subtitle beneath it in italic: *the life of a woman who managed to keep painting*. That line is the best tagline anyone will ever write for her; we did not have to write it.
3. **One paragraph in her voice** — from the jacket flap she wrote herself ("I LOVE THE PROCESS of what I do…"), linked to /book. No estate-written welcome copy above the fold. Her words or none.
4. **Three doors** below the fold: Paintings (a row of 6–8 thumbnails at honest relative scale), Book (the AUTOBIOGRAPHY opening line + "Read her book"), Life (one photograph). Then footer.

What the homepage is *not*: a carousel, a video, a scroll-driven "experience," a wall of equal-weight tiles. The first ten seconds must communicate: *a painter, watercolors, a life, a book — and it's all here.*

### The artwork page — the most important template

This page will be loaded ten times more than any other. Pattern sources: David Zwirner artwork pages (image scale + restraint), the Calder Foundation catalogue entries (metadata rigor), the Van Gogh Museum's "Collection" pages (zoom + context links). The layout, top to bottom:

**Desktop (≥1024px):**

- **Image stage:** full container width, max-height 78vh, painting centered on the page background. The painting is shown *complete* — `object-fit: contain`, never cropped, never behind text. No frame, no border, no drop shadow heavier than the whisper specified in §3. Click/tap opens deep zoom (OpenSeadragon over IIIF tiles from the 300 DPI scans) — the 5×7s especially reward this; her detail is the point ("I have always loved detail… I like to elaborate and intensify detail to achieve a heightened reality").
- **Caption block,** directly beneath the image, left-aligned to the image's left edge, max measure 34em:
  - Line 1 — *Title*, italic Galliard, 1.5rem. Year if known, roman, after a comma.
  - Line 2 — medium · real dimensions ("Watercolor, 9 × 19 in") · collection credit when the book gives one ("Collection of D. & M. Forbes") — small caps/sans meta style.
  - Line 3+ — **her caption anecdote, verbatim, typeset as prose** in Galliard italic at body size, attributed implicitly (it's all her). This is the soul of the page. If the book has no anecdote for this painting, the block simply ends at line 2 — never pad with curatorial filler.
- **"At actual size" control:** a quiet text button that resizes the image to true physical dimensions using a one-time screen calibration (credit-card calibration widget, stored in localStorage; default to a conservative 96dpi estimate without it). Beside it, a small scale diagram: the painting's outline against a 6-foot human silhouette. Honest scale is this archive's most distinctive feature and costs almost nothing.
- **Provenance strip:** "From the chapter *ON THE ROAD* · page 67 of the book" — the chapter name links to the book section, the page number opens the actual book-page scan in an overlay, so every painting can be seen *in situ* in the 1990 artifact. This is the move that makes the site an archive rather than a gallery: one click from reproduction to source.
- **Related works:** a single row, max 6, ordered: same chapter neighbors first (book order), then same place (via index geodata), then same year. Thumbnails at honest relative scale within the row. No algorithmic "you may also like" language — label it "Also in ON THE ROAD" / "Also painted in Bolinas."
- **Prev / Next:** fixed-position chevrons (keyboard ← →, swipe on touch) stepping through *book order* by default — her sequence is an authored sequence; respect it. When the visitor arrived from a filtered grid, prev/next walks that filter instead and a small breadcrumb says so ("12 of 31 — Flowers").

**Mobile:** image first at full width (no 78vh cap; natural aspect), caption block, actual-size note collapses to the scale diagram only, related works as a horizontal snap-scroll row. The whole page must be useful with thumbs and one hand.

**URL & metadata:** `/paintings/the-meadows-1976` style slugs; title/year/medium in the `<h1>`/meta; OG image is the painting on the site background at 1200×630 with the caption-block typography baked in (see §4).

### The collection page (/paintings)

A grid, but a *gallery* grid: masonry-free, row-based layout (justified rows à la Flickr/Google Arts & Culture) that preserves each painting's aspect ratio, generous white between (min 32px gutters desktop), captions appearing on hover/focus as title + year only — and on touch, a permanent small caption beneath. Default order: book order. Controls, in one slim bar that never sticks more than 56px tall:

- **Chapter** (her nine sections, her names — OLD STUFF, ABSTRACT, SOCIAL COMMENT, PORTRAITS, ON THE ROAD, STREET SCENES, LANDSCAPE, STILL LIFE, FLOWERS, INTERIORS, TRAVEL — exactly as the LIST OF PAINTINGS groups them)
- **Place** (from the geocoded index)
- **Decade**
- **Sort:** book order / year / size (size sort is genuinely interesting here)
- A **"scale" toggle** that redraws the grid with thumbnails sized proportionally to real dimensions — the 48×72 collages tower over the 4×7 travel sketches. One toggle, big payoff, nobody else has it because nobody else has the dimensions data.

Filters are URL-addressable (`/paintings?chapter=travel&place=france`) so every view is shareable and crawlable.

### The reading experience (/book)

Her 28,660 words are a real autobiography with a real shape, and the dated travel-diary entries (PARIS, MAY 28…) are some of the best writing in it. Decisions:

- **Present it as a book, structured by her own sections,** in reading order, one section per page, with her chapter-opener convention reproduced exactly: caps Galliard headline, italic lowercase subtitle, then prose. The subtitles are non-negotiable — they carry her humor.
- **Single column, measure 62–68 characters, 1.25rem Galliard, 1.6 line-height,** ragged right. Indented paragraphs (like the book), not spaced paragraphs — this is a book, not a blog.
- **Inline images where the book placed them:** the family photographs and drawings appear in the flow at the points the 1990 layout put them, with the book's small-caps captions. Paintings referenced in the prose are linked inline to their artwork pages (text links, no thumbnail interruptions — the New Yorker treatment, not the Medium treatment).
- **Margin apparatus, desktop only:** page-number markers in the left margin keyed to the physical book ("p. 12"), clickable to open the actual spread scan. Scholars and family will use this constantly; everyone else won't notice it.
- **Progress and navigation:** a quiet top hairline progress bar within a section; prev/next section links at the foot styled like the book's running folios. A persistent contents drawer listing her sections with their subtitles.
- **Travel diary entries** get their dated run-in heads styled as the book styles them (caps, bold) and each dated entry gets an anchor — `/book/travel#paris-may-28` — so the index and map can deep-link into the prose.
- Estimated reading time: never. This is not content to be optimized through.

### The index, the map, the photographs

**Her index is a found masterpiece** — 88 people, 68 places, 99 subjects, with painting titles in italic and people in roman, "Garbo, Greta 7" two lines from "Genetic Baggage 3." Do not flatten it into a search facet. **/index reproduces it as a browsable typographic object** in its original alphabetical form (Galliard, italic titles, the book's own discriminations), except every entry is live: paintings link to artwork pages, prose references link to the book at the page anchor, places additionally carry a small ⌖ that pans the map.

**The map is a view of the index, not a destination.** A single muted-terrain map (no saturated default tiles; a custom quiet style — light land, hairline borders) at /index with a Places tab: 68 geocoded points, clustering Marin County, each opening a popover with thumbnails of paintings made there + a link to relevant diary entries. Patterns from the Getty's and the "Paris of Atget" style archives. No animated journey lines, no globe.

**The photographs (74) live in /life as a chronology**, not a dumped grid: a vertical timeline by decade — Rock Island 1920, Chicago, Michigan, New York, Sausalito 1948, Mill Valley — each decade pairing the photographs with 2–3 paintings from those years and a one-line excerpt from the autobiography (her words) as the only connective tissue. B&W photographs are presented with their original book captions in the small-caps convention. This page is where first-time visitors fall in love with her; it should be linkable as the "story" entry point for press.

### /about

About Leah (estate-written, brief, clearly distinguished typographically from her voice — set in the sans, never the italic), about the 1990 book and Strawberry Press, the colophon (this site's own credits, set like the book's copyright page — a designer's tip of the hat to Noreen Poli, who deserves the credit line), rights & reproduction contact, and the Strawberry Press tree drawing as the page's only ornament.

---

## 3. THE SURFACE

### Typography

The book is set in **ITC Galliard** (stated on its own copyright page). The web answer:

- **Primary face: ITC Galliard.** Decision: **license ITC Galliard Std (Roman, Italic, Bold) as a budget line item, not a nice-to-have** — Galliard's sharp, slightly flamboyant italic is half the book's personality, and no free Garamond substitute has its bite. If licensing genuinely fails, the least-bad fallback is a sharp Garalde (e.g. EB Garamond tuned heavier), accepted as a visible compromise — never a soft transitional.
- **Meta/caption face:** the book's captions are a condensed grotesque in caps. Use **a single sans for all apparatus** — captions, nav, filters, metadata: **Founders Grotesk, Söhne, or Inter at a tracked, slightly condensed setting.** Decision: Söhne (or Inter if budget) — set caption-style text at 0.8125rem (13px), letter-spacing 0.04em, caps for the title portion only, exactly mirroring "PETALUMA RIVER WITH FARM, 11x15."
- **Scale (1.25 ratio, rem-based):** 13px meta · 16px UI · 20px body prose (book pages) · 24px artwork title · 31px section subtitle zone · 39px chapter heads · 49px reserved for the /book chapter openers only. Nothing larger; her signature does the display work.
- **Measure:** prose 62–68ch; captions 34em max; never full-width text anywhere.
- **Numerals:** oldstyle in prose, lining in metadata and dimensions.
- **Her hand:** signature and handwritten annotations only ever as images from the scans. Never a script font anywhere on the site — one cursive forgery would poison everything authentic around it.

### Color

- **Page background: `#F7F4EE`** — a warm paper white, measurably warmer and ~3% darker than the average unpainted paper inside the corrected scans (target the scans' paper white at ~`#FBF9F4` after color correction). This is the precise mechanic that makes the paper whites *inside* the paintings read as light rather than as holes. Pure `#FFFFFF` backgrounds make watercolors look washed out and clinical; gray backgrounds (`#EEE`) make them look like auction lots. Warm, just off the paint paper, slightly darker: the painting glows.
- **Text: `#1A1814`** (warm near-black, the book's ink) on background — 13.8:1, comfortably AAA. Secondary text `#5C564C`.
- **Accent:** none, almost. Links in prose are underlined text-color with a 1px warm underline (`#9A8F7A`), darkening on hover. The only chromatic accent permitted on the whole site is drawn from her jacket irises — a deep iris-violet `#4A4668` — used exclusively for focus rings and the rare primary action. The paintings supply all other color.
- **No dark mode at launch.** Watercolor is a reflected-light medium on white paper; honoring `prefers-color-scheme: dark` with a dimmed-paper theme (`#2A2620` ground, images untouched) is acceptable later, but the default and canonical presentation is light. (Drawings/photograph sections stay on the same paper; do not theatrically darken the photography.)

### Spacing

8px base grid. Section rhythm in multiples of 64px desktop / 40px mobile. The book's signature move is *asymmetric emptiness* (chapter text occupying the right half of a spread, left half empty) — echo it: on desktop, /book chapter openers set the headline block starting at the 6th column of a 12-column grid, with columns 1–5 empty. Resist the urge to fill the left side. Minimum 96px of breathing room above and below any painting on its own page.

### Image presentation rules

- **Crop policy:** crops/ images (paintings extracted from pages) are the canonical display assets — straightened, color-corrected against the scans' paper white, *cropped to the painted image edge but never inside it*. Where her painted edge is irregular (watercolor bleeds, deckle-ish edges, the drawings), keep a 1–2% margin of the sheet rather than slicing into wash. The full book-page scans are a second asset class shown only in "view in book" overlays and /book — with their cream page, folio numbers and captions intact, presented as the artifact they are (subtle 1px `#E5E0D5` border to define the page edge, nothing else).
- **Shadows: none on paintings.** Watercolors are sheets, not canvases; a drop shadow implies an object the scan does not show. The exception: book-page scans in overlays sit on a scrim with a soft ambient shadow (`0 8px 40px rgba(26,24,20,0.18)`) because there we *are* depicting an object.
- **Backgrounds:** paintings always sit directly on the site paper — never in white boxes, never on gray mats, never behind glassy cards.
- **Never:** filters, duotones, AI upscaling, generative fill, blurred-painting backdrops behind heroes, paintings as decorative tiling. Her work appears whole or not at all.

### Motion policy

The prestige standard in practice (Zwirner, Gagosian, the better foundations) is *much less than people think*: opacity/transform fades of 150–300ms and almost nothing else.

- Page transitions: 200ms opacity crossfade. No slides, no wipes.
- Images: fade in over 250ms as they decode (from a dominant-palette placeholder — we have palette data; a flat wash of the painting's dominant tone is a beautiful, content-true placeholder).
- Hover on grid thumbnails: caption fades in; the image itself does not scale. (Scaling crops or shifts the composition — wrong for paintings. Let the cursor and caption do the work.)
- Zoom viewer: inertial pan/zoom per OpenSeadragon defaults, capped springiness.
- Easing `cubic-bezier(0.4, 0, 0.2, 1)` everywhere; nothing longer than 400ms; no scroll-linked animation, no parallax, no elements that move without user cause.
- `prefers-reduced-motion`: all transitions drop to instant; the site must be fully equivalent.

---

## 4. THE CRAFT FLOOR

Non-negotiables. These are what separate the top sites from the merely tasteful.

**Performance budget (per page, 4G mid-range Android):** LCP < 1.8s, CLS < 0.02, INP < 200ms, ≤ 90KB JS gzipped on content pages (zoom viewer lazy-loaded only on demand), fonts ≤ 120KB woff2 total (subset Galliard aggressively; `font-display: swap` with size-adjusted fallback metrics so the swap doesn't reflow).

**Image pipeline for 300 DPI material:**
- Master TIFFs → IIIF Level-2 tile server (or pregenerated DZI pyramids on static hosting — cheaper, same UX) for deep zoom.
- Display derivatives: AVIF + WebP + JPEG fallback via `<picture>`, widths 320/640/960/1440/2048, `srcset`+`sizes` everywhere, quality tuned per-image (watercolor washes band visibly at low quality; floor AVIF at cq ~28).
- Every `<img>` ships `width`/`height` (zero CLS), `loading="lazy"` below the fold, `fetchpriority="high"` on the artwork-page hero and the homepage painting only.
- Placeholder = solid dominant-palette wash (we have the data), not LQIP blur — blurred watercolors look like ruined watercolors.
- Color management: derivatives in sRGB with embedded profile; the correction pass calibrates all 267 to a shared paper-white target so the collection grid doesn't flicker between warm and cool scans.

**Mobile-first realities:** 60%+ of an estate site's traffic is phones via shared links. The artwork page is designed at 375px first; the grid at two columns; filter bar becomes a bottom sheet; deep zoom must work with standard pinch (no custom gesture hijacking); tap targets ≥ 44px; the book reads beautifully one-handed (this is where the 20px Galliard earns its size).

**Accessibility:** WCAG 2.2 AA minimum, AAA for prose contrast (already achieved by the palette). Every painting's `alt` is a human-written one-sentence description (267 paintings ≈ a week of careful work; budget it — this is also the SEO corpus). Full keyboard operation of grid, viewer (+/−/arrows/Esc), and prev/next. Focus visible always (the iris-violet ring). Her prose marked up as real `<article>`/`<h2>` structure; the index as a real `<dl>`. Zoom viewer announces zoom level to screen readers.

**SEO & social:** one painting = one canonical URL with `VisualArtwork` JSON-LD (name, dateCreated, artMedium, width/height, creator → Person Leah Schwartz with sameAs links); the book sections as `Article` with her as author; sitemap of all 267 + sections; OG/Twitter cards rendered per-painting at 1200×630 — painting centered on the paper background with title/year/dimensions in the house caption style, so every share looks like the site. Pages render server-side/static; this archive is exactly the kind of long-tail material search was made for ("Leah Schwartz Petaluma River" must hit page one).

**Five details nobody notices and everybody feels:**
1. The paper-white calibration between background and scans (§3) — the glow.
2. Fallback font metrics matched to Galliard so nothing shifts when fonts arrive.
3. Prev/next preloads the adjacent painting's display derivative on idle — paging through the collection feels like turning pages, zero spinner.
4. Scroll position and filter state survive back-navigation perfectly (the #1 quiet failure of gallery grids).
5. Print stylesheet on artwork and book pages — one painting, its caption, clean margins. People print these for their walls and their mothers; let it be beautiful.

---

## 5. WHAT I WOULD NOT DO

- **No dark theme as the house style.** It flatters oil and photography, and murders watercolor. The estate will be shown a moody dark comp by someone; veto it.
- **No scroll-driven cinema** — no parallax, no pinned sections, no paintings that assemble themselves, no "immersive journey." Eighteen-month fashion; also disrespectful — motion applied *to* an artwork is a treatment of it.
- **No cropped heroes.** The instant a painting becomes a background for typography, we've made her work into stock photography. Full image or nothing, every time.
- **No invented voice.** No "Discover the luminous world of…" copywriting. She wrote 28,660 words and her own jacket flap; the estate writes only the /about page, and it is visibly *apparatus*, set in the sans.
- **No script font, anywhere, ever.** Her real signature is on the title page; a typeset cursive next to it is a forgery in plain sight.
- **No carousel homepage, no autoplay anything.**
- **No "AI-enhanced" or upscaled images, no generative expansion** of croppings to fit containers. Constraint is in the brief; it would also simply look wrong against the honest scans.
- **No virtual 3D gallery.** The book *is* the exhibition design; a fake room with fake parquet adds nothing but uncanny distance.
- **No skeleton-screen shimmer.** Palette-wash placeholders are quieter and truer.
- **No "estimated 6 min read," no like buttons, no infinite scroll on the collection** (paginate at ~60 with proper URLs; infinite scroll breaks footer, back-button, and the sense of a bounded, knowable archive — 267 is a number a visitor should be able to feel the edges of).
- **No splitting her captions into database fields for display.** Store structured, display as prose.

---

## 6. The pitch to the estate

Leah designed her own monument in 1990 — a book with her paintings breathing one to a page, her voice in the captions, her signature across the title page, even her own index, where Greta Garbo sits two lines from "Genetic Baggage." Our job is not to reimagine it; it is to give that book what print could never give it: every painting at full resolution and at honest, actual size; her autobiography readable on any phone on earth; her index alive, so that one tap moves from a 5×8 of Cappadocia to the diary entry where the muezzin and the cuckoo answer each other across the canyon. We will set it in her book's own typeface, on a paper-warm ground tuned so her whites glow, with no motion, no commentary, and no decoration that competes with a single wash of color. Everything on the site will be hers — the paintings, the words, the handwriting, the humor — and the craft will be ours: fast, accessible, findable, and built to last longer than any design fashion. The result should feel inevitable: as if the 1990 book simply kept going.

---

*Spec written after first-hand review of scans at /Users/harrylee/Developer/leah-extraction/ (images/, crops/, photos/). Assumes catalog, palette, prose, index, and geodata as briefed.*
