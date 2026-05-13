import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import InfiniteCanvas from '../components/canvas/InfiniteCanvas';
import ArtworkModal from '../components/artwork-detail/ArtworkModal';
import { generateCanvasLayout } from '../utils/canvasLayout';
import { usePageMeta } from '../hooks/usePageMeta';
import artworksData from '../data/artworks.json';
import type { Artwork } from '../types';

const allArtworks = artworksData as Artwork[];

function CanvasPage(): JSX.Element {
  usePageMeta(
    'Canvas',
    "Drift across all 267 of Leah Schwartz's paintings on an infinite, draggable canvas.",
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const artworks = useMemo(
    () => allArtworks.filter((a) => a.imagePath),
    [],
  );
  const layout = useMemo(() => generateCanvasLayout(artworks), [artworks]);

  const handleClick = useCallback((id: string): void => {
    setSelectedId(id);
  }, []);

  const handleClose = useCallback((): void => {
    setSelectedId(null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 bg-bg-gallery"
    >
      <InfiniteCanvas
        artworks={artworks}
        layout={layout}
        onArtworkClick={handleClick}
      />
      {selectedId && (
        <ArtworkModal artworkId={selectedId} onClose={handleClose} />
      )}
    </motion.div>
  );
}

export default CanvasPage;
