import { useEffect, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Link, Navigate, useParams } from 'react-router-dom';
import artworksData from '../data/artworks.json';
import photosData from '../data/photos.json';
import type { Artwork } from '../types';
import { cleanProse } from '../data/prose';
import { linkArtworkMentions } from '../data/proseLinker';
import {
  READER_SECTIONS,
  READER_REDIRECTS,
  readerSectionById,
  displayLabel,
  type ReaderSection,
} from '../data/readerSections';
import ProseFlow from '../components/reader/ProseFlow';
import type { FlowPhoto } from '../components/reader/flowBuilder';
import { usePageMeta } from '../hooks/usePageMeta';

interface BookPhoto extends FlowPhoto {
  size: [number, number];
  chroma: number;
  likely_photo: boolean;
}

const photos = photosData as BookPhoto[];
const artworks = artworksData as Artwork[];

// Scanned TEXT pages the classifier mistook for photographs. p006_01 is her
// handwritten title-page signature - used as the reader's masthead instead.
const NOT_PHOTOS = new Set([
  'p001_01.jpg', 'p006_01.jpg', 'p007_01.jpg', 'p014_01.jpg', 'p015_01.jpg',
]);

function photosFor(section: ReaderSection): FlowPhoto[] {
  if (!section.pdfRange) return [];
  const [start, end] = section.pdfRange;
  return photos.filter(
    (p) =>
      p.likely_photo &&
      !NOT_PHOTOS.has(p.file) &&
      p.pdf_page >= start &&
      p.pdf_page <= end
  );
}

/** Add `#first` to the first occurrence of each artwork link so the renderer
 *  shows a margin thumbnail beside only the first mention of any piece. */
function markFirstArtworkLinks(md: string): string {
  const seen = new Set<string>();
  return md.replace(/\[([^\]]+)\]\(\/artwork\/([^)#]+)\)/g, (_, text, slug) => {
    if (seen.has(slug)) return `[${text}](/artwork/${slug})`;
    seen.add(slug);
    return `[${text}](/artwork/${slug}#first)`;
  });
}

const PART_LABEL: Record<ReaderSection['part'], string> = {
  introduction: 'Her opening page',
  autobiography: 'The autobiography',
  chapters: 'The chapter essays',
};

// ── Table of contents ──────────────────────────────────────────────────────

function TableOfContents(): JSX.Element {
  usePageMeta(
    'In Her Own Words',
    "Leah Schwartz's autobiography and chapter essays, exactly as she wrote them - the table of contents."
  );
  const parts: ReaderSection['part'][] = ['introduction', 'autobiography', 'chapters'];
  const first = READER_SECTIONS[0];

  return (
    <main className="min-h-screen pt-28 pb-10 px-6">
      <header className="max-w-2xl mx-auto text-center mb-14">
        <p className="font-body text-text-muted uppercase tracking-[0.3em] text-xs mb-4">
          Her story
        </p>
        {/* Her actual hand · the book's title page signature */}
        <img
          src="/photos/p006_01.jpg"
          alt=""
          aria-hidden="true"
          className="mx-auto w-[min(320px,70%)] h-auto opacity-80 mix-blend-multiply mb-2"
        />
        <h1 className="font-heading text-[clamp(36px,6vw,60px)] text-text-primary leading-tight">
          In her own words
        </h1>
        <p className="font-leah text-text-muted mt-3 text-3xl leading-none">
          direct, funny, unsparing
        </p>
        <p className="font-body text-text-secondary mt-6 leading-relaxed">
          She wrote it all down - the immigrant parents, the seven schools, art school
          on five dollars a week, the remarkable Herman, the accidental watercolors.
          Read it the way she arranged it.
        </p>
        <Link
          to={`/her-words/${first.id}`}
          className="inline-block mt-8 glass-pill px-6 py-3 font-body text-sm
            text-text-primary hover:shadow-glass transition-shadow"
        >
          Start reading →
        </Link>
      </header>

      <div className="max-w-2xl mx-auto">
        {parts.map((part) => (
          <section key={part} className="mb-12">
            <h2 className="font-body text-text-muted text-[11px] tracking-[0.3em] uppercase mb-4 text-center">
              {PART_LABEL[part]}
            </h2>
            <ol className="border-t border-[#E2DBC9]">
              {READER_SECTIONS.filter((s) => s.part === part).map((s) => (
                <li key={s.id} className="border-b border-[#E2DBC9]">
                  <Link
                    to={`/her-words/${s.id}`}
                    className="group flex items-baseline justify-between gap-4 py-4 px-1
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7355]/40 rounded"
                  >
                    <span className="min-w-0">
                      <span className="font-heading text-xl md:text-2xl text-text-primary
                        group-hover:text-[#8B7355] transition-colors duration-300">
                        {displayLabel(s)}
                      </span>
                      {s.tagline && (
                        <span className="block font-leah text-text-muted text-xl leading-tight mt-0.5">
                          {s.tagline}
                        </span>
                      )}
                    </span>
                    <span className="font-body text-[11px] text-text-muted whitespace-nowrap tracking-wider uppercase">
                      {s.minutes} min
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </main>
  );
}

// ── A single section · one sitting's worth of her voice ───────────────────

function SectionReader({ section }: { section: ReaderSection }): JSX.Element {
  usePageMeta(
    `${displayLabel(section)} · In Her Own Words`,
    `${section.tagline || displayLabel(section)} - Leah Schwartz's own words, from her book.`
  );

  // Reading progress hairline, pinned under the nav.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [section.id]);

  const body = useMemo(
    () => markFirstArtworkLinks(linkArtworkMentions(cleanProse(section.body))),
    [section]
  );
  const sectionPhotos = useMemo(() => photosFor(section), [section]);
  const fillSlugs = useMemo(() => {
    // Chapter essays draw on their chapter's works; autobiography sections
    // draw on the works printed on those very pages of the book.
    if (section.chapter) {
      return artworks
        .filter((a) => a.chapter === section.chapter && (a.imagePath || a.thumbPath))
        .sort((a, b) => (a.book_page || 9999) - (b.book_page || 9999))
        .map((a) => a.id);
    }
    if (!section.pdfRange) return [];
    const [start, end] = section.pdfRange;
    return artworks
      .filter(
        (a) =>
          a.pdf_page != null &&
          a.pdf_page >= start &&
          a.pdf_page <= end &&
          (a.imagePath || a.thumbPath)
      )
      .sort((a, b) => (a.pdf_page || 9999) - (b.pdf_page || 9999))
      .map((a) => a.id);
  }, [section]);

  const idx = READER_SECTIONS.findIndex((s) => s.id === section.id);
  const prev = idx > 0 ? READER_SECTIONS[idx - 1] : null;
  const next = idx < READER_SECTIONS.length - 1 ? READER_SECTIONS[idx + 1] : null;

  return (
    <main className="min-h-screen pt-24 pb-10 px-6">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-[#8B7355]"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />

      {/* Section header */}
      <header className="max-w-2xl mx-auto text-center mb-12">
        <p className="font-body text-text-muted uppercase tracking-[0.3em] text-[11px] mb-4">
          <Link to="/her-words" className="hover:text-text-primary transition-colors">
            In her own words
          </Link>
          <span className="opacity-50"> · {section.minutes} min</span>
        </p>
        <h1 className="font-heading text-[clamp(30px,5vw,48px)] text-text-primary leading-tight">
          {displayLabel(section)}
        </h1>
        {section.tagline && (
          <p className="font-leah text-text-muted mt-2 text-3xl leading-none">
            {section.tagline}
          </p>
        )}
      </header>

      {/* The prose, breathing with the book's own pictures */}
      <motion.article
        key={section.id}
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ProseFlow body={body} photos={sectionPhotos} fillSlugs={fillSlugs} />
      </motion.article>

      {/* Chapter rooms carry the rest of the paintings */}
      {section.chapter && (
        <div className="max-w-2xl mx-auto text-center mt-14">
          <Link
            to={`/themes/${section.chapter}`}
            className="inline-block glass-pill px-6 py-3 font-body text-sm text-text-primary
              hover:shadow-glass transition-shadow"
          >
            All paintings from {displayLabel(section)} →
          </Link>
        </div>
      )}

      {/* Prev / next doors */}
      <nav
        aria-label="Sections"
        className="max-w-2xl mx-auto mt-16 pt-8 border-t border-[#E2DBC9]
          grid grid-cols-2 gap-6"
      >
        <div className="text-left">
          {prev && (
            <Link to={`/her-words/${prev.id}`} className="group inline-block">
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-text-muted">
                ← Previous
              </span>
              <span className="block font-heading text-lg text-text-primary group-hover:text-[#8B7355] transition-colors mt-1">
                {displayLabel(prev)}
              </span>
            </Link>
          )}
        </div>
        <div className="text-right">
          {next ? (
            <Link to={`/her-words/${next.id}`} className="group inline-block">
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-text-muted">
                Next →
              </span>
              <span className="block font-heading text-lg text-text-primary group-hover:text-[#8B7355] transition-colors mt-1">
                {displayLabel(next)}
              </span>
            </Link>
          ) : (
            <Link to="/at-her-age" className="group inline-block">
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-text-muted">
                Continue the walk →
              </span>
              <span className="block font-heading text-lg text-text-primary group-hover:text-[#8B7355] transition-colors mt-1">
                At Her Age
              </span>
            </Link>
          )}
        </div>
      </nav>
    </main>
  );
}

function HerWordsPage(): JSX.Element {
  const { sectionId } = useParams();

  if (!sectionId) return <TableOfContents />;

  const redirect = READER_REDIRECTS[sectionId];
  if (redirect) return <Navigate to={`/her-words/${redirect}`} replace />;

  const section = readerSectionById(sectionId);
  if (!section) return <Navigate to="/her-words" replace />;

  return <SectionReader section={section} />;
}

export default HerWordsPage;
