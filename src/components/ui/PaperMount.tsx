import type { ReactNode } from 'react';

// PaperMount · the site's signature treatment, generalized.
// Any image set onto a real torn-watercolor-paper ground, with an
// alpha-aware soft shadow that follows the deckle edge. The wrapper div
// gives a reliable symmetric box (absolute-inset sizing is unreliable on
// replaced <img> elements), the paper fills it, the content sits on top.

type PaperVariant = 'wide' | 'mid' | 'mid2' | 'square' | 'tall';
type ShadowVariant = 'soft' | 'lift' | 'none';

const PAPER_SRC: Record<PaperVariant, string> = {
  wide:   '/textures/ripped-paper/paper-wide.png',
  mid:    '/textures/ripped-paper/paper-mid.png',
  mid2:   '/textures/ripped-paper/paper-mid-2.png',
  square: '/textures/ripped-paper/paper-square.png',
  tall:   '/textures/ripped-paper/paper-tall.png',
};

const SHADOW: Record<ShadowVariant, string> = {
  soft: 'drop-shadow(0 26px 55px rgba(74,62,40,0.26))',
  lift: 'drop-shadow(0 16px 34px rgba(74,62,40,0.32))',
  none: 'none',
};

interface PaperMountProps {
  src: string;
  alt: string;
  /** Which ripped-paper texture sits behind. Pick by image orientation. */
  paper?: PaperVariant;
  /** How far the paper extends past the image, in px. */
  inset?: { x: number; y: number };
  shadow?: ShadowVariant;
  /** Sizing/positioning for the OUTER element (e.g. "w-[480px]"). */
  className?: string;
  /** Applied to the content image (e.g. hover transforms). */
  imgClassName?: string;
  /** Optional overlay inside the mount (credit line, play hint, etc). */
  children?: ReactNode;
}

function PaperMount({
  src,
  alt,
  paper = 'wide',
  inset = { x: 48, y: 32 },
  shadow = 'soft',
  className = '',
  imgClassName = '',
  children,
}: PaperMountProps): JSX.Element {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Deckled paper ground · symmetric box via wrapper div */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{ top: -inset.y, bottom: -inset.y, left: -inset.x, right: -inset.x }}
      >
        <img
          src={PAPER_SRC[paper]}
          alt=""
          className="w-full h-full object-fill select-none"
          style={{ filter: SHADOW[shadow] }}
        />
      </div>
      <img src={src} alt={alt} className={`relative block ${imgClassName}`} />
      {children}
    </div>
  );
}

export default PaperMount;
