// The museum's floor plan.
//
// One lobby, five wings. Every route on the site belongs to a wing, every
// signature experience is a door inside one, and the TOUR_ORDER below is the
// curated walking route: a visitor who only ever presses "continue" sees the
// whole museum, in order.

export interface WingDoor {
  to: string;
  title: string;
  /** Artwork id for the card image (thumb), or a photo path, or 'spectrum'. */
  visual: { kind: 'artwork'; id: string } | { kind: 'photo'; src: string } | { kind: 'spectrum' };
  /** Doors marked hero render wider in the grid. */
  hero?: boolean;
}

export interface Wing {
  id: string;
  path: string;
  label: string;
  /** Which routes light this wing up in the nav. */
  routes: string[];
}

export const WINGS: Wing[] = [
  {
    id: 'paintings',
    path: '/paintings',
    label: 'Paintings',
    routes: [
      '/paintings', '/canvas', '/themes', '/atlas', '/obsessions',
      '/pairings', '/artwork', '/compare', '/favorites',
    ],
  },
  {
    id: 'her-story',
    path: '/her-story',
    label: 'Her Story',
    routes: ['/her-story', '/her-words', '/journals', '/daily'],
  },
  {
    id: 'places',
    path: '/places',
    label: 'Places',
    routes: ['/places', '/locations'],
  },
  {
    id: 'studio',
    path: '/studio',
    label: 'Studio',
    routes: ['/studio', '/walk'],
  },
  {
    id: 'about',
    path: '/about',
    label: 'About',
    routes: ['/about', '/index', '/constellation', '/preservation', '/people', '/subjects'],
  },
];

export function wingForPath(pathname: string): Wing | undefined {
  return WINGS.find((w) =>
    w.routes.some((r) => pathname === r || pathname.startsWith(r + '/'))
  );
}

export const PAINTINGS_DOORS: WingDoor[] = [
  {
    to: '/canvas',
    title: 'The Canvas',
    visual: { kind: 'artwork', id: 'temple-steps-udaipur' },
    hero: true,
  },
  {
    to: '/themes',
    title: 'The Twelve Chapters',
    visual: { kind: 'artwork', id: 'three-red-pears' },
  },
  {
    to: '/atlas',
    title: 'A Lifetime in Color',
    visual: { kind: 'spectrum' },
  },
  {
    to: '/obsessions',
    title: 'Obsessions',
    visual: { kind: 'artwork', id: 'mt-tam-from-sonoma' },
  },
  {
    to: '/pairings',
    title: 'Pairings',
    visual: { kind: 'artwork', id: 'amazing-grace' },
    hero: true,
  },
];

export const HER_STORY_DOORS: WingDoor[] = [
  {
    to: '/her-words',
    title: 'In Her Own Words',
    visual: { kind: 'photo', src: '/photos/p028_02.jpg' },
    hero: true,
  },
  {
    to: '/journals',
    title: 'Journals',
    visual: { kind: 'photo', src: '/journals/singapore-1990/03.jpg' },
  },
  {
    to: '/daily',
    title: 'Painting of the Day',
    visual: { kind: 'artwork', id: 'three-red-pears' },
  },
];

// ── The walking route ──────────────────────────────────────────────────────
// "Continue" at the foot of each room leads here. Order tells the story:
// see the work, hear her voice, visit the places, enter the studio, then
// meet the archive itself.

export interface TourStop {
  path: string;
  title: string;
}

export const TOUR_ORDER: TourStop[] = [
  { path: '/paintings',      title: 'The Paintings' },
  { path: '/canvas',         title: 'The Canvas' },
  { path: '/themes',         title: 'The Twelve Chapters' },
  { path: '/atlas',          title: 'A Lifetime in Color' },
  { path: '/obsessions',     title: 'Obsessions' },
  { path: '/pairings',       title: 'Pairings' },
  { path: '/her-story',      title: 'Her Story' },
  { path: '/her-words',      title: 'In Her Own Words' },
  { path: '/journals',       title: 'Journals' },
  { path: '/studio',         title: 'The Studio' },
  { path: '/walk',           title: 'Walk With Her' },
  { path: '/places',         title: 'Places' },
  { path: '/index',          title: 'The Index' },
  { path: '/constellation',  title: 'The Constellation' },
  { path: '/about',          title: 'About Leah' },
  { path: '/',               title: 'The Lobby' },
];

/** Stops for routes that sit off the main walk - they rejoin it sensibly. */
const REJOIN: Record<string, string> = {
  '/daily': '/paintings',
  '/locations': '/index',
  '/favorites': '/canvas',
  '/compare': '/canvas',
  '/preservation': '/about',
};

/** The next stop on the walking route for the current location. */
export function nextStop(pathname: string): TourStop | null {
  if (pathname === '/') return null;
  const rejoin = REJOIN[pathname];
  if (rejoin) return TOUR_ORDER.find((t) => t.path === rejoin) ?? null;
  // Match this page (or its parent route) to a stop, then take the next one.
  const idx = TOUR_ORDER.findIndex(
    (t) => t.path !== '/' && (pathname === t.path || pathname.startsWith(t.path + '/'))
  );
  if (idx === -1) {
    // Detail pages without their own stop rejoin by prefix.
    if (pathname.startsWith('/places/')) return TOUR_ORDER.find((t) => t.path === '/index') ?? null;
    if (pathname.startsWith('/people/') || pathname.startsWith('/subjects/')) {
      return TOUR_ORDER.find((t) => t.path === '/constellation') ?? null;
    }
    return null;
  }
  return TOUR_ORDER[idx + 1] ?? null;
}

// ── Lobby pull-quotes ──────────────────────────────────────────────────────
// Verbatim from her book (sources in src/data/prose/). Rotated daily,
// in step with the painting of the day.

export interface LobbyQuote {
  text: string;
  source: string;
}

export const LOBBY_QUOTES: LobbyQuote[] = [
  {
    text: 'I love the process of what I do. I enjoy the feel of a brush on canvas, the smell of turpentine, the flow of color on a fresh sheet of watercolor paper, and the intense pleasure of making things.',
    source: 'from the first page of her book',
  },
  {
    text: 'This compulsion is not a need to create ART but a need to preserve ephemeral things that I love to look at, a need to ‘give out’ some of what I take in.',
    source: 'from the first page of her book',
  },
  {
    text: 'When I was a kid I thought I was the only Leah in the world.',
    source: 'from the Flowers chapter',
  },
  {
    text: 'In recent years I’ve done a lot of still lifes, mostly fruits and vegetables. Patient, colorful and varied in shape, they make ideal models, they last longer than flowers, and they never get restless.',
    source: 'from the Still Life chapter',
  },
];

/** Deterministic daily index, shared by the quote and the daily painting. */
export function dailyIndex(date: Date, length: number): number {
  const epoch = Date.UTC(2024, 0, 1);
  const now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const days = Math.floor((now - epoch) / 86_400_000);
  return ((days % length) + length) % length;
}
