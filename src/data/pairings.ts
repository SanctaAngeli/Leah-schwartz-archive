// Curated diptychs and triptychs · editorial pairings of Leah's work.
// Each pairing is a hand-crafted comparison with a short curatorial note and,
// where possible, a direct quote from Leah.

export interface Pairing {
  id: string;
  title: string;
  subtitle: string;             // short phrase
  accent: string;               // hex · ties the pairing visually to the theme
  curatorial: string;           // note written for the pairing
  quote?: string;               // Leah quote, if we have one
  quoteSource?: string;         // where that quote came from (book page or chapter)
  artwork_ids: string[];        // 2 or 3 ids
}

export const PAIRINGS: Pairing[] = [
  {
    id: 'mt-tam-through-decades',
    title: 'Mt. Tam, returned to',
    subtitle: 'The mountain she painted most',
    accent: '#6B8E5A',
    curatorial:
      'Three paintings of Mount Tamalpais, the peak visible from her Mill Valley studio. She painted it in pieces · now from Sonoma, now from San Francisco, now in multiples · returning to its silhouette over forty years like a constant in her eye.',
    artwork_ids: [
      'mt-tam-from-sonoma',
      'mt-tam-golden-gate-bridge-sausalito-from-san-francisco',
      'four-views-of-mt-tam',
    ],
  },
  {
    id: 'herman-in-her-hands',
    title: 'Herman, in her hands',
    subtitle: '"The remarkable Herman"',
    accent: '#8B7355',
    curatorial:
      'Two portraits of Leah\'s husband. She called him "the remarkable Herman" throughout her book, and painted him with the directness she reserved for those she knew down to the bone.',
    quote: 'This book is dedicated to my dear husband, the remarkable Herman Schwartz.',
    quoteSource: 'Dedication',
    artwork_ids: [
      'the-remarkable-herman-arthur-schwartz',
      'happy-birthday-dearest-herman',
    ],
  },
  {
    id: 'the-stained-glass-window',
    title: 'The stained-glass window, twice',
    subtitle: 'A detail, migrated',
    accent: '#A08070',
    curatorial:
      'The stained-glass window from her Mill Valley kitchen reappears as the light source in the portrait Amazing Grace. One window, two paintings · the kitchen made holy and the portrait made domestic, both at once.',
    quote: 'The stained glass window is also used in the portrait "AMAZING GRACE".',
    quoteSource: 'Caption, book page 187',
    artwork_ids: ['mill-valley-kitchen', 'amazing-grace'],
  },
  {
    id: 'one-pear-many-times',
    title: 'One pear, many times',
    subtitle: 'Serial attention',
    accent: '#C4A882',
    curatorial:
      'Leah painted pears like a pianist runs scales · over and over, until the form went from fruit to geometry. These three belong together: one pear, one pear nine times, a pear with its ornate cousins.',
    artwork_ids: ['one-pear', 'one-pear-nine-times', 'three-red-pears'],
  },
  {
    id: 'two-views-of-naxos',
    title: 'Two views of Naxos',
    subtitle: 'Facing pages, one island',
    accent: '#3E8FC4',
    curatorial:
      'These two watercolours face each other in the book. The archway at the top of town looks down; the side street sits in whitewashed quiet. Together they triangulate a place more than either does alone.',
    artwork_ids: ['archway-at-the-top-of-town-naxos', 'side-street-naxos'],
  },
  {
    id: 'the-petaluma-river',
    title: 'The Petaluma River, returned to',
    subtitle: 'Six days on one water',
    accent: '#7A8B9A',
    curatorial:
      'A river she kept coming back to. The red barn on its banks. A farm in the distance. And then six days spent painting only the river itself · slow attention as a subject.',
    artwork_ids: [
      'petaluma-river',
      'banks-of-the-petaluma-river-red-barn',
      'six-days-on-the-petaluma-river',
    ],
  },
  {
    id: 'self-portraits',
    title: 'Self-portraits, across time',
    subtitle: 'Looking back',
    accent: '#A0522D',
    curatorial:
      'Three self-portraits. One straight, one with floating flowers, one with chrysanthemums. She let herself age in paint, and watched herself back without flinching.',
    artwork_ids: [
      'self-portrait',
      'self-portrait-with-floating-flowers',
      'self-portrait-with-chrysanths',
    ],
  },
  {
    id: 'the-bolinas-house',
    title: 'The Bolinas house, before and after',
    subtitle: 'Home rebuilt',
    accent: '#8B7D6B',
    curatorial:
      'Leah and Herman bought a waterfront lot in Bolinas and built on it. She painted the house before and after · the unfinished bones and the rooms that eventually held her weekend life.',
    artwork_ids: ['bolinas-before-remodeling', 'bolinas-kitchen'],
  },
];
