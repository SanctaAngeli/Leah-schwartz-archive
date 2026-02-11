import { useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { useRef, RefObject } from 'react';

interface ScrollProgressOptions {
  offset?: [string, string];
  smooth?: number;
}

interface ScrollProgressResult {
  ref: RefObject<HTMLDivElement>;
  progress: MotionValue<number>;
  smoothProgress: MotionValue<number>;
  isInView: MotionValue<number>;
}

/**
 * Hook for tracking scroll progress of an element
 * Returns smooth, spring-based progress values
 */
export function useScrollProgress(options: ScrollProgressOptions = {}): ScrollProgressResult {
  const { offset = ['start end', 'end start'], smooth: _smooth = 0.1 } = options;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  // Smooth spring-based progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Binary in-view state (0 or 1)
  const isInView = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return {
    ref: ref as RefObject<HTMLDivElement>,
    progress: scrollYProgress,
    smoothProgress,
    isInView,
  };
}

/**
 * Hook for page-level scroll progress
 */
export function usePageScroll() {
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  return {
    progress: scrollYProgress,
    smoothProgress,
  };
}

/**
 * Transform a progress value through multiple keyframes
 */
export function useProgressTransform<T>(
  progress: MotionValue<number>,
  inputRange: number[],
  outputRange: T[]
): MotionValue<T> {
  return useTransform(progress, inputRange, outputRange);
}

export default useScrollProgress;
