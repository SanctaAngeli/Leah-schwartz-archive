import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import artworksData from '../data/artworks.json';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

interface Scene {
  id: string;
  // visual source - either a photo file or an artwork id
  photoFile?: string;
  artworkId?: string;
  // text
  eyebrow?: string;
  text: string;
  source?: string;
  // visual treatment
  align?: 'left' | 'right' | 'center';
  background?: 'dark' | 'parchment';
}

const SCENES: Scene[] = [
  {
    id: 'arrival',
    eyebrow: 'A studio visit',
    text: 'Mill Valley, 1985. The redwoods two blocks above downtown. The studio is upstairs · she\'s painted the door the color of the door.',
    align: 'center',
    background: 'dark',
  },
  {
    id: 'her-at-work',
    photoFile: 'p028_02.jpg',
    text: 'She paints standing up. She listens to KQED. The light moves across Mt. Tam from the window above the easel.',
    align: 'right',
    background: 'dark',
  },
  {
    id: 'the-process',
    artworkId: 'pale-pink-rose-with-cosmos',
    text: 'I love the process of what I do. I enjoy the feel of a brush on canvas, the smell of turpentine, the flow of color on a fresh sheet of watercolor paper, and the intense pleasure of making things.',
    source: '- Leah, page 1 of her book',
    align: 'left',
    background: 'parchment',
  },
  {
    id: 'the-kit',
    artworkId: 'pale-pink-rose-with-cosmos',
    text: 'On the table beside the easel: a small plastic paintbox, two good watercolor brushes, a sketch book, a small water bottle, a chocolate bar, a quilted tea-cozy that doubles as a cushion, a dime-store notebook, a camera.',
    source: '- from the autobiography, "the kit she carried everywhere"',
    align: 'right',
    background: 'parchment',
  },
  {
    id: 'the-wall',
    artworkId: 'white-rose-with-botticelli',
    text: 'Pinned to the studio wall: a Bellini reproduction. I once ruined the simple background I was aiming for in a flower painting, and decided to paint the Bellini behind the flowers. It was fun getting into Bellini\'s mind.',
    source: '- Autobiography, on the late flowers',
    align: 'left',
    background: 'parchment',
  },
  {
    id: 'the-mountain',
    artworkId: 'mt-tam-from-sonoma',
    text: 'Out the window: Mt. Tam. The same mountain she\'ll paint from Sonoma, from San Francisco, four ways at once.',
    align: 'center',
    background: 'parchment',
  },
  {
    id: 'late-afternoon',
    artworkId: 'mill-valley-kitchen',
    text: 'Past five, the studio cools. She walks downstairs to the kitchen · the one with the stained-glass window that shows up in Amazing Grace · puts on water for tea.',
    align: 'right',
    background: 'parchment',
  },
  {
    id: 'leaving',
    eyebrow: 'You let yourself out',
    text: 'The brushes are still in water. The Bellini is still on the wall. Tomorrow at ten she\'ll be back at the easel.',
    align: 'center',
    background: 'dark',
  },
];

function SceneBlock({ scene, index }: { scene: Scene; index: number }): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Gentle parallax. Kept small and clipped by the section (overflow-hidden)
  // so a drifting image never bleeds into the neighbouring scene's background.
  const y = useTransform(scrollYProgress, [0, 1], [32, -32]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0.4]);

  const art = scene.artworkId ? artworks.find((a) => a.id === scene.artworkId) : null;
  const isDark = scene.background === 'dark';
  const align = scene.align || 'center';

  return (
    <section
      ref={ref}
      className={`
        relative min-h-[90vh] flex items-center px-6 py-24 overflow-hidden
        ${isDark ? 'bg-[#1A1A1A] text-white' : 'bg-[#F8F3EA] text-text-primary'}
      `}
    >
      <div
        className={`
          max-w-6xl mx-auto w-full grid gap-12 items-center
          ${(scene.photoFile || art) ? 'md:grid-cols-2' : 'grid-cols-1'}
          ${align === 'right' ? 'md:[&>*:first-child]:order-2' : ''}
        `}
      >
        {/* Visual · parallax-translated */}
        {(scene.photoFile || art) && (
          <motion.div style={{ y }} className="relative w-full">
            <img
              src={scene.photoFile ? `/photos/${scene.photoFile}` : art?.imagePath || art?.thumbPath || ''}
              alt=""
              loading={index < 2 ? 'eager' : 'lazy'}
              className={`w-full h-auto rounded-sm ${
                isDark ? 'shadow-[0_28px_80px_rgba(0,0,0,0.7)]' : 'shadow-[0_18px_64px_rgba(0,0,0,0.10)]'
              }`}
            />
            {art && (
              <p
                className={`mt-3 font-body text-[11px] tracking-[0.25em] uppercase ${
                  isDark ? 'text-white/40' : 'text-text-muted'
                }`}
              >
                {art.display_title || art.title}
              </p>
            )}
          </motion.div>
        )}

        {/* Text */}
        <motion.div
          style={{ opacity }}
          className={align === 'center' && !scene.photoFile && !art ? 'text-center max-w-3xl mx-auto' : ''}
        >
          {scene.eyebrow && (
            <p
              className={`font-body uppercase tracking-[0.3em] text-[11px] mb-5 ${
                isDark ? 'text-white/50' : 'text-text-muted'
              }`}
            >
              {scene.eyebrow}
            </p>
          )}
          <p
            className={`font-heading text-[20px] md:text-[26px] leading-[1.55] ${
              isDark ? 'text-white italic' : 'text-text-primary italic'
            }`}
          >
            {scene.text}
          </p>
          {scene.source && (
            <p
              className={`mt-5 font-body text-xs uppercase tracking-[0.25em] ${
                isDark ? 'text-white/40' : 'text-text-muted'
              }`}
            >
              {scene.source}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function StudioVisitPage(): JSX.Element {
  usePageMeta(
    'A Studio Visit',
    'Walk through Leah Schwartz\'s Mill Valley studio. A long-scroll narrative in her own words.',
  );

  const scenes = useMemo(() => SCENES, []);

  return (
    <main className="bg-[#1A1A1A]">
      {/* Hero · the cover of the visit */}
      <section className="min-h-screen flex items-center justify-center px-6 bg-[#1A1A1A] text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-2xl"
        >
          <p className="font-body uppercase tracking-[0.4em] text-[11px] text-white/50 mb-8">
            A studio visit
          </p>
          <h1 className="font-heading text-[clamp(40px,9vw,96px)] leading-[0.95] text-white">
            Mill Valley, 1985
          </h1>
          <p className="font-leah text-white/60 mt-6 text-3xl md:text-4xl leading-none">
            an afternoon at her easel
          </p>
          <p className="font-body text-white/40 text-xs uppercase tracking-[0.3em] mt-16">
            ↓ scroll to enter
          </p>
        </motion.div>
      </section>

      {scenes.map((s, i) => (
        <SceneBlock key={s.id} scene={s} index={i} />
      ))}

      {/* Closing · quiet outro on parchment */}
      <section className="bg-[#F8F3EA] py-32 px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="max-w-xl mx-auto"
        >
          <p className="font-heading italic text-text-secondary text-[18px] leading-[1.8]">
            She painted in that studio until 2003.
          </p>
          <p className="font-body text-text-muted text-xs tracking-[0.3em] uppercase mt-3">
            1920 - 2004
          </p>
          <div className="mt-12 flex gap-4 justify-center text-xs font-body uppercase tracking-widest">
            <Link to="/her-words/autobiography" className="text-text-muted hover:text-text-primary transition-colors">
              Read her autobiography
            </Link>
            <span aria-hidden="true" className="text-text-muted">·</span>
            <Link to="/studio" className="text-text-muted hover:text-text-primary transition-colors">
              Her studio in detail
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default StudioVisitPage;
