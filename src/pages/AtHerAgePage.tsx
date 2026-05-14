import { useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import artworksData from '../data/artworks.json';
import photosData from '../data/photos.json';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Artwork } from '../types';

interface BookPhoto {
  file: string;
  pdf_page: number;
  book_page: number;
  size: [number, number];
  chroma: number;
  likely_photo: boolean;
}

const artworks = artworksData as Artwork[];
const photos = photosData as BookPhoto[];

interface LifeEra {
  id: string;
  title: string;
  yearStart: number;
  yearEnd: number;
  caption: string;            // life event in our voice
  bookChapters: string[];     // painting chapters from that era
  photoPageRange: [number, number];
  accent: string;
}

const BIRTH_YEAR = 1920;

const LIFE_ERAS: LifeEra[] = [
  {
    id: 'childhood',
    title: 'Childhood',
    yearStart: 1920,
    yearEnd: 1936,
    caption: 'Born Rock Island, Illinois, daughter of Polish-Jewish immigrants. Chicago, then Boston, then Los Angeles — her mother\'s BEADING COLLEGE in the window of every place they lived.',
    bookChapters: [],
    photoPageRange: [16, 22],
    accent: '#8B7D6B',
  },
  {
    id: 'art-school',
    title: 'Art School, New York',
    yearStart: 1937,
    yearEnd: 1949,
    caption: 'New York to study, a first marriage, her son Daniel. The earliest paintings she kept are from these years — the ones the book gathers as "OLD STUFF."',
    bookChapters: ['old-stuff'],
    photoPageRange: [23, 27],
    accent: '#6B5545',
  },
  {
    id: 'mill-valley',
    title: 'Mill Valley',
    yearStart: 1950,
    yearEnd: 1959,
    caption: 'Moving West. Meeting Herman. Building a life in Mill Valley with the studio that looked at Mt. Tam from its windows.',
    bookChapters: ['old-stuff'],
    photoPageRange: [28, 33],
    accent: '#9B8B7A',
  },
  {
    id: 'toddler-years',
    title: 'Peter & Davy',
    yearStart: 1960,
    yearEnd: 1968,
    caption: 'Two more sons. The "abstract" and "social comment" years — yeasty times, trying to be trendy, painting Vietnam horrors and civil-rights demonstrations as collage.',
    bookChapters: ['abstract', 'social-comment'],
    photoPageRange: [33, 36],
    accent: '#8B3A3A',
  },
  {
    id: 'accidental',
    title: 'The Accidental Watercolorist',
    yearStart: 1969,
    yearEnd: 1974,
    caption: 'A library book of beetles. She bought watercolors that afternoon. The medium she would carry the rest of her life found her by accident, after forty-eight years.',
    bookChapters: [],
    photoPageRange: [37, 39],
    accent: '#C49650',
  },
  {
    id: 'prolific',
    title: 'Prolific Years',
    yearStart: 1975,
    yearEnd: 1984,
    caption: 'One-man shows. Painting roadside America from a Ford Econoline van that doubled as a studio. Bay Area landscapes, street scenes, portraits of the people she actually knew.',
    bookChapters: ['on-the-road', 'landscape', 'street-scenes', 'portraits'],
    photoPageRange: [40, 139],
    accent: '#6B8E5A',
  },
  {
    id: 'travel-decades',
    title: 'The Travel Decades',
    yearStart: 1985,
    yearEnd: 1999,
    caption: 'France. Italy. Greece. Turkey. Japan. India. Nepal. Kenya. Britain. Two carry-ons, two brushes, a chocolate bar, and a notebook — her travel kit. She painted on location for forty days at a stretch.',
    bookChapters: ['travel'],
    photoPageRange: [236, 297],
    accent: '#3E8FC4',
  },
  {
    id: 'late-work',
    title: 'Late Work',
    yearStart: 2000,
    yearEnd: 2004,
    caption: 'Home from the road. Still lifes, interiors, flowers — the small subjects given the gravity she once gave Mt. Tam. The High Sierra one last time. The book finished. Strawberry Press, Mill Valley.',
    bookChapters: ['still-life', 'interiors', 'flowers', 'high-sierra'],
    photoPageRange: [198, 297],
    accent: '#E0B8C8',
  },
];

const TIMELINE_START = 1918;
const TIMELINE_END = 2006;

function ageRange(era: LifeEra): string {
  const a = era.yearStart - BIRTH_YEAR;
  const b = era.yearEnd - BIRTH_YEAR;
  return `Age ${a}–${b}`;
}

function paintingsForEra(era: LifeEra): Artwork[] {
  if (!era.bookChapters.length) return [];
  const set = new Set(era.bookChapters);
  return artworks
    .filter((a) => a.imagePath && a.chapter && set.has(a.chapter))
    .sort((a, b) => (a.book_page || 9999) - (b.book_page || 9999));
}

// Hand-curated photo per era · the auto-extract sometimes catches text pages so
// we pin known-good photographs explicitly. Other eras fall back to a
// representative painting from the era (rendered in the photo slot).
const PHOTO_OVERRIDE: Record<string, string> = {
  'art-school':     'p028_02.jpg',  // "Daniel and Me" · young Leah with her first son
  'mill-valley':    'p029_02.jpg',  // Leah in profile · "my cousin Simon took this picture"
  'toddler-years':  'p037_02.jpg',  // "Dan, filming in New York" · the sons grown
  'late-work':      'p001_04.jpg',  // back-cover portrait sketch with her signature
};

function photoForEra(era: LifeEra): BookPhoto | undefined {
  if (PHOTO_OVERRIDE[era.id]) {
    return photos.find((p) => p.file === PHOTO_OVERRIDE[era.id]);
  }
  return undefined;
}

function representativeArtForEra(era: LifeEra): Artwork | undefined {
  const list = paintingsForEra(era);
  return list[0];
}

function AtHerAgePage(): JSX.Element {
  usePageMeta(
    'At Her Age',
    "Slide through Leah Schwartz's 84 years. Her photograph at every era beside the paintings she was making.",
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const eraParam = searchParams.get('era');
  const idx = (() => {
    const found = LIFE_ERAS.findIndex((e) => e.id === eraParam);
    return found >= 0 ? found : 0;
  })();
  const era = LIFE_ERAS[idx];

  const setIdx = useCallback((updater: number | ((prev: number) => number)) => {
    const next = typeof updater === 'function' ? updater(idx) : updater;
    const safe = Math.min(LIFE_ERAS.length - 1, Math.max(0, next));
    setSearchParams(
      safe === 0 ? {} : { era: LIFE_ERAS[safe].id },
      { replace: true },
    );
  }, [idx, setSearchParams]);
  const photo = useMemo(() => photoForEra(era), [era]);
  const allEraPaintings = useMemo(() => paintingsForEra(era), [era]);
  const fallbackArt = useMemo(() => representativeArtForEra(era), [era]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.target instanceof HTMLElement && /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(0, i - 1));
      else if (e.key === 'ArrowRight') setIdx((i) => Math.min(LIFE_ERAS.length - 1, i + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <motion.header
        className="max-w-3xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-body text-text-muted uppercase tracking-[0.3em] text-xs mb-3">
          Slide through her 84 years
        </p>
        <h1 className="font-heading text-5xl md:text-7xl text-text-primary leading-tight">
          At Her Age
        </h1>
        <p className="font-leah text-text-muted mt-3 text-3xl md:text-4xl leading-none">
          1920 — 2004
        </p>
      </motion.header>

      {/* Timeline · slim continuous strip, active era named above */}
      <section className="max-w-4xl mx-auto mb-20 px-4">
        {/* Active era title hovers above the bar · animates in on era change */}
        <AnimatePresence mode="wait">
          <motion.p
            key={era.id + '-label'}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="font-body text-text-secondary text-[11px] tracking-[0.32em] uppercase text-center mb-3"
          >
            {era.title}
          </motion.p>
        </AnimatePresence>

        {/* Single continuous era strip · slim segments butt edge-to-edge,
            the active one gains height and full saturation. */}
        <div
          className="relative w-full h-[6px] flex"
          role="tablist"
          aria-label="Life eras"
        >
          {LIFE_ERAS.map((e, i) => {
            const width = ((e.yearEnd - e.yearStart + 1) / (TIMELINE_END - TIMELINE_START)) * 100;
            const isActive = i === idx;
            return (
              <button
                key={e.id}
                type="button"
                role="tab"
                onClick={() => setIdx(i)}
                className={`relative h-full transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-text-primary/30 focus:ring-offset-2
                  ${isActive
                    ? 'opacity-100'
                    : 'opacity-45 hover:opacity-80'}`}
                style={{
                  flexBasis: `${width}%`,
                  backgroundColor: e.accent,
                  transform: isActive ? 'scaleY(2.4)' : undefined,
                  transformOrigin: 'center',
                }}
                aria-label={`${e.title}, ${e.yearStart}–${e.yearEnd}`}
                aria-selected={isActive}
              />
            );
          })}
        </div>

        {/* Decade markers below the strip · hairline ticks, small numerals */}
        <div className="relative mt-3 h-5">
          {[1920, 1940, 1960, 1980, 2000].map((year) => {
            const pct = ((year - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100;
            return (
              <span
                key={year}
                className="absolute -translate-x-1/2 font-body text-[10px] text-text-muted tracking-[0.18em]"
                style={{ left: `${pct}%` }}
              >
                {year}
              </span>
            );
          })}
        </div>

        {/* Earlier / Later · minimal text buttons, no instruction line */}
        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="font-body text-[11px] uppercase tracking-[0.32em] text-text-muted hover:text-text-primary disabled:opacity-25 transition-colors"
            aria-label="Previous era"
          >
            ← Earlier
          </button>
          <button
            type="button"
            onClick={() => setIdx((i) => Math.min(LIFE_ERAS.length - 1, i + 1))}
            disabled={idx === LIFE_ERAS.length - 1}
            className="font-body text-[11px] uppercase tracking-[0.32em] text-text-muted hover:text-text-primary disabled:opacity-25 transition-colors"
            aria-label="Next era"
          >
            Later →
          </button>
        </div>
      </section>

      {/* Era detail */}
      <AnimatePresence mode="wait">
        <motion.section
          key={era.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-6xl mx-auto text-center"
        >
          {/* Era title + caption, centered */}
          <div className="max-w-3xl mx-auto mb-12">
            <p
              className="font-body uppercase tracking-[0.3em] text-[11px] mb-4"
              style={{ color: era.accent }}
            >
              {era.yearStart}–{era.yearEnd} · {ageRange(era)}
            </p>
            <h2 className="font-heading text-4xl md:text-6xl text-text-primary leading-tight mb-4">
              {era.title}
            </h2>
            <div
              className="w-12 h-1 rounded-full mx-auto mb-8"
              style={{ backgroundColor: era.accent }}
              aria-hidden="true"
            />
            <p className="font-heading text-[18px] md:text-[20px] leading-[1.7] text-text-primary">
              {era.caption}
            </p>
          </div>

          {/* Photo · centered */}
          <div className="max-w-md mx-auto mb-16">
            {photo ? (
              <figure>
                <img
                  src={`/photos/${photo.file}`}
                  alt={`Leah at ${ageRange(era).toLowerCase()}`}
                  className="w-full h-auto rounded-sm shadow-[0_8px_28px_rgba(0,0,0,0.12)] mx-auto"
                  loading="lazy"
                />
                <figcaption className="font-body text-[11px] text-text-muted tracking-wider uppercase mt-3">
                  Photograph · from the book
                </figcaption>
              </figure>
            ) : fallbackArt?.imagePath ? (
              <figure>
                <Link to={`/artwork/${fallbackArt.id}`} className="block group">
                  <img
                    src={fallbackArt.thumbPath || fallbackArt.imagePath || ''}
                    alt={fallbackArt.display_title || fallbackArt.title}
                    className="w-full h-auto rounded-sm shadow-[0_8px_28px_rgba(0,0,0,0.12)] mx-auto group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.18)] transition-shadow"
                    loading="lazy"
                  />
                  <figcaption className="font-body text-[11px] text-text-muted tracking-wider uppercase mt-3">
                    A painting from this era · {fallbackArt.display_title || fallbackArt.title}
                  </figcaption>
                </Link>
              </figure>
            ) : (
              <div
                className="aspect-[3/4] rounded-sm flex items-center justify-center text-text-muted text-xs italic px-4 text-center max-w-xs mx-auto"
                style={{ backgroundColor: era.accent + '22' }}
              >
                A photograph for this era is on the way.
              </div>
            )}
          </div>

          {/* All paintings from this era */}
          {allEraPaintings.length > 0 ? (
            <div>
              <p className="font-body text-text-muted uppercase tracking-[0.25em] text-xs mb-6">
                {allEraPaintings.length} {allEraPaintings.length === 1 ? 'painting' : 'paintings'} from this era
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allEraPaintings.map((a) => (
                  <Link key={a.id} to={`/artwork/${a.id}`} className="group block text-center">
                    <div
                      className="aspect-square rounded-sm relative overflow-hidden shadow-[0_3px_14px_rgba(0,0,0,0.08)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition-shadow"
                      style={{ backgroundColor: a.placeholderColor }}
                    >
                      <img
                        src={a.thumbPath || a.imagePath || ''}
                        alt={a.display_title || a.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                      />
                    </div>
                    <p className="font-body text-[12px] text-text-primary mt-2 truncate leading-tight">
                      {a.display_title || a.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="font-body text-text-muted text-sm italic max-w-xl mx-auto">
              No paintings in the catalog from this era — she was either too young or had not yet kept what she made.
            </p>
          )}
        </motion.section>
      </AnimatePresence>
    </main>
  );
}

export default AtHerAgePage;
