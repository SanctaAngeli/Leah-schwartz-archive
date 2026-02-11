import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/layout/Navigation';
import SkipLink from './components/layout/SkipLink';
import PageTransition from './components/layout/PageTransition';
import ErrorBoundary from './components/ui/ErrorBoundary';
import SettingsPanel from './components/ui/SettingsPanel';
import PagePreloader from './components/ui/PagePreloader';
import { IntroProvider, useIntroComplete } from './hooks/useIntroComplete';
import ScrollStoryPage from './pages/ScrollStoryPage';
import CuratedGalleryPage from './pages/CuratedGalleryPage';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import TimelinePage from './pages/TimelinePage';
import LocationsPage from './pages/LocationsPage';
import ThemesPage from './pages/ThemesPage';
import GuidedTourPage from './pages/GuidedTourPage';
import ArtworkDetailPage from './pages/ArtworkDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ComparePage from './pages/ComparePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

function AppContent(): JSX.Element {
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { hasCompletedIntro } = useIntroComplete();

  // Show nav if: user has completed intro OR they're not on the landing page
  const isLandingPage = location.pathname === '/';
  const showNavigation = hasCompletedIntro || !isLandingPage;

  return (
    <>
      {/* Show preloader only on initial page load */}
      {isInitialLoad && (
        <PagePreloader
          minDuration={2000}
          onComplete={() => setIsInitialLoad(false)}
        />
      )}
      <SkipLink />
      <div className="min-h-screen bg-bg-gallery transition-colors duration-500">
        <Navigation visible={showNavigation} />
        <main id="main-content" className="focus:outline-none" tabIndex={-1}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><ScrollStoryPage /></PageTransition>} />
            <Route path="/curated" element={<PageTransition><CuratedGalleryPage /></PageTransition>} />
            <Route path="/curated/:eraId" element={<PageTransition><CuratedGalleryPage /></PageTransition>} />
            <Route path="/classic" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/gallery" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/timeline" element={<PageTransition><TimelinePage /></PageTransition>} />
            <Route path="/timeline/:year" element={<PageTransition><TimelinePage /></PageTransition>} />
            <Route path="/locations" element={<PageTransition><LocationsPage /></PageTransition>} />
            <Route path="/locations/:locationId" element={<PageTransition><LocationsPage /></PageTransition>} />
            <Route path="/themes" element={<PageTransition><ThemesPage /></PageTransition>} />
            <Route path="/themes/:themeId" element={<PageTransition><ThemesPage /></PageTransition>} />
            <Route path="/tour" element={<PageTransition><GuidedTourPage /></PageTransition>} />
            <Route path="/tour/:chapterId" element={<PageTransition><GuidedTourPage /></PageTransition>} />
            <Route path="/artwork/:artworkId" element={<PageTransition><ArtworkDetailPage /></PageTransition>} />
            <Route path="/favorites" element={<PageTransition><FavoritesPage /></PageTransition>} />
            <Route path="/compare" element={<PageTransition><ComparePage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </Routes>
          </AnimatePresence>
        </main>
        <SettingsPanel />
      </div>
    </>
  );
}

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <IntroProvider>
        <AppContent />
      </IntroProvider>
    </ErrorBoundary>
  );
}

export default App;
