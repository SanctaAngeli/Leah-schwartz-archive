import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ColorShiftSectionProps {
  children: ReactNode;
  fromColor?: string;
  toColor?: string;
  className?: string;
}

function ColorShiftSection({
  children,
  fromColor = '#FAFAFA',
  toColor = '#F5F0EB',
  className = '',
}: ColorShiftSectionProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
  });

  // Interpolate between colors
  const backgroundColor = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [fromColor, toColor, fromColor]
  );

  return (
    <motion.section
      ref={containerRef}
      className={`relative ${className}`}
      style={{ backgroundColor }}
    >
      {children}
    </motion.section>
  );
}

// Gradient section with animated gradient movement
interface AnimatedGradientProps {
  children: ReactNode;
  colors?: string[];
  className?: string;
}

export function AnimatedGradient({
  children,
  colors = ['#FAFAFA', '#F5F0EB', '#E8E4D9', '#F5F0EB', '#FAFAFA'],
  className = '',
}: AnimatedGradientProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 20,
  });

  // Move gradient position based on scroll
  const gradientY = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${colors.join(', ')})`,
          backgroundSize: '100% 300%',
          backgroundPositionY: gradientY,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

// Split color section (left/right different colors)
interface SplitColorSectionProps {
  children: ReactNode;
  leftColor?: string;
  rightColor?: string;
  splitPosition?: number; // 0-100 percentage
  className?: string;
}

export function SplitColorSection({
  children,
  leftColor = '#FAFAFA',
  rightColor = '#F5F0EB',
  splitPosition = 50,
  className = '',
}: SplitColorSectionProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
  });

  // Animate split position
  const animatedSplit = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [splitPosition - 20, splitPosition, splitPosition + 20]
  );

  return (
    <section ref={containerRef} className={`relative ${className}`}>
      {/* Left color */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: leftColor }}
      />

      {/* Right color with animated clip */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundColor: rightColor,
          clipPath: useTransform(
            animatedSplit,
            (v) => `polygon(${v}% 0%, 100% 0%, 100% 100%, ${v}% 100%)`
          ),
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export default ColorShiftSection;
