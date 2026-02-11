import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import type { Artwork } from '../../types';

interface SpotlightArea {
  x: number; // percentage 0-100
  y: number;
  label?: string;
}

interface ArtworkSpotlightProps {
  artwork: Artwork;
  spotlights?: SpotlightArea[];
  title?: string;
  description?: string;
}

function ArtworkSpotlight({
  artwork,
  spotlights = [{ x: 50, y: 50, label: 'Detail' }],
  title,
  description,
}: ArtworkSpotlightProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
  });

  // Zoom effect - scales from 1 to 2.5, holds at peak longer, then returns
  // Holds at full zoom from 0.35 to 0.65 (30% of scroll duration)
  const scale = useTransform(smoothProgress, [0.15, 0.35, 0.65, 0.85], [1, 2.5, 2.5, 1]);

  // Dynamic pan based on first spotlight - also holds position during zoom
  const firstSpotlight = spotlights[0] || { x: 50, y: 50 };
  const panX = useTransform(smoothProgress, [0.15, 0.35, 0.65, 0.85], [0, -(firstSpotlight.x - 50) * 2, -(firstSpotlight.x - 50) * 2, 0]);
  const panY = useTransform(smoothProgress, [0.15, 0.35, 0.65, 0.85], [0, -(firstSpotlight.y - 50) * 2, -(firstSpotlight.y - 50) * 2, 0]);

  // Opacity for content - visible throughout zoom
  const contentOpacity = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Vignette intensity - holds during zoom
  const vignetteOpacity = useTransform(smoothProgress, [0.15, 0.35, 0.65, 0.85], [0, 0.6, 0.6, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[300vh]"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {/* Background artwork with zoom */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            scale,
          }}
        >
          <motion.div
            className="w-full h-full max-w-4xl max-h-[80vh]"
            style={{
              x: panX,
              y: panY,
            }}
          >
            <div
              className={`w-full h-full rounded-2xl ${
                artwork.aspectRatio === 'portrait'
                  ? 'aspect-[3/4]'
                  : artwork.aspectRatio === 'landscape'
                    ? 'aspect-[4/3]'
                    : 'aspect-square'
              }`}
              style={{
                backgroundColor: artwork.placeholderColor,
                margin: 'auto',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Vignette overlay during zoom */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: vignetteOpacity,
            background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
          }}
        />

        {/* Content overlay */}
        <motion.div
          className="relative z-10 max-w-2xl mx-auto px-6 text-center"
          style={{ opacity: contentOpacity }}
        >
          {title && (
            <motion.h2
              className="font-heading text-[clamp(28px,5vw,48px)] text-white mb-4 drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {title}
            </motion.h2>
          )}

          {description && (
            <motion.p
              className="font-body text-white/90 text-lg leading-relaxed drop-shadow-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        {/* Spotlight indicators */}
        {spotlights.map((spotlight, index) => {
          // Spotlight indicators appear during the extended zoom hold period
          const spotlightOpacity = useTransform(
            smoothProgress,
            [0.3 + index * 0.05, 0.4 + index * 0.05, 0.7 - index * 0.05, 0.8 - index * 0.05],
            [0, 1, 1, 0]
          );

          return (
            <motion.div
              key={index}
              className="absolute z-20 pointer-events-none"
              style={{
                left: `${spotlight.x}%`,
                top: `${spotlight.y}%`,
                opacity: spotlightOpacity,
              }}
            >
              {/* Pulsing ring */}
              <motion.div
                className="absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/50 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Center dot */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />

              {/* Label */}
              {spotlight.label && (
                <div className="absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap">
                  <span className="glass-pill px-4 py-2 text-sm font-body text-text-primary">
                    {spotlight.label}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{
            opacity: useTransform(smoothProgress, [0, 0.1, 0.9, 1], [1, 0, 0, 1]),
          }}
        >
          <p className="font-body text-white/60 text-sm">
            Scroll to explore details
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default ArtworkSpotlight;
