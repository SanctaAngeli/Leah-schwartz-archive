import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps): JSX.Element {
  return (
    <div
      className={`bg-gray-200 rounded-lg animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 1, className = '' }: SkeletonTextProps): JSX.Element {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 rounded animate-pulse ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

interface SkeletonArtworkProps {
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  className?: string;
}

export function SkeletonArtwork({ aspectRatio = 'square', className = '' }: SkeletonArtworkProps): JSX.Element {
  const aspectClasses = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    square: 'aspect-square',
  };

  return (
    <div
      className={`${aspectClasses[aspectRatio]} bg-gray-200 rounded-lg animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = '' }: SkeletonCardProps): JSX.Element {
  return (
    <div className={`space-y-3 ${className}`} aria-hidden="true">
      <SkeletonArtwork aspectRatio="landscape" />
      <SkeletonText lines={2} />
    </div>
  );
}

interface SkeletonGridProps {
  count?: number;
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}

export function SkeletonGrid({ count = 6, columns = 3, className = '' }: SkeletonGridProps): JSX.Element {
  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-4 ${className}`} aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  );
}

// Navigation pill skeleton
export function SkeletonNav(): JSX.Element {
  return (
    <div className="glass-pill px-2 py-2 flex items-center gap-1 animate-pulse" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-9 w-20 bg-gray-200/50 rounded-full" />
      ))}
    </div>
  );
}
