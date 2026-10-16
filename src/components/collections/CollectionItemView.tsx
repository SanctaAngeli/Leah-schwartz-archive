import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { itemName } from '../../data/studioCollections';
import type { Collection, CollectionItem } from '../../data/studioCollections';

// One design or object: the selected photo large, her caption under it,
// and every photo of it in a strip below. Arrow keys move through them.

interface Props {
  collection: Collection;
  item: CollectionItem;
}

function CollectionItemView({ collection, item }: Props): JSX.Element {
  const [index, setIndex] = useState(0);
  const photo = item.photos[index];
  const total = item.photos.length;

  useEffect(() => setIndex(0), [item.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, total - 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  return (
    <div>
      <Link to={collection.path} className="font-body text-sm text-text-muted hover:text-text-primary transition-colors">
        ← {collection.title}
      </Link>
      <h1 className="font-heading text-4xl md:text-5xl text-text-primary mt-4 mb-8">
        {itemName(collection, item)}
      </h1>

      <div className="flex items-center justify-center min-h-[40vh] lg:h-[65vh]">
        <AnimatePresence mode="wait">
          <motion.a
            key={photo.src}
            href={photo.src}
            target="_blank"
            rel="noreferrer"
            className="block max-h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={photo.src}
              width={photo.width}
              height={photo.height}
              alt={`${item.subject}, photo ${index + 1} of ${total}`}
              className="max-h-[65vh] w-auto max-w-full h-auto rounded-lg shadow-glass"
            />
          </motion.a>
        </AnimatePresence>
      </div>
      {photo.caption && (
        <p className="font-heading text-lg text-text-secondary text-center mt-5 max-w-2xl mx-auto">
          “{photo.caption}”
        </p>
      )}

      {total > 1 && (
        <ul className="flex gap-3 overflow-x-auto mt-8 pb-2" aria-label="All photos">
          {item.photos.map((p, i) => (
            <li key={p.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Photo ${i + 1} of ${total}`}
                aria-current={i === index}
                className={`block rounded-md overflow-hidden transition-opacity ${
                  i === index ? 'ring-2 ring-[#8B7355]' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={p.thumb} alt="" loading="lazy" className="h-20 w-auto" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CollectionItemView;
