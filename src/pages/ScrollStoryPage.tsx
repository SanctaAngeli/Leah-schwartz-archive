import { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIntroComplete } from '../hooks/useIntroComplete';
import ExplorationChoiceModal from '../components/ui/ExplorationChoiceModal';
import FavoritesHint from '../components/ui/FavoritesHint';
import {
  ParallaxHero,
  FeaturedTrio,
  HeroArtwork,
  TextFadeIn,
  QuoteReveal,
  HorizontalGallerySection,
  ScrollProgress,
  BackToTop,
  ArtworkSpotlight,
  AnimatedGradient,
  StatsSection,
  TimelineVisualization,
} from '../components/scroll-story';
import artworksData from '../data/artworks.json';
import locationsData from '../data/locations.json';
import type { Artwork, Location } from '../types';

const artworks = artworksData as Artwork[];
const locations = locationsData as Location[];

function ScrollStoryPage(): JSX.Element {
  const navigate = useNavigate();
  const { markIntroComplete } = useIntroComplete();
  const [showExplorationModal, setShowExplorationModal] = useState(false);
  const hasTriggeredModal = useRef(false);

  // Track scroll progress to trigger modal at end
  // Modal can appear each time user scrolls to 92%, regardless of intro completion status
  useEffect(() => {
    const handleScroll = (): void => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = window.scrollY / scrollHeight;

      // Trigger modal at 92% scroll (but only once per page load via ref)
      if (scrollProgress > 0.92 && !hasTriggeredModal.current) {
        hasTriggeredModal.current = true;
        setShowExplorationModal(true);
      }

      // Reset the trigger if user scrolls back up significantly (allows re-triggering)
      if (scrollProgress < 0.7 && hasTriggeredModal.current && !showExplorationModal) {
        hasTriggeredModal.current = false;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showExplorationModal]);

  const handleModalClose = (): void => {
    setShowExplorationModal(false);
    markIntroComplete();
  };

  // Compute dynamic stats from data
  const computedStats = useMemo(() => {
    const years = artworks.map(a => a.year).filter(Boolean) as number[];
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const yearsCreating = maxYear - minYear + 1;

    const uniqueLocations = new Set(artworks.map(a => a.location)).size;
    const uniqueMediums = new Set(artworks.map(a => a.medium.split(' ')[0])).size;

    return {
      artworkCount: artworks.length,
      yearsCreating,
      locationCount: uniqueLocations,
      mediumCount: uniqueMediums,
      minYear,
      maxYear,
    };
  }, []);

  // Organize artworks by era
  const { earlyWorks, middleWorks, lateWorks } = useMemo(() => {
    return {
      earlyWorks: artworks.filter((a) => a.year && a.year < 1975),
      middleWorks: artworks.filter((a) => a.year && a.year >= 1975 && a.year < 1990),
      lateWorks: artworks.filter((a) => a.year && a.year >= 1990),
    };
  }, []);

  // Select featured artworks - prioritize those marked as featured
  const heroArtworks = useMemo(() => {
    const featured = artworks.filter(a => a.featured);
    const others = artworks.filter(a => !a.featured).slice(0, 12 - featured.length);
    return [...featured, ...others].slice(0, 12);
  }, []);

  const featuredEarly = useMemo(() => {
    const featured = earlyWorks.filter(a => a.featured);
    return featured.length >= 3 ? featured.slice(0, 3) : earlyWorks.slice(0, 3);
  }, [earlyWorks]);

  const heroArtwork1 = useMemo(() => {
    return earlyWorks.find(a => a.featured) || earlyWorks[4] || earlyWorks[0];
  }, [earlyWorks]);

  const featuredMiddle = useMemo(() => {
    const featured = middleWorks.filter(a => a.featured);
    return featured.length >= 3 ? featured.slice(0, 3) : middleWorks.slice(0, 3);
  }, [middleWorks]);

  const heroArtwork2 = useMemo(() => {
    return middleWorks.find(a => a.featured) || middleWorks[5] || middleWorks[0];
  }, [middleWorks]);

  const horizontalGalleryWorks = useMemo(() => middleWorks.slice(3, 12), [middleWorks]);

  const featuredLate = useMemo(() => {
    const featured = lateWorks.filter(a => a.featured);
    return featured.length >= 3 ? featured.slice(0, 3) : lateWorks.slice(0, 3);
  }, [lateWorks]);

  const spotlightArtwork = useMemo(() => {
    return lateWorks.find(a => a.featured) || lateWorks[2] || lateWorks[0];
  }, [lateWorks]);

  const finalHeroArtwork = useMemo(() => {
    const featured = lateWorks.filter(a => a.featured);
    return featured[1] || lateWorks[6] || lateWorks[1];
  }, [lateWorks]);

  // Data-driven stats
  const stats = useMemo(() => [
    { value: computedStats.artworkCount, label: 'Artworks', suffix: '+' },
    { value: computedStats.yearsCreating, label: 'Years Creating' },
    { value: locations.length, label: 'Locations' },
    { value: computedStats.mediumCount, label: 'Mediums' },
  ], [computedStats]);

  // Data-driven timeline milestones
  const milestones = useMemo(() => {
    const years = artworks.map(a => a.year).filter(Boolean) as number[];
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const range = maxYear - minYear;

    return [
      { year: minYear, label: 'First Works' },
      { year: Math.round(minYear + range * 0.25), label: 'Early Period' },
      { year: Math.round(minYear + range * 0.5), label: 'Peak Years' },
      { year: Math.round(minYear + range * 0.75), label: 'Late Period' },
    ];
  }, []);

  return (
    <div className="relative">
      {/* Progress indicator */}
      <ScrollProgress />

      {/* Favorites onboarding hint */}
      <FavoritesHint />

      {/* ===== SECTION 1: HERO ===== */}
      <ParallaxHero
        artworks={heroArtworks}
        title="Leah Schwartz"
        subtitle="Artist"
        years="1945 – 2004"
      />

      {/* ===== SECTION 2: INTRODUCTION ===== */}
      <AnimatedGradient
        colors={['#FAFAFA', '#F8F6F3', '#F5F3F0', '#F8F6F3', '#FAFAFA']}
        className="py-16"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <TextFadeIn>
            <p className="font-body text-text-muted text-sm tracking-[0.3em] uppercase mb-6">
              A Life in Art
            </p>
          </TextFadeIn>

          <TextFadeIn delay={0.2}>
            <h2 className="font-heading text-[clamp(28px,5vw,48px)] text-text-primary leading-relaxed mb-8">
              For four decades, Leah Schwartz captured the light, landscape, and spirit
              of the San Francisco Bay Area through watercolors, oils, and mixed media.
            </h2>
          </TextFadeIn>

          <TextFadeIn delay={0.4}>
            <p className="font-body text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
              Her work moves between intimate observation and bold expression—
              from delicate notebook sketches to vibrant landscapes that pulse with
              the energy of California.
            </p>
          </TextFadeIn>
        </div>
      </AnimatedGradient>

      {/* ===== SECTION 3: EARLY WORKS ===== */}
      <FeaturedTrio
        artworks={featuredEarly}
        title="Early Explorations"
        subtitle="1963 – 1974"
        description="The formative years. A young artist finding her visual language through experimentation with form, color, and subject matter."
      />

      {/* ===== SECTION 4: FIRST HERO ARTWORK ===== */}
      {heroArtwork1 && (
        <HeroArtwork
          artwork={heroArtwork1}
          caption="In these early works, we see the seeds of everything that would follow—an eye for light, a love of natural forms, and a distinctive palette that would become her signature."
          alignment="center"
        />
      )}

      {/* ===== SECTION 5: QUOTE ===== */}
      <QuoteReveal
        quote="Art is how I understand the world. Each painting is a conversation between what I see and what I feel."
        author="Leah Schwartz"
      />

      {/* ===== SECTION 6: STATS ===== */}
      <StatsSection
        stats={stats}
        subtitle="By the Numbers"
        title="A Prolific Life"
      />

      {/* ===== SECTION 7: MIDDLE PERIOD TRIO ===== */}
      <FeaturedTrio
        artworks={featuredMiddle}
        title="The San Francisco Years"
        subtitle="1975 – 1989"
        description="Her most prolific period. Immersed in the Bay Area art scene, her work deepened in complexity and confidence."
        reverse
        backgroundColor="#F8F6F3"
      />

      {/* ===== SECTION 8: HORIZONTAL GALLERY ===== */}
      <HorizontalGallerySection
        artworks={horizontalGalleryWorks}
        title="A Journey Through Color"
        subtitle="Selected Works"
      />

      {/* ===== SECTION 9: SECOND HERO ARTWORK ===== */}
      {heroArtwork2 && (
        <HeroArtwork
          artwork={heroArtwork2}
          caption="By the mid-1980s, Schwartz had developed a mature style that balanced spontaneity with careful composition. Her brushwork became more confident, her colors more saturated."
          alignment="left"
        />
      )}

      {/* ===== SECTION 10: TIMELINE ===== */}
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6 text-center mb-12">
          <TextFadeIn>
            <p className="font-body text-text-muted text-sm tracking-[0.3em] uppercase mb-4">
              Four Decades
            </p>
          </TextFadeIn>
          <TextFadeIn delay={0.1}>
            <h2 className="font-heading text-[clamp(28px,5vw,44px)] text-text-primary">
              An Artistic Journey
            </h2>
          </TextFadeIn>
        </div>

        <TimelineVisualization
          startYear={1963}
          endYear={2004}
          milestones={milestones}
          artworks={artworks}
        />
      </div>

      {/* ===== SECTION 11: LATE WORKS TRIO ===== */}
      <FeaturedTrio
        artworks={featuredLate}
        title="Late Reflections"
        subtitle="1990 – 2004"
        description="The final chapter. Works that reflect a lifetime of seeing, marked by wisdom and an even deeper connection to place."
        backgroundColor="#F5F3F0"
      />

      {/* ===== SECTION 12: SPOTLIGHT ZOOM ===== */}
      {spotlightArtwork && (
        <ArtworkSpotlight
          artwork={spotlightArtwork}
          title="In the Details"
          description="Look closer. Every brushstroke tells a story. Every color choice reveals intention. This is what a lifetime of dedication looks like."
          spotlights={[
            { x: 30, y: 40, label: 'Brushwork' },
            { x: 70, y: 60, label: 'Color harmony' },
          ]}
        />
      )}

      {/* ===== SECTION 13: FINAL HERO ===== */}
      {finalHeroArtwork && (
        <HeroArtwork
          artwork={finalHeroArtwork}
          caption="In her later works, there's a sense of summation—an artist who has mastered her craft and can now paint with both freedom and precision."
          alignment="right"
        />
      )}

      {/* ===== SECTION 14: SECOND QUOTE ===== */}
      <QuoteReveal
        quote="The landscape doesn't stay still. Neither should the painter."
        author="Leah Schwartz"
      />

      {/* ===== SECTION 15: LEGACY ===== */}
      <AnimatedGradient
        colors={['#FAFAFA', '#F5F0EB', '#F0EBE5', '#F5F0EB', '#FAFAFA']}
        className="py-20"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <TextFadeIn>
            <p className="font-body text-text-muted text-sm tracking-[0.3em] uppercase mb-6">
              Legacy
            </p>
          </TextFadeIn>

          <TextFadeIn delay={0.2}>
            <h2 className="font-heading text-[clamp(32px,6vw,64px)] text-text-primary leading-tight mb-8">
              A Life Remembered<br />Through Art
            </h2>
          </TextFadeIn>

          <TextFadeIn delay={0.4}>
            <p className="font-body text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto mb-12">
              Leah Schwartz left behind more than paintings. She left a way of seeing—
              a reminder to look closely, to find beauty in the everyday, and to never
              stop exploring.
            </p>
          </TextFadeIn>

          <TextFadeIn delay={0.6}>
            <p className="font-body text-text-muted text-base max-w-xl mx-auto">
              This digital archive preserves her work for future generations,
              allowing her vision to continue inspiring artists and art lovers alike.
            </p>
          </TextFadeIn>
        </div>
      </AnimatedGradient>

      {/* ===== SECTION 16: CALL TO ACTION ===== */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <TextFadeIn>
            <h2 className="font-heading text-[clamp(28px,5vw,48px)] text-text-primary mb-12">
              Continue Exploring
            </h2>
          </TextFadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Browse the Gallery',
                description: 'Explore works by era and discover the evolution of her style.',
                path: '/gallery',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: 'View Timeline',
                description: 'Journey through four decades of artistic creation.',
                path: '/timeline',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: 'Explore Locations',
                description: 'Discover the places that inspired her work.',
                path: '/locations',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="group p-8 rounded-3xl bg-white/50 border border-white/60 hover:bg-white/80 transition-colors text-left"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="text-text-primary mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-heading text-xl text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-text-muted text-sm">
                  {item.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Back to top button */}
      <BackToTop />

      {/* Exploration choice modal - shown when user reaches end */}
      <ExplorationChoiceModal
        isOpen={showExplorationModal}
        onClose={handleModalClose}
      />
    </div>
  );
}

export default ScrollStoryPage;
