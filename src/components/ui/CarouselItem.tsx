import { motion, Variants } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';

type CarouselPosition = 'prev' | 'current' | 'next' | 'distant';

interface CarouselItemProps {
  children: ReactNode;
  position?: CarouselPosition;
  year?: number;
  onClick?: () => void;
  className?: string;
  showLabel?: boolean;
}

const positionVariants: Variants = {
  distant: {
    scale: 0.7,
    opacity: 0.3,
    y: 20,
    rotateY: 0,
  },
  prev: {
    scale: 0.85,
    opacity: 0.6,
    y: 10,
    rotateY: 5,
  },
  current: {
    scale: 1,
    opacity: 1,
    y: -10,
    rotateY: 0,
  },
  next: {
    scale: 0.85,
    opacity: 0.6,
    y: 10,
    rotateY: -5,
  },
};

const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  (
    {
      children,
      position = 'current',
      year,
      onClick,
      className = '',
      showLabel = true,
    },
    ref
  ): JSX.Element => {
    const isCurrent = position === 'current';

    return (
      <motion.div
        ref={ref}
        className={`
          relative flex flex-col items-center
          cursor-pointer select-none
          ${className}
        `}
        variants={positionVariants}
        initial={position}
        animate={position}
        whileHover={isCurrent ? { scale: 1.02, y: -14 } : { opacity: 0.8 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          mass: 0.8,
        }}
        onClick={onClick}
        style={{ perspective: 1000 }}
      >
        {/* Artwork container with glassmorphism frame */}
        <div
          className={`
            relative overflow-hidden rounded-2xl
            ${isCurrent
              ? 'shadow-[0_12px_40px_rgba(0,0,0,0.15),0_4px_12px_rgba(0,0,0,0.1)]'
              : 'shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
            }
            transition-shadow duration-300
          `}
        >
          {/* Inner glow effect for current item */}
          {isCurrent && (
            <div
              className="
                absolute inset-0 rounded-2xl
                ring-2 ring-white/50
                pointer-events-none
              "
            />
          )}
          {children}
        </div>

        {/* Year label */}
        {showLabel && year && (
          <motion.span
            className={`
              mt-3 font-heading text-lg
              transition-colors duration-300
              ${isCurrent ? 'text-text-primary' : 'text-text-muted'}
            `}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {year}
          </motion.span>
        )}

        {/* Focus indicator for accessibility */}
        <span
          className="
            absolute inset-0 rounded-2xl
            ring-0 ring-text-primary/0
            focus-visible:ring-2 focus-visible:ring-text-primary/50
            pointer-events-none
            transition-all duration-200
          "
          aria-hidden="true"
        />
      </motion.div>
    );
  }
);

CarouselItem.displayName = 'CarouselItem';

export { CarouselItem };
export type { CarouselItemProps, CarouselPosition };
