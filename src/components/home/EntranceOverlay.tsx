import { Suspense, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GalleryCorridor3D, { CorridorPreloader } from './GalleryCorridor3D';

const STORAGE_KEY = 'leah-entrance-v3-seen';

interface EntranceOverlayProps {
  onComplete: () => void;
}

function EntranceOverlay({ onComplete }: EntranceOverlayProps): JSX.Element {
  const [stage, setStage] = useState<'splash' | 'flying' | 'fading'>('splash');
  const [preloaded, setPreloaded] = useState(false);
  const [heroFill, setHeroFill] = useState(0);

  const handleEnter = useCallback(() => {
    if (!preloaded) return;
    setStage('flying');
  }, [preloaded]);

  const handleFlightComplete = useCallback(() => {
    setStage('fading');
    // Cross-fade the corridor into the home over ~700ms
    window.setTimeout(() => onComplete(), 700);
  }, [onComplete]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (stage === 'splash' && preloaded && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleEnter();
      } else if (e.key === 'Escape') {
        onComplete();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stage, preloaded, handleEnter, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === 'fading' ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ backgroundColor: '#EDE6D7' }}
      aria-label="Entrance"
    >
      <CorridorPreloader onReady={() => setPreloaded(true)} />

      {/* The 3D scene · mounted from the start, but the flight only starts when stage flips */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="absolute inset-0 bg-[#EDE6D7]" />}>
          <GalleryCorridor3D
            startFlight={stage !== 'splash'}
            onComplete={handleFlightComplete}
            onHeroFillProgress={setHeroFill}
          />
        </Suspense>
      </div>

      {/* Splash · her name framed as a museum title plate over the bright corridor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'splash' ? 1 : 0 }}
        transition={{ duration: stage === 'splash' ? 0.8 : 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10"
        style={{ pointerEvents: stage === 'splash' ? 'auto' : 'none' }}
      >
        {/* Soft cream wash · brightens the scene further and gives a centered focal point */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255,250,240,0.55) 0%, rgba(237,230,215,0.35) 55%, rgba(220,210,190,0.55) 100%)',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10 bg-white/55 backdrop-blur-2xl
            border border-white/50 rounded-[36px]
            px-10 sm:px-16 py-10 sm:py-12
            shadow-[0_28px_80px_rgba(60,45,25,0.12)]"
        >
          <h1 className="font-heading text-[#2A2418] text-[clamp(44px,9vw,108px)] tracking-[0.04em] leading-[0.95]">
            Leah Schwartz
          </h1>
          <div className="mt-6 flex items-center justify-center gap-4" aria-hidden="true">
            <span className="block h-px w-10 bg-[#2A2418]/35" />
            <p className="font-body text-[#2A2418]/65 tracking-[0.5em] text-xs uppercase pl-[0.5em]">
              1920 — 2004
            </p>
            <span className="block h-px w-10 bg-[#2A2418]/35" />
          </div>
        </motion.div>
        <motion.button
          type="button"
          onClick={handleEnter}
          initial={{ opacity: 0 }}
          animate={{ opacity: preloaded ? 1 : 0.3 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          disabled={!preloaded}
          className="relative z-10 mt-14 mx-auto group flex flex-col items-center
            text-[#2A2418]/70 hover:text-[#2A2418]
            transition-colors duration-300 cursor-pointer disabled:cursor-wait"
          aria-label="Enter the archive"
        >
          {/* pl compensates the trailing letter-spacing so the text is visually centered */}
          <span className="font-body text-[11px] tracking-[0.4em] uppercase pl-[0.4em]">
            {preloaded ? 'Enter' : 'Loading…'}
          </span>
          <span aria-hidden="true" className="mt-3 text-xl group-hover:translate-y-0.5 transition-transform duration-300">
            ↓
          </span>
        </motion.button>
      </motion.div>

      {/* Skip · always available */}
      <button
        type="button"
        onClick={onComplete}
        className="absolute bottom-6 right-6 font-body text-[#2A2418]/45 hover:text-[#2A2418]/80
          text-[10px] tracking-[0.3em] uppercase transition-colors duration-200 z-20"
        aria-label="Skip intro"
      >
        Skip ›
      </button>

      {/* End-of-flight glow that intensifies as hero fills the frame · soft warm halo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,245,220,0) 40%, rgba(255,245,220,0.20) 85%, rgba(255,245,220,0.40) 100%)',
          opacity: heroFill * 0.6,
          transition: 'opacity 0.3s linear',
        }}
      />
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
