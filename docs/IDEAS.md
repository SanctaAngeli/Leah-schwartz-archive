# Ideas — Things that would make this archive shine

*Companion to `SITE_REVIEW.md`. The review covers what's broken and what to fix. This document is the opposite — the wildly ambitious moves that, done well, would make this site the kind of artist's memorial people send each other links to.*

> The ground rule: every idea here uses **material we already have** (paintings, photos, prose, INDEX) or material that's reasonable to commission (voice actor, a few new illustrations). Nothing relies on inventing facts.

---

## Cinematic

### 1. The Z-axis Entrance
The original v1 vision, deferred but never executed. When a first-time visitor lands on `/`, the screen fills with a constellation of her paintings hanging in soft 3D space. The camera moves forward, paintings drift past on side walls, the deepest one resolves into the hero with her name centered on it. Two seconds. Then the home page settles. It plays **once** (cookie-gated), then never again. The signature moment of the site.

*Builds on: existing canvas math, signature paintings, Framer Motion 3D.*

### 2. Studio Visit — A Scrollytelling Piece
A long-scroll narrative like the New York Times' best interactives. The visitor scrolls and arrives, in 1985, at Leah's Mill Valley studio. Parallax photographs, ambient sound (gulls? typewriter? brush in water?), her own words pulled at the right moments, paintings revealed on the walls as you walk past. Ends in the studio itself with a quote of hers. Treats her like she's still there, still painting.

*Builds on: the 74 photo candidates, her studio prose section, the canvas of paintings.*

### 3. The Studio, In 3D Isometric
A small interactive illustration — her actual Mill Valley studio rendered as a clean isometric scene (commissioned illustration, ~$300-500). Click the easel, see what was on it. Click the window, see what she could see (Mt. Tam beyond). Click the desk, see her journals open. Click the wall, see what's pinned. A tiny world the visitor can poke at.

*Builds on: studio prose, her tools mentioned in writing, place data for what's outside the window.*

---

## Voice

### 4. Chapter Audio — Her Voice Spoken
Every chapter intro essay recorded as audio, by a thoughtfully-chosen voice actor (or her actual recordings if any exist — Q5 in the plan asks her son). Each themed gallery room plays its intro essay if the visitor wants it. The autobiography on `/her-words` becomes audiobook-able too. People listen to artist memoirs on long walks. We should let them.

*Builds on: 28,660 words already organized into sections, the chapter accent system.*

### 5. Walk With Her — Guided Drift
Press a button on the canvas, the drag controls release, the canvas auto-pans through a curated path through her career, her voice narrating as you go. "This was 1967, just after we got back from Naxos…" — the voice fades, you see the painting, the camera moves on. Apple Maps Flyover for an artist's life. Six or seven of these per-chapter, each 90 seconds.

*Builds on: canvas + prose mentions + audio. Could be implemented as scripted Framer Motion keyframes through canvas coordinates.*

---

## Discovery layers — letting the data reveal itself

### 6. The Color Atlas
Extract every painting's dominant palette (a 30-line script with a color-quantization library). Show her colors as a temporal spectrum: scroll horizontally through her career and watch the hues evolve. The 1940s are sober browns and greys; the 1970s explode into Greek-Mediterranean blues; the late flower years bloom into pinks and yellows. A scientist would call it a chromatic biography. It's also breathtakingly beautiful.

*Builds on: just the existing 267 images. Pure computation.*

### 7. Subject Obsessions
She painted Mt. Tam at least five times, Herman in her hands repeatedly, the stained-glass window twice, one pear many times. Pairings touches this; expand it into a full discovery layer. "The Subjects She Returned To" — a page that surfaces her recurring obsessions automatically by clustering paintings via the INDEX. Each cluster is a small story. Hover to see all returns to that subject, sequenced by year so the visitor sees how her treatment evolved.

*Builds on: the INDEX, the pairings concept, place_ids and people_ids in the data.*

### 8. At Her Age
A horizontal slider across her 84 years. As you drag, three things sync:
- A photograph of Leah at that age (we have photos across her life)
- The paintings she was making in that year (or chapter)
- A short caption of what was happening (a move, a child, a trip, a death)

It is impossible to look at her 1953 painting beside a photograph of her at 33 with two toddlers and not feel something.

*Builds on: photos, artwork dates, biographical events from the autobiography.*

### 9. The Constellation, As Primary Navigation
Right now the Index Constellation is a toggle hidden inside `/index`. Make it a peer-level destination — `/constellation`. Every person, place, and subject is a node, sized by mentions, connected by co-occurrence. The visitor can drift through her web of associations. Hover a node, the prose excerpts where it appears float up. Click a node, the connected paintings glow. It's the **mind** of the archive made visual.

*Builds on: existing constellation component, people.json, places.json, subjects.json.*

### 10. In Her Own Time — Historical Context
For any painting, show what else was happening in the art world the year she made it. Stuff like "1967: Hockney's *A Bigger Splash*; Riley's *Cataract 3*; Leah painted *Mt. Tam from Sonoma*." Pulls from a small curated dataset of major art-historical events (a few hours of hand-curation, or Wikipedia's "Year in Art" pages). Anchors her work in the broader weather of her time.

*Builds on: existing dates. New: a small curated context dataset.*

---

## Living archive — things that grow

### 11. Letters to Leah
A wall of postcards. Visitors can leave a single sentence after experiencing the site — addressed to her. "Your watercolors made me start painting again. — Anya, Berlin." "I lived two streets over in Mill Valley and never met you. I'm sorry. — D.B." Curated for tone (no spam, no malice). They accumulate over time, displayed on the homepage as a slow carousel or a dedicated page. The site becomes the place where her audience meets her, decades after.

*Builds on: nothing existing — pure new. Needs lightweight backend (a Google Sheet or a tiny serverless function would suffice).*

### 12. Curated Tours by Family
Each son — Dan, Peter, Davy — picks ten paintings and writes a short commentary on each. "My mother's favorite afternoon light. She'd disappear for hours when this is what was happening outside." Three intimate alternative galleries, each in the son's own voice. Gives the family a way to participate in the archive, and gives visitors the work seen through the people who loved her.

*Builds on: family contact, the existing artwork catalog. New: their words.*

### 13. The Lost Works Register
She mentions paintings in her autobiography that aren't in the catalog. ("The portrait I did of Mrs. Lieber in '52 — never knew what happened to it.") Surface these as their own gallery: a wishlist of lost work, with the prose passages where she mentions them, and a "do you own this? get in touch" CTA. The archive becomes ongoing scholarship — open for new discoveries, not closed at 267.

*Builds on: prose data, a forensic pass through her writing.*

### 14. The Last Paintings — A Separate, Reverent Room
The 2002–2004 work. She knew she was ill. A small dedicated room on the site, designed differently from the rest — slower transitions, more white space, no glossy hover effects, the paintings shown larger, her late words next to them. Treats the end of her career with the gravity it deserves rather than burying those pieces in the general grid.

*Builds on: the existing late-period artworks, their associated prose.*

---

## Tactile & sensory

### 15. The Sketchbook
She traveled with notebooks. The catalog has `notebookPages` as a field. Build the digital flipbook: facing pages, paper texture, sketches on one side and her travel prose on the other, a real page-turn animation. The visitor can flip through "the Greek notebook" or "the India notebook" as if it's in their hands. The most book-like artifact we can make.

*Builds on: notebookPages field, travel prose, paper-texture CSS.*

### 16. The Travel Sketchbook — Animated Routes
On the places map, when you click a country, an animated paper-cut line (Wes Anderson title-sequence style) traces her route across the region. Sketches and paintings she made along the way pop in at each stop. Her travel diary unfolds visually. Use SVG path animation.

*Builds on: places.json (already geocoded), travel chapters, the existing Leaflet map.*

### 17. Watercolor Sandbox — Try Her Medium
A small browser-native simulator on a corner of the studio page. Real bleeding pigments, paper grain, brush wetness. The visitor can try the medium she gave her life to. Save your sketch, see a gallery of visitor sketches. The casual experiment makes her technique tangible. (There are good open-source watercolor JS libraries; a working version is one weekend of work.)

*Builds on: nothing — pure new feature, contained on one page.*

### 18. Living Watercolor Backdrop
Every page has a faint watercolor wash in the background, painted in real-time on each load, in the chapter's accent color. Slowly blooms, fades, settles. It's barely there — but it makes the chrome itself feel painter-made. The site has a brush in its hand at all times.

*Builds on: chapter accent colors. New: a small CSS / canvas generative loop.*

---

## A few wildcards

### 19. The Visitor's Painting
A short, quiet questionnaire — eight questions, the kind a friend asks. ("Where do you most want to be right now?" "When were you happiest in a room?" "What color do you wear when you're sad?") The answers map, deterministically, to one painting in Leah's catalog. That painting becomes "yours." Visitors leave with a piece. They came in not knowing her; they leave with something of hers in their pocket.

*Risky. Could feel like Buzzfeed. Done with restraint and her actual language, it could be the best thing on the site.*

### 20. The Conservatory — Where Her Paintings Live
For pieces in identified collections ("Collection of Don Cohan"), a respectful, anonymized view: a small artist-illustrated watercolor of "this painting in a living room" or "this painting in a hallway." Provenance with feeling. Reminds the visitor that these objects are out there in the world, alive in someone else's daily life.

*Builds on: collection metadata. New: a handful of commissioned illustrations.*

### 21. A Voice Across the Pages
A small, persistent component that rotates one of her quotes onto every page — not as a banner, but as if she's leaving notes for the visitor. ("This is the only landscape I never wanted to leave." — a quiet line in the corner of the page about Mt. Tam.) Already on the v2 roadmap as "Voice Card" — overdue.

*Builds on: existing prose, chapter context. Small, but quietly transformative.*

---

## How I'd think about picking

If you asked me to pick **three** that, done well, would change the site most:

1. **#1 (Z-axis Entrance)** — the front door becomes a moment people remember. It's the single thing most likely to be screenshotted and shared.
2. **#6 (Color Atlas)** — pure data art, no permissions needed, immediately stunning, and useful to scholars. Highest beauty-to-effort ratio.
3. **#8 (At Her Age)** — emotional gut-punch. Photograph + painting + age + caption is a small machine for making people care.

If you asked me which **one** would matter most for the people who actually knew her: **#11 (Letters to Leah)**. Family and friends could leave traces, see traces, and the archive becomes a place where her community keeps gathering across time.

---

*All of these assume the urgent fixes in `SITE_REVIEW.md` ship first. There's no point building the Color Atlas onto a home page that can't keep a visitor.*
