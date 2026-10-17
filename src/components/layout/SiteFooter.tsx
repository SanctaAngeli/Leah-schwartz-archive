import { Link, useLocation } from 'react-router-dom';
import { FOOTER_LINKS, MODES } from '../../data/siteTree';

// Plain footer on archive pages: the three experiences again, plus the
// small utility pages (about the archive, favourites, compare).

const HIDDEN = ['/', '/canvas', '/admin'];

function SiteFooter(): JSX.Element | null {
  const { pathname } = useLocation();
  if (HIDDEN.includes(pathname) || pathname === '/tour' || pathname.startsWith('/tour/') || pathname.startsWith('/artwork/')) return null;

  return (
    <footer className="relative z-10 px-6 pb-16 pt-10">
      <div className="max-w-6xl mx-auto border-t border-[#E2DBC9] pt-8 flex flex-col md:flex-row md:justify-between gap-6 font-body text-sm">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {MODES.map((m) => (
            <li key={m.id}>
              <Link to={m.path} className="text-text-secondary hover:text-text-primary hover:underline">{m.title}</Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((l) => (
            <li key={l.path}>
              <Link to={l.path} className="text-text-muted hover:text-text-primary hover:underline">{l.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default SiteFooter;
