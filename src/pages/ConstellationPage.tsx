import { motion } from 'framer-motion';
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
    'The people, places and subjects in the index of Leah Schwartz\'s book, as a map.',
  );

  return (
    <main className="min-h-screen pt-28 pb-24 px-6">
      <motion.header
        className="max-w-3xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-heading text-5xl md:text-7xl text-text-primary leading-tight">
          Constellation
        </h1>
      </motion.header>

      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Constellation people={people} places={places} subjects={subjects} />
      </motion.div>
    </main>
  );
}

export default ConstellationPage;
