import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/layout/Navigation';
import SkipLink from './components/layout/SkipLink';
import PageTransition from './components/layout/PageTransition';
import ContinueRail from './components/layout/ContinueRail';
import ErrorBoundary from './components/ui/ErrorBoundary';
import SettingsPanel from './components/ui/SettingsPanel';
import WatercolorShader from './components/home/WatercolorShader';
import AccentWashShader from './components/ui/AccentWashShader';
import { getAccent } from './data/chapterAccents';
import { IntroProvider } from './hooks/useIntroComplete';
import { ShortcutsProvider } from './hooks/useGlobalShortcuts';
import CanvasPage from './pages/CanvasPage';
import ColorAtlasPage from './pages/ColorAtlasPage';
import ObsessionsPage from './pages/ObsessionsPage';
import AtHerAgePage from './pages/AtHerAgePage';
import LastPaintingsPage from './pages/LastPaintingsPage';
import ConstellationPage from './pages/ConstellationPage';
import WalkWithHerPage from './pages/WalkWithHerPage';
import StudioVisitPage from './pages/StudioVisitPage';
import FrontDoorPage from './pages/FrontDoorPage';
import PaintingsWingPage from './pages/PaintingsWingPage';
import HerStoryWingPage from './pages/HerStoryWingPage';
import LocationsPage from './pages/LocationsPage';
import ThemesPage from './pages/ThemesPage';
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

  // The front door is a single reverent painting with its own foot directory,
  // so the global pill nav is hidden there; it returns on every other page.
  // The artwork lightbox is also chrome-free: it covers the full screen with
  // its own close/zoom controls, and on small screens the pill collides with them.
  const showNavigation =
    location.pathname !== '/' && !location.pathname.startsWith('/artwork/');

  return (
    <>
      <SkipLink />
      <div className="min-h-screen bg-bg-gallery transition-colors duration-500 relative">
        {(() => {
          // Individual chapter rooms (/themes/:id) get that chapter's accent wash.
          // Everywhere else gets the home page's cream + three-pigment watercolor,
          // so the whole site shares one paper-and-pigment texture.
          const chapterMatch = location.pathname.match(/^\/themes\/([^/]+)\/?$/);
          if (chapterMatch) {
            return <AccentWashShader accent={getAccent(chapterMatch[1]).accent} />;
          }
          return <WatercolorShader />;
        })()}
        <Navigation visible={showNavigation} />
        <main id="main-content" className="relative z-10 focus:outline-none" tabIndex={-1}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
            {/* / is the front door · /daily is the returning-visitor ritual. */}
            <Route path="/" element={<PageTransition><FrontDoorPage /></PageTransition>} />
            <Route path="/daily" element={<PageTransition><DailyPage /></PageTransition>} />
            {/* Retired v1 routes — permanent redirects to their living equivalents. */}
            <Route path="/gallery" element={<Navigate to="/themes" replace />} />
            <Route path="/eras" element={<Navigate to="/at-her-age" replace />} />
            <Route path="/story" element={<Navigate to="/" replace />} />
            <Route path="/classic" element={<Navigate to="/" replace />} />
            <Route path="/timeline" element={<Navigate to="/at-her-age" replace />} />
            <Route path="/timeline/:year" element={<Navigate to="/at-her-age" replace />} />
            <Route path="/tour" element={<Navigate to="/themes" replace />} />
            <Route path="/tour/:chapterId" element={<Navigate to="/themes" replace />} />
            <Route path="/curated" element={<Navigate to="/themes" replace />} />
            <Route path="/curated/:eraId" element={<Navigate to="/themes" replace />} />
            {/* Wing landings · the museum's five doors */}
            <Route path="/paintings" element={<PageTransition><PaintingsWingPage /></PageTransition>} />
            <Route path="/her-story" element={<PageTransition><HerStoryWingPage /></PageTransition>} />
            <Route path="/canvas" element={<PageTransition><CanvasPage /></PageTransition>} />
            <Route path="/atlas" element={<PageTransition><ColorAtlasPage /></PageTransition>} />
            <Route path="/obsessions" element={<PageTransition><ObsessionsPage /></PageTransition>} />
            <Route path="/at-her-age" element={<PageTransition><AtHerAgePage /></PageTransition>} />
            <Route path="/last-paintings" element={<PageTransition><LastPaintingsPage /></PageTransition>} />
            <Route path="/constellation" element={<PageTransition><ConstellationPage /></PageTransition>} />
            <Route path="/walk" element={<PageTransition><WalkWithHerPage /></PageTransition>} />
            <Route path="/studio-visit" element={<PageTransition><StudioVisitPage /></PageTransition>} />
            <Route path="/locations" element={<PageTransition><LocationsPage /></PageTransition>} />
            <Route path="/locations/:locationId" element={<PageTransition><LocationsPage /></PageTransition>} />
            <Route path="/themes" element={<PageTransition><ThemesPage /></PageTransition>} />
            <Route path="/themes/:themeId" element={<PageTransition><ThemesPage /></PageTransition>} />
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
          <ContinueRail />
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
