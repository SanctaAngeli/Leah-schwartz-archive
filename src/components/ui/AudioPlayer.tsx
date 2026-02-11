import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioPlayerProps {
  src?: string;
  title: string;
  duration?: number; // Expected duration in seconds (for placeholder)
  onEnded?: () => void;
  autoPlay?: boolean;
  className?: string;
}

function AudioPlayer({
  src,
  title,
  duration = 180,
  onEnded,
  autoPlay = false,
  className = '',
}: AudioPlayerProps): JSX.Element {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration);
  const [_isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current && !src) {
      // No audio source - simulate playback for demo
      setIsPlaying((prev) => !prev);
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying, src]);

  // Simulate playback for demo when no audio source
  useEffect(() => {
    if (!src && isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            onEnded?.();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [src, isPlaying, totalDuration, onEnded]);

  // Handle seeking
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  }, []);

  // Handle volume change
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  // Skip forward/backward
  const skip = useCallback((seconds: number) => {
    setCurrentTime((prev) => {
      const newTime = Math.max(0, Math.min(totalDuration, prev + seconds));
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
      return newTime;
    });
  }, [totalDuration]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setTotalDuration(audio.duration);
    const handleLoadedData = () => setIsLoaded(true);
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    if (autoPlay) {
      audio.play().catch(() => {
        // Autoplay may be blocked by browser
      });
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [autoPlay, onEnded]);

  const progress = (currentTime / totalDuration) * 100;

  return (
    <div className={`glass-card p-4 ${className}`}>
      {/* Hidden audio element */}
      {src && <audio ref={audioRef} src={src} preload="metadata" />}

      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-heading text-sm text-text-primary truncate flex-1 mr-4">
          {title}
        </h4>
        {!src && (
          <span className="text-xs text-text-muted bg-black/5 px-2 py-1 rounded-full">
            Demo
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative mb-3">
        <div className="h-1 bg-black/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-text-primary rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={totalDuration}
          value={currentTime}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Seek audio"
        />
      </div>

      {/* Time display */}
      <div className="flex items-center justify-between text-xs text-text-muted mb-3">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(totalDuration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        {/* Skip back */}
        <button
          onClick={() => skip(-10)}
          className="w-10 h-10 flex items-center justify-center rounded-full
            text-text-secondary hover:text-text-primary hover:bg-black/5 transition-colors"
          aria-label="Skip back 10 seconds"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="w-14 h-14 flex items-center justify-center rounded-full
            bg-text-primary text-white hover:bg-text-primary/90 transition-colors shadow-lg"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Skip forward */}
        <button
          onClick={() => skip(10)}
          className="w-10 h-10 flex items-center justify-center rounded-full
            text-text-secondary hover:text-text-primary hover:bg-black/5 transition-colors"
          aria-label="Skip forward 10 seconds"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
          </svg>
        </button>

        {/* Volume */}
        <div className="relative ml-2">
          <button
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            className="w-10 h-10 flex items-center justify-center rounded-full
              text-text-secondary hover:text-text-primary hover:bg-black/5 transition-colors"
            aria-label="Volume"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {volume === 0 ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              ) : volume < 0.5 ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              )}
            </svg>
          </button>

          <AnimatePresence>
            {showVolumeSlider && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 glass-card"
              >
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 appearance-none bg-black/10 rounded-full
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-text-primary
                    [&::-webkit-slider-thumb]:cursor-pointer"
                  aria-label="Volume level"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Waveform visualization (placeholder) */}
      <div className="mt-4 flex items-end justify-center gap-0.5 h-8">
        {Array.from({ length: 40 }).map((_, i) => {
          const isActive = (i / 40) * 100 <= progress;
          const height = 20 + Math.sin(i * 0.5) * 15 + Math.random() * 10;

          return (
            <motion.div
              key={i}
              className={`w-1 rounded-full transition-colors ${
                isActive ? 'bg-text-primary' : 'bg-black/10'
              }`}
              animate={{
                height: isPlaying ? height : height * 0.5,
              }}
              transition={{
                duration: 0.2,
                delay: i * 0.01,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default AudioPlayer;
