# Issues To Fix - Leah Schwartz Archive

This document captures all issues and feedback that need to be addressed. Created from user feedback session on February 2026.

---

## Critical Priority

### 1. Era Piles Alignment (LandingPage/EraPile)
**Location:** `src/components/home/EraPile.tsx`, `src/pages/LandingPage.tsx`

**Problem:** Artworks in era piles are LEFT-ALIGNED instead of centered under the year/period labels.

**Expected:** Artwork stacks should be centered directly beneath their corresponding period titles (e.g., "1960s", "1970s").

**Screenshot reference:** Era piles show artwork cards offset to the left of center.

---

### 2. Era Expansion Should Take Over Full View
**Location:** `src/components/home/EraPile.tsx`

**Problem:** When an era is expanded (clicked), other periods remain visible. The expanded view overlaps with adjacent era content.

**Expected:** When a user clicks on an era pile:
- The expanded era should take over the FULL viewport
- All other era periods should be hidden/dismissed
- Clear "back" or "close" affordance to return to overview

---

### 3. Night Mode Not Updating Navigation Bar
**Location:** `src/hooks/useTheme.tsx`, `src/components/layout/Navigation.tsx`

**Problem:** When night mode is toggled, the main navigation/task bar does not change colors. It stays light-themed while the rest of the page goes dark.

**Expected:** Navigation bar should respect the current theme and update its colors accordingly (dark background, light text in night mode).

---

### 4. New Pages Not in Navigation
**Location:** `src/components/layout/Navigation.tsx`

**Problem:** The following pages exist but are NOT accessible from the main navigation:
- Favorites (`/favorites`)
- Compare (`/compare`)
- About (`/about`)

**Expected:** Add navigation links to these pages so users can discover and access them.

---

## High Priority

### 5. Home Page Corridor Animation Direction
**Location:** `src/pages/HomePage.tsx` (or related corridor components)

**Problem:** The corridor/gallery entrance animation only looks good when scrolling BACKWARDS. Forward motion doesn't feel right.

**Expected:** The z-axis entrance animation should feel immersive and natural when moving FORWARD through the space.

---

### 6. Restructure Home/Gallery Flow
**Location:** App.tsx routing, HomePage, LandingPage

**User Vision:**
- The corridor/gallery entrance should BE the home page (currently at `/`)
- "Gallery" (`/gallery`) should be the era periods view
- First page should be scrollable with:
  - Art highlighting as you scroll
  - Zoom into details
  - Art as the hero, immersive experience

**Current State:** Home and Gallery feel disconnected. User wants the corridor experience to be the primary entry point that flows naturally into the browsing experience.

---

### 7. Timeline Performance Issues
**Location:** `src/pages/TimelinePage.tsx`

**Problems:**
- Slow loading
- Some years not loading at all
- General jankiness in the timeline view

**Expected:** Timeline should load quickly with all years visible and smoothly scrollable.

---

### 8. Portrait Gallery Loading is Janky
**Location:** Likely `src/pages/LandingPage.tsx` or related gallery components

**Problem:** When loading artworks in portrait/gallery view, there's visible jank/stutter.

**Expected:** Smooth loading with appropriate loading states, lazy loading, or virtualization if needed.

---

## Medium Priority

### 9. Locations Page Needs a Map
**Location:** `src/pages/LocationsPage.tsx`

**Problem:** Locations page doesn't have a map visualization.

**Expected:** Add a map focused on San Francisco (primary location for the artist's work) showing where artworks were created.

**Considerations:**
- Could use Mapbox, Google Maps, or a static SVG map
- San Francisco area is the primary focus
- Should show location markers that link to artwork filters

---

### 10. Theme/Material Card Borders
**Location:** `src/pages/ThemesPage.tsx`

**Problem:** Theme and material cards have borders that don't look good.

**Expected:** Remove or replace borders with more subtle visual separation (shadows, spacing, or glassmorphism effects per the design system).

---

### 11. Artwork Zoom/Pan Not Implemented
**Location:** `src/components/artwork-detail/ArtworkModal.tsx` or new component needed

**Problem:** Zoom features mentioned in improvements but not visible/accessible to user.

**Expected:** Users should be able to:
- Zoom into artwork details
- Pan around zoomed artwork
- Pinch-to-zoom on mobile
- Mouse wheel or button controls on desktop

---

### 12. Art Should Be Front and Center
**General Principle**

**Problem:** Metadata/UI elements sometimes compete with the artwork for attention.

**Expected:** Throughout the site:
- Artwork should always be the hero
- Metadata should be secondary/supporting
- UI should be minimal and recede into background
- Let the art breathe and take center stage

---

## Technical Debt / Polish

### 13. Loading States Consistency
Review all pages for consistent loading state handling using the Skeleton component that was created.

### 14. Reduced Motion Support
Ensure all animations respect `prefers-reduced-motion` media query for accessibility.

### 15. Mobile Experience Review
Test and polish the experience on mobile devices, especially:
- Touch interactions on era piles
- Swipe navigation on artwork modal
- Search modal usability
- Settings panel accessibility

---

## Files Reference

Key files that will need modification:

| Issue | Primary File(s) |
|-------|-----------------|
| Era alignment | `src/components/home/EraPile.tsx` |
| Era expansion | `src/components/home/EraPile.tsx` |
| Night mode nav | `src/hooks/useTheme.tsx`, `src/components/layout/Navigation.tsx` |
| Navigation links | `src/components/layout/Navigation.tsx` |
| Corridor animation | `src/pages/HomePage.tsx` |
| Timeline perf | `src/pages/TimelinePage.tsx` |
| Locations map | `src/pages/LocationsPage.tsx` |
| Theme cards | `src/pages/ThemesPage.tsx` |
| Artwork zoom | `src/components/artwork-detail/ArtworkModal.tsx` |

---

## Worktree Information

**Main project:** `/Users/harrylee/Developer/leah-schwartz-archive` (branch: `main`)
**Improvements worktree:** `/Users/harrylee/Developer/leah-improvements` (branch: `feature/comprehensive-improvements`)

The dev server runs on port 5173+ (Vite will find an available port).

---

## Design System Reminder

From `CLAUDE.md`:
- Gallery white backgrounds (`#FAFAFA`)
- The art brings the texture — UI stays pristine
- Glassmorphism everywhere
- Pill shapes (`border-radius: 9999px` or `24px`)
- EB Garamond for headings, Inter for UI
- Organic animations with `cubic-bezier(0.4, 0, 0.2, 1)`

---

*Document created: February 2026*
