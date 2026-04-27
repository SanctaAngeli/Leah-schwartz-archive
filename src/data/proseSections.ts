// Extract a named section (by ## heading match) from a markdown blob.

import { cleanProse } from './prose';

/** Return the text of the ## section whose heading contains `headingPart`.
 *  Strips the heading + tagline; returns plain prose body. */
export function extractSection(md: string, headingPart: string): string | null {
  const cleaned = cleanProse(md);
  const lines = cleaned.split('\n');
  const upperMatch = headingPart.toUpperCase();
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s/.test(line) && line.toUpperCase().includes(upperMatch)) {
      startIdx = i + 1;
      break;
    }
  }
  if (startIdx < 0) return null;
  // End at the next ## heading
  let endIdx = lines.length;
  for (let j = startIdx; j < lines.length; j++) {
    if (/^##\s/.test(lines[j])) { endIdx = j; break; }
  }
  const body = lines.slice(startIdx, endIdx).join('\n').trim();
  // Drop leading tagline *italic*
  return body.replace(/^\*[^*\n]*\*\s*\n?/, '').trim();
}

/** Grab the first N paragraphs of a body of prose. */
export function firstParagraphs(md: string, count = 2): string {
  const cleaned = cleanProse(md).replace(/^#[^\n]*\n?/gm, '').replace(/^\*[^*\n]*\*\s*\n?/gm, '');
  const paragraphs = cleaned
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 50);
  return paragraphs.slice(0, count).join('\n\n');
}
