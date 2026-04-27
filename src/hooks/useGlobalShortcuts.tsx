// Sitewide keyboard navigation, Gmail-style.
//
//   /   focus search
//   G then H   home         G then G   gallery
//   G then S   studio       G then P   pairings
//   G then T   themes       G then L   places
//   G then W   her words    G then I   index
//   G then A   about        G then D   (d)aily (home)
//   ?   show the shortcuts sheet

import { useEffect, useState, useRef, useCallback, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

interface ShortcutRoute { keys: string[]; path: string; label: string; }

const ROUTES: ShortcutRoute[] = [
  { keys: ['g', 'h'], path: '/',            label: 'Home (Painting of the Day)' },
  { keys: ['g', 'd'], path: '/',            label: 'Daily painting' },
  { keys: ['g', 'g'], path: '/gallery',     label: 'Gallery' },
  { keys: ['g', 's'], path: '/studio',      label: 'Studio' },
  { keys: ['g', 'p'], path: '/pairings',    label: 'Pairings' },
  { keys: ['g', 't'], path: '/themes',      label: 'Themes' },
  { keys: ['g', 'l'], path: '/places',      label: 'Places' },
  { keys: ['g', 'w'], path: '/her-words',   label: "Leah's Story" },
  { keys: ['g', 'i'], path: '/index',       label: 'Index' },
  { keys: ['g', 'a'], path: '/about',       label: 'About' },
  { keys: ['g', 'r'], path: '/locations',   label: 'Regions' },
];

interface ShortcutsContextValue {
  showCheatsheet: boolean;
  setShowCheatsheet: (v: boolean) => void;
  openSearch?: () => void;
  setOpenSearch: (fn?: () => void) => void;
}

const ShortcutsContext = createContext<ShortcutsContextValue | null>(null);

export function ShortcutsProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [showCheatsheet, setShowCheatsheet] = useState(false);
  const openSearchRef = useRef<(() => void) | undefined>();

  const setOpenSearch = useCallback((fn?: () => void) => {
    openSearchRef.current = fn;
  }, []);

  const navigate = useNavigate();
  const lastKeyRef = useRef<{ key: string; ts: number } | null>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      // Never hijack when the user is typing
      const target = e.target as HTMLElement;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();

      if (key === '?' || (key === '/' && e.shiftKey)) {
        e.preventDefault();
        setShowCheatsheet((v) => !v);
        return;
      }

      if (key === '/') {
        if (openSearchRef.current) {
          e.preventDefault();
          openSearchRef.current();
        }
        return;
      }

      if (key === 'escape') {
        if (showCheatsheet) setShowCheatsheet(false);
        return;
      }

      // G-prefix chord
      const now = Date.now();
      if (key === 'g') {
        lastKeyRef.current = { key: 'g', ts: now };
        return;
      }
      if (lastKeyRef.current && lastKeyRef.current.key === 'g' && now - lastKeyRef.current.ts < 1500) {
        const match = ROUTES.find((r) => r.keys[0] === 'g' && r.keys[1] === key);
        if (match) {
          e.preventDefault();
          navigate(match.path);
          lastKeyRef.current = null;
        }
        return;
      }
      lastKeyRef.current = null;
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [navigate, showCheatsheet]);

  return (
    <ShortcutsContext.Provider value={{ showCheatsheet, setShowCheatsheet, openSearch: openSearchRef.current, setOpenSearch }}>
      {children}
      {showCheatsheet && <Cheatsheet onClose={() => setShowCheatsheet(false)} />}
    </ShortcutsContext.Provider>
  );
}

export function useShortcutsContext(): ShortcutsContextValue {
  const ctx = useContext(ShortcutsContext);
  if (!ctx) throw new Error('useShortcutsContext must be used inside ShortcutsProvider');
  return ctx;
}

function Cheatsheet({ onClose }: { onClose: () => void }): JSX.Element {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        className="bg-bg-gallery rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-body text-text-muted uppercase tracking-widest text-xs mb-1">Reference</p>
            <h2 className="font-heading text-2xl text-text-primary">Keyboard shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-text-muted hover:text-text-primary"
            aria-label="Close shortcuts"
          >
            ✕
          </button>
        </div>

        <section className="mb-6">
          <h3 className="font-body text-text-muted uppercase tracking-widest text-[11px] mb-3">
            Anywhere
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span className="font-body text-text-primary">Focus search</span>
              <kbd className="font-mono text-xs px-2 py-1 border border-[#E8E2D5] rounded">/</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-body text-text-primary">Show this sheet</span>
              <kbd className="font-mono text-xs px-2 py-1 border border-[#E8E2D5] rounded">?</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-body text-text-primary">Close overlay</span>
              <kbd className="font-mono text-xs px-2 py-1 border border-[#E8E2D5] rounded">Esc</kbd>
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="font-body text-text-muted uppercase tracking-widest text-[11px] mb-3">
            Go to (press G then letter)
          </h3>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {ROUTES.filter((r, i, arr) =>
              // Dedupe by label
              arr.findIndex((x) => x.label === r.label) === i
            ).slice(0, 10).map((r) => (
              <li key={r.label} className="flex items-center justify-between">
                <span className="font-body text-text-primary">{r.label}</span>
                <span className="flex gap-1">
                  <kbd className="font-mono text-xs px-1.5 py-0.5 border border-[#E8E2D5] rounded">G</kbd>
                  <kbd className="font-mono text-xs px-1.5 py-0.5 border border-[#E8E2D5] rounded uppercase">{r.keys[1]}</kbd>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="font-body text-text-muted uppercase tracking-widest text-[11px] mb-3">
            In an artwork (lightbox)
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span className="font-body text-text-primary">Previous / Next</span>
              <span className="flex gap-1">
                <kbd className="font-mono text-xs px-1.5 py-0.5 border border-[#E8E2D5] rounded">←</kbd>
                <kbd className="font-mono text-xs px-1.5 py-0.5 border border-[#E8E2D5] rounded">→</kbd>
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-body text-text-primary">Toggle info</span>
              <kbd className="font-mono text-xs px-2 py-1 border border-[#E8E2D5] rounded">I</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-body text-text-primary">Favorite</span>
              <kbd className="font-mono text-xs px-2 py-1 border border-[#E8E2D5] rounded">F</kbd>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-body text-text-primary">Zoom in / out</span>
              <span className="flex gap-1">
                <kbd className="font-mono text-xs px-1.5 py-0.5 border border-[#E8E2D5] rounded">+</kbd>
                <kbd className="font-mono text-xs px-1.5 py-0.5 border border-[#E8E2D5] rounded">−</kbd>
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-body text-text-primary">Reset zoom</span>
              <kbd className="font-mono text-xs px-2 py-1 border border-[#E8E2D5] rounded">0</kbd>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
