import { motion } from 'framer-motion';
import WingDoorCard from '../components/wings/WingDoorCard';
import { PAINTINGS_DOORS } from '../data/wings';
import { usePageMeta } from '../hooks/usePageMeta';

// Wing landing · THE WORK. Doors into the paintings.

function PaintingsWingPage(): JSX.Element {
  usePageMeta(
    'Paintings',
    'The paintings of Leah Schwartz: the canvas, the chapters of her book, the color atlas, obsessions and pairings.'
  );

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <header className="text-center mb-14 max-w-2xl mx-auto">
          <h1 className="font-heading text-[clamp(36px,6vw,60px)] text-text-primary leading-tight">
            Paintings
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PAINTINGS_DOORS.map((door, i) => (
            <WingDoorCard key={door.to} door={door} index={i} />
          ))}
        </div>
      </motion.div>
    </main>
  );
}

export default PaintingsWingPage;
