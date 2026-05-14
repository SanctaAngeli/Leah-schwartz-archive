import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import artworksData from '../data/artworks.json';
import palettesData from '../data/palettes.json';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Artwork } from '../types';

interface Palette {
  dominant: string;
  palette: string[];
  hsl: number[];  // [h, s, l] but loosened so the JSON cast works
}

const artworks = artworksData as Artwork[];
const palettes = palettesData as Record<string, Palette>;

type SortMode = 'book' | 'hue' | 'lightness' | 'chapter';

const SORT_OPTIONS: Array<{ id: SortMode; label: string; sub: string }> = [
  { id: 'book',      label: 'Book order',     sub: 'as she sequenced her work' },
  { id: 'chapter',   label: 'By chapter',     sub: 'twelve rooms in turn' },
  { id: 'hue',       label: 'By hue',         sub: "the spectrum she reached for" },
  { id: 'lightness', label: 'Dark → light',   sub: 'shadow to bloom' },
];

function ColorAtlasPage(): JSX.Element {
  usePageMeta(
    'Color Atlas',
    "Every palette in Leah Schwartz's work, as a single scrollable spectrum of her career.",
  );
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortMode>('book');
  const [hovered, setHovered] = useState<string | null>(null);

  const sorted = useMemo<Artwork[]>(() => {
    const arr = artworks.filter((a) => palettes[a.id] && a.imagePath);
    return arr.sort((a, b) => {
      const pa = palettes[a.id];
      const pb = palettes[b.id];
      if (sortBy === 'hue') return pa.hsl[0] - pb.hsl[0];
      if (sortBy === 'lightness') return pa.hsl[2] - pb.hsl[2];
      if (sortBy === 'chapter') {
        const ca = a.chapter || 'zzzz';
        const cb = b.chapter || 'zzzz';
        if (ca !== cb) return ca.localeCompare(cb);
      }
      return (a.book_page || 9999) - (b.book_page || 9999);
    });
  }, [sortBy]);

  const hoveredArt = hovered ? artworks.find((a) => a.id === hovered) : null;
  const hoveredPalette = hovered ? palettes[hovered] : null;

  return (
    <main className="min-h-screen pt-28 pb-20 px-6">
      <motion.header
        className="max-w-3xl mx-auto text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-body text-text-muted uppercase tracking-[0.3em] text-xs mb-3">
          Every palette, every painting
        </p>
        <h1 className="font-heading text-5xl md:text-7xl text-text-primary leading-tight">
          Color Atlas
        </h1>
        <p className="font-leah text-text-muted mt-3 text-3xl md:text-4xl leading-none">
          her chromatic life
        </p>
        <p className="font-body text-text-secondary mt-6 max-w-2xl mx-auto leading-relaxed">
          Each band is one of her {sorted.length} paintings, distilled into its five most
          representative colors. Sort to see her work group by chapter, climb the hue
          wheel, or rise out of shadow into bloom.
        </p>
      </motion.header>

      {/* Sort selector */}
      <nav className="max-w-4xl mx-auto mb-10 flex flex-wrap gap-2 justify-center">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSortBy(opt.id)}
            className={`flex flex-col items-center px-5 py-2 rounded-full transition-all duration-200
              border ${opt.id === sortBy
                ? 'bg-text-primary text-bg-gallery border-text-primary shadow-sm'
                : 'bg-white/80 text-text-secondary border-white/40 hover:bg-white'
              }`}
          >
            <span className="font-heading text-sm leading-tight">{opt.label}</span>
            <span className={`text-[10px] tracking-wider mt-0.5 ${opt.id === sortBy ? 'opacity-70' : 'text-text-muted'}`}>
              {opt.sub}
            </span>
          </button>
        ))}
      </nav>

      {/* The strip */}
      <section className="relative max-w-[1400px] mx-auto">
        <div
          className="flex w-full rounded-md overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
          style={{ height: 'min(60vh, 520px)' }}
          onMouseLeave={() => setHovered(null)}
        >
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
                className={`relative flex-1 flex flex-col min-w-0 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-text-primary/30
                  ${isHovered ? 'flex-[3] z-10' : 'hover:flex-[2]'}`}
                aria-label={`${art.display_title || art.title}${art.year ? `, ${art.year}` : ''}`}
              >
                {p.palette.map((color, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: color, flex: 1 }}
                    className="w-full"
                  />
                ))}
              </button>
            );
          })}
        </div>

        {/* Hover preview · floats above the strip, generously sized */}
        {hoveredArt && hoveredPalette && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 translate-y-full
              bg-white/95 backdrop-blur-md border border-white/50
              rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.16)]
              p-5 pointer-events-none z-20
              w-[min(560px,90vw)]"
          >
            <div className="flex gap-5 items-start">
              {(hoveredArt.thumbPath || hoveredArt.imagePath) && (
                <img
                  src={hoveredArt.thumbPath || hoveredArt.imagePath || ''}
                  alt=""
                  className="w-56 h-56 object-cover rounded-md shadow-[0_6px_20px_rgba(0,0,0,0.12)] flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1 pt-1">
                <p className="font-heading text-text-primary text-2xl leading-tight">
                  {hoveredArt.display_title || hoveredArt.title}
                </p>
                <p className="font-body text-text-muted text-xs mt-2 tracking-[0.2em] uppercase">
                  {hoveredArt.year || hoveredArt.chapter?.replace(/-/g, ' ')}
                  {hoveredArt.medium ? ` · ${hoveredArt.medium}` : ''}
                </p>
                {hoveredArt.dimensions && (
                  <p className="font-body text-text-muted text-xs mt-1">
                    {hoveredArt.dimensions}
                  </p>
                )}
                <div className="flex gap-1.5 mt-5">
                  {hoveredPalette.palette.map((c, i) => (
                    <span
                      key={i}
                      className="w-8 h-8 rounded-sm border border-black/5"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      <p className="max-w-2xl mx-auto text-center mt-32 font-body text-text-muted text-sm leading-relaxed">
        Click any band to see the painting.{' '}
        Hover to see its title and the five swatches that build it.
      </p>
    </main>
  );
}

export default ColorAtlasPage;
