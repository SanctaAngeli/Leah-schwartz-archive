import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';

type GlassVariant = 'default' | 'subtle' | 'prominent' | 'image';
type GlassSize = 'sm' | 'md' | 'lg';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: GlassVariant;
  size?: GlassSize;
  hover?: boolean;
  className?: string;
}

const variantStyles: Record<GlassVariant, string> = {
  default: [
    'bg-white/70 backdrop-blur-xl',
    'border border-white/30',
    'shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)]',
  ].join(' '),
  subtle: [
    'bg-white/50 backdrop-blur-lg',
    'border border-white/20',
    'shadow-[0_4px_20px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.4)]',
  ].join(' '),
  prominent: [
    'bg-white/80 backdrop-blur-2xl',
    'border border-white/40',
    'shadow-[0_12px_40px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6)]',
  ].join(' '),
  image: [
    'bg-white/0 overflow-hidden',
    'shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
  ].join(' '),
};

const sizeStyles: Record<GlassSize, string> = {
  sm: 'p-4 rounded-2xl',
  md: 'p-6 rounded-3xl',
  lg: 'p-8 rounded-[32px]',
};

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      hover = true,
      className = '',
      ...props
    },
    ref
  ): JSX.Element => {
    const baseClasses = [
      variantStyles[variant],
      sizeStyles[size],
      className,
    ].filter(Boolean).join(' ');

    return (
      <motion.div
        ref={ref}
        className={baseClasses}
        whileHover={hover ? { y: -4 } : undefined}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard };
export type { GlassCardProps, GlassVariant, GlassSize };
