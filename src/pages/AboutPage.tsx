import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PlaceholderArtwork from '../components/ui/PlaceholderArtwork';
import artworksData from '../data/artworks.json';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

// Get featured artworks for the biography page
const featuredArtworks = artworks.filter(a => a.featured).slice(0, 4);

// Life periods for the timeline
const lifePeriods = [
  {
    years: '1945–1963',
    title: 'Early Years',
    description: 'Born in San Francisco during the final days of World War II. Grew up surrounded by the beauty of the Bay Area, developing an early appreciation for light, color, and the natural landscape that would define her artistic vision.',
  },
  {
    years: '1963–1974',
    title: 'Artistic Foundation',
    description: 'Formal training in art followed by years of experimentation and self-discovery. This period saw the development of her distinctive watercolor technique and her deep connection to the landscapes of Mount Tamalpais and the Marin Headlands.',
  },
  {
    years: '1975–1989',
    title: 'Mature Period',
    description: 'A prolific era marked by exploration across multiple mediums—oils, watercolors, and mixed media. Her work during this time reflects both personal growth as a mother and artist, and engagement with the social movements of the era.',
  },
  {
    years: '1990–2004',
    title: 'Late Works',
    description: 'The final chapter of her artistic journey, characterized by a return to intimate subjects—family, garden, and the quiet moments of domestic life. These works reveal a contemplative depth and mastery of light.',
  },
];

function AboutPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background artworks */}
        <div className="absolute inset-0 grid grid-cols-4 opacity-20">
          {featuredArtworks.map((artwork) => (
            <div
              key={artwork.id}
              className="h-full"
              style={{ backgroundColor: artwork.placeholderColor }}
            />
          ))}
        </div>

        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-heading text-[clamp(40px,8vw,80px)] text-text-primary mb-4">
            Leah Schwartz
          </h1>
          <p className="font-heading text-xl md:text-2xl text-text-secondary italic">
            1945 – 2004
          </p>
        </motion.div>
      </section>

      {/* Introduction */}
      <section className="py-20 px-6">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-body text-lg text-text-secondary leading-relaxed mb-6">
            Leah Schwartz was a Bay Area artist whose work captured the landscapes, people,
            and spirit of San Francisco through watercolors, oils, and mixed media across
            four decades of creative exploration.
          </p>
          <p className="font-body text-lg text-text-secondary leading-relaxed mb-6">
            Born during the final days of World War II, she came of age during San Francisco's
            cultural renaissance of the 1960s. Her work reflects both the natural beauty of
            Northern California—the fog-shrouded Golden Gate, the redwood forests of Muir Woods,
            the wildflower meadows of Mount Tamalpais—and the human stories that unfolded against
            this backdrop.
          </p>
          <p className="font-body text-lg text-text-secondary leading-relaxed">
            This digital archive presents her complete body of work: over 70 paintings,
            sketches, and mixed media pieces spanning from her student days to her final
            works. Each piece tells a story of a place, a moment, or a person who mattered.
          </p>
        </motion.div>
      </section>

      {/* Life timeline */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="font-heading text-3xl text-text-primary text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            A Life in Art
          </motion.h2>

          <div className="space-y-12">
            {lifePeriods.map((period, index) => (
              <motion.div
                key={period.years}
                className="flex flex-col md:flex-row gap-6"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="md:w-32 flex-shrink-0">
                  <p className="font-heading text-lg text-text-primary font-medium">
                    {period.years}
                  </p>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-xl text-text-primary mb-2">
                    {period.title}
                  </h3>
                  <p className="font-body text-text-secondary leading-relaxed">
                    {period.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="font-heading text-3xl text-text-primary text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Featured Works
          </motion.h2>
          <motion.p
            className="font-body text-text-muted text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            A selection of significant pieces from across her career
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredArtworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/artwork/${artwork.id}`} className="group block">
                  <PlaceholderArtwork
                    color={artwork.placeholderColor}
                    aspectRatio={artwork.aspectRatio}
                    className="mb-2 group-hover:scale-[1.02] transition-transform shadow-soft"
                  />
                  <p className="font-body text-sm text-text-primary truncate">
                    {artwork.title}
                  </p>
                  <p className="font-body text-xs text-text-muted">
                    {artwork.year}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Artistic philosophy */}
      <section className="py-20 px-6 bg-gray-50">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <svg className="w-12 h-12 mx-auto mb-6 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="font-heading text-2xl md:text-3xl text-text-primary italic mb-6">
            "I paint what I see, but more importantly, I paint what I feel when I see it.
            The fog rolling over the hills, the way light falls on a child's face—these
            moments are fleeting, but paint can make them eternal."
          </blockquote>
          <cite className="font-body text-text-muted not-italic">
            — Leah Schwartz, 1987
          </cite>
        </motion.div>
      </section>

      {/* Call to action */}
      <section className="py-20 px-6">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-2xl text-text-primary mb-4">
            Explore the Collection
          </h2>
          <p className="font-body text-text-secondary mb-8">
            Discover the full archive of Leah's work through our interactive gallery,
            timeline, and curated tours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/gallery"
              className="glass-pill px-8 py-3 text-text-primary font-medium
                hover:bg-white/90 transition-colors"
            >
              View Gallery
            </Link>
            <Link
              to="/timeline"
              className="glass-pill px-8 py-3 text-text-primary font-medium
                hover:bg-white/90 transition-colors"
            >
              Explore Timeline
            </Link>
            <Link
              to="/tour"
              className="glass-pill px-8 py-3 text-text-primary font-medium
                hover:bg-white/90 transition-colors"
            >
              Take Guided Tour
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default AboutPage;
