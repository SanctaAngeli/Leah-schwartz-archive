import { motion } from 'framer-motion';
import { FloatingArtworks } from './FloatingArtworks';
import { MuseumCorridor } from './MuseumCorridor';
import type { Artwork } from '../../types';

interface ZAxisEntranceProps {
  progress: number; // 0 to 1
  artworks: Artwork[];
  onEnterClick?: () => void;
}

export function ZAxisEntrance({
  progress,
  artworks,
  onEnterClick,
}: ZAxisEntranceProps): JSX.Element {
  // Phase 1: Floating artworks (progress 0 - 0.15)
  // Phase 2: Corridor fly-through (progress 0.15 - 1.0)

  const floatingOpacity = Math.max(0, 1 - progress * 6); // Fades out by progress 0.15
  const corridorOpacity = Math.min(1, Math.max(0, (progress - 0.1) * 8)); // Fades in around 0.1-0.25

  // Corridor progress (0-1 mapped from overall progress 0.15-1.0)
  const corridorProgress = Math.max(0, (progress - 0.15) / 0.85);

  // Title fades as corridor begins
  const titleOpacity = Math.max(0, 1 - progress * 5);
  const titleScale = Math.max(0.6, 1 - progress * 1);

  // Button fades quickly
  const buttonOpacity = Math.max(0, 1 - progress * 8);

  // Is the corridor actively showing?
  const showCorridor = progress > 0.08;

  return (
    <div className="fixed inset-0 bg-gallery overflow-hidden">
      {/* Phase 1: Floating artworks - visible before entering */}
      {floatingOpacity > 0 && (
        <FloatingArtworks
          artworks={artworks}
          opacity={floatingOpacity}
        />
      )}

      {/* Phase 2: Museum corridor - appears after clicking enter */}
      {showCorridor && (
        <MuseumCorridor
          artworks={artworks}
          progress={corridorProgress}
          opacity={corridorOpacity}
        />
      )}

      {/* Title overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
        <motion.div
          className="text-center pointer-events-auto"
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: titleOpacity, scale: titleScale }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="font-heading text-[clamp(52px,14vw,160px)] text-text-primary leading-none tracking-tight"
            style={{
              textShadow: '0 4px 60px rgba(255,255,255,0.95), 0 2px 20px rgba(255,255,255,0.9)',
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            Leah Schwartz
          </motion.h1>
          <motion.p
            className="font-body text-text-muted text-xl md:text-2xl mt-6 tracking-[0.35em] uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            1945 – 2004
          </motion.p>
        </motion.div>

        {/* Enter button - the ONLY way to enter */}
        <motion.button
          className="mt-20 glass-pill px-14 py-7 font-body text-lg text-text-secondary hover:text-text-primary transition-all duration-300 pointer-events-auto"
          style={{ opacity: buttonOpacity }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: buttonOpacity, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          whileHover={{ scale: 1.08, y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnterClick}
          disabled={progress > 0.05}
        >
          Enter the Archive
        </motion.button>
      </div>

      {/* Speed effects during corridor flight */}
      {corridorProgress > 0.1 && corridorProgress < 0.9 && (
        <div
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            boxShadow: `inset 0 0 ${60 + corridorProgress * 100}px rgba(250, 250, 250, ${corridorProgress * 0.6})`,
          }}
        />
      )}

      {/* Final white fade - seamless transition */}
      {corridorProgress > 0.88 && (
        <motion.div
          className="absolute inset-0 bg-white pointer-events-none z-60"
          style={{
            opacity: Math.pow((corridorProgress - 0.88) / 0.12, 0.6),
          }}
        />
      )}
    </div>
  );
}

export default ZAxisEntrance;
