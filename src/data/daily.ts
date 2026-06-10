// The daily rotation · one painting per day, deterministic by date.
// Shared by the lobby (which displays today's painting) and /daily
// (the destination with her words about it), so they always agree.

import artworksData from './artworks.json';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

// Only artworks with a clean image, so the daily never shows a placeholder
// or a full-page scan fallback.
const rotation: Artwork[] =
  artworks.filter((a) => a.imagePath && !a.needs_crop).length > 0
    ? artworks.filter((a) => a.imagePath && !a.needs_crop)
    : artworks.filter((a) => a.imagePath);

/** Days since an arbitrary epoch · deterministic index into any rotation. */
export function daysSinceEpoch(date: Date): number {
  const epoch = Date.UTC(2024, 0, 1);
  const now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((now - epoch) / 86_400_000);
}

export function pickArtworkForDay(date: Date): Artwork {
  const idx = ((daysSinceEpoch(date) % rotation.length) + rotation.length) % rotation.length;
  return rotation[idx];
}

export function formatLobbyDate(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
