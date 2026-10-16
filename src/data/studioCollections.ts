// Her architecture drawings and her objects, from the family's photos
// (August 2026 album). Titles come only from her own captions; a design or
// object with no caption has a null title.

import architectureData from './architecture.json';
import objectsData from './objects.json';

export interface CollectionPhoto {
  src: string;
  thumb: string;
  width: number;
  height: number;
  /** Her caption on this sheet or label, exactly as written. */
  caption: string | null;
  file: string;
  showsLeah?: boolean;
}

export interface CollectionItem {
  id: string;
  title: string | null;
  /** Plain description shown as "Untitled (label)" when there is no title. */
  label?: string;
  subject: string;
  photos: CollectionPhoto[];
}

export interface Collection {
  path: string;
  title: string;
  untitled: string;
  items: CollectionItem[];
}

export function itemName(collection: Collection, item: CollectionItem): string {
  if (item.title) return item.title;
  return item.label ? `Untitled (${item.label})` : collection.untitled;
}

export const ARCHITECTURE: Collection = {
  path: '/studio/architecture',
  title: 'Architecture',
  untitled: 'Untitled house design',
  items: architectureData as CollectionItem[],
};

export const OBJECTS: Collection = {
  path: '/studio/objects',
  title: 'Objects',
  untitled: 'Untitled',
  items: objectsData as CollectionItem[],
};
