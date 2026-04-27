// Generic detail page for a person or subject drawn from Leah's book index.
// Shows: name + parenthetical, book-page refs, artworks, prose mentions with deep links.

import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PlaceholderArtwork from '../components/ui/PlaceholderArtwork';
import artworksData from '../data/artworks.json';
import peopleData from '../data/people.json';
import subjectsData from '../data/subjects.json';
import { findProseMentions } from '../data/proseSearch';
import { linkArtworkMentions } from '../data/proseLinker';
import type { Artwork } from '../types';
import { usePageMeta } from '../hooks/usePageMeta';

interface Entity {
  id: string;
  name: string;
  display_name?: string;
  parenthetical?: string | null;
  book_pages?: number[];
  artwork_ids?: string[];
  special_refs?: string[];
}

const artworks = artworksData as Artwork[];
const people = peopleData as Entity[];
const subjects = subjectsData as Entity[];

interface Props {
  kind: 'person' | 'subject';
}

export default function EntityPage({ kind }: Props): JSX.Element {
  const navigate = useNavigate();
  const { entityId } = useParams();
  const collection = kind === 'person' ? people : subjects;
  const entity = collection.find((e) => e.id === entityId);

  if (!entity) {
    return (
      <main className="min-h-screen pt-32 px-6 text-center">
        <p className="font-body text-text-muted">
          {kind === 'person' ? 'Person' : 'Subject'} not found in the index.
        </p>
        <Link to="/index" className="font-body text-[#8B7355] mt-4 inline-block">
          ← Back to the Index
        </Link>
      </main>
    );
  }

  const displayName = entity.display_name || entity.name;
  usePageMeta(
    displayName,
    kind === 'person'
      ? `${displayName} in Leah Schwartz's life · artworks and autobiography mentions.`
      : `${displayName} in Leah Schwartz's book · artworks and references.`
  );

  const linkedArtworks = useMemo<Artwork[]>(() => {
    const ids = new Set(entity.artwork_ids || []);
    const byId = artworks.filter((a) => ids.has(a.id));
    // Also include any artworks whose book_page is in this entity's book_pages
    const byPage = artworks.filter(
      (a) => a.book_page && entity.book_pages?.includes(a.book_page)
    );
    const all = [...byId, ...byPage];
    const uniq: Artwork[] = [];
    const seen = new Set<string>();
    for (const a of all) {
      if (!seen.has(a.id)) { seen.add(a.id); uniq.push(a); }
    }
    return uniq;
  }, [entity]);

  const proseMentions = useMemo(
    () => findProseMentions(entity.name, 6),
    [entity]
  );

  return (
    <main className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/index')}
          className="text-text-muted hover:text-text-primary transition-colors mb-8 font-body text-sm"
        >
          ← The Index
        </button>

        <motion.header
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-body text-text-muted uppercase tracking-widest text-xs mb-3">
            {kind === 'person' ? 'In Leah\'s life' : 'In Leah\'s index'}
          </p>
          <h1 className="font-heading text-5xl md:text-6xl text-text-primary leading-tight">
            {displayName}
          </h1>
          {entity.parenthetical && (
            <p className="font-leah text-text-muted mt-3 text-2xl leading-none">
              {entity.parenthetical}
            </p>
          )}
          {entity.book_pages && entity.book_pages.length > 0 && (
            <p className="font-body text-text-muted mt-4 text-sm">
              Mentioned on book {entity.book_pages.length === 1 ? 'page' : 'pages'}{' '}
              {entity.book_pages.join(', ')}
            </p>
          )}
        </motion.header>

        {/* Prose mentions · the most intimate way this entity appears */}
        {proseMentions.length > 0 && (
          <motion.section
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="font-heading text-2xl text-text-primary mb-6">
              In Leah's words
            </h2>
            <div className="space-y-6">
              {proseMentions.map((m, idx) => (
                <div key={idx} className="glass-card p-5 md:p-6">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="font-heading text-[17px] leading-[1.8] text-text-primary">
                          {children}
                        </p>
                      ),
                      a: ({ href, children }) =>
                        href && href.startsWith('/') ? (
                          <Link
                            to={href}
                            className="text-text-primary underline decoration-[#D5C6A8] underline-offset-4 hover:decoration-[#8B7355]"
                          >
                            {children}
                          </Link>
                        ) : <a href={href}>{children}</a>,
                    }}
                  >
                    {linkArtworkMentions(m.paragraph)}
                  </ReactMarkdown>
                  <Link
                    to={`/her-words/${m.sectionId}`}
                    className="mt-3 inline-block text-xs font-body text-text-muted hover:text-text-primary transition-colors"
                  >
                    Continue in {m.sectionLabel} →
                  </Link>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Related artworks */}
        {linkedArtworks.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h2 className="font-heading text-2xl text-text-primary mb-6">
              Related works
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {linkedArtworks.map((a) => (
                <Link key={a.id} to={`/artwork/${a.id}`} className="group block">
                  <PlaceholderArtwork
                    src={a.thumbPath || a.imagePath}
                    alt={a.title}
                    color={a.placeholderColor}
                    aspectRatio={a.aspectRatio}
                    className="shadow-soft group-hover:shadow-glass mb-2"
                  />
                  <p className="font-body text-sm text-text-primary truncate">
                    {a.display_title || a.title}
                  </p>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {proseMentions.length === 0 && linkedArtworks.length === 0 && (
          <p className="text-center font-body text-text-muted py-12">
            This {kind} is in Leah's index but we haven't linked a mention yet. Try the{' '}
            <Link to="/her-words" className="underline">full autobiography</Link>.
          </p>
        )}
      </div>
    </main>
  );
}
