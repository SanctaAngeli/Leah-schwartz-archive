import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PlaceholderArtwork from '../ui/PlaceholderArtwork';
import type { Artwork } from '../../types';

interface EraPileProps {
  title: string;
  subtitle: string;
  artworks: Artwork[];
  index: number;
  eraId: string;
}

function EraPile({ title, subtitle, artworks, index, eraId }: EraPileProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Get preview artworks for the pile (top 5 for better fan effect)
  const previewArtworks = artworks.slice(0, 5);

  // Pile card positions when collapsed - centered stack
  const collapsedPositions = [
    { x: 0, y: 0, rotate: -2, scale: 1 },
    { x: 0, y: -8, rotate: 2, scale: 0.96 },
    { x: 0, y: -16, rotate: -1, scale: 0.92 },
    { x: 0, y: -24, rotate: 1.5, scale: 0.88 },
    { x: 0, y: -32, rotate: -0.5, scale: 0.84 },
  ];

  // Fan-out positions on hover - artworks spread beautifully
  const expandedPositions = [
    { x: 0, y: 0, rotate: 0, scale: 1 },
    { x: -90, y: -30, rotate: -12, scale: 0.85 },
    { x: 90, y: -30, rotate: 12, scale: 0.85 },
    { x: -140, y: -80, rotate: -20, scale: 0.7 },
    { x: 140, y: -80, rotate: 20, scale: 0.7 },
  ];

  const handleClick = (): void => {
    navigate(`/curated/${eraId}`);
  };

  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.15, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Era title - always visible */}
      <motion.div className="text-center mb-8">
        <h2 className="font-heading text-3xl text-text-primary mb-1">
          {title}
        </h2>
        <p className="font-body text-text-muted text-sm tracking-wider">
          {subtitle}
        </p>
      </motion.div>

      {/* Pile view with hover fan-out effect */}
      <motion.button
        className="relative w-[280px] aspect-[3/4] cursor-pointer group"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileTap={{ scale: 0.98 }}
        aria-label={`View ${title} collection - ${artworks.length} works`}
      >
        {/* Stacked artwork cards with fan-out animation */}
        {previewArtworks.map((artwork, i) => {
          const collapsed = collapsedPositions[i];
          const expanded = expandedPositions[i];

          return (
            <motion.div
              key={artwork.id}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ zIndex: previewArtworks.length - i }}
              animate={{
                x: isHovered ? expanded.x : collapsed.x,
                y: isHovered ? expanded.y : collapsed.y,
                rotate: isHovered ? expanded.rotate : collapsed.rotate,
                scale: isHovered ? expanded.scale : collapsed.scale,
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                mass: 0.8,
              }}
            >
              <div className="w-full h-full rounded-xl overflow-hidden shadow-lg">
                <PlaceholderArtwork
                  color={artwork.placeholderColor}
                  aspectRatio="portrait"
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          );
        })}

        {/* Hover overlay with action prompt */}
        <motion.div
          className="absolute inset-0 z-20 flex items-end justify-center pb-8 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="glass-pill px-6 py-3 shadow-xl"
            initial={{ y: 10, opacity: 0 }}
            animate={{
              y: isHovered ? 0 : 10,
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
          >
            <span className="text-text-primary font-medium text-sm">
              Explore {artworks.length} works →
            </span>
          </motion.div>
        </motion.div>
      </motion.button>
    </motion.div>
  );
}

export default EraPile;
