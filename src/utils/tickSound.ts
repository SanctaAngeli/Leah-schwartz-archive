// Kodak-style mechanical tick sound generator
// Uses Web Audio API to create a subtle, tactile click

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      console.warn('Web Audio API not supported');
      return null;
    }
  }
  return audioContext;
}

export function playTickSound(volume: number = 0.15): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  // Create the "click" using a short burst of filtered noise
  // This mimics the mechanical sound of a Kodak carousel advancing

  // Main click oscillator - a very short sine burst
  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  const clickFilter = ctx.createBiquadFilter();

  clickOsc.type = 'sine';
  clickOsc.frequency.setValueAtTime(1200, now);
  clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.02);

  clickFilter.type = 'bandpass';
  clickFilter.frequency.setValueAtTime(800, now);
  clickFilter.Q.setValueAtTime(2, now);

  clickGain.gain.setValueAtTime(volume, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  clickOsc.connect(clickFilter);
  clickFilter.connect(clickGain);
  clickGain.connect(ctx.destination);

  clickOsc.start(now);
  clickOsc.stop(now + 0.05);

  // Add a subtle "thump" for more mechanical feel
  const thumpOsc = ctx.createOscillator();
  const thumpGain = ctx.createGain();

  thumpOsc.type = 'sine';
  thumpOsc.frequency.setValueAtTime(80, now);
  thumpOsc.frequency.exponentialRampToValueAtTime(40, now + 0.03);

  thumpGain.gain.setValueAtTime(volume * 0.5, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  thumpOsc.connect(thumpGain);
  thumpGain.connect(ctx.destination);

  thumpOsc.start(now);
  thumpOsc.stop(now + 0.06);
}

// Hook for using tick sound with proper cleanup
import { useCallback, useRef, useEffect } from 'react';

interface UseTickSoundOptions {
  volume?: number;
  minInterval?: number; // Minimum time between ticks in ms
  enabled?: boolean;
}

interface UseTickSoundReturn {
  playTick: () => void;
  isEnabled: boolean;
}

export function useTickSound({
  volume = 0.15,
  minInterval = 80,
  enabled = true,
}: UseTickSoundOptions = {}): UseTickSoundReturn {
  const lastTickTime = useRef<number>(0);
  const isEnabled = useRef(enabled);

  useEffect(() => {
    isEnabled.current = enabled;
  }, [enabled]);

  const playTick = useCallback(() => {
    if (!isEnabled.current) return;

    const now = Date.now();
    if (now - lastTickTime.current >= minInterval) {
      playTickSound(volume);
      lastTickTime.current = now;
    }
  }, [volume, minInterval]);

  return {
    playTick,
    isEnabled: isEnabled.current,
  };
}

// Preload audio context on first user interaction
export function initAudioContext(): void {
  const ctx = getAudioContext();
  if (ctx?.state === 'suspended') {
    ctx.resume();
  }
}
