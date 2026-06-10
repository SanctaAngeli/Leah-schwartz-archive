import { motion } from 'framer-motion';
import WingDoorCard from '../components/wings/WingDoorCard';
import { HER_STORY_DOORS } from '../data/wings';
import { usePageMeta } from '../hooks/usePageMeta';

// Wing landing · THE LIFE. Doors into her autobiography and biography.

function HerStoryWingPage(): JSX.Element {
  usePageMeta(
    'Her Story',
    "Leah Schwartz's life, 1920-2004 · her autobiography in her own words, her years on a slider, her life in chapters."
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
          <p className="font-body text-text-muted text-xs tracking-[0.3em] uppercase mb-4">
            The life
          </p>
          <h1 className="font-heading text-[clamp(36px,6vw,60px)] text-text-primary leading-tight">
            Her Story
          </h1>
          <p className="font-leah text-text-muted mt-3 text-3xl leading-none">
            1920 - 2004, in her own words
          </p>
          <p className="font-body text-text-secondary mt-6 leading-relaxed">
            She wrote her life down the way she painted it - direct, funny, unsparing.
            Start with the autobiography; the other doors circle the same life from
            different distances.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {HER_STORY_DOORS.map((door, i) => (
            <WingDoorCard key={door.to} door={door} index={i} />
          ))}
        </div>
      </motion.div>
    </main>
  );
}

export default HerStoryWingPage;
