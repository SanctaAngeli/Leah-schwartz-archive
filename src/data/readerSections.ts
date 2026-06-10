// The reader's table of contents.
//
// Her book, re-paced for reading: the autobiography splits into HER OWN
// sections (## IMMIGRANTS · *genetic baggage* …), the twelve chapter essays
// follow in book order, and each section knows its PDF page range so the
// right photographs surface at the right moments.

import { PROSE_SECTIONS, cleanProse } from './prose';

export interface ReaderSection {
  id: string;
  /** Verbatim from the book (her headings are set in caps). */
  label: string;
  tagline: string;
  /** Which part of the book this belongs to. */
  part: 'introduction' | 'autobiography' | 'chapters';
  /** Markdown body - page markers retained for photo placement. */
  body: string;
  /** Chapter slug for cross-linking to the gallery room, if any. */
  chapter: string | null;
  /** PDF page range covered, derived from the page markers in the body. */
  pdfRange: [number, number] | null;
  /** Estimated reading minutes. */
  minutes: number;
}

function titleCase(caps: string): string {
  return caps
    .toLowerCase()
    .replace(/(^|[\s,.-])([a-z])/g, (...args: string[]) => args[1] + args[2].toUpperCase())
    .replace(/\bAnd\b/g, 'and')
    .replace(/(.)\bThe\b/g, '$1the')
    .replace(/\bOf\b/g, 'of')
    .replace(/(.)\bA\b/g, '$1a');
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function pdfRangeOf(body: string): [number, number] | null {
  const pages = [...body.matchAll(/<!-- page (\d+) -->/g)].map((m) => parseInt(m[1], 10));
  if (!pages.length) return null;
  return [Math.min(...pages), Math.max(...pages)];
}

function minutesOf(body: string): number {
  const words = cleanProse(body).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Split the autobiography markdown on her ## section headings. */
function splitAutobiography(md: string): ReaderSection[] {
  const lines = md.split('\n');
  const sections: { label: string; tagline: string; start: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^##\s+(.+)$/);
    if (!m) continue;
    // The tagline is the standalone *italic* line right under the heading.
    let tagline = '';
    for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
      const t = lines[j].trim();
      if (!t) continue;
      const tm = t.match(/^\*([^*]+)\*$/);
      if (tm) tagline = tm[1];
      break;
    }
    sections.push({ label: m[1].trim(), tagline, start: i });
  }
  return sections.map((s, idx) => {
    const end = idx + 1 < sections.length ? sections[idx + 1].start : lines.length;
    // Body starts after the heading and its tagline line.
    const bodyLines = lines.slice(s.start + 1, end).filter(
      (l, i2) => !(i2 < 4 && l.trim() === `*${s.tagline}*`)
    );
    const body = bodyLines.join('\n').trim();
    return {
      id: slugify(s.label),
      label: s.label,
      tagline: s.tagline,
      part: 'autobiography' as const,
      body,
      chapter: null,
      pdfRange: pdfRangeOf(body),
      minutes: minutesOf(body),
    };
  });
}

/** Her opening page + the preface, extracted from the front matter (the
 *  rest of that file is jacket copy in other people's voices - not for the
 *  reader). The end sentinel sits in the markdown source. */
function introSection(): ReaderSection {
  const front = PROSE_SECTIONS.find((s) => s.id === 'front');
  let body = '';
  if (front) {
    const md = front.markdown;
    const start = md.indexOf('I LOVE THE PROCESS');
    const end = md.indexOf('<!-- end of her own pages -->');
    if (start !== -1 && end !== -1) body = md.slice(start, end).trim();
  }
  return {
    id: 'introduction',
    label: 'WHY I PAINT',
    tagline: 'her opening pages',
    part: 'introduction',
    body,
    chapter: null,
    pdfRange: [1, 15],
    minutes: minutesOf(body),
  };
}

const autobiographyMd = PROSE_SECTIONS.find((s) => s.id === 'autobiography')?.markdown ?? '';

const chapterSections: ReaderSection[] = PROSE_SECTIONS.filter(
  (s) => s.id !== 'front' && s.id !== 'autobiography'
).map((s) => ({
  id: s.id,
  label: s.label.toUpperCase(),
  tagline: s.tagline.toLowerCase(),
  part: 'chapters' as const,
  body: s.markdown,
  chapter: s.chapter,
  pdfRange: pdfRangeOf(s.markdown),
  minutes: minutesOf(s.markdown),
}));

export const READER_SECTIONS: ReaderSection[] = [
  introSection(),
  ...splitAutobiography(autobiographyMd),
  ...chapterSections,
];

export function readerSectionById(id: string): ReaderSection | undefined {
  return READER_SECTIONS.find((s) => s.id === id);
}

export function displayLabel(section: ReaderSection): string {
  return titleCase(section.label);
}

/** Old deep links: /her-words/autobiography → her first section. */
export const READER_REDIRECTS: Record<string, string> = {
  autobiography: 'immigrants',
  front: 'introduction',
};
