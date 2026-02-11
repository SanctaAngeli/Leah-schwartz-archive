import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

function FavoritesHint(): JSX.Element | null {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed this before
    const dismissed = sessionStorage.getItem('favorites-hint-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show hint after a delay (after initial animations complete)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    // Auto-hide after 12 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 15000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleDismiss = (): void => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('favorites-hint-dismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-24 left-1/2 z-50"
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="glass-card px-6 py-4 flex items-center gap-4 shadow-xl max-w-md">
            {/* Heart icon */}
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-rose-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <p className="font-body text-text-primary text-sm font-medium">
                Save your favorites
              </p>
              <p className="font-body text-text-muted text-xs mt-0.5">
                Click the heart on any artwork to add it to your collection
              </p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center
                text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
              aria-label="Dismiss hint"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FavoritesHint;
