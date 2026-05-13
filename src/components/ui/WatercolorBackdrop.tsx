import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getAccent } from '../../data/chapterAccents';

// A few soft watercolor washes that float just behind everything on every page.
// Barely there. The point is to make the chrome itself feel painter-made — the
// page never looks like a flat white screen, but never competes with the art.

interface Blob {
  cx: string;
  cy: string;
  r: string;
  color: string;
  driftX: [number, number];
  driftY: [number, number];
  duration: number;
}

function pickChapterFromPath(pathname: string): string | undefined {
  // /themes/:id and /her-words/:id both reflect a chapter
  const m = pathname.match(/^\/(themes|her-words|tour)\/([^/]+)/);
  if (m) return m[2];
  return undefined;
}

function hexToRgba(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function WatercolorBackdrop(): JSX.Element {
  const location = useLocation();
  const chapter = pickChapterFromPath(location.pathname);
  const accent = chapter ? getAccent(chapter).accent : null;

  // Three soft washes. If we know the chapter, one of them takes on its accent.
  const blobs = useMemo<Blob[]>(() => [
    {
      cx: '12%',
      cy: '18%',
      r: '38%',
      color: hexToRgba('#E8D8C0', 0.55),  // warm sand
      driftX: [-30, 20],
      driftY: [-10, 25],
      duration: 26,
    },
    {
      cx: '88%',
      cy: '72%',
      r: '42%',
      color: accent ? hexToRgba(accent, 0.18) : hexToRgba('#C8D5C0', 0.45),  // pale moss
      driftX: [20, -30],
      driftY: [10, -25],
      duration: 32,
    },
    {
      cx: '60%',
      cy: '8%',
      r: '32%',
      color: hexToRgba('#E0D2DE', 0.35),  // dusty lavender
      driftX: [-15, 20],
      driftY: [0, 15],
      duration: 38,
    },
  ], [accent]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          className="watercolor-blob"
          style={{
            position: 'absolute',
            left: b.cx,
            top: b.cy,
            width: b.r,
            height: b.r,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${b.color} 0%, transparent 65%)`,
            filter: 'blur(40px)',
            // @ts-expect-error custom CSS props
            '--drift-x-from': `${b.driftX[0]}px`,
            '--drift-x-to': `${b.driftX[1]}px`,
            '--drift-y-from': `${b.driftY[0]}px`,
            '--drift-y-to': `${b.driftY[1]}px`,
            animation: `watercolor-drift ${b.duration}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

export default WatercolorBackdrop;
