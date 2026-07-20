# Feedback Round 2 - Comprehensive Changes

Based on user review on 2026-02-11. These changes will transform the site into a more cohesive, immersive experience.

---

## 1. Navigation Bar Restructuring

### 1.1 Settings Button
- [ ] Move settings button INTO the navigation pill bar
- [ ] Position it appropriately within the bar

### 1.2 Navigation Centering
- [ ] Fix strange alignment - nav bar should be properly centered
- [ ] Ensure consistent spacing

### 1.3 Search Button
- [ ] Move search button to far right of nav bar
- [ ] Put it in its own circle/pill for visual distinction

### 1.4 Random Button
- [ ] Current icon looks like a refresh button - needs clearer icon
- [ ] Consider dice icon or shuffle icon instead

### 1.5 "About" Rename
- [ ] Change "About" to "Leah's Story" in navigation

### 1.6 Navigation Visibility
- [ ] **MAJOR CHANGE**: Hide navigation bar until AFTER the landing/home page scroll is complete
- [ ] Navigation should only appear once user finishes the intro experience
- [ ] This creates a cinematic "reveal" moment

---

## 2. Curated Gallery Page Fixes

### 2.1 Header Controls (i, ❤️, Back)
- [ ] Remove from top header position
- [ ] Move to center, positioned UNDERNEATH the artwork
- [ ] Should be a clean row of controls below the art

### 2.2 "Click to view" Button
- [ ] Currently not centered on the artwork - FIX alignment
- [ ] Change text to "Click for more"
- [ ] Only show on HOVER (not always visible)
- [ ] Should appear with smooth fade-in on mouse over

### 2.3 Navigation Bar Conflict
- [ ] Navigation bar is currently unusable when in Curated Gallery
- [ ] Need to ensure nav works properly or hide it in this view

### 2.4 Curated Gallery Access Flow
- [ ] **CHANGE**: Curated gallery should NOT be a separate nav item
- [ ] Instead, clicking on an ERA in the Gallery page should open that era's curated view
- [ ] This creates multiple curated galleries (Early Works, Middle Period, Late Works, etc.)

---

## 3. Gallery Page - Era Piles Interaction

### 3.1 Hover Expansion
- [ ] When hovering over a gallery/era pile, artwork should "expand out" beautifully
- [ ] Give user a preview/better idea of what's in that period
- [ ] Artworks fan out or reveal themselves in an engaging way

### 3.2 Click Behavior
- [ ] Currently clicking on era piles does NOTHING
- [ ] **FIX**: Clicking should navigate to that era's curated gallery view

---

## 4. Landing/Home Page - Section Spacing Issues

### 4.1 Dead Space: 4% to 8%
- [ ] Large gap before "A Life in Art" section
- [ ] Reduce this dead space significantly

### 4.2 Gap: Early Explorations → Morning Light artwork
- [ ] Sizable unnecessary gap between these sections
- [ ] Tighten the spacing

### 4.3 Fade-Out Transitions (Image 4 issue)
- [ ] When scrolling away from sections, content fades out
- [ ] This leaves awkward "in-between" states
- [ ] **FIX**: Ensure transitions work smoothly even in transitionary scroll positions
- [ ] Consider crossfade or persistent elements during transitions

### 4.4 Gap: 45-50% through page
- [ ] Another large gap after horizontal gallery section
- [ ] Reduce dead space

### 4.5 Gap: Around "Four Decades" section
- [ ] Same spacing issue
- [ ] Tighten layout

---

## 5. "A Journey Through Color" Horizontal Gallery

### 5.1 Current Issue
- [ ] Beautiful section but scrolling requires vertical scroll to progress
- [ ] This removes the joy of browsing through the art

### 5.2 Required Changes
- [ ] Allow LEFT/RIGHT mouse movement to scroll through horizontally
- [ ] Add a scroll wheel/slider at the bottom for manual control
- [ ] User should be able to explore at their own pace
- [ ] Vertical scroll should only progress AFTER user has explored or chooses to move on

---

## 6. "Four Decades" Timeline Section

### 6.1 Current Issue
- [ ] Timeline only moves as you scroll past
- [ ] No interactive exploration

### 6.2 Required Changes
- [ ] Make timeline interactive - user can scrub left/right
- [ ] Show a different artwork from each year as you move through
- [ ] Allow exploration before page scroll moves on
- [ ] Consider showing year markers with artwork thumbnails

---

## 7. "In the Details" Spotlight Section

### 7.1 Current Issue
- [ ] When section opens/zooms in, it's already ready to close
- [ ] Not enough time to appreciate the detail

### 7.2 Required Changes
- [ ] Extend the "hold" time at full zoom
- [ ] Let user linger and appreciate the artwork details
- [ ] Only begin closing animation after user has had time to look

---

## 8. End of Landing Page - Completion Experience

### 8.1 Completion Feeling
- [ ] When reaching the end, should feel like completing a journey
- [ ] Clear transition into "the real website"

### 8.2 Landing Page Lock
- [ ] **MAJOR CHANGE**: User cannot access rest of site until scrolling through entire landing page
- [ ] Landing page is a gate/introduction to the experience
- [ ] Creates intentional, curated first impression

### 8.3 Exploration Choice Modal
- [ ] After completing landing page, present a choice:
- [ ] "How would you like to explore Leah's art?"
  - At your own pace (free browse)
  - Guided through ages (timeline)
  - By locations
  - By themes
  - Selected/curated works
- [ ] This empowers user to choose their journey

---

## 9. Progress Bar Enhancement

### 9.1 Current State
- [ ] Shows scroll progress through page (works well)

### 9.2 Enhancement
- [ ] Make progress bar REPRESENTATIVE of Leah's artistic periods
- [ ] As you scroll, you're moving through her life/career timeline
- [ ] Visual indication of which era you're currently viewing
- [ ] Could show year markers or era labels along the bar

---

## 10. Parallax Hero - Floating Artworks

### 10.1 Current Issue
- [ ] Artworks on splash screen are small and stay near their positions
- [ ] Lost the "wonderful animation" feeling

### 10.2 Required Changes
- [ ] Make floating artworks BIGGER
- [ ] Artworks should move slowly ALL OVER the screen
- [ ] Not just near where they start, but drifting across entire viewport
- [ ] Create feeling of art being "alive" and in motion
- [ ] Slow, dreamy, organic movement

---

## 11. Favorites Onboarding

### 11.1 New Feature
- [ ] Add small section at TOP of landing page
- [ ] Inform users they can favorite art
- [ ] Explain favorites go to their collection
- [ ] Brief, non-intrusive tooltip or hint

---

## 12. Settings Button Position

### 12.1 Placement
- [ ] Settings button should be top-right of screen
- [ ] Consistent with common UI patterns
- [ ] May be separate from nav bar or integrated

---

## Priority Order for Implementation

### Phase 1: Critical UX Fixes
1. Navigation bar centering and restructuring
2. Curated gallery button positioning (under artwork)
3. "Click for more" hover behavior
4. Era pile click → curated gallery navigation

### Phase 2: Landing Page Flow
5. Hide nav until after landing page
6. Reduce section spacing/dead space
7. Fix fade-out transitions
8. End-of-page completion experience
9. Exploration choice modal

### Phase 3: Interactive Sections
10. Horizontal gallery left/right scrolling
11. Interactive timeline scrubbing
12. Spotlight section timing

### Phase 4: Polish
13. Progress bar era representation
14. Floating artwork animation enhancement
15. Favorites onboarding hint
16. Settings button positioning
17. Random button icon change
18. "About" → "Leah's Story" rename

---

## Technical Notes

### Navigation Visibility Logic
```typescript
// Pseudocode
const [hasCompletedIntro, setHasCompletedIntro] = useState(false);

// In ScrollStoryPage, detect when user reaches end
useEffect(() => {
  if (scrollProgress >= 0.95) {
    setHasCompletedIntro(true);
  }
}, [scrollProgress]);

// Navigation only renders if hasCompletedIntro OR not on landing page
{(hasCompletedIntro || location.pathname !== '/') && <Navigation />}
```

### Era → Curated Gallery Routing
```typescript
// Gallery page era click
onClick={() => navigate(`/curated/${era.id}`)}

// CuratedGalleryPage receives era param
const { eraId } = useParams();
const artworks = filterByEra(eraId);
```

### Horizontal Section Scroll Lock
```typescript
// Lock vertical scroll while in horizontal section
// Capture wheel events and convert to horizontal movement
// Only release lock after user exits section or clicks "continue"
```

---

## Questions to Resolve

1. Should the progress bar show actual years (1963-2004) or era names?
2. For the exploration choice modal - should it remember user preference?
3. Should returning visitors skip the landing page intro?
4. How many artworks should fan out on era hover? All or a subset?

---

*Document created: 2026-02-11*
*Ready for implementation*
