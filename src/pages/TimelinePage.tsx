import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useCallback, useState, useEffect } from 'react';
import { TimelineCarousel, ScrollGallery, MuseumCard } from '../components/timeline';
import artworksData from '../data/artworks.json';
import type { Artwork } from '../types';

// Years that should show the fancy scroll gallery (with many artworks)
const SCROLL_GALLERY_YEARS = [1970];

const artworks = artworksData as Artwork[];

function TimelinePage(): JSX.Element {
  const navigate = useNavigate();
  const { year: selectedYearParam } = useParams();

  // Use local state for expanded view (in-place animation)
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(1984);

  // Sync URL param to state on mount
  useEffect(() => {
    if (selectedYearParam) {
      const year = parseInt(selectedYearParam, 10);
      setExpandedYear(year);
      setCurrentYear(year);
    } else {
      setExpandedYear(null);
    }
  }, [selectedYearParam]);

  // Group artworks by year
  const artworksByYear = useMemo(() => {
    const grouped: Record<number, Artwork[]> = {};
    artworks.forEach((artwork) => {
      if (artwork.year) {
        if (!grouped[artwork.year]) {
          grouped[artwork.year] = [];
        }
        grouped[artwork.year].push(artwork);
      }
    });
    return grouped;
  }, []);

  // Handle clicking artwork in carousel - expand year view in place
  const handleArtworkClick = useCallback((_artwork: Artwork, year: number): void => {
    setExpandedYear(year);
    // Update URL without full page navigation
    window.history.pushState({}, '', `/timeline/${year}`);
  }, []);

  // Handle year change from carousel navigation
  const handleYearChange = useCallback((year: number): void => {
    setCurrentYear(year);
  }, []);

  // Handle expanding from minimized carousel
  const handleExpandTimeline = useCallback((): void => {
    setExpandedYear(null);
    window.history.pushState({}, '', '/timeline');
  }, []);

  // Handle individual artwork click in grid
  const handleGridArtworkClick = useCallback((artworkId: string): void => {
    navigate(`/artwork/${artworkId}`);
  }, [navigate]);

  const yearArtworks = expandedYear ? artworksByYear[expandedYear] : null;

  // Get hero artwork for atmosphere
  const heroArtwork = useMemo(() => {
    if (!yearArtworks?.length) return null;
    return yearArtworks.find((a) => a.featured) || yearArtworks[0];
  }, [yearArtworks]);

  const isExpanded = expandedYear !== null && yearArtworks !== null;

  return (
    <div className="min-h-screen">
      {/* Background atmosphere */}
      <AnimatePresence>
        {isExpanded && heroArtwork && (
          <motion.div
            className="fixed inset-0 z-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.06 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="w-full h-full"
              style={{ backgroundColor: heroArtwork.placeholderColor }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            /* Year detail view */
            <motion.div
              key="year-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Year header */}
              <div className="text-center px-6 pt-24 pb-6">
                <motion.button
                  className="
                    flex items-center gap-2 mx-auto mb-4
                    text-text-muted hover:text-text-primary
                    font-body text-sm transition-colors
                  "
                  onClick={handleExpandTimeline}
                  whileHover={{ x: -4 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Timeline
                </motion.button>
                <h1 className="font-heading text-8xl md:text-9xl text-text-primary leading-none">
                  {expandedYear}
                </h1>
                <p className="font-body text-text-muted mt-2 text-lg">
                  {yearArtworks?.length} {yearArtworks?.length === 1 ? 'work' : 'works'}
                </p>
              </div>

              {/* Artworks */}
              {yearArtworks && (
                <div className="pb-12">
                  {expandedYear && SCROLL_GALLERY_YEARS.includes(expandedYear) ? (
                    /* Fancy scroll gallery with CSS scroll-driven indicators */
                    <ScrollGallery
                      artworks={yearArtworks}
                      onArtworkClick={(artwork) => handleGridArtworkClick(artwork.id)}
                    />
                  ) : (
                    /* Museum-style grid for other years */
                    <div className="max-w-7xl mx-auto px-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {yearArtworks.map((artwork, index) => (
                          <MuseumCard
                            key={artwork.id}
                            artwork={artwork}
                            index={index}
                            onClick={() => handleGridArtworkClick(artwork.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            /* Timeline carousel view */
            <motion.div
              key="timeline-view"
              className="min-h-screen flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="text-center px-6 pt-20 pb-2">
                <h1 className="font-heading text-4xl md:text-5xl text-text-primary">
                  Timeline
                </h1>
                <p className="font-body text-text-muted mt-1">
                  Four decades of Leah Schwartz's artistic journey
                </p>
              </div>

              {/* Full carousel */}
              <div className="flex-1 flex items-center">
                <TimelineCarousel
                  artworks={artworks}
                  initialYear={currentYear}
                  onYearChange={handleYearChange}
                  onArtworkClick={handleArtworkClick}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TimelinePage;
