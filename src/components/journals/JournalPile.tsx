import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Journal } from '../../data/journals';

// The journals as a loose pile of notebook covers. Each cover sits at a
// slightly different angle and overlaps its neighbour; hovering lifts it.

const TILTS = [-6, 4, -2, 7, -4, 3, -7, 5];
const LIFTS = [10, 0, 18, 4, 14, 2, 8, 16];

interface Props {
  journals: Journal[];
}

function JournalPile({ journals }: Props): JSX.Element {
  return (
    <ul className="flex flex-wrap justify-center items-end gap-y-10 px-4" aria-label="Journals">
      {journals.map((j, i) => {
        const tilt = TILTS[i % TILTS.length];
        return (
          <motion.li
            key={j.id}
            className="-mx-3 sm:-mx-4"
            style={{ zIndex: journals.length - i, marginTop: LIFTS[i % LIFTS.length] }}
            initial={{ opacity: 0, y: 30, rotate: tilt }}
            animate={{ opacity: 1, y: 0, rotate: tilt }}
            whileHover={{ y: -14, rotate: 0, zIndex: 50 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, delay: i * 0.06 }}
          >
            <Link
              to={`/journals/${j.id}`}
              className="group block focus:outline-none focus-visible:ring-2
                focus-visible:ring-[#8B7355]/50 rounded-md"
            >
              <img
                src={j.cover.image}
                width={j.cover.width}
                height={j.cover.height}
                alt={`Cover of her ${j.title} journal`}
                className="w-[150px] sm:w-[190px] h-auto rounded-lg shadow-glass"
              />
              <span className="block mt-4 text-center font-heading text-lg text-text-primary">
                {j.title}
              </span>
              {j.date && (
                <span className="block text-center font-body text-xs text-text-muted tracking-wider">
                  {j.date}
                </span>
              )}
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
}

export default JournalPile;
