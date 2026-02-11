import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import PlaceholderArtwork from '../components/ui/PlaceholderArtwork';
import artworksData from '../data/artworks.json';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

function FavoritesPage(): JSX.Element {
  const navigate = useNavigate();
  const { favorites, removeFavorite, clearFavorites } = useFavorites();

  const favoriteArtworks = artworks.filter(a => favorites.includes(a.id));

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl text-text-primary mb-2">
              My Collection
            </h1>
            <p className="font-body text-text-muted">
              {favorites.length} {favorites.length === 1 ? 'artwork' : 'artworks'} saved
            </p>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={clearFavorites}
              className="glass-pill px-4 py-2 text-sm text-text-secondary
                hover:text-text-primary transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Empty state */}
        {favorites.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100
              flex items-center justify-center">
              <svg className="w-10 h-10 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="font-heading text-xl text-text-primary mb-2">
              No favorites yet
            </h2>
            <p className="font-body text-text-muted mb-6">
              Click the heart icon on any artwork to add it to your collection
            </p>
            <button
              onClick={() => navigate('/gallery')}
              className="glass-pill px-6 py-3 text-text-primary font-medium
                hover:bg-white/90 transition-colors"
            >
              Explore Gallery
            </button>
          </motion.div>
        ) : (
          /* Favorites grid */
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {favoriteArtworks.map((artwork) => (
              <motion.div
                key={artwork.id}
                className="group relative"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <PlaceholderArtwork
                  color={artwork.placeholderColor}
                  aspectRatio={artwork.aspectRatio}
                  onClick={() => navigate(`/artwork/${artwork.id}`)}
                  className="shadow-soft group-hover:shadow-glass transition-all duration-300"
                />

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(artwork.id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full
                    bg-white/90 backdrop-blur-sm shadow-md
                    flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity
                    hover:bg-red-50"
                  aria-label={`Remove ${artwork.title} from favorites`}
                >
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3
                  opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                    <p className="text-sm font-body text-text-primary truncate">
                      {artwork.title}
                    </p>
                    <p className="text-xs font-body text-text-muted">
                      {artwork.year}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default FavoritesPage;
