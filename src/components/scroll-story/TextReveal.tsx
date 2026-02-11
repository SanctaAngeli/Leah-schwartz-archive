import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

interface TextRevealProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  stagger?: number;
  splitBy?: 'word' | 'character' | 'line';
}

function TextReveal({
  children,
  className = '',
  as: Tag = 'p',
  stagger: _stagger = 0.03,
  splitBy = 'word',
}: TextRevealProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.4'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Split text based on splitBy option
  const splitText = () => {
    if (splitBy === 'character') {
      return children.split('');
    } else if (splitBy === 'line') {
      return children.split('\n');
    }
    return children.split(' ');
  };

  const parts = splitText();
  const totalParts = parts.length;

  return (
    <div ref={containerRef} className="overflow-hidden">
      <Tag className={className}>
        {parts.map((part, index) => {
          // Calculate when this part should animate
          const start = (index / totalParts) * 0.6;
          const end = start + 0.4;

          const partY = useTransform(smoothProgress, [start, end], [60, 0]);
          const partOpacity = useTransform(smoothProgress, [start, end], [0, 1]);
          const partBlur = useTransform(smoothProgress, [start, end], [8, 0]);

          return (
            <motion.span
              key={index}
              className="inline-block"
              style={{
                y: partY,
                opacity: partOpacity,
                filter: useTransform(partBlur, (v) => `blur(${v}px)`),
              }}
            >
              {part}
              {splitBy === 'word' && index < parts.length - 1 ? '\u00A0' : ''}
            </motion.span>
          );
        })}
      </Tag>
    </div>
  );
}

// Simpler version that just fades and slides in
interface TextFadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function TextFadeIn({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: TextFadeInProps): JSX.Element {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

// Large quote with dramatic reveal
interface QuoteRevealProps {
  quote: string;
  author?: string;
  className?: string;
}

export function QuoteReveal({
  quote,
  author,
  className = '',
}: QuoteRevealProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
  });

  const scale = useTransform(smoothProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const y = useTransform(smoothProgress, [0, 1], [100, 0]);

  // Quote mark scale
  const quoteScale = useTransform(smoothProgress, [0, 0.8], [0.5, 1]);
  const quoteOpacity = useTransform(smoothProgress, [0, 0.6], [0, 0.15]);

  return (
    <div ref={containerRef} className={`relative py-16 ${className}`}>
      {/* Large decorative quote mark */}
      <motion.div
        className="absolute top-20 left-1/2 -translate-x-1/2 font-heading text-[20rem] text-text-primary pointer-events-none select-none leading-none"
        style={{
          scale: quoteScale,
          opacity: quoteOpacity,
        }}
      >
        "
      </motion.div>

      <motion.blockquote
        className="relative z-10 max-w-4xl mx-auto text-center px-6"
        style={{ scale, opacity, y }}
      >
        <p className="font-heading text-[clamp(24px,5vw,48px)] text-text-primary leading-relaxed italic">
          "{quote}"
        </p>
        {author && (
          <motion.footer
            className="mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <span className="font-body text-text-muted tracking-wider">
              — {author}
            </span>
          </motion.footer>
        )}
      </motion.blockquote>
    </div>
  );
}

// Counter that animates numbers
interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function Counter({
  end,
  suffix = '',
  prefix = '',
  className = '',
}: CounterProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'start 0.3'],
  });

  const count = useTransform(scrollYProgress, [0, 1], [0, end]);
  const rounded = useTransform(count, (v) => Math.round(v));

  return (
    <motion.div ref={containerRef} className={className}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.div>
  );
}

export default TextReveal;
