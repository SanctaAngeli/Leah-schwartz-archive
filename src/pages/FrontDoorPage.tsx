import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

const HERO_SRC = '/artworks/full/mt-tam-from-sonoma.jpg';
const HERO_ALT = 'Mt. Tam from Sonoma — watercolor by Leah Schwartz';

const PATHS = [
  { to: '/canvas', label: 'See her work', sub: 'drift through every painting' },
  { to: '/her-words', label: 'Read her story', sub: 'her own voice, in full' },
  { to: '/themes', label: 'Browse themes', sub: 'twelve rooms of the book' },
];

const MORE_PATHS = [
  { to: '/walk',           label: 'Walk with her',   sub: 'a guided eight-painting tour' },
  { to: '/atlas',          label: 'Color Atlas',     sub: 'her chromatic life' },
  { to: '/obsessions',     label: 'Obsessions',      sub: 'subjects she returned to' },
  { to: '/at-her-age',     label: 'At her age',      sub: 'a slider through 84 years' },
  { to: '/constellation',  label: 'Constellation',   sub: 'navigate by association' },
  { to: '/last-paintings', label: 'Last Paintings',  sub: 'a quiet room for late work' },
];

function FrontDoorPage(): JSX.Element {
  usePageMeta('', "A digital archive of the artist Leah Schwartz (1920–2004).");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-4xl"
      >
        <img
          src={HERO_SRC}
          alt={HERO_ALT}
          className="w-full h-auto rounded-md shadow-[0_28px_80px_rgba(0,0,0,0.14)]"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="mt-14 text-center"
      >
        <h1 className="font-heading text-[clamp(40px,7vw,80px)] tracking-[0.04em] text-text-primary leading-none">
          Leah Schwartz
        </h1>
        <p className="font-body text-text-muted mt-3 tracking-[0.4em] text-xs uppercase">
          1920 — 2004
        </p>
      </motion.div>

      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-10 max-w-2xl text-center"
      >
        <p className="font-leah text-[clamp(22px,3vw,32px)] text-text-secondary leading-snug">
          “Not a need to create ART, but a need to preserve ephemeral things that I love to look at.”
        </p>
        <cite className="block mt-4 text-text-muted text-[11px] not-italic tracking-[0.25em] uppercase">
          From her own foreword
        </cite>
      </motion.blockquote>

      <motion.nav
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="mt-14 flex flex-col sm:flex-row gap-3 items-center"
        aria-label="Primary entry points"
      >
        {PATHS.map((p) => (
          <Link
            key={p.to}
            to={p.to}
            className="group flex flex-col items-center bg-white/80 backdrop-blur-md
              border border-white/40 rounded-full px-7 py-3
              shadow-[0_4px_24px_rgba(0,0,0,0.06)]
              hover:bg-white hover:shadow-[0_10px_36px_rgba(0,0,0,0.10)] hover:-translate-y-0.5
              transition-all duration-300"
          >
            <span className="font-heading text-text-primary text-lg leading-tight">{p.label}</span>
            <span className="font-body text-text-muted text-[11px] tracking-wider mt-0.5">{p.sub}</span>
          </Link>
        ))}
      </motion.nav>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="mt-20 max-w-4xl w-full"
        aria-labelledby="more-ways-heading"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-text-muted/20" aria-hidden="true" />
          <p
            id="more-ways-heading"
            className="font-body text-text-muted uppercase tracking-[0.35em] text-[11px]"
          >
            More ways in
          </p>
          <div className="flex-1 h-px bg-text-muted/20" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MORE_PATHS.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="group flex flex-col items-center text-center
                bg-white/70 backdrop-blur-md border border-white/40
                rounded-2xl px-4 py-3
                shadow-[0_2px_14px_rgba(0,0,0,0.04)]
                hover:bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5
                transition-all duration-300"
            >
              <span className="font-heading text-text-primary text-[15px] leading-tight">{p.label}</span>
              <span className="font-body text-text-muted text-[11px] tracking-wider mt-1">{p.sub}</span>
            </Link>
          ))}
        </div>
      </motion.section>
    </main>
  );
}

export default FrontDoorPage;
