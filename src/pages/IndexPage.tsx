import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import artworksData from '../data/artworks.json';
import peopleData from '../data/people.json';
import placesData from '../data/places.json';
import subjectsData from '../data/subjects.json';
import type { Artwork } from '../types';
import { usePageMeta } from '../hooks/usePageMeta';
import Constellation from '../components/index/Constellation';

interface IndexEntry {
  id: string;
  name: string;
  display_name?: string;
  parenthetical?: string | null;
  book_pages?: number[];
  artwork_ids?: string[];
  region?: string;
  lat?: number;
  lng?: number;
  special_refs?: string[];
}

type Category = 'all' | 'people' | 'places' | 'subjects' | 'artworks';

const artworks = artworksData as Artwork[];
const people = peopleData as IndexEntry[];
const places = placesData as IndexEntry[];
const subjects = subjectsData as IndexEntry[];
const artworksAsIndex: IndexEntry[] = artworks
  .filter((a) => a.book_page)
  .map((a) => ({
    id: a.id,
    name: a.display_title || a.title,
    book_pages: a.book_page ? [a.book_page] : [],
    artwork_ids: [a.id],
  }));

function displayNameOf(e: IndexEntry): string {
  return e.display_name || e.name;
}
function firstLetterOf(name: string): string {
  const m = name.match(/[A-Za-z]/);
  return (m ? m[0].toUpperCase() : '#');
}

type ViewMode = 'list' | 'constellation';

function IndexPage(): JSX.Element {
  const [category, setCategory] = useState<Category>('all');
  const [query, setQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  usePageMeta('The Index', 'Leah Schwartz\'s own back-of-book index · every person, place, and subject, digitized.');

  const categories: { id: Category; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: people.length + places.length + subjects.length + artworksAsIndex.length },
    { id: 'people', label: 'People', count: people.length },
    { id: 'places', label: 'Places', count: places.length },
    { id: 'subjects', label: 'Subjects', count: subjects.length },
    { id: 'artworks', label: 'Artworks', count: artworksAsIndex.length },
  ];

  const entriesForCategory = (cat: Category): IndexEntry[] => {
    switch (cat) {
      case 'people': return people;
      case 'places': return places;
      case 'subjects': return subjects;
      case 'artworks': return artworksAsIndex;
      default: return [...people, ...places, ...subjects, ...artworksAsIndex];
    }
  };

  const entryKind = (e: IndexEntry): 'person' | 'place' | 'subject' | 'artwork' => {
    if (people.some((p) => p.id === e.id)) return 'person';
    if (places.some((p) => p.id === e.id)) return 'place';
    if (artworksAsIndex.some((a) => a.id === e.id)) return 'artwork';
    return 'subject';
  };

  const { visible, letters } = useMemo(() => {
    let list = entriesForCategory(category);
    // Sort by display name
    list = [...list].sort((a, b) =>
      displayNameOf(a).localeCompare(displayNameOf(b))
    );
    // Filter by search query
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((e) => displayNameOf(e).toLowerCase().includes(q));
    }
    const letterSet = new Set<string>();
    list.forEach((e) => letterSet.add(firstLetterOf(displayNameOf(e))));
    const letterArr = Array.from(letterSet).sort();
    if (activeLetter) {
      list = list.filter((e) => firstLetterOf(displayNameOf(e)) === activeLetter);
    }
    return { visible: list, letters: letterArr };
  }, [category, query, activeLetter]);

  // Group by first letter for display
  const grouped = useMemo(() => {
    const g: Record<string, IndexEntry[]> = {};
    visible.forEach((e) => {
      const l = firstLetterOf(displayNameOf(e));
      (g[l] ||= []).push(e);
    });
    return g;
  }, [visible]);

  const linkFor = (e: IndexEntry): string | null => {
    const kind = entryKind(e);
    if (kind === 'artwork') {
      const aid = e.artwork_ids?.[0];
      return aid ? `/artwork/${aid}` : null;
    }
    if (kind === 'place')   return `/places/${e.id}`;
    if (kind === 'person')  return `/people/${e.id}`;
    if (kind === 'subject') return `/subjects/${e.id}`;
    return null;
  };

  return (
    <main className="min-h-screen pt-24 pb-24 px-6">
      {/* Hero */}
      <header className="max-w-4xl mx-auto text-center mb-10">
        <p className="font-body text-text-muted uppercase tracking-widest text-xs mb-3">
          Her own index, digitized
        </p>
        <h1 className="font-heading text-5xl md:text-7xl text-text-primary leading-tight">
          The Index
        </h1>
        <p className="font-body text-text-secondary mt-6 max-w-2xl mx-auto leading-relaxed">
          Every name, place, and subject in the back of Leah's book · people she knew,
          places she painted, and the subjects she returned to. Click through to the works.
        </p>
      </header>

      {/* View toggle · list vs constellation */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-center">
        <div className="glass-pill p-1 flex gap-1">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
              viewMode === 'list' ? 'bg-text-primary text-bg-gallery' : 'text-text-secondary hover:text-text-primary'
            }`}
            aria-pressed={viewMode === 'list'}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('constellation')}
            className={`px-4 py-2 rounded-full text-sm font-body transition-colors ${
              viewMode === 'constellation' ? 'bg-text-primary text-bg-gallery' : 'text-text-secondary hover:text-text-primary'
            }`}
            aria-pressed={viewMode === 'constellation'}
          >
            Constellation
          </button>
        </div>
      </div>

      {/* Constellation view */}
      {viewMode === 'constellation' && (
        <div className="max-w-7xl mx-auto">
          <Constellation people={people} places={places} subjects={subjects} />
        </div>
      )}

      {/* Search + category tabs (list view) */}
      {viewMode === 'list' && (<>
      <div className="max-w-4xl mx-auto mb-8 space-y-4">
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveLetter(null); }}
          placeholder="Search Leah's index…"
          className="w-full px-5 py-3 rounded-full bg-bg-glass border border-bg-glass-border font-body text-text-primary placeholder-text-muted shadow-soft focus:outline-none focus:ring-2 focus:ring-[#8B7355]/40"
        />
        <nav className="flex flex-wrap gap-2 justify-center">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => { setCategory(c.id); setActiveLetter(null); }}
              className={`
                font-body text-sm px-4 py-2 rounded-full transition-all
                ${c.id === category
                  ? 'bg-text-primary text-bg-gallery shadow-sm'
                  : 'bg-bg-glass text-text-secondary hover:bg-white/90 border border-bg-glass-border'
                }
              `}
            >
              {c.label} <span className="opacity-60">· {c.count}</span>
            </button>
          ))}
        </nav>
        {/* A-Z strip */}
        {letters.length > 1 && (
          <div className="flex flex-wrap justify-center gap-1 text-xs font-body">
            <button
              onClick={() => setActiveLetter(null)}
              className={`px-2 py-1 rounded ${
                activeLetter === null ? 'text-text-primary font-semibold' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              All
            </button>
            {letters.map((l) => (
              <button
                key={l}
                onClick={() => setActiveLetter(l)}
                className={`px-2 py-1 rounded ${
                  activeLetter === l ? 'bg-text-primary text-bg-gallery font-semibold' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Entries, grouped by letter */}
      <div className="max-w-4xl mx-auto">
        {Object.entries(grouped).map(([letter, entries]) => (
          <motion.section
            key={letter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-12"
          >
            <h2 className="font-heading text-5xl text-text-muted mb-4 border-b border-[#E8E2D5] pb-2">
              {letter}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
              {entries.map((e) => {
                const link = linkFor(e);
                const kind = entryKind(e);
                const label = displayNameOf(e);
                const relatedCount = (e.artwork_ids || []).length;
                const body = (
                  <div className="flex items-baseline justify-between gap-3 py-1.5 group">
                    <div className="min-w-0 flex-1">
                      <span className="font-heading text-text-primary text-[17px] leading-snug group-hover:text-[#8B7355] transition-colors">
                        {label}
                      </span>
                      {e.parenthetical && (
                        <span className="font-body text-xs text-text-muted ml-2">
                          ({e.parenthetical})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-body text-text-muted whitespace-nowrap">
                      <span className="uppercase tracking-wider opacity-70">{kind}</span>
                      {relatedCount > 0 && (
                        <span className="glass-pill px-2 py-0.5">
                          {relatedCount} work{relatedCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                );
                return (
                  <li key={e.id}>
                    {link ? (
                      <Link to={link}>{body}</Link>
                    ) : (
                      // Subject/person without direct page · show artworks on hover via tooltip
                      <div className="cursor-default" title={e.book_pages?.length ? `Book pages: ${e.book_pages.join(', ')}` : ''}>
                        {body}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.section>
        ))}

        {visible.length === 0 && (
          <p className="text-center text-text-muted py-20">
            No entries match your search.
          </p>
        )}
      </div>
      </>)}
    </main>
  );
}

export default IndexPage;
