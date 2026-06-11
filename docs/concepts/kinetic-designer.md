# Kinetic Concepts for the Leah Schwartz Archive
*A motion designer's reading of "Leah Schwartz: the life of a woman who managed to keep painting" (Strawberry Press, 1990)*

---

## 1. What I saw in the book

I read the book the way I read any material I'm about to put under a finger: looking for its physics.

**The white is structural, not empty.** Page after page — the dedication (p. 8 of the scan, a single italic line floating in a sea of paper), the Strawberry Press colophon (p. 5), chapter openers like ON THE ROAD (scan 076), STILL LIFE (scan 162), FLOWERS (scan 204), TRAVEL (scan 236) — sets a small, dense block of type adrift in an enormous white field. The paintings get the same treatment: *Mt. Tam from Sonoma* (scan 100) is a 5×8-inch watercolor printed wide across the top of an otherwise blank page, caption whispered at the corner. This book has the slowest layout rhythm I've ever seen in a self-published artist's book. Nothing crowds. Nothing competes. The negative space is the suspension system — it's what lets a tiny sketch carry a full page. Any motion system for this archive must treat white space as the medium things move *through*, not a gap to be filled.

**The medium has a signature velocity curve, and it's the inverse of modern UI.** Look at the sky in *The Meadows* (scan 080) or *Bonnie and Bill's Rainbow Inn* (scan 090): wet-on-wet washes that bloomed fast and then **settled** — pigment granulating into the paper's tooth, drying to a hard, crisp edge. Watercolor's motion profile is: violent, fluid beginning → slow asymptotic decay → absolute stillness with a sharp boundary. That is the *opposite* of the spring-overshoot-wobble grammar that every portfolio site uses. Springs bounce past their target and oscillate. Watercolor never bounces. It arrives wet, spreads, slows, and *dries*. Her own subjects confirm it: pears that "never get restless" (STILL LIFE, scan 162), facades of roadside buildings seen from a stopped van (ON THE ROAD, scan 076 — she painted from a Ford Econoline), interiors of utter quiet (*Kitchen, Gello*, scan 244).

**The dimensions are a buried emotional dataset.** The LIST OF PAINTINGS (scan 302) is full of shocks: *Takayama Bridge, 4×7*. *St. Emilion, 5×7* — "I did this pen drawing while sipping a pastis at a sidewalk cafe" (scan 240). *Honfleur, 7×9*. Then suddenly *State of the Union–60's, collage, 48×72*. The book reproduces a 4-inch sketch and a 6-foot collage at the same page size, flattening their mass. The web doesn't have to. Physical size is data we hold for all 267 paintings, and mass is the single most legible property motion can communicate.

**Her life's tempo is interstitial.** The title says it: *managed to keep painting*. The Introduction (scan 014): "I have managed to fit my work into the spaces between husband, children and housekeeping." The travel kit fits "into a quilted tea-cozy" (scan 236). The paintings happened in stolen pauses — while a pastis was sipped, while the van was stopped, between loads of canning. The prose, meanwhile, *runs*: the Greece diary entry (scan 250) is a torrent — "BLASTING, BLARING, BOOMING!" ferry loudspeakers, Jolly Cola through thin straws — and then she stops and paints a white-domed chapel. Motion and stillness alternate in her life exactly the way wet and dry alternate on her paper.

### The motion language: **WET, THEN STILL**

Every gesture in this archive lands wet and dries still. Inputs are fluid, immediate, low-friction — washes, bleeds, coasting momentum. Settling is non-negotiable and never bouncy: a long-tail ease-out (think `cubic-bezier(0.16, 1, 0.3, 1)` stretched to 900–1400ms at the end of large moves), finishing with a *hard edge* — the moment a transition completes, all motion fully stops and the page is as still as a pear on a table. No idle loops, no perpetual floating, no breathing UI. The stillness IS the brand. Movement exists only between states, the way water exists on her paper only between the brushstroke and the drying.

---

## 2. The Concepts

---

### Concept A — TRUE WEIGHT
*Every painting carries the physical mass of its real dimensions. The interface has honest inertia.*

**Core idea.** All 267 paintings have real physical dimensions in the catalog, from 4×7 inches to 48×72. In this archive, square inches = mass in the physics simulation. A travel sketch flicks like a postcard; the big collages move like furniture.

**Interaction loop.**
- *Input:* drag/flick any painting card in browsing views; pinch or scroll-zoom inside a painting view.
- *Response:* the element's animation is driven by a critically-damped spring whose mass parameter is derived from the painting's area (normalized log scale, e.g. `mass = 0.6 + log10(area_in²) × 0.55`). Stiffness constant across the site; only mass varies. Damping always ≥ critical — **nothing ever overshoots** (wet-then-still).
- *Feel:* a 5×8 Mt. Tam responds within ~80ms and settles in ~350ms — light, papery, intimate. A 48×72 collage takes a beat to start moving (input is slightly "absorbed" for ~120ms), coasts with conviction, and needs ~1100ms to settle. The finger learns the collection's scale without reading a single caption. Zooming is honest too: each painting first presents at *actual physical size* relative to the viewport (px-per-inch estimated from device class, with a one-time "credit card calibration" easter egg for the obsessive), so *Takayama Bridge* sits small and jewel-like in a huge white field — exactly as the book floats it — and you lean *in*.
- *Reduced motion:* mass differences collapse to instant transitions with a 150ms crossfade; actual-size presentation is preserved (it's layout, not motion).

**Why the book demands it.** The LIST OF PAINTINGS (scan 302) reads like a spec sheet for this: 4×7, 5×8, 11×15, 16×20, 48×72. The book apologizes for flattening scale by whispering dimensions in captions; the web can *perform* scale. And her smallest works are her most alive — the St. Emilion spire sketched over a pastis (scan 240) should feel like the dashed-off thing it was.

**Hero moment.** The pivot from a travel sketch to *State of the Union–60's*: you've been flicking featherweight notebook pages, then the collage enters and your gesture suddenly meets resistance — the whole room changes weight. People will swipe back and forth just to feel the difference.

**Data used.** Dimensions (all 267), chapter, 300 DPI scans, thumbnails.

**Risk.** Honest: per-device px-per-inch is approximate (CSS inches lie). Mitigate with device-class heuristics and an optional calibration; the *relative* mass system is bulletproof regardless. Spring-with-mass is cheap (Framer Motion supports mass natively); the only perf trap is animating 50+ heavy cards at once — virtualize and only simulate the touched element plus neighbors.

---

### Concept B — THE SETTLING WASH
*The sitewide transition system: navigation as a loaded brush, arrival as drying paper.*

**Core idea.** Every route change and chapter transition is a wash: a fluid edge sweeps the viewport, tinted with the *destination painting's* dominant palette, blooms for a moment, then dries to a hard edge and total stillness. One transition grammar for the entire archive — recognizable in half a second, like a watermark.

**Interaction loop.**
- *Input:* tap a painting, a chapter title, an index entry; or cross a chapter boundary while scrolling.
- *Response:* a full-bleed mask sweeps directionally from the point of input (tap position seeds the wash origin — paint goes where the brush touches). The mask edge is irregular and feathered (an SVG turbulence/displacement edge or a small set of pre-rendered alpha masks shaped like real wet-edge boundaries — *generic* wash shapes, never derived from her paintings' content). Phase 1, "wet": fast, 250–400ms, slight chromatic softness, tinted with 2–3 dominant colors from the destination painting's palette at low opacity over gallery white. Phase 2, "drying": the incoming page is already legible while the wash retreats/evaporates over 700–900ms with a long-tail ease; the final 100ms snaps the feathered edge crisp, then everything is dead still.
- *Feel:* like watching a brushstroke decide where it ends. Fast enough to never block reading (content is interactive the moment "wet" ends, ~400ms), slow enough in its decay that arrival feels like settling, not teleporting.
- *Reduced motion:* a simple 200ms opacity crossfade tinted with the same palette — the color identity survives, the sweep doesn't.

**Why the book demands it.** The skies of *The Meadows* (scan 080) and *Rainbow Inn* (scan 090) — wet-on-wet washes with granulation and hard dried boundaries — are her signature ground. And the constraint is honored: the wash *frames and carries*; it never touches or redraws her paintings. It's the paper acting, not the picture.

**Hero moment.** Tapping from the white STILL LIFE chapter opener (scan 162) into *Three on a Raft* (scan 170): the wash blooms in that painting's amber-and-umber palette before the image arrives — you taste the painting's color a quarter-second before you see it. Across a session, the site feels like it's being painted as you walk through it.

**Data used.** Per-painting dominant palettes (all 267), chapter structure, book-page order.

**Risk.** `feTurbulence`/`feDisplacementMap` at full viewport can jank low-end devices; the safe build is 6–8 pre-rendered grayscale wash-edge masks (WebP, ~30KB total) animated via `mask-position`/`mask-size` and `transform` only — fully compositable, 60fps everywhere. The real risk is restraint: the wash must stay at low opacity over white or it becomes a Vegas curtain. Tint ceiling: 18% opacity, enforced in the token system.

---

### Concept C — THE ECONOLINE
*The ON THE ROAD chapter as a drive you steer with momentum.*

**Core idea.** She painted these facades from a Ford Econoline van, roaming and stopping (scan 076). The chapter becomes a single horizontal momentum-scroll "road": white paper as highway, paintings as the roadside buildings you approach, slow down for, and stop in front of.

**Interaction loop.**
- *Input:* horizontal scroll / swipe with momentum; click-drag on desktop. No pagination, no snap-carousel ticks.
- *Response:* the road coasts with vehicular friction — releases decay slowly (decay constant tuned so a hard flick coasts ~2.5 viewport-widths over ~2s), and approaching a painting applies gentle magnetic braking: friction increases within a capture zone so you *roll to a stop* centered on the facade, the way a van crunches to a stop on a gravel shoulder. Captions and her prose excerpts fade up only at rest (wet-then-still: information appears when motion dies). Distant paintings sit slightly smaller with 4–6% parallax against the white — flat, like signs down the road, never a 3D tunnel. Velocity maps to a subtle motion-blur cue on the *white space only* (a faint horizontal streak in the page texture, never on artworks).
- *Feel:* under the finger it's a heavy-ish vehicle with good brakes — momentum you trust, stops you can aim. Driving past without stopping is allowed and feels like the trip she describes: "roaming around the countryside."
- *Reduced motion:* the road becomes a vertical list with standard scrolling; the braking/centering becomes simple scroll-snap; parallax off.

**Why the book demands it.** The ON THE ROAD text (scan 076) is explicitly automotive — the van, the "collected" fast-disappearing places, "Meekers Welding" spotted *while driving*. The paintings themselves are all head-on facades at stopping distance: *The Meadows* (scan 080), *Bonnie and Bill's Rainbow Inn* (scan 090). The book even sequences them like mile markers, one per page with white between.

**Hero moment.** Flicking hard, watching *San Pedro Cafe*, *Buzz's*, *Sav-A-Lot* slide past like signage — then easing off and feeling the page brake itself in front of the Rainbow Inn as the caption settles in like dust behind a stopped van.

**Data used.** ON THE ROAD chapter set (~38 paintings per the list, scan 302), her chapter prose, painting locations from the index for mile-marker labels.

**Risk.** Horizontal momentum scroll fights native scroll on trackpads; build it on a virtual scroller (translate the world, not the scrollport) and keep the wheel axis mapped. Magnetic braking must never *steal* control — capture zone small, override threshold low. Accessibility needs a parallel keyboard path (arrow keys = next stop) and the reduced-motion list as a true equal, not a punishment.

---

### Concept D — STILLNESS IS THE GESTURE
*An interface where stopping is the input. I don't believe this has been built on the web.*

**Core idea.** Her autobiography scrolls as pure text in a white field — and the paintings only emerge when you *stop scrolling*. Dwell is the gesture. The archive rewards the same patience watercolor demands: you cannot hurry drying paper, and you cannot see this woman's paintings while rushing past her life.

**Interaction loop.**
- *Input:* ordinary vertical scrolling through her prose (the full ~28,660 words, chaptered). And then: the absence of input. A dwell timer arms whenever scroll velocity falls to zero.
- *Response:* after ~600ms of true stillness, the margins begin to bloom — the paintings linked to the paragraph in view (by book page, place, or person mentioned) fade and *spread* into the white space around the text, each arriving with a soft wash-in (Concept B's grammar, small scale) over 900–1200ms, then drying to full crispness and absolute rest. The instant you scroll again, they recede in 200ms — fast, like brushing past. Dwell longer (3s+) and a second ring arrives: captions, dimensions, the index connections. The page literally gives you more the stiller you are.
- *Feel:* uncanny in the best way — the first time it happens, users think they caught the site doing something private. There's no button to press; attention itself is the control. On touch devices, resting a thumb works; for keyboard/AT users, an explicit "pause to reveal" affordance and a persistent "show paintings" toggle make the hidden layer fully reachable.
- *Reduced motion:* the dwell mechanic survives (it's about *timing*, not animation) but reveals become simple fades; alternatively a setting renders all paintings inline statically — the book's own layout.

**Why the book demands it.** This is the title made into physics: *the life of a woman who managed to keep painting* — work fitted "into the spaces between" (Introduction, scan 014). The paintings literally occupy the interstices of her life; here they occupy the interstices of your attention. And it's true to the page rhythm of the book itself: text pages (scans 016, 020, 028) and painting pages alternate; you never get both at full volume at once. The Greece diary (scan 250) is the proof of the cycle — frantic prose, then she stops, and a chapel gets painted.

**Hero moment.** Mid-chapter, you pause on the paragraph about the anonymous gift of oil paints when she was sixteen (OLD STUFF, scan 040) — and as you sit with it, *Girl with Arm, 1935, watercolor, 8×11* surfaces silently in the left margin. The painting that paragraph earned. People will tell other people about this.

**Data used.** Complete prose; paragraph→painting mapping via book page proximity; index entities (people/places) for second-ring connections; dimensions for margin layout.

**Risk.** The honest one: discoverability. If users never stop, they never learn. Mitigate with one scripted first-dwell moment near the top of the Introduction (a gentle "stay a moment" cue, used once). Velocity detection must ignore scroll-jitter (require <2px/100ms sustained). The paragraph→painting mapping is editorial work, not engineering — budget for it. Technically this is light: IntersectionObserver + a velocity sampler + lazy image loading keyed to dwell, which conveniently means you only ever load images the user has slowed down enough to deserve.

---

### Concept E — THE TEA-COZY NOTEBOOK
*The TRAVEL chapter at pocket scale: dated diary entries, tiny sketches, and a map that coasts.*

**Core idea.** Her travel kit "all fitted into a quilted tea-cozy" with "a pocket-size dime store notebook for daily travel notes" (scan 236). The TRAVEL section becomes a small object inside the big white site: a pocket-notebook reader whose pages flip with paper-light inertia, side-by-side with a momentum map of her 68 geocoded places.

**Interaction loop.**
- *Input:* horizontal swipe flips notebook leaves (a dated diary entry, a 4×7 sketch, sometimes both); drag the adjacent map; tap a place to flip the notebook to its entries.
- *Response:* page flips are featherweight — 220–300ms, a 2D skew/translate fold (no showy 3D), driven by drag distance with a release threshold; the leaf settles dead flat instantly (small mass per Concept A — these are the lightest objects in the archive). The map pans with loose, sketchy momentum (longer coast than the notebook, lighter braking than the Econoline) and the route line between dated entries draws itself only while the map is settling, finishing exactly when motion stops. Notebook and map are linked: flipping pages nudges the map toward that entry's coordinates with a lazy, trailing ease — the map is always slightly *behind* the notebook, like a companion catching up.
- *Feel:* small, quick, private — the opposite of the gallery's slow grandeur. Thumb-scale interactions, everything within reach, every motion short. It should feel like riffling someone's actual pocket notebook on a ferry deck.
- *Reduced motion:* flips become instant page swaps; the map jumps with a crossfade; route lines render pre-drawn.

**Why the book demands it.** The TRAVEL opener (scan 236) defines the object: pocket-size notebook, two brushes, a chocolate bar. The entries are dated and torrential (Greece, scan 250). The sketches are tiny and fast — *St. Emilion 5×7*, *Honfleur 7×9* (scan 240), *Takayama Bridge 4×7* (scan 260). A pocket-scale, quick-flip kinetic register is the only honest way to present 4-inch paintings made between ferries.

**Hero moment.** Flipping through the Greece pages while the map drifts across the Aegean a half-beat behind you, the Naxos route line finishing its draw just as the leaf settles — the whole system going still together, wet then still, in sync.

**Data used.** Dated diary entries from the prose; the TRAVEL chapter paintings with dimensions; 68 geocoded places; index people for "who appears in this entry."

**Risk.** Two physics registers (light notebook, coasting map) running adjacently can fight for the gesture — disambiguate strictly by hit zone and axis lock. Map tiles + high-res sketch scans on flip is a loading choreography problem; preload ±2 leaves and use the wash-in (Concept B, small) to cover late arrivals honestly. The linked lazy-follow map is genuinely novel-feeling but must be capped (max 1.2s catch-up) or it reads as lag, not companionship.

---

## How these compose

TRUE WEIGHT is the physics constitution — it applies everywhere. THE SETTLING WASH is the transition grammar — it applies everywhere. ECONOLINE, STILLNESS IS THE GESTURE, and TEA-COZY NOTEBOOK are the three rooms (road, autobiography, travel) where the constitution gets a local accent. One language — **wet, then still** — five enforcements of it. Build the wash and the mass system first; everything else is a tuning of those two.
