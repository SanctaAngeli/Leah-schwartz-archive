import { Link } from 'react-router-dom';
import peopleData from '../data/people.json';
import ArchiveTreeLinks from '../components/layout/ArchiveTreeLinks';
import { usePageMeta } from '../hooks/usePageMeta';

// Everyone named in the index of her book, A to Z, each linking to their page.

interface Person {
  id: string;
  name: string;
  display_name?: string;
  parenthetical: string | null;
  artwork_ids: string[];
}

const people = (peopleData as Person[]).slice().sort((a, b) => a.name.localeCompare(b.name));
const letters = [...new Set(people.map((p) => p.name[0].toUpperCase()))];

function PeoplePage(): JSX.Element {
  usePageMeta('People', 'Everyone named in the index of Leah Schwartz’s book.');

  return (
    <main className="min-h-screen pt-28 md:pt-32 pb-10 px-6">
      <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block" aria-label="All sections">
          <div className="sticky top-28">
            <ArchiveTreeLinks className="space-y-5" />
          </div>
        </aside>
        <div>
          <h1 className="font-heading text-[clamp(36px,5vw,56px)] text-text-primary leading-tight">People</h1>
          <p className="font-body text-text-muted mt-1">{people.length} people, from the index of her book</p>
          <nav aria-label="Jump to letter" className="flex flex-wrap gap-2 mt-6 font-body text-sm">
            {letters.map((l) => (
              <a key={l} href={`#people-${l}`} className="w-8 h-8 flex items-center justify-center rounded-full glass-pill text-text-secondary hover:text-text-primary">
                {l}
              </a>
            ))}
          </nav>
          {letters.map((l) => (
            <section key={l} id={`people-${l}`} className="mt-10 scroll-mt-28">
              <h2 className="font-heading text-2xl text-text-primary border-b border-[#E2DBC9] pb-1">{l}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 mt-3">
                {people.filter((p) => p.name[0].toUpperCase() === l).map((p) => (
                  <li key={p.id}>
                    <Link to={`/people/${p.id}`} className="font-body text-text-primary hover:underline">
                      {p.display_name || p.name}
                    </Link>
                    {p.parenthetical && <span className="font-body text-sm text-text-muted"> · {p.parenthetical}</span>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

export default PeoplePage;
