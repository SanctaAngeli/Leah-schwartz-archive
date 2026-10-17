import { useEffect, useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import artworksData from '../../data/artworks.json';
import themesData from '../../data/themes.json';
import placesData from '../../data/places.json';
import type { Artwork } from '../../types';

// Every painting in one list, with plain filters. The filters live in the
// web address (?chapter=flowers&source=not-in-book) so a filtered view can
// be linked to, and the "Not in the book" page is just a filter.

const artworks = artworksData as Artwork[];
const chapters = themesData.filter((t) => t.id !== 'autobiography');
const places = placesData.filter((p) => p.artwork_ids.length > 0).sort((a, b) => a.name.localeCompare(b.name));

const SOURCES = [
  { id: 'book', label: 'In her book', test: (a: Artwork) => Boolean(a.book_page) },
  { id: 'not-in-book', label: 'Not in her book', test: (a: Artwork) => !a.book_page },
  { id: 'family-photos', label: "From the family's photos", test: (a: Artwork) => Boolean(a.photo_file) && !a.book_page },
  { id: 'website', label: 'From her website', test: (a: Artwork) => !a.book_page && !a.photo_file },
];

const mediumOf = (a: Artwork): string | null => {
  const m = (a.medium || '').toLowerCase();
  if (!m) return null;
  if (m.includes('watercolor') || m.includes('watercolour')) return 'Watercolour';
  if (m.includes('oil')) return 'Oil';
  if (m.includes('collage')) return 'Collage';
  if (m.includes('pencil')) return 'Pencil';
  if (m.includes('ink')) return 'Pen and ink';
  if (m.includes('acrylic')) return 'Acrylic';
  if (m.includes('gouache')) return 'Gouache';
  if (m.includes('tempera')) return 'Tempera';
  return 'Other';
};
const MEDIUMS = [...new Set(artworks.map(mediumOf).filter((m): m is string => Boolean(m)))].sort();

function FilterSelect({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}): JSX.Element {
  return (
    <label className="flex flex-col gap-1 font-body text-xs text-text-muted">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full border border-[#D9D1C4] bg-white/80 px-4 py-2 text-sm text-text-primary"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function PaintingBrowser(): JSX.Element {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  // Ignore unknown values in the address so the dropdowns and the list agree.
  const valid = (v: string | null, ok: string[]): string => (v && ok.includes(v) ? v : '');
  const chapter = valid(params.get('chapter'), chapters.map((c) => c.id));
  const source = valid(params.get('source'), SOURCES.map((s) => s.id));
  const medium = valid(params.get('medium'), MEDIUMS);
  const place = valid(params.get('place'), places.map((p) => p.id));

  const set = (key: string, value: string): void => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, state: { fromFilter: true } });
  };

  const shown = useMemo(() => {
    const placeIds = place ? new Set(places.find((p) => p.id === place)?.artwork_ids ?? []) : null;
    const src = SOURCES.find((s) => s.id === source);
    return artworks.filter(
      (a) =>
        (!chapter || a.chapter === chapter) &&
        (!src || src.test(a)) &&
        (!medium || mediumOf(a) === medium) &&
        (!placeIds || placeIds.has(a.id))
    );
  }, [chapter, source, medium, place]);

  const filtered = Boolean(chapter || source || medium || place);

  // Arriving from a link to a filtered list (e.g. "Not in the book"): show the list.
  useEffect(() => {
    if (filtered && !(location.state as { fromFilter?: boolean } | null)?.fromFilter) {
      document.getElementById('all-paintings')?.scrollIntoView({ block: 'start' });
    }
    // Only when the address changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  return (
    <section aria-labelledby="all-paintings" className="mt-16 scroll-mt-28">
      <h2 id="all-paintings" className="font-heading text-3xl text-text-primary scroll-mt-32">All paintings</h2>
      <div className="flex flex-wrap items-end gap-4 mt-5">
        <FilterSelect label="Chapter" value={chapter} onChange={(v) => set('chapter', v)} options={chapters.map((c) => ({ value: c.id, label: c.name }))} />
        <FilterSelect label="Source" value={source} onChange={(v) => set('source', v)} options={SOURCES.map((s) => ({ value: s.id, label: s.label }))} />
        <FilterSelect label="Medium" value={medium} onChange={(v) => set('medium', v)} options={MEDIUMS.map((m) => ({ value: m, label: m }))} />
        <FilterSelect label="Place" value={place} onChange={(v) => set('place', v)} options={places.map((p) => ({ value: p.id, label: p.name }))} />
        <p className="font-body text-sm text-text-muted pb-2" aria-live="polite">
          Showing {shown.length} of {artworks.length}
        </p>
        {filtered && (
          <button type="button" onClick={() => setParams({}, { replace: true, state: { fromFilter: true } })} className="font-body text-sm text-text-secondary underline pb-2">
            Clear filters
          </button>
        )}
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-8 mt-8">
        {shown.map((a) => (
          <li key={a.id}>
            <Link to={`/artwork/${a.id}`} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7355]/50 rounded-lg">
              <div className="aspect-square bg-white/60 rounded-lg overflow-hidden flex items-center justify-center">
                {(a.thumbPath || a.imagePath) && (
                  <img
                    src={a.thumbPath || a.imagePath || ''}
                    alt=""
                    loading="lazy"
                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <span className="block mt-2 font-heading text-base text-text-primary leading-snug">{a.display_title || a.title}</span>
              {a.year_raw && <span className="block font-body text-xs text-text-muted">{a.year_raw}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PaintingBrowser;
