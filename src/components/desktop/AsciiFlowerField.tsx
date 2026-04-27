"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import AsciiFlower from "./AsciiFlower";

type Spawn = {
  key: number;
  left: number;
  top: number;
  size: number;
  rotate: number;
  color: string;
  glow: string;
  seed: number;
  lifeMs: number;
};

const GLOW_PALETTE = [
  { color: "#ffffff", glow: "rgba(255,180,210,0.85)" },
  { color: "#ffe7f0", glow: "rgba(255,120,175,0.8)" },
  { color: "#e8f7ef", glow: "rgba(142,216,198,0.8)" },
  { color: "#fff5d9", glow: "rgba(245,200,120,0.8)" },
];

const MIN_SPAWN = 1800;
const MAX_SPAWN = 3600;
const MAX_ACTIVE = 4;

/**
 * Spawns glitchy ASCII flowers at random positions across the desktop.
 * Each flower fades in, glitch-cycles its characters, then fades out.
 */
export default function AsciiFlowerField() {
  const [spawns, setSpawns] = useState<Spawn[]>([]);
  const nextKey = useRef(1);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const delay = MIN_SPAWN + Math.random() * (MAX_SPAWN - MIN_SPAWN);
      timeoutId = setTimeout(() => {
        setSpawns((prev) => {
          if (prev.length >= MAX_ACTIVE) return prev;
          const palette = GLOW_PALETTE[Math.floor(Math.random() * GLOW_PALETTE.length)];
          const next: Spawn = {
            key: nextKey.current++,
            // Avoid the very edges and the folder column on the right
            left: 6 + Math.random() * 70,
            top: 8 + Math.random() * 70,
            size: 22 + Math.floor(Math.random() * 16),
            rotate: (Math.random() - 0.5) * 40,
            color: palette.color,
            glow: palette.glow,
            seed: Math.floor(Math.random() * 100),
            lifeMs: 4500 + Math.random() * 3000,
          };
          return [...prev, next];
        });
        schedule();
      }, delay);
    };

    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  const reap = (key: number) =>
    setSpawns((prev) => prev.filter((s) => s.key !== key));

  return (
    <div className="pointer-events-none absolute inset-0 z-[15] overflow-hidden">
      <AnimatePresence>
        {spawns.map((s) => (
          <FlowerInstance key={s.key} spawn={s} onDone={() => reap(s.key)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function FlowerInstance({
  spawn,
  onDone,
}: {
  spawn: Spawn;
  onDone: () => void;
}) {
  const [alive, setAlive] = useState(true);

  useEffect(() => {
    const fadeOut = setTimeout(() => setAlive(false), spawn.lifeMs);
    const done = setTimeout(onDone, spawn.lifeMs + 800);
    return () => {
      clearTimeout(fadeOut);
      clearTimeout(done);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotate: spawn.rotate - 15 }}
      animate={{
        opacity: alive ? 1 : 0,
        scale: alive ? 1 : 1.1,
        rotate: spawn.rotate,
      }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute"
      style={{
        left: `${spawn.left}%`,
        top: `${spawn.top}%`,
        transformOrigin: "center center",
      }}
    >
      {/* A second ghost layer, offset, for the glitchy duplication feel */}
      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-screen opacity-60"
          style={{
            transform: "translate(3px, -2px)",
            filter: "hue-rotate(-20deg)",
          }}
        >
          <AsciiFlower
            size={spawn.size}
            color={spawn.color}
            glowColor={spawn.glow}
            seed={spawn.seed + 3}
            glitchMs={110}
          />
        </div>
        <AsciiFlower
          size={spawn.size}
          color={spawn.color}
          glowColor={spawn.glow}
          seed={spawn.seed}
          glitchMs={140}
        />
      </div>
    </motion.div>
  );
}
