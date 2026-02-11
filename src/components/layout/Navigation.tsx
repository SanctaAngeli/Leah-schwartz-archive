import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useRandomArtwork } from '../../hooks/useRandomArtwork';

function Navigation(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { open: openSearch } = useSearch();
  const goToRandomArtwork = useRandomArtwork();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/timeline', label: 'Timeline' },
    { path: '/locations', label: 'Locations' },
    { path: '/themes', label: 'Themes' },
    { path: '/tour', label: 'Guided Tour' },
  ];

  // Check if current path matches (handle nested routes like /timeline/1977)
  const isActive = (path: string): boolean => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Special handler for home navigation to trigger reverse animation
  const handleHomeClick = useCallback(
    (e: React.MouseEvent): void => {
      e.preventDefault();
      navigate('/', { state: { fromGallery: location.pathname !== '/' } });
    },
    [navigate, location.pathname]
  );

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="glass-pill px-2 py-2 flex items-center gap-1">
        {/* Search button */}
        <button
          onClick={openSearch}
          className="relative z-10 px-3 py-2 rounded-full text-text-secondary
            hover:text-text-primary hover:bg-white/50 transition-colors duration-200"
          aria-label="Search (Cmd+K)"
          title="Search (⌘K)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Random artwork button */}
        <button
          onClick={goToRandomArtwork}
          className="relative z-10 px-3 py-2 rounded-full text-text-secondary
            hover:text-text-primary hover:bg-white/50 transition-colors duration-200"
          aria-label="Random artwork (R)"
          title="Random artwork (R)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        <div className="w-px h-5 bg-gray-200 mx-1" aria-hidden="true" />

        {navItems.map((item) => {
          const active = isActive(item.path);

          return (
            <div key={item.path} className="relative">
              {/* Sliding pill indicator */}
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-text-primary rounded-full"
                  transition={{
                    type: 'spring',
                    stiffness: 350,
                    damping: 25,
                    mass: 0.8,
                  }}
                />
              )}

              {/* Nav link/button */}
              {item.path === '/' ? (
                <button
                  onClick={handleHomeClick}
                  className={`
                    relative z-10 px-4 py-2 rounded-full
                    text-sm font-body font-medium
                    transition-colors duration-200
                    ${active
                      ? 'text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/50'
                    }
                  `}
                >
                  {item.label}
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  className={`
                    relative z-10 px-4 py-2 rounded-full block
                    text-sm font-body font-medium
                    transition-colors duration-200
                    ${active
                      ? 'text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/50'
                    }
                  `}
                >
                  {item.label}
                </NavLink>
              )}
            </div>
          );
        })}
      </div>
    </motion.nav>
  );
}

export default Navigation;
