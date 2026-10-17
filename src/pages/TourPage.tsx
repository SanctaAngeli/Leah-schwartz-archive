import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import TourProgress from '../components/tour/TourProgress';
import TourStopView from '../components/tour/TourStopView';
import TourMore from '../components/tour/TourMore';
import { TOUR_STOPS, TOUR_PROGRESS_KEY } from '../data/tour';
import { usePageMeta } from '../hooks/usePageMeta';

// The guided tour. One stop per screen, a big Next button that is always
// visible, Back, and an optional "more" area below each stop. The tour
// remembers where you stopped.

function readSaved(): string | null {
  try {
    return localStorage.getItem(TOUR_PROGRESS_KEY);
  } catch {
    return null;
  }
}

function TourPage(): JSX.Element {
  const { stopId } = useParams();
  const navigate = useNavigate();
  const index = stopId ? TOUR_STOPS.findIndex((s) => s.id === stopId) : 0;
  const stop = TOUR_STOPS[index];
  const prev = index > 0 ? TOUR_STOPS[index - 1] : null;
  const next = index >= 0 && index < TOUR_STOPS.length - 1 ? TOUR_STOPS[index + 1] : null;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [saved] = useState(readSaved);
  usePageMeta(stop ? `${stop.title} · Guided tour` : 'Guided tour', 'A guided tour of the life and work of Leah Schwartz (1920–2017), in her own words.');

  useEffect(() => {
    if (!stop) return;
    window.scrollTo({ top: 0 });
    // /tour itself shows the first stop; saving there would wipe the visitor's place.
    if (!stopId) return;
    try {
      localStorage.setItem(TOUR_PROGRESS_KEY, stop.id);
    } catch {
      // Private browsing: the tour just won't remember the place.
    }
  }, [stop, stopId]);

  const go = useCallback((id: string | undefined) => id && navigate(`/tour/${id}`), [navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (lightboxOpen || e.repeat || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      // Leave the arrows alone while a dialog (search, shortcuts) is open.
      if (document.querySelector('[role="dialog"]')) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'VIDEO') return;
      if (e.key === 'ArrowRight') go(next?.id);
      if (e.key === 'ArrowLeft') go(prev?.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, next, prev, lightboxOpen]);

  if (!stop) return <Navigate to="/tour" replace />;

  // Offer to carry on, unless they never got past the start or already finished.
  const lastId = TOUR_STOPS[TOUR_STOPS.length - 1].id;
  const resume = !stopId && saved && saved !== TOUR_STOPS[0].id && saved !== lastId ? TOUR_STOPS.find((s) => s.id === saved) : null;

  return (
    <main className="min-h-screen pt-24 md:pt-28 pb-40 px-6">
      <TourProgress stop={stop} />
      {resume && (
        <p className="max-w-6xl mx-auto mt-4 font-body text-sm">
          <Link to={`/tour/${resume.id}`} className="glass-pill inline-block px-4 py-2 text-text-primary hover:shadow-glass">
            Carry on from “{resume.title}” →
          </Link>
        </p>
      )}

      <motion.section
        key={stop.id}
        className="min-h-[calc(100vh-14rem)] flex flex-col justify-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        aria-live="polite"
      >
        <TourStopView stop={stop} />
        {stop.more.length > 0 && (
          <p className="text-center mt-10">
            <a href="#tour-more" className="inline-flex flex-col items-center font-body text-sm text-text-secondary hover:text-text-primary">
              {stop.moreLabel || 'More'}
              <span aria-hidden="true" className="text-xl mt-1">↓</span>
            </a>
          </p>
        )}
      </motion.section>

      <TourMore key={`more-${stop.id}`} items={stop.more} label={stop.moreLabel} onLightboxChange={setLightboxOpen} />

      {/* Always visible: Back, where you are, Next. Rendered into <body> so the
          page-change animation (a transform) can't unpin it from the screen. */}
      {createPortal(
      <div className="fixed bottom-0 inset-x-0 z-40 px-4 pb-4 pointer-events-none">
        {/* Right padding keeps Next clear of the settings button in the corner. */}
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 pr-14 pointer-events-auto">
          {prev ? (
            <Link to={`/tour/${prev.id}`} className="glass-pill px-6 py-4 font-body text-base text-text-primary hover:shadow-glass">
              ← Back
            </Link>
          ) : (
            <span />
          )}
          <span className="hidden sm:block glass-pill px-4 py-2 font-body text-sm text-text-secondary tabular-nums">
            {stop.index + 1} of {TOUR_STOPS.length}
          </span>
          {next ? (
            <Link
              to={`/tour/${next.id}`}
              className="rounded-full bg-[#8B7355] text-white font-body text-lg md:text-xl px-8 md:px-12 py-4 md:py-5 shadow-glass hover:bg-[#76614a] transition-colors"
            >
              Next →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>,
        document.body
      )}
    </main>
  );
}

export default TourPage;
