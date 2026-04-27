"use client";

import { useEffect, useMemo, useState } from "react";

const CHARS = ["#", "%", "e", "x", "o", "*", "+", "=", ".", "·", "@", "X", "o", "0", "8"];
const PETAL_CHARS = ["#", "%", "@", "X", "8"];
const CORE_CHARS = ["%", "#", "o", "0", "@"];
const EDGE_CHARS = [".", "·", "'", ":", "-"];

type Props = {
  /** Grid side, in chars (both dims equal). */
  size?: number;
  petals?: number;
  /** ms between character re-randomizations */
  glitchMs?: number;
  color?: string;
  glowColor?: string;
  /** Optional seed for the mask variation */
  seed?: number;
};

/**
 * Renders a procedurally-shaped flower mask in monospace ASCII characters.
 * Mask is fixed; characters inside re-randomize every `glitchMs` for the
 * glitch effect. Shape is a 5-petal rose silhouette controlled by the
 * polar equation r = rBase * (0.45 + 0.5 * |cos(petals * θ / 2)|).
 */
export default function AsciiFlower({
  size = 30,
  petals = 5,
  glitchMs = 140,
  color = "#ffffff",
  glowColor = "rgba(255,180,210,0.75)",
  seed = 0,
}: Props) {
  // Shape mask — 1 if inside the flower, 0 if outside. Also records a zone
  // (0 = core, 1 = petal, 2 = edge) so we can pick character sets by region.
  //
  // Petal silhouette: raising |cos| to a fractional power sharpens the lobes
  // so the valleys pull deep toward the core and the tips taper out to a
  // point, giving a spiky / star-flower shape instead of the rounded dome
  // shape a plain |cos| produces.
  const mask = useMemo(() => {
    const grid: number[][] = [];
    const r = size / 2;
    const rotate = (seed % 12) * (Math.PI / 24);
    const rMin = r * 0.22;
    const rMax = r * 0.98;
    for (let y = 0; y < size; y++) {
      const row: number[] = [];
      for (let x = 0; x < size; x++) {
        const dx = x - r + 0.5;
        const dy = y - r + 0.5;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) + rotate;
        const wave = Math.pow(Math.abs(Math.cos((petals * angle) / 2)), 0.55);
        const petalR = rMin + (rMax - rMin) * wave;
        if (dist > petalR) {
          row.push(0);
        } else if (dist < r * 0.14) {
          row.push(1); // core
        } else if (dist > petalR - 1.2) {
          row.push(3); // edge — traces the spiky outline
        } else {
          row.push(2); // petal interior
        }
      }
      grid.push(row);
    }
    return grid;
  }, [size, petals, seed]);

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 10000), glitchMs);
    return () => clearInterval(id);
  }, [glitchMs]);

  // Deterministic but re-rolled each tick: cell char depends on tick + position.
  const pick = (zone: number, x: number, y: number) => {
    if (zone === 0) return " ";
    const set =
      zone === 1 ? CORE_CHARS : zone === 3 ? EDGE_CHARS : PETAL_CHARS;
    // mix a 'random' from tick+x+y so chars flicker per cell on their own cadence
    const h = Math.sin((tick + 1) * 12.9898 + x * 78.233 + y * 37.719) * 43758.5453;
    const r = h - Math.floor(h);
    // Occasionally pull from the full CHARS set for glitchier swaps
    if (r < 0.07) return CHARS[Math.floor(r * 1000) % CHARS.length];
    return set[Math.floor(r * 1000) % set.length];
  };

  return (
    <pre
      aria-hidden
      className="pointer-events-none select-none font-mono leading-[0.95] tracking-[0.02em]"
      style={{
        color,
        fontSize: "10px",
        textShadow: `0 0 6px ${glowColor}, 0 0 2px rgba(255,255,255,0.9)`,
        letterSpacing: "1px",
        margin: 0,
      }}
    >
      {mask
        .map((row, y) =>
          row.map((zone, x) => pick(zone, x, y)).join(""),
        )
        .join("\n")}
    </pre>
  );
}
