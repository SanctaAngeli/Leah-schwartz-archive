// The Studio · a quiet, contemplative page about how Leah worked.
// Curated quotes from her autobiography + the kit she carried everywhere.

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import artworksData from '../data/artworks.json';
import photosData from '../data/photos.json';
import type { Artwork } from '../types';
import { usePageMeta } from '../hooks/usePageMeta';

const artworks = artworksData as Artwork[];
const photos = photosData as Array<{ file: string; pdf_page: number; likely_photo: boolean; chroma: number }>;

// Pick a few representative works across different media for the reel at the bottom
const techniqueReel = [
  artworks.find((a) => a.title === 'SPACE MATTER'),       // oil, abstract
  artworks.find((a) => a.title === 'MT.TAM FROM SONOMA'), // watercolor, landscape
  artworks.find((a) => a.title === 'SELF PORTRAIT'),      // tempera
  artworks.find((a) => a.title === 'ASSASSINATION'),      // oil, collage-era
  artworks.find((a) => a.title === 'KITCHEN BOUQUET'),    // collage
  artworks.find((a) => a.title === 'KEN AND ZILPHIA'),    // ink
].filter(Boolean) as Artwork[];

// Photos from her working years and family-with-art life · pulled from the
// autobiography section pages, lower-chroma (true photographs, not paintings).
const studioPhotos = photos
  .filter((p) => p.likely_photo && p.pdf_page >= 30 && p.pdf_page <= 50 && p.chroma < 0.06)
  .slice(0, 6);

// Paintings to pair with prose sections — chosen to illustrate what she's
// writing about right there in the page.
const watercolorExemplar = artworks.find((a) => a.id === 'pale-pink-rose-with-cosmos');
const stalledEraExemplar = artworks.find((a) => a.id === 'migraine');

const influences = [
  { name: 'The cave painters of Lascaux', note: '' },
  { name: 'The Flemish masters', note: 'at the Metropolitan Museum · magnifying glass on a crucifixion' },
  { name: 'Bellini · Botticelli · Boudin · Degas', note: 'the masters she grew up with' },
  { name: 'Ben Shahn', note: 'who showed her how to prepare egg-yolk emulsion' },
  { name: 'Imogen Cunningham', note: 'the photographer · on why she never shot landscapes' },
  { name: 'Richard Diebenkorn', note: '' },
];

export default function StudioPage(): JSX.Element {
  usePageMeta('The Studio', "How Leah Schwartz worked · her kit, her influences, her philosophy.");
  return (
    <main className="min-h-screen pt-24 pb-24 px-6 bg-[#FAF8F2]">
      {/* Hero */}
      <header className="max-w-3xl mx-auto text-center mb-20">
        <motion.p
          className="font-body text-text-muted uppercase tracking-[0.3em] text-xs mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          How she worked
        </motion.p>
        <motion.h1
          className="font-heading text-6xl md:text-8xl text-text-primary leading-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          The Studio
        </motion.h1>
        <motion.p
          className="font-leah text-text-muted mt-4 text-4xl md:text-5xl leading-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          the accidental watercolorist
        </motion.p>
      </header>

      {/* The compulsion · opening quote from page 1 */}
      <section className="max-w-2xl mx-auto mb-20">
        <motion.blockquote
          className="font-heading italic text-[22px] md:text-[26px] leading-[1.6] text-text-primary text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          "I love the process of what I do. I enjoy the feel of a brush on canvas,
          the smell of turpentine, the flow of color on a fresh sheet of watercolor
          paper, and the intense pleasure of making things."
          <footer className="font-body text-sm not-italic text-text-muted mt-6 tracking-wider">
            · LEAH SCHWARTZ · PAGE 1
          </footer>
        </motion.blockquote>
      </section>

      {/* Leah, working · photographs from the studio years · moved up because
          they answer "who" before the words do */}
      {studioPhotos.length > 0 && (
        <section className="max-w-5xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-body text-center text-text-muted uppercase tracking-[0.3em] text-xs mb-3">
              Leah, working
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-text-primary text-center mb-10">
              Photographs from the studio years
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {studioPhotos.map((p, idx) => (
                <figure
                  key={p.file}
                  className={`${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                >
                  <img
                    src={`/photos/${p.file}`}
                    alt="Leah Schwartz photograph"
                    loading="lazy"
                    className="w-full h-auto rounded-md shadow-[0_8px_28px_rgba(0,0,0,0.10)]"
                  />
                </figure>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* The accidental watercolorist · how she began · with a watercolor exemplar
          floating beside the prose */}
      <section className="max-w-4xl mx-auto mb-24">
        <motion.div
          className="font-heading text-[18px] leading-[1.85] text-text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl text-text-primary mb-6 clear-both">
            How she found watercolor
          </h2>
          {watercolorExemplar?.imagePath && (
            <Link
              to={`/artwork/${watercolorExemplar.id}`}
              className="group float-right ml-8 mb-4 w-[180px] md:w-[220px] max-w-[45%] block"
            >
              <img
                src={watercolorExemplar.thumbPath || watercolorExemplar.imagePath}
                alt={watercolorExemplar.display_title || watercolorExemplar.title}
                loading="lazy"
                className="w-full h-auto rounded-sm shadow-[0_4px_22px_rgba(0,0,0,0.12)] group-hover:shadow-[0_10px_32px_rgba(0,0,0,0.20)] transition-shadow duration-300"
              />
              <p className="font-body text-[11px] text-text-muted tracking-wider uppercase text-center mt-2 not-italic">
                {watercolorExemplar.display_title || watercolorExemplar.title}
              </p>
            </Link>
          )}
          <p className="mb-5">
            One fine day, while browsing the shelves of the Marin County Library,
            she found a large volume of color photographs of beetles from all over
            the world. She was so taken with their color and bizarre forms that she
            went right out and bought watercolors, brushes and paper and tried to
            paint them.
          </p>
          <p className="mb-5">
            She hadn't painted with watercolors since she was a kid, but she
            remembered reading that one should wet the whole paper first, so she did,
            and painted whole reams of soft-edged messes before learning a little
            control. <em>"The trick with watercolor,"</em> she wrote, <em>"is to let
            the color flow but not to let it get away from you."</em>
          </p>
        </motion.div>
      </section>

      {/* The kit · her travel watercolor setup */}
      <section className="max-w-4xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl text-text-primary text-center mb-3">
            The kit she carried everywhere
          </h2>
          <p className="font-body text-center text-text-muted italic mb-10">
            "I travel light, with one carry-on bag and a small backpack…"
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            {[
              { item: 'Small plastic paintbox', detail: 'pocket-sized, lived in the backpack' },
              { item: 'Two good watercolor brushes', detail: 'no more, no less' },
              { item: 'Sketch book', detail: 'paper for wet-on-wet experiments' },
              { item: 'Small water bottle', detail: 'the crucial one' },
              { item: 'A chocolate bar', detail: 'fuel' },
              { item: 'Quilted tea-cozy', detail: 'doubled as a cushion' },
              { item: 'Dime-store notebook', detail: 'for daily travel notes' },
              { item: 'Camera', detail: 'black-and-white photographs on location' },
            ].map((k) => (
              <div
                key={k.item}
                className="glass-card p-5 text-left"
              >
                <p className="font-heading text-[17px] text-text-primary leading-snug">
                  {k.item}
                </p>
                <p className="font-body text-xs text-text-muted mt-2 italic">
                  {k.detail}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Influences */}
      <section className="max-w-2xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl text-text-primary mb-3">
            Whom she admired
          </h2>
          <p className="font-body text-text-muted italic mb-8">
            "I admire many painters, from the cave painters of Lascaux to Diebenkorn."
          </p>
          <ul className="space-y-4">
            {influences.map((i) => (
              <li
                key={i.name}
                className="flex items-baseline justify-between gap-4 pb-3 border-b border-[#E8E2D5]"
              >
                <span className="font-heading text-[18px] text-text-primary">
                  {i.name}
                </span>
                {i.note && (
                  <span className="font-body text-xs text-text-muted italic text-right max-w-[60%]">
                    {i.note}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* When the work stalled · with a dark-period oil floating in the margin */}
      <section className="max-w-4xl mx-auto mb-24">
        <motion.div
          className="font-heading text-[18px] leading-[1.85] text-text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl text-text-primary mb-6 clear-both">
            When the work stalled
          </h2>
          {stalledEraExemplar?.imagePath && (
            <Link
              to={`/artwork/${stalledEraExemplar.id}`}
              className="group float-left mr-8 mb-4 w-[180px] md:w-[220px] max-w-[45%] block"
            >
              <img
                src={stalledEraExemplar.thumbPath || stalledEraExemplar.imagePath}
                alt={stalledEraExemplar.display_title || stalledEraExemplar.title}
                loading="lazy"
                className="w-full h-auto rounded-sm shadow-[0_4px_22px_rgba(0,0,0,0.12)] group-hover:shadow-[0_10px_32px_rgba(0,0,0,0.20)] transition-shadow duration-300"
              />
              <p className="font-body text-[11px] text-text-muted tracking-wider uppercase text-center mt-2 not-italic">
                {stalledEraExemplar.display_title || stalledEraExemplar.title}
              </p>
            </Link>
          )}
          <p className="mb-5">
            When Peter and Davy were in high school, she painted intensely for months
            at a time and would then hit a "slump," which would usually pass in a
            month or two. Twice she had year-long <em>painter's block</em>.
          </p>
          <p className="mb-5">
            During one of those painful times she took ceramics classes at the local
            college and learned to throw pots on the wheel. During another slump she
            studied photography, turned a bathroom into a darkroom, and spent days
            trying to make good prints from lousy negatives.
          </p>
          <p>
            <em>"Being 'number-blind' has been an embarrassment all my life,"</em>{' '}
            she wrote about failing to master Ansel Adams' zone system · but the
            search for other hands to use kept the working body alive.
          </p>
        </motion.div>
      </section>

      {/* Philosophy quote */}
      <section className="max-w-3xl mx-auto mb-24">
        <motion.blockquote
          className="relative border-l-4 border-[#8B7355] pl-8 py-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-heading italic text-[20px] md:text-[22px] leading-[1.7] text-text-primary">
            "One of my students once asked me if I would say something about my
            philosophy of painting, who were the artists I admire, and why I paint.
            I mouthed some vague generalities, caught myself and said I'd have to
            think about it. After a while I said, <strong>'I guess I don't know
            what a philosophy of painting is, I just do it.'</strong>"
          </p>
          <footer className="font-body text-sm text-text-muted mt-4 tracking-wider">
            · LEAH SCHWARTZ
          </footer>
        </motion.blockquote>
      </section>

      {/* Every medium she used · small reel of works */}
      {techniqueReel.length > 0 && (
        <section className="max-w-5xl mx-auto mb-24">
          <h2 className="font-heading text-3xl text-text-primary text-center mb-3">
            Every medium she reached for
          </h2>
          <p className="font-body text-center text-text-muted mb-10">
            One piece from each: oil, watercolor, tempera, collage, mixed media, ink.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {techniqueReel.map((a) => (
              <Link key={a.id} to={`/artwork/${a.id}`} className="group block">
                <div
                  className="aspect-square relative rounded-md overflow-hidden shadow-soft group-hover:shadow-glass transition-shadow"
                  style={{ backgroundColor: a.placeholderColor }}
                >
                  {a.imagePath && (
                    <img
                      src={a.thumbPath || a.imagePath}
                      alt={a.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </div>
                <p className="font-body text-[11px] text-text-muted uppercase tracking-widest mt-2 truncate">
                  {a.medium}
                </p>
                <p className="font-body text-sm text-text-primary truncate">
                  {a.display_title || a.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Outgoing link */}
      <section className="max-w-2xl mx-auto text-center">
        <Link
          to="/her-words/autobiography"
          className="inline-block glass-pill px-6 py-3 font-body text-sm text-text-primary hover:shadow-glass transition-shadow"
        >
          Continue into her autobiography →
        </Link>
      </section>
    </main>
  );
}
