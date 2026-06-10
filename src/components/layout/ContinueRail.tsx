import { Link, useLocation } from 'react-router-dom';
import { nextStop } from '../../data/wings';

// The museum's walking route. Every room ends with a door to the next one,
// so a visitor who only ever presses "continue" sees the whole site in order.
// Fullscreen rooms (canvas, walk) get a small floating pill instead of a
// foot rail; the lobby and the artwork lightbox get nothing.

const FULLSCREEN_ROUTES = ['/canvas', '/walk'];

function ContinueRail(): JSX.Element | null {
  const { pathname } = useLocation();
  if (pathname.startsWith('/artwork/')) return null;
  // Reader sections carry their own prev/next momentum; the walk resumes
  // from the final section's "continue" door instead.
  if (pathname.startsWith('/her-words/')) return null;
  const stop = nextStop(pathname);
  if (!stop) return null;

  if (FULLSCREEN_ROUTES.includes(pathname)) {
    return (
      <Link
        to={stop.path}
        className="fixed bottom-5 left-5 z-30 glass-pill px-4 py-2.5
          font-body text-xs text-text-secondary hover:text-text-primary
          transition-colors duration-300"
      >
        Continue&nbsp;→&nbsp;<span className="font-medium">{stop.title}</span>
      </Link>
    );
  }

  return (
    <aside aria-label="Continue the walk" className="relative z-10 px-6 pb-20">
      <div className="max-w-xl mx-auto pt-12 border-t border-[#E2DBC9] text-center">
        <p className="font-body text-text-muted text-[10px] tracking-[0.3em] uppercase mb-4">
          Continue the walk
        </p>
        <Link to={stop.path} className="group inline-block focus:outline-none">
          <span
            className="font-heading text-2xl md:text-3xl text-text-primary
              group-hover:text-[#8B7355] transition-colors duration-300"
          >
            {stop.title}&nbsp;→
          </span>
          <span className="block font-leah text-text-muted text-2xl leading-none mt-2">
            {stop.blurb}
          </span>
        </Link>
      </div>
    </aside>
  );
}

export default ContinueRail;
