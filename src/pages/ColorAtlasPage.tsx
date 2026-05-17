import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

interface SpectrumBandProps {
  arts: Artwork[];
  showAxis: boolean;
  onHover: (id: string | null) => void;
  onPick: (id: string) => void;
}

// One feathered watercolour spectrum. Each band is a painting's dominant
// pigment, with her real Mt. Tam meadow granulation washed over the whole.
function SpectrumBand({ arts, showAxis, onHover, onPick }: SpectrumBandProps): JSX.Element {
  const n = arts.length;

  const chapterRuns = useMemo(() => {
    if (!showAxis) return [];
    const runs: Array<{ chapter: string; start: number; end: number }> = [];
    arts.forEach((a, i) => {
      const ch = a.chapter || 'other';
      const last = runs[runs.length - 1];
      if (last && last.chapter === ch) last.end = i;
      else runs.push({ chapter: ch, start: i, end: i });
    });
    return runs.filter((r) => r.end - r.start >= 2 && CHAPTER_LABEL[r.chapter]);
  }, [arts, showAxis]);

  return (
    <div className="relative max-w-[1500px] mx-auto">
      <div
        className="relative"
        style={{
          height: 'min(56vh, 500px)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, #000 7%, #000 93%, transparent 100%)',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, #000 7%, #000 93%, transparent 100%)',
        }}
        onMouseLeave={() => onHover(null)}
      >
        <div className="flex w-full h-full">
          {arts.map((art) => {
            const p = palettes[art.id];
            return (
              <button
                key={art.id}
                type="button"
                onClick={() => onPick(art.id)}
                onMouseEnter={() => onHover(art.id)}
                onFocus={() => onHover(art.id)}
                className="relative flex-1 min-w-0 h-full transition-[flex-grow] duration-200
                  focus:outline-none hover:flex-[3]"
                style={{ backgroundColor: p.dominant }}
                aria-label={`${art.display_title || art.title}${art.year ? `, ${art.year}` : ''}`}
              />
            );
          })}
        </div>
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

      {chapterRuns.length > 0 && (() => {
        let lastLabelMid = -Infinity;
        const MIN_GAP = 7;
        return (
          <div className="relative mt-5 h-8">
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
    </div>
  );
}

interface Section {
  numeral: string;
  title: string;
  line: string;
  mode: 'sequence' | 'hue' | 'lightness';
}

const SECTIONS: Section[] = [
  {
    numeral: 'I',
    title: 'Her Sequence',
    line: 'Left to right, this is the order she gave her own life’s work — the book as she arranged it.',
    mode: 'sequence',
  },
  {
    numeral: 'II',
    title: 'By Hue',
    line: 'The same paintings, re-laid by colour — the whole spectrum she reached for, end to end.',
    mode: 'hue',
  },
  {
    numeral: 'III',
    title: 'Dark to Light',
    line: 'The same paintings once more, rising out of shadow into bloom.',
    mode: 'lightness',
  },
];

function ColorAtlasPage(): JSX.Element {
  usePageMeta(
    'A Lifetime in Color',
    "Every painting in Leah Schwartz's life, distilled to its pigment and laid out three ways — by her own sequence, by hue, and by light.",
  );
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  const base = useMemo(
    () => artworks.filter((a) => palettes[a.id] && a.imagePath),
    [],
  );
  const ordered = useMemo(() => {
    const bySeq = [...base].sort((a, b) => (a.book_page || 9999) - (b.book_page || 9999));
    const byHue = [...base].sort((a, b) => palettes[a.id].hsl[0] - palettes[b.id].hsl[0]);
    const byLight = [...base].sort((a, b) => palettes[a.id].hsl[2] - palettes[b.id].hsl[2]);
    return { sequence: bySeq, hue: byHue, lightness: byLight };
  }, [base]);

  const hoveredArt = hovered ? artworks.find((a) => a.id === hovered) : null;
  const hoveredPalette = hovered ? palettes[hovered] : null;

  return (
    <main className="min-h-screen pt-28 pb-32 px-6">
      <motion.header
        className="max-w-3xl mx-auto text-center mb-8"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-heading text-[#8f8a6d] text-[clamp(22px,3vw,38px)]
          tracking-[0.34em] pl-[0.34em] leading-none uppercase">
          A Lifetime in Color
        </h1>
        <p className="font-heading italic text-text-muted/80 mt-5 text-[15px] tracking-[0.04em]">
          {base.length} paintings · her chromatic life, in her own pigment
        </p>
        <p className="font-body text-text-muted/70 mt-5 text-[11px] tracking-[0.28em] uppercase">
          The same work, ordered three ways · scroll
        </p>
        <div className="mx-auto mt-6 h-px w-10 bg-text-muted/40" aria-hidden="true" />
      </motion.header>

      {SECTIONS.map((s) => (
        <motion.section
          key={s.mode}
          className="pt-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="text-center mb-12">
            <p className="font-heading text-[#8f8a6d] text-[13px] tracking-[0.5em] mb-3">
              {s.numeral}
            </p>
            <h2 className="font-heading text-text-primary text-[clamp(26px,3.4vw,42px)] leading-none">
              {s.title}
            </h2>
            <p className="font-heading italic text-text-muted/80 mt-4
              text-[14px] max-w-xl mx-auto leading-relaxed">
              {s.line}
            </p>
          </div>
          <SpectrumBand
            arts={ordered[s.mode]}
            showAxis={s.mode === 'sequence'}
            onHover={setHovered}
            onPick={(id) => navigate(`/artwork/${id}`)}
          />
        </motion.section>
      ))}

      <p className="max-w-2xl mx-auto text-center mt-28 font-body
        text-text-muted text-[13px] leading-relaxed">
        Hover any band to bring its painting forward; click to open it.
      </p>

      {/* Fixed reading · always in view, never clipped, generously sized.
          Sits on its own soft cream shelf so it stays legible over the bands. */}
      <AnimatePresence>
        {hoveredArt && hoveredPalette && (
          <motion.div
            key={hoveredArt.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-1/2 -translate-x-1/2 bottom-[3.5vh]
              pointer-events-none z-[60] w-[min(860px,94vw)]"
          >
            {/* soft cream shelf · feathered, reads as paper not a modal */}
            <div
              aria-hidden="true"
              className="absolute -inset-x-4 -inset-y-3 rounded-[40px]
                bg-[#F6F1E3]/95 backdrop-blur-md
                shadow-[0_36px_90px_-36px_rgba(74,62,40,0.40)]"
            />
            <div className="relative flex items-center gap-12 px-12 py-9">
              <PaperMount
                src={hoveredArt.thumbPath || hoveredArt.imagePath || ''}
                alt=""
                paper="mid"
                inset={{ x: 24, y: 18 }}
                shadow="lift"
                className="shrink-0"
                imgClassName="w-auto h-[clamp(180px,28vh,320px)]"
              />
              <div className="min-w-0 flex-1">
                <p className="font-heading text-text-primary text-[clamp(24px,2.4vw,36px)] leading-[1.1]">
                  {hoveredArt.display_title || hoveredArt.title}
                </p>
                <p className="font-body text-text-muted text-[12px] mt-4 tracking-[0.24em] uppercase">
                  {hoveredArt.year || (hoveredArt.chapter && CHAPTER_LABEL[hoveredArt.chapter]) || ''}
                  {hoveredArt.medium ? ` · ${hoveredArt.medium}` : ''}
                </p>
                {hoveredArt.dimensions && (
                  <p className="font-heading italic text-text-muted/80 text-[14px] mt-1">
                    {hoveredArt.dimensions}
                  </p>
                )}
                <div className="flex gap-2 mt-6">
                  {hoveredPalette.palette.map((c, i) => (
                    <span
                      key={i}
                      className="w-9 h-9 rounded-[3px] ring-1 ring-black/5"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default ColorAtlasPage;
