import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useTheme } from '../../hooks/useTheme';

// Detect platform for keyboard shortcuts
function useIsMac(): boolean {
  return useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  }, []);
}

interface NavigationProps {
  visible?: boolean;
}

function Navigation({ visible = true }: NavigationProps): JSX.Element | null {
  const navigate = useNavigate();
  const location = useLocation();
  const { open: openSearch } = useSearch();
  const { isNight } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMac = useIsMac();

  // Platform-aware shortcut display
  const searchShortcut = isMac ? '⌘K' : 'Ctrl+K';

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMobileMenuOpen]);

  // Updated nav items - removed Curated (accessed via era), renamed About
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/themes', label: 'Gallery' },
    { path: '/canvas', label: 'Canvas' },
    { path: '/her-words', label: "Leah's Story" },
    { path: '/atlas', label: 'Atlas' },
    { path: '/obsessions', label: 'Obsessions' },
    { path: '/at-her-age', label: 'Eras' },
    { path: '/studio', label: 'Studio' },
    { path: '/about', label: 'About' },
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

  // Theme-aware styles
  const activeTextClass = isNight ? 'text-gray-900' : 'text-white';
  const inactiveHoverBg = isNight ? 'hover:bg-white/10' : 'hover:bg-white/50';
  const pillBgClass = isNight ? 'bg-gray-100' : 'bg-text-primary';
  const iconButtonClass = `relative z-10 w-9 h-9 flex items-center justify-center rounded-full text-text-secondary
    hover:text-text-primary transition-colors duration-200
    ${isNight ? 'hover:bg-white/10' : 'hover:bg-white/50'}`;

  if (!visible) return null;

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-4 md:top-6 inset-x-0 mx-auto w-fit z-50"
      >
        <div className="glass-pill px-2 py-2 flex items-center justify-center gap-1">
          {/* Left icon group - fixed width for balance */}
          <div className="hidden md:flex items-center gap-1 w-[88px] justify-start">
            {/* Search button */}
            <button
              onClick={openSearch}
              className={`${iconButtonClass} ${isNight ? 'bg-white/10' : 'bg-black/5'}`}
              aria-label={`Search (${searchShortcut})`}
              title={`Search (${searchShortcut})`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <div className={`w-px h-5 mx-1 ${isNight ? 'bg-gray-600' : 'bg-gray-200'}`} aria-hidden="true" />
          </div>

          {/* Desktop nav items - the visual center */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path);

              return (
                <div key={item.path} className="relative">
                  {/* Sliding pill indicator */}
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className={`absolute inset-0 ${pillBgClass} rounded-full`}
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
                        relative z-10 px-3 py-2 rounded-full
                        text-sm font-body font-medium
                        transition-colors duration-200
                        ${active
                          ? activeTextClass
                          : `text-text-secondary hover:text-text-primary ${inactiveHoverBg}`
                        }
                      `}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={`
                        relative z-10 px-3 py-2 rounded-full block
                        text-sm font-body font-medium
                        transition-colors duration-200 whitespace-nowrap
                        ${active
                          ? activeTextClass
                          : `text-text-secondary hover:text-text-primary ${inactiveHoverBg}`
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

          {/* Mobile: search + menu toggle */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={openSearch}
              className={`${iconButtonClass} ${isNight ? 'bg-white/10' : 'bg-black/5'}`}
              aria-label={`Search (${searchShortcut})`}
              title={`Search (${searchShortcut})`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={iconButtonClass}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Right spacer - settings lives in the floating SettingsPanel
              (bottom-right), so the pill keeps a single, unambiguous gear-free
              right edge that mirrors the search button on the left. */}
          <div className="hidden md:flex items-center gap-1 w-[88px] justify-end" aria-hidden="true" />
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-20 left-4 right-4 z-50 glass-card p-4 md:hidden"
            >
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.path);

                  return item.path === '/' ? (
                    <button
                      key={item.path}
                      onClick={(e) => {
                        handleHomeClick(e);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`
                        w-full text-left px-4 py-3 rounded-xl
                        text-base font-body font-medium
                        transition-colors duration-200
                        ${active
                          ? `${pillBgClass} ${activeTextClass}`
                          : 'text-text-secondary hover:text-text-primary hover:bg-black/5'
                        }
                      `}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        block px-4 py-3 rounded-xl
                        text-base font-body font-medium
                        transition-colors duration-200
                        ${active
                          ? `${pillBgClass} ${activeTextClass}`
                          : 'text-text-secondary hover:text-text-primary hover:bg-black/5'
                        }
                      `}
                    >
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;
