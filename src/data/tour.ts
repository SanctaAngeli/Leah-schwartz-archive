// The guided tour: one path through her life and work, in eight chapters.
// Every passage is her own words from the book (or her website statement);
// the only other words are plain titles and short factual lines from the book.
// Stops and quotes live in tour.json.

import tourData from './tour.json';
import artworksData from './artworks.json';
import { ARCHITECTURE, OBJECTS } from './studioCollections';
import type { Artwork } from '../types';

export type TourItemRef =
  | { kind: 'artwork'; id: string }
  | { kind: 'photo'; file: string }
  | { kind: 'architecture'; id: string }
  | { kind: 'object'; id: string };

export interface TourStop {
  id: string;
  title: string;
  type: 'intro' | 'image' | 'video' | 'journal' | 'canvas';
  image: TourItemRef | null;
  caption: string | null;
  journal?: { id: string; page: number };
  quote: { text: string; label: string } | null;
  fact: { text: string } | null;
  more: TourItemRef[];
  moreLabel?: string;
}

export interface TourChapter {
  id: string;
  title: string;
  subtitle: string | null;
  stops: TourStop[];
}

export const TOUR_CHAPTERS = tourData.chapters as TourChapter[];

export interface FlatStop extends TourStop {
  chapter: TourChapter;
  chapterIndex: number;
  index: number;
}

export const TOUR_STOPS: FlatStop[] = TOUR_CHAPTERS.flatMap((chapter, chapterIndex) =>
  chapter.stops.map((s) => ({ ...s, chapter, chapterIndex, index: 0 }))
).map((s, index) => ({ ...s, index }));

const artworks = new Map((artworksData as Artwork[]).map((a) => [a.id, a]));

export interface ResolvedItem {
  key: string;
  thumb: string;
  full: string;
  title: string | null;
  /** Archive page for this item, for "see it in the archive". */
  href: string | null;
}

/** Turn a reference into image paths and a plain title. */
export function resolveItem(ref: TourItemRef): ResolvedItem | null {
  switch (ref.kind) {
    case 'artwork': {
      const a = artworks.get(ref.id);
      if (!a) return null;
      const title = a.display_title || a.title;
      return {
        key: `artwork:${a.id}`,
        thumb: a.thumbPath || a.imagePath || '',
        full: a.imagePath || a.thumbPath || '',
        title: a.year_raw ? `${title}, ${a.year_raw}` : title,
        href: `/artwork/${a.id}`,
      };
    }
    case 'photo':
      return { key: `photo:${ref.file}`, thumb: `/photos/${ref.file}`, full: `/photos/${ref.file}`, title: null, href: null };
    case 'architecture':
    case 'object': {
      const collection = ref.kind === 'architecture' ? ARCHITECTURE : OBJECTS;
      const item = collection.items.find((i) => i.id === ref.id);
      if (!item) return null;
      const p = item.photos[0];
      return { key: `${ref.kind}:${item.id}`, thumb: p.thumb, full: p.src, title: item.title, href: `${collection.path}/${item.id}` };
    }
  }
}

export const TOUR_PROGRESS_KEY = 'leah-tour-stop';
