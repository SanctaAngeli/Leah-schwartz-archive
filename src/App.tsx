import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navigation from './components/layout/Navigation';
import SkipLink from './components/layout/SkipLink';
import PageTransition from './components/layout/PageTransition';
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
import ConstellationPage from './pages/ConstellationPage';
import HomePage from './pages/HomePage';
import TourPage from './pages/TourPage';
import LocationsPage from './pages/LocationsPage';
import ThemesPage from './pages/ThemesPage';
import HerWordsPage from './pages/HerWordsPage';
import JournalsPage from './pages/JournalsPage';
import AdminPage from './pages/AdminPage';
import ArchivePage from './pages/ArchivePage';
import PeoplePage from './pages/PeoplePage';
import Breadcrumb from './components/layout/Breadcrumb';
import ScrollToTop from './components/layout/ScrollToTop';
import SiteFooter from './components/layout/SiteFooter';
import StudioCollectionPage from './pages/StudioCollectionPage';
import { ARCHITECTURE, OBJECTS } from './data/studioCollections';
import IndexPage from './pages/IndexPage';
import PlacesPage from './pages/PlacesPage';
import EntityPage from './pages/EntityPage';
import StudioPage from './pages/StudioPage';
import PreservationPage from './pages/PreservationPage';
import DailyPage from './pages/DailyPage';
import ArtworkDetailPage from './pages/ArtworkDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ComparePage from './pages/ComparePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

function AppContent(): JSX.Element {
  const location = useLocation();

  // The home page is itself the choice between the three experiences, so the
  // menu bar is hidden there; it returns on every other page.
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
        <ScrollToTop />
        <Navigation visible={showNavigation} />
        <Breadcrumb />
        <main id="main-content" className="relative z-10 focus:outline-none" tabIndex={-1}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
            {/* / is the home page with the three doors. */}
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/daily" element={<PageTransition><DailyPage /></PageTransition>} />
            {/* Retired v1 routes — permanent redirects to their living equivalents. */}
            <Route path="/gallery" element={<Navigate to="/themes" replace />} />
            <Route path="/eras" element={<Navigate to="/archive/her-life" replace />} />
            <Route path="/story" element={<Navigate to="/" replace />} />
            <Route path="/classic" element={<Navigate to="/" replace />} />
            <Route path="/timeline" element={<Navigate to="/archive/her-life" replace />} />
            <Route path="/timeline/:year" element={<Navigate to="/archive/her-life" replace />} />
            <Route path="/tour" element={<PageTransition><TourPage /></PageTransition>} />
            <Route path="/tour/:stopId" element={<PageTransition><TourPage /></PageTransition>} />
            <Route path="/curated" element={<Navigate to="/themes" replace />} />
            <Route path="/curated/:eraId" element={<Navigate to="/themes" replace />} />
            {/* Wing landings · the museum's five doors */}
            <Route path="/paintings" element={<Navigate to="/archive/paintings" replace />} />
            <Route path="/her-story" element={<Navigate to="/archive/her-words" replace />} />
            <Route path="/canvas" element={<PageTransition><CanvasPage /></PageTransition>} />
            <Route path="/atlas" element={<PageTransition><ColorAtlasPage /></PageTransition>} />
            <Route path="/obsessions" element={<PageTransition><ObsessionsPage /></PageTransition>} />
            <Route path="/at-her-age" element={<Navigate to="/archive/her-life" replace />} />
            <Route path="/last-paintings" element={<Navigate to="/paintings" replace />} />
            <Route path="/constellation" element={<PageTransition><ConstellationPage /></PageTransition>} />
            <Route path="/walk" element={<Navigate to="/tour" replace />} />
            <Route path="/studio-visit" element={<Navigate to="/studio" replace />} />
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
            <Route path="/journals" element={<PageTransition><JournalsPage /></PageTransition>} />
            <Route path="/journals/:journalId" element={<PageTransition><JournalsPage /></PageTransition>} />
            <Route path="/index" element={<PageTransition><IndexPage /></PageTransition>} />
            <Route path="/places" element={<PageTransition><PlacesPage /></PageTransition>} />
            <Route path="/places/:placeId" element={<PageTransition><PlacesPage /></PageTransition>} />
            <Route path="/people/:entityId" element={<PageTransition><EntityPage kind="person" /></PageTransition>} />
            <Route path="/subjects/:entityId" element={<PageTransition><EntityPage kind="subject" /></PageTransition>} />
            <Route path="/studio" element={<PageTransition><StudioPage /></PageTransition>} />
            <Route path="/studio/architecture" element={<PageTransition><StudioCollectionPage collection={ARCHITECTURE} description="Leah Schwartz's architectural designs: house plans, elevations and renderings, from photographs of the originals." /></PageTransition>} />
            <Route path="/studio/architecture/:itemId" element={<PageTransition><StudioCollectionPage collection={ARCHITECTURE} description="Leah Schwartz's architectural designs: house plans, elevations and renderings, from photographs of the originals." /></PageTransition>} />
            <Route path="/studio/objects" element={<PageTransition><StudioCollectionPage collection={OBJECTS} description="Leah Schwartz's found-object boxes and sculpture, from photographs of the originals." /></PageTransition>} />
            <Route path="/studio/objects/:itemId" element={<PageTransition><StudioCollectionPage collection={OBJECTS} description="Leah Schwartz's found-object boxes and sculpture, from photographs of the originals." /></PageTransition>} />
            {/* /life merged into the Her Story wing — same life, told once. */}
            <Route path="/life" element={<Navigate to="/archive/her-life" replace />} />
            <Route path="/preservation" element={<PageTransition><PreservationPage /></PageTransition>} />
            <Route path="/pairings" element={<Navigate to="/archive/paintings" replace />} />
            <Route path="/pairings/:pairingId" element={<Navigate to="/archive/paintings" replace />} />
            <Route path="/archive" element={<PageTransition><ArchivePage /></PageTransition>} />
            <Route path="/archive/people" element={<PageTransition><PeoplePage /></PageTransition>} />
            <Route path="/archive/:section" element={<PageTransition><ArchivePage /></PageTransition>} />
            <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </Routes>
          </AnimatePresence>
          <SiteFooter />
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
