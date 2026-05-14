import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import artworksData from '../data/artworks.json';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

// A small, hand-curated set of late-period work · Interiors, late still-lifes,
// the Japanese-influenced flowers. These are the quiet rooms of her late life.
const LAST_PAINTINGS: string[] = [
  // Interiors — her actual homes painted from the inside
  'mill-valley-bathroom',
  'mill-valley-kitchen',
  'bolinas-kitchen',
  'bolinas-bathroom-bedroom-and-view-to-the-sea',
  'bolinas-dining-alcove',
  // Late still-lifes — pears as geometry, the persimmon meditations
  'one-pear-nine-times',
  'two-persimmons-on-a-stem',
  'three-basking-boscs',
  'leaning-bosc-with-fat-and-lean-pears',
  // Late flowers — her turn toward Japanese masters in the background
  'white-rose-with-botticelli',
  'hachiguchi-goyo-with-white-rose',
  'peach-iris-with-ukiyo-e',
  'scabiosa-with-nathans-book',
  'spring-thicket',
];

// A short curatorial note for each piece, in the spirit of the book.
const NOTES: Record<string, string> = {
  'mill-valley-bathroom':
    'Her own bathroom in Mill Valley. The window in the corner is the same stained-glass window that appears in Amazing Grace.',
  'mill-valley-kitchen':
    'The kitchen she actually cooked in. The cabinet doors are the colors she chose, the towel hung the way she hung it.',
  'bolinas-kitchen':
    'The weekend kitchen. A koi banner on the wall, calendulas in a jar.',
  'bolinas-bathroom-bedroom-and-view-to-the-sea':
    'A composite room, painted as if all the doors opened at once. The Pacific just past the bed.',
  'bolinas-dining-alcove':
    'The small alcove where they ate. Watercolors of the same view she could see if she turned her head.',
  'one-pear-nine-times':
    'A single pear, nine times. The form goes from fruit to geometry to something quieter.',
  'two-persimmons-on-a-stem':
    'Two persimmons. The stem holding them together. The white space they share.',
  'three-basking-boscs':
    'Boscs in late sun. The kind of pear she would buy and not eat for a week so she could paint them.',
  'leaning-bosc-with-fat-and-lean-pears':
    'A leaning bosc and its companions. A small composed world on a windowsill.',
  'white-rose-with-botticelli':
    'A white rose with a Botticelli reproduction pinned behind it. The flower in front of the master.',
  'hachiguchi-goyo-with-white-rose':
    'Hachiguchi Goyō, the woodblock master, gives the background. The rose answers in its own quiet voice.',
  'peach-iris-with-ukiyo-e':
    'A peach iris against ukiyo-e. The late turn toward Japan that her travels had prepared her for.',
  'scabiosa-with-nathans-book':
    'Scabiosa beside her stepfather Nathan\'s book. A small altar to two affections.',
  'spring-thicket':
    'A thicket of spring blooms. One of the last paintings the book gathers.',
};

function LastPaintingsPage(): JSX.Element {
  usePageMeta(
    'The Last Paintings',
    'A quiet room for the late work of Leah Schwartz · her homes, her pears, her flowers in front of the masters.',
  );

  const pieces = useMemo(() => {
    const byId = new Map(artworks.map((a) => [a.id, a]));
    return LAST_PAINTINGS.map((id) => byId.get(id)).filter((a): a is Artwork => !!a && !!a.imagePath);
  }, []);

  return (
    <main className="min-h-screen pt-32 pb-32 px-6 bg-[#F8F3EA]">
      {/* Hero · centered, slow, deliberately small */}
      <motion.header
        className="max-w-2xl mx-auto text-center mb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <p className="font-body text-text-muted uppercase tracking-[0.4em] text-[11px] mb-6">
          A quiet room
        </p>
        <h1 className="font-heading text-5xl md:text-6xl text-text-primary leading-tight">
          The Last Paintings
        </h1>
        <p className="font-leah text-text-muted mt-4 text-3xl leading-none">
          home, pears, and flowers in front of the masters
        </p>
        <p className="font-heading italic text-text-secondary text-[17px] mt-10 leading-[1.8]">
          In the room where I am writing, there is a large oil of chrysanthemums;
          the flowers are long dead. There is another large oil of a red-haired girl,
          seated nude, who will never again look the way she did to me at that moment.
        </p>
        <p className="font-body text-text-muted text-xs mt-4 tracking-wider uppercase">
          — From her autobiography
        </p>
      </motion.header>

      {/* The paintings · one per row, generous */}
      <div className="max-w-3xl mx-auto space-y-32">
        {pieces.map((art, idx) => (
          <motion.figure
            key={art.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="text-center"
          >
            <Link
              to={`/artwork/${art.id}`}
              className="block group"
              aria-label={`Open ${art.display_title || art.title}`}
            >
              <img
                src={art.imagePath || art.thumbPath || ''}
                alt={art.display_title || art.title}
                loading={idx < 2 ? 'eager' : 'lazy'}
                className="w-full h-auto rounded-sm shadow-[0_18px_64px_rgba(0,0,0,0.08)] transition-shadow duration-700 group-hover:shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
              />
            </Link>
            <figcaption className="mt-10">
              <p className="font-heading text-2xl md:text-3xl text-text-primary leading-tight">
                {art.display_title || art.title}
              </p>
              {(art.medium || art.dimensions) && (
                <p className="font-body text-text-muted text-xs tracking-[0.2em] uppercase mt-2">
                  {[art.medium, art.dimensions].filter(Boolean).join(' · ')}
                </p>
              )}
              {NOTES[art.id] && (
                <p className="font-heading italic text-text-secondary text-[17px] max-w-xl mx-auto mt-6 leading-[1.7]">
                  {NOTES[art.id]}
                </p>
              )}
            </figcaption>
          </motion.figure>
        ))}
      </div>

      {/* Outgoing · quiet */}
      <motion.div
        className="max-w-xl mx-auto text-center mt-40"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
      >
        <p className="font-heading italic text-text-secondary text-[18px] leading-[1.8]">
          The book finished. Strawberry Press, Mill Valley.
        </p>
        <p className="font-body text-text-muted text-xs mt-3 tracking-[0.3em] uppercase">
          1920 — 2004
        </p>
        <div className="mt-12 flex gap-4 justify-center text-xs font-body uppercase tracking-widest">
          <Link to="/her-words/autobiography" className="text-text-muted hover:text-text-primary transition-colors">
            Read her autobiography
          </Link>
          <span aria-hidden="true" className="text-text-muted">·</span>
          <Link to="/themes" className="text-text-muted hover:text-text-primary transition-colors">
            Browse her chapters
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

export default LastPaintingsPage;
