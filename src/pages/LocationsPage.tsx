import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import PlaceholderArtwork from '../components/ui/PlaceholderArtwork';
import SFBayAreaMap from '../components/locations/SFBayAreaMap';
import artworksData from '../data/artworks.json';
import locationsData from '../data/locations.json';
import type { Artwork, Location } from '../types';

const artworks = artworksData as Artwork[];
const locations = locationsData as Location[];

function LocationsPage(): JSX.Element {
  const navigate = useNavigate();
  const { locationId } = useParams();

  const selectedLocation = locationId
    ? locations.find((l) => l.id === locationId)
    : null;

  const locationArtworks = useMemo(() => {
    if (!locationId) return [];
    return artworks.filter((a) => a.location === locationId);
  }, [locationId]);

  const getHeroArtwork = (location: Location): Artwork | undefined => {
    return artworks.find((a) => a.id === location.heroArtworkId);
  };

  // Artwork counts per location for map
  const artworkCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    locations.forEach((loc) => {
      counts[loc.id] = artworks.filter((a) => a.location === loc.id).length;
    });
    return counts;
  }, []);

  // View mode toggle
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');

  // Location grid view
  if (!selectedLocation) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-6">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="font-heading text-4xl text-text-primary mb-2">
              Locations
            </h1>
            <p className="font-body text-text-muted">
              Explore works by the places that inspired them
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex justify-center mb-8">
            <div className="glass-pill p-1 flex gap-1">
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-text-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Map View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-text-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Grid View
              </button>
            </div>
          </div>

          {/* Map View */}
          {viewMode === 'map' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-12"
            >
              <SFBayAreaMap locations={locations} artworkCounts={artworkCounts} />
            </motion.div>
          )}

          {/* Grid View */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${viewMode === 'map' ? 'mt-8' : ''}`}>
            {locations.map((location, index) => {
              const heroArtwork = getHeroArtwork(location);
              const artworkCount = artworks.filter(
                (a) => a.location === location.id
              ).length;

              return (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassCard
                    variant="image"
                    className="cursor-pointer overflow-hidden p-0 rounded-2xl"
                    onClick={() => navigate(`/locations/${location.id}`)}
                  >
                    <div className="relative">
                      <div
                        className="w-full aspect-[4/3]"
                        style={{
                          backgroundColor:
                            heroArtwork?.placeholderColor || '#9B8B7A',
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h2 className="font-heading text-2xl text-white mb-1">
                          {location.name}
                        </h2>
                        <p className="font-body text-white/80 text-sm">
                          {artworkCount} works
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  // Selected location view
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={() => navigate('/locations')}
          className="text-text-muted hover:text-text-primary transition-colors mb-6 font-body text-sm"
        >
          ← All Locations
        </button>

        <div className="mb-12">
          <h1 className="font-heading text-4xl text-text-primary mb-2">
            {selectedLocation.name}
          </h1>
          {selectedLocation.description && (
            <p className="font-body text-text-muted">
              {selectedLocation.description}
            </p>
          )}
          <p className="font-body text-text-secondary mt-2">
            {locationArtworks.length} works
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {locationArtworks.map((artwork, index) => (
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
                {artwork.year}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default LocationsPage;
