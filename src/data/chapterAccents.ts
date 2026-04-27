// Subtle chromatic accents per book chapter, used as a visual signature on
// themed gallery pages. Drawn from a representative painting in each chapter
// so the page quietly echoes the work inside.

export interface ChapterAccent {
  accent: string;       // primary accent (for headings, rules, underlines)
  soft: string;         // very light tint for section backgrounds
  textOn: string;       // "on-accent" text color for good contrast
}

export const CHAPTER_ACCENTS: Record<string, ChapterAccent> = {
  'old-stuff':      { accent: '#8B7D6B', soft: '#F1EBDE', textOn: '#ffffff' },
  'abstract':       { accent: '#8B3A3A', soft: '#F6E5E2', textOn: '#ffffff' },
  'social-comment': { accent: '#6B5545', soft: '#EFE7DD', textOn: '#ffffff' },
  'on-the-road':    { accent: '#8B7355', soft: '#F3ECDF', textOn: '#ffffff' },
  'landscape':      { accent: '#6B8E5A', soft: '#E9F0E0', textOn: '#ffffff' },
  'street-scenes':  { accent: '#5B6B7A', soft: '#E4E9EE', textOn: '#ffffff' },
  'portraits':      { accent: '#A08070', soft: '#F1E8E0', textOn: '#ffffff' },
  'still-life':     { accent: '#C4A882', soft: '#F6EFE2', textOn: '#3a2a1a' },
  'interiors':      { accent: '#9A8A78', soft: '#F0EAE2', textOn: '#ffffff' },
  'flowers':        { accent: '#D89AB0', soft: '#FBEDF1', textOn: '#3a1a28' },
  'travel':         { accent: '#7A8B9A', soft: '#E8EDF1', textOn: '#ffffff' },
  'autobiography':  { accent: '#8B8378', soft: '#F0ECE6', textOn: '#ffffff' },
};

export const DEFAULT_ACCENT: ChapterAccent = {
  accent: '#8B7355',
  soft: '#F3ECDF',
  textOn: '#ffffff',
};

// Seasonal accent rotation · subtly shifts the site's default tint through the year.
// Leah painted with the seasons in mind; the site breathes with them too.
export function getSeasonalAccent(date = new Date()): ChapterAccent {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const mmdd = m * 100 + d;
  if (mmdd >= 320 && mmdd < 621)  return { accent: '#7A9E55', soft: '#ECF2E2', textOn: '#ffffff' }; // Spring
  if (mmdd >= 621 && mmdd < 923)  return { accent: '#C49650', soft: '#F7EEDD', textOn: '#3a2a1a' }; // Summer
  if (mmdd >= 923 && mmdd < 1221) return { accent: '#B04C30', soft: '#F3E3DC', textOn: '#ffffff' }; // Fall
  return { accent: '#5A7AAA', soft: '#E6ECF3', textOn: '#ffffff' };                                 // Winter
}

export function seasonName(date = new Date()): 'spring' | 'summer' | 'fall' | 'winter' {
  const m = date.getMonth() + 1, d = date.getDate(), mmdd = m * 100 + d;
  if (mmdd >= 320 && mmdd < 621)  return 'spring';
  if (mmdd >= 621 && mmdd < 923)  return 'summer';
  if (mmdd >= 923 && mmdd < 1221) return 'fall';
  return 'winter';
}

export function getAccent(chapter: string | null | undefined): ChapterAccent {
  if (!chapter) return DEFAULT_ACCENT;
  return CHAPTER_ACCENTS[chapter] || DEFAULT_ACCENT;
}
