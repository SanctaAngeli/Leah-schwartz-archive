export interface Artwork {
  // Core identity
  id: string;
  title: string;
  display_title?: string;

  // Source provenance (book + PDF)
  book_page?: number;
  pdf_page?: number;

  // Categorization
  chapter?: string | null;      // one of the 12 book-chapter slugs
  region?: string | null;       // travel sub-region slug (travel chapter only)

  // Dates & materials
  year: number | null;
  year_raw?: string | null;     // "1975", "1975-77", "c.1950"
  circa: boolean;
  medium: string | null;
  width_in?: number | null;
  height_in?: number | null;
  approx_dims?: boolean;
  is_set?: boolean;
  collection: string | null;

  // Relationships (populated in later phases)
  place_ids?: string[];
  people_ids?: string[];
  prose_refs?: string[];
  neighbors?: {
    same_chapter?: string[];
    same_year?: string[];
    same_place?: string[];
  };

  // Images (may be null while catalog entries await cropping)
  image_full?: string | null;
  image_thumb?: string | null;
  needs_crop?: boolean;        // true when imagePath points to the full book page instead of an isolated crop

  // v1 compatibility · existing components reference these names
  location: string;             // mirrors `chapter` (or "" when undefined)
  themes: string[];             // [chapter]
  dimensions: string;           // display-formatted "14 × 20 in"
  imagePath: string | null;
  thumbPath: string | null;
  placeholderColor: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
  featured?: boolean;
  heroForLocation?: string;
  heroForTheme?: string;
  notebookPages?: string[];
  audioClip?: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  heroArtworkId: string | null;
  artworkCount?: number;
  kind?: 'home' | 'travel-region';
}

export interface Theme {
  id: string;
  name: string;
  tagline?: string;
  description?: string;
  heroArtworkId: string | null;
  artworkCount?: number;
}

export interface AudioSegment {
  artworkId: string;
  audioPath: string;
  duration: number;
}

export interface TourChapter {
  id: string;
  title: string;
  description: string;
  artworkIds: string[];
  audioSegments: AudioSegment[];
}
