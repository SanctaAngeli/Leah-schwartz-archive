import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import artworksData from '../../data/artworks.json';
import palettesData from '../../data/palettes.json';
import type { Artwork } from '../../types';
import type { WingDoor } from '../../data/wings';

const artworks = artworksData as Artwork[];
const palettes = palettesData as Record<string, { dominant: string; hsl: number[] }>;

/** The Atlas door: a slim spectrum of real dominant colors, sorted by hue. */
function SpectrumStrip(): JSX.Element {
  const colors = useMemo(() => {
    return Object.values(palettes)
      .filter((p) => p.hsl && p.hsl[1] > 12) // skip near-greys so the strip sings
      .sort((a, b) => a.hsl[0] - b.hsl[0])
      .filter((_, i) => i % 3 === 0)
      .map((p) => p.dominant);
  }, []);
  return (
    <div className="absolute inset-0 flex" aria-hidden="true">
      {colors.map((c, i) => (
        <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
      ))}
    </div>
  );
}

function DoorVisual({ door }: { door: WingDoor }): JSX.Element {
  if (door.visual.kind === 'spectrum') return <SpectrumStrip />;
  const src =
    door.visual.kind === 'photo'
      ? door.visual.src
      : (() => {
          const a = artworks.find((x) => x.id === (door.visual as { id: string }).id);
          return a?.thumbPath || a?.imagePath || '';
        })();
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      className="absolute inset-0 w-full h-full object-cover scale-[1.08]
        transition-transform duration-700 group-hover:scale-[1.12]"
    />
  );
}

interface Props {
  door: WingDoor;
  index: number;
}

function WingDoorCard({ door, index }: Props): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
      className={door.hero ? 'md:col-span-2' : ''}
    >
      <Link
        to={door.to}
        className="group block focus:outline-none focus-visible:ring-2
          focus-visible:ring-[#8B7355]/50 rounded-2xl"
      >
        <div
          className={`relative overflow-hidden rounded-2xl shadow-soft
            group-hover:shadow-glass transition-shadow duration-500
            ${door.hero ? 'aspect-[2/1]' : 'aspect-[4/3]'}`}
        >
          <DoorVisual door={door} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
            <h2 className="font-heading text-2xl md:text-3xl text-white drop-shadow-md">
              {door.title}
            </h2>
            <p className="font-leah text-white/90 mt-1 text-2xl leading-none drop-shadow">
              {door.tagline}
            </p>
          </div>
        </div>
        <p className="font-body text-text-muted text-sm mt-3 px-1 leading-relaxed">
          {door.blurb}
        </p>
      </Link>
    </motion.div>
  );
}

export default WingDoorCard;
