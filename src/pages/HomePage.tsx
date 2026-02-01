import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import artworksData from '../data/artworks.json';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const featuredArtworks = artworks.filter((a) => a.featured).slice(0, 12);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20">
      {/* Floating artwork collage behind title */}
      <div className="absolute inset-0 pointer-events-none">
        {featuredArtworks.map((artwork, index) => {
          const angle = (index / featuredArtworks.length) * Math.PI * 2;
          const radius = 250 + (index % 3) * 80;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const rotation = (index - 6) * 5;
          const size = 80 + (index % 4) * 30;

          return (
            <motion.div
              key={artwork.id}
              className="absolute rounded-lg"
              style={{
                backgroundColor: artwork.placeholderColor,
                width: size,
                height: size * (artwork.aspectRatio === 'portrait' ? 1.33 : artwork.aspectRatio === 'landscape' ? 0.75 : 1),
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 0.7,
                scale: 1,
                x: [0, 10, -5, 0],
                y: [0, -5, 10, 0],
              }}
              transition={{
                opacity: { duration: 1, delay: index * 0.1 },
                scale: { duration: 1, delay: index * 0.1 },
                x: { duration: 20 + index * 2, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: 25 + index * 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            />
          );
        })}
      </div>

      {/* Main title */}
      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <h1 className="font-heading text-[clamp(48px,10vw,120px)] text-text-primary leading-none tracking-tight">
          Leah Schwartz
        </h1>
        <p className="font-body text-text-muted text-lg mt-4 tracking-widest uppercase">
          1945 – 2004
        </p>
      </motion.div>

      {/* Enter button */}
      <motion.button
        className="relative z-10 mt-12 glass-pill px-8 py-4 font-body text-text-secondary hover:text-text-primary transition-colors duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/gallery')}
      >
        Enter the Archive
      </motion.button>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { duration: 1, delay: 1 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <div className="w-6 h-10 border-2 border-text-muted/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-text-muted/50 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}

export default HomePage;
