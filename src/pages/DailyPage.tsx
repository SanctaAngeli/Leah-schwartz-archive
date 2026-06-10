// Painting of the Day · the new front door.
// A single painting, chosen deterministically by date, shown with Leah's words if available.

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import artworksData from '../data/artworks.json';
import { getProseByChapter, cleanProse } from '../data/prose';
import { getAccent, getSeasonalAccent, seasonName } from '../data/chapterAccents';
import { linkArtworkMentions } from '../data/proseLinker';
import { usePageMeta } from '../hooks/usePageMeta';
import ReactMarkdown from 'react-markdown';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

// Only pick from artworks with a real image so the daily never shows a placeholder.
const withCleanImages = artworks.filter((a) => a.imagePath && !a.needs_crop);
const rotation: Artwork[] = withCleanImages.length > 0
  ? withCleanImages
  : artworks.filter((a) => a.imagePath);

/** Days since an arbitrary epoch · deterministic index into the rotation. */
function daysSinceEpoch(date: Date): number {
  const epoch = Date.UTC(2024, 0, 1);
  const now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((now - epoch) / 86_400_000);
}

function pickArtworkForDay(d: Date): Artwork {
  const idx = ((daysSinceEpoch(d) % rotation.length) + rotation.length) % rotation.length;
  return rotation[idx];
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

/** Mostly-capitals paragraphs are catalog captions from the scan, not prose. */
function isCaptionDump(p: string): boolean {
  const letters = p.replace(/[^a-zA-Z]/g, '');
  if (!letters) return true;
  const upper = letters.replace(/[^A-Z]/g, '');
  return upper.length / letters.length > 0.35;
}

function findProseMention(artwork: Artwork): string | null {
  if (!artwork.chapter) return null;
  const prose = getProseByChapter(artwork.chapter);
  if (!prose) return null;
  const body = cleanProse(prose.markdown);
  const title = artwork.title.toUpperCase();
  const paragraphs = body.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean);
  for (const p of paragraphs) {
    if (p.length > 40 && !isCaptionDump(p) && p.toUpperCase().includes(title)) return p;
  }
  return null;
}

export default function DailyPage(): JSX.Element {
  const date = new Date();
  const artwork = useMemo(() => pickArtworkForDay(date), []);
  const accent = getAccent(artwork.chapter);
  const seasonal = getSeasonalAccent(date);
  const season = seasonName(date);

  usePageMeta(
    'Today',
    `${artwork.display_title || artwork.title} · today's painting by Leah Schwartz.`
  );

  const mention = useMemo(() => findProseMention(artwork), [artwork]);

  return (
    <main className="min-h-screen">
      {/* Subtle color wash · chapter accent at top-center, seasonal accent at bottom-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            `radial-gradient(ellipse at 50% 0%, ${accent.soft} 0%, transparent 50%), ` +
            `radial-gradient(circle at 20% 100%, ${seasonal.soft} 0%, transparent 40%)`,
        }}
        aria-hidden
      />

      <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-16 text-center">
        {/* Date strip */}
        <motion.p
          className="font-body text-text-muted uppercase tracking-[0.3em] text-xs mb-2"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {formatDate(date)}
        </motion.p>
        <motion.h1
          className="font-heading text-2xl md:text-3xl text-text-primary leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          A painting from Leah
        </motion.h1>

        {/* The painting */}
        <motion.div
          key={artwork.id}
          className="mt-12 mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <Link to={`/artwork/${artwork.id}`} className="block group">
            <div
              className="relative mx-auto rounded-sm overflow-hidden transition-shadow duration-500"
              style={{
                maxWidth: 'min(80vw, 900px)',
                boxShadow: `0 30px 80px rgba(0,0,0,0.15), 0 0 0 1px ${accent.accent}22`,
              }}
            >
              <img
                src={artwork.imagePath || ''}
                alt={artwork.title}
                className="block w-full h-auto max-h-[70vh] object-contain bg-[#fafafa]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent group-hover:from-black/10 transition-colors duration-500 pointer-events-none" />
            </div>
          </Link>
        </motion.div>

        {/* Caption */}
        <motion.div
          className="mt-10 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-heading text-3xl md:text-4xl text-text-primary leading-tight">
            {artwork.display_title || artwork.title}
          </h2>
          <p className="font-body text-text-muted mt-2">
            {[
              artwork.year ? `${artwork.circa ? 'c. ' : ''}${artwork.year}` : null,
              artwork.medium,
              artwork.dimensions,
            ].filter(Boolean).join(' · ')}
          </p>
          <p className="font-leah mt-3 text-2xl" style={{ color: accent.accent }}>
            {artwork.chapter?.replace(/-/g, ' ')}
          </p>
        </motion.div>

        {/* Leah's words, if she wrote about it */}
        {mention && (
          <motion.section
            className="mt-16 max-w-2xl mx-auto text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-center font-body text-text-muted uppercase tracking-widest text-xs mb-4">
              In Leah's own words
            </p>
            <div className="font-heading text-[17px] md:text-[18px] leading-[1.85] text-text-primary">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-4">{children}</p>,
                  a: ({ href, children }) =>
                    href?.startsWith('/') ? (
                      <Link to={href} className="underline decoration-1 underline-offset-4" style={{ color: accent.accent }}>{children}</Link>
                    ) : <a href={href}>{children}</a>,
                }}
              >
                {linkArtworkMentions(mention.length > 700 ? mention.slice(0, 680).replace(/\s+\S*$/, '') + '…' : mention)}
              </ReactMarkdown>
            </div>
          </motion.section>
        )}

        {/* Quiet entry points */}
        <div className="mt-20 max-w-md mx-auto grid grid-cols-3 gap-2 text-center">
          <Link to="/themes" className="font-body text-xs text-text-muted uppercase tracking-widest py-3 hover:text-text-primary transition-colors">
            Browse all
          </Link>
          <Link to="/her-words" className="font-body text-xs text-text-muted uppercase tracking-widest py-3 hover:text-text-primary transition-colors">
            Leah's Story
          </Link>
          <Link to="/studio" className="font-body text-xs text-text-muted uppercase tracking-widest py-3 hover:text-text-primary transition-colors">
            The Studio
          </Link>
        </div>

        {/* Seasonal hint · unannounced, just present */}
        <p
          className="mt-12 font-leah text-2xl text-center"
          style={{ color: seasonal.accent + 'aa' }}
        >
          {season}
        </p>
      </div>
    </main>
  );
}
