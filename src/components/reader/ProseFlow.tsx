import { Fragment, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import artworksData from '../../data/artworks.json';
import { buildFlow, type FlowBlock, type FlowPhoto } from './flowBuilder';
import type { Artwork } from '../../types';

const artworks = artworksData as Artwork[];
const artworkBySlug = new Map(artworks.map((a) => [a.id, a]));

function titleCaseCaption(caps: string): string {
  return caps.charAt(0) + caps.slice(1).toLowerCase();
}

/** A photograph from the book, placed where she is in the story. */
function PhotoFigure({ photo, caption }: { photo: FlowPhoto; caption: string | null }): JSX.Element {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="my-14 -mx-2 md:-mx-10 clear-both"
    >
      <img
        src={`/photos/${photo.file}`}
        alt={caption ? titleCaseCaption(caption) : `Photograph from book page ${photo.book_page}`}
        loading="lazy"
        className="w-full h-auto rounded-md shadow-[0_10px_34px_rgba(0,0,0,0.12)]"
      />
      <figcaption className="font-body text-[11px] text-text-muted text-center mt-3 tracking-[0.18em] uppercase">
        {caption || 'from the book'}
        {photo.book_page > 0 && <span className="opacity-60"> · page {photo.book_page}</span>}
      </figcaption>
    </motion.figure>
  );
}

/** A painting, given a full moment of its own - the way the book does it. */
function PaintingMoment({ slug, caption }: { slug: string; caption: string | null }): JSX.Element | null {
  const art = artworkBySlug.get(slug);
  const src = art?.imagePath || art?.thumbPath;
  if (!art || !src) return null;
  const meta = [
    art.year ? `${art.circa ? 'c. ' : ''}${art.year}` : null,
    art.medium,
    art.dimensions,
  ].filter(Boolean).join(' · ');
  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="my-16 clear-both text-center"
    >
      <Link to={`/artwork/${art.id}`} className="group inline-block focus:outline-none">
        <img
          src={src}
          alt={art.display_title || art.title}
          loading="lazy"
          className="mx-auto max-h-[68vh] w-auto max-w-full rounded-sm
            shadow-[0_18px_60px_rgba(74,62,40,0.22)]
            transition-transform duration-700 group-hover:scale-[1.012]"
        />
        <figcaption className="mt-4">
          <span className="font-heading italic text-text-primary text-lg group-hover:text-[#8B7355] transition-colors">
            {art.display_title || art.title}
          </span>
          {meta && (
            <span className="block font-body text-xs text-text-muted mt-1 tracking-wide">{meta}</span>
          )}
          {caption && (
            <span className="block font-heading italic text-text-secondary text-[15px] mt-2 max-w-md mx-auto leading-relaxed">
              {caption}
            </span>
          )}
        </figcaption>
      </Link>
    </motion.figure>
  );
}

interface ProseFlowProps {
  /** Markdown body, already artwork-linked, page markers intact. */
  body: string;
  photos: FlowPhoto[];
  /** Same-chapter works used to break up long text runs. */
  fillSlugs?: string[];
  /** Accent for interior headings (travel regions). */
  accent?: string;
}

function ProseFlow({ body, photos, fillSlugs = [], accent = '#8B7355' }: ProseFlowProps): JSX.Element {
  const { blocks, paintingSlugs } = useMemo(
    () => buildFlow(body, photos, fillSlugs),
    [body, photos, fillSlugs]
  );

  const markdownComponents = useMemo(
    () => ({
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h2
          className="font-body text-[13px] tracking-[0.3em] uppercase mt-14 mb-6 text-center clear-both"
          style={{ color: accent }}
        >
          {children}
        </h2>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h3
          className="font-body text-[13px] tracking-[0.3em] uppercase mt-14 mb-6 text-center clear-both"
          style={{ color: accent }}
        >
          {children}
        </h3>
      ),
      p: ({ children }: { children?: React.ReactNode }) => (
        <p className="font-heading text-[18px] md:text-[19px] leading-[1.78] text-text-primary mb-6">
          {children}
        </p>
      ),
      em: ({ children }: { children?: React.ReactNode }) => (
        <em className="italic text-text-secondary">{children}</em>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="border-l-2 pl-6 my-8 italic text-text-secondary clear-both" style={{ borderColor: accent }}>
          {children}
        </blockquote>
      ),
      a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
        if (href && href.startsWith('/artwork/')) {
          const hasFirstMarker = href.endsWith('#first');
          const cleanHref = hasFirstMarker ? href.replace(/#first$/, '') : href;
          const slug = cleanHref.replace('/artwork/', '');
          const art = artworkBySlug.get(slug);
          const thumb = art?.thumbPath || art?.imagePath;
          // First mention gets a margin thumbnail - unless the painting
          // already has its own full moment in this section.
          const showThumb = hasFirstMarker && thumb && !paintingSlugs.has(slug);
          return (
            <>
              {showThumb && (
                <Link
                  to={cleanHref}
                  aria-label={`Open ${art?.display_title || art?.title || 'artwork'}`}
                  className="float-right ml-6 mb-3 w-[130px] md:w-[150px] max-w-[40%] block group/thumb"
                >
                  <img
                    src={thumb}
                    alt={art?.display_title || art?.title || ''}
                    loading="lazy"
                    className="w-full h-auto rounded-sm shadow-[0_4px_18px_rgba(0,0,0,0.10)]
                      group-hover/thumb:shadow-[0_8px_28px_rgba(0,0,0,0.18)] transition-shadow duration-300"
                  />
                  <span className="block font-body text-[10px] text-text-muted tracking-[0.15em] uppercase text-center mt-2 not-italic">
                    {art?.display_title || art?.title}
                  </span>
                </Link>
              )}
              <Link
                to={cleanHref}
                className="text-text-primary underline decoration-[#D5C6A8] decoration-1 underline-offset-4
                  hover:decoration-[#8B7355] hover:decoration-2 transition-colors"
              >
                {children}
              </Link>
            </>
          );
        }
        if (href && href.startsWith('/')) {
          return (
            <Link to={href} className="text-text-primary underline decoration-[#D5C6A8] decoration-1 underline-offset-4">
              {children}
            </Link>
          );
        }
        return <a href={href} className="underline decoration-1 underline-offset-4">{children}</a>;
      },
    }),
    [accent, paintingSlugs]
  );

  return (
    <div className="prose-leah">
      {blocks.map((block: FlowBlock, i: number) => (
        <Fragment key={i}>
          {block.type === 'prose' && (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {block.md}
            </ReactMarkdown>
          )}
          {block.type === 'photo' && <PhotoFigure photo={block.photo} caption={block.caption} />}
          {block.type === 'painting' && <PaintingMoment slug={block.slug} caption={block.caption} />}
        </Fragment>
      ))}
    </div>
  );
}

export default ProseFlow;
