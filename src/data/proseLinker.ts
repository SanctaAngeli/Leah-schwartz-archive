// Turn mentions of artwork titles inside Leah's prose into markdown links
// that open the close-reading view for that painting.

import artworksData from './artworks.json';
import type { Artwork } from '../types';

interface TitleEntry {
  id: string;
  title: string;
  upper: string;
  regex: RegExp;
}

const artworks = artworksData as Artwork[];

// Escape a string for use in a regex
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Build a list of title entries sorted longest-first so the longer variant
// wins when two titles overlap (e.g. "MT. TAM FROM SONOMA" before "MT. TAM").
const TITLE_ENTRIES: TitleEntry[] = artworks
  .filter((a) => a.title && a.title.length >= 6)        // skip very short tokens to avoid false matches
  .map((a) => ({
    id: a.id,
    title: a.title,
    upper: a.title.toUpperCase(),
    // Match the UPPERCASE title in prose, allowing straight or curly quotes and
    // requiring non-word boundaries. We also tolerate ``"TITLE"`` wrapping.
    regex: new RegExp(
      `(^|[^A-Z0-9])"?(${escapeRegex(a.title.toUpperCase())})"?(?=[^A-Z0-9]|$)`,
      'g'
    ),
  }))
  .sort((a, b) => b.upper.length - a.upper.length);

/**
 * Scan markdown text and replace plain artwork-title mentions with markdown links.
 * Skips titles already inside a link (naively · we only protect content in existing `[](…)` pairs).
 */
export function linkArtworkMentions(markdown: string): string {
  // Find positions of existing markdown link text so we don't double-link
  const existingLinkSpans: Array<[number, number]> = [];
  const linkRe = /\[[^\]]+\]\([^)]+\)/g;
  let m;
  while ((m = linkRe.exec(markdown))) {
    existingLinkSpans.push([m.index, m.index + m[0].length]);
  }
  const isInsideLink = (idx: number): boolean =>
    existingLinkSpans.some(([s, e]) => idx >= s && idx < e);

  let out = markdown;
  // Since replacement alters indices, track a list of replacements then apply once
  interface Replacement { start: number; end: number; text: string; }
  const replacements: Replacement[] = [];
  const claimed = new Array<boolean>(markdown.length).fill(false);

  for (const entry of TITLE_ENTRIES) {
    entry.regex.lastIndex = 0;
    let match;
    while ((match = entry.regex.exec(markdown))) {
      const leader = match[1];
      const full = match[0];
      const titleStart = match.index + leader.length;
      const titleEnd = titleStart + match[2].length;
      // Extend past optional surrounding quote marks inside the match
      // The captured group[2] already excludes surrounding quotes because of how we structured the regex.
      if (isInsideLink(titleStart)) continue;
      // Skip if any character in this span has already been claimed
      let collision = false;
      for (let i = titleStart; i < titleEnd; i++) {
        if (claimed[i]) { collision = true; break; }
      }
      if (collision) continue;
      for (let i = titleStart; i < titleEnd; i++) claimed[i] = true;
      const replacementText = `[${match[2]}](/artwork/${entry.id})`;
      replacements.push({
        start: titleStart,
        end: titleEnd,
        text: replacementText,
      });
    }
  }
  // Apply replacements from the back so indices stay stable
  replacements.sort((a, b) => b.start - a.start);
  for (const r of replacements) {
    out = out.slice(0, r.start) + r.text + out.slice(r.end);
  }
  return out;
}
