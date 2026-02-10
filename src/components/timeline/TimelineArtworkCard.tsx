import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { Artwork } from '../../types';

type CardPosition = 'distant-left' | 'far-left' | 'left' | 'center' | 'right' | 'far-right' | 'distant-right';

interface TimelineArtworkCardProps {
  artwork: Artwork;
  year: number;
  position: CardPosition;
  onClick?: () => void;
  onHover?: (isHovered: boolean) => void;
}

const positionStyles: Record<CardPosition, {
  scale: number;
  opacity: number;
  x: number;
  y: number;
  rotateY: number;
  zIndex: number;
}> = {
  'distant-left': {
    scale: 0.4,
    opacity: 0.2,
    x: -320,
    y: 30,
    rotateY: 25,
    zIndex: 1,
  },
  'far-left': {
    scale: 0.6,
    opacity: 0.4,
    x: -200,
    y: 20,
    rotateY: 15,
    zIndex: 2,
  },
  'left': {
    scale: 0.8,
    opacity: 0.7,
    x: -100,
    y: 10,
    rotateY: 8,
    zIndex: 3,
  },
  'center': {
    scale: 1,
    opacity: 1,
    x: 0,
    y: -20, // The "peak" effect - rises up
    rotateY: 0,
    zIndex: 10,
  },
  'right': {
    scale: 0.8,
    opacity: 0.7,
    x: 100,
    y: 10,
    rotateY: -8,
    zIndex: 3,
  },
  'far-right': {
    scale: 0.6,
    opacity: 0.4,
    x: 200,
    y: 20,
    rotateY: -15,
    zIndex: 2,
  },
  'distant-right': {
    scale: 0.4,
    opacity: 0.2,
    x: 320,
    y: 30,
    rotateY: -25,
    zIndex: 1,
  },
};

function TimelineArtworkCard({
  artwork,
  year,
  position,
  onClick,
  onHover,
}: TimelineArtworkCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const isCurrent = position === 'center';
  const styles = positionStyles[position];

  const handleMouseEnter = (): void => {
    setIsHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = (): void => {
    setIsHovered(false);
    onHover?.(false);
  };

  const aspectClasses = {
    portrait: 'w-40 h-52',
    landscape: 'w-52 h-40',
    square: 'w-44 h-44',
  };

  return (
    <motion.div
      className="absolute flex flex-col items-center cursor-pointer"
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1200,
        zIndex: styles.zIndex,
      }}
      initial={false}
      animate={{
        scale: styles.scale,
        opacity: styles.opacity,
        x: styles.x,
        y: styles.y,
        rotateY: styles.rotateY,
      }}
      whileHover={isCurrent ? { scale: 1.05, y: -28 } : { opacity: Math.min(styles.opacity + 0.2, 1) }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 28,
        mass: 0.8,
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={isCurrent ? 0 : -1}
      aria-label={`${artwork.title}, ${year}`}
    >
      {/* Artwork container */}
      <div
        className={`
          ${aspectClasses[artwork.aspectRatio]}
          relative rounded-xl overflow-hidden
          ${isCurrent
            ? 'shadow-[0_16px_48px_rgba(0,0,0,0.2),0_6px_16px_rgba(0,0,0,0.15)]'
            : 'shadow-[0_8px_24px_rgba(0,0,0,0.1)]'
          }
          transition-shadow duration-300
        `}
      >
        {/* Placeholder artwork */}
        <div
          className="w-full h-full"
          style={{ backgroundColor: artwork.placeholderColor }}
        />

        {/* Subtle frame effect */}
        <div
          className={`
            absolute inset-0 rounded-xl
            ${isCurrent
              ? 'ring-2 ring-white/60 ring-offset-0'
              : 'ring-1 ring-white/30'
            }
            pointer-events-none
          `}
        />

        {/* Inner shadow for depth */}
        <div
          className="
            absolute inset-0 rounded-xl
            shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),inset_0_-1px_2px_rgba(0,0,0,0.1)]
            pointer-events-none
          "
        />

        {/* Frosted glass info card on hover (only for current item) */}
        <AnimatePresence>
          {isCurrent && isHovered && (
            <motion.div
              className="
                absolute inset-x-0 bottom-0
                bg-white/80 backdrop-blur-xl
                border-t border-white/40
                p-4
              "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <h3 className="font-heading text-sm text-text-primary truncate">
                {artwork.title}
              </h3>
              <p className="font-body text-xs text-text-muted mt-0.5">
                {artwork.medium}
              </p>
              {artwork.dimensions && (
                <p className="font-body text-xs text-text-muted">
                  {artwork.dimensions}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Year label */}
      <motion.span
        className={`
          mt-4 font-heading text-xl
          transition-colors duration-300
          ${isCurrent ? 'text-text-primary' : 'text-text-muted/60'}
        `}
        animate={{
          opacity: isCurrent ? 1 : 0.6,
          scale: isCurrent ? 1 : 0.9,
        }}
        transition={{ duration: 0.3 }}
      >
        {year}
      </motion.span>
    </motion.div>
  );
}

export default TimelineArtworkCard;
