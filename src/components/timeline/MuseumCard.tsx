import { motion } from 'framer-motion';
import type { Artwork } from '../../types';

interface MuseumCardProps {
  artwork: Artwork;
  onClick?: () => void;
  index?: number;
}

// Location display names
const locationNames: Record<string, string> = {
  'mount-tam': 'Mount Tamalpais',
  'golden-gate': 'Golden Gate',
  'the-house': 'The House',
  'san-francisco': 'San Francisco',
  'sausalito': 'Sausalito',
  'muir-woods': 'Muir Woods',
  'point-reyes': 'Point Reyes',
  'berkeley': 'Berkeley',
  'fishermans-wharf': "Fisherman's Wharf",
};

// Theme display names
const themeNames: Record<string, string> = {
  landscapes: 'Landscape',
  watercolors: 'Watercolor',
  portraits: 'Portrait',
  people: 'People',
  'still-life': 'Still Life',
  collage: 'Collage',
  notebooks: 'Notebook',
  sketches: 'Sketch',
  politics: 'Political',
};

function MuseumCard({ artwork, onClick, index = 0 }: MuseumCardProps): JSX.Element {
  const aspectClasses = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    square: 'aspect-square',
  };

  const locationDisplay = artwork.location ? locationNames[artwork.location] || artwork.location : null;
  const primaryTheme = artwork.themes?.[0] ? themeNames[artwork.themes[0]] || artwork.themes[0] : null;

  return (
    <motion.article
      className="group cursor-pointer"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 24,
        delay: 0.04 * Math.min(index, 10),
      }}
      onClick={onClick}
    >
      {/* Museum card container */}
      <div
        className="
          bg-white/80 backdrop-blur-xl
          border border-white/50
          rounded-2xl
          shadow-[0_4px_20px_rgba(0,0,0,0.06)]
          overflow-hidden
          transition-all duration-300 ease-out
          group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]
          group-hover:-translate-y-1
        "
      >
        {/* Artwork image area */}
        <div className="relative p-3 pb-0">
          <div
            className={`
              ${aspectClasses[artwork.aspectRatio]}
              rounded-xl overflow-hidden
              relative
            `}
          >
            {/* Placeholder artwork */}
            <div
              className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              style={{ backgroundColor: artwork.placeholderColor }}
            />

            {/* Subtle frame overlay */}
            <div
              className="
                absolute inset-0 rounded-xl
                ring-1 ring-black/5
                pointer-events-none
              "
            />

            {/* Featured badge */}
            {artwork.featured && (
              <div
                className="
                  absolute top-2 right-2
                  bg-white/90 backdrop-blur-sm
                  text-[10px] font-medium text-text-muted uppercase tracking-wider
                  px-2 py-0.5 rounded-full
                  shadow-sm
                "
              >
                Featured
              </div>
            )}
          </div>
        </div>

        {/* Museum label */}
        <div className="p-4 pt-3">
          {/* Title */}
          <h3
            className="
              font-heading text-base text-text-primary
              leading-snug
              group-hover:text-text-secondary transition-colors
            "
          >
            {artwork.title}
          </h3>

          {/* Medium and dimensions */}
          <p className="font-body text-sm text-text-muted mt-1">
            {artwork.medium}
            {artwork.dimensions && (
              <span className="text-text-muted/60"> · {artwork.dimensions}</span>
            )}
          </p>

          {/* Divider */}
          <div className="h-px bg-black/5 my-3" />

          {/* Details grid */}
          <div className="space-y-1.5">
            {/* Location */}
            {locationDisplay && (
              <div className="flex items-center gap-2 text-xs">
                <svg className="w-3.5 h-3.5 text-text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-body text-text-muted">{locationDisplay}</span>
              </div>
            )}

            {/* Collection */}
            {artwork.collection && (
              <div className="flex items-center gap-2 text-xs">
                <svg className="w-3.5 h-3.5 text-text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-body text-text-muted">{artwork.collection}</span>
              </div>
            )}
          </div>

          {/* Theme tags */}
          {artwork.themes && artwork.themes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {artwork.themes.slice(0, 3).map((theme) => (
                <span
                  key={theme}
                  className="
                    bg-black/[0.03]
                    text-[10px] font-body text-text-muted
                    px-2 py-0.5 rounded-full
                    uppercase tracking-wide
                  "
                >
                  {themeNames[theme] || theme}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default MuseumCard;
