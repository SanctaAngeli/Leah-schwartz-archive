// A preservation page for archivists and scholars. Not flashy · honest.

import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import artworks from '../data/artworks.json';
import people from '../data/people.json';
import places from '../data/places.json';
import subjects from '../data/subjects.json';

const counts = {
  artworks: artworks.length,
  withImages: (artworks as { imagePath?: string | null }[]).filter((a) => a.imagePath).length,
  people: people.length,
  places: places.length,
  subjects: subjects.length,
};

export default function PreservationPage(): JSX.Element {
  usePageMeta(
    'For scholars',
    'How the Leah Schwartz Archive is stored: data files, exports and the scan of her 1990 book.'
  );

  return (
    <main className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-14">
          <h1 className="font-heading text-5xl md:text-6xl text-text-primary leading-tight">
            Preservation
          </h1>
        </header>

        {/* What's preserved */}
        <section className="glass-card p-6 md:p-8 mb-10">
          <h2 className="font-heading text-2xl text-text-primary mb-4">What's preserved</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 font-body text-sm">
            <dt className="text-text-muted">Artworks catalogued</dt>
            <dd className="text-text-primary">{counts.artworks}</dd>
            <dt className="text-text-muted">Artworks with cropped images</dt>
            <dd className="text-text-primary">{counts.withImages} at 300 DPI</dd>
            <dt className="text-text-muted">Words of Leah's own prose</dt>
            <dd className="text-text-primary">28,660</dd>
            <dt className="text-text-muted">People indexed</dt>
            <dd className="text-text-primary">{counts.people}</dd>
            <dt className="text-text-muted">Places indexed</dt>
            <dd className="text-text-primary">{counts.places}</dd>
            <dt className="text-text-muted">Subjects indexed</dt>
            <dd className="text-text-primary">{counts.subjects}</dd>
            <dt className="text-text-muted">Book chapters</dt>
            <dd className="text-text-primary">12 + 11 travel regions</dd>
          </dl>
        </section>

        {/* Data exports */}
        <section className="glass-card p-6 md:p-8 mb-10">
          <h2 className="font-heading text-2xl text-text-primary mb-4">Data exports</h2>
          <ul className="space-y-2 font-body text-sm">
            {[
              ['artworks.json',  'All artworks with title, year, medium, dimensions, collection, book page, chapter'],
              ['people.json',    'Index of people mentioned in the book'],
              ['places.json',    'Places (with geocodes where known)'],
              ['subjects.json',  'Indexed subjects'],
              ['themes.json',    'The 12 book chapters'],
              ['locations.json', '12 regional rollups'],
              ['photos.json',    'Photograph candidates classified by chroma'],
            ].map(([file, desc]) => (
              <li key={file} className="flex items-baseline justify-between gap-4 py-1.5 border-b border-[#E8E2D5]/50">
                <a
                  href={`/api/${file}`}
                  className="font-mono text-text-primary underline decoration-[#D5C6A8] underline-offset-4 hover:decoration-[#8B7355]"
                >
                  /api/{file}
                </a>
                <span className="text-text-muted text-xs text-right">{desc}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Source book */}
        <section className="glass-card p-6 md:p-8 mb-10">
          <h2 className="font-heading text-2xl text-text-primary mb-4">The original book</h2>
          <p className="font-body text-text-secondary text-sm mb-5 leading-relaxed">
            Her book was published in 1990 by Strawberry Press, Mill Valley, California.
            The high-resolution scan that seeded this archive - 309 pages, 232 MB · is
            available on request for archivists and scholars.
          </p>
          <a
            href="/book.pdf"
            className="inline-block glass-pill px-5 py-3 font-body text-sm text-text-primary hover:shadow-glass transition-shadow"
          >
            Request the archival PDF →
          </a>
        </section>

        {/* Principles */}
        <section className="glass-card p-6 md:p-8 mb-10">
          <h2 className="font-heading text-2xl text-text-primary mb-4">Principles</h2>
          <ul className="font-body text-sm space-y-2 text-text-secondary">
            <li>• Data is portable · JSON, markdown, JPEG. No lock‑in.</li>
            <li>• Images at full scanner resolution. Thumbnails are derived.</li>
            <li>• Static hosting · no server, no database, works on any bucket.</li>
            <li>• Source is in a public GitHub repository. Forks welcome.</li>
          </ul>
        </section>

        <p className="text-center font-body text-sm text-text-muted">
          Questions? See{' '}
          <Link to="/about" className="underline decoration-[#D5C6A8] underline-offset-4 hover:decoration-[#8B7355]">
            About
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
