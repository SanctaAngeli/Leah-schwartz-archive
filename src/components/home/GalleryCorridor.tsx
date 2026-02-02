import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Artwork } from '../../types';

interface CorridorArtwork extends Artwork {
  side: 'left' | 'right';
  depth: number; // 0 = closest, 1 = furthest
  verticalOffset: number;
}

interface GalleryCorridorProps {
  artworks: Artwork[];
  progress: number; // 0 to 1
}

function distributeArtworks(artworks: Artwork[]): CorridorArtwork[] {
  // Take up to 20 artworks (10 per side)
  const selected = artworks.slice(0, 20);

  return selected.map((artwork, index) => {
    const side = index % 2 === 0 ? 'left' : 'right';
    // Distribute evenly along the corridor depth
    const depth = Math.floor(index / 2) / Math.ceil(selected.length / 2);
    // Slight vertical variation
    const verticalOffset = ((index % 3) - 1) * 30;

    return {
      ...artwork,
      side,
      depth,
      verticalOffset,
    };
  });
}

export function GalleryCorridor({
  artworks,
  progress,
}: GalleryCorridorProps): JSX.Element {
  const corridorArtworks = useMemo(
    () => distributeArtworks(artworks),
    [artworks]
  );

  // Perspective container styles
  const perspectiveDepth = 1000;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        perspective: `${perspectiveDepth}px`,
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* Corridor floor/ceiling lines for depth perception */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(200, 200, 200, ${0.1 * progress}) 0%,
              transparent 20%,
              transparent 80%,
              rgba(200, 200, 200, ${0.1 * progress}) 100%
            )
          `,
        }}
      />

      {/* Left and right walls with artworks */}
      {corridorArtworks.map((artwork) => {
        // Calculate 3D position based on depth and progress
        // As progress increases, artworks "pass by" the viewer
        const passProgress = Math.min(1, progress * 2 - artwork.depth);
        const isVisible = passProgress > -0.5 && passProgress < 1.2;

        if (!isVisible) return null;

        // Calculate transform based on side and depth
        const xBase = artwork.side === 'left' ? -45 : 45;
        const xOffset = artwork.side === 'left' ? -100 : 100;

        // As artwork passes, it moves to the side and rotates
        const rotateY = artwork.side === 'left' ? 25 : -25;
        const additionalRotate = passProgress > 0.5 ? (passProgress - 0.5) * 60 : 0;
        const finalRotateY =
          artwork.side === 'left'
            ? rotateY - additionalRotate
            : rotateY + additionalRotate;

        // Z position - starts far, comes close, then passes
        const z = (1 - artwork.depth) * 600 - progress * 800;

        // Scale based on z position (perspective)
        const scale = Math.max(0.3, Math.min(1.5, 1 + z / 1000));

        // Opacity fade in/out
        const opacityFromDepth = passProgress < 0 ? 0.5 + passProgress : 1;
        const opacityFromPass = passProgress > 0.7 ? 1 - (passProgress - 0.7) * 3 : 1;
        const opacity = Math.max(0, Math.min(1, opacityFromDepth * opacityFromPass));

        // Aspect ratio
        const aspectMultiplier =
          artwork.aspectRatio === 'portrait'
            ? 1.4
            : artwork.aspectRatio === 'landscape'
              ? 0.7
              : 1;

        const size = 120;

        return (
          <motion.div
            key={artwork.id}
            className="absolute rounded-lg shadow-glass"
            style={{
              backgroundColor: artwork.placeholderColor,
              width: size,
              height: size * aspectMultiplier,
              left: '50%',
              top: '50%',
              transformStyle: 'preserve-3d',
              transform: `
                translate(-50%, -50%)
                translateX(${xBase + passProgress * xOffset}vw)
                translateY(${artwork.verticalOffset}px)
                translateZ(${z}px)
                rotateY(${finalRotateY}deg)
                scale(${scale})
              `,
              opacity,
              boxShadow: `
                0 4px 20px rgba(0, 0, 0, ${0.1 * opacity}),
                inset 0 0 0 1px rgba(255, 255, 255, 0.1)
              `,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity }}
            transition={{ duration: 0.3 }}
          >
            {/* Frame effect */}
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                border: '3px solid rgba(255, 255, 255, 0.3)',
                boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.1)',
              }}
            />
          </motion.div>
        );
      })}

      {/* Vanishing point glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background: `radial-gradient(circle, rgba(255,255,255,${0.8 * progress}) 0%, transparent 70%)`,
          transform: `translateZ(${-500 + progress * 200}px)`,
        }}
      />
    </div>
  );
}

export default GalleryCorridor;
