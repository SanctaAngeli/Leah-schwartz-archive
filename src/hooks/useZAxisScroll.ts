import { useState, useEffect, useCallback, useRef } from 'react';

interface ZAxisScrollState {
  progress: number; // 0 to 1
  isTransitioning: boolean;
  isComplete: boolean;
  direction: 'forward' | 'reverse' | null;
}

interface UseZAxisScrollOptions {
  threshold?: number; // How much scroll/swipe needed to trigger (default: 100)
  duration?: number; // Animation duration in ms (default: 2500)
  onComplete?: () => void;
  onReverse?: () => void;
  enabled?: boolean;
}

interface UseZAxisScrollReturn extends ZAxisScrollState {
  reset: () => void;
  triggerEntrance: () => void;
  triggerReverse: () => void;
}

export function useZAxisScroll(options: UseZAxisScrollOptions = {}): UseZAxisScrollReturn {
  const {
    threshold = 100,
    duration = 2500,
    onComplete,
    onReverse,
    enabled = true,
  } = options;

  const [state, setState] = useState<ZAxisScrollState>({
    progress: 0,
    isTransitioning: false,
    isComplete: false,
    direction: null,
  });

  const accumulatedScroll = useRef(0);
  const touchStartY = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  const animateProgress = useCallback(
    (targetProgress: number, direction: 'forward' | 'reverse') => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }

      startTime.current = performance.now();
      const startProgress = state.progress;

      const animate = (currentTime: number): void => {
        if (!startTime.current) return;

        const elapsed = currentTime - startTime.current;
        const rawProgress = Math.min(elapsed / duration, 1);

        // Use smooth easing (cubic-bezier approximation)
        const easeProgress = 1 - Math.pow(1 - rawProgress, 3);

        const currentProgress = startProgress + (targetProgress - startProgress) * easeProgress;

        setState((prev) => ({
          ...prev,
          progress: currentProgress,
          isTransitioning: rawProgress < 1,
          isComplete: direction === 'forward' && rawProgress >= 1,
          direction,
        }));

        if (rawProgress < 1) {
          animationFrame.current = requestAnimationFrame(animate);
        } else {
          if (direction === 'forward' && onComplete) {
            onComplete();
          } else if (direction === 'reverse' && onReverse) {
            onReverse();
          }
        }
      };

      setState((prev) => ({ ...prev, isTransitioning: true, direction }));
      animationFrame.current = requestAnimationFrame(animate);
    },
    [duration, onComplete, onReverse, state.progress]
  );

  const triggerEntrance = useCallback((): void => {
    if (state.isComplete || state.isTransitioning) return;
    animateProgress(1, 'forward');
  }, [animateProgress, state.isComplete, state.isTransitioning]);

  const triggerReverse = useCallback((): void => {
    if (state.progress === 0 || state.isTransitioning) return;
    animateProgress(0, 'reverse');
  }, [animateProgress, state.progress, state.isTransitioning]);

  const reset = useCallback((): void => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }
    accumulatedScroll.current = 0;
    startTime.current = null;
    setState({
      progress: 0,
      isTransitioning: false,
      isComplete: false,
      direction: null,
    });
  }, []);

  // Handle wheel events
  useEffect(() => {
    if (!enabled || state.isComplete || state.isTransitioning) return;

    const handleWheel = (e: WheelEvent): void => {
      // Only respond to scroll down
      if (e.deltaY > 0) {
        accumulatedScroll.current += e.deltaY;

        if (accumulatedScroll.current >= threshold) {
          triggerEntrance();
          accumulatedScroll.current = 0;
        }
      } else {
        // Reset accumulated scroll on scroll up
        accumulatedScroll.current = Math.max(0, accumulatedScroll.current + e.deltaY);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [enabled, state.isComplete, state.isTransitioning, threshold, triggerEntrance]);

  // Handle touch events for mobile swipe
  useEffect(() => {
    if (!enabled || state.isComplete || state.isTransitioning) return;

    const handleTouchStart = (e: TouchEvent): void => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent): void => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchY;

      // Swipe up (deltaY > 0) triggers entrance
      if (deltaY > 0) {
        accumulatedScroll.current += deltaY;
        touchStartY.current = touchY;

        if (accumulatedScroll.current >= threshold) {
          triggerEntrance();
          accumulatedScroll.current = 0;
        }
      } else {
        accumulatedScroll.current = Math.max(0, accumulatedScroll.current + deltaY);
        touchStartY.current = touchY;
      }
    };

    const handleTouchEnd = (): void => {
      // Reset on touch end if not triggered
      accumulatedScroll.current = 0;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, state.isComplete, state.isTransitioning, threshold, triggerEntrance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return {
    ...state,
    reset,
    triggerEntrance,
    triggerReverse,
  };
}

export default useZAxisScroll;
