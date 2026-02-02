import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface PillButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-text-primary text-white',
    'hover:bg-text-secondary',
    'active:bg-text-primary',
  ].join(' '),
  secondary: [
    'bg-white/80 backdrop-blur-xl',
    'border border-white/40',
    'text-text-primary',
    'shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.6)]',
    'hover:bg-white/90',
  ].join(' '),
  ghost: [
    'bg-transparent',
    'text-text-secondary',
    'hover:text-text-primary',
    'hover:bg-white/50',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-4 text-base gap-2.5',
};

const disabledStyles = 'opacity-50 cursor-not-allowed pointer-events-none';

const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      iconLeft,
      iconRight,
      className = '',
      ...props
    },
    ref
  ): JSX.Element => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'rounded-pill',
      'font-body font-medium',
      'transition-colors duration-300 ease-smooth',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/50 focus-visible:ring-offset-2',
      variantStyles[variant],
      sizeStyles[size],
      disabled ? disabledStyles : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        disabled={disabled}
        whileHover={disabled ? undefined : { scale: 1.02 }}
        whileTap={disabled ? undefined : { scale: 0.98 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
        {...props}
      >
        {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
        <span>{children}</span>
        {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
      </motion.button>
    );
  }
);

PillButton.displayName = 'PillButton';

export { PillButton };
export type { PillButtonProps, ButtonVariant, ButtonSize };
