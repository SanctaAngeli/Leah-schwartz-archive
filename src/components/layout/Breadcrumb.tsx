import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { trailFor } from '../../data/siteTree';

// "You are here": Browse the archive › Paintings › The book's chapters.
// Sits just under the menu bar on every archive page.

// /studio is the "Explore her studio" experience, so it has no archive trail.
const HIDDEN = ['/', '/canvas', '/tour', '/admin', '/studio'];

function Breadcrumb(): JSX.Element | null {
  const { pathname, search } = useLocation();
  if (HIDDEN.includes(pathname) || pathname.startsWith('/tour/') || pathname.startsWith('/artwork/')) return null;
  const trail = trailFor(pathname, search);
  if (trail.length === 0) return null;
  const last = trail.length - 1;
  const isExact = pathname === trail[last].path.split('?')[0];

  return (
    <nav
      aria-label="You are here"
      className="absolute top-[72px] md:top-[80px] inset-x-0 z-20 px-6 pointer-events-none"
    >
      <ol className="max-w-6xl mx-auto flex flex-wrap justify-center gap-x-1.5 font-body text-xs text-text-muted pointer-events-auto">
        {trail.map((node, i) => (
          <Fragment key={node.path}>
            {i > 0 && <li aria-hidden="true">›</li>}
            <li>
              {i === last && isExact ? (
                <span aria-current="page" className="text-text-secondary">{node.title}</span>
              ) : (
                <Link to={node.path} className="hover:text-text-primary hover:underline">
                  {node.title}
                </Link>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
