import { useRef, useCallback } from 'react';
import type { Artwork } from '../../types';
import './ScrollGallery.css';

interface ScrollGalleryProps {
  artworks: Artwork[];
  onArtworkClick?: (artwork: Artwork) => void;
}

function ScrollGallery({ artworks, onArtworkClick }: ScrollGalleryProps): JSX.Element {
  const trackRef = useRef<HTMLUListElement>(null);

  // Click indicator to scroll to that card
  const handleIndicatorClick = useCallback((index: number) => {
    if (!trackRef.current) return;
    const item = trackRef.current.children[index] as HTMLElement;
    if (item) {
      item.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, []);

  // Generate CSS custom properties for timeline-scope
  const timelineNames = artworks.map((_, i) => `--card-${i}`).join(', ');

  return (
    <div
      className="scroll-gallery"
      style={{ '--timeline-scope': timelineNames } as React.CSSProperties}
    >
      {/* Scroll track with cards */}
      <ul
        ref={trackRef}
        className="scroll-gallery__track"
        style={{ '--card-count': artworks.length } as React.CSSProperties}
      >
        {artworks.map((artwork, index) => (
          <li
            key={artwork.id}
            className="scroll-gallery__card"
            style={{
              '--card-index': index,
              viewTimeline: `--card-${index} inline`,
            } as React.CSSProperties}
            onClick={() => onArtworkClick?.(artwork)}
          >
            <div
              className="scroll-gallery__artwork"
              style={{ backgroundColor: artwork.placeholderColor }}
            >
              <span className="scroll-gallery__title">{artwork.title}</span>
            </div>
          </li>
        ))}
      </ul>

      {/* Scroll-driven indicators */}
      <div className="scroll-gallery__indicators">
        {artworks.map((_, index) => (
          <button
            key={index}
            className="scroll-gallery__indicator"
            style={{
              animationTimeline: `--card-${index}`,
            } as React.CSSProperties}
            onClick={() => handleIndicatorClick(index)}
            aria-label={`Go to artwork ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ScrollGallery;
export { ScrollGallery };
