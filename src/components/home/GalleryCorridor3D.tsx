import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import artworksData from '../../data/artworks.json';
import type { Artwork } from '../../types';

const artworks = artworksData as Artwork[];

// Curated corridor — paintings that pass by the viewer in order.
// The LAST entry is the hero that camera flies into at the end of the flight;
// it should match the home page's hero (Mt. Tam from Sonoma).
const CORRIDOR_PAINTINGS = [
  'self-portrait',
  'jeanette',
  'old-ferry-slip',
  'beacon-street-boston',
  'autumn-leaves',
  'space-matter',
  'galaxy',
  'crystal-inclusion',
  'the-remarkable-herman-arthur-schwartz',
  'amazing-grace',
  'mill-valley-kitchen',
  'kitchen-bouquet',
  'bolinas-soccer-team-on-san-andreas-fault',
  'mesa-road-bolinas',
  'four-views-of-mt-tam',
  'side-street-naxos',
  'archway-at-the-top-of-town-naxos',
  'kyoto-canal-with-yellow-irises',
  'lavender-irises',
  'white-rose-with-botticelli',
  'pale-pink-rose-with-cosmos',
  'happy-birthday-dearest-herman',
  'three-red-pears',
  'one-pear-nine-times',
  'mt-tam-from-sonoma',  // the hero · matches the home page
];

// World units. The corridor is a long rectangular room. Camera flies down its length.
const CORRIDOR_LENGTH = 90;
const WALL_DISTANCE = 4.2;   // half-width of corridor
const FLOOR_Y = -2.2;
const CEILING_Y = 3.4;
const PAINTING_BASE_Y = 0.4;
const PAINTING_SPACING = 6.2;  // along z-axis
const FLIGHT_DURATION = 6.5;   // seconds

interface PaintingMeshProps {
  artwork: Artwork;
  position: [number, number, number];
  rotationY: number;
  width: number;
  height: number;
}

function PaintingMesh({ artwork, position, rotationY, width, height }: PaintingMeshProps): JSX.Element {
  // Load the painting as a texture
  const texture = useLoader(THREE.TextureLoader, artwork.imagePath || artwork.thumbPath || '');
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
  }, [texture]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Frame — slightly larger dark backing plate */}
      <mesh position={[0, 0, -0.02]} receiveShadow>
        <planeGeometry args={[width + 0.18, height + 0.18]} />
        <meshStandardMaterial color="#1a1612" roughness={0.85} />
      </mesh>
      {/* The painting itself */}
      <mesh castShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} roughness={0.75} metalness={0.02} />
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
      const yOffset = (i % 3 - 1) * 0.25; // gentle variation
      const baseSize = 2.2 + ((i * 7) % 8) * 0.1;  // ~2.2–3 units wide
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
    heroArtwork?.imagePath || heroArtwork?.thumbPath || '',
  );
  useMemo(() => {
    heroTexture.colorSpace = THREE.SRGBColorSpace;
    heroTexture.anisotropy = 16;
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

    // Speed curve: gentle ease-in, constant through middle, accelerate into hero at end
    const eased = t < 0.15
      ? (t / 0.15) * (t / 0.15) * 0.15        // slow ease-in for first 15%
      : t < 0.85
        ? 0.15 + ((t - 0.15) / 0.7) * 0.7     // linear through middle
        : 0.85 + Math.pow((t - 0.85) / 0.15, 0.7) * 0.15;  // gentle accel into hero

    // Z range: from 4 (outside entrance) to a position just in front of hero painting
    const heroZ = -CORRIDOR_LENGTH + 6;
    const startZ = 4;
    const cameraZ = startZ + (heroZ - startZ) * eased;
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
      {/* Fog: dissolves distant geometry into a warm dark color */}
      <fog attach="fog" args={['#16110C', 6, 70]} />
      <color attach="background" args={['#16110C']} />

      {/* Lights · warm ambient + a chain of warm point lights running down the ceiling
          so the corridor is always lit wherever the camera is along its length. */}
      <ambientLight intensity={1.2} color="#FFE6BF" />
      {Array.from({ length: 12 }).map((_, i) => (
        <pointLight
          key={i}
          position={[0, CEILING_Y - 0.2, -i * 8]}
          intensity={2.2}
          color="#FFD9A8"
          distance={18}
          decay={1.5}
        />
      ))}
      <spotLight
        position={[0, 1.5, -CORRIDOR_LENGTH + 8]}
        target-position={[0, 0.4, -CORRIDOR_LENGTH]}
        angle={0.5}
        penumbra={0.7}
        intensity={5}
        color="#FFF1D8"
        distance={18}
      />

      {/* Floor */}
      <mesh position={[0, FLOOR_Y, -CORRIDOR_LENGTH / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[WALL_DISTANCE * 2.2, CORRIDOR_LENGTH + 20]} />
        <meshStandardMaterial color="#1F1812" roughness={0.95} metalness={0} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, CEILING_Y, -CORRIDOR_LENGTH / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[WALL_DISTANCE * 2.2, CORRIDOR_LENGTH + 20]} />
        <meshStandardMaterial color="#1A130E" roughness={1} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-WALL_DISTANCE, 0.5, -CORRIDOR_LENGTH / 2]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[CORRIDOR_LENGTH + 20, CEILING_Y - FLOOR_Y]} />
        <meshStandardMaterial color="#2A2018" roughness={0.95} />
      </mesh>

      {/* Right wall */}
      <mesh position={[WALL_DISTANCE, 0.5, -CORRIDOR_LENGTH / 2]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[CORRIDOR_LENGTH + 20, CEILING_Y - FLOOR_Y]} />
        <meshStandardMaterial color="#2A2018" roughness={0.95} />
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
        <meshStandardMaterial color="#28201A" roughness={0.9} />
      </mesh>

      {/* Hero painting on back wall · the one camera flies into */}
      {heroArtwork && (
        <group position={[0, 0.5, -CORRIDOR_LENGTH + 0.05]}>
          {/* dark backing */}
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[6.2, 3.4]} />
            <meshStandardMaterial color="#16110C" roughness={0.9} />
          </mesh>
          {/* the hero painting */}
          <mesh>
            <planeGeometry args={[6.0, 3.2]} />
            <meshStandardMaterial map={heroTexture} roughness={0.7} emissive="#3a2e22" emissiveIntensity={0.2} />
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
