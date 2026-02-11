import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Artwork } from '../../types';

interface FeaturedTrioProps {
  artworks: Artwork[];
  title: string;
  subtitle?: string;
  description?: string;
  reverse?: boolean;
  backgroundColor?: string;
}

function FeaturedTrio({
  artworks,
  title,
  subtitle,
  description,
  reverse = false,
  backgroundColor = 'transparent',
}: FeaturedTrioProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
  });

  // Text animations - keep visible longer during transitions
  const titleY = useTransform(smoothProgress, [0, 0.3, 0.6], [80, 0, -20]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.15, 0.7, 0.9], [0, 1, 1, 0]);

  // Ensure we have exactly 3 artworks
  const displayArtworks = artworks.slice(0, 3);
  while (displayArtworks.length < 3) {
    displayArtworks.push(displayArtworks[0] || artworks[0]);
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-[80vh] py-16 overflow-hidden"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className={`mb-20 ${reverse ? 'text-right' : 'text-left'}`}
          style={{
            y: titleY,
            opacity: titleOpacity,
          }}
        >
          {subtitle && (
            <motion.p
              className="font-body text-text-muted text-sm tracking-[0.25em] uppercase mb-4"
              initial={{ opacity: 0, x: reverse ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {subtitle}
            </motion.p>
          )}

          <motion.h2
            className="font-heading text-[clamp(36px,8vw,72px)] text-text-primary leading-tight"
            initial={{ opacity: 0, x: reverse ? 60 : -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1 }}
          >
            {title}
          </motion.h2>

          {description && (
            <motion.p
              className="font-body text-text-secondary text-lg max-w-xl mt-6"
              style={{ marginLeft: reverse ? 'auto' : 0 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        {/* Three artworks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {displayArtworks.map((artwork, index) => {
            // Staggered vertical offset based on position
            const baseOffset = index === 1 ? 60 : 0;
            const cardY = useTransform(
              smoothProgress,
              [0, 0.3, 0.6],
              [150 + index * 50, baseOffset, baseOffset - 20]
            );
            const cardOpacity = useTransform(
              smoothProgress,
              [0.05 + index * 0.03, 0.2 + index * 0.03, 0.8, 0.95],
              [0, 1, 1, 0.6]
            );
            const cardScale = useTransform(
              smoothProgress,
              [0.1, 0.4, 0.8],
              [0.9, 1, 0.95]
            );
            const cardRotate = useTransform(
              smoothProgress,
              [0, 0.3, 0.6],
              [index === 1 ? 0 : (index === 0 ? -3 : 3), 0, 0]
            );

            return (
              // Outer container handles scroll-driven transforms only
              <motion.div
                key={artwork.id}
                className="relative"
                style={{
                  y: cardY,
                  opacity: cardOpacity,
                  scale: cardScale,
                  rotate: cardRotate,
                }}
              >
                {/* Inner container handles hover transforms separately */}
                <motion.div
                  className="group cursor-pointer"
                  onClick={() => navigate(`/artwork/${artwork.id}`)}
                  whileHover={{ scale: 1.03, y: -10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {/* Card with 3D hover effect */}
                  <motion.div
                    className="relative overflow-hidden rounded-2xl shadow-2xl"
                    whileHover={{
                      boxShadow: '0 35px 100px rgba(0,0,0,0.25)',
                    }}
                  >
                    {/* Artwork */}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Artwork info on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <h3 className="font-heading text-xl text-white mb-1">
                        {artwork.title}
                      </h3>
                      <p className="font-body text-white/80 text-sm">
                        {artwork.year} · {artwork.medium}
                      </p>
                    </div>

                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
                          transform: 'translateX(-100%)',
                          animation: 'shine 0.8s ease-in-out forwards',
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Year badge */}
                  <motion.div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-pill px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="font-heading text-lg text-text-primary">
                      {artwork.year}
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add shine animation keyframes */}
      <style>{`
        @keyframes shine {
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}

export default FeaturedTrio;
