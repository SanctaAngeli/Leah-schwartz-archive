import { motion, useTransform, useInView, useMotionValue, animate } from 'framer-motion';
import { useRef, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Artwork } from '../../types';

interface Stat {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

interface StatsSectionProps {
  stats: Stat[];
  title?: string;
  subtitle?: string;
}

function StatsSection({
  stats,
  title,
  subtitle,
}: StatsSectionProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-20%' });

  return (
    <section
      ref={containerRef}
      className="relative py-16 overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        {(title || subtitle) && (
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {subtitle && (
              <p className="font-body text-text-muted text-sm tracking-[0.25em] uppercase mb-4">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="font-heading text-[clamp(32px,6vw,56px)] text-text-primary">
                {title}
              </h2>
            )}
          </motion.div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={stat.label}
              stat={stat}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface AnimatedStatProps {
  stat: Stat;
  index: number;
  isInView: boolean;
}

function AnimatedStat({ stat, index, isInView }: AnimatedStatProps): JSX.Element {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const startTime = Date.now();
    const startDelay = index * 150;

    const timer = setTimeout(() => {
      const animateValue = (): void => {
        const elapsed = Date.now() - startTime - startDelay;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease out cubic)
        const eased = 1 - Math.pow(1 - progress, 3);

        setDisplayValue(Math.round(stat.value * eased));

        if (progress < 1) {
          requestAnimationFrame(animateValue);
        }
      };

      requestAnimationFrame(animateValue);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [isInView, stat.value, index]);

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="font-heading text-[clamp(48px,10vw,80px)] text-text-primary leading-none">
        {stat.prefix}
        <span>{displayValue}</span>
        {stat.suffix}
      </div>
      <p className="font-body text-text-muted text-sm mt-4 tracking-wider uppercase">
        {stat.label}
      </p>
    </motion.div>
  );
}

// Interactive Career timeline visualization with artwork preview
interface TimelineVisualizationProps {
  startYear: number;
  endYear: number;
  milestones?: { year: number; label: string }[];
  artworks?: Artwork[];
}

export function TimelineVisualization({
  startYear,
  endYear,
  milestones = [],
  artworks = [],
}: TimelineVisualizationProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Manual scrub position (0 to 1)
  const scrubProgress = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentYear, setCurrentYear] = useState(startYear);

  // Update current year based on scrub progress
  useEffect(() => {
    const unsubscribe = scrubProgress.on('change', (value) => {
      const year = Math.round(startYear + value * (endYear - startYear));
      setCurrentYear(year);
    });
    return unsubscribe;
  }, [scrubProgress, startYear, endYear]);

  // Get artwork for current year (or closest)
  const currentArtwork = useMemo(() => {
    if (artworks.length === 0) return null;

    // Find artwork from current year or closest before
    const yearArtworks = artworks.filter(a => a.year && a.year <= currentYear);
    if (yearArtworks.length === 0) return artworks[0];

    // Get the most recent one up to current year
    return yearArtworks.reduce((prev, curr) =>
      (curr.year || 0) > (prev.year || 0) ? curr : prev
    );
  }, [artworks, currentYear]);

  const totalYears = endYear - startYear;

  // Handle slider click
  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = clickX / rect.width;
    animate(scrubProgress, Math.min(1, Math.max(0, newProgress)), {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    });
  };

  // Handle drag on slider thumb
  const handleDrag = (_: never, info: { point: { x: number } }): void => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const progress = (info.point.x - rect.left) / rect.width;
    scrubProgress.set(Math.min(1, Math.max(0, progress)));
  };

  return (
    <section ref={containerRef} className="relative py-12 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        {/* Current year and artwork preview - centered layout */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-12">
          {/* Year display - always centered */}
          <motion.div
            className="text-center"
            animate={{ scale: isDragging ? 1.05 : 1 }}
          >
            <motion.p
              className="font-heading text-[clamp(48px,12vw,96px)] text-text-primary leading-none"
              key={currentYear}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {currentYear}
            </motion.p>
            <p className="font-body text-text-muted text-sm mt-2">
              {currentYear < 1975 ? 'Early Period' : currentYear < 1990 ? 'San Francisco Years' : 'Late Reflections'}
            </p>
          </motion.div>

          {/* Artwork preview - centered */}
          {currentArtwork && (
            <motion.div
              className="relative w-full max-w-xs cursor-pointer group"
              onClick={() => navigate(`/artwork/${currentArtwork.id}`)}
              whileHover={{ scale: 1.02 }}
              layout
            >
              <motion.div
                className="rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow"
                key={currentArtwork.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="w-full aspect-[4/3]"
                  style={{ backgroundColor: currentArtwork.placeholderColor }}
                />
              </motion.div>
              <p className="font-body text-text-secondary text-sm mt-3 text-center truncate">
                {currentArtwork.title}
              </p>
            </motion.div>
          )}
        </div>

        {/* Interactive timeline slider */}
        <div
          ref={sliderRef}
          className="relative h-3 bg-black/10 rounded-full cursor-pointer"
          onClick={handleSliderClick}
        >
          {/* Progress fill */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-text-primary rounded-full"
            style={{ width: useTransform(scrubProgress, [0, 1], ['0%', '100%']) }}
          />

          {/* Milestone markers */}
          {milestones.map((milestone, index) => {
            const position = ((milestone.year - startYear) / totalYears) * 100;

            return (
              <motion.div
                key={milestone.year}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${position}%` }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {/* Marker dot */}
                <div className="w-4 h-4 bg-white border-2 border-text-primary rounded-full -translate-x-1/2" />

                {/* Label */}
                <div
                  className={`absolute whitespace-nowrap ${
                    index % 2 === 0 ? 'bottom-full mb-4' : 'top-full mt-4'
                  } left-1/2 -translate-x-1/2`}
                >
                  <p className="font-body text-xs text-text-muted text-center">
                    {milestone.label}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* Draggable scrub handle */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-text-primary rounded-full shadow-lg
              cursor-grab active:cursor-grabbing flex items-center justify-center"
            style={{
              left: useTransform(scrubProgress, [0, 1], ['0%', '100%']),
              x: '-50%',
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            onDrag={handleDrag}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 1.1 }}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </motion.div>
        </div>

        {/* Year labels */}
        <div className="flex justify-between mt-4">
          <span className="font-heading text-lg text-text-primary">{startYear}</span>
          <span className="font-body text-text-muted text-xs">Drag to explore</span>
          <span className="font-heading text-lg text-text-primary">{endYear}</span>
        </div>

        {/* Decade markers */}
        <div className="flex justify-between mt-2 px-1">
          {Array.from(
            { length: Math.ceil((endYear - startYear) / 10) + 1 },
            (_, i) => startYear + i * 10
          )
            .filter((year) => year <= endYear)
            .map((decade) => (
              <span key={decade} className="font-body text-xs text-text-muted">
                {decade}s
              </span>
            ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
