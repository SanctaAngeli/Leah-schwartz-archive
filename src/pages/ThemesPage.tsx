import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PlaceholderArtwork from '../components/ui/PlaceholderArtwork';
import artworksData from '../data/artworks.json';
import themesData from '../data/themes.json';
import { getProseByChapter, cleanProse, stripRedundantChapterHeader } from '../data/prose';
import { linkArtworkMentions } from '../data/proseLinker';
import { getAccent } from '../data/chapterAccents';
import { usePageMeta } from '../hooks/usePageMeta';
import type { Artwork, Theme } from '../types';

const artworks = artworksData as Artwork[];
const themes = themesData as Theme[];

function ThemesPage(): JSX.Element {
  const navigate = useNavigate();
  const { themeId } = useParams();

  const selectedTheme = themeId ? themes.find((t) => t.id === themeId) : null;
  usePageMeta(
    selectedTheme ? `${selectedTheme.name} · Themes` : 'Themes',
    selectedTheme
      ? `${selectedTheme.tagline || selectedTheme.name} · paintings from Leah Schwartz's ${selectedTheme.name} chapter.`
      : "Leah Schwartz's twelve chapters of painting · abstract to travel."
  );

  const themeArtworks = useMemo(() => {
    if (!themeId) return [];
    return artworks.filter((a) => a.chapter === themeId || a.themes.includes(themeId));
  }, [themeId]);

  const chapterProse = useMemo(() => {
    if (!themeId) return null;
    return getProseByChapter(themeId) || null;
  }, [themeId]);

  const getHeroArtwork = (theme: Theme): Artwork | undefined => {
    if (!theme.heroArtworkId) return undefined;
    return artworks.find((a) => a.id === theme.heroArtworkId);
  };

  // ───── Theme grid (all 12 chapters) ─────
  if (!selectedTheme) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-6">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <p className="font-body text-text-muted text-sm tracking-[0.25em] uppercase mb-4">
              Explore by
            </p>
            <h1 className="font-heading text-[clamp(32px,6vw,56px)] text-text-primary leading-tight">
              Themes
            </h1>
            <p className="font-body text-text-secondary mt-6 leading-relaxed">
              Leah organized her work into twelve chapters. Each has her own words and her own paintings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {themes.map((theme, index) => {
              const heroArtwork = getHeroArtwork(theme);
              const count = theme.artworkCount ?? artworks.filter((a) =>
                a.chapter === theme.id || a.themes.includes(theme.id)
              ).length;
              // The autobiography chapter has no paintings - it's her life story,
              // so its card opens the reader instead of an empty room.
              const isAutobiography = theme.id === 'autobiography';

              return (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                >
                  <Link
                    to={isAutobiography ? '/her-words/autobiography' : `/themes/${theme.id}`}
                    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7355]/50 rounded-2xl"
                  >
                    <div
                      className="relative overflow-hidden rounded-2xl shadow-soft group-hover:shadow-glass transition-shadow duration-500 aspect-[4/3]"
                      style={{ backgroundColor: heroArtwork?.placeholderColor || '#9B8B7A' }}
                    >
                      {/* Slight permanent zoom crops out the scanned book-page
                          margins (white slabs + printed captions) baked into the
                          image files until the assets are properly re-cropped. */}
                      {heroArtwork?.imagePath && (
                        <img
                          src={heroArtwork.thumbPath || heroArtwork.imagePath}
                          alt={theme.name}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover scale-[1.08] transition-transform duration-700 group-hover:scale-[1.12]"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h2 className="font-heading text-2xl md:text-3xl text-white drop-shadow-md">
                          {theme.name}
                        </h2>
                        {theme.tagline && (
                          <p className="font-leah text-white/90 mt-1 text-2xl leading-none drop-shadow">
                            {theme.tagline}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-body text-text-muted text-sm mt-3 px-1">
                      {isAutobiography
                        ? 'Her life, in her own words →'
                        : `${count} ${count === 1 ? 'work' : 'works'}`}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  // ───── Selected theme / chapter view ─────
  const accent = getAccent(selectedTheme.id);
  return (
    <div className="min-h-screen pt-24 pb-24 px-6" style={{ background: `linear-gradient(to bottom, ${accent.soft} 0%, #fafafa 420px)` }}>
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => navigate('/themes')}
          className="text-text-muted hover:text-text-primary transition-colors mb-8 font-body text-sm"
        >
          ← All Themes
        </button>

        {/* Chapter header */}
        <header className="text-center mb-12 max-w-3xl mx-auto">
          <div className="h-1 w-16 mx-auto mb-6 rounded-full" style={{ backgroundColor: accent.accent }} />
          <h1 className="font-heading text-5xl md:text-6xl text-text-primary leading-tight">
            {selectedTheme.name}
          </h1>
          {selectedTheme.tagline && (
            <p className="font-leah mt-4 text-3xl md:text-4xl leading-none" style={{ color: accent.accent }}>
              {selectedTheme.tagline}
            </p>
          )}
          <p className="font-body text-text-muted mt-4 text-sm">
            {themeArtworks.length} {themeArtworks.length === 1 ? 'work' : 'works'}
          </p>
        </header>

        {/* Leah's chapter essay */}
        {chapterProse && (
          <motion.section
            className="max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="font-heading text-[17px] md:text-[18px] leading-[1.8] text-text-primary prose-leah">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: () => null, // chapter title is already the page header
                  // Interior headings (the travel chapter's region names) render
                  // as quiet small-caps dividers; the chapter's own name/tagline
                  // are stripped from the source before rendering.
                  h2: ({ children }) => (
                    <h2
                      className="font-body text-[13px] tracking-[0.3em] uppercase mt-12 mb-5 text-center"
                      style={{ color: accent.accent }}
                    >
                      {children}
                    </h2>
                  ),
                  em: ({ children }) => <em className="italic text-text-muted">{children}</em>,
                  p: ({ children }) => (
                    <p className="mb-5 text-text-primary">{children}</p>
                  ),
                  a: ({ href, children }) =>
                    href && href.startsWith('/') ? (
                      <Link
                        to={href}
                        className="underline decoration-1 underline-offset-4 transition-colors"
                        style={{ color: accent.accent, textDecorationColor: accent.accent + '55' }}
                      >
                        {children}
                      </Link>
                    ) : (
                      <a href={href}>{children}</a>
                    ),
                }}
              >
                {linkArtworkMentions(
                  stripRedundantChapterHeader(
                    cleanProse(chapterProse.markdown),
                    selectedTheme.name,
                    selectedTheme.tagline
                  )
                )}
              </ReactMarkdown>
            </div>
            <div className="mt-8 text-center">
              <Link
                to={`/her-words/${chapterProse.id}`}
                className="inline-block text-sm font-body text-text-muted hover:text-text-primary transition-colors"
              >
                Continue reading in Leah's Story →
              </Link>
            </div>
          </motion.section>
        )}

        {/* Artwork grid */}
        {themeArtworks.length > 0 && (
          <>
            <div className="text-center mb-8">
              <p className="font-body text-text-muted uppercase tracking-widest text-xs">
                The paintings
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {themeArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.6) }}
                >
                  <Link
                    to={`/artwork/${artwork.id}`}
                    className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B7355]/50 rounded-lg"
                  >
                    <PlaceholderArtwork
                      src={artwork.thumbPath || artwork.imagePath}
                      alt={artwork.title}
                      color={artwork.placeholderColor}
                      aspectRatio={artwork.aspectRatio}
                      className="shadow-soft group-hover:shadow-glass mb-3"
                    />
                    <h3 className="font-body text-sm text-text-primary truncate">
                      {artwork.display_title || artwork.title}
                    </h3>
                    {artwork.dimensions && (
                      <p className="font-body text-xs text-text-muted">
                        {artwork.dimensions}
                      </p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default ThemesPage;
