import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PlaceholderArtwork from '../ui/PlaceholderArtwork';
import type { Artwork } from '../../types';

interface EraPileProps {
  title: string;
  subtitle: string;
  artworks: Artwork[];
  index: number;
}

function EraPile({ title, subtitle, artworks, index }: EraPileProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on click outside
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (e: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded]);

  // Get preview artworks for the pile (top 4)
  const previewArtworks = artworks.slice(0, 4);

  // Pile card positions and rotations
  const pilePositions = [
    { x: 0, y: 0, rotate: -3, scale: 1 },
    { x: 8, y: -4, rotate: 2, scale: 0.97 },
    { x: -6, y: -8, rotate: -1, scale: 0.94 },
    { x: 4, y: -12, rotate: 3, scale: 0.91 },
  ];

  return (
    <motion.div
      ref={containerRef}
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.15, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Era title - always visible */}
      <motion.div
        className="text-center mb-8"
        animate={{ opacity: isExpanded ? 0.5 : 1 }}
      >
        <h2 className="font-heading text-3xl text-text-primary mb-1">
          {title}
        </h2>
        <p className="font-body text-text-muted text-sm tracking-wider">
          {subtitle}
        </p>
      </motion.div>

      {/* Collapsed pile view */}
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="pile"
            className="relative w-full max-w-[280px] mx-auto aspect-[3/4] cursor-pointer group"
            onClick={() => setIsExpanded(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            aria-label={`Expand ${title} collection`}
          >
            {/* Stacked artwork cards */}
            {previewArtworks.map((artwork, i) => {
              const pos = pilePositions[i];
              return (
                <motion.div
                  key={artwork.id}
                  className="absolute inset-0"
                  style={{ zIndex: previewArtworks.length - i }}
                  initial={pos}
                  animate={{
                    x: pos.x,
                    y: pos.y,
                    rotate: pos.rotate,
                    scale: pos.scale,
                  }}
                  whileHover={{
                    y: pos.y - 4,
                    transition: { duration: 0.2 },
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                >
                  <div
                    className="w-full h-full rounded-xl overflow-hidden shadow-lg"
                    style={{ backgroundColor: artwork.placeholderColor }}
                  />
                </motion.div>
              );
            })}

            {/* Hover overlay with count */}
            <motion.div
              className="absolute inset-0 z-20 flex items-center justify-center rounded-xl
                bg-black/0 group-hover:bg-black/30 transition-colors duration-300"
              style={{ x: 0, y: 0 }}
            >
              <motion.div
                className="glass-pill px-5 py-2.5 opacity-0 group-hover:opacity-100
                  transition-opacity duration-300"
              >
                <span className="text-text-primary font-medium text-sm">
                  View {artworks.length} works
                </span>
              </motion.div>
            </motion.div>
          </motion.button>
        ) : (
          /* Expanded grid view */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Close button */}
            <motion.button
              className="absolute -top-12 right-0 glass-pill px-4 py-2 z-10
                text-text-secondary hover:text-text-primary transition-colors"
              onClick={() => setIsExpanded(false)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              aria-label="Collapse gallery"
            >
              <span className="text-sm font-medium">Close</span>
            </motion.button>

            {/* Expanded artwork grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.03,
                  },
                },
              }}
            >
              {artworks.map((artwork) => (
                <motion.div
                  key={artwork.id}
                  className="group relative"
                  variants={{
                    hidden: {
                      opacity: 0,
                      scale: 0.8,
                      y: 20,
                    },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      },
                    },
                  }}
                >
                  <PlaceholderArtwork
                    color={artwork.placeholderColor}
                    aspectRatio={artwork.aspectRatio}
                    onClick={() => navigate(`/artwork/${artwork.id}`)}
                    className="shadow-soft group-hover:shadow-glass transition-all duration-300
                      group-hover:scale-[1.03]"
                  />

                  {/* Hover info overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-3
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-body truncate drop-shadow-lg">
                      {artwork.title}
                    </p>
                    <p className="text-white/80 text-xs font-body">
                      {artwork.year} · {artwork.medium}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default EraPile;
