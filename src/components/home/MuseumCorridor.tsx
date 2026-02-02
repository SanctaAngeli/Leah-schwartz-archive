import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Artwork } from '../../types';

interface CorridorArtwork {
  artwork: Artwork;
  side: 'left' | 'right';
  z: number;
  y: number;
  size: number;
}

interface MuseumCorridorProps {
  artworks: Artwork[];
  progress: number;
  opacity?: number;
}

// Corridor configuration
const CORRIDOR_LENGTH = 4800;
const WALL_OFFSET = 28; // Distance from center to walls

function generateCorridorArtworks(artworks: Artwork[]): CorridorArtwork[] {
  const result: CorridorArtwork[] = [];

  // We need to fill the ENTIRE corridor with art on BOTH walls
  // Use more artworks and space them properly to avoid overlap

  const artworkSpacing = 280; // Minimum spacing between artworks on same wall
  const totalDepth = CORRIDOR_LENGTH - 200; // Leave some room at start

  // Calculate how many artworks per wall
  const artworksPerWall = Math.floor(totalDepth / artworkSpacing);

  // Generate LEFT wall artworks
  for (let i = 0; i < artworksPerWall && i < artworks.length; i++) {
    const z = -150 - i * artworkSpacing;

    // Varied vertical positions
    const yVariance = ((i % 5) - 2) * 20;

    // MORE size variance: 120 to 280
    const sizeBase = 120 + ((i * 7) % 160);

    result.push({
      artwork: artworks[i],
      side: 'left',
      z,
      y: yVariance,
      size: sizeBase,
    });
  }

  // Generate RIGHT wall artworks - offset by half spacing for visual interest
  const rightOffset = artworkSpacing / 2;
  for (let i = 0; i < artworksPerWall && (artworksPerWall + i) < artworks.length; i++) {
    const z = -150 - rightOffset - i * artworkSpacing;

    // Different vertical variance pattern
    const yVariance = (((i + 2) % 5) - 2) * 20;

    // Different size pattern
    const sizeBase = 140 + (((i + 3) * 7) % 140);

    result.push({
      artwork: artworks[artworksPerWall + i],
      side: 'right',
      z,
      y: yVariance,
      size: sizeBase,
    });
  }

  return result;
}

export function MuseumCorridor({
  artworks,
  progress,
  opacity = 1,
}: MuseumCorridorProps): JSX.Element {
  const corridorArtworks = useMemo(
    () => generateCorridorArtworks(artworks),
    [artworks]
  );

  // Camera flies through the corridor
  const cameraZ = progress * (CORRIDOR_LENGTH - 300);

  // The final artwork we fly into
  const finalArtwork = artworks[0];

  // Enter phase - flying INTO the final artwork (last 10% of progress)
  const enterPhase = Math.max(0, (progress - 0.9) / 0.1);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        perspective: '800px',
        perspectiveOrigin: '50% 50%',
        opacity,
      }}
    >
      {/* Corridor container */}
      <div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateZ(${cameraZ}px)`,
        }}
      >
        {/* Floor */}
        <div
          className="absolute left-0 right-0"
          style={{
            height: '80vh',
            top: '50%',
            transformStyle: 'preserve-3d',
            transform: 'rotateX(90deg) translateZ(-28vh)',
            background: `linear-gradient(
              to bottom,
              rgba(235, 232, 228, 0.5) 0%,
              rgba(242, 240, 238, 0.25) 50%,
              transparent 100%
            )`,
            transformOrigin: 'top center',
          }}
        />

        {/* Ceiling */}
        <div
          className="absolute left-0 right-0"
          style={{
            height: '80vh',
            bottom: '50%',
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-90deg) translateZ(-28vh)',
            background: `linear-gradient(
              to top,
              rgba(252, 252, 252, 0.4) 0%,
              rgba(250, 250, 250, 0.15) 50%,
              transparent 100%
            )`,
            transformOrigin: 'bottom center',
          }}
        />

        {/* Left wall */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            width: `${CORRIDOR_LENGTH}px`,
            left: '50%',
            transformStyle: 'preserve-3d',
            transform: `translateX(-${WALL_OFFSET}vw) rotateY(90deg)`,
            transformOrigin: 'left center',
            background: 'linear-gradient(to right, rgba(252,252,252,1) 0%, rgba(254,254,254,0.98) 100%)',
          }}
        />

        {/* Right wall */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            width: `${CORRIDOR_LENGTH}px`,
            left: '50%',
            transformStyle: 'preserve-3d',
            transform: `translateX(${WALL_OFFSET}vw) rotateY(-90deg)`,
            transformOrigin: 'right center',
            background: 'linear-gradient(to left, rgba(252,252,252,1) 0%, rgba(254,254,254,0.98) 100%)',
          }}
        />

        {/* Artworks on walls */}
        {corridorArtworks.map((item, index) => {
          const { artwork, side, z, y, size } = item;

          const relativeZ = z + cameraZ;
          const isVisible = relativeZ < 300 && relativeZ > -2500;

          if (!isVisible) return null;

          const aspectMultiplier =
            artwork.aspectRatio === 'portrait'
              ? 1.4
              : artwork.aspectRatio === 'landscape'
                ? 0.65
                : 1;

          // Position on wall - LEFT is negative X, RIGHT is positive X
          const xPosition = side === 'left' ? -WALL_OFFSET : WALL_OFFSET;

          // Rotation to face into corridor
          // Left wall: rotate Y positive to face right (into corridor)
          // Right wall: rotate Y negative to face left (into corridor)
          const wallRotation = side === 'left' ? 90 : -90;

          // Motion blur when passing close
          const passingSpeed = Math.abs(relativeZ) < 400 ? (400 - Math.abs(relativeZ)) / 400 : 0;
          const motionBlur = progress > 0.1 ? passingSpeed * progress * 4 : 0;

          return (
            <motion.div
              key={`${artwork.id}-${side}-${index}`}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                width: size,
                height: size * aspectMultiplier,
                transformStyle: 'preserve-3d',
                transform: `
                  translateX(${xPosition}vw)
                  translateY(${y}px)
                  translateZ(${z}px)
                  rotateY(${wallRotation}deg)
                `,
                filter: motionBlur > 1.5 ? `blur(${motionBlur}px)` : undefined,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.01 }}
            >
              {/* Artwork - NO rounded corners */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: artwork.placeholderColor,
                  boxShadow: `
                    0 8px 40px rgba(0, 0, 0, 0.18),
                    0 16px 60px rgba(0, 0, 0, 0.12),
                    inset 0 0 0 2px rgba(255, 255, 255, 0.1)
                  `,
                  border: '5px solid rgba(40, 35, 30, 0.08)',
                }}
              />
            </motion.div>
          );
        })}

        {/* Vanishing point glow */}
        <div
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            width: '400px',
            height: '400px',
            transform: `translate(-50%, -50%) translateZ(${-CORRIDOR_LENGTH + 100}px)`,
            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Final artwork zoom */}
      {enterPhase > 0 && finalArtwork && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ opacity: enterPhase }}
        >
          <motion.div
            style={{
              backgroundColor: finalArtwork.placeholderColor,
              width: `${20 + enterPhase * 200}vw`,
              height: `${20 + enterPhase * 200}vh`,
              boxShadow: `0 0 ${120 * enterPhase}px rgba(0, 0, 0, 0.15)`,
            }}
          />
        </motion.div>
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse 55% 50% at 50% 50%,
            transparent 0%,
            transparent 25%,
            rgba(0, 0, 0, ${0.1 + progress * 0.2}) 100%
          )`,
        }}
      />
    </div>
  );
}

export default MuseumCorridor;
