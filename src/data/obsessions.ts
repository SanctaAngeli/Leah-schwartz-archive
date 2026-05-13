// Subjects she returned to — auto-clustered from title patterns,
// hand-curated for tone and order. The point is to surface her serial
// attention: the subjects she painted again and again across decades.

export interface Obsession {
  id: string;
  title: string;
  subtitle: string;       // a short phrase
  note: string;           // 1-2 sentences in our voice
  match: string[];        // lowercased title tokens · ANY-match
  exclude?: string[];     // titles containing these tokens are NOT in the cluster
  accent: string;         // hex · soft hue tied to the subject
}

export const OBSESSIONS: Obsession[] = [
  {
    id: 'mt-tam',
    title: 'Mt. Tam',
    subtitle: 'The mountain she returned to',
    note: 'Mount Tamalpais was visible from her Mill Valley studio. She painted it from Sonoma, from San Francisco, four ways at once · the silhouette became a constant in her eye.',
    match: ['mt.', 'tam', 'tamalpais'],
    accent: '#6B8E5A',
  },
  {
    id: 'irises',
    title: 'Irises',
    subtitle: 'The bloom she catalogued',
    note: 'She painted irises like a botanist — pale blue, lavender, white, wild bronze. Each one studied long enough to know how the light came through its petals.',
    match: ['iris', 'irises'],
    accent: '#9078A8',
  },
  {
    id: 'bolinas',
    title: 'Bolinas',
    subtitle: 'The weekend land',
    note: 'A piece of California that juts out into the Pacific on the wrong side of the San Andreas Fault. Their weekend retreat · the house before remodeling, the kitchen, the soccer team, the road.',
    match: ['bolinas'],
    accent: '#7A8B9A',
  },
  {
    id: 'naxos',
    title: 'Naxos',
    subtitle: 'The Greek island, in pieces',
    note: 'She and Herman returned to Naxos repeatedly. The archway at the top of town, side streets in whitewashed quiet, the breakwater, the smoke trees. A place painted as a constellation, not a single view.',
    match: ['naxos'],
    accent: '#3E8FC4',
  },
  {
    id: 'petaluma',
    title: 'The Petaluma River',
    subtitle: 'Six days on one water',
    note: 'A river she kept coming back to. The red barn on its banks. A farm in the distance. And then six days spent painting only the river itself · slow attention as a subject.',
    match: ['petaluma'],
    accent: '#5B6B7A',
  },
  {
    id: 'gello',
    title: 'Gello',
    subtitle: 'A Tuscan room, lived in',
    note: 'The kitchen at Gello, its window, the doorway down the stairs, the church and wall. An entire small Tuscan world, painted from inside it.',
    match: ['gello'],
    accent: '#C49650',
  },
  {
    id: 'self-portraits',
    title: 'Self-portraits',
    subtitle: 'Looking back',
    note: 'She let herself age in paint, and watched herself back without flinching. One straight, one with floating flowers, one with chrysanths, one with Vladimir.',
    match: ['self portrait', 'self-portrait'],
    accent: '#A0522D',
  },
  {
    id: 'pears',
    title: 'Pears',
    subtitle: 'Serial attention',
    note: 'She painted pears like a pianist runs scales · over and over, until the form went from fruit to geometry. One pear, one pear nine times, Boscs, Bartletts, red and yellow.',
    match: ['pear', 'pears', 'bartlett', 'boscs', 'bosc'],
    accent: '#C4A882',
  },
  {
    id: 'persimmons',
    title: 'Persimmons',
    subtitle: 'The autumn obsession',
    note: 'Always alongside something else — a turnip, a rutabaga, an apple core. Five paintings stage the persimmon among its kitchen companions.',
    match: ['persimmon'],
    accent: '#C47A3A',
  },
  {
    id: 'onions',
    title: 'Onions',
    subtitle: 'Two golden ones',
    note: '"Golden Onion #1", "Golden Onion #2", and the onion among other root vegetables. A kitchen subject she gave the gravity of a portrait.',
    match: ['onion'],
    accent: '#B89058',
  },
  {
    id: 'roses',
    title: 'Roses',
    subtitle: 'White and pale pink',
    note: 'Mostly white roses, mostly with companions — cosmos, a Botticelli reproduction, a Renaissance prince. The rose used as the still center of a small composed world.',
    match: ['rose', 'roses'],
    exclude: ['rosie'],
    accent: '#E0B8C8',
  },
  {
    id: 'kitchens',
    title: 'Kitchens',
    subtitle: 'Where she actually lived',
    note: 'Mill Valley, Bolinas, Gello — each kitchen painted, each one a portrait of a place she knew well enough to leave alone.',
    match: ['kitchen'],
    accent: '#8B7355',
  },
  {
    id: 'marin-roads',
    title: 'Marin & the Headlands',
    subtitle: 'Where she was driving from',
    note: 'The Golden Gate Bridge from her side, the Headlands beyond, Highway 101, Marin County in spring with trucks. Painted close to home, often through a windshield or a van window.',
    match: ['marin', 'sonoma', 'rodeo', 'headlands'],
    accent: '#7A9568',
  },
  {
    id: 'side-streets',
    title: 'Side streets',
    subtitle: 'The random moment',
    note: 'Side street, Naxos. Tokyo side street. Side street, woman and pig. She had an eye for the angle where ordinary life happened without anyone composing it.',
    match: ['side street'],
    accent: '#9A8870',
  },
  {
    id: 'markets',
    title: 'Markets',
    subtitle: 'Country corners',
    note: 'Nob Hill, Courtland, Valley Ford, Dijon · a market in every place she traveled. The same subject across continents.',
    match: ['market'],
    accent: '#C46B4E',
  },
];
