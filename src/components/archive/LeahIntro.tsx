import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import artworksData from '../../data/artworks.json';
import themesData from '../../data/themes.json';
import { JOURNALS } from '../../data/journals';
import { ARCHITECTURE, OBJECTS } from '../../data/studioCollections';
import { ARTIST_STATEMENT } from '../../data/statement';

// Who Leah was, in a few plain facts and her own words, followed by an
// overview of what the archive holds. Opens the archive and the tour.

const paintingChapters = themesData.filter((t) => t.id !== 'autobiography').length;

const OVERVIEW = [
  { count: artworksData.length, label: 'paintings, drawings and collages', to: '/archive/paintings' },
  { count: paintingChapters, label: 'chapters in her book', to: '/themes' },
  { count: JOURNALS.length, label: 'journals', to: '/journals' },
  { count: ARCHITECTURE.items.length, label: 'house designs', to: ARCHITECTURE.path },
  { count: OBJECTS.items.length, label: 'objects', to: OBJECTS.path },
];

interface Props {
  /** Show the overview of her work under the introduction. */
  overview?: boolean;
  /** Link the overview and statement to archive pages (off inside the tour). */
  linked?: boolean;
}

function LeahIntro({ overview = true, linked = true }: Props): JSX.Element {
  return (
    <section aria-labelledby="leah-intro-title">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <img
          src="/video/leah-reads-her-journal.jpg"
          alt="Leah Schwartz at her kitchen table, reading from her journal"
          width={640}
          height={480}
          className="w-full h-auto rounded-2xl shadow-glass"
        />
        <div>
          <h1 id="leah-intro-title" className="font-heading text-[clamp(40px,6vw,64px)] text-text-primary leading-none">
            Leah Schwartz
          </h1>
          <p className="font-body text-text-muted tracking-wider mt-3">1920 – 2017</p>
          <p className="font-body text-text-secondary mt-4">
            Born in Rock Island, Illinois, on July 28, 1920. She lived and painted in Mill Valley, California.
          </p>
          <blockquote className="font-heading text-lg md:text-xl italic text-text-primary leading-relaxed mt-6 border-l-2 border-[#E2DBC9] pl-5">
            <p>{ARTIST_STATEMENT[0]}</p>
            <footer className="font-body text-sm not-italic text-text-muted mt-3">
              Leah Schwartz
              {linked && (
                <>
                  {' · '}
                  <Link to="/about" className="underline hover:text-text-primary">her full statement and biography</Link>
                </>
              )}
            </footer>
          </blockquote>
        </div>
      </motion.div>

      {overview && (
        <ul className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-14" aria-label="What the archive holds">
          {OVERVIEW.map((o) => (
            <li key={o.label}>
              {linked ? (
                <Link to={o.to} className="block glass-card p-5 h-full hover:shadow-glass transition-shadow">
                  <span className="block font-heading text-4xl text-text-primary">{o.count}</span>
                  <span className="block font-body text-sm text-text-secondary mt-1">{o.label}</span>
                </Link>
              ) : (
                <div className="glass-card p-5 h-full">
                  <span className="block font-heading text-4xl text-text-primary">{o.count}</span>
                  <span className="block font-body text-sm text-text-secondary mt-1">{o.label}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default LeahIntro;
