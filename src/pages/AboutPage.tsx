import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PlaceholderArtwork from '../components/ui/PlaceholderArtwork';
import artworksData from '../data/artworks.json';
import photosData from '../data/photos.json';
import type { Artwork } from '../types';
import { usePageMeta } from '../hooks/usePageMeta';

const artworks = artworksData as Artwork[];
const photos = photosData as Array<{ file: string; pdf_page: number; book_page: number; likely_photo: boolean; chroma: number }>;

// Pick a handful of strong works to tile the hero · any chapter, any year
const heroMontage = artworks.filter((a) => a.imagePath).slice(0, 8);

// Short featured strip · one painting from a range of chapters
const featuredChapters = ['old-stuff', 'social-comment', 'landscape', 'portraits', 'still-life', 'flowers', 'travel'];
const featuredArtworks = featuredChapters
  .map((c) => artworks.find((a) => a.chapter === c && a.imagePath))
  .filter(Boolean) as Artwork[];

// Biographical photos in book-page order - early life pages first, then studio
const bioPhotos = photos
  .filter((p) => p.likely_photo && p.chroma < 0.06 && p.pdf_page >= 18 && p.pdf_page <= 50)
  .slice(0, 4);

const hermanPortrait = artworks.find((a) => a.id === 'the-remarkable-herman-arthur-schwartz');

function AboutPage(): JSX.Element {
  usePageMeta('About Leah', 'Leah Schwartz (1920–2004) · Bay Area watercolorist, accidental artist, life in her own words.');
  return (
    <div className="min-h-screen">
      {/* Hero · montage of works as atmospheric backdrop */}
      <section className="relative h-[60vh] min-h-[440px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-8 opacity-[0.18]">
          {heroMontage.map((a) => (
            <div
              key={a.id}
              className="relative h-full"
              style={{ backgroundColor: a.placeholderColor }}
            >
              <img
                src={a.thumbPath || a.imagePath || ''}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-body text-text-muted uppercase tracking-[0.3em] text-xs mb-4">
            About
          </p>
          <h1 className="font-heading text-[clamp(40px,8vw,84px)] text-text-primary mb-4 leading-none">
            Leah Schwartz
          </h1>
          <p className="font-heading text-xl md:text-2xl text-text-secondary italic">
            1920 – 2004
          </p>
        </motion.div>
      </section>

      {/* Biographical intro · grounded in her autobiography · photos and Herman
          float beside the prose so the page reads like the book opening up */}
      <section className="py-20 px-6">
        <motion.div
          className="max-w-3xl mx-auto font-heading text-[18px] md:text-[19px] leading-[1.8] text-text-primary"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {bioPhotos[0] && (
            <figure className="float-right ml-8 mb-4 w-[180px] md:w-[220px] max-w-[45%] clear-right">
              <img
                src={`/photos/${bioPhotos[0].file}`}
                alt="Leah Schwartz, early years"
                loading="lazy"
                className="w-full h-auto rounded-sm shadow-[0_4px_22px_rgba(0,0,0,0.12)]"
              />
              <figcaption className="font-body text-[11px] text-text-muted tracking-wider uppercase text-center mt-2">
                Early years · from the book
              </figcaption>
            </figure>
          )}
          <p className="mb-6">
            Leah Schwartz was born in <em>Rock Island, Illinois, on July 28, 1920</em>,
            the daughter of Polish-Jewish immigrants who had passed through Ellis Island
            as Pannemanskis and walked out Greenfields. She grew up in Chicago, Boston
            and Michigan, and went to art school in New York.
          </p>
          <p className="mb-6 clear-right">
            By her own account she nearly didn't survive infancy: her father William
            disappeared from her life when her mother divorced him - <em>"the first
            divorce in the family and considered so shameful that his name was never
            mentioned, he was cut out of group pictures."</em> Her mother, sometimes
            thoughtless but never cruel, reinvented herself as a beader in the early
            twenties and put a card up in the window: <em>BEADING COLLEGE</em>.
          </p>

          {hermanPortrait?.imagePath && (
            <Link
              to={`/artwork/${hermanPortrait.id}`}
              className="group float-left mr-8 mb-4 w-[180px] md:w-[220px] max-w-[45%] block"
            >
              <img
                src={hermanPortrait.thumbPath || hermanPortrait.imagePath}
                alt="The Remarkable Herman Arthur Schwartz"
                loading="lazy"
                className="w-full h-auto rounded-sm shadow-[0_4px_22px_rgba(0,0,0,0.12)] group-hover:shadow-[0_10px_32px_rgba(0,0,0,0.20)] transition-shadow"
              />
              <p className="font-body text-[11px] text-text-muted tracking-wider uppercase text-center mt-2 not-italic">
                The Remarkable Herman
              </p>
            </Link>
          )}
          <p className="mb-6">
            She married <em>Herman Schwartz</em> - "the remarkable Herman," as she called him -
            and eventually settled in Mill Valley, California, with a weekend retreat in
            Bolinas, on a piece of land that juts out into the Pacific, separated from the
            mainland by the San Andreas Fault. She painted in her Mill Valley studio through
            the week and did "slave labor" in Bolinas on weekends. They had three sons:{' '}
            <Link to="/people/dan-schwartz" className="underline decoration-[#D5C6A8] decoration-1 underline-offset-4 hover:decoration-[#8B7355]">Dan</Link>,{' '}
            <Link to="/people/peter-schwartz" className="underline decoration-[#D5C6A8] decoration-1 underline-offset-4 hover:decoration-[#8B7355]">Peter</Link>, and{' '}
            <Link to="/people/davy-schwartz" className="underline decoration-[#D5C6A8] decoration-1 underline-offset-4 hover:decoration-[#8B7355]">Davy</Link>.
          </p>
          <p className="mb-6 clear-left">
            She was, by her own reckoning, <em>the accidental watercolorist</em>: she taught
            herself the medium by painting beetles from a library book. Across four decades
            she worked in watercolor, oil, gouache, tempera, collage and ink - over
            <em> 267 finished pieces</em> that span abstract studies, social comment, landscape,
            street scenes, portraits, still life, interiors, flowers, and travel notebooks
            from France, Italy, Greece, Turkey, Japan, India, Nepal, Kenya, Britain, the
            American desert and the High Sierra.
          </p>

          {bioPhotos[1] && (
            <figure className="float-right ml-8 mb-4 w-[180px] md:w-[220px] max-w-[45%] clear-right">
              <img
                src={`/photos/${bioPhotos[1].file}`}
                alt="Leah Schwartz, studio years"
                loading="lazy"
                className="w-full h-auto rounded-sm shadow-[0_4px_22px_rgba(0,0,0,0.12)]"
              />
              <figcaption className="font-body text-[11px] text-text-muted tracking-wider uppercase text-center mt-2">
                Studio years · from the book
              </figcaption>
            </figure>
          )}
          <p className="mb-6">
            Leah gathered this body of work into a self-published book with Strawberry Press
            in Mill Valley before her death in 2004. This site is built from that book -
            her paintings, her words, her index, her life.
          </p>

          <blockquote className="border-l-4 border-[#8B7355] pl-6 my-10 italic text-text-secondary text-[19px] leading-relaxed clear-both">
            "I love the process of what I do. I enjoy the feel of a brush on canvas,
            the smell of turpentine, the flow of color on a fresh sheet of watercolor
            paper, and the intense pleasure of making things."
            <footer className="text-sm mt-3 not-italic text-text-muted">- Leah Schwartz</footer>
          </blockquote>

          <p className="mb-8">
            Her voice is the center of this archive. Read her autobiography in her own
            words, walk through her life in chapters, or wander the collection by theme
            or place.
          </p>

          <div className="flex flex-wrap gap-3 not-italic">
            <Link
              to="/her-words"
              className="glass-pill px-5 py-2 text-sm text-text-primary hover:bg-white transition-colors"
            >
              Read her autobiography →
            </Link>
            <Link
              to="/at-her-age"
              className="glass-pill px-5 py-2 text-sm text-text-primary hover:bg-white transition-colors"
            >
              Her life, year by year →
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Quick CTAs */}
      <section className="px-6 pb-16">
        <motion.div
          className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/her-words"
            className="group glass-card p-6 text-center hover:shadow-glass transition-shadow"
          >
            <p className="font-heading text-xl text-text-primary group-hover:text-[#8B7355] transition-colors">Leah's Story</p>
            <p className="font-body text-xs text-text-muted mt-1">In her own words</p>
          </Link>
          <Link
            to="/themes"
            className="group glass-card p-6 text-center hover:shadow-glass transition-shadow"
          >
            <p className="font-heading text-xl text-text-primary group-hover:text-[#8B7355] transition-colors">Themes</p>
            <p className="font-body text-xs text-text-muted mt-1">12 chapters of work</p>
          </Link>
          <Link
            to="/locations"
            className="group glass-card p-6 text-center hover:shadow-glass transition-shadow"
          >
            <p className="font-heading text-xl text-text-primary group-hover:text-[#8B7355] transition-colors">Places</p>
            <p className="font-body text-xs text-text-muted mt-1">Bay Area + 11 travel regions</p>
          </Link>
        </motion.div>
      </section>

      {/* Featured strip · one painting per chapter */}
      {featuredArtworks.length > 0 && (
        <section className="py-16 px-6 bg-[#FBF9F5]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="font-body text-text-muted uppercase tracking-widest text-xs mb-2">
                A taste of the collection
              </p>
              <h2 className="font-heading text-3xl text-text-primary">
                One from each corner of the book
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {featuredArtworks.map((a, index) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link to={`/artwork/${a.id}`} className="group block">
                    <PlaceholderArtwork
                      src={a.thumbPath || a.imagePath}
                      alt={a.title}
                      color={a.placeholderColor}
                      aspectRatio={a.aspectRatio}
                      className="mb-2 group-hover:scale-[1.03] transition-transform shadow-soft"
                    />
                    <p className="font-body text-xs text-text-muted capitalize">
                      {a.chapter?.replace(/-/g, ' ')}
                    </p>
                    <p className="font-body text-sm text-text-primary truncate">
                      {a.display_title || a.title}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* The archive itself · the scholarly doors live in this wing */}
      <section className="px-6 py-16">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <p className="font-body text-text-muted uppercase tracking-widest text-xs mb-2">
              The archive
            </p>
            <h2 className="font-heading text-3xl text-text-primary">
              Ways to study her
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/index" className="group glass-card p-6 text-center hover:shadow-glass transition-shadow">
              <p className="font-heading text-xl text-text-primary group-hover:text-[#8B7355] transition-colors">The Index</p>
              <p className="font-body text-xs text-text-muted mt-1">Her own back-of-book index</p>
            </Link>
            <Link to="/constellation" className="group glass-card p-6 text-center hover:shadow-glass transition-shadow">
              <p className="font-heading text-xl text-text-primary group-hover:text-[#8B7355] transition-colors">Constellation</p>
              <p className="font-body text-xs text-text-muted mt-1">The mind of the archive</p>
            </Link>
            <Link to="/preservation" className="group glass-card p-6 text-center hover:shadow-glass transition-shadow">
              <p className="font-heading text-xl text-text-primary group-hover:text-[#8B7355] transition-colors">Preservation</p>
              <p className="font-body text-xs text-text-muted mt-1">Data, scans & the book PDF</p>
            </Link>
            <Link to="/favorites" className="group glass-card p-6 text-center hover:shadow-glass transition-shadow">
              <p className="font-heading text-xl text-text-primary group-hover:text-[#8B7355] transition-colors">Favorites</p>
              <p className="font-body text-xs text-text-muted mt-1">Your saved paintings</p>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Preservation note */}
      <section className="py-12 px-6 text-center">
        <p className="max-w-2xl mx-auto font-body text-sm text-text-muted leading-relaxed">
          This digital archive preserves Leah Schwartz's complete book · 267 artworks,
          28,660 words of prose, and the photographs she chose to accompany them. The
          original PDF is hosted for archivists. Built for generations, not seasons.
        </p>
        <Link
          to="/preservation"
          className="inline-block mt-6 text-xs uppercase tracking-widest font-body text-text-muted hover:text-text-primary transition-colors"
        >
          For scholars & archivists →
        </Link>
      </section>
    </div>
  );
}

export default AboutPage;
