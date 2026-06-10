import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// A single-color watercolor wash. One chapter accent (e.g. ABSTRACT's deep
// burgundy, FLOWERS' dusty pink) blooms in slow pools across a faintly
// tinted paper. Used on /themes - entering a chapter is meant to feel like
// stepping into a room with its own light, not just a different page.

interface AccentWashShaderProps {
  accent: string;  // hex, e.g. "#8B3A3A"
}

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
  uniform vec3  u_accent;
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

  float pool(vec2 uv, vec2 center, float radius, vec2 warp) {
    vec2 d = uv - center;
    float r = length(d) + warp.x * 0.10;
    return 1.0 - smoothstep(radius * 0.20, radius, r);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uvA = vec2((uv.x - 0.5) * aspect + 0.5, uv.y);

    float t  = u_time * 0.07;
    float tb = u_time * 0.50;

    // Coherent warp so the pools deform together (one wet sheet)
    vec2 warp = vec2(
      fbm(uvA * 1.4 + vec2(t,         0.0)),
      fbm(uvA * 1.4 + vec2(0.0, t * 1.1))
    );

    // Three slowly-drifting pools, all the same accent - the page reads as
    // *one* lit room rather than three different pigments.
    vec2 c1 = vec2(0.25 + sin(t * 0.6) * 0.14, 0.30 + cos(t * 0.5) * 0.12);
    vec2 c2 = vec2(0.75 + cos(t * 0.4) * 0.13, 0.70 + sin(t * 0.7) * 0.14);
    vec2 c3 = vec2(0.55 + sin(t * 0.3) * 0.12, 0.15 + cos(t * 0.6) * 0.10);
    c1.x = (c1.x - 0.5) * aspect + 0.5;
    c2.x = (c2.x - 0.5) * aspect + 0.5;
    c3.x = (c3.x - 0.5) * aspect + 0.5;

    float r1 = 0.50 + sin(tb * 0.9 + 0.0) * 0.10;
    float r2 = 0.54 + sin(tb * 0.7 + 2.1) * 0.11;
    float r3 = 0.42 + sin(tb * 1.1 + 4.2) * 0.09;

    float p1 = pool(uvA, c1, r1, warp);
    float p2 = pool(uvA, c2, r2, warp);
    float p3 = pool(uvA, c3, r3, warp);

    // Combine pools, then mix toward the accent. One color, accumulating
    // density where pools overlap (deeper wash = denser pigment).
    float density = clamp(p1 * 0.55 + p2 * 0.55 + p3 * 0.45, 0.0, 1.0);

    vec3 col = u_paper;
    col = mix(col, u_accent, density * 0.32);

    // Edge darkening · pigment pools at boundaries.
    float edge = length(vec2(dFdx(density), dFdy(density)));
    col -= edge * 16.0 * vec3(0.15, 0.13, 0.11);

    // Paper grain · subtle, doesn't compete with the wash.
    float grain = fbm(uv * 90.0 + vec2(0.0, t * 0.4));
    col += grain * 0.010;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// Given the accent hex, derive a near-white paper that carries a hint of
// the accent's hue - so the *paper itself* feels like it belongs to the room.
function lightenedPaper(hex: string): string {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  // 12% accent + 88% cream
  const cream = 247;  // F7
  const mix = (c: number): number => Math.round(c * 0.12 + cream * 0.88);
  const toHex = (v: number): string => v.toString(16).padStart(2, '0');
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
}

function ShaderQuad({ accent, reducedMotion }: { accent: string; reducedMotion: boolean }): JSX.Element {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const invalidate = useThree((s) => s.invalidate);
  const paperHex = useMemo(() => lightenedPaper(accent), [accent]);

  // Demand-driven ~25fps pacing — see WatercolorShader for the rationale.
  useEffect(() => {
    if (reducedMotion) {
      invalidate();
      return;
    }
    const id = window.setInterval(() => {
      if (!document.hidden) invalidate();
    }, 40);
    return () => window.clearInterval(id);
  }, [reducedMotion, invalidate]);
  const uniforms = useMemo(
    () => ({
      u_time:       { value: 0 },
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_paper:      { value: new THREE.Color(paperHex) },
      u_accent:     { value: new THREE.Color(accent) },
    }),
    // re-create uniforms when accent changes so the shader picks up the new colors
    [accent, paperHex],
  );

  // Update colors smoothly if accent changes without remounting
  useEffect(() => {
    if (matRef.current) {
      matRef.current.uniforms.u_paper.value.set(paperHex);
      matRef.current.uniforms.u_accent.value.set(accent);
      invalidate();
    }
  }, [accent, paperHex, invalidate]);

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

function AccentWashShader({ accent }: AccentWashShaderProps): JSX.Element {
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
        dpr={1}
        frameloop="demand"
        gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <ShaderQuad accent={accent} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

export default AccentWashShader;
