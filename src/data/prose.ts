// Central loader for Leah's book prose, imported as raw markdown via Vite.
// Keyed by chapter slug + a small set of non-chapter narrative sections.

import frontMatter from './prose/00_front_matter.md?raw';
import autobiography from './prose/01_autobiography.md?raw';
import oldStuff from './prose/02_old_stuff.md?raw';
import abstract from './prose/03_abstract.md?raw';
import socialComment from './prose/04_social_comment.md?raw';
import onTheRoad from './prose/05_on_the_road.md?raw';
import landscape from './prose/06_landscape.md?raw';
import streetScenes from './prose/07_street_scenes.md?raw';
import portraits from './prose/08_portraits.md?raw';
import stillLife from './prose/09_still_life.md?raw';
import interiors from './prose/10_interiors.md?raw';
import flowers from './prose/11_flowers.md?raw';
import travel from './prose/12_travel.md?raw';
import highSierra from './prose/13_high_sierra.md?raw';

export interface ProseSection {
  id: string;                   // section slug · matches chapter slug where applicable
  label: string;                // display title
  tagline: string;              // Leah's subtitle phrase
  markdown: string;             // raw markdown content
  chapter: string | null;       // chapter this relates to, for cross-linking
}

export const PROSE_SECTIONS: ProseSection[] = [
  { id: 'front',          label: 'Introduction',    tagline: 'Why this book exists',            markdown: frontMatter,    chapter: null },
  { id: 'autobiography',  label: 'Autobiography',   tagline: 'A life, in her own words',        markdown: autobiography,  chapter: 'autobiography' },
  { id: 'old-stuff',      label: 'Old Stuff',       tagline: 'Salvage of thirty years',         markdown: oldStuff,       chapter: 'old-stuff' },
  { id: 'abstract',       label: 'Abstract',        tagline: 'Trying to be trendy',             markdown: abstract,       chapter: 'abstract' },
  { id: 'social-comment', label: 'Social Comment',  tagline: 'Rising from yeasty times',        markdown: socialComment,  chapter: 'social-comment' },
  { id: 'on-the-road',    label: 'On the Road',     tagline: 'Facades of obscure lives',        markdown: onTheRoad,      chapter: 'on-the-road' },
  { id: 'landscape',      label: 'Landscape',       tagline: 'Vanishing verdant valleys',       markdown: landscape,      chapter: 'landscape' },
  { id: 'street-scenes',  label: 'Street Scenes',   tagline: 'The random moment',               markdown: streetScenes,   chapter: 'street-scenes' },
  { id: 'portraits',      label: 'Portraits',       tagline: 'Beauty and self-possession',      markdown: portraits,      chapter: 'portraits' },
  { id: 'still-life',     label: 'Still Life',      tagline: 'In love with simple objects',     markdown: stillLife,      chapter: 'still-life' },
  { id: 'interiors',      label: 'Interiors',       tagline: 'Gimme shelter',                   markdown: interiors,      chapter: 'interiors' },
  { id: 'flowers',        label: 'Flowers',         tagline: 'In love with bloom',              markdown: flowers,        chapter: 'flowers' },
  { id: 'travel',         label: 'Travel',          tagline: 'Nine countries, one notebook',    markdown: travel,         chapter: 'travel' },
  { id: 'high-sierra',    label: 'High Sierra',     tagline: 'Two weeks of granite every summer', markdown: highSierra,   chapter: null },
];

export function getProseByChapter(chapterId: string): ProseSection | undefined {
  return PROSE_SECTIONS.find((s) => s.chapter === chapterId);
}

export function cleanProse(md: string): string {
  return md
    .replace(/<!-- page \d+ -->\n?/g, '')
    .replace(/\*PDF pages[^*]+\*\s*/g, '');
}

/** Strip the in-file header block that reader pages already render themselves:
 *  the top-level `# Title`, a `## NAME` heading matching the page's own label,
 *  and the standalone `*tagline*` line. Keeps every other heading (the
 *  autobiography's section headers, the travel chapter's region headers). */
export function stripRedundantChapterHeader(
  md: string,
  label?: string,
  tagline?: string
): string {
  let out = md.replace(/^#\s[^\n]+\n/, '');
  const escape = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (label) {
    // The heading plus the standalone *tagline* line right under it, if any.
    out = out.replace(
      new RegExp(`^##\\s+${escape(label)}\\s*$\\n(\\s*\\n)*(\\*[^*\\n]+\\*[ \\t]*$\\n?)?`, 'im'),
    '');
  }
  if (tagline) {
    out = out.replace(new RegExp(`^\\*${escape(tagline)}\\*[ \\t]*$\\n?`, 'im'), '');
  }
  return out;
}

/** Return just the first few paragraphs of a chapter essay, stripped of headings. */
export function getProseExcerpt(md: string, maxParagraphs = 2): string {
  const cleaned = cleanProse(md);
  // Drop the top-level # title and any lines that are purely section headers/taglines
  const lines = cleaned.split('\n');
  const paragraphs: string[] = [];
  let current: string[] = [];
  let seenHeading = false;
  for (const line of lines) {
    if (/^#\s/.test(line)) continue;                                  // skip top title
    if (/^##\s/.test(line)) {                                          // chapter H2
      seenHeading = true;
      if (current.length) { paragraphs.push(current.join(' ').trim()); current = []; }
      continue;
    }
    if (!seenHeading) continue;                                        // wait for real content
    if (/^\*[^*]*\*\s*$/.test(line.trim())) continue;                  // italic tagline alone
    if (line.trim() === '') {
      if (current.length) { paragraphs.push(current.join(' ').trim()); current = []; }
      if (paragraphs.length >= maxParagraphs) break;
    } else {
      current.push(line.trim());
    }
  }
  if (current.length) paragraphs.push(current.join(' ').trim());
  return paragraphs.slice(0, maxParagraphs).join('\n\n');
}
