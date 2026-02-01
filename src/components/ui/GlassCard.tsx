import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

function GlassCard({
  children,
  className = '',
  onClick,
  hover = true,
}: GlassCardProps): JSX.Element {
  return (
    <motion.div
      className={`glass-card p-6 ${className}`}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

export default GlassCard;
