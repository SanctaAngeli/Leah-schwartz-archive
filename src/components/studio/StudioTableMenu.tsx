import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// The Nano Banana 2 studio-table render becomes the menu for the section:
// her objects on the table are doorways. Save the generation at
// /public/studio/studio-table.jpg.
const TABLE_SRC = '/studio/studio-table.jpg';

interface Hotspot {
  to: string;
  label: string;
  sub: string;
  // Anchor as a percentage of the image (where the leader dot sits, roughly
  // the centre of the object). These are first-pass estimates from the
  // generated composition — easy to nudge once the final image is in place.
  x: number;
  y: number;
  // Which side the label card sits relative to the dot.
  side: 'left' | 'right';
}

const HOTSPOTS: Hotspot[] = [
  { to: '/canvas',      label: 'Paintings',   sub: 'every work, drifting',     x: 52, y: 15, side: 'right' },
  { to: '/themes',      label: 'Themes',      sub: 'twelve rooms',             x: 15, y: 26, side: 'left'  },
  { to: '/walk',        label: 'Walk With Her', sub: 'a guided drift',         x: 86, y: 28, side: 'left'  },
  { to: '/her-words',   label: 'Her Story',   sub: 'her own voice, in full',   x: 58, y: 53, side: 'right' },
  { to: '/studio-visit',label: 'Studio Visit',sub: 'Mill Valley, 1985',        x: 10, y: 66, side: 'left'  },
  { to: '/at-her-age',  label: 'Her Life',    sub: 'a slider through 84 years',x: 47, y: 86, side: 'left'  },
  { to: '/index',       label: 'The Index',   sub: 'people · places · subjects',x: 93, y: 82, side: 'left'  },
];

function StudioTableMenu(): JSX.Element {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <section
      className="relative w-full max-w-[1400px] mx-auto mb-24"
      aria-label="Studio — choose a way in"
    >
      <div className="relative w-full overflow-hidden rounded-md
        shadow-[0_30px_80px_-30px_rgba(60,48,30,0.45)]
        bg-[#2a2018]">
        {!failed && (
          <img
            src={TABLE_SRC}
            alt="Leah Schwartz's studio table — her palette, brushes, sketchbook, paintings and photographs"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`block w-full h-auto transition-opacity duration-700
              ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Graceful state before the generation is dropped in */}
        {(failed || !loaded) && (
          <div className="absolute inset-0 flex items-center justify-center
            aspect-[16/9] bg-gradient-to-b from-[#3a2e22] to-[#241b12]">
            <p className="font-body text-[12px] tracking-[0.3em] uppercase text-[#cbb89a] text-center px-6">
              {failed
                ? 'Drop studio-table.jpg into public/studio/'
                : 'Loading the studio…'}
            </p>
          </div>
        )}

        {/* A faint vignette so the labels always read against the photo */}
        {loaded && !failed && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.18) 100%)',
            }}
          />
        )}

        {/* Hotspots · always visible, refined, brighten on hover */}
        {loaded && !failed && HOTSPOTS.map((h) => (
          <Link
            key={h.to}
            to={h.to}
            className="group absolute -translate-y-1/2 focus:outline-none"
            style={{
              left: `${h.x}%`,
              top: `${h.y}%`,
              transform: `translate(${h.side === 'right' ? '0' : '-100%'}, -50%)`,
            }}
            aria-label={`${h.label} — ${h.sub}`}
          >
            <span
              className={`flex items-center gap-3 ${h.side === 'left' ? 'flex-row-reverse' : ''}`}
            >
              {/* leader dot */}
              <span
                aria-hidden="true"
                className="block w-[7px] h-[7px] rounded-full bg-[#FBF7EC]
                  ring-1 ring-black/20
                  shadow-[0_0_0_4px_rgba(251,247,236,0.18)]
                  transition-all duration-300
                  group-hover:shadow-[0_0_0_7px_rgba(251,247,236,0.28)]"
              />
              {/* label card */}
              <span
                className={`flex flex-col ${h.side === 'left' ? 'items-end text-right' : 'items-start text-left'}
                  bg-[#FBF7EC]/82 group-hover:bg-[#FBF7EC]
                  backdrop-blur-sm rounded-md px-3.5 py-2
                  shadow-[0_6px_20px_-8px_rgba(0,0,0,0.5)]
                  transition-all duration-300
                  opacity-85 group-hover:opacity-100
                  group-hover:-translate-y-0.5`}
              >
                <span className="font-heading text-[#2a2018] text-[15px] leading-none">
                  {h.label}
                </span>
                <span className="font-body text-[#6b5d45] text-[10px] tracking-[0.12em] mt-1 leading-none">
                  {h.sub}
                </span>
              </span>
            </span>
          </Link>
        ))}
      </div>

      {/* Accessible / small-screen fallback directory · plain links, always
          present for keyboard and narrow viewports where pixel hotspots fail */}
      <nav
        className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 sm:hidden"
        aria-label="Studio sections"
      >
        {HOTSPOTS.map((h) => (
          <Link
            key={h.to}
            to={h.to}
            className="font-body text-[11px] tracking-[0.2em] uppercase
              text-text-muted hover:text-text-primary transition-colors"
          >
            {h.label}
          </Link>
        ))}
      </nav>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-8 text-center font-body text-text-muted text-[11px] tracking-[0.3em] uppercase"
      >
        Her table · everything on it is a way in
      </motion.p>
    </section>
  );
}

export default StudioTableMenu;
