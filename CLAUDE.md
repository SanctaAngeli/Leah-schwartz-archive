# CLAUDE.md - Leah Schwartz Digital Archive

## Project Context

This is a digital museum/archive website for artist Leah Schwartz (1945–2004). The site should feel like walking through a premium gallery—Apple-level design quality with glassmorphism UI, organic animations, and the art as the hero.

**Read `/docs/PLAN.md` before starting any work.** It contains the full vision, architecture, and phase breakdown.

---

## Critical Design Rules

### Visual Identity

1. **Gallery white backgrounds** (`#FAFAFA`) — no paper textures, no competing patterns
2. **The art brings the texture** — UI stays pristine, artwork is the visual richness
3. **Glassmorphism everywhere** — frosted glass cards, soft shadows, floating feel
4. **Pill shapes** — buttons and containers use `border-radius: 9999px` or `24px`
5. **EB Garamond** for headings, **Inter** for UI text

### Animation Philosophy

1. **Everything breathes** — subtle movement, nothing static
2. **Organic, not mechanical** — use `cubic-bezier(0.4, 0, 0.2, 1)` as default easing
3. **Smooth bezier curves** — avoid linear timing
4. **Tactile feedback** — hover states, click responses, audio cues
5. **Performance first** — use `transform` and `opacity`, avoid layout thrashing

### Component Patterns

1. **Placeholder artworks** — Use colored rectangles (`bg-[#8B7355]` etc.) until real art arrives
2. **No hardcoded image paths** — All paths come from data files
3. **Aspect ratio variety** — Mix portrait, landscape, square placeholders
4. **Hover scales** — Artworks should scale up ~5% on hover with smooth transition

---

## Code Standards

### TypeScript

- Strict mode enabled
- Explicit return types on functions
- Interface over type when possible
- No `any` without comment explaining why

### React

- Functional components only
- Custom hooks for reusable logic
- Framer Motion for animations
- Keep components small (<150 lines ideal)

### Styling

- Tailwind for utility classes
- Custom CSS only for complex animations
- CSS variables for design tokens (see PLAN.md)
- Mobile-first responsive design

### File Naming

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- Data: `kebab-case.json`

---

## Folder Conventions

```
src/
├── components/
│   ├── ui/           # Reusable primitives (GlassCard, PillButton)
│   ├── layout/       # Navigation, PageTransition
│   ├── [feature]/    # Feature-specific (home/, timeline/, etc.)
├── data/             # JSON data files
├── hooks/            # Custom React hooks
├── styles/           # Global CSS, animations
├── utils/            # Helper functions
```

---

## Data Management

### Artwork Data Structure

All artwork metadata lives in `src/data/artworks.json`. When adding artworks:

```typescript
{
  "id": "unique-slug",
  "title": "Artwork Title",
  "year": 1967,              // or null if undated
  "circa": false,            // true if year is approximate
  "medium": "Oil on canvas",
  "dimensions": "24 × 30 in",
  "location": "Mount Tam",
  "collection": "Estate Collection",
  "themes": ["landscapes", "watercolors"],
  "imagePath": "/artworks/full/artwork-slug.jpg",
  "thumbPath": "/artworks/thumb/artwork-slug.jpg"
}
```

### Placeholder Strategy

Until real art arrives, generate placeholder data programmatically:
- 60+ artworks spanning 1945–2004
- Distribute across all 9 locations
- Distribute across all 9 themes
- Use muted earth-tone colors for rectangles

---

## Animation Guidelines

### Entrance Animations

```typescript
// Fade up on mount
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
```

### Hover States

```typescript
// Artwork hover
whileHover={{ scale: 1.05 }}
transition={{ type: "spring", stiffness: 300, damping: 20 }}
```

### Page Transitions

```typescript
// Exit animation
exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.3 }}
```

### The Z-Axis Entrance

This is the signature animation. Key requirements:
- Triggered by scroll/swipe
- Background artworks move toward camera
- Text recedes into distance
- Artworks flip to side walls as you pass
- Smooth 2-3 second duration
- Must feel like physical movement through space

---

## Performance Rules

1. **Lazy load images** — Use intersection observer
2. **Virtualize long lists** — If showing 50+ artworks
3. **Debounce scroll handlers** — Especially on timeline
4. **Use `will-change` sparingly** — Only on actively animating elements
5. **Preload critical images** — Hero artworks on landing

---

## Accessibility Requirements

1. **Keyboard navigation** — All interactive elements focusable
2. **ARIA labels** — On buttons, images, interactive regions
3. **Focus indicators** — Visible focus rings (can be styled)
4. **Reduced motion** — Respect `prefers-reduced-motion`
5. **Color contrast** — WCAG AA minimum on all text

---

## Git Workflow

### Branches

- `main` — Production-ready code only
- `develop` — Integration branch
- `feature/*` — New features
- `fix/*` — Bug fixes

### Commit Messages

```
feat: add timeline carousel component
fix: resolve hover state on mobile
style: update glassmorphism tokens
refactor: extract useCarousel hook
docs: update PLAN with location list
```

### Worktrees (Recommended)

For parallel development, use git worktrees:

```bash
git worktree add ../leah-home feature/home-entrance
git worktree add ../leah-timeline feature/timeline
git worktree add ../leah-ui feature/ui-components
```

---

## Common Patterns

### Glassmorphism Card

```tsx
<motion.div
  className="
    bg-white/70 backdrop-blur-xl
    border border-white/30
    rounded-3xl
    shadow-[0_8px_32px_rgba(0,0,0,0.08)]
    p-6
  "
  whileHover={{ y: -4 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  {children}
</motion.div>
```

### Placeholder Artwork

```tsx
const PlaceholderArtwork = ({ color, aspectRatio = "square" }) => {
  const ratioClasses = {
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    square: "aspect-square",
  };
  
  return (
    <div 
      className={`${ratioClasses[aspectRatio]} rounded-lg`}
      style={{ backgroundColor: color }}
    />
  );
};
```

### Smooth Scroll Snap

```tsx
<div className="flex overflow-x-auto snap-x snap-mandatory">
  {items.map(item => (
    <div key={item.id} className="snap-center flex-shrink-0">
      {/* content */}
    </div>
  ))}
</div>
```

---

## Troubleshooting

### Animation Jank

- Check for layout recalculations (use DevTools Performance tab)
- Move to `transform` instead of `top/left`
- Add `will-change: transform` before animation starts

### Glassmorphism Not Working

- `backdrop-filter` needs a background that's not fully opaque
- Check browser support (Safari needs `-webkit-backdrop-filter`)
- Ensure parent doesn't have `overflow: hidden` in some cases

### Images Not Loading

- Check paths are relative to `public/` folder
- Verify file extensions match exactly (case-sensitive on Linux)
- Check network tab for 404s

---

## Questions? Ask Harry

If unclear on:
- Design direction or aesthetic choices
- Priority of features
- Content/metadata questions
- Anything about Leah or her work

Don't guess—ask first, then build.

---

## Quick Reference

| What | Where |
|------|-------|
| Full project plan | `/docs/PLAN.md` |
| Design reference images | `/docs/reference-images/` |
| Claude Code best practices | `/docs/CLAUDE_CODE_BEST_PRACTICES.md` |
| Bash commands cheatsheet | `/docs/BASH_COMMANDS.md` |
| Artwork data | `/src/data/artworks.json` |
| Global styles | `/src/styles/globals.css` |
| Animation helpers | `/src/styles/animations.css` |

---

## Session Startup

This project is designed to be run with:

```bash
claude --dangerously-skip-permissions
```

This skips confirmation prompts for file edits, npm installs, etc. The codebase is trusted.

See `/docs/BASH_COMMANDS.md` for full workflow commands including worktree setup.

---

*Last updated: February 2026*
