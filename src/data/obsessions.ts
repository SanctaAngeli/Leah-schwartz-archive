// Repeated subjects, clustered from painting titles. Each group is just a
// title and the paintings whose titles match.

export interface Obsession {
  id: string;
  title: string;
  match: string[];        // lowercased title tokens · ANY-match
  exclude?: string[];     // titles containing these tokens are NOT in the cluster
  accent: string;         // hex · soft hue tied to the subject
}

export const OBSESSIONS: Obsession[] = [
  {
    id: 'mt-tam',
    title: 'Mt. Tam',
    match: ['mt.', 'tam', 'tamalpais'],
    accent: '#6B8E5A',
  },
  {
    id: 'irises',
    title: 'Irises',
    match: ['iris', 'irises'],
    accent: '#9078A8',
  },
  {
    id: 'bolinas',
    title: 'Bolinas',
    match: ['bolinas'],
    accent: '#7A8B9A',
  },
  {
    id: 'naxos',
    title: 'Naxos',
    match: ['naxos'],
    accent: '#3E8FC4',
  },
  {
    id: 'petaluma',
    title: 'The Petaluma River',
    match: ['petaluma'],
    accent: '#5B6B7A',
  },
  {
    id: 'gello',
    title: 'Gello',
    match: ['gello'],
    accent: '#C49650',
  },
  {
    id: 'self-portraits',
    title: 'Self-portraits',
    match: ['self portrait', 'self-portrait'],
    accent: '#A0522D',
  },
  {
    id: 'pears',
    title: 'Pears',
    match: ['pear', 'pears', 'bartlett', 'boscs', 'bosc'],
    accent: '#C4A882',
  },
  {
    id: 'persimmons',
    title: 'Persimmons',
    match: ['persimmon'],
    accent: '#C47A3A',
  },
  {
    id: 'onions',
    title: 'Onions',
    match: ['onion'],
    accent: '#B89058',
  },
  {
    id: 'roses',
    title: 'Roses',
    match: ['rose', 'roses'],
    exclude: ['rosie'],
    accent: '#E0B8C8',
  },
  {
    id: 'kitchens',
    title: 'Kitchens',
    match: ['kitchen'],
    accent: '#8B7355',
  },
  {
    id: 'marin-roads',
    title: 'Marin & the Headlands',
    match: ['marin', 'sonoma', 'rodeo', 'headlands'],
    accent: '#7A9568',
  },
  {
    id: 'side-streets',
    title: 'Side streets',
    match: ['side street'],
    accent: '#9A8870',
  },
  {
    id: 'markets',
    title: 'Markets',
    match: ['market'],
    accent: '#C46B4E',
  },
];
