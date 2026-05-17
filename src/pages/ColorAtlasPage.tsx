import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import artworksData from '../data/artworks.json';
import palettesData from '../data/palettes.json';
import { usePageMeta } from '../hooks/usePageMeta';
import PaperMount from '../components/ui/PaperMount';
import type { Artwork } from '../types';

interface Palette {
  dominant: string;
  palette: string[];
  hsl: number[];
}

const artworks = artworksData as Artwork[];
const palettes = palettesData as Record<string, Palette>;

type SortMode = 'sequence' | 'hue' | 'lightness';

const SORTS: Array<{ id: SortMode; label: string }> = [
  { id: 'sequence',  label: 'Her sequence' },
  { id: 'hue',       label: 'By hue' },
  { id: 'lightness', label: 'Dark to light' },
];

// The book is organised by chapter, and she sequenced it as a life
// retrospective — so book order reads, honestly, as the flow of her
// working life. We label the axis by the chapters it passes through
// rather than invent dates (only ~10 works are dated).
const CHAPTER_LABEL: Record<string, string> = {
  'old-stuff': 'Old Stuff',
  abstract: 'Abstract',
  'social-comment': 'Social Comment',
  'on-the-road': 'On the Road',
  landscape: 'Landscape',
  'street-scenes': 'Street Scenes',
  portraits: 'Portraits',
  'still-life': 'Still Life',
  interiors: 'Interiors',
  flowers: 'Flowers',
  travel: 'Travel',
  autobiography: 'Autobiography',
};

function ColorAtlasPage(): JSX.Element {
  usePageMeta(
    'A Lifetime in Color',
    "Every painting in Leah Schwartz's life, distilled to its pigment and laid out as one continuous watercolor spectrum.",
  );
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortMode>('sequence');
  const [hovered, setHovered] = useState<string | null>(null);

  const sorted = useMemo<Artwork[]>(() => {
    const arr = artworks.filter((a) => palettes[a.id] && a.imagePath);
    return arr.sort((a, b) => {
      const pa = palettes[a.id];
      const pb = palettes[b.id];
      if (sortBy === 'hue') return pa.hsl[0] - pb.hsl[0];
      if (sortBy === 'lightness') return pa.hsl[2] - pb.hsl[2];
      return (a.book_page || 9999) - (b.book_page || 9999);
    });
  }, [sortBy]);

  // Contiguous chapter runs (only meaningful in her-sequence order) → axis.
  const chapterRuns = useMemo(() => {
    if (sortBy !== 'sequence') return [];
    const runs: Array<{ chapter: string; start: number; end: number }> = [];
    sorted.forEach((a, i) => {
      const ch = a.chapter || 'other';
      const last = runs[runs.length - 1];
      if (last && last.chapter === ch) last.end = i;
      else runs.push({ chapter: ch, start: i, end: i });
    });
    // Drop tiny slivers so the axis stays legible
    return runs.filter((r) => r.end - r.start >= 2 && CHAPTER_LABEL[r.chapter]);
  }, [sorted, sortBy]);

  const hoveredArt = hovered ? artworks.find((a) => a.id === hovered) : null;
  const hoveredPalette = hovered ? palettes[hovered] : null;
  const n = sorted.length;

  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <motion.header
        className="max-w-3xl mx-auto text-center mb-14"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-heading text-[#8f8a6d] text-[clamp(22px,3vw,38px)]
          tracking-[0.34em] pl-[0.34em] leading-none uppercase">
          A Lifetime in Color
        </h1>
        <p className="font-heading italic text-text-muted/80 mt-5 text-[15px] tracking-[0.04em]">
          {n} paintings · her chromatic life, in her own pigment
        </p>
        <div className="mx-auto mt-6 h-px w-10 bg-text-muted/40" aria-hidden="true" />
      </motion.header>

      {/* The spectrum · feathered top & bottom so it reads as a wash on
          paper, with her real meadow-granulation overlaid on every band */}
      <motion.section
        className="relative max-w-[1500px] mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div
          className="relative"
          style={{
            height: 'min(62vh, 560px)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, #000 7%, #000 93%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, #000 7%, #000 93%, transparent 100%)',
          }}
          onMouseLeave={() => setHovered(null)}
        >
          {/* colour bands */}
          <div className="flex w-full h-full">
            {sorted.map((art) => {
              const p = palettes[art.id];
              const isHovered = hovered === art.id;
              return (
                <button
                  key={art.id}
                  type="button"
                  onClick={() => navigate(`/artwork/${art.id}`)}
                  onMouseEnter={() => setHovered(art.id)}
                  onFocus={() => setHovered(art.id)}
                  className={`relative flex-1 min-w-0 h-full transition-[flex-grow] duration-200
                    focus:outline-none
                    ${isHovered ? 'flex-[4] z-10' : 'hover:flex-[2.5]'}`}
                  style={{ backgroundColor: p.dominant }}
                  aria-label={`${art.display_title || art.title}${art.year ? `, ${art.year}` : ''}`}
                />
              );
            })}
          </div>
          {/* one shared watercolour-grain wash lifted from her Mt. Tam meadow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'url(/textures/wash-grain.png)',
              backgroundSize: 'auto 100%',
              backgroundRepeat: 'repeat-x',
              mixBlendMode: 'soft-light',
              opacity: 0.7,
            }}
          />
        </div>

        {/* Era / chapter axis · honest labels, not invented years. Every run
            gets a boundary tick; a label is drawn only when it clears the
            last one (early chapters are tiny, so they're ticked, not named). */}
        {chapterRuns.length > 0 && (() => {
          let lastLabelMid = -Infinity;
          const MIN_GAP = 7; // % of width between adjacent labels
          return (
            <div className="relative mt-5 h-10">
              {chapterRuns.map((r) => {
                const mid = ((r.start + r.end) / 2 / n) * 100;
                const startPct = (r.start / n) * 100;
                const showLabel = mid - lastLabelMid >= MIN_GAP;
                if (showLabel) lastLabelMid = mid;
                return (
                  <div key={`${r.chapter}-${r.start}`}>
                    <span
                      className="absolute top-0 w-px h-2 bg-text-muted/25"
                      style={{ left: `${startPct}%` }}
                      aria-hidden="true"
                    />
                    {showLabel && (
                      <span
                        className="absolute top-4 -translate-x-1/2 whitespace-nowrap
                          font-body text-[10px] tracking-[0.22em] uppercase text-text-muted"
                        style={{ left: `${mid}%` }}
                      >
                        {CHAPTER_LABEL[r.chapter]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Hover reading · the painting on paper, its pigment beside it */}
        {hoveredArt && hoveredPalette && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-16
              flex items-center gap-10 pointer-events-none z-20
              w-[min(620px,92vw)]"
          >
            <PaperMount
              src={hoveredArt.thumbPath || hoveredArt.imagePath || ''}
              alt=""
              paper="mid"
              inset={{ x: 22, y: 18 }}
              shadow="lift"
              className="shrink-0"
              imgClassName="w-44 h-auto"
            />
            <div className="min-w-0 flex-1">
              <p className="font-heading text-text-primary text-[26px] leading-tight">
                {hoveredArt.display_title || hoveredArt.title}
              </p>
              <p className="font-body text-text-muted text-[11px] mt-3 tracking-[0.22em] uppercase">
                {hoveredArt.year || (hoveredArt.chapter && CHAPTER_LABEL[hoveredArt.chapter]) || ''}
                {hoveredArt.medium ? ` · ${hoveredArt.medium}` : ''}
              </p>
              {hoveredArt.dimensions && (
                <p className="font-heading italic text-text-muted/80 text-[13px] mt-1">
                  {hoveredArt.dimensions}
                </p>
              )}
              <div className="flex gap-1.5 mt-5">
                {hoveredPalette.palette.map((c, i) => (
                  <span
                    key={i}
                    className="w-7 h-7 rounded-[2px] ring-1 ring-black/5"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* Quiet controls + caption, kept well clear of the hover reading */}
      <div className="max-w-3xl mx-auto mt-72 text-center">
        <div className="flex justify-center gap-7" role="tablist" aria-label="Order the spectrum">
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === sortBy}
              onClick={() => setSortBy(s.id)}
              className={`font-body text-[11px] tracking-[0.28em] uppercase pb-1 transition-colors
                ${s.id === sortBy
                  ? 'text-text-primary border-b border-text-primary/50'
                  : 'text-text-muted hover:text-text-secondary'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="font-body text-text-muted text-[13px] leading-relaxed mt-8">
          {sortBy === 'sequence'
            ? 'Read left to right, this is the order she gave her own life’s work.'
            : sortBy === 'hue'
            ? 'The same paintings, climbing the hue wheel she reached for.'
            : 'The same paintings, rising out of shadow into bloom.'}
          {' '}Hover any band for the painting; click to open it.
        </p>
      </div>
    </main>
  );
}

export default ColorAtlasPage;
