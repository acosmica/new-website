"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BufferAttribute, BufferGeometry, Points } from "three";

type Props = {
  count?: number;
  spread?: number;
};

/**
 * Tiny flickering particles — glitchy atmosphere. Each particle has a
 * per-frame random opacity pulse via a custom shader uniform.
 */
export default function GlitchParticles({ count = 240, spread = 12 }: Props) {
  const pointsRef = useRef<Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.4;
      seeds[i] = Math.random();
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(positions, 3));
    g.setAttribute("seed", new BufferAttribute(seeds, 1));
    return g;
  }, [count, spread]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        transparent
        depthWrite={false}
        vertexShader={`
          attribute float seed;
          varying float vSeed;
          varying float vFlicker;
          uniform float uTime;
          void main() {
            vSeed = seed;
            // Per-point flicker — fast random-ish pulse, not synced
            // Sparse breathing — each particle rests at 0 most of the time
            // and briefly peaks on its own cycle. The pow() crushes the sine
            // toward 0 so only a handful of particles are large at once, and
            // the phase+frequency are both seed-driven so peaks don't coincide.
            float phase = seed * 42.7;
            float freq = 0.2 + seed * 0.7;
            float wave = max(sin(uTime * freq + phase), 0.0);
            vFlicker = pow(wave, 7.0);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = (1.2 + vFlicker * 2.5) * (300.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          varying float vSeed;
          varying float vFlicker;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            vec3 col = mix(vec3(0.96, 0.90, 0.82), vec3(0.68, 0.95, 0.88), vSeed);
            float a = (0.35 + vFlicker * 0.55) * smoothstep(0.5, 0.15, d);
            gl_FragColor = vec4(col, a);
          }
        `}
        uniforms={{ uTime: { value: 0 } }}
        onBeforeCompile={undefined}
        ref={(mat) => {
          if (!mat) return;
          // Keep uTime in sync with the clock
          const tick = () => {
            mat.uniforms.uTime.value = performance.now() * 0.001;
            requestAnimationFrame(tick);
          };
          if (!(mat as unknown as { _tickStarted?: boolean })._tickStarted) {
            (mat as unknown as { _tickStarted: boolean })._tickStarted = true;
            tick();
          }
        }}
      />
    </points>
  );
}
