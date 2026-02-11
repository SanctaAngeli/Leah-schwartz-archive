import { useState, useEffect } from 'react';

/**
 * Hook to check if user prefers reduced motion
 * Returns true if the user has requested reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Check on initial render
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent): void => {
      setPrefersReducedMotion(e.matches);
    };

    // Add listener for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Returns appropriate animation duration based on reduced motion preference
 * @param normalDuration - Duration in seconds for normal motion
 * @param reducedDuration - Duration in seconds for reduced motion (default: 0)
 */
export function useMotionDuration(normalDuration: number, reducedDuration = 0): number {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedDuration : normalDuration;
}

/**
 * Returns appropriate spring config based on reduced motion preference
 */
export function useSpringConfig(): {
  type: 'spring' | 'tween';
  stiffness?: number;
  damping?: number;
  duration?: number;
} {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return {
      type: 'tween',
      duration: 0.1,
    };
  }

  return {
    type: 'spring',
    stiffness: 300,
    damping: 25,
  };
}

export default useReducedMotion;
