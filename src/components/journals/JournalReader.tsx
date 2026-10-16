import { useCallback, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { Journal } from '../../data/journals';

// One open journal: the scanned page on the left, its transcription on the
// right (stacked on phones). Arrow keys, swipes and the buttons turn pages;
// the page number lives in the URL (?page=3) so a page can be linked to.

interface Props {
  journal: Journal;
}

function JournalReader({ journal }: Props): JSX.Element {
  const [params, setParams] = useSearchParams();
  const total = journal.pages.length;
  const requested = Number(params.get('page')) || 1;
  const index = Math.min(Math.max(requested, 1), total) - 1;
  const page = journal.pages[index];
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => {
      const next = index + delta;
      if (next < 0 || next >= total) return;
      setParams({ page: String(next + 1) }, { replace: true });
    },
    [index, total, setParams]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // Warm the next page so turning feels instant.
  useEffect(() => {
    const next = journal.pages[index + 1];
    if (next) new Image().src = next.image;
  }, [journal, index]);

  const navButton =
    'glass-pill w-11 h-11 flex items-center justify-center text-text-secondary ' +
    'hover:text-text-primary disabled:opacity-30 transition-colors';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-10 items-start">
      <div>
        <div
          className="relative flex items-center justify-center min-h-[50vh] lg:h-[75vh]"
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <AnimatePresence mode="wait">
            <motion.a
              key={page.image}
              href={page.image}
              target="_blank"
              rel="noreferrer"
              className="block max-h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <img
                src={page.image}
                width={page.width}
                height={page.height}
                alt={`${journal.title} journal, scan ${index + 1} of ${total}`}
                className="max-h-[75vh] w-auto max-w-full h-auto rounded-lg shadow-glass"
              />
            </motion.a>
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-center gap-6 mt-6">
          <button type="button" className={navButton} onClick={() => go(-1)} disabled={index === 0} aria-label="Previous page">
            ←
          </button>
          <span className="font-body text-sm text-text-muted tabular-nums" aria-live="polite">
            {index + 1} / {total}
          </span>
          <button type="button" className={navButton} onClick={() => go(1)} disabled={index === total - 1} aria-label="Next page">
            →
          </button>
        </div>
      </div>

      <div className="lg:pt-6">
        <Link to="/journals" className="font-body text-sm text-text-muted hover:text-text-primary transition-colors">
          ← All journals
        </Link>
        <h1 className="font-heading text-4xl md:text-5xl text-text-primary mt-4">{journal.title}</h1>
        {journal.date && <p className="font-body text-sm text-text-muted tracking-wider mt-2">{journal.date}</p>}
        <div className="mt-8 border-l-2 border-[#E2DBC9] pl-6 min-h-[8rem]">
          {page.transcription.map((t, i) => (
            <p
              key={`${page.image}-${i}`}
              className="font-heading text-lg md:text-xl leading-relaxed text-text-primary whitespace-pre-line mb-6"
            >
              {t.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JournalReader;
