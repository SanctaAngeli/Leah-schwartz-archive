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
import { ShortcutsProvider } from './hooks/useGlobalShortcuts';
import ScrollStoryPage from './pages/ScrollStoryPage';
import CanvasPage from './pages/CanvasPage';
import CuratedGalleryPage from './pages/CuratedGalleryPage';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import TimelinePage from './pages/TimelinePage';
import LocationsPage from './pages/LocationsPage';
import ThemesPage from './pages/ThemesPage';
import GuidedTourPage from './pages/GuidedTourPage';
import HerWordsPage from './pages/HerWordsPage';
import IndexPage from './pages/IndexPage';
import PlacesPage from './pages/PlacesPage';
import EntityPage from './pages/EntityPage';
import StudioPage from './pages/StudioPage';
import LifePage from './pages/LifePage';
import PreservationPage from './pages/PreservationPage';
import DailyPage from './pages/DailyPage';
import PairingsPage from './pages/PairingsPage';
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
            {/* / is the Painting of the Day. /story parks the scroll-story. /gallery is the era-pile browse. */}
            <Route path="/" element={<PageTransition><DailyPage /></PageTransition>} />
            <Route path="/gallery" element={<PageTransition><LandingPage /></PageTransition>} />
            <Route path="/canvas" element={<PageTransition><CanvasPage /></PageTransition>} />
            <Route path="/story" element={<PageTransition><ScrollStoryPage /></PageTransition>} />
            <Route path="/curated" element={<PageTransition><CuratedGalleryPage /></PageTransition>} />
            <Route path="/curated/:eraId" element={<PageTransition><CuratedGalleryPage /></PageTransition>} />
            <Route path="/classic" element={<PageTransition><HomePage /></PageTransition>} />
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
            <Route path="/her-words" element={<PageTransition><HerWordsPage /></PageTransition>} />
            <Route path="/her-words/:sectionId" element={<PageTransition><HerWordsPage /></PageTransition>} />
            <Route path="/index" element={<PageTransition><IndexPage /></PageTransition>} />
            <Route path="/places" element={<PageTransition><PlacesPage /></PageTransition>} />
            <Route path="/places/:placeId" element={<PageTransition><PlacesPage /></PageTransition>} />
            <Route path="/people/:entityId" element={<PageTransition><EntityPage kind="person" /></PageTransition>} />
            <Route path="/subjects/:entityId" element={<PageTransition><EntityPage kind="subject" /></PageTransition>} />
            <Route path="/studio" element={<PageTransition><StudioPage /></PageTransition>} />
            <Route path="/life" element={<PageTransition><LifePage /></PageTransition>} />
            <Route path="/preservation" element={<PageTransition><PreservationPage /></PageTransition>} />
            <Route path="/pairings" element={<PageTransition><PairingsPage /></PageTransition>} />
            <Route path="/pairings/:pairingId" element={<PageTransition><PairingsPage /></PageTransition>} />
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
        <ShortcutsProvider>
          <AppContent />
        </ShortcutsProvider>
      </IntroProvider>
    </ErrorBoundary>
  );
}

export default App;
