import { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import type { Artwork } from '../../types';

interface FloatingPiece {
  artwork: Artwork;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  animateX: number[];
  animateY: number[];
  animateRotation: number[];
  duration: number;
}

interface FloatingArtworksProps {
  artworks: Artwork[];
  opacity?: number;
}

// Seeded random for consistent layouts
function seededRandom(seed: number): () => number {
  return function (): number {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Check if two rectangles overlap (with padding)
function rectsOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
  padding: number = 20
): boolean {
  return !(
    a.x + a.width + padding < b.x ||
    b.x + b.width + padding < a.x ||
    a.y + a.height + padding < b.y ||
    b.y + b.height + padding < a.y
  );
}

function generateFloatingPieces(artworks: Artwork[]): FloatingPiece[] {
  const seed = Math.floor(Date.now() / (1000 * 60 * 60 * 2));
  const random = seededRandom(seed);

  const pieces: FloatingPiece[] = [];
  const placedRects: { x: number; y: number; width: number; height: number }[] = [];

  // Screen dimensions in percentage (we'll use viewport percentages)
  const screenWidth = 100;
  const screenHeight = 100;

  // Try to place each artwork without overlap
  const count = Math.min(22, artworks.length);

  for (let i = 0; i < count; i++) {
    const artwork = artworks[i];

    // Size in viewport units (vw-ish)
    const size = 8 + random() * 7; // 8-15% of viewport width
    const aspectMultiplier =
      artwork.aspectRatio === 'portrait'
        ? 1.35
        : artwork.aspectRatio === 'landscape'
          ? 0.72
          : 1;
    const width = size;
    const height = size * aspectMultiplier;

    // Try to find a non-overlapping position
    let x = 0;
    let y = 0;
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      // Random position with margin from edges
      x = 3 + random() * (screenWidth - width - 6);
      y = 5 + random() * (screenHeight - height - 10);

      // Check against all placed rectangles
      const newRect = { x, y, width, height };
      let overlaps = false;

      for (const rect of placedRects) {
        if (rectsOverlap(newRect, rect, 2)) { // 2% padding between pieces
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        placed = true;
        placedRects.push(newRect);
      }

      attempts++;
    }

    // If we couldn't place it after max attempts, skip this artwork
    if (!placed) continue;

    // Random rotation
    const rotation = (random() - 0.5) * 16;

    // Animation paths - keep movements smaller to avoid causing overlaps
    const travelDistance = 40 + random() * 60;
    const animateX = [
      0,
      travelDistance * (random() - 0.5),
      travelDistance * (random() - 0.5) * 0.7,
      travelDistance * (random() - 0.5) * 0.4,
      0,
    ];
    const animateY = [
      0,
      travelDistance * (random() - 0.5) * 0.8,
      travelDistance * (random() - 0.5),
      travelDistance * (random() - 0.5) * 0.5,
      0,
    ];
    const rotateAmount = 3 + random() * 4;
    const animateRotation = [
      rotation,
      rotation + rotateAmount * (random() - 0.5),
      rotation + rotateAmount * (random() - 0.5) * 0.6,
      rotation + rotateAmount * (random() - 0.5) * 0.3,
      rotation,
    ];

    // Slow drift: 30-50 seconds
    const duration = 30 + random() * 20;

    pieces.push({
      artwork,
      x,
      y,
      width,
      height,
      rotation,
      animateX,
      animateY,
      animateRotation,
      duration,
    });
  }

  return pieces;
}

export function FloatingArtworks({
  artworks,
  opacity = 1,
}: FloatingArtworksProps): JSX.Element {
  const pieces = useMemo(() => generateFloatingPieces(artworks), [artworks]);

  // Track mouse position for repulsion effect
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: -1000, y: -1000 });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ opacity }}
    >
      {pieces.map((piece, index) => (
        <FloatingPiece
          key={piece.artwork.id}
          piece={piece}
          index={index}
          mousePos={mousePos}
        />
      ))}
    </div>
  );
}

interface FloatingPieceProps {
  piece: FloatingPiece;
  index: number;
  mousePos: { x: number; y: number };
}

function FloatingPiece({ piece, index, mousePos }: FloatingPieceProps): JSX.Element {
  const { artwork, x, y, width, height, duration } = piece;

  // Spring-based mouse repulsion
  const repelX = useMotionValue(0);
  const repelY = useMotionValue(0);
  const springX = useSpring(repelX, { stiffness: 50, damping: 20 });
  const springY = useSpring(repelY, { stiffness: 50, damping: 20 });

  // Calculate repulsion from mouse
  useEffect(() => {
    const pieceX = (x / 100) * window.innerWidth + (width / 100) * window.innerWidth / 2;
    const pieceY = (y / 100) * window.innerHeight + (height / 100) * window.innerHeight / 2;

    const dx = pieceX - mousePos.x;
    const dy = pieceY - mousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const repelRadius = 200;
    const maxRepel = 60;

    if (distance < repelRadius && distance > 0) {
      const strength = (1 - distance / repelRadius) * maxRepel;
      const angle = Math.atan2(dy, dx);
      repelX.set(Math.cos(angle) * strength);
      repelY.set(Math.sin(angle) * strength);
    } else {
      repelX.set(0);
      repelY.set(0);
    }
  }, [mousePos, x, y, width, height, repelX, repelY]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}vw`,
        height: `${height}vw`,
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 0.88,
        scale: 1,
        translateX: piece.animateX,
        translateY: piece.animateY,
        rotate: piece.animateRotation,
      }}
      transition={{
        opacity: { duration: 1.2, delay: index * 0.06 },
        scale: { duration: 1.2, delay: index * 0.06 },
        translateX: { duration: duration, repeat: Infinity, ease: 'easeInOut' },
        translateY: { duration: duration * 1.1, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: duration * 0.95, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      {/* Artwork - NO rounded corners, with shadow */}
      <div
        className="w-full h-full"
        style={{
          backgroundColor: artwork.placeholderColor,
          boxShadow: `
            0 4px 12px rgba(0, 0, 0, 0.08),
            0 12px 40px rgba(0, 0, 0, 0.12),
            0 2px 4px rgba(0, 0, 0, 0.05)
          `,
        }}
      />
    </motion.div>
  );
}

export default FloatingArtworks;
