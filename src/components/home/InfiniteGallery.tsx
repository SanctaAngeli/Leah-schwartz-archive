import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Artwork } from '../../types';

interface FloatingArtwork extends Artwork {
  x: number;
  y: number;
  rotation: number;
  size: number;
  depth: number; // 0-1, affects opacity and z-index
  driftX: number[];
  driftY: number[];
  driftRotation: number[];
  driftDuration: number;
}

interface InfiniteGalleryProps {
  artworks: Artwork[];
  progress?: number; // 0-1, for z-axis transition
  className?: string;
}

// Seeded random function for consistent layouts
function seededRandom(seed: number): () => number {
  return function (): number {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function generateFloatingArtworks(artworks: Artwork[]): FloatingArtwork[] {
  // Use current hour as seed for daily variation
  const seed = Math.floor(Date.now() / (1000 * 60 * 60));
  const random = seededRandom(seed);

  return artworks.map((artwork, index) => {
    // Distribute artworks in organic clusters
    const cluster = index % 4;
    const baseAngle = (cluster / 4) * Math.PI * 2 + random() * 0.5;
    const radius = 180 + random() * 200;

    // Calculate base position with some randomness
    const x = Math.cos(baseAngle) * radius + (random() - 0.5) * 100;
    const y = Math.sin(baseAngle) * radius + (random() - 0.5) * 100;

    // Vary sizes organically
    const size = 70 + random() * 80;

    // Random initial rotation (-15 to 15 degrees)
    const rotation = (random() - 0.5) * 30;

    // Depth for parallax effect (closer = more visible)
    const depth = 0.4 + random() * 0.6;

    // Generate organic drift paths
    const driftAmplitude = 15 + random() * 20;
    const driftX = [
      0,
      driftAmplitude * (random() - 0.5),
      driftAmplitude * (random() - 0.5),
      0,
    ];
    const driftY = [
      0,
      driftAmplitude * (random() - 0.5),
      driftAmplitude * (random() - 0.5),
      0,
    ];
    const driftRotation = [
      rotation,
      rotation + (random() - 0.5) * 8,
      rotation + (random() - 0.5) * 8,
      rotation,
    ];
    const driftDuration = 15 + random() * 15;

    return {
      ...artwork,
      x,
      y,
      rotation,
      size,
      depth,
      driftX,
      driftY,
      driftRotation,
      driftDuration,
    };
  });
}

export function InfiniteGallery({
  artworks,
  progress = 0,
  className = '',
}: InfiniteGalleryProps): JSX.Element {
  const floatingArtworks = useMemo(
    () => generateFloatingArtworks(artworks),
    [artworks]
  );

  // Sort by depth for proper layering
  const sortedArtworks = useMemo(
    () => [...floatingArtworks].sort((a, b) => a.depth - b.depth),
    [floatingArtworks]
  );

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {sortedArtworks.map((artwork, index) => {
        // Calculate aspect ratio multiplier
        const aspectMultiplier =
          artwork.aspectRatio === 'portrait'
            ? 1.33
            : artwork.aspectRatio === 'landscape'
              ? 0.75
              : 1;

        // Z-axis transition effects
        // As progress increases: artworks scale up, move outward, and fade
        const zScale = 1 + progress * 2 * artwork.depth;
        const zX = artwork.x * (1 + progress * 3);
        const zY = artwork.y * (1 + progress * 2);
        const zOpacity = Math.max(0, (0.5 + artwork.depth * 0.4) * (1 - progress * 1.5));
        const zBlur = progress * 10 * (1 - artwork.depth);

        return (
          <motion.div
            key={artwork.id}
            className="absolute rounded-lg shadow-soft"
            style={{
              backgroundColor: artwork.placeholderColor,
              width: artwork.size,
              height: artwork.size * aspectMultiplier,
              left: '50%',
              top: '50%',
              zIndex: Math.floor(artwork.depth * 10),
              filter: zBlur > 0 ? `blur(${zBlur}px)` : undefined,
            }}
            initial={{
              opacity: 0,
              scale: 0.6,
              x: artwork.x,
              y: artwork.y,
              rotate: artwork.rotation,
            }}
            animate={{
              opacity: zOpacity,
              scale: zScale,
              x: [zX, zX + artwork.driftX[1], zX + artwork.driftX[2], zX],
              y: [zY, zY + artwork.driftY[1], zY + artwork.driftY[2], zY],
              rotate: artwork.driftRotation,
            }}
            transition={{
              opacity: { duration: 0.8, delay: index * 0.05 },
              scale: { duration: 0.8, delay: index * 0.05 },
              x: {
                duration: artwork.driftDuration,
                repeat: Infinity,
                ease: [0.37, 0, 0.63, 1], // --ease-drift
              },
              y: {
                duration: artwork.driftDuration * 1.1,
                repeat: Infinity,
                ease: [0.37, 0, 0.63, 1],
              },
              rotate: {
                duration: artwork.driftDuration * 0.9,
                repeat: Infinity,
                ease: [0.37, 0, 0.63, 1],
              },
            }}
          />
        );
      })}
    </div>
  );
}

export default InfiniteGallery;
