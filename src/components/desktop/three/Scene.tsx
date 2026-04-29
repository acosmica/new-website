"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, MathUtils } from "three";
import LED from "./LED";
import GlitchParticles from "./GlitchParticles";

// Vibrant-indicator palette — saturated colours that glow properly under
// the bloom pass. More neon candy jar than dusty equipment rack.
const LED_COLORS = [
  "#ff4040", // hot red
  "#ff9a2a", // warm amber
  "#5cd88a", // fresh green
  "#ffe9a0", // warm white (still reads as bright under bloom)
  "#5fb0ff", // sky blue
  "#ff6bd5", // magenta
  "#44e0d6", // cyan
];

// Galaxy-cluster placement: objects spread across the xy frame plus a much
// wider z range so that as the camera orbits, elements genuinely pass in
// front of and behind each other — not just rotate on a flat disc.
// Target box: x ∈ ±5.2, y ∈ ±3, z ∈ [-6, +3].
const LEDS: Array<{ pos: [number, number, number]; color: string; scale: number }> = [
  { pos: [-4.4, 2.1, -2.6], color: LED_COLORS[0], scale: 1.15 },
  { pos: [-3.6, -1.8,  1.8], color: LED_COLORS[5], scale: 0.95 }, // magenta
  { pos: [ 4.1, 2.4, -3.6], color: LED_COLORS[1], scale: 1.2  },
  { pos: [ 4.6, -1.8,  0.4], color: LED_COLORS[6], scale: 0.9  }, // cyan
  { pos: [-4.0, 2.6, -5.2], color: LED_COLORS[4], scale: 1.0  },
  { pos: [ 0.4, -2.5, -1.4], color: LED_COLORS[0], scale: 1.0  },
  { pos: [ 3.2, 2.6,  2.4], color: LED_COLORS[2], scale: 0.85 },
  { pos: [-5.0, -2.2, -4.0], color: LED_COLORS[1], scale: 1.05 },
  { pos: [ 4.8, -2.6,  1.6], color: LED_COLORS[5], scale: 0.9  }, // magenta
  { pos: [-2.2, 2.6,  2.8], color: LED_COLORS[3], scale: 0.8  },
  { pos: [ 2.4, -2.6, -4.4], color: LED_COLORS[6], scale: 0.9  }, // cyan
  { pos: [-1.6, -0.8, -5.8], color: LED_COLORS[2], scale: 0.75 },
  { pos: [ 1.8, 1.2,  2.2], color: LED_COLORS[4], scale: 0.7  },
];

/**
 * 360° orbital parallax: the camera is positioned on a sphere around
 * the origin, and the mouse drives the azimuth (yaw) and elevation
 * (pitch). The camera then `lookAt(0,0,0)` so the whole scene rotates
 * around the visitor's gaze.
 */
export default function Scene() {
  const anchor = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const targetAz = useRef(0);
  const targetEl = useRef(0);
  const az = useRef(0);
  const el = useRef(0);
  const RADIUS = 6;
  // Generous spherical navigation range — the viewer can swing the camera
  // well around the cluster without losing the hero text.
  const MAX_AZ = Math.PI * 0.7; // ~126° yaw range
  const MAX_EL = Math.PI * 0.35; // ~63° pitch range

  // Subscribe to the window so the scene reacts even when overlay layers
  // (wallpaper wash, vignette, flower overlay, hero text, etc.) sit above
  // the Canvas. `state.pointer` only updates when the Canvas DOM node
  // itself receives pointer events, which it doesn't here.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      // Invert Y to match r3f's NDC convention: top of screen = +1.
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    targetAz.current = pointer.current.x * MAX_AZ;
    targetEl.current = pointer.current.y * MAX_EL;

    // Softer lerp → perceivable inertia, so the camera feels like it's drifting
    // through the cluster rather than snapping.
    az.current = MathUtils.lerp(az.current, targetAz.current, 0.07);
    el.current = MathUtils.lerp(el.current, targetEl.current, 0.07);

    const cosEl = Math.cos(el.current);
    state.camera.position.set(
      RADIUS * Math.sin(az.current) * cosEl,
      RADIUS * Math.sin(el.current),
      RADIUS * Math.cos(az.current) * cosEl,
    );
    state.camera.lookAt(0, 0, 0);

    // The cluster itself stays put — only the camera navigates around it,
    // which sells the "walking around the galaxy" feel.
    if (anchor.current) {
      anchor.current.rotation.y = 0;
      anchor.current.rotation.x = 0;
    }
  });

  return (
    <>
      {/* Grounded, physically-plausible lighting — no pink pop-light */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 3]} intensity={0.9} color="#f5ead8" />
      <directionalLight position={[-5, -3, 2]} intensity={0.35} color="#b9c8d4" />
      <hemisphereLight args={["#e8d8c8", "#3a2f3a", 0.4]} />

      <group ref={anchor}>
        {LEDS.map((l, i) => (
          <LED
            key={`led-${i}`}
            position={l.pos}
            color={l.color}
            scale={l.scale}
            floatSpeed={0.6 + (i % 3) * 0.15}
            floatOffset={i * 0.7}
          />
        ))}

        <GlitchParticles count={45} spread={18} />
      </group>
    </>
  );
}
