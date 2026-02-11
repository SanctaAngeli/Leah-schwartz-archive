import { motion } from 'framer-motion';
import EraPile from '../components/home/EraPile';
import artworksData from '../data/artworks.json';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

function LandingPage(): JSX.Element {
  // Create three era groupings with more artworks
  const earlyWorks = artworks.filter((a) => a.year && a.year < 1975);
  const middleWorks = artworks.filter((a) => a.year && a.year >= 1975 && a.year < 1990);
  const lateWorks = artworks.filter((a) => a.year && a.year >= 1990);

  const eraGroups = [
    { title: 'Early Works', subtitle: '1963–1974', artworks: earlyWorks },
    { title: 'Middle Period', subtitle: '1975–1989', artworks: middleWorks },
    { title: 'Late Works', subtitle: '1990–2004', artworks: lateWorks },
  ];

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      {/* Hero section */}
      <motion.header
        className="max-w-4xl mx-auto text-center mb-24"
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
      </motion.header>

      {/* Era piles - click to expand into grid */}
      <div className="max-w-7xl mx-auto">
        <motion.p
          className="text-center text-text-muted text-sm mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Click a collection to explore
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {eraGroups.map((era, index) => (
            <EraPile
              key={era.title}
              title={era.title}
              subtitle={era.subtitle}
              artworks={era.artworks}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* View all link */}
      <motion.div
        className="text-center mt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <a
          href="/timeline"
          className="glass-pill px-8 py-3 inline-block text-text-primary font-medium
            hover:bg-white/90 transition-all duration-200"
        >
          View Timeline
        </a>
      </motion.div>
    </main>
  );
}

export default LandingPage;
