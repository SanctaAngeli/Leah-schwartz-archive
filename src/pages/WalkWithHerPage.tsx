import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import artworksData from '../data/artworks.json';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

interface Waypoint {
  artworkId: string;
  caption: string;
  source?: string;
  dwellMs?: number;
}

// A curated walk through eight paintings · one per chapter of her life,
// with her own words where possible.
const WALK: Waypoint[] = [
  {
    artworkId: 'self-portrait',
    caption:
      'I had done few paintings in Boston · Beacon Street, this one in a black turtleneck, and Autumn Leaves. The earliest pieces I kept.',
    source: 'Autobiography · West 69th Street',
    dwellMs: 10000,
  },
  {
    artworkId: 'the-remarkable-herman-arthur-schwartz',
    caption:
      'This book is dedicated to my dear husband, the remarkable Herman Schwartz.',
    source: 'Dedication',
    dwellMs: 9000,
  },
  {
    artworkId: 'mt-tam-from-sonoma',
    caption:
      'I used to paint landscapes from my old Ford Econoline van that had an engine housing between the front seats. The top of the housing was flat and formed a convenient table for paints, and the steering wheel was at a good angle for watercolor painting. In my portable studio I could even paint in the rain.',
    source: 'Landscape · chapter intro',
    dwellMs: 13000,
  },
  {
    artworkId: 'pale-pink-rose-with-cosmos',
    caption:
      'I once ruined the simple background I was aiming for in a flower painting. I looked up at a Bellini reproduction that I had pinned to the studio wall and decided to paint it "behind" the flowers. It was fun getting into Bellini\'s mind.',
    source: 'Autobiography · how she found watercolor',
    dwellMs: 13000,
  },
  {
    artworkId: 'one-pear-nine-times',
    caption:
      'A single pear, nine times. The form goes from fruit to geometry to something quieter.',
    source: 'Curator\'s note',
    dwellMs: 9000,
  },
  {
    artworkId: 'archway-at-the-top-of-town-naxos',
    caption:
      'Two carry-ons, two brushes, a chocolate bar, and a notebook · her travel kit. She painted on location for forty days at a stretch.',
    source: 'Travel · Naxos, the Greek island in pieces',
    dwellMs: 11000,
  },
  {
    artworkId: 'mill-valley-kitchen',
    caption:
      'The kitchen she actually cooked in. The stained-glass window in the corner is the same window that appears in Amazing Grace · the kitchen made holy, the portrait made domestic.',
    source: 'Interiors · curator\'s note',
    dwellMs: 11000,
  },
  {
    artworkId: 'amazing-grace',
    caption:
      'In the room where I am writing, there is a large oil of chrysanthemums; the flowers are long dead. There is another large oil of a red-haired girl, seated nude, who will never again look the way she did to me at that moment.',
    source: 'Autobiography · late years',
    dwellMs: 14000,
  },
];

function WalkWithHerPage(): JSX.Element {
  usePageMeta(
    'Walk With Her',
    'A guided walk through eight paintings of Leah Schwartz, with her own words.',
  );
  const navigate = useNavigate();

  const artworkById = useMemo(() => {
    const m = new Map<string, Artwork>();
    for (const a of artworks) m.set(a.id, a);
    return m;
  }, []);

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0–1 within current waypoint
  const startedAt = useRef<number>(performance.now());
  const pausedFor = useRef<number>(0);
  const pausedAt = useRef<number | null>(null);

  const current = WALK[idx];
  const art = artworkById.get(current.artworkId);
  const dwell = current.dwellMs || 10000;

  const advance = useCallback(() => {
    setIdx((i) => Math.min(WALK.length - 1, i + 1));
  }, []);
  const reverse = useCallback(() => {
    setIdx((i) => Math.max(0, i - 1));
  }, []);

  // Reset timing when waypoint changes
  useEffect(() => {
    startedAt.current = performance.now();
    pausedFor.current = 0;
    pausedAt.current = playing ? null : performance.now();
    setProgress(0);
  }, [idx, playing]);

  // Animation frame to drive progress + auto-advance
  useEffect(() => {
    if (!playing) return;
    let raf: number;
    const tick = (): void => {
      const elapsed = performance.now() - startedAt.current - pausedFor.current;
      const p = Math.min(1, elapsed / dwell);
      setProgress(p);
      if (p >= 1) {
        if (idx < WALK.length - 1) {
          setIdx(idx + 1);
        } else {
          setPlaying(false);
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, dwell, idx]);

  const togglePlay = useCallback(() => {
    setPlaying((p) => {
      const now = performance.now();
      if (p) {
        pausedAt.current = now;
      } else {
        if (pausedAt.current !== null) {
          pausedFor.current += now - pausedAt.current;
          pausedAt.current = null;
        }
      }
      return !p;
    });
  }, []);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.target instanceof HTMLElement && /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); advance(); }
      else if (e.key === 'ArrowLeft') reverse();
      else if (e.key === 'Escape') navigate('/canvas');
      else if (e.key.toLowerCase() === 'p') togglePlay();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, reverse, togglePlay, navigate]);

  if (!art) return <main className="p-10">Painting not found.</main>;

  return (
    <main className="fixed inset-0 bg-[#1A1A1A] text-white flex flex-col">
      {/* Top bar · progress + exit */}
      <div className="absolute top-0 inset-x-0 z-20 px-6 pt-6 pb-3 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <p className="font-body text-white/70 text-xs uppercase tracking-[0.3em]">
            Walk with her · {idx + 1} of {WALK.length}
          </p>
          <Link
            to="/canvas"
            className="font-body text-white/70 hover:text-white text-xs uppercase tracking-widest transition-colors"
            aria-label="Exit walk"
          >
            Exit
          </Link>
        </div>
        {/* Segmented progress bar */}
        <div className="mt-3 flex gap-1 max-w-5xl mx-auto">
          {WALK.map((_, i) => (
            <div key={i} className="h-0.5 flex-1 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 transition-[width] duration-100 ease-linear"
                style={{
                  width: i < idx ? '100%' : i === idx ? `${progress * 100}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Painting · centered, large */}
      <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-44">
        <AnimatePresence mode="wait">
          <motion.div
            key={art.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            className="max-h-full max-w-full"
          >
            <Link to={`/artwork/${art.id}`} className="block">
              <img
                src={art.imagePath || art.thumbPath || ''}
                alt={art.display_title || art.title}
                className="max-h-[60vh] max-w-[88vw] w-auto h-auto rounded-sm shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Caption · bottom */}
      <AnimatePresence mode="wait">
        <motion.div
          key={art.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="absolute bottom-0 inset-x-0 z-20 px-6 pb-8 pt-8 bg-gradient-to-t from-black/80 via-black/60 to-transparent"
        >
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-body text-white/60 text-[10px] uppercase tracking-[0.3em] mb-3">
              {art.display_title || art.title}
              {art.year ? ` · ${art.year}` : ''}
            </p>
            <p className="font-heading italic text-white text-[18px] md:text-[22px] leading-[1.6]">
              {current.caption}
            </p>
            {current.source && (
              <p className="font-body text-white/40 text-xs uppercase tracking-wider mt-4">
                - {current.source}
              </p>
            )}

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={reverse}
                disabled={idx === 0}
                aria-label="Previous"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ←
              </button>
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? 'Pause' : 'Play'}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black text-lg hover:bg-white/90 transition-colors"
              >
                {playing ? '❚❚' : '▶'}
              </button>
              <button
                type="button"
                onClick={advance}
                disabled={idx >= WALK.length - 1}
                aria-label="Next"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                →
              </button>
            </div>
            <p className="mt-4 font-body text-white/30 text-[10px] uppercase tracking-widest">
              ← → · space · P to pause · Esc to exit
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export default WalkWithHerPage;
