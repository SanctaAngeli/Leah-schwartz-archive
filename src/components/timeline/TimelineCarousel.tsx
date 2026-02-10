import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import DecadeMarker from './DecadeMarker';
import { useTickSound, initAudioContext } from '../../utils/tickSound';
import type { Artwork } from '../../types';

interface TimelineCarouselProps {
  artworks: Artwork[];
  initialYear?: number;
  onYearChange?: (year: number) => void;
  onArtworkClick?: (artwork: Artwork, year: number) => void;
  minimized?: boolean;
  onExpandRequest?: () => void;
}

function TimelineCarousel({
  artworks,
  initialYear,
  onYearChange,
  onArtworkClick,
  minimized = false,
  onExpandRequest,
}: TimelineCarouselProps): JSX.Element {
  const { playTick } = useTickSound({ volume: 0.12, minInterval: 60 });
  const containerRef = useRef<HTMLDivElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const isDraggingCards = useRef(false);
  const isDraggingScrubber = useRef(false);
  const dragStartIndex = useRef(0);
  const lastTickYear = useRef<number | null>(null);

  // Group artworks by year and get sorted years
  const { artworksByYear, allYears, decades } = useMemo(() => {
    const grouped = new Map<number, Artwork[]>();
    artworks.forEach((artwork) => {
      if (artwork.year !== null) {
        const existing = grouped.get(artwork.year) || [];
        existing.push(artwork);
        grouped.set(artwork.year, existing);
      }
    });

    const years = Array.from(grouped.keys()).sort((a, b) => a - b);

    const decadeMap = new Map<number, number[]>();
    years.forEach((year) => {
      const decade = Math.floor(year / 10) * 10;
      const existing = decadeMap.get(decade) || [];
      existing.push(year);
      decadeMap.set(decade, existing);
    });

    return {
      artworksByYear: grouped,
      allYears: years,
      decades: Array.from(decadeMap.keys()).sort((a, b) => a - b),
    };
  }, [artworks]);

  // Current year index as a continuous value for smooth animation
  const defaultIndex = initialYear
    ? allYears.indexOf(initialYear)
    : Math.floor(allYears.length / 2);
  const [currentIndex, setCurrentIndex] = useState(Math.max(0, defaultIndex));

  // For smooth dragging, we track a floating index
  const floatingIndex = useMotionValue(currentIndex);

  const currentYear = allYears[currentIndex] || allYears[0];
  const currentDecade = Math.floor(currentYear / 10) * 10;

  // Get artwork for a year
  const getArtworkForYear = useCallback((year: number): Artwork | null => {
    const yearArtworks = artworksByYear.get(year);
    if (!yearArtworks?.length) return null;
    return yearArtworks.find((a) => a.featured) || yearArtworks[0];
  }, [artworksByYear]);

  // Play tick sound when year changes
  useEffect(() => {
    if (lastTickYear.current !== null && lastTickYear.current !== currentYear) {
      playTick();
    }
    lastTickYear.current = currentYear;
    onYearChange?.(currentYear);
  }, [currentYear, playTick, onYearChange]);

  // Initialize audio context
  useEffect(() => {
    const handleFirstInteraction = (): void => {
      initAudioContext();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Navigate to specific index
  const goToIndex = useCallback((index: number, animated = true) => {
    const clampedIndex = Math.max(0, Math.min(allYears.length - 1, index));
    setCurrentIndex(clampedIndex);
    if (animated) {
      animate(floatingIndex, clampedIndex, { type: 'spring', stiffness: 300, damping: 30 });
    } else {
      floatingIndex.set(clampedIndex);
    }
  }, [allYears.length, floatingIndex]);

  // Navigate to decade
  const goToDecade = useCallback((decade: number) => {
    const firstYearOfDecade = allYears.find((y) => Math.floor(y / 10) * 10 === decade);
    if (firstYearOfDecade !== undefined) {
      goToIndex(allYears.indexOf(firstYearOfDecade));
    }
  }, [allYears, goToIndex]);

  // Track cumulative drag for index calculation (not for visual offset)
  const cumulativeDrag = useRef(0);

  // Card drag handlers - drag changes the year, cards stay centered
  const DRAG_SENSITIVITY = minimized ? 40 : 60; // pixels per year

  const handleCardDragStart = useCallback(() => {
    isDraggingCards.current = true;
    dragStartIndex.current = currentIndex;
    cumulativeDrag.current = 0;
  }, [currentIndex]);

  const handleCardDrag = useCallback((_e: MouseEvent | TouchEvent | PointerEvent, info: { delta: { x: number } }) => {
    // Accumulate the drag delta
    cumulativeDrag.current += info.delta.x;

    // Calculate which index we should be at based on cumulative drag
    const indexDelta = -cumulativeDrag.current / DRAG_SENSITIVITY;
    const newIndex = Math.round(dragStartIndex.current + indexDelta);
    const clampedIndex = Math.max(0, Math.min(allYears.length - 1, newIndex));

    if (clampedIndex !== currentIndex) {
      setCurrentIndex(clampedIndex);
    }
  }, [DRAG_SENSITIVITY, allYears.length, currentIndex]);

  const handleCardDragEnd = useCallback(() => {
    cumulativeDrag.current = 0;
    setTimeout(() => {
      isDraggingCards.current = false;
    }, 100);
  }, []);

  // Handle wheel scroll - one year at a time
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();

    if (wheelTimeout.current) return;

    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 10) {
      goToIndex(currentIndex + (delta > 0 ? 1 : -1));
      wheelTimeout.current = setTimeout(() => {
        wheelTimeout.current = null;
      }, 100);
    }
  }, [currentIndex, goToIndex]);

  // Handle card click
  const handleCardClick = useCallback((year: number, index: number) => {
    if (isDraggingCards.current) return;

    if (index === currentIndex) {
      const artwork = getArtworkForYear(year);
      if (artwork) {
        onArtworkClick?.(artwork, year);
      }
    } else {
      goToIndex(index);
    }
  }, [currentIndex, getArtworkForYear, onArtworkClick, goToIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToIndex(currentIndex + 1);
      else if (e.key === 'ArrowLeft') goToIndex(currentIndex - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, goToIndex]);

  // Scrubber drag handling
  const scrubberProgress = useTransform(
    floatingIndex,
    [0, allYears.length - 1],
    [0, 100]
  );

  const handleScrubberDrag = useCallback((e: React.MouseEvent | React.TouchEvent | MouseEvent, instant = false) => {
    if (!scrubberRef.current) return;

    const rect = scrubberRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const relativeX = (clientX - rect.left) / rect.width;
    const clampedX = Math.max(0, Math.min(1, relativeX));
    const targetIndex = clampedX * (allYears.length - 1);

    // During drag: instant update, no animation
    if (instant || isDraggingScrubber.current) {
      floatingIndex.set(targetIndex);
      setCurrentIndex(Math.round(targetIndex));
    } else {
      goToIndex(Math.round(targetIndex));
    }
  }, [allYears.length, floatingIndex, goToIndex]);

  const handleScrubberMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingScrubber.current = true;
    isDraggingCards.current = true; // Also set this for faster card animations
    handleScrubberDrag(e, true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingScrubber.current) return;
      handleScrubberDrag(e, true);
    };

    const handleMouseUp = () => {
      isDraggingScrubber.current = false;
      isDraggingCards.current = false;
      // Snap to nearest year with gentle animation on release
      const finalIndex = Math.round(floatingIndex.get());
      animate(floatingIndex, finalIndex, { type: 'spring', stiffness: 400, damping: 35 });
      setCurrentIndex(finalIndex);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [handleScrubberDrag, floatingIndex]);

  // Click anywhere in minimized mode to expand
  const handleMinimizedClick = useCallback((e: React.MouseEvent) => {
    // Only trigger if clicking the background, not a card
    if ((e.target as HTMLElement).closest('[data-card]')) return;
    onExpandRequest?.();
  }, [onExpandRequest]);

  // Calculate visible range
  const visibleRange = minimized ? 4 : 6;
  const startIndex = Math.max(0, currentIndex - visibleRange);
  const endIndex = Math.min(allYears.length - 1, currentIndex + visibleRange);

  // Calculate dynamic spacing - tighter at edges, spacious in middle
  const getCardStyle = (offset: number, absOffset: number) => {
    const isCurrent = offset === 0;

    // Progressive spacing: closer together as you go further from center
    const baseGap = minimized ? 70 : 140;
    const compressionFactor = minimized ? 0.75 : 0.8;

    // Each card further out is progressively closer
    let xPos = 0;
    for (let i = 0; i < absOffset; i++) {
      xPos += baseGap * Math.pow(compressionFactor, i);
    }
    xPos *= Math.sign(offset);

    // Scale: center is much bigger
    const scale = isCurrent
      ? (minimized ? 1 : 1.15)
      : Math.max(0.5, (minimized ? 0.85 : 0.9) - absOffset * 0.08);

    // Opacity
    const opacity = isCurrent ? 1 : Math.max(0.25, 0.85 - absOffset * 0.15);

    // Z-index
    const zIndex = 20 - absOffset;

    // Subtle rotation for 3D effect
    const rotateY = offset * (minimized ? 2 : 4);

    // Y offset - center rises up
    const yOffset = isCurrent ? (minimized ? -8 : -25) : absOffset * 3;

    return { xPos, scale, opacity, zIndex, rotateY, yOffset };
  };

  return (
    <div
      className={`w-full ${minimized ? 'py-1' : ''}`}
      onClick={minimized ? handleMinimizedClick : undefined}
    >
      {/* Decade navigation */}
      {!minimized && (
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <DecadeMarker
            decades={decades}
            currentDecade={currentDecade}
            onDecadeClick={goToDecade}
          />
        </motion.div>
      )}

      {/* Carousel container */}
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden ${minimized ? 'h-28' : 'h-[380px]'}`}
        onWheel={handleWheel}
      >
        {/* Gradient fades */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#FAFAFA] to-transparent z-30 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#FAFAFA] to-transparent z-30 pointer-events-none" />

        {/* Cards container - stays centered, drag only changes which year is selected */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={handleCardDragStart}
          onDrag={handleCardDrag}
          onDragEnd={handleCardDragEnd}
        >
          {allYears.slice(startIndex, endIndex + 1).map((year, i) => {
            const actualIndex = startIndex + i;
            const offset = actualIndex - currentIndex;
            const absOffset = Math.abs(offset);
            const artwork = getArtworkForYear(year);
            if (!artwork) return null;

            const { xPos, scale, opacity, zIndex, rotateY, yOffset } = getCardStyle(offset, absOffset);
            const isCurrent = offset === 0;

            // Card size based on aspect ratio
            const sizeClasses = minimized
              ? {
                  portrait: 'w-14 h-20',
                  landscape: 'w-20 h-14',
                  square: 'w-16 h-16',
                }
              : {
                  portrait: 'w-40 h-56',
                  landscape: 'w-56 h-40',
                  square: 'w-48 h-48',
                };

            return (
              <motion.div
                key={year}
                data-card
                className="absolute flex flex-col items-center select-none"
                style={{
                  zIndex,
                  transformStyle: 'preserve-3d',
                  perspective: 1200,
                }}
                initial={false}
                animate={{
                  x: xPos,
                  scale,
                  opacity,
                  rotateY,
                  y: yOffset,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(year, actualIndex);
                }}
              >
                {/* Artwork card */}
                <div
                  className={`
                    relative rounded-xl overflow-hidden
                    ${sizeClasses[artwork.aspectRatio]}
                    ${isCurrent
                      ? 'shadow-[0_25px_70px_rgba(0,0,0,0.3),0_10px_25px_rgba(0,0,0,0.2)]'
                      : 'shadow-[0_10px_30px_rgba(0,0,0,0.12)]'
                    }
                    transition-shadow duration-300
                  `}
                >
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: artwork.placeholderColor }}
                  />

                  {/* Year overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 via-black/10 to-transparent">
                    <span
                      className={`
                        font-heading text-white drop-shadow-lg
                        ${minimized ? 'text-lg' : isCurrent ? 'text-5xl' : 'text-3xl'}
                        ${isCurrent ? 'opacity-100' : 'opacity-70'}
                      `}
                    >
                      {year}
                    </span>
                  </div>

                  {isCurrent && (
                    <div className="absolute inset-0 rounded-xl ring-2 ring-white/50 pointer-events-none" />
                  )}
                </div>

                {/* Title for current */}
                {isCurrent && !minimized && (
                  <motion.p
                    className="mt-3 font-body text-sm text-text-muted text-center max-w-[180px] truncate"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {artwork.title}
                  </motion.p>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Scrubber - draggable timeline */}
      {!minimized && (
        <motion.div
          className="mt-4 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            ref={scrubberRef}
            className="w-full max-w-xl px-6 py-3 cursor-pointer"
            onMouseDown={handleScrubberMouseDown}
          >
            <div className="relative h-1.5 bg-black/8 rounded-full">
              {/* Progress fill - smooth gradient */}
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-text-primary/20 to-text-primary/35"
                style={{ width: useTransform(scrubberProgress, v => `${v}%`) }}
                transition={{ type: 'tween', duration: 0.05, ease: 'linear' }}
              />

              {/* Draggable handle - no scale animations to prevent vertical shift */}
              <motion.div
                className="absolute top-1/2 w-3.5 h-3.5 bg-text-primary rounded-full shadow-md cursor-grab active:cursor-grabbing hover:bg-text-secondary"
                style={{
                  left: useTransform(scrubberProgress, v => `calc(${v}% - 7px)`),
                  y: '-50%',
                }}
                transition={{ type: 'tween', duration: 0.02, ease: 'linear' }}
              />

              {/* Simple subtle tick marks - no highlighting */}
              <div className="absolute inset-0 flex items-center justify-between px-0.5 pointer-events-none">
                {[0, 0.25, 0.5, 0.75, 1].map((pos) => (
                  <div
                    key={pos}
                    className="w-0.5 h-0.5 rounded-full bg-text-muted/20"
                  />
                ))}
              </div>
            </div>

            {/* Year labels */}
            <div className="flex justify-between mt-1.5">
              <span className="font-body text-xs text-text-muted">{allYears[0]}</span>
              <span className="font-body text-xs text-text-primary font-medium">{currentYear}</span>
              <span className="font-body text-xs text-text-muted">{allYears[allYears.length - 1]}</span>
            </div>
          </div>

          <p className="font-body text-xs text-text-muted/50 mt-1">
            Drag to navigate • Click artwork to explore
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default TimelineCarousel;
