import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import artworksData from '../../data/artworks.json';
import type { Artwork } from '../../types';

const STORAGE_KEY = 'leah-entrance-seen-v1';
const TOTAL_DURATION_MS = 3800;
const PAINTING_COUNT = 14;

interface PaintingPos {
  artwork: Artwork;
  x: number;
  y: number;
  z: number;
  rot: number;
  size: number;
  fadeIn: number;
  fadeDur: number;
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

function generatePositions(seed: number): PaintingPos[] {
  const random = mulberry32(seed);
  const all = (artworksData as Artwork[]).filter(
    (a) => a.imagePath && !a.needs_crop,
  );
  const picks: Artwork[] = [];
  const used = new Set<string>();
  while (picks.length < PAINTING_COUNT && used.size < all.length) {
    const idx = Math.floor(random() * all.length);
    const a = all[idx];
    if (!used.has(a.id)) {
      used.add(a.id);
      picks.push(a);
    }
  }

  return picks.map((artwork, i) => {
    const angle = (i / picks.length) * Math.PI * 2 + random() * 0.6;
    const radius = 320 + random() * 380;
    const x = Math.cos(angle) * radius + (random() - 0.5) * 80;
    const y = Math.sin(angle) * radius * 0.55 + (random() - 0.5) * 80;
    const z = -300 - random() * 1800;
    const rot = (random() - 0.5) * 18;
    const size = 160 + random() * 140;
    return {
      artwork,
      x, y, z, rot, size,
      fadeIn: 0.05 + (i % 7) * 0.06,
      fadeDur: 0.9 + (i % 5) * 0.18,
    };
  });
}

interface EntranceOverlayProps {
  onComplete: () => void;
}

function EntranceOverlay({ onComplete }: EntranceOverlayProps): JSX.Element | null {
  const positions = useMemo(() => generatePositions(0xDEC0DE), []);
  const [phase, setPhase] = useState<'flight' | 'name' | 'done'>('flight');

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase('name'), 2400);
    const t2 = window.setTimeout(() => setPhase('done'), 3400);
    const t3 = window.setTimeout(() => onComplete(), TOTAL_DURATION_MS);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'done' ? 0 : 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[100] bg-[#0E0E0E] overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '1100px' }}
      >
        <div
          className="entrance-scene relative"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {positions.map((p) => (
            <div
              key={p.artwork.id}
              className="entrance-card absolute"
              style={{
                left: '50%',
                top: '50%',
                width: p.size,
                height: p.size,
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
                transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotate(${p.rot}deg)`,
                opacity: 0,
                animation: `entrance-card-fade ${p.fadeDur}s ease-out ${p.fadeIn}s forwards`,
              }}
            >
              <img
                src={p.artwork.thumbPath || p.artwork.imagePath || ''}
                alt=""
                className="w-full h-full object-cover rounded-sm shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
                style={{ pointerEvents: 'none' }}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {phase !== 'flight' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <h1 className="font-heading text-white text-[clamp(40px,8vw,84px)] tracking-[0.04em] leading-none">
              Leah Schwartz
            </h1>
            <p className="font-body text-white/60 mt-4 tracking-[0.4em] text-xs uppercase">
              1920 — 2004
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={onComplete}
        className="absolute bottom-6 right-6 font-body text-white/40 hover:text-white/80
          text-[10px] tracking-[0.3em] uppercase transition-colors duration-200 pointer-events-auto"
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
