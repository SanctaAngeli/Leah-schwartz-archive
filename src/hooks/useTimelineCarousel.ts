import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { Artwork } from '../types';

interface DecadeData {
  decade: number;
  years: number[];
  artworks: Map<number, Artwork>;
}

interface UseTimelineCarouselOptions {
  artworks: Artwork[];
  initialYear?: number;
  onYearChange?: (year: number) => void;
  onTickSound?: () => void;
}

interface UseTimelineCarouselReturn {
  currentYear: number;
  currentDecade: number;
  decades: DecadeData[];
  decadeIndex: number;
  yearIndexInDecade: number;
  currentArtwork: Artwork | null;
  visibleYears: number[];
  setYear: (year: number) => void;
  setDecade: (decade: number) => void;
  nextYear: () => void;
  prevYear: () => void;
  nextDecade: () => void;
  prevDecade: () => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  handleWheel: (e: React.WheelEvent) => void;
  handleScroll: () => void;
  getArtworkForYear: (year: number) => Artwork | null;
  getPositionForYear: (year: number) => 'distant-left' | 'far-left' | 'left' | 'center' | 'right' | 'far-right' | 'distant-right';
}

export function useTimelineCarousel({
  artworks,
  initialYear,
  onYearChange,
  onTickSound,
}: UseTimelineCarouselOptions): UseTimelineCarouselReturn {
  // Group artworks by year
  const artworksByYear = useMemo(() => {
    const grouped = new Map<number, Artwork[]>();
    artworks.forEach((artwork) => {
      if (artwork.year !== null) {
        const existing = grouped.get(artwork.year) || [];
        existing.push(artwork);
        grouped.set(artwork.year, existing);
      }
    });
    return grouped;
  }, [artworks]);

  // Get all years with artworks, sorted
  const allYears = useMemo(() => {
    return Array.from(artworksByYear.keys()).sort((a, b) => a - b);
  }, [artworksByYear]);

  // Group years into decades
  const decades = useMemo((): DecadeData[] => {
    const decadeMap = new Map<number, DecadeData>();

    allYears.forEach((year) => {
      const decade = Math.floor(year / 10) * 10;
      if (!decadeMap.has(decade)) {
        decadeMap.set(decade, {
          decade,
          years: [],
          artworks: new Map(),
        });
      }
      const decadeData = decadeMap.get(decade)!;
      decadeData.years.push(year);
      // Get representative artwork for the year (prefer featured)
      const yearArtworks = artworksByYear.get(year) || [];
      const representative = yearArtworks.find((a) => a.featured) || yearArtworks[0];
      if (representative) {
        decadeData.artworks.set(year, representative);
      }
    });

    return Array.from(decadeMap.values()).sort((a, b) => a.decade - b.decade);
  }, [allYears, artworksByYear]);

  // Determine initial year
  const defaultYear = initialYear || allYears[Math.floor(allYears.length / 2)] || 1975;
  const [currentYear, setCurrentYear] = useState(defaultYear);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastTickYear = useRef(currentYear);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculate current decade info
  const currentDecade = Math.floor(currentYear / 10) * 10;
  const decadeIndex = decades.findIndex((d) => d.decade === currentDecade);
  const currentDecadeData = decades[decadeIndex] || decades[0];
  const yearIndexInDecade = currentDecadeData?.years.indexOf(currentYear) ?? 0;

  // Get visible years (current decade +/- adjacent years for smooth transitions)
  const visibleYears = useMemo(() => {
    if (!currentDecadeData) return [];

    const prevDecade = decades[decadeIndex - 1];
    const nextDecade = decades[decadeIndex + 1];

    const years: number[] = [];

    // Add last 2 years of previous decade if exists
    if (prevDecade) {
      years.push(...prevDecade.years.slice(-2));
    }

    // Add all years of current decade
    years.push(...currentDecadeData.years);

    // Add first 2 years of next decade if exists
    if (nextDecade) {
      years.push(...nextDecade.years.slice(0, 2));
    }

    return years;
  }, [currentDecadeData, decades, decadeIndex]);

  // Get artwork for a specific year
  const getArtworkForYear = useCallback((year: number): Artwork | null => {
    const yearArtworks = artworksByYear.get(year);
    if (!yearArtworks?.length) return null;
    return yearArtworks.find((a) => a.featured) || yearArtworks[0];
  }, [artworksByYear]);

  // Current artwork
  const currentArtwork = getArtworkForYear(currentYear);

  // Get position relative to current year for animation
  const getPositionForYear = useCallback((year: number): 'distant-left' | 'far-left' | 'left' | 'center' | 'right' | 'far-right' | 'distant-right' => {
    const diff = year - currentYear;
    if (diff === 0) return 'center';
    if (diff === -1) return 'left';
    if (diff === 1) return 'right';
    if (diff === -2) return 'far-left';
    if (diff === 2) return 'far-right';
    if (diff < -2) return 'distant-left';
    return 'distant-right';
  }, [currentYear]);

  // Set year with validation
  const setYear = useCallback((year: number) => {
    if (!allYears.includes(year)) {
      // Find nearest year
      const nearest = allYears.reduce((prev, curr) =>
        Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
      );
      year = nearest;
    }

    if (year !== currentYear) {
      // Play tick sound when year changes
      if (year !== lastTickYear.current && onTickSound) {
        onTickSound();
        lastTickYear.current = year;
      }

      setCurrentYear(year);
      onYearChange?.(year);
    }
  }, [allYears, currentYear, onYearChange, onTickSound]);

  // Set decade (jump to middle year of decade)
  const setDecade = useCallback((decade: number) => {
    const decadeData = decades.find((d) => d.decade === decade);
    if (decadeData?.years.length) {
      const middleIndex = Math.floor(decadeData.years.length / 2);
      setYear(decadeData.years[middleIndex]);
    }
  }, [decades, setYear]);

  // Navigation functions
  const nextYear = useCallback(() => {
    const currentIndex = allYears.indexOf(currentYear);
    if (currentIndex < allYears.length - 1) {
      setYear(allYears[currentIndex + 1]);
    }
  }, [allYears, currentYear, setYear]);

  const prevYear = useCallback(() => {
    const currentIndex = allYears.indexOf(currentYear);
    if (currentIndex > 0) {
      setYear(allYears[currentIndex - 1]);
    }
  }, [allYears, currentYear, setYear]);

  const nextDecade = useCallback(() => {
    if (decadeIndex < decades.length - 1) {
      setDecade(decades[decadeIndex + 1].decade);
    }
  }, [decadeIndex, decades, setDecade]);

  const prevDecade = useCallback(() => {
    if (decadeIndex > 0) {
      setDecade(decades[decadeIndex - 1].decade);
    }
  }, [decadeIndex, decades, setDecade]);

  // Handle wheel events for horizontal scrolling
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();

    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    const threshold = 50;

    if (!isScrolling.current) {
      if (delta > threshold) {
        nextYear();
        isScrolling.current = true;
      } else if (delta < -threshold) {
        prevYear();
        isScrolling.current = true;
      }
    }

    // Reset scroll lock after a short delay
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
    }, 150);
  }, [nextYear, prevYear]);

  // Handle scroll events from the container
  const handleScroll = useCallback(() => {
    // This is called when the user scrolls the container directly
    // We can use this to sync the current year based on scroll position
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextYear();
      } else if (e.key === 'ArrowLeft') {
        prevYear();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        prevDecade();
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        nextDecade();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextYear, prevYear, nextDecade, prevDecade]);

  return {
    currentYear,
    currentDecade,
    decades,
    decadeIndex,
    yearIndexInDecade,
    currentArtwork,
    visibleYears,
    setYear,
    setDecade,
    nextYear,
    prevYear,
    nextDecade,
    prevDecade,
    scrollContainerRef,
    handleWheel,
    handleScroll,
    getArtworkForYear,
    getPositionForYear,
  };
}
