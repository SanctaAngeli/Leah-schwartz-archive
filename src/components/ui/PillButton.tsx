import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PillButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

function PillButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
}: PillButtonProps): JSX.Element {
  const variantClasses = {
    primary: 'bg-text-primary text-white hover:bg-text-secondary',
    secondary: 'glass-pill text-text-primary hover:bg-white/90',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/50',
  };

  return (
    <motion.button
      className={`px-6 py-3 rounded-full font-body font-medium text-sm transition-colors duration-300 ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

export default PillButton;
