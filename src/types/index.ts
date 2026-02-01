export interface Artwork {
  id: string;
  title: string;
  year: number | null;
  circa: boolean;
  medium: string;
  dimensions: string;
  location: string;
  collection: string;
  themes: string[];
  imagePath: string;
  thumbPath: string;
  notebookPages?: string[];
  audioClip?: string;
  featured?: boolean;
  heroForLocation?: string;
  heroForTheme?: string;
  placeholderColor: string;
  aspectRatio: 'portrait' | 'landscape' | 'square';
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  heroArtworkId: string;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  heroArtworkId: string;
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
