import { Link, useLocation } from 'react-router-dom';
import { ARCHIVE, trailFor } from '../../data/siteTree';

// The archive's six sections with every page under them, as plain links.
// Used in the menu panel, the phone menu and the archive sidebar.

interface Props {
  className?: string;
}

function ArchiveTreeLinks({ className = '' }: Props): JSX.Element {
  const { pathname, search } = useLocation();
  const current = new Set(trailFor(pathname, search).map((n) => n.path));

  return (
    <div className={className}>
      {ARCHIVE.children?.map((section) => (
        <div key={section.path}>
          <Link
            to={section.path}
            aria-current={pathname === section.path ? 'page' : current.has(section.path) ? 'location' : undefined}
            className="font-body text-sm font-semibold text-text-primary hover:underline"
          >
            {section.title}
          </Link>
          <ul className="mt-1.5 space-y-1">
            {section.children?.map((page) => (
              <li key={page.path}>
                <Link
                  to={page.path}
                  aria-current={current.has(page.path) ? 'page' : undefined}
                  className={`font-body text-sm hover:text-text-primary hover:underline ${
                    current.has(page.path) ? 'text-text-primary font-medium' : 'text-text-secondary'
                  }`}
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ArchiveTreeLinks;
