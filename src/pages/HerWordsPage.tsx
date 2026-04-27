import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import artworksData from '../data/artworks.json';
import photosData from '../data/photos.json';
import type { Artwork } from '../types';
import { PROSE_SECTIONS, cleanProse } from '../data/prose';
import { linkArtworkMentions } from '../data/proseLinker';
import { usePageMeta } from '../hooks/usePageMeta';

interface BookPhoto {
  file: string;
  pdf_page: number;
  book_page: number;
  size: [number, number];
  chroma: number;
  likely_photo: boolean;
}

const photos = photosData as BookPhoto[];

// Map a HerWordsPage section to which pdf_page range its photos come from
const PHOTO_RANGE_BY_SECTION: Record<string, [number, number]> = {
  'front':          [1, 15],
  'autobiography':  [16, 39],
  'old-stuff':      [40, 47],
  'abstract':       [48, 53],
  'social-comment': [54, 75],
  'on-the-road':    [76, 95],
  'landscape':      [96, 121],
  'street-scenes':  [122, 139],
  'portraits':      [140, 161],
  'still-life':     [162, 197],
  'interiors':      [198, 203],
  'flowers':        [204, 235],
  'travel':         [236, 297],
  'high-sierra':    [298, 301],
};

function photosForSection(sectionId: string): BookPhoto[] {
  const range = PHOTO_RANGE_BY_SECTION[sectionId];
  if (!range) return [];
  const [start, end] = range;
  return photos.filter((p) => p.pdf_page >= start && p.pdf_page <= end && p.likely_photo);
}

const artworks = artworksData as Artwork[];
const SECTIONS = PROSE_SECTIONS;

function HerWordsPage(): JSX.Element {
  const { sectionId } = useParams();
  const [activeId, setActiveId] = useState<string>(sectionId || 'autobiography');

  useEffect(() => {
    if (sectionId && SECTIONS.some((s) => s.id === sectionId)) {
      setActiveId(sectionId);
    }
  }, [sectionId]);

  const active = SECTIONS.find((s) => s.id === activeId) || SECTIONS[1];
  const cleanedMd = useMemo(
    () => linkArtworkMentions(cleanProse(active.markdown)),
    [active]
  );

  usePageMeta(
    `${active.label} · Leah's Story`,
    `${active.tagline}. Leah Schwartz's own words, from her book.`
  );

  const chapterArtworks = useMemo<Artwork[]>(() => {
    if (!active.chapter) return [];
    return artworks.filter((a) => a.chapter === active.chapter && a.imagePath);
  }, [active]);

  const sectionPhotos = useMemo(() => photosForSection(active.id), [active]);

  // Scroll to top on section change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeId]);

  return (
    <main className="min-h-screen pt-24 pb-32 px-6">
      {/* Hero */}
      <header className="max-w-3xl mx-auto text-center mb-12">
        <motion.p
          className="font-body text-text-muted uppercase tracking-widest text-xs mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Leah's Story
        </motion.p>
        <motion.h1
          className="font-heading text-5xl md:text-7xl text-text-primary leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          In her own words
        </motion.h1>
        <motion.p
          className="font-body text-text-secondary mt-6 text-lg max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Leah wrote her autobiography and a short essay for every chapter of her book. Read them here, section by section, as she arranged them.
        </motion.p>
      </header>

      {/* Section selector · horizontal pill nav */}
      <nav className="max-w-5xl mx-auto mb-14 overflow-x-auto">
        <ul className="flex gap-2 min-w-max pb-2 justify-center">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => setActiveId(s.id)}
                className={`
                  font-body text-sm px-4 py-2 rounded-full transition-all whitespace-nowrap
                  ${
                    s.id === activeId
                      ? 'bg-text-primary text-bg-gallery shadow-sm'
                      : 'bg-bg-glass text-text-secondary hover:bg-white/90 border border-bg-glass-border'
                  }
                `}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Section header */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="font-heading text-3xl md:text-4xl text-text-primary">
          {active.label}
        </h2>
        <p className="font-leah text-text-muted mt-2 text-3xl md:text-4xl leading-none">
          {active.tagline}
        </p>
      </div>

      {/* Photographs strip from the book, if any */}
      {sectionPhotos.length > 0 && (
        <section className="max-w-5xl mx-auto mb-12">
          <p className="text-center font-body text-text-muted uppercase tracking-widest text-xs mb-4">
            Photographs from the book
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
            {sectionPhotos.slice(0, 12).map((p) => (
              <img
                key={p.file}
                src={`/photos/${p.file}`}
                alt={`Photograph from book page ${p.book_page}`}
                loading="lazy"
                className="h-40 md:h-48 w-auto rounded-md shadow-soft snap-start flex-shrink-0"
              />
            ))}
          </div>
          {sectionPhotos.length > 12 && (
            <p className="text-center font-body text-xs text-text-muted mt-2">
              +{sectionPhotos.length - 12} more in the book
            </p>
          )}
        </section>
      )}

      {/* Prose */}
      <motion.article
        key={activeId}
        className="
          max-w-2xl mx-auto
          font-heading text-text-primary leading-[1.75] text-[18px]
          prose-leah
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="font-heading text-5xl md:text-6xl text-text-primary mb-8 mt-0 leading-tight">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="font-heading text-3xl md:text-4xl text-text-primary mt-16 mb-2 leading-tight">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-heading text-2xl text-text-primary mt-8 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="font-heading text-[18px] md:text-[19px] leading-[1.75] text-text-primary mb-6">
                {children}
              </p>
            ),
            em: ({ children }) => (
              <em className="italic text-text-muted">{children}</em>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-text-primary">{children}</strong>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-[#8B7355] pl-6 my-8 italic text-text-secondary">
                {children}
              </blockquote>
            ),
            hr: () => <hr className="my-12 border-[#E8E2D5]" />,
            a: ({ href, children }) => {
              if (href && href.startsWith('/')) {
                return (
                  <Link
                    to={href}
                    className="text-text-primary underline decoration-[#D5C6A8] decoration-1 underline-offset-4 hover:decoration-[#8B7355] hover:decoration-2 transition-colors"
                  >
                    {children}
                  </Link>
                );
              }
              return (
                <a href={href} className="text-text-primary underline decoration-[#D5C6A8] decoration-1 underline-offset-4">
                  {children}
                </a>
              );
            },
          }}
        >
          {cleanedMd}
        </ReactMarkdown>
      </motion.article>

      {/* Chapter companion · paintings from this theme */}
      {chapterArtworks.length > 0 && (
        <section className="max-w-6xl mx-auto mt-24 pt-12 border-t border-[#E8E2D5]">
          <div className="text-center mb-10">
            <p className="font-body text-text-muted uppercase tracking-widest text-xs mb-2">
              Companion works
            </p>
            <h3 className="font-heading text-3xl text-text-primary">
              Paintings from {active.label}
            </h3>
            <p className="font-body text-text-muted mt-2">
              {chapterArtworks.length} {chapterArtworks.length === 1 ? 'work' : 'works'} in this chapter
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {chapterArtworks.slice(0, 12).map((a) => (
              <Link
                key={a.id}
                to={`/artwork/${a.id}`}
                className="group block"
              >
                <div
                  className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-soft group-hover:shadow-glass transition-shadow"
                  style={{ backgroundColor: a.placeholderColor }}
                >
                  <img
                    src={a.thumbPath || a.imagePath || ''}
                    alt={a.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <p className="font-body text-sm text-text-primary mt-2 truncate">
                  {a.display_title || a.title}
                </p>
                {a.dimensions && (
                  <p className="font-body text-xs text-text-muted">
                    {a.dimensions}
                  </p>
                )}
              </Link>
            ))}
          </div>
          {chapterArtworks.length > 12 && (
            <div className="text-center mt-10">
              <Link
                to={`/themes/${active.chapter}`}
                className="inline-block glass-pill px-6 py-3 font-body text-sm text-text-primary hover:shadow-glass transition-shadow"
              >
                See all {chapterArtworks.length} works in {active.label} →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Next / previous section */}
      <nav className="max-w-3xl mx-auto mt-24 pt-8 border-t border-[#E8E2D5] flex justify-between">
        {(() => {
          const idx = SECTIONS.findIndex((s) => s.id === activeId);
          const prev = idx > 0 ? SECTIONS[idx - 1] : null;
          const next = idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;
          return (
            <>
              {prev ? (
                <button
                  onClick={() => setActiveId(prev.id)}
                  className="group text-left"
                >
                  <p className="font-body text-xs text-text-muted uppercase tracking-widest mb-1">
                    ← Previous
                  </p>
                  <p className="font-heading text-lg text-text-primary group-hover:text-[#8B7355] transition-colors">
                    {prev.label}
                  </p>
                </button>
              ) : <span />}
              {next ? (
                <button
                  onClick={() => setActiveId(next.id)}
                  className="group text-right"
                >
                  <p className="font-body text-xs text-text-muted uppercase tracking-widest mb-1">
                    Next →
                  </p>
                  <p className="font-heading text-lg text-text-primary group-hover:text-[#8B7355] transition-colors">
                    {next.label}
                  </p>
                </button>
              ) : <span />}
            </>
          );
        })()}
      </nav>
    </main>
  );
}

export default HerWordsPage;
