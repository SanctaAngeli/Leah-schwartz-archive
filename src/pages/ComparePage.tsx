import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PlaceholderArtwork from '../components/ui/PlaceholderArtwork';
import artworksData from '../data/artworks.json';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

function ComparePage(): JSX.Element {
  const [leftArtwork, setLeftArtwork] = useState<Artwork | null>(null);
  const [rightArtwork, setRightArtwork] = useState<Artwork | null>(null);
  const [isSelectingFor, setIsSelectingFor] = useState<'left' | 'right' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter artworks based on search
  const filteredArtworks = useMemo(() => {
    if (!searchQuery.trim()) return artworks.slice(0, 20);

    const query = searchQuery.toLowerCase();
    return artworks
      .filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.year?.toString().includes(query) ||
        a.medium.toLowerCase().includes(query)
      )
      .slice(0, 20);
  }, [searchQuery]);

  const handleSelect = (artwork: Artwork) => {
    if (isSelectingFor === 'left') {
      setLeftArtwork(artwork);
    } else if (isSelectingFor === 'right') {
      setRightArtwork(artwork);
    }
    setIsSelectingFor(null);
    setSearchQuery('');
  };

  const clearComparison = () => {
    setLeftArtwork(null);
    setRightArtwork(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-3xl text-text-primary mb-2">
            Compare Artworks
          </h1>
          <p className="font-body text-text-muted">
            Select two artworks to view side by side
          </p>
        </div>

        {/* Comparison area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left artwork */}
          <CompareSlot
            artwork={leftArtwork}
            position="left"
            onSelect={() => setIsSelectingFor('left')}
            onClear={() => setLeftArtwork(null)}
          />

          {/* Right artwork */}
          <CompareSlot
            artwork={rightArtwork}
            position="right"
            onSelect={() => setIsSelectingFor('right')}
            onClear={() => setRightArtwork(null)}
          />
        </div>

        {/* Comparison details */}
        {leftArtwork && rightArtwork && (
          <motion.div
            className="glass-card p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-heading text-xl text-text-primary mb-4">Comparison</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-right font-body text-text-secondary">
                {leftArtwork.year || 'Undated'}
              </div>
              <div className="text-center font-body text-text-muted uppercase tracking-wider">
                Year
              </div>
              <div className="font-body text-text-secondary">
                {rightArtwork.year || 'Undated'}
              </div>

              <div className="text-right font-body text-text-secondary">
                {leftArtwork.medium}
              </div>
              <div className="text-center font-body text-text-muted uppercase tracking-wider">
                Medium
              </div>
              <div className="font-body text-text-secondary">
                {rightArtwork.medium}
              </div>

              <div className="text-right font-body text-text-secondary">
                {leftArtwork.dimensions}
              </div>
              <div className="text-center font-body text-text-muted uppercase tracking-wider">
                Size
              </div>
              <div className="font-body text-text-secondary">
                {rightArtwork.dimensions}
              </div>

              {leftArtwork.year && rightArtwork.year && (
                <>
                  <div className="text-right font-body text-text-secondary" />
                  <div className="text-center font-body text-text-muted uppercase tracking-wider">
                    Years Apart
                  </div>
                  <div className="font-body text-text-primary font-medium">
                    {Math.abs(rightArtwork.year - leftArtwork.year)} years
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Clear button */}
        {(leftArtwork || rightArtwork) && (
          <div className="text-center mt-8">
            <button
              onClick={clearComparison}
              className="glass-pill px-6 py-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              Clear comparison
            </button>
          </div>
        )}

        {/* Selection modal */}
        <AnimatePresence>
          {isSelectingFor && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsSelectingFor(null)}
              />

              <motion.div
                className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-xl text-text-primary">
                      Select {isSelectingFor === 'left' ? 'first' : 'second'} artwork
                    </h2>
                    <button
                      onClick={() => setIsSelectingFor(null)}
                      className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search artworks..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-text-primary/20"
                    autoFocus
                  />
                </div>

                <div className="max-h-96 overflow-y-auto p-4">
                  <div className="grid grid-cols-3 gap-3">
                    {filteredArtworks.map((artwork) => (
                      <button
                        key={artwork.id}
                        onClick={() => handleSelect(artwork)}
                        className="group text-left"
                      >
                        <PlaceholderArtwork
                          color={artwork.placeholderColor}
                          aspectRatio={artwork.aspectRatio}
                          className="mb-1 group-hover:scale-105 transition-transform"
                        />
                        <p className="text-xs font-body text-text-primary truncate">
                          {artwork.title}
                        </p>
                        <p className="text-xs font-body text-text-muted">
                          {artwork.year}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

interface CompareSlotProps {
  artwork: Artwork | null;
  position: 'left' | 'right';
  onSelect: () => void;
  onClear: () => void;
}

function CompareSlot({ artwork, position, onSelect, onClear }: CompareSlotProps): JSX.Element {
  if (!artwork) {
    return (
      <button
        onClick={onSelect}
        className="aspect-[4/3] border-2 border-dashed border-gray-200 rounded-2xl
          flex flex-col items-center justify-center
          hover:border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-12 h-12 text-text-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
        <span className="font-body text-text-muted">
          Select {position === 'left' ? 'first' : 'second'} artwork
        </span>
      </button>
    );
  }

  return (
    <div className="relative group">
      <PlaceholderArtwork
        color={artwork.placeholderColor}
        aspectRatio={artwork.aspectRatio}
        className="shadow-glass"
      />

      {/* Overlay with info */}
      <div className="absolute bottom-0 left-0 right-0 p-4
        bg-gradient-to-t from-black/60 to-transparent rounded-b-lg">
        <h3 className="font-heading text-lg text-white">{artwork.title}</h3>
        <p className="font-body text-sm text-white/80">{artwork.year} · {artwork.medium}</p>
      </div>

      {/* Change/clear buttons */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onSelect}
          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow
            flex items-center justify-center hover:bg-white"
          aria-label="Change artwork"
        >
          <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button
          onClick={onClear}
          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow
            flex items-center justify-center hover:bg-white"
          aria-label="Remove artwork"
        >
          <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ComparePage;
