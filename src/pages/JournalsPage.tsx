import { Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import JournalPile from '../components/journals/JournalPile';
import JournalReader from '../components/journals/JournalReader';
import { JOURNALS, JOURNAL_VIDEO, getJournal } from '../data/journals';
import { usePageMeta } from '../hooks/usePageMeta';

// /journals shows the pile of notebooks and the video of Leah reading.
// /journals/:journalId opens one notebook; the video is not shown there.

function JournalsPage(): JSX.Element {
  const { journalId } = useParams();
  const journal = getJournal(journalId);
  usePageMeta(
    journal ? `${journal.title} journal` : 'Journals',
    'Leah Schwartz (1920–2017). Scans of her handwritten journals with transcriptions.'
  );

  if (journalId && !journal) return <Navigate to="/journals" replace />;

  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <motion.div
        key={journal?.id ?? 'pile'}
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {journal ? (
          <JournalReader journal={journal} />
        ) : (
          <>
            <header className="text-center mb-16">
              <h1 className="font-heading text-[clamp(36px,6vw,60px)] text-text-primary leading-tight">
                Journals
              </h1>
            </header>
            <JournalPile journals={JOURNALS} />
            <section className="max-w-3xl mx-auto mt-24" aria-label="Leah reading from her journal">
              <video
                controls
                preload="none"
                playsInline
                poster={JOURNAL_VIDEO.poster}
                width={JOURNAL_VIDEO.width}
                height={JOURNAL_VIDEO.height}
                className="w-full h-auto rounded-2xl shadow-glass bg-black"
              >
                <source src={JOURNAL_VIDEO.src} type="video/mp4" />
              </video>
              <p className="font-heading text-lg text-text-secondary text-center mt-4">
                Leah reading from her journal
              </p>
            </section>
          </>
        )}
      </motion.div>
    </main>
  );
}

export default JournalsPage;
