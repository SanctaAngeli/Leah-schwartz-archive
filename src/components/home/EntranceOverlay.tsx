import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import artworksData from '../../data/artworks.json';
import type { Artwork } from '../../types';

const STORAGE_KEY = 'leah-entrance-v2-seen';
const FLIGHT_DURATION_MS = 4000;
const PAINTINGS_PER_WALL = 20;

interface WallPainting {
  artwork: Artwork;
  side: 'left' | 'right';
  z: number;       // depth along corridor (px)
  y: number;       // vertical offset (px) from corridor center
  width: number;   // px
  height: number;  // px
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildCorridor(seed: number): WallPainting[] {
  const random = mulberry32(seed);
  const all = (artworksData as Artwork[]).filter(
    (a) => a.imagePath && !a.needs_crop,
  );

  const picks: Artwork[] = [];
  const used = new Set<string>();
  while (picks.length < PAINTINGS_PER_WALL * 2 && used.size < all.length) {
    const idx = Math.floor(random() * all.length);
    const a = all[idx];
    if (!used.has(a.id)) {
      used.add(a.id);
      picks.push(a);
    }
  }

  const corridor: WallPainting[] = [];
  const spacing = 280;
  // Left wall paintings — staggered Z, dense pack
  for (let i = 0; i < PAINTINGS_PER_WALL; i++) {
    const a = picks[i];
    const z = -200 - i * spacing - random() * 60;
    const y = (random() - 0.5) * 280;
    const baseSize = 340 + random() * 200;
    const aspectRatio = a.aspectRatio === 'portrait' ? 1.35 : a.aspectRatio === 'landscape' ? 0.72 : 1;
    corridor.push({ artwork: a, side: 'left', z, y, width: baseSize, height: baseSize * aspectRatio });
  }
  // Right wall — offset z by half spacing for alternating rhythm
  for (let i = 0; i < PAINTINGS_PER_WALL; i++) {
    const a = picks[PAINTINGS_PER_WALL + i];
    const z = -200 - spacing / 2 - i * spacing - random() * 60;
    const y = (random() - 0.5) * 280;
    const baseSize = 340 + random() * 200;
    const aspectRatio = a.aspectRatio === 'portrait' ? 1.35 : a.aspectRatio === 'landscape' ? 0.72 : 1;
    corridor.push({ artwork: a, side: 'right', z, y, width: baseSize, height: baseSize * aspectRatio });
  }
  return corridor;
}

interface EntranceOverlayProps {
  onComplete: () => void;
}

function EntranceOverlay({ onComplete }: EntranceOverlayProps): JSX.Element | null {
  const corridor = useMemo(() => buildCorridor(0xC0FFEE), []);
  const [stage, setStage] = useState<'splash' | 'flying'>('splash');

  const handleEnter = useCallback(() => {
    setStage('flying');
  }, []);

  // After flight completes, fade out and signal done
  useEffect(() => {
    if (stage !== 'flying') return;
    const t = window.setTimeout(() => onComplete(), FLIGHT_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [stage, onComplete]);

  // Keyboard: Enter/Space starts; Escape skips entirely
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (stage === 'splash' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleEnter();
      } else if (e.key === 'Escape') {
        onComplete();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage, handleEnter, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ backgroundColor: '#080808' }}
      aria-label="Entrance"
    >
      {/* Splash · just her name. Stays mounted but fades out when flight begins. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'splash' ? 1 : 0 }}
        transition={{ duration: stage === 'splash' ? 0.8 : 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10"
        style={{ pointerEvents: stage === 'splash' ? 'auto' : 'none' }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="font-heading text-white text-[clamp(48px,10vw,120px)] tracking-[0.04em] leading-[0.95]"
        >
          Leah Schwartz
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="font-body text-white/50 mt-6 tracking-[0.5em] text-xs uppercase"
        >
          1920 — 2004
        </motion.p>
        <motion.button
          type="button"
          onClick={handleEnter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mt-20 group flex flex-col items-center text-white/70 hover:text-white
            transition-colors duration-300 cursor-pointer"
          aria-label="Enter the archive"
        >
          <span className="font-body text-[11px] tracking-[0.4em] uppercase">Enter</span>
          <span aria-hidden="true" className="mt-3 text-xl group-hover:translate-y-0.5 transition-transform duration-300">
            ↓
          </span>
        </motion.button>
      </motion.div>

      {/* Corridor flythrough · always mounted so the scene is ready when ENTER fires */}
      <div
        className="absolute inset-0"
        style={{
          perspective: '700px',
          perspectiveOrigin: '50% 50%',
          pointerEvents: 'none',
        }}
      >
        <div
          className={`absolute inset-0 ${stage === 'flying' ? 'entrance-fly' : ''}`}
          style={{
            transformStyle: 'preserve-3d',
            transform: stage === 'flying' ? undefined : 'translateZ(-200px)',
          }}
        >
          {corridor.map((p) => {
            const xVw = p.side === 'left' ? -34 : 34;
            const rotY = p.side === 'left' ? 90 : -90;
            return (
              <div
                key={p.artwork.id + p.side}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  width: p.width,
                  height: p.height,
                  marginLeft: -p.width / 2,
                  marginTop: -p.height / 2,
                  transformStyle: 'preserve-3d',
                  transform: `translate3d(${xVw}vw, ${p.y}px, ${p.z}px) rotateY(${rotY}deg)`,
                }}
              >
                <img
                  src={p.artwork.thumbPath || p.artwork.imagePath || ''}
                  alt=""
                  draggable={false}
                  className="w-full h-full object-cover"
                  style={{
                    boxShadow: '0 12px 60px rgba(0,0,0,0.6)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            );
          })}
          {/* Soft warm vanishing-point glow far ahead */}
          <div
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              width: 700,
              height: 700,
              marginLeft: -350,
              marginTop: -350,
              transform: 'translateZ(-6000px)',
              background:
                'radial-gradient(circle, rgba(255,240,210,0.55) 0%, rgba(255,240,210,0) 65%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Soft warm vignette that builds toward end of flight */}
      {stage === 'flying' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: FLIGHT_DURATION_MS / 1000 - 1.0 }}
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255,248,230,0) 0%, rgba(255,248,230,0) 30%, rgba(255,248,230,0.6) 75%, rgba(255,248,230,0.95) 100%)',
          }}
        />
      )}

      {/* Skip · always available */}
      <button
        type="button"
        onClick={onComplete}
        className="absolute bottom-6 right-6 font-body text-white/40 hover:text-white/80
          text-[10px] tracking-[0.3em] uppercase transition-colors duration-200 z-20"
        aria-label="Skip intro"
      >
        Skip ›
      </button>
    </motion.div>
  );
}

export function shouldShowEntrance(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return !window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

export function markEntranceSeen(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // ignore
  }
}

export default EntranceOverlay;
