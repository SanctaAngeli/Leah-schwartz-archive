import { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, animate, useReducedMotion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useFavorites } from '../hooks/useFavorites';
import artworksData from '../data/artworks.json';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

// Era definitions
const ERAS = {
  early: { id: 'early', label: 'Early Works', years: [0, 1974] },
  middle: { id: 'middle', label: 'The San Francisco Years', years: [1975, 1989] },
  late: { id: 'late', label: 'Late Reflections', years: [1990, 2100] },
};

function CuratedGalleryPage(): JSX.Element {
  const navigate = useNavigate();
  const { eraId } = useParams<{ eraId?: string }>();
  const { isNight } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringArtwork, setIsHoveringArtwork] = useState(false);

  // Get era info
  const currentEra = eraId ? ERAS[eraId as keyof typeof ERAS] : null;
  const eraLabel = currentEra?.label || 'Curated Gallery';

  // Filter artworks by era if specified
  const curatedArtworks = useMemo(() => {
    let filtered = artworks;

    if (currentEra) {
      filtered = artworks.filter((a) => {
        if (!a.year) return false;
        return a.year >= currentEra.years[0] && a.year <= currentEra.years[1];
      });
    } else {
      // Default: featured + others
      const featured = artworks.filter((a) => a.featured);
      const others = artworks
        .filter((a) => !a.featured)
        .sort((a, b) => (b.year || 0) - (a.year || 0))
        .slice(0, 20 - featured.length);
      filtered = [...featured, ...others];
    }

    return filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
  }, [currentEra]);

  const currentArtwork = curatedArtworks[currentIndex];

  // Scroll position
  const scrollX = useMotionValue(0);

  // Responsive card width
  const cardWidth = typeof window !== 'undefined' && window.innerWidth < 768 ? 300 : 450;
  const gap = typeof window !== 'undefined' && window.innerWidth < 768 ? 24 : 48;
  const totalWidth = curatedArtworks.length * (cardWidth + gap);

  // Theme-aware colors
  const bgColor = isNight ? '#0A0A0A' : '#FAFAFA';
  const textPrimary = isNight ? 'text-white/90' : 'text-text-primary';
  const textSecondary = isNight ? 'text-white/50' : 'text-text-secondary';
  const textMuted = isNight ? 'text-white/30' : 'text-text-muted';
  const borderColor = isNight ? 'border-white/20' : 'border-black/10';

  // Navigate to specific index
  const goToIndex = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(curatedArtworks.length - 1, index));
    setCurrentIndex(clampedIndex);

    const animationConfig = prefersReducedMotion
      ? { type: 'tween' as const, duration: 0.1 }
      : { type: 'spring' as const, stiffness: 200, damping: 30 };

    animate(scrollX, -clampedIndex * (cardWidth + gap), animationConfig);
  }, [curatedArtworks.length, scrollX, cardWidth, gap, prefersReducedMotion]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToIndex(currentIndex + 1);
      else if (e.key === 'ArrowLeft') goToIndex(currentIndex - 1);
      else if (e.key === 'Enter' && currentArtwork) navigate(`/artwork/${currentArtwork.id}`);
      else if (e.key === 'f' && currentArtwork) toggleFavorite(currentArtwork.id);
      else if (e.key === 'Escape') navigate(-1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, goToIndex, navigate, currentArtwork, toggleFavorite]);

  // Wheel navigation with debounce
  const wheelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (wheelTimeout.current) return;

    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 20) {
      goToIndex(currentIndex + (delta > 0 ? 1 : -1));
      wheelTimeout.current = setTimeout(() => {
        wheelTimeout.current = null;
      }, 300);
    }
  }, [currentIndex, goToIndex]);

  // Touch swipe handling
  const touchStartX = useRef<number>(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      goToIndex(currentIndex + (diff > 0 ? 1 : -1));
    }
  }, [currentIndex, goToIndex]);

  // Drag handling
  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
      const swipe = info.offset.x + info.velocity.x * 0.2;
      const threshold = cardWidth / 4;

      if (Math.abs(swipe) > threshold) {
        goToIndex(currentIndex + (swipe > 0 ? -1 : 1));
      } else {
        goToIndex(currentIndex);
      }
      setIsDragging(false);
    },
    [currentIndex, goToIndex, cardWidth]
  );

  if (!currentArtwork) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: bgColor }}>
        <p className={textSecondary}>No artworks found</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen overflow-hidden transition-colors duration-500 flex flex-col"
      style={{ backgroundColor: bgColor }}
    >
      {/* Minimal header - just title and back */}
      <motion.header
        className="pt-6 px-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => navigate(-1)}
          className={`absolute top-6 left-6 ${textSecondary} hover:${textPrimary} transition-colors font-body text-sm flex items-center gap-2`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className={`font-heading text-2xl md:text-3xl ${textPrimary}`}>
          {eraLabel}
        </h1>
        <p className={`font-body ${textSecondary} text-sm mt-1`}>
          {curatedArtworks.length} works
        </p>
      </motion.header>

      {/* Main gallery - vertically centered */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Cards container */}
        <motion.div
          className="flex items-center"
          style={{
            x: scrollX,
            paddingLeft: `calc(50vw - ${cardWidth / 2}px)`,
          }}
          drag="x"
          dragConstraints={{
            left: -(totalWidth - (typeof window !== 'undefined' ? window.innerWidth : 1000) + 200),
            right: 100,
          }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        >
          {curatedArtworks.map((artwork, index) => {
            const isActive = index === currentIndex;
            const distance = Math.abs(index - currentIndex);

            return (
              <motion.div
                key={artwork.id}
                className="flex-shrink-0 relative"
                style={{
                  width: cardWidth,
                  marginRight: gap,
                }}
                animate={prefersReducedMotion ? {
                  opacity: isActive ? 1 : 0.5,
                } : {
                  scale: isActive ? 1 : 0.85 - distance * 0.02,
                  opacity: isActive ? 1 : Math.max(0.2, 0.5 - distance * 0.1),
                  y: isActive ? 0 : 20 + distance * 5,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              >
                {/* Artwork card */}
                <motion.div
                  className="relative overflow-hidden rounded-2xl cursor-pointer"
                  onMouseEnter={() => isActive && setIsHoveringArtwork(true)}
                  onMouseLeave={() => setIsHoveringArtwork(false)}
                  onClick={() => {
                    if (!isDragging) {
                      if (isActive) {
                        navigate(`/artwork/${artwork.id}`);
                      } else {
                        goToIndex(index);
                      }
                    }
                  }}
                  whileHover={isActive && !prefersReducedMotion ? { scale: 1.02 } : undefined}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div
                    className={`w-full ${
                      artwork.aspectRatio === 'portrait'
                        ? 'aspect-[3/4]'
                        : artwork.aspectRatio === 'landscape'
                          ? 'aspect-[4/3]'
                          : 'aspect-square'
                    }`}
                    style={{
                      backgroundColor: artwork.placeholderColor,
                      boxShadow: isActive
                        ? isNight
                          ? '0 30px 100px rgba(0,0,0,0.5)'
                          : '0 30px 100px rgba(0,0,0,0.15)'
                        : isNight
                          ? '0 10px 40px rgba(0,0,0,0.3)'
                          : '0 10px 40px rgba(0,0,0,0.08)',
                    }}
                  />

                  {/* Favorite indicator */}
                  {isFavorite(artwork.id) && (
                    <div className="absolute top-4 right-4">
                      <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* "Click for more" button - ONLY on hover, centered */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-black/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHoveringArtwork ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        className="px-6 py-3 rounded-full bg-white/95 backdrop-blur-sm shadow-xl"
                        initial={{ scale: 0.9, y: 10 }}
                        animate={{
                          scale: isHoveringArtwork ? 1 : 0.9,
                          y: isHoveringArtwork ? 0 : 10
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="font-body text-sm text-text-primary font-medium">
                          Click for more
                        </span>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Artwork info - under the card */}
                <motion.div
                  className="mt-6 text-center"
                  animate={{
                    opacity: isActive ? 1 : 0.3,
                  }}
                >
                  <h2 className={`font-heading text-xl md:text-2xl ${textPrimary} mb-1`}>
                    {artwork.title}
                  </h2>
                  <p className={`font-body ${textSecondary} text-sm`}>
                    {artwork.year} · {artwork.medium}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}

          {/* End padding */}
          <div style={{ width: `calc(50vw - ${cardWidth / 2}px)`, flexShrink: 0 }} />
        </motion.div>

        {/* Controls - centered BELOW the artwork */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Info button */}
          <button
            onClick={() => currentArtwork && navigate(`/artwork/${currentArtwork.id}`)}
            className={`w-12 h-12 rounded-full ${isNight ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}
              flex items-center justify-center transition-colors`}
            aria-label="View details"
            title="View details (Enter)"
          >
            <svg className={`w-5 h-5 ${textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Favorite button */}
          <button
            onClick={() => currentArtwork && toggleFavorite(currentArtwork.id)}
            className={`w-12 h-12 rounded-full ${isNight ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}
              flex items-center justify-center transition-colors`}
            aria-label={currentArtwork && isFavorite(currentArtwork.id) ? 'Remove from favorites' : 'Add to favorites'}
            title="Favorite (F)"
          >
            <svg
              className={`w-5 h-5 ${currentArtwork && isFavorite(currentArtwork.id) ? 'text-red-500' : textSecondary}`}
              fill={currentArtwork && isFavorite(currentArtwork.id) ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Divider */}
          <div className={`w-px h-8 ${isNight ? 'bg-white/20' : 'bg-black/10'}`} />

          {/* Prev button */}
          <button
            onClick={() => goToIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
              currentIndex === 0
                ? `${isNight ? 'border-white/10 text-white/20' : 'border-black/10 text-black/20'} cursor-not-allowed`
                : `${borderColor} ${textSecondary} hover:${textPrimary}`
            }`}
            aria-label="Previous artwork"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Progress indicator */}
          <div className="flex flex-col items-center">
            <div className={`w-24 h-1 rounded-full ${isNight ? 'bg-white/10' : 'bg-black/10'} overflow-hidden`}>
              <motion.div
                className={`h-full rounded-full ${isNight ? 'bg-white' : 'bg-text-primary'}`}
                animate={{
                  width: `${((currentIndex + 1) / curatedArtworks.length) * 100}%`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>
            <p className={`font-body ${textMuted} text-xs mt-2`}>
              {currentIndex + 1} / {curatedArtworks.length}
            </p>
          </div>

          {/* Next button */}
          <button
            onClick={() => goToIndex(currentIndex + 1)}
            disabled={currentIndex === curatedArtworks.length - 1}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
              currentIndex === curatedArtworks.length - 1
                ? `${isNight ? 'border-white/10 text-white/20' : 'border-black/10 text-black/20'} cursor-not-allowed`
                : `${borderColor} ${textSecondary} hover:${textPrimary}`
            }`}
            aria-label="Next artwork"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Keyboard hint */}
      <motion.div
        className="pb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className={`font-body ${textMuted} text-xs`}>
          ← → navigate · Enter view details · F favorite · Esc back
        </p>
      </motion.div>
    </div>
  );
}

export default CuratedGalleryPage;
