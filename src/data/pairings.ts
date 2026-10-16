// Two or three paintings shown side by side, with Leah's own words from the
// book where she wrote about them (verbatim from src/data/prose).

export interface Pairing {
  id: string;
  title: string;
  accent: string;               // hex · ties the pairing visually to the theme
  quote?: string;               // verbatim from her book, if she wrote about it
  quoteSource?: string;         // where that quote came from (book page or chapter)
  artwork_ids: string[];        // 2 or 3 ids
}

export const PAIRINGS: Pairing[] = [
  {
    id: 'mt-tam-through-decades',
    title: 'Mt. Tam',
    accent: '#6B8E5A',
    artwork_ids: [
      'mt-tam-from-sonoma',
      'mt-tam-golden-gate-bridge-sausalito-from-san-francisco',
      'four-views-of-mt-tam',
    ],
  },
  {
    id: 'herman-in-her-hands',
    title: 'Herman',
    accent: '#8B7355',
    quote: 'Dedicated to my dear husband, the remarkable Herman Schwartz',
    quoteSource: 'Dedication',
    artwork_ids: [
      'the-remarkable-herman-arthur-schwartz',
      'happy-birthday-dearest-herman',
    ],
  },
  {
    id: 'the-stained-glass-window',
    title: 'The stained-glass window',
    accent: '#A08070',
    quote: 'The stained glass window is also used in the portrait "AMAZING GRACE".',
    quoteSource: 'Caption, book page 187',
    artwork_ids: ['mill-valley-kitchen', 'amazing-grace'],
  },
  {
    id: 'one-pear-many-times',
    title: 'Pears',
    accent: '#C4A882',
    artwork_ids: ['one-pear', 'one-pear-nine-times', 'three-red-pears'],
  },
  {
    id: 'two-views-of-naxos',
    title: 'Naxos',
    accent: '#3E8FC4',
    artwork_ids: ['archway-at-the-top-of-town-naxos', 'side-street-naxos'],
  },
  {
    id: 'the-petaluma-river',
    title: 'The Petaluma River',
    accent: '#7A8B9A',
    artwork_ids: [
      'petaluma-river',
      'banks-of-the-petaluma-river-red-barn',
      'six-days-on-the-petaluma-river',
    ],
  },
  {
    id: 'self-portraits',
    title: 'Self-portraits',
    accent: '#A0522D',
    artwork_ids: [
      'self-portrait',
      'self-portrait-with-floating-flowers',
      'self-portrait-with-chrysanths',
    ],
  },
  {
    id: 'the-bolinas-house',
    title: 'Bolinas',
    accent: '#8B7D6B',
    artwork_ids: ['bolinas-before-remodeling', 'bolinas-kitchen'],
  },
];
