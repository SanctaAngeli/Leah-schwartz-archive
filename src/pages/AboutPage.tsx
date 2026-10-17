import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PlaceholderArtwork from '../components/ui/PlaceholderArtwork';
import artworksData from '../data/artworks.json';
import photosData from '../data/photos.json';
import type { Artwork } from '../types';
import { usePageMeta } from '../hooks/usePageMeta';
import { ARTIST_STATEMENT } from '../data/statement';

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
  usePageMeta('About Leah', 'Leah Schwartz (1920–2017), painter, Mill Valley, California. Her life and work, from her own book.');
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
          <h1 className="font-heading text-[clamp(40px,8vw,84px)] text-text-primary mb-4 leading-none">
            Leah Schwartz
          </h1>
          <p className="font-heading text-xl md:text-2xl text-text-secondary italic">
            1920 – 2017
          </p>
        </motion.div>
      </section>

      {/* Her artist statement · verbatim, from her own website (leahschwartzart.com) */}
      <section className="pt-20 px-6">
        <motion.blockquote
          className="max-w-3xl mx-auto border-l-4 border-[#8B7355] pl-6 font-heading italic text-text-secondary text-[19px] leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {ARTIST_STATEMENT.map((para, i) => (
            <p key={i} className="mb-5 last:mb-0">{para}</p>
          ))}
          <footer className="text-sm mt-4 not-italic text-text-muted">- Leah Schwartz</footer>
        </motion.blockquote>
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
            Leah Schwartz was born in <em>Rock Island, Illinois, on July 28, 1920</em>.
            Her mother's family, the Pannemanskis, had emigrated from Poland and were
            renamed Greenfield at Ellis Island. She grew up in Chicago, Los Angeles,
            Michigan and New Jersey, and went to art school in New York.
          </p>
          <p className="mb-6 clear-right">
            Her father, William Ammerman, disappeared from her life when her mother
            divorced him - <em>"the first divorce in the family and considered so
            shameful that his name was never mentioned, he was cut out of group
            pictures."</em>
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
            She met <em>Herman Schwartz</em>, then a Harvard medical student, while she was
            working in San Francisco, and they married in Boston on November 1, 1952. She
            dedicated her book to "the remarkable Herman Schwartz." They settled in Mill
            Valley, California. She painted in her Mill Valley studio during the week and did
            "slave labor" in Bolinas on weekends; Bolinas is on a piece of land that juts out
            into the Pacific, separated from the mainland by the San Andreas Fault. She had
            three sons:{' '}
            <Link to="/people/drasin-daniel" className="underline decoration-[#D5C6A8] decoration-1 underline-offset-4 hover:decoration-[#8B7355]">Daniel</Link>,
            with her first husband Lee Drasin, and{' '}
            <Link to="/people/schwartz-peter" className="underline decoration-[#D5C6A8] decoration-1 underline-offset-4 hover:decoration-[#8B7355]">Peter</Link> and{' '}
            <Link to="/people/schwartz-david" className="underline decoration-[#D5C6A8] decoration-1 underline-offset-4 hover:decoration-[#8B7355]">David</Link>{' '}
            with Herman.
          </p>
          <p className="mb-6 clear-left">
            She called herself <em>the accidental watercolorist</em>: she taught herself the
            medium by painting beetles from a book she found in the Marin County Library. She
            worked in watercolor, oil, gouache, tempera, collage and ink - abstract studies,
            social comment, landscape, street scenes, portraits, still life, interiors,
            flowers, and travel sketches from France, Italy, Greece, Turkey, Japan, India,
            Nepal, Kenya, Britain, the American desert and the High Sierra.
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
                From the book
              </figcaption>
            </figure>
          )}
          <p className="mb-6">
            Her book was published in 1990 by Strawberry Press, Mill Valley.
          </p>

          <blockquote className="border-l-4 border-[#8B7355] pl-6 my-10 italic text-text-secondary text-[19px] leading-relaxed clear-both">
            "I love the process of what I do. I enjoy the feel of a brush on canvas,
            the smell of turpentine, the flow of color on a fresh sheet of watercolor
            paper, and the intense pleasure of making things."
            <footer className="text-sm mt-3 not-italic text-text-muted">- Leah Schwartz</footer>
          </blockquote>

          <div className="flex flex-wrap gap-3 not-italic">
            <Link
              to="/her-words"
              className="glass-pill px-5 py-2 text-sm text-text-primary hover:bg-white transition-colors"
            >
              Read her autobiography →
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
            <p className="font-body text-xs text-text-muted mt-1">Her autobiography</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/index" className="group glass-card p-6 text-center hover:shadow-glass transition-shadow">
              <p className="font-heading text-xl text-text-primary group-hover:text-[#8B7355] transition-colors">The Index</p>
              <p className="font-body text-xs text-text-muted mt-1">The book's index</p>
            </Link>
            <Link to="/constellation" className="group glass-card p-6 text-center hover:shadow-glass transition-shadow">
              <p className="font-heading text-xl text-text-primary group-hover:text-[#8B7355] transition-colors">Constellation</p>
              <p className="font-body text-xs text-text-muted mt-1">People, places and subjects</p>
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
        <Link
          to="/preservation"
          className="inline-block text-xs uppercase tracking-widest font-body text-text-muted hover:text-text-primary transition-colors"
        >
          For scholars & archivists →
        </Link>
      </section>
    </div>
  );
}

export default AboutPage;
