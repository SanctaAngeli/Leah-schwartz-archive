import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PagePreloaderProps {
  minDuration?: number; // Minimum time to show the preloader
  onComplete?: () => void;
}

function PagePreloader({
  minDuration = 1500,
  onComplete,
}: PagePreloaderProps): JSX.Element | null {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const elapsed = Date.now() - startTime;
        const naturalProgress = Math.min((elapsed / minDuration) * 100, 95);
        const newProgress = Math.max(prev, naturalProgress);
        return newProgress;
      });
    }, 50);

    // Complete loading after minimum duration
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        onComplete?.();
      }, 400);
    }, minDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] bg-bg-gallery flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="text-center">
            {/* Logo/Title Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.h1
                className="font-heading text-[clamp(32px,8vw,64px)] text-text-primary mb-2"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                Leah Schwartz
              </motion.h1>
              <motion.p
                className="font-body text-text-muted text-sm tracking-[0.3em] uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Digital Archive
              </motion.p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="mt-12 w-48 mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="h-0.5 bg-black/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-text-primary rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
              <motion.p
                className="mt-4 font-body text-text-muted text-xs"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {progress < 100 ? 'Loading collection...' : 'Welcome'}
              </motion.p>
            </motion.div>

            {/* Floating artwork previews */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[
                { color: '#8B7355', x: '10%', y: '20%', size: 60, delay: 0 },
                { color: '#6B8E9F', x: '85%', y: '15%', size: 80, delay: 0.2 },
                { color: '#9B8B7A', x: '15%', y: '75%', size: 70, delay: 0.4 },
                { color: '#A8C090', x: '80%', y: '70%', size: 50, delay: 0.6 },
                { color: '#C4A882', x: '50%', y: '85%', size: 40, delay: 0.8 },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="absolute rounded-lg"
                  style={{
                    left: item.x,
                    top: item.y,
                    width: item.size,
                    height: item.size,
                    backgroundColor: item.color,
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 0.3, 0.3, 0],
                    scale: [0.5, 1, 1, 0.8],
                    y: [0, -20, -20, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: item.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PagePreloader;
