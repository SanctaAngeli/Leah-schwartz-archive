import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';

interface ZoomableImageProps {
  src?: string;
  alt: string;
  placeholderColor?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  className?: string;
}

function ZoomableImage({
  src,
  alt,
  placeholderColor = '#9B8B7A',
  aspectRatio = 'square',
  className = '',
}: ZoomableImageProps): JSX.Element {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Constraints based on zoom level
  const getConstraints = useCallback(() => {
    if (!containerRef.current || scale <= 1) {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    const container = containerRef.current;
    const extraWidth = (container.offsetWidth * (scale - 1)) / 2;
    const extraHeight = (container.offsetHeight * (scale - 1)) / 2;

    return {
      top: -extraHeight,
      bottom: extraHeight,
      left: -extraWidth,
      right: extraWidth,
    };
  }, [scale]);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) {
        // Reset position when fully zoomed out
        x.set(0);
        y.set(0);
      }
      return newScale;
    });
  }, [x, y]);

  const resetZoom = useCallback(() => {
    setScale(1);
    x.set(0);
    y.set(0);
  }, [x, y]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setScale((prev) => {
      const newScale = Math.max(1, Math.min(4, prev + delta));
      if (newScale === 1) {
        x.set(0);
        y.set(0);
      }
      return newScale;
    });
  }, [x, y]);

  // Touch handling for pinch-to-zoom
  const initialDistance = useRef<number | null>(null);
  const initialScale = useRef<number>(1);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialDistance.current = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      initialScale.current = scale;
    }
  }, [scale]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDistance.current) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const scaleChange = currentDistance / initialDistance.current;
      const newScale = Math.max(1, Math.min(4, initialScale.current * scaleChange));

      setScale(newScale);

      if (newScale === 1) {
        x.set(0);
        y.set(0);
      }
    }
  }, [x, y]);

  const handleTouchEnd = useCallback(() => {
    initialDistance.current = null;
  }, []);

  // Double-tap to zoom
  const lastTap = useRef<number>(0);
  const handleDoubleTap = useCallback((_e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      // Double tap detected
      if (scale > 1) {
        resetZoom();
      } else {
        setScale(2);
      }
    }
    lastTap.current = now;
  }, [scale, resetZoom]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        zoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, resetZoom]);

  // Aspect ratio classes
  const aspectClasses = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    square: 'aspect-square',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Image container */}
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-lg ${aspectClasses[aspectRatio]} ${
          scale > 1 ? 'cursor-grab' : 'cursor-zoom-in'
        } ${isDragging ? 'cursor-grabbing' : ''}`}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleDoubleTap}
      >
        <motion.div
          className="w-full h-full"
          style={{
            scale,
            x: scale > 1 ? x : 0,
            y: scale > 1 ? y : 0,
          }}
          drag={scale > 1}
          dragConstraints={getConstraints()}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {src ? (
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover select-none"
              draggable={false}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ backgroundColor: placeholderColor }}
            />
          )}
        </motion.div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 glass-pill p-1">
        <button
          onClick={zoomOut}
          disabled={scale <= 1}
          className={`w-8 h-8 flex items-center justify-center rounded-full
            transition-colors ${
              scale <= 1
                ? 'text-text-muted cursor-not-allowed'
                : 'text-text-primary hover:bg-white/50'
            }`}
          aria-label="Zoom out"
          title="Zoom out (-)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <span className="text-sm font-medium text-text-secondary min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={zoomIn}
          disabled={scale >= 4}
          className={`w-8 h-8 flex items-center justify-center rounded-full
            transition-colors ${
              scale >= 4
                ? 'text-text-muted cursor-not-allowed'
                : 'text-text-primary hover:bg-white/50'
            }`}
          aria-label="Zoom in"
          title="Zoom in (+)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {scale > 1 && (
          <button
            onClick={resetZoom}
            className="w-8 h-8 flex items-center justify-center rounded-full
              text-text-primary hover:bg-white/50 transition-colors"
            aria-label="Reset zoom"
            title="Reset (0)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {/* Zoom hint */}
      {scale === 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-pill px-3 py-1.5 opacity-60">
          <span className="text-xs text-text-secondary">
            Double-click or scroll to zoom
          </span>
        </div>
      )}
    </div>
  );
}

export default ZoomableImage;
