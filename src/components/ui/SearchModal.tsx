import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import artworksData from '../../data/artworks.json';
import locationsData from '../../data/locations.json';
import themesData from '../../data/themes.json';
import type { Artwork, Location, Theme } from '../../types';

const artworks = artworksData as Artwork[];
const locations = locationsData as Location[];
const themes = themesData as Theme[];

interface SearchResult {
  type: 'artwork' | 'location' | 'theme' | 'page';
  id: string;
  title: string;
  subtitle?: string;
  path: string;
  color?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SearchModal({ isOpen, onClose }: SearchModalProps): JSX.Element | null {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Build search index
  const allResults: SearchResult[] = useMemo(() => {
    const results: SearchResult[] = [];

    // Add pages
    results.push(
      { type: 'page', id: 'home', title: 'Home', subtitle: 'Gallery entrance', path: '/' },
      { type: 'page', id: 'gallery', title: 'Gallery', subtitle: 'Browse all artworks', path: '/gallery' },
      { type: 'page', id: 'timeline', title: 'Timeline', subtitle: 'Chronological view', path: '/timeline' },
      { type: 'page', id: 'locations', title: 'Locations', subtitle: 'Browse by location', path: '/locations' },
      { type: 'page', id: 'themes', title: 'Themes', subtitle: 'Browse by theme', path: '/themes' },
      { type: 'page', id: 'tour', title: 'Guided Tour', subtitle: 'Audio tour', path: '/tour' },
      { type: 'page', id: 'favorites', title: 'My Collection', subtitle: 'Your saved artworks', path: '/favorites' },
      { type: 'page', id: 'compare', title: 'Compare', subtitle: 'Compare two artworks', path: '/compare' },
      { type: 'page', id: 'about', title: 'About Leah', subtitle: 'Artist biography', path: '/about' }
    );

    // Add locations
    locations.forEach((loc) => {
      results.push({
        type: 'location',
        id: loc.id,
        title: loc.name,
        subtitle: loc.description,
        path: `/locations/${loc.id}`,
      });
    });

    // Add themes
    themes.forEach((theme) => {
      results.push({
        type: 'theme',
        id: theme.id,
        title: theme.name,
        subtitle: theme.description,
        path: `/themes/${theme.id}`,
      });
    });

    // Add artworks
    artworks.forEach((artwork) => {
      results.push({
        type: 'artwork',
        id: artwork.id,
        title: artwork.title,
        subtitle: `${artwork.year || 'Undated'} · ${artwork.medium}`,
        path: `/artwork/${artwork.id}`,
        color: artwork.placeholderColor,
      });
    });

    return results;
  }, []);

  // Filter results based on query
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      // Show pages and a few featured artworks when no query
      return allResults.filter((r) => r.type === 'page').slice(0, 6);
    }

    const lowerQuery = query.toLowerCase();
    const scored = allResults
      .map((result) => {
        let score = 0;
        const titleLower = result.title.toLowerCase();
        const subtitleLower = result.subtitle?.toLowerCase() || '';

        // Exact match
        if (titleLower === lowerQuery) score += 100;
        // Starts with
        else if (titleLower.startsWith(lowerQuery)) score += 50;
        // Contains
        else if (titleLower.includes(lowerQuery)) score += 25;
        // Subtitle contains
        else if (subtitleLower.includes(lowerQuery)) score += 10;
        // Word match
        else if (titleLower.split(' ').some((w) => w.startsWith(lowerQuery))) score += 15;

        // Boost pages
        if (result.type === 'page') score += 5;

        return { result, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.result)
      .slice(0, 10);

    return scored;
  }, [query, allResults]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Handle navigation
  const handleSelect = useCallback((result: SearchResult) => {
    onClose();
    setTimeout(() => navigate(result.path), 50);
  }, [navigate, onClose]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          handleSelect(filteredResults[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [filteredResults, selectedIndex, handleSelect, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    const container = resultsRef.current;
    const selected = container?.querySelector('[data-selected="true"]');
    if (selected && container) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Type icons
  const typeIcons: Record<string, JSX.Element> = {
    page: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    location: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    theme: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    artwork: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          {/* Search input */}
          <div className="relative border-b border-gray-100">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search artworks, locations, themes..."
              className="w-full pl-12 pr-4 py-4 text-text-primary placeholder:text-text-muted
                bg-transparent outline-none text-lg"
              aria-label="Search query"
              autoComplete="off"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs text-text-muted bg-gray-100 rounded">
                esc
              </kbd>
            </div>
          </div>

          {/* Results */}
          <div ref={resultsRef} className="max-h-[50vh] overflow-y-auto">
            {filteredResults.length === 0 ? (
              <div className="px-4 py-8 text-center text-text-muted">
                No results found for "{query}"
              </div>
            ) : (
              <ul className="py-2" role="listbox">
                {filteredResults.map((result, index) => (
                  <li key={`${result.type}-${result.id}`} role="option" aria-selected={index === selectedIndex}>
                    <button
                      data-selected={index === selectedIndex}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`
                        w-full px-4 py-3 flex items-center gap-3 text-left
                        transition-colors duration-100
                        ${index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'}
                      `}
                    >
                      {/* Color swatch for artworks */}
                      {result.color ? (
                        <div
                          className="w-8 h-8 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: result.color }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-text-muted">
                          {typeIcons[result.type]}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-text-primary truncate">
                          {result.title}
                        </p>
                        {result.subtitle && (
                          <p className="font-body text-sm text-text-muted truncate">
                            {result.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Type badge */}
                      <span className="flex-shrink-0 text-xs text-text-muted capitalize">
                        {result.type}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded">↵</kbd>
                to select
              </span>
            </div>
            <span>{artworks.length} artworks</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SearchModal;
