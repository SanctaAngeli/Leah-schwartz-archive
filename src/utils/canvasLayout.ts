import type { Artwork } from '../types';

export interface CanvasItem {
  artworkId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
}

export interface CanvasLayout {
  tileWidth: number;
  tileHeight: number;
  items: CanvasItem[];
}

const TILE_WIDTH = 5280;
const COL_COUNT = 28;
const GAP = 14;
const COL_WIDTH = (TILE_WIDTH - GAP * (COL_COUNT - 1)) / COL_COUNT;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function (): number {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickSpan(random: () => number): number {
  const r = random();
  if (r < 0.03) return 3;
  if (r < 0.20) return 2;
  return 1;
}

function heightForAspect(aspect: Artwork['aspectRatio'], width: number): number {
  switch (aspect) {
    case 'portrait': return width * 1.28;
    case 'landscape': return width * 0.72;
    case 'square':
    default: return width;
  }
}

export function generateCanvasLayout(artworks: Artwork[], seed = 0xC0FFEE): CanvasLayout {
  const random = mulberry32(seed);

  const ordered = [...artworks].sort((a, b) => (a.book_page || 9999) - (b.book_page || 9999));
  for (let i = ordered.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
  }

  const colTops = new Array(COL_COUNT).fill(0);
  const items: CanvasItem[] = [];

  for (const artwork of ordered) {
    const span = Math.min(pickSpan(random), COL_COUNT);
    const w = COL_WIDTH * span + GAP * (span - 1);
    const h = heightForAspect(artwork.aspectRatio, w);

    let bestCol = 0;
    let bestTop = Infinity;
    for (let col = 0; col <= COL_COUNT - span; col++) {
      let topHere = 0;
      for (let k = 0; k < span; k++) {
        if (colTops[col + k] > topHere) topHere = colTops[col + k];
      }
      if (topHere < bestTop - 0.5) {
        bestTop = topHere;
        bestCol = col;
      }
    }

    const x = bestCol * (COL_WIDTH + GAP);
    const y = bestTop;

    items.push({
      artworkId: artwork.id,
      x,
      y,
      w,
      h,
      rotation: 0,
    });

    for (let k = 0; k < span; k++) {
      colTops[bestCol + k] = y + h + GAP;
    }
  }

  const tileHeight = Math.max(...colTops) - GAP;

  return { tileWidth: TILE_WIDTH, tileHeight, items };
}
