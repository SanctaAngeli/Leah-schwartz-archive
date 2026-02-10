import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import PlaceholderArtwork from '../components/ui/PlaceholderArtwork';
import { PillButton } from '../components/ui/PillButton';
import artworksData from '../data/artworks.json';
import tourData from '../data/tour.json';
import type { Artwork, TourChapter } from '../types';

const artworks = artworksData as Artwork[];
const chapters = tourData as TourChapter[];

function GuidedTourPage(): JSX.Element {
  const navigate = useNavigate();
  const { chapterId } = useParams();
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);

  const selectedChapter = chapterId
    ? chapters.find((c) => c.id === chapterId)
    : null;

  const chapterArtworks = useMemo(() => {
    if (!selectedChapter) return [];
    return selectedChapter.artworkIds
      .map((id) => artworks.find((a) => a.id === id))
      .filter((a): a is Artwork => a !== undefined);
  }, [selectedChapter]);

  const currentArtwork = chapterArtworks[currentArtworkIndex];

  const getChapterHeroArtwork = (chapter: TourChapter): Artwork | undefined => {
    return artworks.find((a) => a.id === chapter.artworkIds[0]);
  };

  // Chapter selection view
  if (!selectedChapter) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl text-text-primary mb-2">
              Guided Tour
            </h1>
            <p className="font-body text-text-muted max-w-xl mx-auto">
              A curated journey through Leah's life and work, told through her
              art. Select a chapter to begin.
            </p>
          </div>

          <div className="space-y-6">
            {chapters.map((chapter, index) => {
              const heroArtwork = getChapterHeroArtwork(chapter);

              return (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassCard
                    className="cursor-pointer flex gap-6 items-center p-4"
                    onClick={() => navigate(`/tour/${chapter.id}`)}
                  >
                    <div
                      className="w-24 h-24 rounded-lg flex-shrink-0"
                      style={{
                        backgroundColor:
                          heroArtwork?.placeholderColor || '#9B8B7A',
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-body text-text-muted text-sm mb-1">
                        Chapter {index + 1}
                      </p>
                      <h2 className="font-heading text-2xl text-text-primary mb-2">
                        {chapter.title}
                      </h2>
                      <p className="font-body text-text-secondary text-sm">
                        {chapter.description}
                      </p>
                      <p className="font-body text-text-muted text-xs mt-2">
                        {chapter.artworkIds.length} artworks
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  // Chapter viewing experience
  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={() => navigate('/tour')}
          className="text-text-muted hover:text-text-primary transition-colors mb-6 font-body text-sm"
        >
          ← All Chapters
        </button>

        <div className="mb-8">
          <p className="font-body text-text-muted text-sm mb-1">
            Chapter {chapters.findIndex((c) => c.id === chapterId) + 1}
          </p>
          <h1 className="font-heading text-4xl text-text-primary">
            {selectedChapter.title}
          </h1>
        </div>

        {currentArtwork && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main artwork display */}
            <motion.div
              key={currentArtwork.id}
              className="flex-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <PlaceholderArtwork
                color={currentArtwork.placeholderColor}
                aspectRatio={currentArtwork.aspectRatio}
                className="w-full max-w-2xl mx-auto shadow-glass"
                onClick={() => navigate(`/artwork/${currentArtwork.id}`)}
              />
            </motion.div>

            {/* Artwork info and controls */}
            <div className="lg:w-80 space-y-6">
              <div>
                <h2 className="font-heading text-2xl text-text-primary mb-2">
                  {currentArtwork.title}
                </h2>
                <p className="font-body text-text-secondary">
                  {currentArtwork.year}
                  {currentArtwork.circa && ' (circa)'}
                </p>
                <p className="font-body text-text-muted text-sm mt-1">
                  {currentArtwork.medium}
                </p>
              </div>

              {/* Audio player placeholder */}
              <GlassCard className="p-4" hover={false}>
                <p className="font-body text-text-muted text-sm text-center">
                  Audio coming soon
                </p>
              </GlassCard>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <PillButton
                  variant="secondary"
                  onClick={() =>
                    setCurrentArtworkIndex((i) => Math.max(0, i - 1))
                  }
                  className={
                    currentArtworkIndex === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }
                >
                  Previous
                </PillButton>
                <span className="font-body text-text-muted text-sm">
                  {currentArtworkIndex + 1} / {chapterArtworks.length}
                </span>
                <PillButton
                  variant="secondary"
                  onClick={() =>
                    setCurrentArtworkIndex((i) =>
                      Math.min(chapterArtworks.length - 1, i + 1)
                    )
                  }
                  className={
                    currentArtworkIndex === chapterArtworks.length - 1
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }
                >
                  Next
                </PillButton>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 flex-wrap">
                {chapterArtworks.map((artwork, index) => (
                  <button
                    key={artwork.id}
                    className={`w-12 h-12 rounded transition-all ${
                      index === currentArtworkIndex
                        ? 'ring-2 ring-text-primary scale-110'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: artwork.placeholderColor }}
                    onClick={() => setCurrentArtworkIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default GuidedTourPage;
