import { useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PlaceholderArtwork from '../ui/PlaceholderArtwork';
import artworksData from '../../data/artworks.json';
import locationsData from '../../data/locations.json';
import type { Artwork, Location } from '../../types';

const artworks = artworksData as Artwork[];
const locations = locationsData as Location[];

interface ArtworkModalProps {
  artworkId?: string;
  onClose?: () => void;
}

function ArtworkModal({ artworkId: propArtworkId, onClose }: ArtworkModalProps): JSX.Element | null {
  const navigate = useNavigate();
  const params = useParams();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const artworkId = propArtworkId || params.artworkId;
  const artwork = artworks.find((a) => a.id === artworkId);
  const location = locations.find((l) => l.id === artwork?.location);

  // Get sorted artworks for navigation
  const sortedArtworks = useMemo(() => {
    return [...artworks].sort((a, b) => {
      if (!a.year) return 1;
      if (!b.year) return -1;
      return a.year - b.year;
    });
  }, []);

  const currentIndex = sortedArtworks.findIndex((a) => a.id === artworkId);
  const prevArtwork = currentIndex > 0 ? sortedArtworks[currentIndex - 1] : null;
  const nextArtwork = currentIndex < sortedArtworks.length - 1 ? sortedArtworks[currentIndex + 1] : null;

  // Timeline position
  const timelinePosition = useMemo(() => {
    if (!artwork?.year) return null;
    const sortedYears = [...new Set(artworks.map((a) => a.year).filter(Boolean))].sort(
      (a, b) => (a as number) - (b as number)
    );
    const index = sortedYears.indexOf(artwork.year);
    return {
      index,
      total: sortedYears.length,
      percentage: (index / (sortedYears.length - 1)) * 100,
    };
  }, [artwork]);

  // Handle close
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  }, [navigate, onClose]);

  // Navigate to adjacent artwork
  const navigateToArtwork = useCallback((artwork: Artwork | null) => {
    if (artwork) {
      navigate(`/artwork/${artwork.id}`, { replace: true });
    }
  }, [navigate]);

  // Lock body scroll and manage focus
  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      previousFocus.current?.focus();
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigateToArtwork(prevArtwork);
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateToArtwork(nextArtwork);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, navigateToArtwork, prevArtwork, nextArtwork]);

  if (!artwork) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Modal container */}
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="artwork-title"
          tabIndex={-1}
          className="relative z-10 w-full max-w-6xl max-h-[90vh] mx-4 overflow-hidden
            bg-bg-gallery rounded-2xl shadow-2xl outline-none"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center
              rounded-full bg-white/80 backdrop-blur-sm hover:bg-white
              transition-colors focus:outline-none focus:ring-2 focus:ring-text-primary/20"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation arrows */}
          {prevArtwork && (
            <button
              onClick={() => navigateToArtwork(prevArtwork)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12
                flex items-center justify-center rounded-full
                bg-white/80 backdrop-blur-sm hover:bg-white
                transition-colors focus:outline-none focus:ring-2 focus:ring-text-primary/20"
              aria-label={`Previous artwork: ${prevArtwork.title}`}
            >
              <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {nextArtwork && (
            <button
              onClick={() => navigateToArtwork(nextArtwork)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12
                flex items-center justify-center rounded-full
                bg-white/80 backdrop-blur-sm hover:bg-white
                transition-colors focus:outline-none focus:ring-2 focus:ring-text-primary/20"
              aria-label={`Next artwork: ${nextArtwork.title}`}
            >
              <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Content */}
          <div className="flex flex-col lg:flex-row h-full max-h-[90vh] overflow-y-auto">
            {/* Artwork image */}
            <div className="flex-1 p-6 lg:p-10 flex items-center justify-center bg-gray-50/50">
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-xl"
              >
                <PlaceholderArtwork
                  color={artwork.placeholderColor}
                  aspectRatio={artwork.aspectRatio}
                  className="w-full shadow-glass"
                />
              </motion.div>
            </div>

            {/* Metadata panel */}
            <motion.div
              key={`meta-${artwork.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="lg:w-96 p-6 lg:p-8 space-y-6 bg-white border-t lg:border-t-0 lg:border-l border-gray-100"
            >
              <div>
                <h1 id="artwork-title" className="font-heading text-2xl lg:text-3xl text-text-primary mb-2">
                  {artwork.title}
                </h1>
                <p className="font-heading text-lg lg:text-xl text-text-secondary">
                  {artwork.year ? (
                    <>
                      {artwork.circa && 'c. '}
                      {artwork.year}
                    </>
                  ) : (
                    'Undated'
                  )}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-body text-text-muted text-xs uppercase tracking-wider mb-1">
                    Medium
                  </p>
                  <p className="font-body text-text-primary">{artwork.medium}</p>
                </div>

                <div>
                  <p className="font-body text-text-muted text-xs uppercase tracking-wider mb-1">
                    Dimensions
                  </p>
                  <p className="font-body text-text-primary">{artwork.dimensions}</p>
                </div>

                {location && (
                  <div>
                    <p className="font-body text-text-muted text-xs uppercase tracking-wider mb-1">
                      Location Created
                    </p>
                    <button
                      onClick={() => {
                        handleClose();
                        setTimeout(() => navigate(`/locations/${location.id}`), 100);
                      }}
                      className="font-body text-text-primary hover:text-text-secondary transition-colors"
                    >
                      {location.name}
                    </button>
                  </div>
                )}

                <div>
                  <p className="font-body text-text-muted text-xs uppercase tracking-wider mb-1">
                    Collection
                  </p>
                  <p className="font-body text-text-primary">{artwork.collection}</p>
                </div>

                {artwork.themes.length > 0 && (
                  <div>
                    <p className="font-body text-text-muted text-xs uppercase tracking-wider mb-2">
                      Themes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {artwork.themes.map((themeId) => (
                        <button
                          key={themeId}
                          onClick={() => {
                            handleClose();
                            setTimeout(() => navigate(`/themes/${themeId}`), 100);
                          }}
                          className="glass-pill px-3 py-1 text-xs font-body text-text-secondary
                            hover:text-text-primary transition-colors"
                        >
                          {themeId.replace(/-/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mini timeline */}
              {timelinePosition && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="font-body text-text-muted text-xs uppercase tracking-wider mb-3">
                    Position in Career
                  </p>
                  <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-text-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${timelinePosition.percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="font-body text-text-muted text-xs">1963</span>
                    <span className="font-body text-text-primary text-xs font-medium">
                      {artwork.year}
                    </span>
                    <span className="font-body text-text-muted text-xs">2004</span>
                  </div>
                </div>
              )}

              {/* Keyboard hint */}
              <div className="pt-4 border-t border-gray-100">
                <p className="font-body text-text-muted text-xs">
                  Use ← → to navigate • Esc to close
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ArtworkModal;
