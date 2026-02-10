import { motion } from 'framer-motion';

interface DecadeMarkerProps {
  decades: number[];
  currentDecade: number;
  onDecadeClick: (decade: number) => void;
}

function DecadeMarker({
  decades,
  currentDecade,
  onDecadeClick,
}: DecadeMarkerProps): JSX.Element {
  return (
    <div className="flex items-center justify-center gap-2">
      {decades.map((decade) => {
        const isCurrent = decade === currentDecade;

        return (
          <motion.button
            key={decade}
            className={`
              relative px-4 py-2 rounded-full
              font-body text-sm
              transition-colors duration-300
              focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/50
              ${isCurrent
                ? 'text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
              }
            `}
            onClick={() => onDecadeClick(decade)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Go to ${decade}s`}
            aria-pressed={isCurrent}
          >
            {/* Background pill for current decade */}
            {isCurrent && (
              <motion.div
                className="
                  absolute inset-0 rounded-full
                  bg-white/80 backdrop-blur-lg
                  border border-white/40
                  shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.5)]
                "
                layoutId="decadeIndicator"
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}

            {/* Decade label */}
            <span className="relative z-10">
              {decade}s
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

export default DecadeMarker;
