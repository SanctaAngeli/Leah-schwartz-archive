import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import PlaceholderArtwork from '../components/ui/PlaceholderArtwork';
import artworksData from '../data/artworks.json';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

function TimelinePage(): JSX.Element {
  const navigate = useNavigate();
  const { year: selectedYearParam } = useParams();
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

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

  const years = Object.keys(artworksByYear)
    .map(Number)
    .sort((a, b) => a - b);

  const selectedYear = selectedYearParam ? parseInt(selectedYearParam, 10) : null;

  const getRepresentativeArtwork = (year: number): Artwork => {
    const yearArtworks = artworksByYear[year];
    return yearArtworks.find((a) => a.featured) || yearArtworks[0];
  };

  return (
    <div className="min-h-screen pt-24 pb-8 flex flex-col">
      {/* Year view header */}
      {selectedYear && artworksByYear[selectedYear] && (
        <motion.div
          className="px-6 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate('/timeline')}
              className="text-text-muted hover:text-text-primary transition-colors mb-4 font-body text-sm"
            >
              ← Back to Timeline
            </button>
            <h1 className="font-heading text-5xl text-text-primary">{selectedYear}</h1>
            <p className="font-body text-text-muted mt-2">
              {artworksByYear[selectedYear].length} works
            </p>
          </div>
        </motion.div>
      )}

      {/* Selected year artworks grid */}
      {selectedYear && artworksByYear[selectedYear] && (
        <motion.div
          className="px-6 flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artworksByYear[selectedYear].map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/artwork/${artwork.id}`)}
              >
                <PlaceholderArtwork
                  color={artwork.placeholderColor}
                  aspectRatio={artwork.aspectRatio}
                  className="shadow-soft group-hover:shadow-glass mb-3"
                />
                <h3 className="font-body text-sm text-text-primary truncate">
                  {artwork.title}
                </h3>
                <p className="font-body text-xs text-text-muted">
                  {artwork.medium}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Timeline carousel */}
      <motion.div
        className={`${selectedYear ? 'mt-auto' : 'flex-1 flex items-center'}`}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {!selectedYear && (
          <div className="text-center mb-8 px-6">
            <h1 className="font-heading text-4xl text-text-primary mb-2">Timeline</h1>
            <p className="font-body text-text-muted">
              Explore Leah's work across four decades
            </p>
          </div>
        )}

        <div className="w-full overflow-x-auto pb-4 pt-4">
          <div className="flex gap-4 px-6 min-w-max justify-center">
            {years.map((year) => {
              const artwork = getRepresentativeArtwork(year);
              const isSelected = year === selectedYear;
              const isHovered = year === hoveredYear;

              return (
                <motion.div
                  key={year}
                  className="flex flex-col items-center cursor-pointer"
                  onMouseEnter={() => setHoveredYear(year)}
                  onMouseLeave={() => setHoveredYear(null)}
                  onClick={() => navigate(`/timeline/${year}`)}
                  animate={{
                    scale: isSelected || isHovered ? 1.1 : 1,
                    y: isSelected || isHovered ? -10 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div
                    className={`w-20 h-24 rounded-lg shadow-soft transition-shadow duration-300 ${
                      isSelected ? 'ring-2 ring-text-primary shadow-glass' : ''
                    }`}
                    style={{ backgroundColor: artwork.placeholderColor }}
                  />
                  <p
                    className={`mt-2 font-body text-xs transition-colors duration-300 ${
                      isSelected ? 'text-text-primary font-medium' : 'text-text-muted'
                    }`}
                  >
                    {year}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default TimelinePage;
