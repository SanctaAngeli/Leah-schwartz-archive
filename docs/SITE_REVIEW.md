# Site Review & Path Forward — May 2026

*A critical look at the current state of the Leah Schwartz Archive, written after the canvas shipped, before the next sprint.*

> **How to read this.** This is opinionated. The point is to give you something to push back against, not a neutral audit. Where I'm wrong, override me.

---

## TL;DR

The site has the raw material: 267 catalogued paintings, 28,660 words of Leah's prose, the full INDEX, and the new infinite canvas. What it doesn't yet have is a **front door**. The Painting of the Day, with yesterday/tomorrow chrome and no visible top nav, sends a first-time visitor back out before they understand who they're looking at. `/places` crashes and traps people. Gallery has three awkward "era" buckets when the book itself already gave us twelve. Three pages (her-words, studio, about) are text-rich and image-poor when the book is the opposite.

The pieces are there. The path through them isn't.

---

## What a visitor should feel

The first visitor isn't returning. They got a link, or someone showed them. Their three questions, in order:

1. **Who is this person?**
2. **What did she make?**
3. **(If hooked) Tell me more.**

The home page has to answer (1) in five seconds and put (2) and (3) within one click. Right now it shows them one painting and asks them to come back tomorrow.

### The home page I'd build

```
┌──────────────────────────────────────────────────┐
│  [nav pill, always visible]                       │
│                                                   │
│         ┌─────────────────────────────────┐       │
│         │                                 │       │
│         │   Hero painting, full-bleed     │       │
│         │   (signature work, soft fade)   │       │
│         │                                 │       │
│         │       LEAH  SCHWARTZ            │       │
│         │       1920 – 2004               │       │
│         │                                 │       │
│         │   "one pull-quote in her voice" │       │
│         │             (Caveat)            │       │
│         │                                 │       │
│         │   [See her work]                │       │
│         │   [Read her story]              │       │
│         │   [Browse themes]               │       │
│         │                                 │       │
│         └─────────────────────────────────┘       │
└──────────────────────────────────────────────────┘
```

Quiet, single screen, no scroll required to "get it." The Painting of the Day is a wonderful **returning-visitor** ritual — move it to `/daily` as a destination, and surface it as a small card lower on the home for the third or fourth visit. The front door shouldn't ask new visitors to "wait until tomorrow."

---

## What's working — keep

- **Canvas (`/canvas`)** — the strongest entry point on the site. Drag, drift, click. Let it carry the "see her work" path.
- **Pairings (`/pairings`)** — quiet, editorial, beautifully restrained. Don't touch.
- **Themes (`/themes`)** — per-chapter hero image, accent color, the way artworks reveal themselves. This is the gallery the site needs.
- **Artwork lightbox** — dark gallery wall, 6× zoom, slide-in info panel, keyboard nav. Already excellent.

---

## What's broken (urgent)

### 1. `/places` crashes the page and traps the user
`react-leaflet@5.0.0` is incompatible with React 18's context-consumer pattern. The console screams `TypeError: render2 is not a function`, the ErrorBoundary catches it, and the user sees "Something went wrong" with a "Try again" button that does nothing useful. **Two fixes:**

- Downgrade to `react-leaflet@4.x` (the React 18 compatible line), or replace the world map with a simpler image-tiled placeholder until that's done.
- Make `ErrorBoundary` always show a "Back to home" link, so any crashed page is escapable.

### 2. The top nav is hidden on home
`App.tsx` line ~42:
```ts
const showNavigation = hasCompletedIntro || !isLandingPage;
```
The intro gate makes sense if there's an intro, but DailyPage doesn't fire one — so nav is hidden until the visitor navigates away (and they often can't, see #1). Fix: always show nav on the new home; drop the gate entirely, or move it behind a flag the page can set.

### 3. The home is the wrong page for new visitors
DailyPage is currently `/`. Move it to `/daily` and build the new front door above.

---

## Where content is thin

The site has the data but doesn't surface it in three places where it should:

### Leah's Story (`/her-words`) — text-only when the book isn't
14 sections of her autobiography in beautiful typography. But: we already extracted **74 photo candidates** (68 confirmed photographs, 6 paintings) from the same pages. They should appear **inline** at the moments she describes them — Herman appears when she writes about Herman, the Mill Valley house appears when she describes Mill Valley, a childhood photo appears in IMMIGRANTS.

Her UPPERCASE painting-title mentions are already linkified — they could also be **small inline thumbnails** beside the text. The page should feel like the book opened up, not a transcript with hyperlinks.

This is the highest-leverage content investment on the site.

### Studio (`/studio`) — no studio, no work shown
A signature page about her practice should feel like walking into the studio. Right now it's all words. It needs:
- A photo of her actually in the studio (we have candidates)
- Examples of work beside each philosophy paragraph — when she writes about her brush technique, show a watercolor where it shows
- Maybe a "tools" rail with the actual brushes/palette/medium she used (book mentions these by name)

### About — solid but thin
Real biographical facts are there. But the book has so much more: the family tree, the immigration story, Herman's parallel life, the sons' careers, the places they lived in order. About could expand into a richer narrative with image breaks. Or peel off shorter pages alongside it.

---

## Information architecture: merge, split, kill

### Merge: Gallery → Themes
Right now there are two competing grids of all the artworks:
- `/gallery` — three era piles ("Old Stuff & Early Voice", "Road & Landscape", "Home, People & Travel")
- `/themes` — twelve book chapters, each with its own room

The twelve chapters are **the book's own structure**. The three eras are an editorial invention with awkward names ("stuff," "home, people & travel"). You already prefer the twelve-chapter view, and so does the source material.

→ **Make `/gallery` redirect to `/themes`. Or rename `/themes` to `/gallery` and delete the era page.** The 12 themes ARE the gallery. Drop "stuff" from the vocabulary entirely.

### Split: About does too much
About is doing biography, family backstory, estate notice, contact, and book credits all at once. Consider:

- **`/about`** — the bio narrative, expanded
- **`/family`** — Herman, the sons, the parents (already structured in `people.json`)
- **`/estate`** — © notice, contact, book credits, preservation links

`/life` already exists as a scroll-driven life-chapter experience — it should be linked prominently from About so visitors know it's there.

### Kill: the "stuff" naming
"Old Stuff & Early Voice" reads as Leah's own self-deprecating title for that chapter (her chapter is literally `OLD STUFF (salvage of thirty years)`). But for the front-of-house, use the proper chapter title and tagline — *Old Stuff: salvage of thirty years* — rather than mashing it with "Early Voice." The book gave us better names than our editorialization did.

---

## The visitor journey I'd shape

```
Land on /
  ↓ hero + name + quote + 3 paths · nav always visible
  ↓
┌─────────────────┬─────────────────┬─────────────────┐
│  See her work   │ Read her story  │  Browse themes  │
│   → /canvas     │   → /her-words  │   → /themes     │
│   (wander)      │   (listen)      │   (structured)  │
└─────────────────┴─────────────────┴─────────────────┘
        ↓                ↓                ↓
   modal opens      photos +         /themes/:id
   for any piece    paintings        chapter room
        ↓           inline                ↓
   her voice +      ↓                modal opens
   provenance       cross-links      for any piece
                    to themes
```

The three paths are intentionally **different in character**:
- **Wandering** (canvas): for the cosmos.so visitor, the casual link-clicker, the "show me everything" instinct
- **Listening** (her-words): for family, friends, people who want her voice
- **Structured** (themes): for the researcher, the collector, the methodical browser

They cover three real audiences without forcing one through another's path.

---

## Priority order

### This sprint — urgent / shippable in one pass

1. **New home page** — hero + name + quote + 3 pill paths · nav always visible. Move DailyPage to `/daily`.
2. **Drop yesterday/tomorrow** from `/` (it lives on `/daily` only, if at all).
3. **Fix `/places`** — downgrade `react-leaflet` and patch the map render.
4. **Make ErrorBoundary escapable** — every error screen should have a "Back to home" link.
5. **Merge `/gallery` into `/themes`** — kill the era buckets, use the book's chapter names.

### Next sprint — content richness

6. **Photographs inline in `/her-words`** — wire `photos.json` into the section reader at the appropriate moments.
7. **Painting thumbnails inline in `/her-words`** — alongside the title-mention links, show the actual piece small in the margin.
8. **Studio enrichment** — at least one studio photo, one work example per paragraph.
9. **About split** — about / family / estate as three pages, with `/life` surfaced.

### Future — depth

10. **Voice Card** — the rotating quote component mentioned in PLAN.md but never built. Surfaces her voice on every page.
11. **Z-axis cinematic entrance** — the original v1 vision, deferred but still in the architecture. Now that we have the canvas, this could be the "intro" the home plays once.
12. **IIIF-style high-res viewer** — extend the lightbox's 6× zoom into a tiled deep-zoom for scholars.

---

## On the canvas

The infinite draggable canvas is doing exactly what it should. Let it be the primary "see her work" path from the new home. It doesn't need to be discoverable mainly through the nav — it should be **the first click off the front door**. Keep the nav link, but treat the home's pill button as the canonical entry.

---

*Push back where you disagree. The point of this document is to make the conversation explicit, not to close it.*
