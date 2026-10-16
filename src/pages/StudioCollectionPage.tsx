import { Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import CollectionGrid from '../components/collections/CollectionGrid';
import CollectionItemView from '../components/collections/CollectionItemView';
import { itemName } from '../data/studioCollections';
import type { Collection } from '../data/studioCollections';
import { usePageMeta } from '../hooks/usePageMeta';

// /studio/architecture and /studio/objects, plus /:itemId for one design or object.

interface Props {
  collection: Collection;
  description: string;
}

function StudioCollectionPage({ collection, description }: Props): JSX.Element {
  const { itemId } = useParams();
  const item = collection.items.find((i) => i.id === itemId);
  usePageMeta(item ? `${itemName(collection, item)} · ${collection.title}` : collection.title, description);

  if (itemId && !item) return <Navigate to={collection.path} replace />;

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <motion.div
        key={item?.id ?? 'grid'}
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {item ? (
          <CollectionItemView collection={collection} item={item} />
        ) : (
          <>
            <header className="text-center mb-14">
              <h1 className="font-heading text-[clamp(36px,6vw,60px)] text-text-primary leading-tight">
                {collection.title}
              </h1>
            </header>
            <CollectionGrid collection={collection} />
          </>
        )}
      </motion.div>
    </main>
  );
}

export default StudioCollectionPage;
