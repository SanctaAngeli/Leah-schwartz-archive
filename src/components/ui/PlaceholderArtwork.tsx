import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';

interface PlaceholderArtworkProps {
  color: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  className?: string;
  onClick?: () => void;
  enableKenBurns?: boolean;
  title?: string;
  showOverlay?: boolean;
}

// Generate a subtle gradient overlay
function generateGradient(): string {
  // Create a subtle vignette effect
  return `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%)`;
}

// Generate Ken Burns animation parameters
function generateKenBurnsParams(): {
  scale: [number, number];
  x: [string, string];
  y: [string, string];
} {
  const directions: Array<{
    scale: [number, number];
    x: [string, string];
    y: [string, string];
  }> = [
    { scale: [1, 1.15], x: ['0%', '3%'], y: ['0%', '2%'] },
    { scale: [1.1, 1], x: ['2%', '0%'], y: ['1%', '0%'] },
    { scale: [1, 1.12], x: ['0%', '-2%'], y: ['0%', '3%'] },
    { scale: [1.08, 1], x: ['-1%', '0%'], y: ['2%', '0%'] },
  ];
  return directions[Math.floor(Math.random() * directions.length)];
}

function PlaceholderArtwork({
  color,
  aspectRatio = 'square',
  className = '',
  onClick,
  enableKenBurns = true,
  title,
  showOverlay = false,
}: PlaceholderArtworkProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const ratioClasses = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    square: 'aspect-square',
  };

  // Memoize Ken Burns params so they don't change on re-render
  const kenBurnsParams = useMemo(() => generateKenBurnsParams(), []);

  const shouldAnimate = enableKenBurns && !prefersReducedMotion;

  return (
    <motion.div
      className={`${ratioClasses[aspectRatio]} rounded-lg cursor-pointer overflow-hidden relative group ${className}`}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      aria-label={title}
    >
      {/* Base color layer with Ken Burns animation */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: color }}
        animate={shouldAnimate ? {
          scale: kenBurnsParams.scale,
          x: kenBurnsParams.x,
          y: kenBurnsParams.y,
        } : undefined}
        transition={shouldAnimate ? {
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        } : undefined}
      />

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: generateGradient() }}
      />

      {/* Hover overlay with title */}
      {(showOverlay || title) && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent
            flex items-end justify-center pb-4 px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {title && (
            <p className="font-heading text-white text-sm text-center line-clamp-2 drop-shadow-lg">
              {title}
            </p>
          )}
        </motion.div>
      )}

      {/* Focus ring for accessibility */}
      <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-focus-visible:ring-text-primary/50 pointer-events-none" />
    </motion.div>
  );
}

export default PlaceholderArtwork;
