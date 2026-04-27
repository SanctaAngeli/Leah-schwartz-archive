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

function LocationsPage(): JSX.Element {
  const navigate = useNavigate();
  const { locationId } = useParams();

  const selectedLocation = locationId
    ? locations.find((l) => l.id === locationId)
    : null;

  // Bay Area rolls up the non-travel chapters from Leah's book
  const BAY_AREA_CHAPTERS = new Set([
    'landscape', 'on-the-road', 'street-scenes', 'interiors',
    'flowers', 'portraits', 'still-life', 'old-stuff',
    'abstract', 'social-comment',
  ]);

  const locationArtworks = useMemo(() => {
    if (!locationId) return [];
    if (locationId === 'bay-area') {
      return artworks.filter((a) => a.chapter && BAY_AREA_CHAPTERS.has(a.chapter) && !a.region);
    }
    // Travel regions
    return artworks.filter((a) => a.region === locationId);
  }, [locationId]);

  const getHeroArtwork = (location: Location): Artwork | undefined => {
    return artworks.find((a) => a.id === location.heroArtworkId);
  };

  // Artwork counts per location (mirrors the locationArtworks filter)
  const artworkCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    locations.forEach((loc) => {
      if (loc.id === 'bay-area') {
        counts[loc.id] = artworks.filter(
          (a) => a.chapter && BAY_AREA_CHAPTERS.has(a.chapter) && !a.region
        ).length;
      } else {
        counts[loc.id] = artworks.filter((a) => a.region === loc.id).length;
      }
    });
    return counts;
  }, []);

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
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="font-body text-text-muted text-sm tracking-[0.25em] uppercase mb-3">
              Where she worked
            </p>
            <h1 className="font-heading text-5xl md:text-6xl text-text-primary leading-tight">
              Locations
            </h1>
            <p className="font-body text-text-secondary mt-6 leading-relaxed">
              Home in the Bay Area and eleven countries beyond. Open any region to see the works made there.
              For individual places (Mt. Tam, Bolinas, Naxos, Kyoto…), visit{' '}
              <a href="/places" className="underline decoration-[#D5C6A8] underline-offset-4 hover:decoration-[#8B7355]">Places</a>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location, index) => {
              const heroArtwork = getHeroArtwork(location);
              const artworkCount = artworkCounts[location.id] ?? 0;

              return (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                >
                  <GlassCard
                    variant="image"
                    className="cursor-pointer overflow-hidden p-0 rounded-2xl"
                    onClick={() => navigate(`/locations/${location.id}`)}
                  >
                    <div className="relative">
                      <div
                        className="w-full aspect-[4/3] relative"
                        style={{ backgroundColor: heroArtwork?.placeholderColor || '#9B8B7A' }}
                      >
                        {heroArtwork?.imagePath && (
                          <img
                            src={heroArtwork.thumbPath || heroArtwork.imagePath}
                            alt={location.name}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h2 className="font-heading text-2xl text-white mb-1 drop-shadow-md">
                          {location.name}
                        </h2>
                        <p className="font-body text-white/85 text-sm drop-shadow">
                          {artworkCount} {artworkCount === 1 ? 'work' : 'works'}
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
                src={artwork.thumbPath || artwork.imagePath}
                alt={artwork.title}
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
