import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import PlaceholderArtwork from '../components/ui/PlaceholderArtwork';
import artworksData from '../data/artworks.json';
import locationsData from '../data/locations.json';
import type { Artwork, Location } from '../types';

const artworks = artworksData as Artwork[];
const locations = locationsData as Location[];

function ArtworkDetailPage(): JSX.Element {
  const navigate = useNavigate();
  const { artworkId } = useParams();

  const artwork = artworks.find((a) => a.id === artworkId);
  const location = locations.find((l) => l.id === artwork?.location);

  // Find position in timeline
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

  if (!artwork) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl text-text-primary mb-4">
            Artwork not found
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="font-body text-text-muted hover:text-text-primary transition-colors"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="text-text-muted hover:text-text-primary transition-colors mb-6 font-body text-sm"
        >
          ← Back
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Artwork image */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PlaceholderArtwork
              color={artwork.placeholderColor}
              aspectRatio={artwork.aspectRatio}
              className="w-full max-w-2xl mx-auto shadow-glass"
            />
          </motion.div>

          {/* Metadata panel */}
          <motion.div
            className="lg:w-96 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <h1 className="font-heading text-3xl text-text-primary mb-2">
                {artwork.title}
              </h1>
              <p className="font-heading text-xl text-text-secondary">
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

            <GlassCard className="p-5 space-y-4" hover={false}>
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
                <p className="font-body text-text-primary">
                  {artwork.dimensions}
                </p>
              </div>

              {location && (
                <div>
                  <p className="font-body text-text-muted text-xs uppercase tracking-wider mb-1">
                    Location Created
                  </p>
                  <button
                    onClick={() => navigate(`/locations/${location.id}`)}
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
                <p className="font-body text-text-primary">
                  {artwork.collection}
                </p>
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
                        onClick={() => navigate(`/themes/${themeId}`)}
                        className="glass-pill px-3 py-1 text-xs font-body text-text-secondary hover:text-text-primary transition-colors"
                      >
                        {themeId.replace(/-/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Mini timeline */}
            {timelinePosition && (
              <GlassCard className="p-5" hover={false}>
                <p className="font-body text-text-muted text-xs uppercase tracking-wider mb-3">
                  Position in Career
                </p>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-text-primary rounded-full transition-all"
                    style={{ width: `${timelinePosition.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-body text-text-muted text-xs">1963</span>
                  <span className="font-body text-text-primary text-xs font-medium">
                    {artwork.year}
                  </span>
                  <span className="font-body text-text-muted text-xs">2004</span>
                </div>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default ArtworkDetailPage;
