import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSearch } from '../hooks/useSearch';

// The home page: her name, and the three ways to visit. Nothing else, so
// the choice is the only thing on the page.

const ARCHIVE_THUMBS = ['spring-thicket', 'three-red-pears', 'west-marin-dairy-farm', 'temple-steps-udaipur', 'amazing-grace', 'purple-iris-thicket'];

const DOORS = [
  { title: 'Take the guided tour', to: '/tour', image: '/video/leah-reads-her-journal.jpg' },
  { title: 'Explore her studio', to: '/studio', image: '/studio/studio-table.jpg' },
  { title: 'Browse the archive', to: '/archive', image: null },
];

function HomePage(): JSX.Element {
  usePageMeta('', 'Leah Schwartz (1920–2017), painter, Mill Valley, California. Her paintings, her book and her journals.');
  const { open: openSearch } = useSearch();

  return (
    <main className="min-h-screen flex flex-col justify-center px-6 py-16">
      <motion.div
        className="max-w-6xl w-full mx-auto"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <header className="text-center mb-12 md:mb-16">
          <h1 className="font-heading text-[clamp(44px,7vw,80px)] text-text-primary leading-none">Leah Schwartz</h1>
          <p className="font-body text-text-muted tracking-[0.2em] mt-4">1920 – 2017</p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {DOORS.map((d, i) => (
            <motion.li
              key={d.to}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.4, 0, 0.2, 1] }}
            >
              <Link
                to={d.to}
                className="group block rounded-3xl glass-card p-3 hover:shadow-glass transition-shadow duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7355]/60"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white/60">
                  {d.image ? (
                    <img src={d.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  ) : (
                    <div className="grid grid-cols-3 grid-rows-2 gap-1 w-full h-full p-1">
                      {ARCHIVE_THUMBS.map((id) => (
                        <img key={id} src={`/artworks/thumb/${id}.jpg`} alt="" className="w-full h-full object-cover rounded-md" />
                      ))}
                    </div>
                  )}
                </div>
                <span className="block text-center font-heading text-2xl md:text-[26px] text-text-primary py-5">
                  {d.title}
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>

        <p className="text-center mt-10">
          <button type="button" onClick={openSearch} className="font-body text-sm text-text-muted hover:text-text-primary underline underline-offset-4">
            Search the archive
          </button>
        </p>
      </motion.div>
    </main>
  );
}

export default HomePage;
