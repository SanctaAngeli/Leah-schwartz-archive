// The museum's floor plan.
//
// One lobby, five wings. Every route on the site belongs to a wing, every
// signature experience is a door inside one, and the TOUR_ORDER below is the
// curated walking route: a visitor who only ever presses "continue" sees the
// whole museum, in order.

export interface WingDoor {
  to: string;
  title: string;
  /** Set in Caveat - her voice, lowercase. */
  tagline: string;
  /** One plain sentence under the card. */
  blurb: string;
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
      '/pairings', '/last-paintings', '/artwork', '/compare', '/favorites',
    ],
  },
  {
    id: 'her-story',
    path: '/her-story',
    label: 'Her Story',
    routes: ['/her-story', '/her-words', '/at-her-age', '/daily'],
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
    routes: ['/studio', '/studio-visit', '/walk'],
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
    tagline: 'all 267, drifting',
    blurb: 'Every painting on one wall. Drag to wander, click any piece.',
    visual: { kind: 'artwork', id: 'temple-steps-udaipur' },
    hero: true,
  },
  {
    to: '/themes',
    title: 'The Twelve Chapters',
    tagline: 'the book’s own rooms',
    blurb: 'Her work as she organized it - from Old Stuff to Travel.',
    visual: { kind: 'artwork', id: 'three-red-pears' },
  },
  {
    to: '/atlas',
    title: 'A Lifetime in Color',
    tagline: 'her palette, year by year',
    blurb: 'Every painting reduced to its pigments - six decades of color.',
    visual: { kind: 'spectrum' },
  },
  {
    to: '/obsessions',
    title: 'Obsessions',
    tagline: 'serial attention',
    blurb: 'The subjects she returned to: Mt. Tam, Herman, one pear.',
    visual: { kind: 'artwork', id: 'mt-tam-from-sonoma' },
  },
  {
    to: '/pairings',
    title: 'Pairings',
    tagline: 'paintings, next to each other',
    blurb: 'Curated diptychs - what two works say in chorus.',
    visual: { kind: 'artwork', id: 'amazing-grace' },
  },
  {
    to: '/last-paintings',
    title: 'The Last Paintings',
    tagline: 'a quiet room',
    blurb: 'The late work, 2002-2004, shown slowly and at size.',
    visual: { kind: 'artwork', id: 'one-pear-nine-times' },
  },
];

export const HER_STORY_DOORS: WingDoor[] = [
  {
    to: '/her-words',
    title: 'In Her Own Words',
    tagline: 'the autobiography, as she wrote it',
    blurb: 'Fourteen sections, from IMMIGRANTS to the last chapters - her voice in full.',
    visual: { kind: 'photo', src: '/photos/p028_02.jpg' },
    hero: true,
  },
  {
    to: '/at-her-age',
    title: 'At Her Age',
    tagline: '1920 - 2004, one slider',
    blurb: 'A photograph of Leah at every age, beside the paintings she was making.',
    visual: { kind: 'artwork', id: 'self-portrait' },
  },
  {
    to: '/daily',
    title: 'Painting of the Day',
    tagline: 'come back tomorrow',
    blurb: 'One painting each day, with her words when she wrote about it.',
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
  blurb: string;
}

export const TOUR_ORDER: TourStop[] = [
  { path: '/paintings',      title: 'The Paintings',        blurb: 'six ways into 267 works' },
  { path: '/canvas',         title: 'The Canvas',           blurb: 'all of them, drifting' },
  { path: '/themes',         title: 'The Twelve Chapters',  blurb: 'the book’s own rooms' },
  { path: '/atlas',          title: 'A Lifetime in Color',  blurb: 'her palette, year by year' },
  { path: '/obsessions',     title: 'Obsessions',           blurb: 'the subjects she returned to' },
  { path: '/pairings',       title: 'Pairings',             blurb: 'paintings in chorus' },
  { path: '/last-paintings', title: 'The Last Paintings',   blurb: 'a quiet room' },
  { path: '/her-story',      title: 'Her Story',            blurb: 'the life behind the work' },
  { path: '/her-words',      title: 'In Her Own Words',     blurb: 'the autobiography' },
  { path: '/at-her-age',     title: 'At Her Age',           blurb: '84 years on one slider' },
  { path: '/studio',         title: 'The Studio',           blurb: 'her table, her tools' },
  { path: '/studio-visit',   title: 'A Studio Visit',       blurb: 'Mill Valley, 1985' },
  { path: '/walk',           title: 'Walk With Her',        blurb: 'a guided drift' },
  { path: '/places',         title: 'Places',               blurb: 'where she painted' },
  { path: '/index',          title: 'The Index',            blurb: 'her own back-of-book index' },
  { path: '/constellation',  title: 'The Constellation',    blurb: 'the mind of the archive' },
  { path: '/about',          title: 'About Leah',           blurb: 'who she was' },
  { path: '/',               title: 'The Lobby',            blurb: 'back to the front door' },
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
    text: 'I love the process of what I do — the feel of a brush on canvas, the flow of color on a fresh sheet of watercolor paper, and the intense pleasure of making things.',
    source: 'from the first page of her book',
  },
  {
    text: 'Not a need to create ART but a need to preserve ephemeral things that I love to look at. It’s one way of keeping a scrapbook.',
    source: 'from the first page of her book',
  },
  {
    text: 'When I was a kid I thought I was the only Leah in the world.',
    source: 'from the Flowers chapter',
  },
  {
    text: 'Patient, colorful and varied in shape, they make ideal models — they last longer than flowers, and they never get restless.',
    source: 'on still lifes',
  },
  {
    text: 'I have always loved detail. Every detail is part of the fabric of someone’s life.',
    source: 'from the On the Road chapter',
  },
];

/** Deterministic daily index, shared by the quote and the daily painting. */
export function dailyIndex(date: Date, length: number): number {
  const epoch = Date.UTC(2024, 0, 1);
  const now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const days = Math.floor((now - epoch) / 86_400_000);
  return ((days % length) + length) % length;
}
