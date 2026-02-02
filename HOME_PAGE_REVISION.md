# HOME PAGE REVISION - Critical Fixes Required

## Current Problems

The current implementation misses the core vision. Here's what's wrong:

### 1. **No Sense of Depth or Z-Space**
- Current: Artworks are flat, 2D positioned around the title like scattered cards
- Needed: Artworks should feel like they exist at DIFFERENT DEPTHS - some closer, some further away
- Use `perspective` and `translateZ` to create actual 3D space

### 2. **Animations Are Too Subtle/Non-existent**
- Current: Art pieces barely move, feels static and lifeless
- Needed: Constant, dreamy, slow drifting motion - like objects floating in zero gravity
- Each piece should move independently with different speeds and directions
- Subtle rotation changes over time
- The whole composition should feel ALIVE

### 3. **The Scroll Transition is Wrong**
- Current: Art just flies off to the sides when you scroll - feels like dismissing a popup
- Needed: You should feel like you're MOVING FORWARD through a gallery corridor
- The title should recede INTO the distance (scale down + translateZ backward)
- Art pieces should PASS BY you on the left and right like you're walking past paintings on walls
- Some art zooms PAST the camera (getting bigger then disappearing behind you)
- This should take 2-3 seconds and feel like physical movement

### 4. **No Gallery Corridor Walls**
- Current: Art just disappears to sides
- Needed: As you "enter," art should arrange onto invisible walls - left and right
- Think of it like walking into a long white hallway with paintings hung on both sides
- Art pieces rotate to face you as they settle onto "walls" (slight Y-axis rotation)

---

## Technical Implementation Guide

### Step 1: Set Up 3D Space

```tsx
// The container needs perspective for 3D to work
<div 
  style={{
    perspective: '1000px',
    perspectiveOrigin: '50% 50%',
    transformStyle: 'preserve-3d',
    position: 'fixed',
    inset: 0,
    overflow: 'hidden',
  }}
>
  {/* All artwork and title live in here */}
</div>
```

### Step 2: Position Artworks in Z-Space

```tsx
// Each artwork has a z-position (depth)
const artworks = [
  { id: 1, x: -30, y: -20, z: -200, color: '#B8A090' },  // Further back
  { id: 2, x: 40, y: 10, z: -100, color: '#A0B8C8' },    // Mid distance
  { id: 3, x: -20, y: 30, z: -50, color: '#C8B8A0' },    // Closer
  { id: 4, x: 50, y: -30, z: -300, color: '#90A8B8' },   // Way back
  // ... more artworks at various depths
];

// Render with translateZ for depth
<motion.div
  style={{
    position: 'absolute',
    left: `${50 + artwork.x}%`,
    top: `${50 + artwork.y}%`,
    transform: `translateZ(${artwork.z}px)`,
    transformStyle: 'preserve-3d',
  }}
>
```

### Step 3: Floating Animation (Always Running)

```tsx
// Each artwork floats independently
<motion.div
  animate={{
    x: [0, 15, -10, 5, 0],
    y: [0, -20, 10, -5, 0],
    rotateZ: [0, 3, -2, 1, 0],
    rotateX: [0, 2, -1, 0.5, 0],
    rotateY: [0, -2, 3, -1, 0],
  }}
  transition={{
    duration: 20 + Math.random() * 10, // 20-30 seconds per cycle
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
```

### Step 4: The Scroll/Enter Transition

This is the critical part. When user scrolls or clicks "Enter":

```tsx
// Track scroll progress (0 = home, 1 = fully entered)
const [progress, setProgress] = useState(0);

// On scroll, update progress
useEffect(() => {
  const handleWheel = (e: WheelEvent) => {
    if (e.deltaY > 0 && progress < 1) {
      setProgress(p => Math.min(1, p + 0.05));
    }
  };
  window.addEventListener('wheel', handleWheel);
  return () => window.removeEventListener('wheel', handleWheel);
}, [progress]);

// The entire scene moves TOWARD the camera
<motion.div
  style={{
    transform: `translateZ(${progress * 800}px)`, // Scene rushes toward you
    transformStyle: 'preserve-3d',
  }}
>
  {/* Title recedes */}
  <motion.h1
    style={{
      opacity: 1 - progress,
      transform: `scale(${1 - progress * 0.5})`, // Shrinks as you "pass" it
    }}
  >
    Leah Schwartz
  </motion.h1>
  
  {/* Artworks pass by */}
  {artworks.map(art => (
    <ArtworkPiece 
      key={art.id}
      artwork={art}
      progress={progress}
    />
  ))}
</motion.div>
```

### Step 5: Individual Artwork Behavior During Transition

```tsx
const ArtworkPiece = ({ artwork, progress }) => {
  // Determine if this artwork goes to left wall or right wall
  const goesLeft = artwork.x < 0;
  
  // Calculate position during transition
  const transitionX = goesLeft 
    ? artwork.x - (progress * 40)  // Slides further left
    : artwork.x + (progress * 40); // Slides further right
  
  // Rotate to face viewer (like hanging on a wall)
  const wallRotation = goesLeft ? 25 : -25; // Angled inward
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${50 + transitionX}%`,
        top: `${50 + artwork.y}%`,
        transform: `
          translateZ(${artwork.z}px)
          rotateY(${progress * wallRotation}deg)
        `,
        // Artworks that were "behind" the title come forward during transition
        // Artworks "in front" zoom past and fade out
        opacity: artwork.z > -100 ? 1 - progress : 1,
        scale: artwork.z > -100 ? 1 + progress * 2 : 1, // Close ones zoom past
      }}
    >
      {/* Artwork rectangle */}
    </motion.div>
  );
};
```

### Step 6: Add Motion Blur Feel

```css
/* During transition, add slight blur to enhance speed feeling */
.transitioning .artwork {
  filter: blur(calc(var(--speed) * 2px));
}
```

### Step 7: Sound (Optional but Recommended)

```tsx
// Soft whoosh sound as you enter
const whooshSound = useRef(new Audio('/sounds/soft-whoosh.mp3'));

useEffect(() => {
  if (progress > 0.1 && progress < 0.2) {
    whooshSound.current.play();
  }
}, [progress]);
```

---

## Visual Reference: What It Should Feel Like

**Frame 1 (progress = 0):**
```
                    [art far back]
        [art]                         [art]
              
                  LEAH SCHWARTZ
                    1945-2004
                              [art]
    [art]       [Enter Archive]
                                        [art]
              [art]      [art]
```
All art floating gently, different depths visible via size/blur

**Frame 2 (progress = 0.5):**
```
  [art]                                   [art]
    \\                                     //
     \\    (title fading, shrinking)     //
      \\                                //
       \\  [art zooming past camera]  //
        \\                            //
    [art] \\                        // [art]
           \\                      //
```
You're moving forward, art sliding to walls, close art zooming past

**Frame 3 (progress = 1):**
```
  |                                         |
  | [art]                             [art] |
  |    \\                             //    |
  |     [art]                     [art]     |
  |        \\                     //        |
  |         \\                   //         |
  |          \\                 //          |
  |           \\               //           |
  |            \\   (you)     //            |
  |             \\           //             |
```
You're now IN the corridor, art on walls receding into distance

---

## Specific Code Changes Needed

1. **Add `perspective` to the main container** - without this, translateZ does nothing

2. **Give each artwork a `z` position** - varying from -50 (close) to -400 (far)

3. **Create continuous floating animation** - slow, dreamy, 20-30 second loops

4. **Rebuild the scroll transition** to move the CAMERA forward, not push art away

5. **Add wall-mounting rotation** during transition (rotateY based on left/right)

6. **Fade/scale close artworks** as they "pass" the camera

7. **Ease the transition** - use `cubic-bezier(0.4, 0, 0.2, 1)` for smooth deceleration

---

## Test Criteria

The home page is correct when:

- [ ] Standing still, art visibly floats/drifts at different speeds
- [ ] You can perceive DEPTH - some art clearly closer, some further
- [ ] Scrolling feels like moving FORWARD, not sideways
- [ ] The title shrinks into the distance as you move past it
- [ ] Art pieces rotate slightly to "hang on walls" as you enter
- [ ] At least 2-3 pieces should zoom PAST the camera (get big, then vanish)
- [ ] The whole transition takes 2-3 seconds minimum
- [ ] At the end, you feel like you're IN a corridor, not just on a new page

---

## Reference

Look at these for inspiration:
- Apple's spatial interfaces (visionOS)
- Three.js camera dolly examples
- CSS 3D perspective tutorials
- The opening of any Pixar movie where the camera flies through a space

The key insight: **You're not moving the art. You're moving the camera through a space where art exists.**
