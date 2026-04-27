// A Life in Chapters · scroll-driven biographical pages, as Leah told her own story.
// Each chapter weaves photos + her prose + the paintings from that era.

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import artworksData from '../data/artworks.json';
import photosData from '../data/photos.json';
import autobiographyMd from '../data/prose/01_autobiography.md?raw';
import travelMd from '../data/prose/12_travel.md?raw';
import { extractSection, firstParagraphs } from '../data/proseSections';
import { linkArtworkMentions } from '../data/proseLinker';
import type { Artwork } from '../types';
import { usePageMeta } from '../hooks/usePageMeta';

interface BookPhoto {
  file: string;
  pdf_page: number;
  book_page: number;
  likely_photo: boolean;
}

const artworks = artworksData as Artwork[];
const photos = photosData as BookPhoto[];

interface LifeChapter {
  id: string;
  title: string;
  years: string;
  subtitle: string;
  autobiographySections: string[];           // ## heading matches to pull from autobiography
  bookChapters: string[];                    // painting chapters associated with this era
  photoPageRange: [number, number];          // pdf_page range for photographs
  accent: string;                            // hex colour
}

const LIFE_CHAPTERS: LifeChapter[] = [
  {
    id: 'childhood',
    title: 'Childhood',
    years: '1920–1936',
    subtitle: 'Rock Island, Chicago, Boston, Los Angeles',
    autobiographySections: ['IMMIGRANTS', 'CHICAGO', 'MOTHER AND ME IN CHICAGO', 'LOS ANGELES'],
    bookChapters: [],
    photoPageRange: [16, 22],
    accent: '#8B7D6B',
  },
  {
    id: 'art-school',
    title: 'Art School, Love, Marriage',
    years: '1937–1949',
    subtitle: 'New York, a first marriage, her son Daniel',
    autobiographySections: ['AND MARRIAGE', 'BOSTON', 'WEST 69TH STREET'],
    bookChapters: [],
    photoPageRange: [23, 27],
    accent: '#6B5545',
  },
  {
    id: 'mill-valley-roots',
    title: 'Mill Valley Roots',
    years: '1950–1959',
    subtitle: 'Moving West, meeting Herman, the house',
    autobiographySections: ['SAN FRANCISCO', 'MILL VALLEY, CALIFORNIA'],
    bookChapters: ['old-stuff'],
    photoPageRange: [28, 33],
    accent: '#8B7355',
  },
  {
    id: 'toddler-years',
    title: 'The Toddler Years',
    years: '1960s',
    subtitle: 'Peter and Davy, sanity in the land of the Munchkins',
    autobiographySections: ['THE TODDLER YEARS'],
    bookChapters: ['abstract', 'social-comment'],
    photoPageRange: [33, 36],
    accent: '#8B3A3A',
  },
  {
    id: 'accidental-watercolorist',
    title: 'The Accidental Watercolorist',
    years: 'late 1960s',
    subtitle: 'The beetle book, finding her medium',
    autobiographySections: ['WORK', 'TEACHING MYSELF WATERCOLOR'],
    bookChapters: [],
    photoPageRange: [37, 39],
    accent: '#C49650',
  },
  {
    id: 'prolific',
    title: 'Prolific Years',
    years: '1970s–1980s',
    subtitle: 'One-man shows, painting roadside America',
    autobiographySections: ['TIME TO PAINT'],
    bookChapters: ['on-the-road', 'landscape', 'street-scenes', 'portraits'],
    photoPageRange: [40, 139],
    accent: '#6B8E5A',
  },
  {
    id: 'travel-decades',
    title: 'The Travel Decades',
    years: '1970s–1990s',
    subtitle: 'France · Italy · Greece · Turkey · Japan · India · Nepal · Kenya · Britain',
    autobiographySections: [],   // use travel preamble instead
    bookChapters: ['travel'],
    photoPageRange: [236, 297],
    accent: '#5A7AAA',
  },
  {
    id: 'late-work',
    title: 'Late Work',
    years: '1990s–2004',
    subtitle: 'Home, interiors, flowers, still lifes, the High Sierra',
    autobiographySections: [],
    bookChapters: ['still-life', 'interiors', 'flowers'],
    photoPageRange: [198, 297],
    accent: '#9A8A78',
  },
];

// For chapters without a direct autobiography section match, fall back to the
// first few paragraphs of the relevant source prose.
function proseForChapter(ch: LifeChapter): string {
  const sections: string[] = [];
  for (const heading of ch.autobiographySections) {
    const body = extractSection(autobiographyMd, heading);
    if (body) sections.push(body);
  }
  if (sections.length) return sections.join('\n\n');
  // Travel preamble
  if (ch.id === 'travel-decades') {
    return firstParagraphs(travelMd, 3);
  }
  return '';
}

function artworksForChapter(ch: LifeChapter): Artwork[] {
  if (!ch.bookChapters.length) return [];
  const set = new Set(ch.bookChapters);
  return artworks.filter((a) => a.chapter && set.has(a.chapter) && a.imagePath);
}

function photosForChapter(ch: LifeChapter): BookPhoto[] {
  const [s, e] = ch.photoPageRange;
  return photos.filter((p) => p.likely_photo && p.pdf_page >= s && p.pdf_page <= e);
}

export default function LifePage(): JSX.Element {
  usePageMeta('A Life in Chapters', '84 years told her way · photos, prose, and paintings from each era of Leah Schwartz.');
  return (
    <main className="min-h-screen pb-24">
      {/* Intro */}
      <header
        className="pt-28 pb-16 px-6 text-center"
        style={{ background: 'linear-gradient(to bottom, #F1EBDE, #FAFAFA)' }}
      >
        <p className="font-body text-text-muted uppercase tracking-[0.3em] text-xs mb-4">
          A Life in Chapters
        </p>
        <h1 className="font-heading text-5xl md:text-7xl text-text-primary leading-tight">
          84 years, told her way
        </h1>
        <p className="font-body text-text-secondary mt-6 max-w-2xl mx-auto leading-relaxed">
          Leah arranged her autobiography into named sections · not by year, but by life.
          Scroll through the eras as she structured them, with her photographs, her prose,
          and the paintings that belong to each time.
        </p>
      </header>

      {/* Chapter rail · sticky on desktop */}
      <nav className="sticky top-0 z-20 bg-bg-gallery/90 backdrop-blur-md border-b border-[#E8E2D5] overflow-x-auto">
        <ul className="flex gap-2 px-4 py-3 max-w-7xl mx-auto min-w-max justify-center">
          {LIFE_CHAPTERS.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                className="font-body text-xs text-text-muted hover:text-text-primary px-3 py-1.5 rounded-full whitespace-nowrap transition-colors"
              >
                {c.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Life chapters */}
      <div className="max-w-5xl mx-auto px-6 pt-16">
        {LIFE_CHAPTERS.map((ch, idx) => {
          const prose = proseForChapter(ch);
          const chapterArtworks = artworksForChapter(ch);
          const chapterPhotos = photosForChapter(ch);
          return (
            <LifeChapterBlock
              key={ch.id}
              chapter={ch}
              prose={prose}
              artworks={chapterArtworks}
              photos={chapterPhotos}
              first={idx === 0}
            />
          );
        })}
      </div>

      {/* Outro */}
      <footer className="text-center px-6 mt-24">
        <p className="font-body text-text-muted italic mb-6">
          "I admire many painters, from the cave painters of Lascaux to Diebenkorn, and I paint because it is a compulsion."
        </p>
        <Link
          to="/her-words/autobiography"
          className="inline-block glass-pill px-6 py-3 font-body text-sm text-text-primary hover:shadow-glass transition-shadow"
        >
          Read the full autobiography →
        </Link>
      </footer>
    </main>
  );
}

function LifeChapterBlock({
  chapter,
  prose,
  artworks: arts,
  photos: phs,
  first,
}: {
  chapter: LifeChapter;
  prose: string;
  artworks: Artwork[];
  photos: BookPhoto[];
  first?: boolean;
}): JSX.Element {
  const displayProse = useMemo(() => {
    if (!prose) return '';
    // Limit to ~3 paragraphs to keep the page readable
    const ps = prose.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean);
    return linkArtworkMentions(ps.slice(0, 3).join('\n\n'));
  }, [prose]);

  return (
    <section id={chapter.id} className="scroll-mt-20 mb-28">
      {/* Chapter title bar */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -200px 0px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-1 w-20 rounded-full mb-5" style={{ backgroundColor: chapter.accent }} />
        <p className="font-body text-xs text-text-muted uppercase tracking-widest mb-2">
          {chapter.years}
        </p>
        <h2 className="font-heading text-4xl md:text-6xl text-text-primary leading-tight">
          {chapter.title}
        </h2>
        <p className="font-leah mt-3 text-2xl md:text-3xl leading-tight" style={{ color: chapter.accent }}>
          {chapter.subtitle}
        </p>
      </motion.div>

      {/* Photos + prose side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
        {/* Photo column */}
        {phs.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {phs.slice(0, first ? 6 : 4).map((p) => (
              <img
                key={p.file}
                src={`/photos/${p.file}`}
                alt={`${chapter.title} · book page ${p.book_page}`}
                loading="lazy"
                className="w-full h-auto rounded-md shadow-soft"
              />
            ))}
          </motion.div>
        ) : (
          <div
            className="rounded-md h-40 opacity-40"
            style={{ backgroundColor: chapter.accent + '22' }}
            aria-hidden
          />
        )}

        {/* Prose column */}
        {displayProse ? (
          <motion.article
            className="font-heading text-[17px] leading-[1.85] text-text-primary prose-leah"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-5">{children}</p>,
                em: ({ children }) => <em className="italic text-text-muted">{children}</em>,
                a: ({ href, children }) =>
                  href && href.startsWith('/') ? (
                    <Link
                      to={href}
                      className="underline decoration-1 underline-offset-4"
                      style={{ color: chapter.accent, textDecorationColor: chapter.accent + '66' }}
                    >
                      {children}
                    </Link>
                  ) : <a href={href}>{children}</a>,
              }}
            >
              {displayProse}
            </ReactMarkdown>
          </motion.article>
        ) : (
          <p className="font-body text-text-muted italic">
            Paintings from this period speak for themselves.
          </p>
        )}
      </div>

      {/* Artworks from this era */}
      {arts.length > 0 && (
        <div className="mt-10">
          <p className="font-body text-text-muted uppercase tracking-widest text-xs mb-4">
            Paintings from this time
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {arts.slice(0, 10).map((a) => (
              <Link key={a.id} to={`/artwork/${a.id}`} className="group block">
                <div
                  className="aspect-square relative rounded-md overflow-hidden shadow-soft group-hover:shadow-glass transition-shadow"
                  style={{ backgroundColor: a.placeholderColor }}
                >
                  <img
                    src={a.thumbPath || a.imagePath || ''}
                    alt={a.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <p className="font-body text-xs text-text-primary truncate mt-2">
                  {a.display_title || a.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
