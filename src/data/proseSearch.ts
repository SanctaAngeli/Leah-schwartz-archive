// Search Leah's prose for mentions of a named entity (person, place, subject),
// returning the paragraphs that contain the match with a link back to the source
// section in /her-words.

import { PROSE_SECTIONS, cleanProse } from './prose';

export interface ProseMention {
  sectionId: string;
  sectionLabel: string;
  paragraph: string;
}

function splitParagraphs(md: string): string[] {
  const cleaned = cleanProse(md)
    .replace(/^#[^\n]*\n?/gm, '')   // strip markdown headings
    .replace(/\*[^*\n]*\*/g, '');   // strip italic lines (taglines)
  return cleaned
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 30);
}

function nameVariants(name: string): string[] {
  const variants = new Set<string>();
  variants.add(name);
  // "Surname, Firstname" → "Firstname Surname"
  if (name.includes(',')) {
    const [last, first] = name.split(',', 2).map((s) => s.trim());
    if (first) variants.add(`${first} ${last}`);
    variants.add(last);        // just the surname
  }
  // Drop '& Person' style: "Adler, Judy & Elisa" → "Judy Adler", "Elisa Adler"
  if (name.includes('&') && name.includes(',')) {
    const [last, firsts] = name.split(',', 2).map((s) => s.trim());
    firsts.split('&').forEach((f) => {
      const trimmed = f.trim();
      if (trimmed) variants.add(`${trimmed} ${last}`);
    });
  }
  // First token alone (for the surname-as-reference case)
  const firstToken = name.split(/[,\s&]/).filter(Boolean)[0];
  if (firstToken && firstToken.length >= 4) variants.add(firstToken);
  return Array.from(variants).filter((v) => v.length >= 3);
}

/** Find prose mentions of a named entity. Returns a handful of best matches. */
export function findProseMentions(name: string, limit = 10): ProseMention[] {
  const variants = nameVariants(name);
  if (!variants.length) return [];
  const results: ProseMention[] = [];
  const seen = new Set<string>();
  for (const section of PROSE_SECTIONS) {
    const paragraphs = splitParagraphs(section.markdown);
    for (const p of paragraphs) {
      for (const v of variants) {
        // Case-insensitive whole-word-ish match
        const re = new RegExp(`(^|\\b)${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (re.test(p)) {
          const key = section.id + '::' + p.slice(0, 50);
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              sectionId: section.id,
              sectionLabel: section.label,
              paragraph: p,
            });
          }
          break;
        }
      }
      if (results.length >= limit) return results;
    }
    if (results.length >= limit) return results;
  }
  return results;
}
