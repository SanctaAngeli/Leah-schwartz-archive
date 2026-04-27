// Full-screen Lightbox view for a single artwork.
// Dark gallery-wall background. Painting is the hero. Collapsible info panel on the right.

import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import ShareButton from '../ui/ShareButton';
import PostcardDialog from './PostcardDialog';
import { useFavorites } from '../../hooks/useFavorites';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import artworksData from '../../data/artworks.json';
import placesData from '../../data/places.json';
import peopleData from '../../data/people.json';
import { getProseByChapter, cleanProse } from '../../data/prose';
import { getAccent } from '../../data/chapterAccents';
import type { Artwork } from '../../types';

const artworks = artworksData as Artwork[];
const places = placesData as Array<{ id: string; name: string; artwork_ids?: string[] }>;
const people = peopleData as Array<{ id: string; name: string; display_name?: string; artwork_ids?: string[]; book_pages?: number[] }>;

/** Search chapter prose for a paragraph that mentions this artwork's title. */
function findProseMention(artwork: Artwork): { paragraph: string; chapterSlug: string; sectionLabel: string } | null {
  if (!artwork.chapter) return null;
  const prose = getProseByChapter(artwork.chapter);
  if (!prose) return null;
  const body = cleanProse(prose.markdown);
  const title = artwork.title.toUpperCase();
  const paragraphs = body.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean);
  for (const p of paragraphs) {
    if (p.length > 40 && p.toUpperCase().includes(title)) {
      return { paragraph: p, chapterSlug: prose.id, sectionLabel: prose.label };
    }
  }
  const words = artwork.title.split(/\W+/).filter((w) => w.length > 3);
  if (words.length >= 2) {
    const needle = (words[0] + ' ' + words[1]).toUpperCase();
    for (const p of paragraphs) {
      if (p.length > 40 && p.toUpperCase().includes(needle)) {
        return { paragraph: p, chapterSlug: prose.id, sectionLabel: prose.label };
      }
    }
  }
  return null;
}

interface ArtworkModalProps {
  artworkId?: string;
  onClose?: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 6;   // generous: 300 DPI scans are rich enough to see brush strokes

function ArtworkModal({ artworkId: propArtworkId, onClose }: ArtworkModalProps): JSX.Element | null {
  const navigate = useNavigate();
  const params = useParams();
  const modalRef = useFocusTrap<HTMLDivElement>({ enabled: true, returnFocusOnDeactivate: true });
  const { isFavorite, toggleFavorite } = useFavorites();

  const artworkId = propArtworkId || params.artworkId;
  const artwork = artworks.find((a) => a.id === artworkId);

  // Panel toggle (press `I` to hide chrome and just see the painting)
  const [panelOpen, setPanelOpen] = useState(true);
  const [postcardOpen, setPostcardOpen] = useState(false);

  // Zoom + pan state
  const [scale, setScale] = useState(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  const resetZoom = useCallback(() => {
    setScale(1); x.set(0); y.set(0);
  }, [x, y]);

  // Navigate by *chapter* order: the book's own sequence (most artworks are undated)
  const sortedArtworks = useMemo(() => {
    return [...artworks].sort((a, b) => (a.book_page || 9999) - (b.book_page || 9999));
  }, []);
  const currentIndex = sortedArtworks.findIndex((a) => a.id === artworkId);
  const prevArtwork = currentIndex > 0 ? sortedArtworks[currentIndex - 1] : null;
  const nextArtwork = currentIndex < sortedArtworks.length - 1 ? sortedArtworks[currentIndex + 1] : null;

  const proseMention = useMemo(() => artwork ? findProseMention(artwork) : null, [artwork]);

  // Related-works rails
  const chapterSiblings = useMemo(() => {
    if (!artwork?.chapter) return [];
    return artworks.filter((a) => a.chapter === artwork.chapter && a.id !== artwork.id && a.imagePath).slice(0, 8);
  }, [artwork]);
  const sameYear = useMemo(() => {
    if (!artwork?.year) return [];
    return artworks.filter((a) => a.year === artwork.year && a.id !== artwork.id && a.imagePath).slice(0, 8);
  }, [artwork]);
  const samePlace = useMemo(() => {
    if (!artwork) return [];
    // Find places whose book_pages include this artwork's book_page
    const myPlaces = places.filter((p) => artwork.book_page && (p.artwork_ids || []).includes(artwork.id));
    const related = new Set<string>();
    myPlaces.forEach((p) => (p.artwork_ids || []).forEach((id) => related.add(id)));
    return artworks.filter((a) => related.has(a.id) && a.id !== artwork.id && a.imagePath).slice(0, 8);
  }, [artwork]);
  const relatedPeople = useMemo(() => {
    if (!artwork?.book_page) return [];
    return people.filter((p) => p.book_pages?.includes(artwork.book_page!)).slice(0, 6);
  }, [artwork]);

  const accent = getAccent(artwork?.chapter);

  const handleClose = useCallback(() => {
    if (onClose) onClose();
    else navigate(-1);
  }, [navigate, onClose]);

  const navigateToArtwork = useCallback((a: Artwork | null) => {
    if (a) {
      resetZoom();
      navigate(`/artwork/${a.id}`, { replace: true });
    }
  }, [navigate, resetZoom]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Reset zoom when artwork changes
  useEffect(() => { resetZoom(); }, [artworkId, resetZoom]);

  // Keyboard: Esc close, arrows nav, I toggle info, F favorite, +/- zoom
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      switch (e.key) {
        case 'Escape': handleClose(); break;
        case 'ArrowLeft':  e.preventDefault(); navigateToArtwork(prevArtwork); break;
        case 'ArrowRight': e.preventDefault(); navigateToArtwork(nextArtwork); break;
        case 'i': case 'I': setPanelOpen((v) => !v); break;
        case 'f': case 'F': if (artworkId) toggleFavorite(artworkId); break;
        case '+': case '=': setScale((s) => Math.min(MAX_ZOOM, s + 0.5)); break;
        case '-': case '_': setScale((s) => { const n = Math.max(MIN_ZOOM, s - 0.5); if (n === 1) { x.set(0); y.set(0); } return n; }); break;
        case '0': resetZoom(); break;
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [handleClose, navigateToArtwork, prevArtwork, nextArtwork, artworkId, toggleFavorite, resetZoom, x, y]);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey && Math.abs(e.deltaY) < 30) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    setScale((s) => {
      const n = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, s + delta));
      if (n === 1) { x.set(0); y.set(0); }
      return n;
    });
  }, [x, y]);

  // Pan constraints
  const constraints = useMemo(() => {
    if (!imgWrapRef.current || scale <= 1) return { top: 0, bottom: 0, left: 0, right: 0 };
    const el = imgWrapRef.current;
    const extraW = (el.offsetWidth * (scale - 1)) / 2;
    const extraH = (el.offsetHeight * (scale - 1)) / 2;
    return { top: -extraH, bottom: extraH, left: -extraW, right: extraW };
  }, [scale]);

  if (!artwork) return null;

  const isFav = isFavorite(artworkId || '');

  return (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="artwork-title"
        tabIndex={-1}
        className="fixed inset-0 z-50 bg-[#0e0e10] text-white outline-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      >
        {/* Top chrome (close + share + fav + info toggle) */}
        <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 pr-2 text-[11px] font-body text-white/40 tracking-widest uppercase">
            <kbd className="px-1.5 py-0.5 border border-white/20 rounded">I</kbd> info
            <span className="mx-1">·</span>
            <kbd className="px-1.5 py-0.5 border border-white/20 rounded">←</kbd>
            <kbd className="px-1.5 py-0.5 border border-white/20 rounded">→</kbd>
            <span className="mx-1">·</span>
            <kbd className="px-1.5 py-0.5 border border-white/20 rounded">Esc</kbd>
          </div>
          <button
            onClick={() => setPanelOpen((v) => !v)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label={panelOpen ? 'Hide info' : 'Show info'}
            aria-pressed={panelOpen}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            onClick={() => setPostcardOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Send as postcard"
            title="Send as postcard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <ShareButton title={artwork.title} />
          <button
            onClick={() => artworkId && toggleFavorite(artworkId)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
              isFav ? 'bg-red-500/80 hover:bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg className="w-5 h-5" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Prev / Next */}
        {prevArtwork && (
          <button
            onClick={() => navigateToArtwork(prevArtwork)}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all"
            aria-label={`Previous: ${prevArtwork.title}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {nextArtwork && (
          <button
            onClick={() => navigateToArtwork(nextArtwork)}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/5 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all"
            aria-label={`Next: ${nextArtwork.title}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Main layout · painting + side panel */}
        <div className={`absolute inset-0 flex transition-[padding] duration-500 ease-out ${panelOpen ? 'md:pr-[420px]' : 'md:pr-0'}`}>
          {/* Painting stage */}
          <div className="flex-1 flex items-center justify-center p-6 md:p-16 overflow-hidden" onWheel={handleWheel}>
            <motion.div
              key={artwork.id}
              ref={imgWrapRef}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-auto h-auto max-w-full max-h-full cursor-grab active:cursor-grabbing"
              style={{
                boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px ${accent.accent}22`,
              }}
            >
              <motion.div
                drag={scale > 1}
                dragConstraints={constraints}
                dragElastic={0.05}
                style={{ x, y, scale }}
                transition={{ type: 'spring', stiffness: 250, damping: 30 }}
                onDoubleClick={() => setScale((s) => s === 1 ? 2 : 1)}
              >
                {artwork.imagePath ? (
                  <img
                    src={artwork.imagePath}
                    alt={artwork.title}
                    className="block max-w-[88vw] md:max-w-[78vw] max-h-[80vh] w-auto h-auto select-none"
                    draggable={false}
                  />
                ) : (
                  <div
                    className="aspect-[4/3] w-[60vw] max-h-[80vh]"
                    style={{ backgroundColor: artwork.placeholderColor }}
                  />
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Zoom controls (bottom-left) */}
          <div className="absolute bottom-5 left-5 z-10 flex items-center gap-1 bg-white/10 rounded-full px-2 py-1.5 backdrop-blur-md">
            <button
              onClick={() => setScale((s) => { const n = Math.max(MIN_ZOOM, s - 0.5); if (n === 1) { x.set(0); y.set(0); } return n; })}
              className="w-7 h-7 rounded-full hover:bg-white/10 text-white/80 text-lg leading-none flex items-center justify-center"
              aria-label="Zoom out"
              disabled={scale <= MIN_ZOOM}
            >−</button>
            <button
              onClick={resetZoom}
              className="px-3 text-[11px] font-mono text-white/70 tabular-nums hover:text-white"
              aria-label="Reset zoom"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={() => setScale((s) => Math.min(MAX_ZOOM, s + 0.5))}
              className="w-7 h-7 rounded-full hover:bg-white/10 text-white/80 text-lg leading-none flex items-center justify-center"
              aria-label="Zoom in"
              disabled={scale >= MAX_ZOOM}
            >+</button>
          </div>

          {/* Caption strip (bottom-center, always visible) */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 text-center px-6 pointer-events-none max-w-[min(90%,560px)]">
            <h1 id="artwork-title" className="font-heading text-white text-xl md:text-2xl leading-tight drop-shadow-md">
              {artwork.display_title || artwork.title}
            </h1>
            <p className="font-body text-white/70 text-xs md:text-sm mt-1 tracking-wide">
              {[
                artwork.year ? `${artwork.circa ? 'c. ' : ''}${artwork.year}` : null,
                artwork.medium,
                artwork.dimensions,
              ].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>

        {/* Info panel */}
        <AnimatePresence>
          {panelOpen && (
            <motion.aside
              initial={{ x: 420, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 420, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 250, damping: 30 }}
              className="absolute top-0 right-0 bottom-0 w-full md:w-[420px] z-10 bg-[#16161a] text-white/90 overflow-y-auto p-6 pt-20 pb-12 border-l border-white/5"
            >
              <p className="font-body text-[11px] tracking-widest uppercase text-white/40 mb-2">
                {artwork.chapter?.replace(/-/g, ' ')}
                {artwork.region && <> · {artwork.region.replace(/-/g, ' ')}</>}
              </p>
              <h2 className="font-heading text-3xl leading-tight text-white">
                {artwork.display_title || artwork.title}
              </h2>
              <p className="font-heading italic text-white/60 mt-1" style={{ color: accent.accent }}>
                {artwork.year ? `${artwork.circa ? 'c. ' : ''}${artwork.year}` : 'Undated'}
              </p>

              <dl className="mt-8 grid grid-cols-1 gap-4 font-body text-sm">
                {artwork.medium && (
                  <div>
                    <dt className="text-white/40 text-[11px] uppercase tracking-widest mb-1">Medium</dt>
                    <dd>{artwork.medium}</dd>
                  </div>
                )}
                {artwork.dimensions && (
                  <div>
                    <dt className="text-white/40 text-[11px] uppercase tracking-widest mb-1">Dimensions</dt>
                    <dd>{artwork.dimensions}</dd>
                  </div>
                )}
                {artwork.collection && (
                  <div>
                    <dt className="text-white/40 text-[11px] uppercase tracking-widest mb-1">Collection</dt>
                    <dd>{artwork.collection}</dd>
                  </div>
                )}
                {artwork.book_page && (
                  <div>
                    <dt className="text-white/40 text-[11px] uppercase tracking-widest mb-1">In Leah's book</dt>
                    <dd>Page {artwork.book_page}</dd>
                  </div>
                )}
                {artwork.chapter && (
                  <div>
                    <dt className="text-white/40 text-[11px] uppercase tracking-widest mb-1">Chapter</dt>
                    <dd>
                      <button
                        onClick={() => { handleClose(); setTimeout(() => navigate(`/themes/${artwork.chapter}`), 60); }}
                        className="underline decoration-white/30 underline-offset-4 hover:decoration-white"
                      >
                        {artwork.chapter.replace(/-/g, ' ')}
                      </button>
                    </dd>
                  </div>
                )}
              </dl>

              {/* Leah's voice */}
              {proseMention && (
                <section className="mt-10 pt-6 border-t border-white/10">
                  <p className="text-white/40 text-[11px] uppercase tracking-widest mb-3">In Leah's own words</p>
                  <blockquote className="border-l-2 pl-4 font-heading italic text-[15px] leading-relaxed text-white/85" style={{ borderColor: accent.accent }}>
                    "{proseMention.paragraph.length > 360
                      ? proseMention.paragraph.slice(0, 340).replace(/\s+\S*$/, '') + '…'
                      : proseMention.paragraph}"
                  </blockquote>
                  <button
                    onClick={() => { handleClose(); setTimeout(() => navigate(`/her-words/${proseMention.chapterSlug}`), 60); }}
                    className="mt-3 text-xs font-body text-white/60 hover:text-white transition-colors"
                  >
                    Continue reading {proseMention.sectionLabel} →
                  </button>
                </section>
              )}

              {/* Related rails */}
              <RelatedRail title={`More in ${artwork.chapter?.replace(/-/g, ' ') || 'chapter'}`} items={chapterSiblings} onClose={handleClose} onNavigate={navigate} />
              <RelatedRail title={`Same year (${artwork.year})`} items={sameYear} onClose={handleClose} onNavigate={navigate} />
              <RelatedRail title="Same page · place" items={samePlace} onClose={handleClose} onNavigate={navigate} />
              {relatedPeople.length > 0 && (
                <section className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-white/40 text-[11px] uppercase tracking-widest mb-3">People on this page</p>
                  <div className="flex flex-wrap gap-2">
                    {relatedPeople.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { handleClose(); setTimeout(() => navigate(`/people/${p.id}`), 60); }}
                        className="text-xs font-body px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors"
                      >
                        {p.display_name || p.name}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <p className="mt-12 text-[11px] font-body text-white/30 tracking-widest uppercase">
                Press I to hide · F to favourite · +/− zoom
              </p>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Postcard dialog · opens from toolbar envelope button */}
        <PostcardDialog
          artwork={artwork}
          open={postcardOpen}
          onClose={() => setPostcardOpen(false)}
        />
      </motion.div>
    </AnimatePresence>
  );
}

function RelatedRail({
  title, items, onClose, onNavigate,
}: {
  title: string;
  items: Artwork[];
  onClose: () => void;
  onNavigate: (path: string) => void;
}): JSX.Element | null {
  if (!items || items.length === 0) return null;
  return (
    <section className="mt-8 pt-6 border-t border-white/10">
      <p className="text-white/40 text-[11px] uppercase tracking-widest mb-3">{title}</p>
      <div className="grid grid-cols-4 gap-2">
        {items.slice(0, 8).map((a) => (
          <button
            key={a.id}
            onClick={() => { onClose(); setTimeout(() => onNavigate(`/artwork/${a.id}`), 60); }}
            className="group aspect-square rounded-md overflow-hidden relative"
            style={{ backgroundColor: a.placeholderColor }}
            aria-label={a.title}
          >
            {a.imagePath && (
              <img
                src={a.thumbPath || a.imagePath}
                alt={a.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

export default ArtworkModal;
