import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import artworksData from '../data/artworks.json';
import { OBSESSIONS } from '../data/obsessions';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

function matchesObsession(art: Artwork, match: string[], exclude?: string[]): boolean {
  const haystack = ((art.display_title || art.title) + ' ' + art.id).toLowerCase();
  if (exclude?.some((tok) => haystack.includes(tok.toLowerCase()))) return false;
  return match.some((tok) => haystack.includes(tok.toLowerCase()));
}

function ObsessionsPage(): JSX.Element {
  usePageMeta(
    'Obsessions',
    'The subjects Leah Schwartz returned to · Mt. Tam, irises, Naxos, pears, kitchens. Serial attention across her work.',
  );

  const obsessions = useMemo(() => {
    return OBSESSIONS.map((o) => {
      const matches = artworks.filter((a) => a.imagePath && matchesObsession(a, o.match, o.exclude));
      matches.sort((a, b) => (a.book_page || 9999) - (b.book_page || 9999));
      return { ...o, artworks: matches };
    }).filter((o) => o.artworks.length >= 2);
  }, []);

  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <motion.header
        className="max-w-3xl mx-auto text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-body text-text-muted uppercase tracking-[0.3em] text-xs mb-3">
          Subjects she returned to
        </p>
        <h1 className="font-heading text-5xl md:text-7xl text-text-primary leading-tight">
          Obsessions
        </h1>
        <p className="font-leah text-text-muted mt-3 text-3xl md:text-4xl leading-none">
          serial attention
        </p>
        <p className="font-body text-text-secondary mt-6 max-w-2xl mx-auto leading-relaxed">
          Every painter has subjects they return to. Leah painted Mt. Tam from
          three vantages, Naxos in seven ways, irises eleven times, pears like
          a pianist running scales. Each row below is one of those returns.
        </p>
      </motion.header>

      <div className="max-w-6xl mx-auto space-y-24">
        {obsessions.map((o, idx) => (
          <motion.section
            key={o.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: idx * 0.05 }}
          >
            <header className="flex items-baseline gap-6 mb-6 pb-4 border-b"
              style={{ borderColor: o.accent + '44' }}
            >
              <div
                className="w-2 h-12 rounded-full"
                style={{ backgroundColor: o.accent }}
                aria-hidden="true"
              />
              <div className="flex-1">
                <p className="font-body text-text-muted uppercase tracking-widest text-xs">
                  {o.artworks.length} paintings
                </p>
                <h2 className="font-heading text-3xl md:text-4xl text-text-primary leading-tight">
                  {o.title}
                </h2>
                <p className="font-leah text-text-muted text-2xl md:text-3xl leading-none mt-1">
                  {o.subtitle}
                </p>
              </div>
            </header>

            <p className="font-body text-text-secondary mb-8 max-w-2xl leading-relaxed">
              {o.note}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {o.artworks.map((art) => (
                <Link
                  key={art.id}
                  to={`/artwork/${art.id}`}
                  className="group block"
                >
                  <div
                    className="aspect-square relative rounded-sm overflow-hidden shadow-[0_3px_14px_rgba(0,0,0,0.08)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition-shadow"
                    style={{ backgroundColor: art.placeholderColor }}
                  >
                    <img
                      src={art.thumbPath || art.imagePath || ''}
                      alt={art.display_title || art.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                  <p className="font-body text-[12px] text-text-primary mt-2 truncate leading-tight">
                    {art.display_title || art.title}
                  </p>
                  {art.year && (
                    <p className="font-body text-[10px] text-text-muted">
                      {art.year}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      <p className="max-w-2xl mx-auto text-center mt-24 font-body text-text-muted text-sm leading-relaxed">
        Clusters are auto-detected from title patterns and hand-curated for tone.
        Many other repeated subjects live in her work · search or browse{' '}
        <Link to="/themes" className="text-text-primary underline decoration-1 underline-offset-4">all 267 pieces</Link>{' '}
        to find your own.
      </p>
    </main>
  );
}

export default ObsessionsPage;
