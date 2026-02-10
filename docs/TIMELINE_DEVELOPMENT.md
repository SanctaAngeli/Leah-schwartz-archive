# Timeline Development Log

This document tracks the development work on the Timeline feature for the Leah Schwartz Archive. It serves as a paper trail for continuity across development sessions.

---

## Current Status (February 2026)

The Timeline feature is functional but has several UX issues that need refinement to achieve the Apple-level polish we're aiming for.

### Key Files
- `src/pages/TimelinePage.tsx` - Main page component, handles year expansion view
- `src/components/timeline/TimelineCarousel.tsx` - Core carousel with drag interaction and scrubber
- `src/components/timeline/TimelineArtworkCard.tsx` - Individual artwork cards
- `src/components/timeline/DecadeMarker.tsx` - Decade navigation pills

---

## Issues Identified (Feb 10, 2026)

### 1. Carousel Drag Behavior
**Problem:** When holding and dragging the timeline carousel:
- Cards drift too far to the side instead of staying centered
- Feels too "snappy" - like it expects immediate mouse release
- Alignment issues during drag operation

**Root Cause Analysis:**
- The `dragX` motion value is applied directly to the container's x position
- When dragging, the container moves with the mouse but the visual centering logic fights this
- The spring animation on drag end (`stiffness: 400, damping: 30`) snaps back too aggressively

**Proposed Fix:**
- Decouple visual drag feedback from the card positioning logic
- Use `dragX` only for calculating the target index, not for visual offset
- Implement smoother momentum-based scrolling
- Consider adding a "dead zone" where the carousel doesn't move until threshold is reached

### 2. Bottom Scrubber/Slider Issues
**Problem:** The dot-based slider at the bottom:
- The draggable dot drops/shifts vertically on hover
- Highlighted dot markers feel "rubbery" and laggy
- Not following the mouse quickly enough

**Root Cause Analysis:**
- `whileHover={{ scale: 1.2 }}` and `whileTap={{ scale: 0.9 }}` on the handle cause visual jumping
- The dot markers have size transitions that affect layout
- Using spring animations for position updates adds perceived lag

**Proposed Fix:**
- Remove or reduce scale animations on hover/tap for the handle
- Remove the highlighted dot markers entirely for smoother feel
- Use linear or very stiff spring for scrubber position updates
- Ensure handle stays vertically centered with proper transform-origin

### 3. Year Expansion Animation
**Problem:** When clicking into a year (e.g., 1984):
- The year number comes down from the top awkwardly
- The timeline doesn't drift down smoothly
- Art loads then snaps into position
- Overall feels janky, not Apple-smooth

**Desired Behavior:**
1. User clicks on a year card
2. The entire timeline carousel smoothly drifts downward and fades
3. The clicked year's number elegantly rises/scales to become the page heading
4. The hero artwork from that year smoothly expands to prominence
5. The grid of artworks for that year fades in gracefully from below

**Root Cause Analysis:**
- Current animation: year header uses `initial={{ y: -20 }}` (comes from top)
- Multiple AnimatePresence components create competing animations
- The artwork grid has staggered delays that feel disconnected
- No coordinated choreography between elements

**Proposed Fix:**
- Redesign the transition as a coordinated sequence:
  1. Clicked card scales up slightly and begins moving upward
  2. Other cards fade out while carousel moves down
  3. Year number transforms from card overlay to page heading
  4. Artwork grid fades in with subtle upward motion
- Use `layout` prop from Framer Motion for smooth element repositioning
- Consider using a shared layout animation for the year number

---

## Technical Notes

### Animation Principles (from CLAUDE.md)
- Default easing: `cubic-bezier(0.4, 0, 0.2, 1)`
- Spring defaults: `stiffness: 300, damping: 20`
- Everything should feel organic, not mechanical
- Performance: use `transform` and `opacity`, avoid layout thrashing

### Current Animation Values in TimelineCarousel.tsx
```typescript
// Card drag end snap
animate(dragX, 0, { type: 'spring', stiffness: 400, damping: 30 });

// Card positioning
transition={{ type: 'spring', stiffness: 350, damping: 35 }}

// Scrubber handle
whileHover={{ scale: 1.2 }}
whileTap={{ scale: 0.9 }}
```

---

## Session Log

### Session: Feb 10, 2026
**Developer:** Claude (Opus 4.5)
**Requested by:** Harry

**Tasks:**
- [x] Document current issues (this file)
- [x] Fix carousel drag centering and snappiness
- [x] Fix bottom scrubber alignment and responsiveness
- [x] Fix year expansion animation for smooth Apple-like feel

**Changes Made:**

#### 1. Carousel Drag Behavior (`TimelineCarousel.tsx`)
- **Removed visual drag offset**: Cards no longer drift with the mouse. The `dragX` motion value is now used only for index calculation, not visual positioning.
- **Added momentum-based scrolling**: Implemented velocity tracking during drag with `dragVelocity` ref to apply natural momentum on release.
- **Continuous interpolation**: `getCardStyle()` now uses continuous float values instead of discrete integers for smoother positioning during drag.
- **Adaptive transitions**: Cards use instant tweens during drag (`duration: 0.05`) and smooth springs when not dragging.
- **Gentler snap-back**: Reduced spring stiffness from 400 to 200, added mass property for more natural feel.

#### 2. Bottom Scrubber (`TimelineCarousel.tsx`)
- **Removed hover/tap scale animations**: The handle no longer scales on hover (was causing vertical shift).
- **Instant response during drag**: Scrubber now directly sets `floatingIndex` without animation during drag.
- **Simplified dot markers**: Removed highlighted individual dots, replaced with simple subtle tick marks at 25% intervals.
- **Linear transitions**: Handle position uses linear tween (`duration: 0.02`) for immediate mouse-following.
- **Proper vertical centering**: Handle uses `y: '-50%'` transform instead of `-translate-y-1/2` class for consistent positioning.

#### 3. Year Expansion Animation (`TimelinePage.tsx`)
- **Year header rises from below**: Changed from `y: -20` to `y: 80` so the year feels like it's rising UP from the carousel area.
- **Carousel drifts down on exit**: Exit animation now moves `y: 150` with `scale: 0.9` for natural drift-down effect.
- **Staggered sub-elements**: Back button and work count fade in with slight delays for choreographed feel.
- **Gentler grid animation**: Reduced initial y-offset, capped stagger delay at 0.3s, smoother spring values.
- **Coordinated timing**: Added appropriate delays so elements animate in sequence rather than fighting.

**Follow-up Fixes (same session):**

*Issue 1: Cards bunched to the right*
- Root cause: Using `floatingIndex.get()` in render doesn't trigger re-renders, and the x-position formula was wrong
- Fix: Restored original `getCardStyle` loop calculation, use `currentIndex` for positioning

*Issue 2: Drag kept snapping back to 1964*
- Root cause: `dragStartIndex` was reading from wrong source
- Fix: Properly capture `currentIndex` at drag start

*Issue 3: Cards shifting off-center during drag*
- Root cause: `style={{ x: dragX }}` was moving the entire container
- Fix: Remove visual offset entirely. Use `dragConstraints={{ left: 0, right: 0 }}` with `dragElastic={0}` so container never moves. Track drag via `info.delta.x` accumulated in a ref.

**Final Working Solution:**
```typescript
// Container stays centered - no visual movement
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0}
  dragMomentum={false}
  onDrag={(e, info) => {
    cumulativeDrag.current += info.delta.x;
    const indexDelta = -cumulativeDrag.current / DRAG_SENSITIVITY;
    const newIndex = Math.round(dragStartIndex.current + indexDelta);
    // ... update currentIndex
  }}
/>
```

**What's working:**
- Cards always centered with current year in middle
- Drag left/right smoothly cycles through years
- Scrubber has instant response, no vertical jumping
- Year expansion animations simplified (just opacity fades)

**Notes:**
- Running on port 5174 (timeline worktree)
- Main archive running on port 5173

---

## Testing Recommendations

After the Feb 10 changes, test the following:

1. **Carousel Drag**
   - Drag left/right - cards should stay centered, not drift with mouse
   - Fast flick - should have natural momentum
   - Slow drag - should feel smooth and responsive

2. **Scrubber**
   - Hover over handle - should NOT jump/shift vertically
   - Drag handle - should follow mouse immediately (no lag)
   - Click anywhere on track - should jump to that position

3. **Year Expansion**
   - Click a year - year should rise UP smoothly from carousel area
   - Carousel should drift DOWN and fade as year expands
   - Art grid should flow in from below with gentle stagger
   - Click "Back to Timeline" - should reverse smoothly

---

## Future Considerations

1. **Audio feedback:** Tick sounds are implemented but may need volume/timing adjustments
2. **Touch support:** Ensure drag behaviors work well on mobile/tablet
3. **Reduced motion:** Need to respect `prefers-reduced-motion` media query
4. **Performance:** Monitor for jank on lower-powered devices
5. **Shared layout animation:** Could use Framer Motion's `layoutId` for year number to animate from card to header seamlessly

---

## Scroll Gallery Feature (Feb 10, 2026)

Added a horizontal scroll gallery with CSS scroll-driven animation indicators for years with many artworks.

**Files:**
- `src/components/timeline/ScrollGallery.tsx` - React component
- `src/components/timeline/ScrollGallery.css` - CSS with scroll-driven animations

**How it works:**
1. Each card in the horizontal scroll track creates a `view-timeline`
2. The parent container uses `timeline-scope` to hoist these timelines
3. Indicators use `animation-timeline` to link to each card's timeline
4. The `@keyframes indicator-grow` animation expands the indicator when its card is centered

**Key CSS technique:**
```css
.scroll-gallery {
  timeline-scope: --card-0, --card-1, ...;  /* Hoist timelines */
}

.scroll-gallery__card {
  view-timeline: --card-N inline;  /* Create timeline per card */
}

.scroll-gallery__indicator {
  animation: indicator-grow both linear;
  animation-range: contain calc(50% - var(--size)) contain calc(50% + var(--size));
  animation-timeline: --card-N;  /* Link to card's timeline */
}

@keyframes indicator-grow { 50% { flex: 3; } }
```

**Currently enabled for:** Year 1970 (which has 10 artworks)

To enable for more years, add them to `SCROLL_GALLERY_YEARS` array in `TimelinePage.tsx`.

---

## Quick Reference: Animation Values

```typescript
// Gentle spring (natural movement)
{ type: 'spring', stiffness: 200, damping: 25, mass: 0.8 }

// Responsive spring (snappy but smooth)
{ type: 'spring', stiffness: 280, damping: 28 }

// Instant (during drag)
{ type: 'tween', duration: 0.05, ease: 'linear' }

// Standard ease (CSS-style)
{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }
```

---

## Session Log (continued)

### Session: Feb 10, 2026 (Evening)
**Developer:** Claude (Opus 4.5)
**Requested by:** Harry

**Issues Reported:**
1. Huge spacing gap between year header and artwork grid when clicking into a year
2. Wanted more detail on artwork cards - "museum-style" cards showing artwork details

**Changes Made:**

#### 1. Fixed Layout Spacing (`TimelinePage.tsx`)
- **Root cause:** The carousel wrapper had `marginTop: 'auto'` when expanded, but its content was `position: fixed` (out of flow). In a flex column, `margin-top: auto` absorbs all available space above the element, creating a huge gap.
- **Fix:** Changed `animate={{ flex: isExpanded ? '0 0 auto' : '1', marginTop: isExpanded ? 'auto' : '0' }}` to just `animate={{ flex: isExpanded ? 'none' : '1' }}`
- Also added `mt-6` to the artworks container for proper visual separation

#### 2. Museum Card Component (`MuseumCard.tsx`)
Created a new museum-style artwork card that displays:
- Artwork image with proper aspect ratio and hover scale effect
- Title (with hover color change)
- Medium and dimensions on one line
- Location with pin icon
- Collection with building icon
- Theme tags as subtle pills at the bottom
- "Featured" badge for featured artworks
- Glassmorphism styling with subtle shadows

**Files Created:**
- `src/components/timeline/MuseumCard.tsx`

**Files Modified:**
- `src/pages/TimelinePage.tsx` - Fixed spacing, swapped GlassCard grid for MuseumCard grid
- `src/components/timeline/index.ts` - Added MuseumCard export

---

*Last updated: February 10, 2026*
