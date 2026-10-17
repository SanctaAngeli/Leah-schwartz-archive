import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { resolveItem } from '../../data/tour';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import type { ResolvedItem, TourItemRef } from '../../data/tour';

// "Dig deeper" under a tour stop: more of the work from this part of her
// life. Clicking a picture opens it large right here, so the visitor never
// loses their place in the tour.

interface Props {
  items: TourItemRef[];
  label?: string;
  onLightboxChange: (open: boolean) => void;
}

function TourMore({ items, label, onLightboxChange }: Props): JSX.Element | null {
  const resolved = useMemo(() => {
    const seen = new Set<string>();
    return items
      .map(resolveItem)
      .filter((r): r is ResolvedItem => Boolean(r) && !seen.has(r!.key) && Boolean(seen.add(r!.key)));
  }, [items]);
  const [open, setOpen] = useState<number | null>(null);
  // Keeps keyboard focus inside the large view, and returns it to the thumbnail on close.
  const dialogRef = useFocusTrap<HTMLDivElement>({ enabled: open !== null });

  useEffect(() => onLightboxChange(open !== null), [open, onLightboxChange]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i === null ? i : Math.min(i + 1, resolved.length - 1)));
      if (e.key === 'ArrowLeft') setOpen((i) => (i === null ? i : Math.max(i - 1, 0)));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, resolved.length]);

  if (resolved.length === 0) return null;
  const current = open !== null ? resolved[open] : null;

  return (
    <section id="tour-more" aria-label="More from this part of the tour" className="max-w-6xl mx-auto pt-16 scroll-mt-28">
      <h2 className="font-heading text-2xl md:text-3xl text-text-primary">{label || 'More'}</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-7 mt-6">
        {resolved.map((r, i) => (
          <li key={r.key}>
            <button type="button" onClick={() => setOpen(i)} aria-label={`${r.label}, open large`} className="group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7355]/50 rounded-lg">
              <div className="aspect-square bg-white/60 rounded-lg overflow-hidden flex items-center justify-center">
                <img src={r.thumb} alt="" loading="lazy" className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.04]" />
              </div>
              {r.title && <span className="block mt-2 font-heading text-base text-text-primary leading-snug">{r.title}</span>}
            </button>
          </li>
        ))}
      </ul>

      {current && createPortal(
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={current.label}
          className="fixed inset-0 z-[70] bg-black/85 flex flex-col"
          onClick={() => setOpen(null)}
        >
          <div className="flex justify-between items-center p-4 text-white font-body text-sm" onClick={(e) => e.stopPropagation()}>
            <span>{open! + 1} of {resolved.length}</span>
            <button type="button" onClick={() => setOpen(null)} className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25">
              Close
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center px-4 min-h-0" onClick={(e) => e.stopPropagation()}>
            <img src={current.full} alt={current.label} className="max-w-full max-h-full object-contain rounded" />
          </div>
          <div className="flex items-center justify-between gap-4 p-4 text-white font-body" onClick={(e) => e.stopPropagation()}>
            <button type="button" disabled={open === 0} onClick={() => setOpen(open! - 1)} className="px-5 py-3 rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-30">
              ← Previous
            </button>
            <div className="text-center">
              {current.title && <p className="font-heading text-lg">{current.title}</p>}
              {current.href && (
                <Link to={current.href} target="_blank" className="text-sm text-white/70 underline">
                  Open in the archive (new tab)
                </Link>
              )}
            </div>
            <button type="button" disabled={open === resolved.length - 1} onClick={() => setOpen(open! + 1)} className="px-5 py-3 rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-30">
              Next picture →
            </button>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

export default TourMore;
