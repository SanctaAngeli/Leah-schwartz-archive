import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useTheme } from '../../hooks/useTheme';
import { ARCHIVE, MODES, modeForPath } from '../../data/siteTree';
import ArchiveTreeLinks from './ArchiveTreeLinks';

// The menu bar on every page except the home page (which is itself the
// choice between the three experiences). It names the three experiences,
// highlights the one you're in, and always has Search. "Browse the archive"
// opens a panel showing the whole archive tree, so no page is out of reach.

function useIsMac(): boolean {
  return useMemo(() => typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform), []);
}

interface NavigationProps {
  visible?: boolean;
}

function Navigation({ visible = true }: NavigationProps): JSX.Element | null {
  const location = useLocation();
  const { open: openSearch } = useSearch();
  const { isNight } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isMac = useIsMac();
  const searchShortcut = isMac ? '⌘K' : 'Ctrl+K';
  const mode = modeForPath(location.pathname);

  useEffect(() => {
    setMobileOpen(false);
    setArchiveOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!mobileOpen && !archiveOpen) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setArchiveOpen(false);
      }
    };
    const onClick = (e: MouseEvent): void => {
      if (archiveOpen && panelRef.current && !panelRef.current.contains(e.target as Node)) setArchiveOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [mobileOpen, archiveOpen]);

  if (!visible) return null;

  const activeText = isNight ? 'text-gray-900' : 'text-white';
  const activeBg = isNight ? 'bg-gray-100' : 'bg-text-primary';
  const idle = `text-text-secondary hover:text-text-primary ${isNight ? 'hover:bg-white/10' : 'hover:bg-white/60'}`;
  const pill = 'relative z-10 px-3.5 py-2 rounded-full text-sm font-body font-medium transition-colors duration-200 whitespace-nowrap';

  const searchButton = (
    <button
      type="button"
      onClick={openSearch}
      className={`${pill} ${idle} flex items-center gap-2`}
      aria-label={`Search (${searchShortcut})`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="hidden lg:inline">Search</span>
    </button>
  );

  return (
    <>
      <motion.nav
        aria-label="Main"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-4 md:top-6 inset-x-0 mx-auto w-fit max-w-[calc(100vw-1rem)] z-50"
        ref={panelRef}
      >
        <div className="glass-pill px-2 py-2 flex items-center gap-1">
          <Link to="/" className={`${pill} ${idle} font-heading text-base`}>
            Leah Schwartz
          </Link>
          <div className={`hidden md:block w-px h-5 mx-1 ${isNight ? 'bg-gray-600' : 'bg-gray-200'}`} aria-hidden="true" />

          <div className="hidden md:flex items-center gap-1">
            {MODES.map((m) => {
              const active = mode === m.id;
              if (m.id === 'archive') {
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setArchiveOpen((o) => !o)}
                    aria-expanded={archiveOpen}
                    aria-controls="archive-panel"
                    className={`${pill} ${active ? `${activeBg} ${activeText}` : idle} flex items-center gap-1.5`}
                  >
                    {m.title}
                    <svg className={`w-3.5 h-3.5 transition-transform ${archiveOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                );
              }
              return (
                <NavLink key={m.id} to={m.path} className={`${pill} ${active ? `${activeBg} ${activeText}` : idle}`}>
                  {m.title}
                </NavLink>
              );
            })}
            <div className={`w-px h-5 mx-1 ${isNight ? 'bg-gray-600' : 'bg-gray-200'}`} aria-hidden="true" />
            {searchButton}
          </div>

          <div className="md:hidden flex items-center gap-1">
            {searchButton}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className={`${pill} ${idle}`}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {/* Desktop: the whole archive tree */}
        {/* Centred by this outer box; only the inner box animates (an animated
            transform would override the centring). */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[min(960px,calc(100vw-2rem))]">
          <AnimatePresence>
            {archiveOpen && (
              <motion.div
                id="archive-panel"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="glass-card p-6 max-h-[75vh] overflow-y-auto"
              >
                <Link to={ARCHIVE.path} className="font-heading text-2xl text-text-primary hover:underline">
                  Browse the archive
                </Link>
                <ArchiveTreeLinks className="mt-5 grid grid-cols-3 gap-x-8 gap-y-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Phone: the three experiences and the whole archive tree */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-20 left-4 right-4 bottom-4 z-50 glass-card p-5 md:hidden overflow-y-auto"
            >
              <nav aria-label="Main" className="space-y-1">
                {MODES.map((m) => (
                  <NavLink
                    key={m.id}
                    to={m.path}
                    className={`block px-4 py-3 rounded-xl text-base font-body font-medium ${
                      mode === m.id ? `${activeBg} ${activeText}` : 'text-text-primary hover:bg-black/5'
                    }`}
                  >
                    {m.title}
                  </NavLink>
                ))}
              </nav>
              <ArchiveTreeLinks className="mt-6 space-y-5 px-1" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;
