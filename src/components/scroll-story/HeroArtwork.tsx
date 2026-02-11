import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Artwork } from '../../types';

interface HeroArtworkProps {
  artwork: Artwork;
  caption?: string;
  alignment?: 'left' | 'center' | 'right';
}

function HeroArtwork({
  artwork,
  caption,
  alignment = 'center',
}: HeroArtworkProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);

  // Mouse position for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse tracking
  const smoothMouseX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  // 3D rotation based on mouse
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);

  // Glare position
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], [0, 100]);

  // Scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
  });

  // Scroll-based transforms - keep content visible longer
  const scale = useTransform(smoothProgress, [0, 0.25, 0.6, 0.8], [0.7, 1, 1, 0.95]);
  const opacity = useTransform(smoothProgress, [0, 0.15, 0.75, 0.92], [0, 1, 1, 0]);
  const y = useTransform(smoothProgress, [0, 0.25, 0.6, 0.85], [150, 0, 0, -60]);

  // Caption transforms - keep visible longer
  const captionY = useTransform(smoothProgress, [0.2, 0.35, 0.7], [40, 0, -20]);
  const captionOpacity = useTransform(smoothProgress, [0.2, 0.3, 0.75, 0.9], [0, 1, 1, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!artworkRef.current) return;

    const rect = artworkRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize mouse position to -0.5 to 0.5
    const normalizedX = (e.clientX - centerX) / rect.width;
    const normalizedY = (e.clientY - centerY) / rect.height;

    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[110vh] py-16 flex items-center"
    >
      <div className="max-w-6xl mx-auto px-6 w-full">
        <motion.div
          className={`relative max-w-4xl ${alignmentClasses[alignment]}`}
          style={{ y, opacity, scale }}
        >
          {/* 3D Artwork container */}
          <motion.div
            ref={artworkRef}
            className="relative cursor-pointer"
            style={{
              perspective: 1200,
              transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate(`/artwork/${artwork.id}`)}
          >
            <motion.div
              className="relative"
              style={{
                rotateX: isHovering ? rotateX : 0,
                rotateY: isHovering ? rotateY : 0,
                transformStyle: 'preserve-3d',
              }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              {/* Shadow layer (moves opposite to create depth) */}
              <motion.div
                className="absolute -inset-4 rounded-3xl"
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  filter: 'blur(40px)',
                  transform: 'translateZ(-50px)',
                  x: useTransform(smoothMouseX, [-0.5, 0.5], [20, -20]),
                  y: useTransform(smoothMouseY, [-0.5, 0.5], [20, -20]),
                }}
              />

              {/* Main artwork */}
              <div
                className={`relative overflow-hidden rounded-2xl ${
                  artwork.aspectRatio === 'portrait'
                    ? 'aspect-[3/4]'
                    : artwork.aspectRatio === 'landscape'
                      ? 'aspect-[4/3]'
                      : 'aspect-square'
                }`}
                style={{
                  backgroundColor: artwork.placeholderColor,
                  boxShadow: isHovering
                    ? '0 50px 100px rgba(0,0,0,0.3), 0 20px 40px rgba(0,0,0,0.2)'
                    : '0 30px 80px rgba(0,0,0,0.2)',
                  transform: 'translateZ(0)',
                }}
              >
                {/* Glare/shine effect */}
                {isHovering && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.25) 0%, transparent 50%)`,
                      opacity: 0.8,
                    }}
                  />
                )}

                {/* Frame border effect */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 60px rgba(0,0,0,0.1)',
                    borderRadius: 'inherit',
                  }}
                />
              </div>

              {/* Floating depth layer (appears to lift on hover) */}
              {isHovering && (
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none"
                  initial={{ opacity: 0, z: 20 }}
                  animate={{ opacity: 1, z: 40 }}
                  style={{
                    transform: 'translateZ(30px)',
                  }}
                />
              )}
            </motion.div>

            {/* View indicator */}
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-pill px-6 py-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovering ? 1 : 0, y: isHovering ? 0 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <span className="font-body text-sm text-text-primary">
                Click to explore
              </span>
            </motion.div>
          </motion.div>

          {/* Caption - always centered for consistent layout */}
          {caption && (
            <motion.div
              className="mt-12 text-center"
              style={{
                y: captionY,
                opacity: captionOpacity,
              }}
            >
              <h3 className="font-heading text-3xl md:text-4xl text-text-primary mb-2">
                {artwork.title}
              </h3>
              <p className="font-body text-text-secondary text-lg mb-4">
                {artwork.year} · {artwork.medium}
              </p>
              <p className="font-body text-text-muted max-w-xl leading-relaxed mx-auto">
                {caption}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default HeroArtwork;
