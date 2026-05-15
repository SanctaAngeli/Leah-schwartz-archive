import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import peopleData from '../data/people.json';
import placesData from '../data/places.json';
import subjectsData from '../data/subjects.json';
import { usePageMeta } from '../hooks/usePageMeta';
import Constellation from '../components/index/Constellation';

interface Entity {
  id: string;
  name: string;
  display_name?: string;
  parenthetical?: string | null;
  book_pages?: number[];
}

const people = peopleData as Entity[];
const places = placesData as Entity[];
const subjects = subjectsData as Entity[];

function ConstellationPage(): JSX.Element {
  usePageMeta(
    'Constellation',
    'Navigate Leah Schwartz\'s world by association - every person, place, and subject in her index, sized by how often she returned to them.',
  );

  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <motion.header
        className="max-w-3xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-body text-text-muted uppercase tracking-[0.3em] text-xs mb-3">
          Navigate by association
        </p>
        <h1 className="font-heading text-5xl md:text-7xl text-text-primary leading-tight">
          Constellation
        </h1>
        <p className="font-leah text-text-muted mt-3 text-3xl md:text-4xl leading-none">
          the mind of the archive
        </p>
        <p className="font-body text-text-secondary mt-6 max-w-2xl mx-auto leading-relaxed">
          Every person, place, and subject in Leah's back-of-book index appears
          here as a node. The bigger the bubble, the more often she returned to
          it. Click any node to follow its thread.
        </p>
      </motion.header>

      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Constellation people={people} places={places} subjects={subjects} />
      </motion.div>

      <motion.div
        className="max-w-2xl mx-auto text-center mt-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-body text-text-muted text-sm leading-relaxed">
          Need a list instead? The same index lives at{' '}
          <Link to="/index" className="text-text-primary underline decoration-[#D5C6A8] decoration-1 underline-offset-4">
            /index
          </Link>{' '}
          with search, alphabet jumping, and category filters.
        </p>
      </motion.div>
    </main>
  );
}

export default ConstellationPage;
