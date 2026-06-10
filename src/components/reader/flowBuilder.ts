// The rhythm engine behind the reader.
//
// Takes a section's markdown (after artwork-mention linking), the book
// photographs for its page range, and a fill list of same-chapter works,
// and produces a deterministic sequence of blocks obeying one rule:
// NEVER MORE THAN `MAX_RUN` PARAGRAPHS WITHOUT SOMETHING TO LOOK AT.
//
// Visual events come from the book itself wherever possible:
//   · photographs placed at the page where she is in the story
//   · caption lines ("DANIEL AND ME") attached to those photographs
//   · whole-line painting captions become full painting moments
// and only then from the rhythm fill (unused works from the same chapter).

export const MAX_RUN = 5;

export interface FlowPhoto {
  file: string;
  pdf_page: number;
  book_page: number;
}

export type FlowBlock =
  | { type: 'prose'; md: string }
  | { type: 'photo'; photo: FlowPhoto; caption: string | null }
  | { type: 'painting'; slug: string; caption: string | null };

interface RawBlock {
  md: string;
  page: number; // pdf page this block sits on (last marker seen)
}

/** Whole-block painting caption: an artwork link at the start, with at most a
 *  short trailing caption ("[P&R SURPLUS](/artwork/x), 16x20. Another …"). */
const PAINTING_CAPTION_RE = /^\[([^\]]+)\]\(\/artwork\/([a-z0-9-]+)(?:#first)?\)([\s\S]{0,260})$/;

/** A photo caption line: short, no link, shouting in caps. */
function isPhotoCaption(md: string): boolean {
  if (md.includes('](')) return false;
  if (md.length > 160 || md.includes('\n')) return false;
  const letters = md.replace(/[^a-zA-Z]/g, '');
  if (letters.length < 3) return false;
  const upper = letters.replace(/[^A-Z]/g, '');
  return upper.length / letters.length > 0.7;
}

function splitRawBlocks(body: string): RawBlock[] {
  const out: RawBlock[] = [];
  let page = 0;
  for (const part of body.split(/\n\s*\n+/)) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const marker = trimmed.match(/^<!-- page (\d+) -->$/);
    if (marker) { page = parseInt(marker[1], 10); continue; }
    // Strip any inline markers that survived inside a block.
    const md = trimmed.replace(/<!-- page (\d+) -->\n?/g, '').trim();
    if (!md) continue;
    const inline = trimmed.match(/<!-- page (\d+) -->/);
    if (inline) page = parseInt(inline[1], 10);
    out.push({ md, page });
  }
  return out;
}

export function buildFlow(
  body: string,
  photos: FlowPhoto[],
  fillSlugs: string[]
): { blocks: FlowBlock[]; paintingSlugs: Set<string> } {
  const raw = splitRawBlocks(body);
  const blocks: FlowBlock[] = [];
  const paintingSlugs = new Set<string>();
  const photoQueue = [...photos].sort((a, b) => a.pdf_page - b.pdf_page);
  let pendingCaption: { text: string; page: number } | null = null;

  const placePhotosUpTo = (page: number): void => {
    while (photoQueue.length && photoQueue[0].pdf_page <= page) {
      const photo = photoQueue.shift()!;
      // A caption only belongs to a photograph from the same spread.
      const caption =
        pendingCaption && Math.abs(photo.pdf_page - pendingCaption.page) <= 2
          ? pendingCaption.text
          : null;
      blocks.push({ type: 'photo', photo, caption });
      if (caption) pendingCaption = null;
    }
  };

  for (const b of raw) {
    const paintingMatch = b.md.match(PAINTING_CAPTION_RE);
    if (paintingMatch) {
      const [, , slug, rest] = paintingMatch;
      paintingSlugs.add(slug);
      blocks.push({
        type: 'painting',
        slug,
        caption: rest.replace(/^[,.\s]+/, '').trim() || null,
      });
      continue;
    }
    if (isPhotoCaption(b.md)) {
      // Caption for the photograph on this spread - hold it for the photo.
      pendingCaption = { text: b.md, page: b.page };
      placePhotosUpTo(b.page);
      continue;
    }
    blocks.push({ type: 'prose', md: b.md });
    placePhotosUpTo(b.page);
  }
  // Any photographs left over (markers past the last prose) trail the text.
  placePhotosUpTo(Infinity);

  // ── Rhythm pass · break up runs longer than MAX_RUN paragraphs ──
  const fill = fillSlugs.filter((s) => !paintingSlugs.has(s));
  const result: FlowBlock[] = [];
  let run = 0;
  for (const block of blocks) {
    if (block.type !== 'prose') {
      result.push(block);
      run = 0;
      continue;
    }
    if (run >= MAX_RUN && fill.length) {
      const slug = fill.shift()!;
      paintingSlugs.add(slug);
      result.push({ type: 'painting', slug, caption: null });
      run = 0;
    }
    result.push(block);
    run += 1;
  }

  return { blocks: result, paintingSlugs };
}
