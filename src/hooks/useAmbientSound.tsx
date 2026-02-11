import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';

interface AmbientSoundContextType {
  isEnabled: boolean;
  volume: number;
  toggle: () => void;
  setVolume: (volume: number) => void;
  playTransition: () => void;
}

const AmbientSoundContext = createContext<AmbientSoundContextType | null>(null);

// Create subtle UI sounds using Web Audio API
function createTransitionSound(audioContext: AudioContext, volume: number): void {
  const now = audioContext.currentTime;

  // Soft whoosh sound
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(200, now);
  oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.15);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(200, now + 0.15);

  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume * 0.05, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.15);
}

export function AmbientSoundProvider({ children }: { children: ReactNode }): JSX.Element {
  const [isEnabled, setIsEnabled] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef<AudioContext | null>(null);
  const initialized = useRef(false);

  // Initialize audio context on first user interaction
  const initAudio = useCallback(() => {
    if (initialized.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
        initialized.current = true;
      }
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }, []);

  // Initialize on first toggle
  const toggle = useCallback(() => {
    initAudio();
    setIsEnabled(prev => !prev);
  }, [initAudio]);

  const playTransition = useCallback(() => {
    if (!isEnabled || !audioContextRef.current) return;

    // Resume audio context if suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    createTransitionSound(audioContextRef.current, volume);
  }, [isEnabled, volume]);

  // Clean up audio context
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <AmbientSoundContext.Provider value={{ isEnabled, volume, toggle, setVolume, playTransition }}>
      {children}
    </AmbientSoundContext.Provider>
  );
}

export function useAmbientSound(): AmbientSoundContextType {
  const context = useContext(AmbientSoundContext);
  if (!context) {
    throw new Error('useAmbientSound must be used within an AmbientSoundProvider');
  }
  return context;
}
