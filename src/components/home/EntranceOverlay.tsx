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
      style={{ backgroundColor: '#0E0A06' }}
      aria-label="Entrance"
    >
      <CorridorPreloader onReady={() => setPreloaded(true)} />

      {/* The 3D scene · mounted from the start, but the flight only starts when stage flips */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="absolute inset-0 bg-[#0E0A06]" />}>
          <GalleryCorridor3D
            startFlight={stage !== 'splash'}
            onComplete={handleFlightComplete}
            onHeroFillProgress={setHeroFill}
          />
        </Suspense>
      </div>

      {/* Splash · just her name. Sits in front of the corridor view, dimmed scene visible behind */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'splash' ? 1 : 0 }}
        transition={{ duration: stage === 'splash' ? 0.8 : 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10"
        style={{ pointerEvents: stage === 'splash' ? 'auto' : 'none' }}
      >
        {/* Soft vignette over the corridor — barely dims center, fades to dark edges */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(14,10,6,0.20) 0%, rgba(14,10,6,0.60) 60%, rgba(14,10,6,0.92) 100%)',
          }}
        />
        <div className="relative z-10">
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
            className="font-body text-white/55 mt-6 tracking-[0.5em] text-xs uppercase"
          >
            1920 — 2004
          </motion.p>
          <motion.button
            type="button"
            onClick={handleEnter}
            initial={{ opacity: 0 }}
            animate={{ opacity: preloaded ? 1 : 0.3 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            disabled={!preloaded}
            className="mt-20 group flex flex-col items-center text-white/70 hover:text-white
              transition-colors duration-300 cursor-pointer disabled:cursor-wait"
            aria-label="Enter the archive"
          >
            <span className="font-body text-[11px] tracking-[0.4em] uppercase">
              {preloaded ? 'Enter' : 'Loading…'}
            </span>
            <span aria-hidden="true" className="mt-3 text-xl group-hover:translate-y-0.5 transition-transform duration-300">
              ↓
            </span>
          </motion.button>
        </div>
      </motion.div>

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

      {/* End-of-flight glow that intensifies as hero fills the frame */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(255,236,200,0) 35%, rgba(255,236,200,0.25) 80%, rgba(255,236,200,0.45) 100%)',
          opacity: heroFill * 0.7,
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
