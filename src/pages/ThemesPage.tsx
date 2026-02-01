import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import GlassCard from '../components/ui/GlassCard';
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
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl text-text-primary mb-2">
              Themes & Materials
            </h1>
            <p className="font-body text-text-muted">
              Explore works by subject and medium
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassCard
                    className="cursor-pointer overflow-hidden p-0"
                    onClick={() => navigate(`/themes/${theme.id}`)}
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
                          {theme.name}
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
