import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import EntranceOverlay from '../components/home/EntranceOverlay';

const HERO_SRC = '/artworks/full/mt-tam-from-sonoma.jpg';
const HERO_ALT = 'Mt. Tam from Sonoma - watercolor by Leah Schwartz';

// One quiet line of destinations, spread across the foot of the page like a
// museum wall directory. Real routes behind understated labels.
const NAV = [
  { to: '/canvas',     label: 'Paintings' },
  { to: '/themes',     label: 'Themes' },
  { to: '/her-words',  label: 'Her Story' },
  { to: '/at-her-age', label: 'Eras' },
  { to: '/studio',     label: 'Studio' },
  { to: '/atlas',      label: 'Atlas' },
  { to: '/about',      label: 'About' },
];

function FrontDoorPage(): JSX.Element {
  usePageMeta('', 'A digital archive of the artist Leah Schwartz (1920-2004).');
  const [showEntrance, setShowEntrance] = useState(false);

  const startEntrance = useCallback((): void => setShowEntrance(true), []);
  const dismissEntrance = useCallback((): void => setShowEntrance(false), []);

  return (
    <>
      <AnimatePresence>
        {showEntrance && <EntranceOverlay key="entrance" onComplete={dismissEntrance} />}
      </AnimatePresence>

      {/* Off-screen SVG filter · roughens the paper backing into a deckled edge */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="deckle">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-24">
        {/* The single held painting · deckled paper backing + soft shadow */}
        <motion.button
          type="button"
          onClick={startEntrance}
          aria-label="Mt. Tam from Sonoma — play the cinematic intro"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
          className="group relative block cursor-pointer focus:outline-none"
        >
          {/* Paper backing · slightly larger, deckle-filtered, warm white */}
          <div
            aria-hidden="true"
            className="absolute -inset-[14px] bg-[#FBF7EC]
              shadow-[0_30px_70px_-24px_rgba(74,62,40,0.30)]"
            style={{ filter: 'url(#deckle)' }}
          />
          <img
            src={HERO_SRC}
            alt={HERO_ALT}
            className="relative w-[clamp(320px,46vw,620px)] h-auto
              transition-transform duration-700 ease-out group-hover:scale-[1.012]"
          />
          {/* Hairline play affordance · only on hover, never shouting */}
          <span
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100
              transition-opacity duration-300
              font-body text-[10px] tracking-[0.3em] uppercase text-[#5a5240]
              bg-[#FBF7EC]/70 backdrop-blur-sm rounded-full px-3 py-1"
            aria-hidden="true"
          >
            ▶ Watch intro
          </span>
        </motion.button>

        {/* Wordmark + tombstone credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-16 text-center"
        >
          <h1 className="font-heading text-[#8f8a6d] text-[clamp(20px,2vw,28px)]
            tracking-[0.42em] pl-[0.42em] leading-none">
            LEAH SCHWARTZ
          </h1>
          <p className="font-heading italic text-text-muted/80 mt-4 text-[13px] tracking-[0.06em]">
            Mt. Tam from Sonoma&nbsp;&nbsp;·&nbsp;&nbsp;watercolor
          </p>
        </motion.div>

        {/* Foot directory · one understated row, spread full-width */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="absolute inset-x-0 bottom-10 px-[clamp(24px,6vw,96px)]"
          aria-label="Primary entry points"
        >
          <div className="mx-auto mb-7 h-[3px] w-[3px] rounded-full bg-text-muted/40" aria-hidden="true" />
          <ul className="flex flex-wrap items-center justify-center gap-x-[clamp(24px,5vw,80px)] gap-y-4">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="font-body text-[11px] tracking-[0.3em] uppercase
                    text-text-muted hover:text-text-primary transition-colors duration-300"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      </main>
    </>
  );
}

export default FrontDoorPage;
