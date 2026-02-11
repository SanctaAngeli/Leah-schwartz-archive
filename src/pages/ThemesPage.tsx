import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import PlaceholderArtwork from '../components/ui/PlaceholderArtwork';
import artworksData from '../data/artworks.json';
import themesData from '../data/themes.json';
import type { Artwork, Theme } from '../types';

const artworks = artworksData as Artwork[];
const themes = themesData as Theme[];

function ThemesPage(): JSX.Element {
  const navigate = useNavigate();
  const { themeId } = useParams();

  const selectedTheme = themeId ? themes.find((t) => t.id === themeId) : null;

  const themeArtworks = useMemo(() => {
    if (!themeId) return [];
    return artworks.filter((a) => a.themes.includes(themeId));
  }, [themeId]);

  const getHeroArtwork = (theme: Theme): Artwork | undefined => {
    return artworks.find((a) => a.id === theme.heroArtworkId);
  };

  // Theme grid view
  if (!selectedTheme) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-6">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <p className="font-body text-text-muted text-sm tracking-[0.25em] uppercase mb-4">
              Explore by
            </p>
            <h1 className="font-heading text-[clamp(32px,6vw,48px)] text-text-primary leading-tight">
              Themes & Materials
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {themes.map((theme, index) => {
              const heroArtwork = getHeroArtwork(theme);
              const artworkCount = artworks.filter((a) =>
                a.themes.includes(theme.id)
              ).length;

              return (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/themes/${theme.id}`)}
                >
                  {/* Artwork preview with soft styling */}
                  <div className="relative overflow-hidden rounded-2xl shadow-soft group-hover:shadow-glass transition-shadow duration-500">
                    <div
                      className="w-full aspect-[4/3] transition-transform duration-700 group-hover:scale-105"
                      style={{
                        backgroundColor:
                          heroArtwork?.placeholderColor || '#9B8B7A',
                      }}
                    />
                    {/* Softer gradient - more natural feel */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>

                  {/* Text below image - cleaner, more natural */}
                  <div className="mt-4 px-1">
                    <h2 className="font-heading text-xl text-text-primary group-hover:text-text-secondary transition-colors">
                      {theme.name}
                    </h2>
                    <p className="font-body text-text-muted text-sm mt-1">
                      {artworkCount} works
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  // Selected theme view
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={() => navigate('/themes')}
          className="text-text-muted hover:text-text-primary transition-colors mb-6 font-body text-sm"
        >
          ← All Themes
        </button>

        <div className="mb-12">
          <h1 className="font-heading text-4xl text-text-primary mb-2">
            {selectedTheme.name}
          </h1>
          {selectedTheme.description && (
            <p className="font-body text-text-muted">
              {selectedTheme.description}
            </p>
          )}
          <p className="font-body text-text-secondary mt-2">
            {themeArtworks.length} works
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {themeArtworks.map((artwork, index) => (
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

export default ThemesPage;
