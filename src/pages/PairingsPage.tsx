// Curated Pairings · editorial diptychs and triptychs across the collection.

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import artworksData from '../data/artworks.json';
import { PAIRINGS, type Pairing } from '../data/pairings';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];
const byId = new Map(artworks.map((a) => [a.id, a]));

function artworksFor(p: Pairing): Artwork[] {
  return p.artwork_ids.map((id) => byId.get(id)).filter(Boolean) as Artwork[];
}

function PairingCard({ p }: { p: Pairing }): JSX.Element {
  const arts = artworksFor(p);
  return (
    <Link to={`/pairings/${p.id}`} className="group block">
      <div
        className="relative rounded-2xl overflow-hidden shadow-soft group-hover:shadow-glass transition-shadow duration-500"
        style={{ backgroundColor: p.accent + '11' }}
      >
        <div className={`grid ${arts.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-0.5`}>
          {arts.slice(0, 3).map((a) => (
            <div
              key={a.id}
              className="aspect-[4/5] relative bg-[#fafafa]"
            >
              {a.imagePath && (
                <img
                  src={a.thumbPath || a.imagePath}
                  alt={a.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              )}
            </div>
          ))}
        </div>
        <div
          className="absolute top-4 left-4 w-10 h-1 rounded-full"
          style={{ backgroundColor: p.accent }}
        />
      </div>
      <div className="mt-4 px-1">
        <h2 className="font-heading text-xl md:text-2xl text-text-primary group-hover:text-text-secondary transition-colors">
          {p.title}
        </h2>
        <p className="font-leah text-xl md:text-2xl leading-none mt-1" style={{ color: p.accent }}>
          {p.subtitle}
        </p>
      </div>
    </Link>
  );
}

function PairingDetail({ pairing }: { pairing: Pairing }): JSX.Element {
  const navigate = useNavigate();
  const arts = useMemo(() => artworksFor(pairing), [pairing]);
  usePageMeta(pairing.title, pairing.curatorial.slice(0, 160));

  return (
    <main
      className="min-h-screen pt-24 pb-24 px-6"
      style={{ background: `linear-gradient(to bottom, ${pairing.accent}12 0%, #fafafa 520px)` }}
    >
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/pairings')}
          className="text-text-muted hover:text-text-primary font-body text-sm mb-8 transition-colors"
        >
          ← All Pairings
        </button>

        <header className="text-center mb-14 max-w-3xl mx-auto">
          <div className="h-1 w-16 mx-auto mb-6 rounded-full" style={{ backgroundColor: pairing.accent }} />
          <h1 className="font-heading text-5xl md:text-6xl text-text-primary leading-tight">
            {pairing.title}
          </h1>
          <p className="font-leah mt-4 text-3xl md:text-4xl leading-none" style={{ color: pairing.accent }}>
            {pairing.subtitle}
          </p>
        </header>

        {/* Paintings */}
        <motion.div
          className={`grid ${arts.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} gap-6 mb-16`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {arts.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link to={`/artwork/${a.id}`} className="group block">
                <div
                  className="relative aspect-[4/5] rounded-sm overflow-hidden bg-[#fafafa]"
                  style={{ boxShadow: `0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px ${pairing.accent}22` }}
                >
                  {a.imagePath && (
                    <img
                      src={a.imagePath}
                      alt={a.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  )}
                </div>
                <div className="mt-4 text-center">
                  <p className="font-heading text-lg text-text-primary group-hover:text-text-secondary transition-colors">
                    {a.display_title || a.title}
                  </p>
                  <p className="font-body text-xs text-text-muted mt-1">
                    {[a.year && `${a.circa ? 'c. ' : ''}${a.year}`, a.medium, a.dimensions].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Curatorial note */}
        <motion.section
          className="max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-center font-body text-text-muted uppercase tracking-widest text-xs mb-5">
            Curatorial note
          </p>
          <p className="font-heading text-[18px] md:text-[20px] leading-[1.8] text-text-primary text-center">
            {pairing.curatorial}
          </p>

          {pairing.quote && (
            <blockquote
              className="mt-10 border-l-4 pl-6 py-2 italic font-heading text-[18px] leading-relaxed text-text-secondary"
              style={{ borderColor: pairing.accent }}
            >
              "{pairing.quote}"
              {pairing.quoteSource && (
                <footer className="text-sm not-italic text-text-muted mt-2">
                  - {pairing.quoteSource}
                </footer>
              )}
            </blockquote>
          )}
        </motion.section>

        {/* Back to all pairings */}
        <div className="text-center">
          <Link
            to="/pairings"
            className="inline-block glass-pill px-5 py-3 font-body text-sm text-text-primary hover:shadow-glass transition-shadow"
          >
            Other pairings →
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PairingsPage(): JSX.Element {
  const { pairingId } = useParams();
  const pairing = pairingId ? PAIRINGS.find((p) => p.id === pairingId) : null;

  if (pairingId && pairing) return <PairingDetail pairing={pairing} />;

  usePageMeta('Pairings', 'Curated diptychs and triptychs from Leah Schwartz\'s work · editorial pairings across chapters and years.');

  return (
    <main className="min-h-screen pt-24 pb-24 px-6">
      <header className="max-w-3xl mx-auto text-center mb-14">
        <p className="font-body text-text-muted uppercase tracking-[0.3em] text-xs mb-4">
          Editorial
        </p>
        <h1 className="font-heading text-5xl md:text-7xl text-text-primary leading-tight">
          Pairings
        </h1>
        <p className="font-leah text-text-muted mt-4 text-3xl md:text-4xl leading-none">
          paintings, next to each other
        </p>
        <p className="font-body text-text-secondary mt-6 leading-relaxed">
          Two or three works at a time · placed side by side to see what they say in
          chorus. Leah returned to certain subjects: a mountain, a husband, a pear, a window.
          These are the conversations her paintings have with each other.
        </p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {PAIRINGS.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <PairingCard p={p} />
          </motion.div>
        ))}
      </div>
    </main>
  );
}
