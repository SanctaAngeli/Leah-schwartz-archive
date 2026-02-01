import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PlaceholderArtwork from '../components/ui/PlaceholderArtwork';
import artworksData from '../data/artworks.json';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

function LandingPage(): JSX.Element {
  const navigate = useNavigate();

  // Create three era groupings
  const earlyWorks = artworks.filter((a) => a.year && a.year < 1975).slice(0, 9);
  const middleWorks = artworks.filter((a) => a.year && a.year >= 1975 && a.year < 1990).slice(0, 9);
  const lateWorks = artworks.filter((a) => a.year && a.year >= 1990).slice(0, 9);

  const eraGroups = [
    { title: 'Early Works', subtitle: '1963–1974', artworks: earlyWorks },
    { title: 'Middle Period', subtitle: '1975–1989', artworks: middleWorks },
    { title: 'Late Works', subtitle: '1990–2004', artworks: lateWorks },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      {/* Hero section */}
      <motion.div
        className="max-w-4xl mx-auto text-center mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <h1 className="font-heading text-[clamp(32px,6vw,64px)] text-text-primary mb-2">
          Leah Schwartz
        </h1>
        <p className="font-heading text-xl text-text-secondary italic mb-4">
          Artist
        </p>
        <p className="font-body text-text-muted mb-8">
          1945 – 2004
        </p>
        <p className="font-body text-text-secondary max-w-2xl mx-auto leading-relaxed">
          A Bay Area artist whose work captured the landscapes, people, and spirit of San Francisco
          through watercolors, oils, and mixed media across four decades of creative exploration.
        </p>
      </motion.div>

      {/* Era groupings */}
      <div className="max-w-7xl mx-auto space-y-20">
        {eraGroups.map((era, eraIndex) => (
          <motion.section
            key={era.title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + eraIndex * 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-3xl text-text-primary mb-1">
                {era.title}
              </h2>
              <p className="font-body text-text-muted text-sm tracking-wider">
                {era.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {era.artworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  className="group relative"
                >
                  <PlaceholderArtwork
                    color={artwork.placeholderColor}
                    aspectRatio={artwork.aspectRatio}
                    onClick={() => navigate(`/artwork/${artwork.id}`)}
                    className="shadow-soft group-hover:shadow-glass transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-body truncate drop-shadow-lg">
                      {artwork.title}
                    </p>
                    <p className="text-white/80 text-xs font-body">
                      {artwork.year}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
