import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useMemo } from 'react';
import type { Artwork } from '../../types';

interface ParallaxHeroProps {
  artworks: Artwork[];
  title?: string;
  subtitle?: string;
  years?: string;
}

interface SweepingArtwork {
  artwork: Artwork;
  // Starting position (off-screen left or scattered)
  startX: number;
  // Ending position (off-screen right or passed by)
  endX: number;
  // Y position (stays relatively constant for horizontal sweep feel)
  yPosition: number;
  // Size of the artwork
  size: number;
  // Slight rotation for visual interest
  rotation: number;
  // Z-depth for parallax (affects speed of sweep)
  depth: number;
  // Stagger delay for entrance
  delay: number;
}

function ParallaxHero({
  artworks,
  title = 'Leah Schwartz',
  subtitle = 'Artist',
  years = '1945 – 2004',
}: ParallaxHeroProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Smooth scroll progress for buttery animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 25,
  });

  // Title transforms - title fades and recedes as you scroll
  const titleY = useTransform(smoothProgress, [0, 0.5], [0, -150]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.25], [1, 0]);
  const titleScale = useTransform(smoothProgress, [0, 0.4], [1, 0.85]);

  // Generate sweeping artwork positions - horizontal sweep from left to right
  const sweepingArtworks = useMemo((): SweepingArtwork[] => {
    const positions: SweepingArtwork[] = [];
    const selected = artworks.slice(0, 12);

    // Create a layered arrangement with different depths
    // Artworks sweep from left to right at different speeds based on depth
    const arrangements = [
      // Back layer (slower movement, smaller, higher up)
      { startX: -30, endX: 130, y: 15, size: 160, rot: -2, depth: 0.3, delay: 0 },
      { startX: -20, endX: 120, y: 75, size: 150, rot: 3, depth: 0.35, delay: 0.1 },
      { startX: -40, endX: 140, y: 45, size: 140, rot: -1, depth: 0.25, delay: 0.15 },

      // Middle layer (medium movement)
      { startX: -25, endX: 125, y: 25, size: 200, rot: -3, depth: 0.5, delay: 0.05 },
      { startX: -35, endX: 135, y: 60, size: 190, rot: 2, depth: 0.55, delay: 0.12 },
      { startX: -15, endX: 115, y: 85, size: 180, rot: -2, depth: 0.45, delay: 0.08 },

      // Front layer (faster movement, larger, more prominent)
      { startX: -20, endX: 120, y: 35, size: 260, rot: -4, depth: 0.75, delay: 0.02 },
      { startX: -30, endX: 130, y: 70, size: 250, rot: 3, depth: 0.8, delay: 0.07 },
      { startX: -25, endX: 125, y: 20, size: 240, rot: -2, depth: 0.7, delay: 0.18 },

      // Foreground accents (fastest, largest)
      { startX: -15, endX: 115, y: 50, size: 300, rot: 2, depth: 0.95, delay: 0.03 },
      { startX: -35, endX: 135, y: 80, size: 280, rot: -3, depth: 0.9, delay: 0.13 },
      { startX: -25, endX: 125, y: 10, size: 270, rot: 1, depth: 0.85, delay: 0.09 },
    ];

    selected.forEach((artwork, i) => {
      const arr = arrangements[i % arrangements.length];
      positions.push({
        artwork,
        startX: arr.startX,
        endX: arr.endX,
        yPosition: arr.y,
        size: arr.size,
        rotation: arr.rot,
        depth: arr.depth,
        delay: arr.delay,
      });
    });

    return positions;
  }, [artworks]);

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh] overflow-hidden"
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] via-[#F5F3F0] to-[#FAFAFA]" />

        {/* Sweeping artworks - horizontal movement tied to scroll */}
        {sweepingArtworks.map((item) => {
          // X position sweeps from left to right based on scroll and depth
          // Higher depth = faster movement (closer to viewer)
          const itemX = useTransform(
            smoothProgress,
            [0, 1],
            [`${item.startX}%`, `${item.endX}%`]
          );

          // Subtle vertical parallax for depth
          const itemY = useTransform(
            smoothProgress,
            [0, 1],
            [0, -80 * item.depth]
          );

          // Opacity: fade in, stay visible, then fade out
          const itemOpacity = useTransform(
            smoothProgress,
            [0, 0.1, 0.7, 0.9],
            [0.4, 0.7, 0.6, 0.2]
          );

          // Slight scale change for depth feel
          const itemScale = useTransform(
            smoothProgress,
            [0, 0.5, 1],
            [0.95, 1, 1.05 + item.depth * 0.1]
          );

          return (
            <motion.div
              key={item.artwork.id}
              className="absolute pointer-events-none"
              style={{
                left: itemX,
                top: `${item.yPosition}%`,
                width: item.size,
                height: item.size * (item.artwork.aspectRatio === 'portrait' ? 1.4 : item.artwork.aspectRatio === 'landscape' ? 0.7 : 1),
                y: itemY,
                opacity: itemOpacity,
                scale: itemScale,
                rotate: item.rotation,
                // Transform origin for natural movement
                transformOrigin: 'center center',
              }}
              initial={{
                opacity: 0,
                x: '-50%',
              }}
              animate={{
                opacity: 0.6,
                x: '-50%',
              }}
              transition={{
                opacity: { duration: 1.2, delay: item.delay, ease: [0.4, 0, 0.2, 1] },
              }}
            >
              <div
                className="w-full h-full rounded-xl"
                style={{
                  backgroundColor: item.artwork.placeholderColor,
                  boxShadow: `0 ${20 + item.depth * 30}px ${60 + item.depth * 40}px rgba(0,0,0,${0.1 + item.depth * 0.1})`,
                }}
              />
            </motion.div>
          );
        })}

        {/* Central title */}
        <motion.div
          className="relative z-10 text-center px-6"
          style={{
            y: titleY,
            opacity: titleOpacity,
            scale: titleScale,
          }}
        >
          {/* Subtle glow behind text */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(250,250,250,0.98) 0%, transparent 60%)',
              transform: 'scale(2.5)',
            }}
          />

          <motion.h1
            className="font-heading text-[clamp(48px,12vw,180px)] text-text-primary leading-[0.9] tracking-tight"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {title}
          </motion.h1>

          <motion.p
            className="font-heading text-[clamp(18px,3vw,32px)] text-text-secondary italic mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {subtitle}
          </motion.p>

          <motion.p
            className="font-body text-text-muted text-lg tracking-[0.3em] mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {years}
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-text-muted/30 rounded-full mx-auto relative"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1.5 h-1.5 bg-text-muted rounded-full absolute left-1/2 -translate-x-1/2 top-2"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
            <p className="font-body text-text-muted/50 text-xs mt-3 tracking-wider">
              SCROLL TO EXPLORE
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default ParallaxHero;
