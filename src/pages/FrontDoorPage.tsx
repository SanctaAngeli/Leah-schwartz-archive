import { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import EntranceOverlay from '../components/home/EntranceOverlay';
import PaperMount from '../components/ui/PaperMount';
import { pickArtworkForDay, formatLobbyDate, daysSinceEpoch } from '../data/daily';
import { WINGS, LOBBY_QUOTES } from '../data/wings';

// The lobby. One painting (today's), her name, who she was in one line,
// one line of her voice, five doors. Quiet, single screen, no scroll
// required to "get it".

function FrontDoorPage(): JSX.Element {
  usePageMeta('', 'A digital archive of the artist Leah Schwartz (1920-2004) · American watercolorist, Mill Valley, California.');
  const navigate = useNavigate();
  const [showEntrance, setShowEntrance] = useState(false);

  const date = useMemo(() => new Date(), []);
  const artwork = useMemo(() => pickArtworkForDay(date), [date]);
  const quote = useMemo(
    () => LOBBY_QUOTES[((daysSinceEpoch(date) % LOBBY_QUOTES.length) + LOBBY_QUOTES.length) % LOBBY_QUOTES.length],
    [date]
  );

  const startEntrance = useCallback((): void => setShowEntrance(true), []);
  const dismissEntrance = useCallback((): void => setShowEntrance(false), []);

  return (
    <>
      <AnimatePresence>
        {showEntrance && <EntranceOverlay key="entrance" onComplete={dismissEntrance} />}
      </AnimatePresence>

      <main className="relative z-10 min-h-screen flex flex-col items-center px-6 pt-12 pb-6">
        <div className="my-auto flex flex-col items-center">
          {/* Today's painting · the lobby changes every day */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              to="/daily"
              className="font-body text-[10px] tracking-[0.3em] uppercase text-text-muted
                hover:text-text-primary transition-colors duration-300"
            >
              Today's painting · {formatLobbyDate(date)}
            </Link>
          </motion.div>

          {/* The painting itself · clicking it walks up to the piece */}
          <motion.button
            type="button"
            onClick={() => navigate(`/artwork/${artwork.id}`)}
            aria-label={`Open ${artwork.display_title || artwork.title}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
            className="group relative block cursor-pointer focus:outline-none mt-9"
          >
            <PaperMount
              src={artwork.imagePath || ''}
              alt={artwork.title}
              paper="wide"
              inset={{ x: 48, y: 30 }}
              shadow="soft"
              imgClassName="w-auto max-w-[min(86vw,540px)] max-h-[34vh]
                transition-transform duration-700 ease-out group-hover:scale-[1.012]"
            />
          </motion.button>

          {/* Wordmark + who she was */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-8 text-center"
          >
            <h1 className="font-heading text-[#8f8a6d] text-[clamp(20px,2vw,28px)]
              tracking-[0.42em] pl-[0.42em] leading-none">
              LEAH SCHWARTZ
            </h1>
            <p className="font-body text-text-muted mt-3 text-[12px] tracking-[0.14em] uppercase">
              1920 – 2004 · watercolors · Mill Valley, California
            </p>
            <p className="font-heading italic text-text-muted/80 mt-2 text-[12px] tracking-[0.06em]">
              {artwork.display_title || artwork.title}
              {artwork.medium ? <> &nbsp;·&nbsp; {artwork.medium.toLowerCase()}</> : null}
            </p>
          </motion.div>

          {/* One line of her voice · rotates with the painting */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="mt-5 max-w-xl text-center"
          >
            <p className="font-leah text-text-secondary text-[clamp(19px,2.1vw,23px)] leading-snug">
              “{quote.text}”
            </p>
          </motion.blockquote>

          {/* The intro, offered plainly */}
          <motion.button
            type="button"
            onClick={startEntrance}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 1 }}
            className="mt-5 font-body text-[10px] tracking-[0.3em] uppercase
              text-text-muted hover:text-text-primary border border-text-muted/25
              hover:border-text-muted/60 rounded-full px-5 py-2.5
              transition-colors duration-300"
          >
            ▶ &nbsp;Watch the intro
          </motion.button>
        </div>

        {/* Foot directory · the five wings */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-8 w-full px-[clamp(24px,6vw,96px)]"
          aria-label="The five wings"
        >
          <div className="mx-auto mb-5 h-[3px] w-[3px] rounded-full bg-text-muted/40" aria-hidden="true" />
          <ul className="flex flex-wrap items-center justify-center gap-x-[clamp(24px,5vw,80px)] gap-y-4">
            {WINGS.map((w) => (
              <li key={w.id}>
                <Link
                  to={w.path}
                  className="font-body text-[11px] tracking-[0.3em] uppercase
                    text-text-secondary hover:text-text-primary transition-colors duration-300"
                >
                  {w.label}
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
