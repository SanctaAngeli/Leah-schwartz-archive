import { motion } from 'framer-motion';

interface PlaceholderArtworkProps {
  color: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  className?: string;
  onClick?: () => void;
}

function PlaceholderArtwork({
  color,
  aspectRatio = 'square',
  className = '',
  onClick,
}: PlaceholderArtworkProps): JSX.Element {
  const ratioClasses = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    square: 'aspect-square',
  };

  return (
    <motion.div
      className={`${ratioClasses[aspectRatio]} rounded-lg cursor-pointer ${className}`}
      style={{ backgroundColor: color }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
    />
  );
}

export default PlaceholderArtwork;
