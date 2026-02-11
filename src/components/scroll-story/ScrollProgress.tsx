import { motion, useScroll, useSpring, useTransform, MotionValue } from 'framer-motion';
import { useState, useEffect } from 'react';

// Era definitions for the progress bar
// Note: These percentages are adjusted to account for the hero section
// The actual content starts after ~10% of the page (after the ParallaxHero)
const ERAS = [
  { id: 'early', label: 'Early Explorations', years: '1963-1974', color: '#8B7355', startPercent: 0.12, endPercent: 0.35 },
  { id: 'middle', label: 'San Francisco Years', years: '1975-1989', color: '#6B8E9F', startPercent: 0.35, endPercent: 0.65 },
  { id: 'late', label: 'Late Reflections', years: '1990-2004', color: '#9B8B7A', startPercent: 0.65, endPercent: 1 },
];

// Minimum scroll progress before the timeline appears (after hero intro)
const SHOW_THRESHOLD = 0.08;

function ScrollProgress(): JSX.Element {
  const { scrollYProgress } = useScroll();
  const [currentEra, setCurrentEra] = useState(ERAS[0]);
  const [isVisible, setIsVisible] = useState(false);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Track current era based on scroll progress
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (value) => {
      // Only show after scrolling past the hero intro
      setIsVisible(value >= SHOW_THRESHOLD);

      // Find current era
      const era = ERAS.find(e => value >= e.startPercent && value < e.endPercent) || ERAS[ERAS.length - 1];
      setCurrentEra(era);
    });
    return unsubscribe;
  }, [smoothProgress]);

  // Normalized progress for the bar (0 at SHOW_THRESHOLD, 1 at end)
  const normalizedProgress = useTransform(
    smoothProgress,
    [SHOW_THRESHOLD, 1],
    [0, 1]
  );

  // Progress bar width
  const width = useTransform(normalizedProgress, [0, 1], ['0%', '100%']);

  // Calculate which era segment to highlight - returns number for opacity
  const getSegmentOpacity = (era: typeof ERAS[0]): MotionValue<number> => {
    return useTransform(smoothProgress, (v): number => {
      if (v >= era.startPercent && v < era.endPercent) return 1;
      return 0.3;
    });
  };

  // Calculate segment width relative to displayed portion
  const getSegmentWidth = (era: typeof ERAS[0]): string => {
    const displayRange = 1 - SHOW_THRESHOLD;
    const segmentStart = Math.max(era.startPercent - SHOW_THRESHOLD, 0);
    const segmentEnd = era.endPercent - SHOW_THRESHOLD;
    const segmentWidth = (segmentEnd - segmentStart) / displayRange * 100;
    return `${Math.max(0, segmentWidth)}%`;
  };

  return (
    <>
      {/* Bottom progress bar with era segments - only visible after scrolling past intro */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[100]"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 20,
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Current era label - positioned above the bar */}
        <div className="flex justify-center mb-2">
          <motion.div
            className="glass-pill px-4 py-1.5 flex items-center gap-2"
            key={currentEra.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentEra.color }}
            />
            <span className="font-body text-xs text-text-primary whitespace-nowrap">
              {currentEra.label}
            </span>
            <span className="font-body text-xs text-text-muted">
              {currentEra.years}
            </span>
          </motion.div>
        </div>

        {/* Era segments background */}
        <div className="relative h-1.5 flex bg-black/5">
          {ERAS.map((era) => (
            <motion.div
              key={era.id}
              className="h-full relative"
              style={{
                width: getSegmentWidth(era),
                backgroundColor: era.color,
                opacity: getSegmentOpacity(era),
              }}
            />
          ))}
        </div>

        {/* Progress indicator line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1.5 bg-white/80"
          style={{ width }}
        >
          {/* Glowing tip */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              backgroundColor: currentEra.color,
              boxShadow: `0 0 10px ${currentEra.color}, 0 0 20px ${currentEra.color}`,
            }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}

// Floating "Back to top" button that appears after scrolling
export function BackToTop(): JSX.Element {
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.1], [20, 0]);

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.button
      className="fixed bottom-6 right-6 z-50 glass-pill w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      style={{ opacity, y }}
      onClick={scrollToTop}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Back to top"
    >
      <svg
        className="w-5 h-5 text-text-primary"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </motion.button>
  );
}

export default ScrollProgress;
