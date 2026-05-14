import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// A fullscreen GLSL backdrop. Three pigment blobs drift and breathe across
// cream paper · edges darken where pigment thins out · faint paper grain
// sits on top. Used sitewide as the default texture; individual chapter
// rooms (/themes/:id) swap it for AccentWashShader with their accent.

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec3  u_color1;
  uniform vec3  u_color2;
  uniform vec3  u_color3;
  uniform vec3  u_paper;
  varying vec2 vUv;

  vec3 mod289_3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289_2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x)  { return mod289_3(((x * 34.0) + 1.0) * x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289_2(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  float pigment(vec2 uv, vec2 center, float radius, vec2 warp) {
    vec2 d = uv - center;
    float r = length(d) + warp.x * 0.12;
    return 1.0 - smoothstep(radius * 0.25, radius, r);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uvA = vec2((uv.x - 0.5) * aspect + 0.5, uv.y);

    // Drift clock + breathing clock (separate so radius pulse is visible
    // without the centers racing across the screen).
    float t  = u_time * 0.08;
    float tb = u_time * 0.55;

    // Coherent warp field — same field deforms every blob, so the sheet
    // reads as one wet surface instead of three separate circles.
    vec2 warp = vec2(
      fbm(uvA * 1.4 + vec2(t,         0.0)),
      fbm(uvA * 1.4 + vec2(0.0, t * 1.1))
    );

    // Three drifting pigment centers spread across the visible area
    vec2 c1 = vec2(0.30 + sin(t * 0.6) * 0.14, 0.30 + cos(t * 0.5) * 0.12);
    vec2 c2 = vec2(0.70 + cos(t * 0.4) * 0.13, 0.70 + sin(t * 0.7) * 0.14);
    vec2 c3 = vec2(0.55 + sin(t * 0.3) * 0.12, 0.15 + cos(t * 0.6) * 0.10);
    c1.x = (c1.x - 0.5) * aspect + 0.5;
    c2.x = (c2.x - 0.5) * aspect + 0.5;
    c3.x = (c3.x - 0.5) * aspect + 0.5;

    // Breathing radii (≈10–14s cycles, three different phases) so the wash
    // blooms and pulls back the way watercolor does when re-wetted.
    float r1 = 0.50 + sin(tb * 0.9 + 0.0) * 0.10;
    float r2 = 0.54 + sin(tb * 0.7 + 2.1) * 0.11;
    float r3 = 0.42 + sin(tb * 1.1 + 4.2) * 0.09;

    float p1 = pigment(uvA, c1, r1, warp);
    float p2 = pigment(uvA, c2, r2, warp);
    float p3 = pigment(uvA, c3, r3, warp);

    // Restrained mix · no pigment reads as a stain. Sand kept lowest because
    // warm tones in the center of the page can feel like a dark blob.
    vec3 col = u_paper;
    col = mix(col, u_color1, p1 * 0.20);
    col = mix(col, u_color2, p2 * 0.20);
    col = mix(col, u_color3, p3 * 0.16);

    // Edge darkening · gradient of combined pigment field via screen-space derivatives.
    // Softer (lower multiplier) and less warm so it doesn't muddy the paper.
    float total = p1 + p2 + p3;
    float edge = length(vec2(dFdx(total), dFdy(total)));
    col -= edge * 14.0 * vec3(0.12, 0.11, 0.09);

    // Paper grain · subtle high-freq noise to break up flat areas.
    float grain = fbm(uv * 90.0 + vec2(0.0, t * 0.5));
    col += grain * 0.010;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const PAPER_COLOR   = '#FCF8EF';  // brighter cream
const PIGMENT_MOSS  = '#C3CCB7';  // lighter sage
const PIGMENT_SLATE = '#BFC8D0';  // lighter overcast
const PIGMENT_SAND  = '#E2CFB7';  // pale warm sand · no longer reads as orange

function ShaderQuad({ reducedMotion }: { reducedMotion: boolean }): JSX.Element {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      u_time:       { value: 0 },
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_paper:      { value: new THREE.Color(PAPER_COLOR) },
      u_color1:     { value: new THREE.Color(PIGMENT_MOSS) },
      u_color2:     { value: new THREE.Color(PIGMENT_SLATE) },
      u_color3:     { value: new THREE.Color(PIGMENT_SAND) },
    }),
    [],
  );

  useFrame((state) => {
    if (!matRef.current) return;
    if (!reducedMotion) {
      matRef.current.uniforms.u_time.value = state.clock.elapsedTime;
    }
    const { width, height } = state.size;
    matRef.current.uniforms.u_resolution.value.set(width, height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function WatercolorShader(): JSX.Element {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent): void => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1, near: 0.1, far: 10 }}
        dpr={[1, 2]}
        frameloop="always"
        gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <ShaderQuad reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

export default WatercolorShader;
