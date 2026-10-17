import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ARCHIVE } from '../data/siteTree';
import LeahIntro from '../components/archive/LeahIntro';
import NodeCard from '../components/archive/NodeCard';
import ArchiveTreeLinks from '../components/layout/ArchiveTreeLinks';
import PaintingBrowser from '../components/archive/PaintingBrowser';
import { usePageMeta } from '../hooks/usePageMeta';

// /archive: who Leah was, then the six sections.
// /archive/:section: that section's pages as cards, with the whole tree
// alongside so you can always see where else to go.

function ArchivePage(): JSX.Element {
  const { section: sectionSlug } = useParams();
  const section = sectionSlug ? ARCHIVE.children?.find((s) => s.path === `/archive/${sectionSlug}`) : undefined;
  usePageMeta(
    section ? section.title : 'Browse the archive',
    'The Leah Schwartz archive: her paintings, her book, her journals, places, studio and index.'
  );

  if (sectionSlug && !section) return <Navigate to="/archive" replace />;

  if (!section) {
    return (
      <main className="min-h-screen pt-28 md:pt-32 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <LeahIntro />
          <h2 className="font-heading text-3xl text-text-primary mt-20 mb-8">The archive</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARCHIVE.children?.map((s) => (
              <li key={s.path}>
                <NodeCard node={s} large />
                <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-body text-sm" aria-label={`In ${s.title}`}>
                  {s.children?.map((c) => (
                    <li key={c.path}>
                      <Link to={c.path} className="text-text-secondary hover:text-text-primary underline decoration-[#D9D1C4] underline-offset-4">
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 md:pt-32 pb-10 px-6">
      <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block" aria-label="All sections">
          <div className="sticky top-28">
            <ArchiveTreeLinks className="space-y-5" />
          </div>
        </aside>
        <motion.div
          key={section.path}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <h1 className="font-heading text-[clamp(36px,5vw,56px)] text-text-primary leading-tight">{section.title}</h1>
          {section.note && <p className="font-body text-text-muted mt-1">{section.note}</p>}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {section.children?.map((c) => (
              <li key={c.path}>
                <NodeCard node={c} />
              </li>
            ))}
          </ul>
          {section.path === '/archive/paintings' && <PaintingBrowser />}
        </motion.div>
      </div>
    </main>
  );
}

export default ArchivePage;
