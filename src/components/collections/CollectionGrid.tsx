import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { itemName } from '../../data/studioCollections';
import type { Collection } from '../../data/studioCollections';

// One card per design or object: its first photo, its title (or the
// collection's "untitled" label) and how many photos it has.

interface Props {
  collection: Collection;
}

function CollectionGrid({ collection }: Props): JSX.Element {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {collection.items.map((item, i) => {
        const cover = item.photos[0];
        return (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(i, 12) * 0.04, ease: [0.4, 0, 0.2, 1] }}
          >
            <Link
              to={`${collection.path}/${item.id}`}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7355]/50 rounded-2xl"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white/60 shadow-soft group-hover:shadow-glass transition-shadow duration-500">
                <img
                  src={cover.thumb}
                  alt={item.subject}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <span className="block mt-3 font-heading text-lg text-text-primary leading-snug">
                {itemName(collection, item)}
              </span>
              <span className="block font-body text-xs text-text-muted">
                {item.photos.length} {item.photos.length === 1 ? 'photo' : 'photos'}
              </span>
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
}

export default CollectionGrid;
