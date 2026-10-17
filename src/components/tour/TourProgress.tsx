import { Link } from 'react-router-dom';
import { TOUR_CHAPTERS, TOUR_STOPS } from '../../data/tour';
import type { FlatStop } from '../../data/tour';

// The tour's chapters as a progress line. The current chapter is marked,
// and any chapter can be clicked to jump to its first stop.

interface Props {
  stop: FlatStop;
}

function TourProgress({ stop }: Props): JSX.Element {
  const pct = ((stop.index + 1) / TOUR_STOPS.length) * 100;

  return (
    <nav aria-label="Tour chapters" className="max-w-6xl mx-auto">
      <div className="h-1.5 rounded-full bg-[#EEE7DB] overflow-hidden" aria-hidden="true">
        <div className="h-full bg-[#8B7355] rounded-full transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <ol className="flex flex-wrap gap-x-4 gap-y-1 mt-2 font-body text-xs">
        {TOUR_CHAPTERS.map((c, i) => {
          const first = TOUR_STOPS.find((s) => s.chapterIndex === i);
          const current = i === stop.chapterIndex;
          return (
            <li key={c.id}>
              <Link
                to={`/tour/${first?.id ?? ''}`}
                aria-current={current ? 'step' : undefined}
                className={`hover:underline ${current ? 'text-text-primary font-semibold' : i < stop.chapterIndex ? 'text-text-secondary' : 'text-text-muted'}`}
              >
                {i + 1}. {c.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default TourProgress;
