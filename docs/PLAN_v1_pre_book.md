# Leah Schwartz Digital Archive
## Project Planning Document

**Project Type:** Digital art museum / interactive archive  
**Artist:** Leah Schwartz (1945–2004)  
**Location Focus:** San Francisco Bay Area  
**Client:** Leah's son (via Harry)  
**Lead Developer:** Harry + Claude Code

---

## 1. Project Vision

### The Core Idea
A digital museum experience that honors Leah Schwartz's artistic legacy. Visitors can either explore freely (like wandering a gallery alone) or take a guided audio tour (like having a docent walk you through). The site should feel premium, tactile, and alive—like Apple designed a museum.

### Design Philosophy
- **Gallery white, infinite space** — Clean backgrounds let the art breathe
- **The art brings the texture** — No competing paper textures; artwork is the visual richness
- **Glassmorphism UI** — Soft frosted-glass elements, pill shapes, subtle shadows
- **Organic movement** — Nothing feels static; gentle animations everywhere
- **Tactile interactions** — Sounds, snaps, hover responses that feel physical

### Key Metaphors
- Kodak slide carousel (timeline scrubbing)
- iPhone CoverFlow (artwork browsing)
- Museum audio tour (guided experience)
- Infinite gallery corridor (z-axis entrance)

---

## 2. Site Architecture

### Page/View Structure

```
HOME (Infinite Gallery Entrance)
│
├── [Z-axis scroll entrance] ──→ LANDING (Artist Overview)
│                                    │
│                                    ├── Three Era Groupings (dynamic)
│                                    │   └── Click artwork → ARTWORK DETAIL
│                                    │       └── Shows position on timeline
│                                    │
│                                    └── Navigation to:
│                                        ├── TIMELINE (Hero Feature)
│                                        ├── LOCATIONS
│                                        ├── THEMES
│                                        └── GUIDED TOUR
│
├── TIMELINE ─────────────────────────────────────────────────────────
│   │
│   ├── Horizontal carousel (1945–2004)
│   │   └── Each year = one representative artwork
│   │   └── Snap-to-year scrolling with tick sounds
│   │   └── Kodak carousel "peak" effect
│   │
│   └── YEAR VIEW (when year selected)
│       ├── Timeline jumps to top of screen
│       ├── Year crystallizes as header
│       └── Grid of all artworks from that year
│           └── Click → ARTWORK DETAIL
│
├── LOCATIONS ────────────────────────────────────────────────────────
│   │
│   └── 9 location cards (hero artwork as cover)
│       ├── The House
│       ├── Mount Tam
│       ├── [7 more San Francisco locations TBD]
│       └── Click → filtered gallery of works from that location
│
├── THEMES/MATERIALS ─────────────────────────────────────────────────
│   │
│   └── 9 theme cards (hero artwork as cover)
│       ├── Watercolors
│       ├── Notebooks
│       ├── Landscapes
│       ├── Portraits
│       ├── Sketches
│       ├── Collage
│       ├── Still Life
│       ├── People
│       └── Politics
│       └── Click → filtered gallery of works in that theme
│
├── GUIDED TOUR ──────────────────────────────────────────────────────
│   │
│   ├── Chapter selection (Early Life, SF Years, Late Work, etc.)
│   └── Audio player + synchronized artwork display
│       └── User controls navigation while listening
│
└── ARTWORK DETAIL (Modal/Overlay) ───────────────────────────────────
    ├── Large artwork image
    ├── Title, year, medium, dimensions
    ├── Location created
    ├── Collection info
    ├── Related notebook pages (if any)
    ├── Audio clip (if available)
    └── Mini-timeline showing position in career
```

---

## 3. Detailed Feature Specifications

### 3.1 Home: Infinite Gallery Entrance

**Visual:**
- Pure white/off-white background (gallery white: `#FAFAFA` or similar)
- "LEAH SCHWARTZ" in large, elegant serif typography (EB Garamond or similar)
- Behind the text: 9–12 artwork thumbnails floating, drifting slowly in a collage
- Artworks move with subtle parallax, different speeds, slight rotations
- Different random arrangement each visit (seeded by timestamp)

**Interaction:**
- Scroll down (or swipe forward on mobile) triggers z-axis zoom
- As you "enter," text recedes, artworks flip to the sides like gallery corridor walls
- ~20 artworks appear on corridor walls (10 per side) as you zoom through
- Smooth bezier easing, feels like physically moving through space
- Duration: ~2–3 seconds of travel

**Navigation:**
- Small UI element below title: "Enter the Archive" or "View the Work"
- Home button in nav always returns here (with reverse animation)

### 3.2 Landing: Artist Overview

**Visual:**
- Clean white space
- "Leah Schwartz" (smaller than home)
- "Artist" subtitle
- "1945–2004"
- Brief 2–3 sentence biography
- Three era groupings below

**Three Era Groupings:**
- Dynamically selected from the artwork database
- Each grouping = a "pile" of ~9 artworks from a specific year/period
- Default state: artworks stacked with slight offsets, gently breathing/moving
- Hover state: pile expands into organic grid (not rigid, slight randomness)
- Click artwork → opens Artwork Detail view
- Artwork Detail shows mini-timeline so user knows where they are

**Purpose:** Give visitors three different "entry points" into the timeline based on what catches their eye.

### 3.3 Timeline (Hero Feature)

**The Carousel (Bottom of Screen):**
- Horizontal scrubber spanning 1945–2004
- Only shows ~1 decade at a time in the scrubber
- Each year has one representative artwork
- Current year's artwork rises and enlarges (Kodak slide "peak")
- Adjacent years visible but receded
- Smooth snap-to-year scrolling

**Interaction:**
- Drag/swipe to scrub through years
- Tick sound on each year transition (tactile audio feedback)
- Faster drag = faster tick rate
- Precise scrubbing when moving slowly

**Year View (When Year Selected):**
- Timeline miniaturizes and jumps to top of screen
- Year displayed prominently as header
- Below: scrollable grid of all artworks from that year
- Grid has organic feel (not perfectly rigid)
- Hover on artwork: scales up slightly
- Click: opens Artwork Detail
- Re-engage with carousel to change year

**Visual Style:**
- Glassmorphism on the carousel container
- Subtle shadow beneath current artwork
- White/cream background
- Artworks have subtle frame effect (thin border or shadow)

### 3.4 Locations Section

**Layout:**
- 9 location cards in a 3×3 grid (or flowing layout)
- Each card shows one "hero" artwork from that location
- Location name overlaid on card
- Cards have glassmorphism treatment

**Locations (to be finalized):**
1. The House (home/studio)
2. Mount Tam
3. Golden Gate
4. [6 more San Francisco-area locations TBD]

**Interaction:**
- Hover: card lifts, subtle glow
- Click: transitions to filtered gallery showing all works from that location
- Filtered gallery uses similar carousel/grid hybrid

**Feel:** Should have its own identity while maintaining the overall aesthetic. Perhaps warmer tones or subtle location-specific accents.

### 3.5 Themes/Materials Section

**Layout:**
- Similar to Locations: 9 theme cards
- Hero artwork represents each theme
- Theme name overlaid

**Themes:**
1. Watercolors
2. Notebooks
3. Landscapes
4. Portraits
5. Sketches
6. Collage
7. Still Life
8. People
9. Politics

**Interaction:**
- Same as Locations
- Click → filtered gallery of works in that theme

**Feel:** Can have distinct identity. Perhaps slightly different card shapes or arrangements to differentiate from Locations.

### 3.6 Guided Tour

**Purpose:** A curated 10-minute journey through Leah's life and work, told through her art.

**Structure:**
- Chapter-based (e.g., "Early Years," "The San Francisco Period," "Late Reflections")
- Each chapter: audio narration + synchronized artwork display
- User controls navigation (not auto-advancing)

**Interface:**
- Chapter selection screen (beautiful cards or list)
- In-chapter view:
  - Current artwork displayed prominently
  - Audio player controls (play/pause, scrub, volume)
  - Chapter progress indicator
  - "Next" / "Previous" artwork within chapter
  - Current audio plays for the artwork you're viewing

**Audio:**
- Pre-recorded MP3 files (generated via ElevenLabs + some real recordings)
- Upload interface in admin/data layer (Harry uploads files)

### 3.7 Artwork Detail View

**Trigger:** Click any artwork anywhere on the site

**Layout (Modal/Overlay):**
- Large artwork image (zoomable?)
- Metadata panel:
  - Title
  - Year (with "circa" notation if approximate)
  - Medium
  - Dimensions
  - Location created
  - Collection
- Related content:
  - Notebook pages that inspired this work (if any)
  - Audio clip about this piece (if available)
- Mini-timeline showing where this work falls in Leah's career
- Close button returns to previous view

**Interaction:**
- Smooth fade/scale-in animation
- Click outside or X to close
- Keyboard: Escape to close, arrow keys for next/prev?

---

## 4. Technical Architecture

### 4.1 Tech Stack

**Framework:** React 18+ with TypeScript  
**Build Tool:** Vite  
**Styling:** Tailwind CSS + custom CSS for complex animations  
**Animation:** Framer Motion (primary) + CSS animations  
**Audio:** Howler.js or native HTML5 Audio  
**State Management:** Zustand (lightweight) or React Context  
**Routing:** React Router v6  
**Deployment:** Netlify (primary) or Vercel  
**Version Control:** GitHub

### 4.2 Project Structure

```
leah-schwartz-archive/
├── public/
│   ├── artworks/           # Artwork images (added later)
│   │   ├── full/           # High-res versions
│   │   └── thumb/          # Thumbnails for performance
│   ├── audio/              # Audio tour files
│   ├── notebooks/          # Notebook page scans
│   └── fonts/              # Custom fonts if needed
│
├── src/
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   │   ├── GlassCard.tsx
│   │   │   ├── PillButton.tsx
│   │   │   ├── CarouselItem.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Navigation.tsx
│   │   │   └── PageTransition.tsx
│   │   ├── home/
│   │   │   ├── InfiniteGallery.tsx
│   │   │   └── ZAxisEntrance.tsx
│   │   ├── landing/
│   │   │   ├── ArtistBio.tsx
│   │   │   └── EraGroupings.tsx
│   │   ├── timeline/
│   │   │   ├── TimelineCarousel.tsx
│   │   │   ├── YearView.tsx
│   │   │   └── CarouselScrubber.tsx
│   │   ├── locations/
│   │   ├── themes/
│   │   ├── guided-tour/
│   │   └── artwork-detail/
│   │
│   ├── data/
│   │   ├── artworks.json   # Artwork metadata
│   │   ├── locations.json  # Location definitions
│   │   ├── themes.json     # Theme definitions
│   │   └── tour.json       # Guided tour structure
│   │
│   ├── hooks/
│   │   ├── useCarousel.ts
│   │   ├── useAudio.ts
│   │   └── useAnimations.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── animations.css
│   │
│   ├── utils/
│   │   ├── shuffle.ts      # Randomization helpers
│   │   └── easing.ts       # Custom bezier curves
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── docs/
│   ├── PLAN.md             # This document
│   └── reference-images/   # UI inspiration
│
├── CLAUDE.md               # Claude Code rules
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

### 4.3 Data Schema

**Artwork:**
```typescript
interface Artwork {
  id: string;
  title: string;
  year: number | null;        // null if undated
  circa: boolean;             // true if year is approximate
  medium: string;
  dimensions: string;
  location: string;           // where it was created
  collection: string;
  themes: string[];           // e.g., ["landscapes", "watercolors"]
  imagePath: string;          // relative path to image
  thumbPath: string;          // relative path to thumbnail
  notebookPages?: string[];   // related notebook scans
  audioClip?: string;         // audio about this piece
  featured?: boolean;         // for hero selections
  heroForLocation?: string;   // if this is the hero for a location
  heroForTheme?: string;      // if this is the hero for a theme
}
```

**Location:**
```typescript
interface Location {
  id: string;
  name: string;
  description?: string;
  heroArtworkId: string;
}
```

**Theme:**
```typescript
interface Theme {
  id: string;
  name: string;
  description?: string;
  heroArtworkId: string;
}
```

**Tour Chapter:**
```typescript
interface TourChapter {
  id: string;
  title: string;
  description: string;
  artworkIds: string[];       // artworks in this chapter
  audioSegments: {            // audio for each artwork
    artworkId: string;
    audioPath: string;
    duration: number;         // seconds
  }[];
}
```

### 4.4 Placeholder/Shell Strategy

Since artwork assets aren't ready yet, build the entire UI with:

**Placeholder Artworks:**
- Gray rectangles with subtle color variations
- Random aspect ratios (portrait, landscape, square)
- Programmatically generated (no actual image files needed)
- Placeholder data in `artworks.json` with real structure

**Swap Strategy:**
- All image paths in data file
- When real art is ready: add images to folders, update paths in JSON
- No code changes needed—pure data swap

---

## 5. Implementation Phases

### Phase 1: Foundation (Shell)
**Goal:** Navigable site structure with placeholder content

- [ ] Project scaffolding (Vite + React + TypeScript + Tailwind)
- [ ] Basic routing (Home, Landing, Timeline, Locations, Themes, Tour)
- [ ] Navigation component with glassmorphism styling
- [ ] Placeholder artwork component (colored rectangles)
- [ ] Placeholder data file with 50+ fake artworks
- [ ] Basic page layouts (no animations yet)
- [ ] GitHub repo + Netlify deploy pipeline

**Deliverable:** Clickable prototype you can navigate

### Phase 2: Home Experience
**Goal:** The "wow" entrance moment

- [ ] Floating artwork collage behind title
- [ ] Slow drift animations (parallax, rotation)
- [ ] Z-axis scroll/swipe entrance
- [ ] Gallery corridor transition
- [ ] Reverse animation on home return
- [ ] Mobile swipe gesture support

**Deliverable:** Stunning first impression

### Phase 3: Timeline (Hero Feature)
**Goal:** The Kodak carousel experience

- [ ] Horizontal carousel component
- [ ] Snap-to-year scrolling
- [ ] "Peak" effect on current year
- [ ] Tick sound on year transitions
- [ ] Year view with grid layout
- [ ] Artwork detail modal
- [ ] Mini-timeline in detail view
- [ ] Smooth transitions between states

**Deliverable:** Fully functional timeline exploration

### Phase 4: Landing & Era Groupings
**Goal:** The "choose your entry point" experience

- [ ] Artist bio section
- [ ] Three era groupings component
- [ ] Pile → grid expansion animation
- [ ] Dynamic era selection logic
- [ ] Integration with artwork detail

**Deliverable:** Beautiful landing page with discovery mechanic

### Phase 5: Locations & Themes
**Goal:** Alternative browsing paths

- [ ] Location cards with hero artwork
- [ ] Theme cards with hero artwork
- [ ] Filtered gallery views
- [ ] Distinct visual identity per section
- [ ] Smooth page transitions

**Deliverable:** Complete browsing experience

### Phase 6: Guided Tour
**Goal:** The museum docent experience

- [ ] Chapter selection screen
- [ ] Audio player integration
- [ ] Artwork sync with audio
- [ ] Progress tracking
- [ ] Chapter navigation

**Deliverable:** Full audio tour functionality

### Phase 7: Polish & Performance
**Goal:** Production-ready quality

- [ ] Image optimization pipeline
- [ ] Lazy loading for artworks
- [ ] Animation performance tuning
- [ ] Accessibility audit (ARIA, keyboard nav)
- [ ] Mobile optimization
- [ ] Loading states
- [ ] Error handling
- [ ] Analytics integration

**Deliverable:** Production-ready site

### Phase 8: Content Integration
**Goal:** Real artwork integration

- [ ] Receive scanned artwork files
- [ ] Process images (resize, optimize, generate thumbnails)
- [ ] Update data files with real metadata
- [ ] QA all views with real content
- [ ] Final adjustments

**Deliverable:** Live site with Leah's actual work

---

## 6. Design Tokens & Style Guide

### Colors

```css
/* Backgrounds */
--bg-gallery: #FAFAFA;        /* Main background */
--bg-glass: rgba(255, 255, 255, 0.7);  /* Glassmorphism */
--bg-glass-border: rgba(255, 255, 255, 0.3);

/* Text */
--text-primary: #1A1A1A;      /* Headings */
--text-secondary: #4A4A4A;    /* Body */
--text-muted: #8A8A8A;        /* Captions */

/* Accents */
--accent-soft-blue: #E8F0F8;  /* Subtle highlights */
--accent-warm: #F5F0EB;       /* Warm backgrounds */

/* Shadows */
--shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.05);
--shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.08);
```

### Typography

```css
/* Primary: Elegant serif for headings */
--font-heading: 'EB Garamond', 'Times New Roman', serif;

/* Secondary: Clean sans for UI */
--font-body: 'Inter', -apple-system, sans-serif;

/* Sizes */
--text-hero: clamp(48px, 8vw, 96px);
--text-h1: clamp(32px, 5vw, 56px);
--text-h2: clamp(24px, 3vw, 36px);
--text-body: 16px;
--text-caption: 13px;
```

### Animation Curves

```css
/* Primary easing - smooth and organic */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);

/* Entrance animations */
--ease-out: cubic-bezier(0, 0, 0.2, 1);

/* Bounce for playful moments */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Slow drift for floating elements */
--ease-drift: cubic-bezier(0.37, 0, 0.63, 1);
```

### Glassmorphism Recipe

```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.glass-pill {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 9999px;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
```

---

## 7. Reference Images

Visual inspiration files are stored in `/docs/reference-images/`:

- `G-V5svcW4AAibCK.jpeg` - Glassmorphism UI components
- `G-V5svdWEAAZWvz.jpeg` - Pill button with toggle
- `G-V5sviWEAEALai.jpeg` - Tab switcher
- `G__Ety8bEAEvy56.jpeg` - Input field with icons
- `HAAamn1WYAAbJEd.jpeg` - Traffic light buttons + progress
- `HAAamn6W4AAfaQf.jpeg` - Notification cards
- `HAAamnzXUAALMo7.jpeg` - Project card with controls
- `HAAamoNXcAAnRlV.jpeg` - Send button (glass effect)

**Key takeaways from references:**
- Soft, rounded pill shapes (border-radius: 9999px)
- Subtle inner shadows creating depth
- Very light color palette (whites, pale blues)
- Icons with soft glows/halos
- Multi-layered shadow effects
- Elements feel like they're floating

---

## 8. Open Questions & Decisions Needed

### Before Starting
1. **Confirm tech stack** - React/Vite/Tailwind or alternatives?
2. **Domain name** - leahschwartz.com? leahschwartzarchive.com?
3. **Exact birth/death years** - Placeholder is 1945–2004

### During Development
1. **Notebook integration** - How prominent? Separate section or inline?
2. **Search functionality** - Needed? By title/year/theme?
3. **Sharing** - Social sharing for individual artworks?
4. **Print** - Should users be able to generate print-quality views?

### Before Content Integration
1. **Image specs** - What resolution are the scans?
2. **Metadata source** - Spreadsheet? Will need title/year/medium/etc.
3. **Audio script** - Who writes narration? Timeline for recording?

---

## 9. Success Metrics

### Qualitative
- Does it feel like walking through a museum?
- Would Leah be proud of how her work is presented?
- Do visitors want to explore, or do they bounce?

### Technical
- Time to first meaningful paint < 2s
- Smooth 60fps animations
- Works beautifully on mobile
- Accessible (WCAG AA minimum)

---

## 10. Getting Started

### For Claude Code

1. Read `CLAUDE.md` for project-specific rules
2. Start with Phase 1 scaffolding
3. Use worktrees for parallel work:
   - `main` - stable
   - `feature/home-entrance` - z-axis experience
   - `feature/timeline` - carousel
   - `feature/ui-components` - glassmorphism library

### Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Lint
npm run lint
```

---

*Document Version: 1.0*  
*Last Updated: February 2026*  
*Author: Harry + Claude*
