import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PlaceholderArtwork from '../components/ui/PlaceholderArtwork';
import WorldMap from '../components/places/WorldMap';
import artworksData from '../data/artworks.json';
import placesData from '../data/places.json';
import type { Artwork } from '../types';
import { usePageMeta } from '../hooks/usePageMeta';

interface Place {
  id: string;
  name: string;
  parenthetical?: string | null;
  book_pages?: number[];
  region?: string;
  lat?: number;
  lng?: number;
  artwork_ids?: string[];
}

const artworks = artworksData as Artwork[];
const places = placesData as Place[];

const REGION_LABELS: Record<string, string> = {
  'bay-area':            'San Francisco Bay Area',
  'california':          'California',
  'desert':              'American Desert',
  'high-sierra':         'High Sierra',
  'france':              'France',
  'italy':               'Italy',
  'greece':              'Greece',
  'turkey':              'Turkey',
  'japan':               'Japan',
  'india':               'India',
  'nepal':               'Nepal',
  'botanizing-in-kenya': 'Kenya',
  'britain':             'Britain',
  'other':               'Elsewhere',
};

const REGION_ORDER = [
  'bay-area', 'california', 'desert', 'high-sierra',
  'france', 'italy', 'greece', 'turkey',
  'britain', 'japan', 'india', 'nepal', 'botanizing-in-kenya',
  'other',
];

function PlaceDetail({ place }: { place: Place }): JSX.Element {
  const navigate = useNavigate();
  usePageMeta(place.name, `Works by Leah Schwartz set in ${place.name}.`);
  const linkedArtworks = useMemo(() => {
    const ids = new Set(place.artwork_ids || []);
    return artworks.filter((a) => ids.has(a.id) || a.book_page && place.book_pages?.includes(a.book_page));
  }, [place]);

  return (
    <main className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/places')}
          className="text-text-muted hover:text-text-primary transition-colors mb-6 font-body text-sm"
        >
          ← All Places
        </button>
        <header className="text-center mb-12 max-w-3xl mx-auto">
          <p className="font-body text-text-muted uppercase tracking-widest text-xs mb-3">
            {REGION_LABELS[place.region || 'other'] || place.region}
          </p>
          <h1 className="font-heading text-5xl md:text-6xl text-text-primary leading-tight">
            {place.name}
          </h1>
          {place.parenthetical && (
            <p className="font-heading italic text-text-muted mt-2">
              {place.parenthetical}
            </p>
          )}
          <p className="font-body text-text-muted mt-4 text-sm">
            {linkedArtworks.length} {linkedArtworks.length === 1 ? 'work' : 'works'}
            {place.book_pages && place.book_pages.length > 0 && (
              <> · appears on book {place.book_pages.length === 1 ? 'page' : 'pages'} {place.book_pages.join(', ')}</>
            )}
          </p>
        </header>

        {linkedArtworks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {linkedArtworks.map((a) => (
              <Link key={a.id} to={`/artwork/${a.id}`} className="group block">
                <PlaceholderArtwork
                  src={a.thumbPath || a.imagePath}
                  alt={a.title}
                  color={a.placeholderColor}
                  aspectRatio={a.aspectRatio}
                  className="shadow-soft group-hover:shadow-glass mb-3"
                />
                <h3 className="font-body text-sm text-text-primary truncate">
                  {a.display_title || a.title}
                </h3>
                {a.dimensions && (
                  <p className="font-body text-xs text-text-muted">
                    {a.dimensions}
                  </p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-text-muted font-body py-12">
            This place is mentioned in Leah's index but no paintings are yet linked to it.
          </p>
        )}
      </div>
    </main>
  );
}

function PlacesPage(): JSX.Element {
  const { placeId } = useParams();
  usePageMeta(placeId ? '' : 'Places', 'Every place Leah Schwartz painted, across nine countries · from Mt. Tam to Naxos.');

  // Detail view
  if (placeId) {
    const place = places.find((p) => p.id === placeId);
    if (!place) {
      return (
        <main className="min-h-screen pt-24 px-6 text-center">
          <p className="font-body text-text-muted">Place not found.</p>
          <Link to="/places" className="font-body text-[#8B7355] mt-4 inline-block">
            ← All places
          </Link>
        </main>
      );
    }
    return <PlaceDetail place={place} />;
  }

  // Grouped list
  const grouped = useMemo(() => {
    const g: Record<string, Place[]> = {};
    places.forEach((p) => {
      const key = p.region || 'other';
      (g[key] ||= []).push(p);
    });
    Object.keys(g).forEach((k) => {
      g[k].sort((a, b) => a.name.localeCompare(b.name));
    });
    return g;
  }, []);

  const geocodedPlaces = places.filter((p) => p.lat != null && p.lng != null);

  return (
    <main className="min-h-screen pt-24 pb-24 px-6">
      <header className="max-w-4xl mx-auto text-center mb-12">
        <p className="font-body text-text-muted uppercase tracking-widest text-xs mb-3">
          Where she painted
        </p>
        <h1 className="font-heading text-5xl md:text-7xl text-text-primary leading-tight">
          Places
        </h1>
        <p className="font-body text-text-secondary mt-6 max-w-2xl mx-auto leading-relaxed">
          From Mount Tam to Naxos, from Death Valley to Kenya. Every place Leah painted or wrote about,
          pulled from the index of her book.
        </p>
      </header>

      {/* Map */}
      <section className="max-w-6xl mx-auto mb-16">
        <WorldMap places={geocodedPlaces} />
      </section>

      {/* Region-grouped list */}
      <div className="max-w-5xl mx-auto space-y-12">
        {REGION_ORDER.filter((r) => grouped[r]?.length).map((region) => (
          <motion.section
            key={region}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="font-heading text-3xl text-text-primary mb-3">
              {REGION_LABELS[region] || region}
            </h2>
            <p className="font-body text-sm text-text-muted mb-6">
              {grouped[region].length} places
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
              {grouped[region].map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/places/${p.id}`}
                    className="flex items-baseline justify-between py-2 group"
                  >
                    <span className="font-heading text-[17px] text-text-primary group-hover:text-[#8B7355] transition-colors">
                      {p.name}
                    </span>
                    {p.artwork_ids && p.artwork_ids.length > 0 && (
                      <span className="font-body text-xs text-text-muted">
                        {p.artwork_ids.length} works
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.section>
        ))}
      </div>
    </main>
  );
}

export default PlacesPage;
