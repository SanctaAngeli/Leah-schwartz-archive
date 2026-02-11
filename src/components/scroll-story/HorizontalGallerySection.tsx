import { motion, useScroll, useTransform, useSpring, useMotionValue, animate } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Artwork } from '../../types';

interface HorizontalGallerySectionProps {
  artworks: Artwork[];
  title?: string;
  subtitle?: string;
}

function HorizontalGallerySection({
  artworks,
  title,
  subtitle,
}: HorizontalGallerySectionProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Manual drag position (0 to 1)
  const manualProgress = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isSectionActive, setIsSectionActive] = useState(false);

  // Scroll-based progress for section visibility
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
  });

  // Track when section is properly in view (between 20% and 80% scroll)
  useEffect(() => {
    const unsubscribe = smoothScrollProgress.on('change', (value) => {
      // Section is "active" when it's well into view
      setIsSectionActive(value > 0.2 && value < 0.75);
    });
    return unsubscribe;
  }, [smoothScrollProgress]);

  // Calculate total scroll width
  const cardWidth = 420; // Approximate card width + gap
  const totalScrollWidth = Math.max(0, artworks.length * cardWidth - window.innerWidth + 200);

  // Horizontal position based on manual progress
  const x = useTransform(manualProgress, [0, 1], [0, -totalScrollWidth]);

  // Header animations based on vertical scroll - appear earlier
  const headerY = useTransform(smoothScrollProgress, [0.05, 0.2], [60, 0]);
  const headerOpacity = useTransform(smoothScrollProgress, [0.05, 0.15, 0.8, 0.95], [0, 1, 1, 0]);

  // Handle mouse wheel for horizontal scroll (only when section is active and hovering)
  useEffect(() => {
    // Only capture scroll when section is active and user is hovering/dragging
    if (!isSectionActive || (!isHovering && !isDragging)) return;

    const handleWheel = (e: WheelEvent): void => {
      // Only intercept if mostly vertical scroll and we haven't reached the ends
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const currentProgress = manualProgress.get();

        // Allow normal scroll at the boundaries
        if ((e.deltaY < 0 && currentProgress <= 0) || (e.deltaY > 0 && currentProgress >= 1)) {
          return; // Let normal scroll happen
        }

        e.preventDefault();
        const delta = e.deltaY * 0.0015; // Slightly reduced sensitivity for smoother control
        const newProgress = Math.min(1, Math.max(0, currentProgress + delta));
        manualProgress.set(newProgress);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [isHovering, isDragging, manualProgress, isSectionActive]);

  // Handle drag on the gallery
  const handleDrag = (_: never, info: { delta: { x: number } }): void => {
    const delta = -info.delta.x / totalScrollWidth;
    const newProgress = Math.min(1, Math.max(0, manualProgress.get() + delta));
    manualProgress.set(newProgress);
  };

  // Handle slider interaction
  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = clickX / rect.width;
    animate(manualProgress, Math.min(1, Math.max(0, newProgress)), {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    });
  };

  // Handle slider drag
  const handleSliderDrag = (_: never, info: { point: { x: number } }): void => {
    const slider = document.getElementById('gallery-slider');
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const progress = (info.point.x - rect.left) / rect.width;
    manualProgress.set(Math.min(1, Math.max(0, progress)));
  };

  // Nav buttons
  const scrollLeft = (): void => {
    animate(manualProgress, Math.max(0, manualProgress.get() - 0.25), {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    });
  };

  const scrollRight = (): void => {
    animate(manualProgress, Math.min(1, manualProgress.get() + 0.25), {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    });
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[120vh] overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F6F3] via-[#FAF9F7] to-[#F8F6F3]" />

        {/* Section header */}
        {(title || subtitle) && (
          <motion.div
            className="relative z-10 px-6 mb-8"
            style={{
              y: headerY,
              opacity: headerOpacity,
            }}
          >
            <div className="max-w-7xl mx-auto">
              {subtitle && (
                <p className="font-body text-text-muted text-sm tracking-[0.25em] uppercase mb-3">
                  {subtitle}
                </p>
              )}
              {title && (
                <h2 className="font-heading text-[clamp(32px,6vw,56px)] text-text-primary">
                  {title}
                </h2>
              )}
            </div>
          </motion.div>
        )}

        {/* Horizontal scrolling gallery - draggable */}
        <motion.div
          ref={galleryRef}
          className="relative z-10 flex items-center gap-8 px-6 cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -totalScrollWidth, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={handleDrag}
        >
          {/* Starting spacer */}
          <div className="flex-shrink-0 w-16" />

          {artworks.map((artwork, index) => {
            // Individual card animations - first few cards are immediately visible
            // Later cards animate in as you scroll into view
            const isEarlyCard = index < 3;

            const cardProgress = useTransform(
              smoothScrollProgress,
              isEarlyCard
                ? [0.05, 0.15, 0.85, 0.95] // Early cards appear sooner
                : [0.1 + index * 0.015, 0.2 + index * 0.015, 0.85, 0.95],
              [0, 1, 1, 0.5]
            );

            const cardScale = useTransform(cardProgress, [0, 1], [0.92, 1]);
            const cardOpacity = useTransform(cardProgress, [0, 0.3, 1], [0, 1, 1]);

            return (
              <motion.div
                key={artwork.id}
                className="flex-shrink-0 w-[320px] md:w-[380px]"
                style={{
                  scale: cardScale,
                  opacity: cardOpacity,
                }}
              >
                {/* Inner hover container */}
                <div
                  className="group cursor-pointer transition-transform duration-300 hover:scale-[1.02] hover:-translate-y-2"
                  onClick={() => navigate(`/artwork/${artwork.id}`)}
                >
                  {/* Artwork card */}
                  <div className="relative overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-shadow duration-500">
                    <div
                      className={`w-full ${
                        artwork.aspectRatio === 'portrait'
                          ? 'aspect-[3/4]'
                          : artwork.aspectRatio === 'landscape'
                            ? 'aspect-[4/3]'
                            : 'aspect-square'
                      }`}
                      style={{ backgroundColor: artwork.placeholderColor }}
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Info on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <h3 className="font-heading text-xl text-white mb-1">
                        {artwork.title}
                      </h3>
                      <p className="font-body text-white/80 text-sm">
                        {artwork.year}
                      </p>
                    </div>
                  </div>

                  {/* Card footer - always visible */}
                  <div className="mt-4 px-1">
                    <p className="font-body text-text-secondary text-sm truncate">
                      {artwork.medium}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* End spacer */}
          <div className="flex-shrink-0 w-32" />
        </motion.div>

        {/* Controls area */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
          {/* Left arrow */}
          <motion.button
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center
              text-text-secondary hover:text-text-primary hover:bg-white transition-all"
            onClick={scrollLeft}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {/* Interactive slider */}
          <div
            id="gallery-slider"
            className="w-48 md:w-64 h-2 bg-black/10 rounded-full cursor-pointer relative overflow-hidden"
            onClick={handleSliderClick}
          >
            {/* Progress fill */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-text-primary/80 rounded-full"
              style={{ width: useTransform(manualProgress, [0, 1], ['0%', '100%']) }}
            />

            {/* Draggable thumb */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-text-primary rounded-full shadow-md cursor-grab active:cursor-grabbing"
              style={{ left: useTransform(manualProgress, [0, 1], ['0%', '100%']), x: '-50%' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              onDrag={handleSliderDrag}
            />
          </div>

          {/* Right arrow */}
          <motion.button
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center
              text-text-secondary hover:text-text-primary hover:bg-white transition-all"
            onClick={scrollRight}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Instruction hint */}
        <motion.p
          className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-text-muted text-xs z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering || isDragging ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          Drag or use controls to explore
        </motion.p>

        {/* Edge gradients for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F8F6F3] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F8F6F3] to-transparent z-20 pointer-events-none" />
      </div>
    </section>
  );
}

export default HorizontalGallerySection;
