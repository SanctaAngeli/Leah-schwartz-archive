import { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ZAxisEntrance } from '../components/home';
import artworksData from '../data/artworks.json';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

interface LocationState {
  fromGallery?: boolean;
}

function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  // Track transition progress (0 = home, 1 = fully entered)
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReturning, setIsReturning] = useState(state?.fromGallery ?? false);

  // Animation frame ref for smooth transitions
  const animationRef = useRef<number | null>(null);
  const transitionStartTime = useRef<number | null>(null);
  const hasNavigated = useRef(false);

  // Select artworks - need plenty for floating AND corridor (both walls)
  const galleryArtworks = useMemo(() => {
    const shuffled = [...artworks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 50); // 50 artworks for both phases - enough for both walls
  }, []);

  // Smooth transition animation - DOUBLED duration to 7 seconds
  const animateTransition = useCallback(
    (targetProgress: number, duration: number, onComplete?: () => void) => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      hasNavigated.current = false;
      transitionStartTime.current = performance.now();
      const startProgress = progress;

      const animate = (currentTime: number): void => {
        if (!transitionStartTime.current) return;

        const elapsed = currentTime - transitionStartTime.current;
        const rawProgress = Math.min(elapsed / duration, 1);

        // Fast easing: quick start, fast middle, ACCELERATE at end
        let eased: number;
        if (rawProgress < 0.1) {
          // Brief anticipation
          eased = Math.pow(rawProgress / 0.1, 1.5) * 0.05;
        } else if (rawProgress < 0.6) {
          // Fast cruise through corridor
          const midProgress = (rawProgress - 0.1) / 0.5;
          eased = 0.05 + midProgress * 0.5;
        } else {
          // SPEED UP dramatically at end
          const endProgress = (rawProgress - 0.6) / 0.4;
          eased = 0.55 + Math.pow(endProgress, 1.3) * 0.45;
        }
        const currentProgress = startProgress + (targetProgress - startProgress) * eased;

        setProgress(currentProgress);

        // Navigate during the white fade (around 95% progress)
        if (currentProgress > 0.95 && !hasNavigated.current && onComplete) {
          hasNavigated.current = true;
          onComplete();
        }

        if (rawProgress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsTransitioning(false);
        }
      };

      setIsTransitioning(true);
      animationRef.current = requestAnimationFrame(animate);
    },
    [progress]
  );

  // Handle entering the gallery - ONLY via button click
  // Duration is 4.5 seconds - fast but immersive
  const handleEnter = useCallback((): void => {
    if (isTransitioning || progress > 0.1) return;

    animateTransition(1, 4500, () => {
      navigate('/gallery');
    });
  }, [animateTransition, isTransitioning, navigate, progress]);

  // NO scroll trigger - removed
  // The corridor is entered ONLY by clicking the button

  // Handle reverse animation when returning from gallery
  useEffect(() => {
    if (isReturning) {
      setProgress(1);

      const timer = setTimeout(() => {
        animateTransition(0, 2500, () => {
          setIsReturning(false);
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isReturning, animateTransition]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <ZAxisEntrance
      progress={progress}
      artworks={galleryArtworks}
      onEnterClick={handleEnter}
    />
  );
}

export default HomePage;
