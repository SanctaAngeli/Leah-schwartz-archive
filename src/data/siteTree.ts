// The site map. Every page a visitor can reach is listed here, so the
// menu, the "you are here" line, the archive section pages and search all
// agree. Add a new page here and it appears everywhere it should.

import artworksData from './artworks.json';
import themesData from './themes.json';
import peopleData from './people.json';
import subjectsData from './subjects.json';
import placesData from './places.json';
import locationsData from './locations.json';
import { JOURNALS } from './journals';
import { ARCHITECTURE, OBJECTS } from './studioCollections';
import { READER_SECTIONS } from './readerSections';

const artworks = artworksData as { id: string; book_page?: number; photo_file?: string }[];

export interface TreeNode {
  title: string;
  path: string;
  /** Short plain count or fact shown on cards, e.g. "12 chapters". */
  note?: string;
  /** Card image (public path). */
  image?: string;
  children?: TreeNode[];
  /** Other routes that belong under this node (detail pages), as path prefixes. */
  owns?: string[];
}

const plural = (n: number, one: string, many = `${one}s`): string => `${n} ${n === 1 ? one : many}`;
const notInBook = artworks.filter((a) => !a.book_page).length;
const thumb = (id: string): string => `/artworks/thumb/${id}.jpg`;

export const ARCHIVE: TreeNode = {
  title: 'Browse the archive',
  path: '/archive',
  children: [
    {
      title: 'Paintings',
      path: '/archive/paintings',
      note: plural(artworks.length, 'work'),
      image: thumb('spring-thicket'),
      owns: ['/artwork/'],
      children: [
        { title: 'The wall', path: '/canvas', note: 'every painting at once', image: thumb('temple-steps-udaipur') },
        { title: "The book's chapters", path: '/themes', note: plural(themesData.length, 'chapter'), image: thumb('three-red-pears'), owns: ['/themes/'] },
        { title: 'Not in the book', path: '/archive/paintings?source=not-in-book', note: plural(notInBook, 'work'), image: thumb('west-marin-dairy-farm') },
        { title: 'By colour', path: '/atlas', note: 'every painting by its colours', image: thumb('purple-iris-thicket') },
        { title: 'Subjects she returned to', path: '/obsessions', image: thumb('mt-tam-from-sonoma') },
        { title: 'Painting of the day', path: '/daily', note: 'a different one every day', image: thumb('giant-euphorbias-at-lake-chala') },
      ],
    },
    {
      title: 'Her words',
      path: '/archive/her-words',
      note: 'her book and journals',
      image: '/journals/singapore-1990/03.jpg',
      children: [
        { title: 'Her book', path: '/her-words', note: plural(READER_SECTIONS.length, 'section'), image: '/photos/p028_02.jpg', owns: ['/her-words/'] },
        { title: 'Journals', path: '/journals', note: plural(JOURNALS.length, 'journal') + ' and a film', image: JOURNALS[0]?.cover.image, owns: ['/journals/'] },
      ],
    },
    {
      title: 'Her life',
      path: '/archive/her-life',
      note: '1920 – 2017',
      image: '/video/leah-reads-her-journal.jpg',
      children: [
        { title: 'Biography', path: '/about', note: 'from her book', image: '/video/leah-reads-her-journal.jpg' },
        { title: 'People', path: '/archive/people', note: plural(peopleData.length, 'person', 'people'), image: thumb('the-remarkable-herman-arthur-schwartz'), owns: ['/people/'] },
      ],
    },
    {
      title: 'Places',
      path: '/archive/places',
      note: plural(placesData.filter((p) => p.artwork_ids.length > 0).length, 'place') + ' with paintings',
      image: thumb('mt-tam-from-sonoma'),
      children: [
        { title: 'Map', path: '/places', note: plural(placesData.length, 'place'), image: thumb('wool-hap-town'), owns: ['/places/'] },
        { title: 'Paintings by region', path: '/locations', note: plural(locationsData.length, 'region'), image: thumb('temple-steps-udaipur'), owns: ['/locations/'] },
      ],
    },
    {
      title: 'Studio and making',
      path: '/archive/studio',
      note: 'how she worked',
      image: ARCHITECTURE.items[0]?.photos[0]?.thumb,
      children: [
        { title: 'How she worked', path: '/studio', note: 'tools, travel kit, influences', image: '/studio/studio-table.jpg' },
        { title: 'Architecture', path: ARCHITECTURE.path, note: plural(ARCHITECTURE.items.length, 'design'), image: ARCHITECTURE.items[0]?.photos[0]?.thumb, owns: [ARCHITECTURE.path + '/'] },
        { title: 'Objects', path: OBJECTS.path, note: plural(OBJECTS.items.length, 'object'), image: OBJECTS.items[0]?.photos[0]?.thumb, owns: [OBJECTS.path + '/'] },
      ],
    },
    {
      title: 'Index',
      path: '/archive/index',
      note: 'people, places and subjects',
      image: thumb('amazing-grace'),
      children: [
        { title: 'A to Z', path: '/index', note: 'the index from her book', image: thumb('amazing-grace'), owns: ['/subjects/'] },
        { title: 'Connections', path: '/constellation', note: plural(subjectsData.length + peopleData.length, 'entry', 'entries'), image: thumb('three-red-pears') },
      ],
    },
  ],
};

/** Small links shown in the footer of archive pages. */
export const FOOTER_LINKS: TreeNode[] = [
  { title: 'About this archive', path: '/preservation' },
  { title: 'My favourites', path: '/favorites' },
  { title: 'Compare two paintings', path: '/compare' },
];

export const MODES = [
  { id: 'tour', title: 'Guided tour', path: '/tour' },
  { id: 'studio', title: 'Explore her studio', path: '/studio' },
  { id: 'archive', title: 'Browse the archive', path: '/archive' },
] as const;

export type ModeId = (typeof MODES)[number]['id'];

/** Which of the three experiences a route belongs to (null on the home page). */
export function modeForPath(pathname: string): ModeId | null {
  if (pathname === '/') return null;
  if (pathname === '/tour' || pathname.startsWith('/tour/')) return 'tour';
  if (pathname === '/studio') return 'studio';
  return 'archive';
}

const stripQuery = (p: string): string => p.split('?')[0];

/**
 * The chain of tree nodes leading to a page, for the "you are here" line,
 * e.g. Browse the archive › Paintings › The book's chapters.
 */
export function trailFor(pathname: string, search = ''): TreeNode[] {
  let best: TreeNode[] = [];
  let bestScore = 0;
  const visit = (node: TreeNode, chain: TreeNode[]): void => {
    const here = [...chain, node];
    const path = stripQuery(node.path);
    const query = node.path.includes('?') ? node.path.slice(node.path.indexOf('?')) : '';
    let score = 0;
    if (pathname === path && (!query || search === query)) score = 3 + here.length + (query ? 1 : 0);
    else if (node.owns?.some((o) => pathname.startsWith(o))) score = 2 + here.length;
    if (score > bestScore) {
      bestScore = score;
      best = here;
    }
    node.children?.forEach((c) => visit(c, here));
  };
  visit(ARCHIVE, []);
  return best;
}

/** Every node, flattened, for search and checks. */
export function allNodes(node: TreeNode = ARCHIVE): TreeNode[] {
  return [node, ...(node.children ?? []).flatMap((c) => allNodes(c))];
}
