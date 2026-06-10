import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import artworksData from '../data/artworks.json';
import photosData from '../data/photos.json';
import palettesData from '../data/palettes.json';
import { usePageMeta } from '../hooks/usePageMeta';
import PaperMount from '../components/ui/PaperMount';
import type { Artwork } from '../types';

const palettes = palettesData as Record<string, { dominant: string; palette: string[] }>;

// A slim watercolour line flowing across the page · the pigment of the
// paintings she actually made in this era, feathered at both ends so it
// reads as a wash, not a bar. Falls back to a soft single-accent wash for
// the early years where the catalog holds nothing yet.
function EraColorFlow({ ids, accent }: { ids: string[]; accent: string }): JSX.Element {
  const colors = ids.map((id) => palettes[id]?.dominant).filter(Boolean) as string[];
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-[12px] w-full max-w-3xl"
      style={{
        WebkitMaskImage:
          'linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%)',
        maskImage:
          'linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%)',
      }}
    >
      {colors.length >= 3 ? (
        <>
          <div className="flex w-full h-full">
            {colors.map((c, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/textures/wash-grain.png)',
              backgroundSize: 'auto 100%',
              backgroundRepeat: 'repeat-x',
              mixBlendMode: 'soft-light',
              opacity: 0.7,
            }}
          />
        </>
      ) : (
        <div
          className="w-full h-full"
          style={{
            background: `linear-gradient(to right, ${accent}00, ${accent}66 50%, ${accent}00)`,
          }}
        />
      )}
    </div>
  );
}

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
  caption: string;            // one-line lead, in our voice
  prose: string;              // a fuller paragraph about her in this era
  bookChapters: string[];     // painting chapters from that era
  photoPageRange: [number, number];
  accent: string;
}

const BIRTH_YEAR = 1920;

// Note: the standalone "Accidental Watercolorist" era (1969–74) was removed -
// we have no photograph of her from it. Its pivotal story (finding watercolor
// by accident at 48) now opens the Prolific Years, which absorb 1969–74.
const LIFE_ERAS: LifeEra[] = [
  {
    id: 'childhood',
    title: 'Childhood',
    yearStart: 1920,
    yearEnd: 1936,
    caption: 'Born Rock Island, Illinois - daughter of Polish-Jewish immigrants.',
    prose:
      'She was born in Rock Island, Illinois, in the summer of 1920, the daughter of Polish-Jewish immigrants who had been made Greenfields at Ellis Island. The family moved the way immigrant families moved - Chicago, then Boston, then on - and in the window of every place they lived her mother hung the sign for her beading college. Leah grew up watching hands make small, exact, beautiful things out of almost nothing. It was a lesson she never stopped practicing.',
    bookChapters: [],
    photoPageRange: [16, 22],
    accent: '#8B7D6B',
  },
  {
    id: 'art-school',
    title: 'Art School, New York',
    yearStart: 1937,
    yearEnd: 1949,
    caption: 'New York to study · a first marriage · her son Daniel.',
    prose:
      'At seventeen she went to New York to study, and the city kept her through a first marriage and the birth of her son Daniel. The paintings she chose to keep begin here - the earliest survivors, the ones the book later gathered under the wry heading OLD STUFF. They are a young painter\'s paintings: serious, searching, already unwilling to lie about what she saw.',
    bookChapters: ['old-stuff'],
    photoPageRange: [23, 27],
    accent: '#6B5545',
  },
  {
    id: 'mill-valley',
    title: 'Mill Valley',
    yearStart: 1950,
    yearEnd: 1959,
    caption: 'Moving West · meeting Herman · the studio that looked at Mt. Tam.',
    prose:
      'She moved West, and the West held her for the rest of her life. In Mill Valley she met Herman Schwartz - "the remarkable Herman" - and built the house with the studio whose windows framed Mt. Tamalpais. The mountain became the constant in her eye, a shape she returned to for fifty years the way other people return to a face.',
    bookChapters: ['old-stuff'],
    photoPageRange: [28, 33],
    accent: '#9B8B7A',
  },
  {
    id: 'toddler-years',
    title: 'Peter & Davy',
    yearStart: 1960,
    yearEnd: 1968,
    caption: 'Two more sons · the abstract and social-comment years.',
    prose:
      'Two more sons arrived and the household filled. These were the yeasty years - she tried to be trendy, smearing and pouring paint on canvases spread on the floor, making collage out of Vietnam and the civil-rights marches. It was honest work and it was not quite hers; she would say later that she didn\'t think abstractly and didn\'t worship paint for its own sake.',
    bookChapters: ['abstract', 'social-comment'],
    photoPageRange: [33, 36],
    accent: '#8B3A3A',
  },
  {
    id: 'prolific',
    title: 'Prolific Years',
    yearStart: 1969,
    yearEnd: 1984,
    caption: 'Watercolor found her by accident · then her most productive years.',
    prose:
      'It started with a library book of beetles. She bought watercolors that same afternoon, and the medium she would carry the rest of her life had simply found her - by accident, at forty-eight. What followed were her most productive years: one-man shows, roadside America painted out the back of a Ford Econoline that doubled as a studio, the Bay Area landscapes and street scenes and portraits of the people she actually knew.',
    bookChapters: ['on-the-road', 'landscape', 'street-scenes', 'portraits'],
    photoPageRange: [40, 139],
    accent: '#6B8E5A',
  },
  {
    id: 'travel-decades',
    title: 'The Travel Decades',
    yearStart: 1985,
    yearEnd: 1999,
    caption: 'Two carry-ons, two brushes, a chocolate bar, a notebook.',
    prose:
      'Two carry-ons, two brushes, a chocolate bar, and a notebook - that was the kit. With Herman she went to France, Italy, Greece, Turkey, Japan, India, Nepal, Kenya, Britain, and painted on location for forty days at a stretch. She was not a tourist who painted; she was a painter who happened to be moving, recording rooftops and markets and light with the same attention she had always given Mt. Tam.',
    bookChapters: ['travel'],
    photoPageRange: [236, 297],
    accent: '#3E8FC4',
  },
  {
    id: 'late-work',
    title: 'Late Work',
    yearStart: 2000,
    yearEnd: 2004,
    caption: 'Home from the road · the small subjects given great gravity.',
    prose:
      'Home from the road, she turned to the small subjects - still lifes, interiors, a single pear, flowers - and gave them the gravity she had once given mountains. There was the High Sierra one last time. She finished the book herself, on Strawberry Press in Mill Valley, and then she was gone, in 2004, having kept exactly what she meant to keep.',
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

// Pick the ripped-paper variant that best frames a photo's orientation.
function photoPaper(photo: BookPhoto): 'tall' | 'square' | 'mid' {
  const [w, h] = photo.size;
  const aspect = w / h;
  if (aspect < 0.85) return 'tall';
  if (aspect > 1.25) return 'mid';
  return 'square';
}

function representativeArtForEra(era: LifeEra): Artwork | undefined {
  return paintingsForEra(era)[0];
}

function AtHerAgePage(): JSX.Element {
  usePageMeta(
    'At Her Age',
    "Scroll through Leah Schwartz's eighty-four years - her own life in eras, the paintings she was making, the photographs from the book.",
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeIdx, setActiveIdx] = useState(0);
  const [stuck, setStuck] = useState(false);
  // Each era shows a curated handful; "all from these years" expands on demand.
  const [expandedEras, setExpandedEras] = useState<Record<string, boolean>>({});
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const didInitialScroll = useRef(false);

  // When the sentinel (just above the timeline) scrolls past the sticky
  // offset, the timeline is "stuck" - compact it so it eats less of the screen.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: '-84px 0px 0px 0px', threshold: 0 },
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  // Jump instantly · the page is ~20,000px tall, so a smooth scroll across it
  // (the global `scroll-behavior: smooth` would otherwise apply) is slow and
  // fights the scroll-spy. Clicking the timeline is a "jump to chapter".
  const scrollToEra = useCallback((i: number) => {
    const el = sectionRefs.current[i];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 150;
    window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
  }, []);

  // On first load, if ?era= points at a section, jump there (preserves the
  // "open an artwork, come back to where you were" behavior).
  useEffect(() => {
    if (didInitialScroll.current) return;
    didInitialScroll.current = true;
    const eraParam = searchParams.get('era');
    const i = LIFE_ERAS.findIndex((e) => e.id === eraParam);
    if (i > 0) {
      // Defer until sections have laid out, then jump instantly.
      requestAnimationFrame(() => {
        const el = sectionRefs.current[i];
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 150;
        window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
      });
    }
  }, [searchParams]);

  // Scroll-spy: whichever era section is most centered drives the active state
  // and the sticky timeline highlight.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = Number(entry.target.getAttribute('data-era-idx'));
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { idx, ratio: entry.intersectionRatio };
          }
        }
        if (best) {
          setActiveIdx(best.idx);
          const id = LIFE_ERAS[best.idx].id;
          setSearchParams(best.idx === 0 ? {} : { era: id }, { replace: true });
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.5, 1] },
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [setSearchParams]);

  // Keyboard nav scrolls between eras.
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.target instanceof HTMLElement && /input|textarea/i.test(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') {
        scrollToEra(Math.max(0, activeIdx - 1));
      } else if (e.key === 'ArrowRight') {
        scrollToEra(Math.min(LIFE_ERAS.length - 1, activeIdx + 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx, scrollToEra]);

  const activeEra = LIFE_ERAS[activeIdx];

  return (
    <main className="min-h-screen pb-24">
      {/* Title · scrolls away normally */}
      <motion.header
        className="max-w-3xl mx-auto text-center px-6 pt-28 pb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-body text-text-muted uppercase tracking-[0.3em] text-xs mb-3">
          A life in eras · scroll through
        </p>
        <h1 className="font-heading text-5xl md:text-7xl text-text-primary leading-tight">
          At Her Age
        </h1>
        <p className="font-leah text-text-muted mt-3 text-3xl md:text-4xl leading-none">
          1920 - 2004
        </p>
      </motion.header>

      {/* Sentinel · its visibility tells us when the timeline goes sticky */}
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

      {/* Sticky timeline · stays at the top of the page the whole way down.
          Compacts vertically once it's stuck so it doesn't dominate. */}
      <div
        className={`sticky top-[84px] z-30
          bg-bg-gallery/80 backdrop-blur-md
          border-y border-text-muted/10
          transition-[padding] duration-300
          ${stuck ? 'py-2' : 'py-4'}`}
      >
        <div className="max-w-4xl mx-auto px-6">
          <p
            className={`font-body text-[11px] tracking-[0.32em] uppercase text-center transition-all duration-300
              ${stuck ? 'mb-1.5' : 'mb-3'}`}
            style={{ color: activeEra.accent }}
          >
            {activeEra.title} · {activeEra.yearStart}–{activeEra.yearEnd}
          </p>
          <div
            className="relative w-full flex"
            role="tablist"
            aria-label="Life eras"
          >
            {LIFE_ERAS.map((e, i) => {
              const width =
                ((e.yearEnd - e.yearStart + 1) / (TIMELINE_END - TIMELINE_START)) * 100;
              const isActive = i === activeIdx;
              return (
                <button
                  key={e.id}
                  type="button"
                  role="tab"
                  onClick={() => scrollToEra(i)}
                  className="group relative h-7 flex items-center
                    focus:outline-none"
                  style={{ flexBasis: `${width}%` }}
                  aria-label={`${e.title}, ${e.yearStart}–${e.yearEnd}`}
                  aria-selected={isActive}
                  title={`${e.title} · ${e.yearStart}–${e.yearEnd}`}
                >
                  {/* The visible slim bar · the button itself is a taller,
                      transparent hit area so it's easy to click. */}
                  <span
                    className={`block w-full h-[6px] transition-all duration-300
                      group-focus-visible:ring-2 group-focus-visible:ring-text-primary/40 group-focus-visible:ring-offset-2
                      ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-75'}`}
                    style={{
                      backgroundColor: e.accent,
                      transform: isActive ? 'scaleY(2.4)' : undefined,
                      transformOrigin: 'center',
                    }}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
          {/* Decade markers collapse away once stuck - orientation is only
              needed at the top; while scrolling, the era label is enough. */}
          <div
            className={`relative overflow-hidden transition-all duration-300
              ${stuck ? 'mt-0 h-0 opacity-0' : 'mt-3 h-4 opacity-100'}`}
          >
            {[1920, 1940, 1960, 1980, 2000].map((year) => {
              const pct =
                ((year - TIMELINE_START) / (TIMELINE_END - TIMELINE_START)) * 100;
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
        </div>
      </div>

      {/* One scroll section per era */}
      {LIFE_ERAS.map((era, i) => {
        const photo = photoForEra(era);
        const allEraPaintings = paintingsForEra(era);
        const isExpanded = !!expandedEras[era.id];
        // The pairing of HER at that age with A FEW works is the emotional
        // engine - a 60-painting dump drowns it. Ten, then the rest on request.
        const eraPaintings = isExpanded ? allEraPaintings : allEraPaintings.slice(0, 10);
        const hiddenCount = allEraPaintings.length - eraPaintings.length;
        const fallbackArt = representativeArtForEra(era);
        return (
          <section
            key={era.id}
            ref={(el) => { sectionRefs.current[i] = el; }}
            data-era-idx={i}
            id={era.id}
            className="max-w-6xl mx-auto px-6 pt-28 pb-36 scroll-mt-[200px] text-center"
          >
            {/* Era heading · always visible (timeline jumps straight here) */}
            <div className="max-w-2xl mx-auto mb-9">
              <p
                className="font-body uppercase tracking-[0.34em] text-[11px] mb-5"
                style={{ color: era.accent }}
              >
                {era.yearStart}–{era.yearEnd} · {ageRange(era)}
              </p>
              <h2 className="font-heading text-[clamp(34px,5vw,60px)] text-text-primary leading-[1.05]">
                {era.title}
              </h2>
              <p className="font-leah text-text-secondary text-[clamp(22px,3vw,32px)] leading-snug mt-5">
                {era.caption}
              </p>
            </div>

            {/* Her pigment in these years · a wash flowing across the page */}
            <div className="mb-20">
              <EraColorFlow ids={eraPaintings.map((a) => a.id)} accent={era.accent} />
            </div>

            {/* Leah, at this age · on her own torn paper */}
            <div className="flex justify-center mb-7">
              {photo ? (
                <figure className="text-center">
                  <PaperMount
                    src={`/photos/${photo.file}`}
                    alt={`Leah, ${ageRange(era).toLowerCase()}`}
                    paper={photoPaper(photo)}
                    inset={{ x: 30, y: 26 }}
                    shadow="soft"
                    imgClassName="w-auto h-[clamp(260px,40vh,440px)] block"
                  />
                  <figcaption className="font-body text-[11px] text-text-muted tracking-[0.24em] uppercase mt-12">
                    Photograph · from the book
                  </figcaption>
                </figure>
              ) : fallbackArt?.imagePath ? (
                <figure className="text-center">
                  <Link to={`/artwork/${fallbackArt.id}`} className="block group">
                    <PaperMount
                      src={fallbackArt.thumbPath || fallbackArt.imagePath || ''}
                      alt={fallbackArt.display_title || fallbackArt.title}
                      paper="mid"
                      inset={{ x: 30, y: 24 }}
                      shadow="soft"
                      imgClassName="w-auto h-[clamp(240px,36vh,400px)] block transition-opacity duration-300 group-hover:opacity-90"
                    />
                    <figcaption className="font-body text-[11px] text-text-muted tracking-[0.24em] uppercase mt-12">
                      A painting from this era · {fallbackArt.display_title || fallbackArt.title}
                    </figcaption>
                  </Link>
                </figure>
              ) : (
                <p className="font-heading italic text-text-muted/70 text-[15px] py-12">
                  A photograph for this era is on the way.
                </p>
              )}
            </div>

            {/* Her words for these years */}
            <p className="font-heading text-[clamp(16px,1.3vw,19px)] leading-[1.85]
              text-text-primary max-w-2xl mx-auto mb-24">
              {era.prose}
            </p>

            {/* Paintings from this era */}
            {eraPaintings.length > 0 ? (
              <div>
                <p className="font-body text-text-muted uppercase tracking-[0.3em] text-[11px] mb-8">
                  The work from these years · {allEraPaintings.length} {allEraPaintings.length === 1 ? 'painting' : 'paintings'}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {eraPaintings.map((a) => (
                    <Link
                      key={a.id}
                      to={`/artwork/${a.id}`}
                      className="group block text-center shrink-0
                        w-[calc(50%_-_0.5rem)]
                        sm:w-[calc(33.333%_-_0.667rem)]
                        md:w-[calc(25%_-_0.75rem)]
                        lg:w-[calc(20%_-_0.8rem)]"
                    >
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
                {hiddenCount > 0 && (
                  <button
                    onClick={() => setExpandedEras((prev) => ({ ...prev, [era.id]: true }))}
                    className="mt-8 glass-pill px-6 py-3 font-body text-sm text-text-secondary
                      hover:text-text-primary hover:shadow-glass transition-all"
                  >
                    All {allEraPaintings.length} from these years ↓
                  </button>
                )}
              </div>
            ) : (
              <p className="font-body text-text-muted text-sm italic max-w-xl mx-auto">
                No paintings in the catalog from this era - she was either too young, or had not yet kept what she made.
              </p>
            )}
          </section>
        );
      })}
    </main>
  );
}

export default AtHerAgePage;
