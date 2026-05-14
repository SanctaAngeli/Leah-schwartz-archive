import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import artworksData from '../../data/artworks.json';
import type { Artwork } from '../../types';

const artworks = artworksData as Artwork[];

// First all the artworks we want to include in the corridor, in flight order.
// The LAST entry is the hero camera flies into · should match the home page hero.
const PREFERRED_CORRIDOR_PAINTINGS = [
  'self-portrait', 'jeanette', 'old-ferry-slip', 'beacon-street-boston', 'autumn-leaves',
  'space-matter', 'galaxy', 'crystal-inclusion', 'migraine', 'assassination',
  'the-remarkable-herman-arthur-schwartz', 'amazing-grace', 'helen-fellenbaum-herman-s-sister',
  'mill-valley-kitchen', 'kitchen-bouquet', 'mill-valley-bathroom',
  'bolinas-soccer-team-on-san-andreas-fault', 'mesa-road-bolinas', 'bolinas-kitchen',
  'four-views-of-mt-tam', 'mt-tam-golden-gate-bridge-sausalito-from-san-francisco',
  'side-street-naxos', 'archway-at-the-top-of-town-naxos', 'smoke-trees-naxos',
  'kyoto-canal-with-yellow-irises', 'tokyo-side-street',
  'lavender-irises', 'white-iris-with-san-francisco-skyline', 'pale-blue-iris',
  'white-rose-with-botticelli', 'pale-pink-rose-with-cosmos', 'dark-pink-rose-with-renaissance-prince',
  'happy-birthday-dearest-herman', 'fragrant-lillies', 'spring-thicket',
  'three-red-pears', 'one-pear-nine-times', 'two-persimmons-on-a-stem', 'three-basking-boscs',
  'four-pots-one-persimmon', 'four-bartletts', 'leaning-bosc-with-fat-and-lean-pears',
  'a-curve-of-black-angus', 'black-angus-on-a-hill', 'cattle-on-a-distant-hill-sun-and-shadow',
  'wool-hap-town', 'hilaritas-house', 'liberty-ship',
  'view-from-new-york-apartment', 'nob-hill-market-billboard', 'courtland-market',
  'valley-ford-market', 'dijon-market', 'three-red-pears', 'three-boscs-with-a-comice',
  'three-red-and-yellow-pears', 'red-persimmon-and-yellow', 'persimmon-on-wood',
  'onion-on-a-table', 'golden-onion-2', 'golden-onion-1',
  'mt-tam-from-sonoma',  // the hero · matches the home page hero
];

// Filter the list to entries that exist in the catalog (in case of typos).
function buildCorridorPaintings(): string[] {
  const valid = new Set(artworks.map((a) => a.id));
  return PREFERRED_CORRIDOR_PAINTINGS.filter((id) => valid.has(id));
}
const CORRIDOR_PAINTINGS = buildCorridorPaintings();

// World units. A long, bright museum hallway. Camera dollies down its length.
// Length kept manageable for smooth framerate · the density does the heavy lifting.
const CORRIDOR_LENGTH = 135;        // halved for perf · still feels long because of density
const WALL_DISTANCE = 4.6;
const FLOOR_Y = -2.4;
const CEILING_Y = 3.6;
const PAINTING_BASE_Y = 0.4;
const PAINTING_SPACING = 4.0;       // tighter still · packs paintings in
const FLIGHT_DURATION = 5.5;        // slightly faster · still flies fast over half-length

interface PaintingMeshProps {
  artwork: Artwork;
  position: [number, number, number];
  rotationY: number;
  width: number;
  height: number;
}

function PaintingMesh({ artwork, position, rotationY, width, height }: PaintingMeshProps): JSX.Element {
  // Thumbs are ~600px long edge · way cheaper to upload as GPU textures than 300dpi scans.
  const texture = useLoader(THREE.TextureLoader, artwork.thumbPath || artwork.imagePath || '');
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
  }, [texture]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Thin warm frame */}
      <mesh position={[0, 0, -0.02]} receiveShadow>
        <planeGeometry args={[width + 0.16, height + 0.16]} />
        <meshStandardMaterial color="#3A2E22" roughness={0.85} />
      </mesh>
      {/* The painting itself */}
      <mesh castShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} roughness={0.55} metalness={0.02} />
      </mesh>
    </group>
  );
}

interface CorridorContentProps {
  startFlight: boolean;
  onComplete: () => void;
  onHeroFillProgress?: (progress: number) => void;
}

function CorridorContent({ startFlight, onComplete, onHeroFillProgress }: CorridorContentProps): JSX.Element {
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  // Pick paintings and place them on alternating walls
  const placements = useMemo(() => {
    const out: Array<{
      artwork: Artwork;
      side: 'left' | 'right';
      z: number;
      yOffset: number;
      width: number;
      height: number;
    }> = [];

    const byId = new Map(artworks.map((a) => [a.id, a]));
    const wallPaintings = CORRIDOR_PAINTINGS.slice(0, -1); // last is hero

    wallPaintings.forEach((id, i) => {
      const art = byId.get(id);
      if (!art) return;
      const side: 'left' | 'right' = i % 2 === 0 ? 'left' : 'right';
      const z = -3 - i * PAINTING_SPACING;
      // Hang at a consistent gallery height — small variation only
      const yOffset = (i % 5 - 2) * 0.12;
      // Much bigger paintings — gallery-sized
      const baseSize = 3.4 + ((i * 11) % 7) * 0.18;  // ~3.4–4.5 units wide
      const aspect = art.aspectRatio === 'portrait' ? 1.3 : art.aspectRatio === 'landscape' ? 0.7 : 1;
      out.push({
        artwork: art,
        side,
        z,
        yOffset,
        width: baseSize,
        height: baseSize * aspect,
      });
    });

    return out;
  }, []);

  // The hero painting at the end · larger, centered on back wall
  const heroArtwork = useMemo(() => {
    const id = CORRIDOR_PAINTINGS[CORRIDOR_PAINTINGS.length - 1];
    return artworks.find((a) => a.id === id);
  }, []);
  const heroTexture = useLoader(
    THREE.TextureLoader,
    heroArtwork?.thumbPath || heroArtwork?.imagePath || '',
  );
  useMemo(() => {
    heroTexture.colorSpace = THREE.SRGBColorSpace;
    heroTexture.anisotropy = 8;
  }, [heroTexture]);

  // Camera flies from z=2 (just outside corridor) to z=-CORRIDOR_LENGTH+8 (right at hero)
  useFrame((state) => {
    if (!cameraRef.current) cameraRef.current = state.camera as THREE.PerspectiveCamera;
    if (!startFlight) {
      // Sit still at entrance, looking down corridor
      state.camera.position.set(0, 0.4, 4);
      state.camera.lookAt(0, 0.4, -1);
      return;
    }
    if (startTimeRef.current === null) startTimeRef.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTimeRef.current;
    const t = Math.min(1, elapsed / FLIGHT_DURATION);

    // Pure constant speed — linear interpolation start to finish
    const heroZ = -CORRIDOR_LENGTH + 6;
    const startZ = 4;
    const cameraZ = startZ + (heroZ - startZ) * t;
    state.camera.position.set(0, 0.4, cameraZ);
    state.camera.lookAt(0, 0.4, cameraZ - 1);

    // Notify the parent how full the hero painting is on screen
    // When camera is close to hero, painting fills more of viewport
    if (onHeroFillProgress) {
      const distanceToHero = Math.abs(cameraZ - heroZ);
      // Fill begins ramping up when we're within last 20% of corridor
      const fill = Math.max(0, Math.min(1, 1 - distanceToHero / 12));
      onHeroFillProgress(fill);
    }

    if (t >= 1 && !completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  });

  return (
    <>
      {/* Soft cream fog · gallery-bright, dissolves distance into haze */}
      <fog attach="fog" args={['#EDE6D7', 14, 120]} />
      <color attach="background" args={['#EDE6D7']} />

      {/* Lighting is mostly hemisphere + ambient so we don't pay per-pixel costs
          for many point lights. Hemisphere gives nice gallery-bright look cheaply. */}
      <ambientLight intensity={1.9} color="#FFF6E8" />
      <hemisphereLight args={['#FFF6E8', '#C8BEA7', 1.0]} />
      {/* Just two warm "highlight" lights along the corridor for character */}
      <pointLight position={[0, CEILING_Y - 0.3, -CORRIDOR_LENGTH * 0.25]} intensity={1.2} color="#FFE8C5" distance={32} decay={1.2} />
      <pointLight position={[0, CEILING_Y - 0.3, -CORRIDOR_LENGTH * 0.65]} intensity={1.2} color="#FFE8C5" distance={32} decay={1.2} />
      <pointLight position={[0, CEILING_Y - 0.3, -CORRIDOR_LENGTH]} intensity={1.4} color="#FFF7E4" distance={26} decay={1.2} />

      {/* Floor · warm soft beige */}
      <mesh position={[0, FLOOR_Y, -CORRIDOR_LENGTH / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[WALL_DISTANCE * 2.2, CORRIDOR_LENGTH + 20]} />
        <meshStandardMaterial color="#C9BDA6" roughness={0.95} metalness={0} />
      </mesh>

      {/* Ceiling · soft cream */}
      <mesh position={[0, CEILING_Y, -CORRIDOR_LENGTH / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[WALL_DISTANCE * 2.2, CORRIDOR_LENGTH + 20]} />
        <meshStandardMaterial color="#F4EDDD" roughness={1} />
      </mesh>

      {/* Left wall · off-white plaster */}
      <mesh position={[-WALL_DISTANCE, 0.5, -CORRIDOR_LENGTH / 2]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[CORRIDOR_LENGTH + 20, CEILING_Y - FLOOR_Y]} />
        <meshStandardMaterial color="#EBE2D0" roughness={0.95} />
      </mesh>

      {/* Right wall · off-white plaster */}
      <mesh position={[WALL_DISTANCE, 0.5, -CORRIDOR_LENGTH / 2]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[CORRIDOR_LENGTH + 20, CEILING_Y - FLOOR_Y]} />
        <meshStandardMaterial color="#EBE2D0" roughness={0.95} />
      </mesh>

      {/* Paintings on walls */}
      {placements.map((p) => {
        const x = p.side === 'left' ? -WALL_DISTANCE + 0.01 : WALL_DISTANCE - 0.01;
        const rotY = p.side === 'left' ? Math.PI / 2 : -Math.PI / 2;
        return (
          <PaintingMesh
            key={p.artwork.id}
            artwork={p.artwork}
            position={[x, PAINTING_BASE_Y + p.yOffset, p.z]}
            rotationY={rotY}
            width={p.width}
            height={p.height}
          />
        );
      })}

      {/* Back wall · the destination */}
      <mesh position={[0, 0.5, -CORRIDOR_LENGTH]}>
        <planeGeometry args={[WALL_DISTANCE * 2.2, CEILING_Y - FLOOR_Y]} />
        <meshStandardMaterial color="#EBE2D0" roughness={0.9} />
      </mesh>

      {/* Hero painting on back wall · the one camera flies into */}
      {heroArtwork && (
        <group position={[0, 0.5, -CORRIDOR_LENGTH + 0.05]}>
          {/* warm frame */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[6.4, 3.6]} />
            <meshStandardMaterial color="#3A2E22" roughness={0.9} />
          </mesh>
          {/* the hero painting */}
          <mesh>
            <planeGeometry args={[6.2, 3.4]} />
            <meshStandardMaterial map={heroTexture} roughness={0.55} />
          </mesh>
        </group>
      )}
    </>
  );
}

interface GalleryCorridor3DProps {
  startFlight: boolean;
  onComplete: () => void;
  onHeroFillProgress?: (progress: number) => void;
}

function GalleryCorridor3D({ startFlight, onComplete, onHeroFillProgress }: GalleryCorridor3DProps): JSX.Element {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 4], fov: 62, near: 0.1, far: 120 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <CorridorContent
        startFlight={startFlight}
        onComplete={onComplete}
        onHeroFillProgress={onHeroFillProgress}
      />
    </Canvas>
  );
}

export default GalleryCorridor3D;

interface PreloaderProps {
  onReady: () => void;
}

export function CorridorPreloader({ onReady }: PreloaderProps): JSX.Element | null {
  // Trigger preload by mounting a hidden image for each painting
  const [done, setDone] = useState(false);
  useEffect(() => {
    let loaded = 0;
    const total = CORRIDOR_PAINTINGS.length;
    const byId = new Map(artworks.map((a) => [a.id, a]));
    CORRIDOR_PAINTINGS.forEach((id) => {
      const art = byId.get(id);
      const src = art?.imagePath || art?.thumbPath;
      if (!src) {
        loaded++;
        if (loaded === total) {
          setDone(true);
          onReady();
        }
        return;
      }
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === total) {
          setDone(true);
          onReady();
        }
      };
      img.src = src;
    });
  }, [onReady]);
  if (done) return null;
  return null;
}
