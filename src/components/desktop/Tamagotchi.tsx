"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Needs = {
  hunger: number;
  thirst: number;
  hygiene: number;
  energy: number;
};

type Action = "feed" | "water" | "bathe" | "nap";

const ACTIONS: {
  key: Action;
  label: string;
  emoji: string;
  affects: keyof Needs;
}[] = [
  { key: "feed", label: "Feed", emoji: "🍎", affects: "hunger" },
  { key: "water", label: "Drink", emoji: "💧", affects: "thirst" },
  { key: "bathe", label: "Bathe", emoji: "🫧", affects: "hygiene" },
  { key: "nap", label: "Nap", emoji: "💤", affects: "energy" },
];

const BAR_COLOR: Record<keyof Needs, string> = {
  hunger: "#f2c9a8",   // peach
  thirst: "#bfe0d2",   // seafoam
  hygiene: "#a4d9c5",  // mint
  energy: "#c9a5d4",   // mauve
};

// Random need level on first open — between 25 and 80 so the pet always
// arrives with something that needs attention but isn't catastrophic.
function randNeed() {
  return 25 + Math.floor(Math.random() * 56);
}

type Mood = "happy" | "ok" | "sad";

export default function Tamagotchi({ open }: { open: boolean }) {
  const [needs, setNeeds] = useState<Needs>({
    hunger: 70,
    thirst: 70,
    hygiene: 70,
    energy: 70,
  });
  const [seeded, setSeeded] = useState(false);
  const [puff, setPuff] = useState<Action | null>(null);
  const [dodge, setDodge] = useState<{ dx: number; dy: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dodgeTimeoutRef = useRef<number | null>(null);

  // Seed once on first client mount — keeps SSR output deterministic so we
  // don't trigger a hydration mismatch.
  useEffect(() => {
    if (seeded) return;
    setNeeds({
      hunger: randNeed(),
      thirst: randNeed(),
      hygiene: randNeed(),
      energy: randNeed(),
    });
    setSeeded(true);
  }, [seeded]);

  const doAction = (act: Action, affects: keyof Needs) => {
    setNeeds((n) => ({ ...n, [affects]: 100 }));
    setPuff(act);
    window.setTimeout(() => setPuff((cur) => (cur === act ? null : cur)), 900);
  };

  const startle = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // Dodge AWAY from the click.
    const vx = cx - e.clientX;
    const vy = cy - e.clientY;
    const mag = Math.max(1, Math.hypot(vx, vy));
    const DODGE_PX = 18;
    setDodge({ dx: (vx / mag) * DODGE_PX, dy: (vy / mag) * DODGE_PX });
    if (dodgeTimeoutRef.current) window.clearTimeout(dodgeTimeoutRef.current);
    dodgeTimeoutRef.current = window.setTimeout(() => setDodge(null), 850);
  };

  const minNeed = Math.min(
    needs.hunger,
    needs.thirst,
    needs.hygiene,
    needs.energy,
  );
  const mood: Mood = minNeed > 75 ? "happy" : minNeed > 40 ? "ok" : "sad";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="plum-outset absolute bottom-12 right-0 z-[80] w-72 bg-plum text-code-text shadow-[4px_4px_0_rgba(0,0,0,0.4)]"
          role="dialog"
          aria-label="Pixel pet"
        >
          <div
            className="flex items-center gap-2 px-2 py-1.5 font-pixel text-base leading-none"
            style={{
              background:
                "linear-gradient(90deg, var(--color-code-title-from) 0%, var(--color-code-title-to) 100%)",
            }}
          >
            <span
              className="inline-block size-3 bg-peach pixelated pixel-outset"
              aria-hidden
            />
            <span>pet.exe</span>
            <span className="ml-auto text-[10px] font-mono uppercase tracking-wider opacity-75">
              feeling {mood}
            </span>
          </div>

          <div
            ref={stageRef}
            onClick={startle}
            className="plum-inset relative mx-2 my-2 grid h-28 cursor-pointer place-items-center overflow-hidden bg-code-gutter"
            role="button"
            aria-label="Poke the pet"
            tabIndex={0}
          >
            <motion.div
              animate={{ x: dodge?.dx ?? 0, y: dodge?.dy ?? 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
            >
              <PetSprite mood={mood} startled={dodge !== null} />
            </motion.div>
            <AnimatePresence>
              {puff && (
                <motion.div
                  key={puff}
                  initial={{ opacity: 0, y: 6, scale: 0.6 }}
                  animate={{ opacity: 1, y: -22, scale: 1.25 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="pointer-events-none absolute text-2xl"
                >
                  {ACTIONS.find((a) => a.key === puff)?.emoji}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mx-2 mb-2 space-y-1.5 font-pixel text-[11px] leading-none">
            {(Object.keys(BAR_COLOR) as (keyof Needs)[]).map((k) => (
              <NeedBar
                key={k}
                label={k}
                value={needs[k]}
                color={BAR_COLOR[k]}
              />
            ))}
          </div>

          <div className="mx-2 mb-2 grid grid-cols-4 gap-1">
            {ACTIONS.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={() => doAction(a.key, a.affects)}
                className="plum-outset flex flex-col items-center gap-0.5 bg-plum py-1 font-pixel text-[10px] leading-none text-code-text hover:bg-plum-light/50 active:translate-y-[1px]"
                aria-label={`${a.label} the pet`}
              >
                <span className="text-lg leading-none">{a.emoji}</span>
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NeedBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 truncate uppercase opacity-75">{label}</span>
      <div className="plum-inset h-3 flex-1 overflow-hidden bg-code-gutter">
        <div
          className="h-full transition-[width] duration-500 ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-7 text-right tabular-nums">{value}</span>
    </div>
  );
}

/**
 * True 8-bit pixel creature — a lavender cat-blob rendered on a 16×16 grid
 * of 1×1 rects. Chunky NES-era silhouette. Mood swaps eye + mouth rows.
 *
 * Legend: D = dark outline · P = body mauve · C = pink (cheek/inner ear)
 *         B = belly cream · E = eye/mouth black · T = mint teardrop.
 */
const PIXEL_COLORS: Record<string, string> = {
  D: "#7a4d94",
  P: "#c9a5d4",
  C: "#efb3c3",
  B: "#ead9e8",
  E: "#1a1a1a",
  T: "#bfe0d2",
};

// Rows 0–5: head silhouette + ears (shared by all moods). Tapered top so
// the body reads as a soft round blob rather than a boxy silhouette.
const HEAD: string[] = [
  "................",
  "..DD........DD..",
  "..DCD......DCD..",
  "..DCCD....DCCD..",
  "..DPPPPPPPPPPD..",
  ".DPPPPPPPPPPPPD.",
];

// Rows 11–15: belly + base (shared by all moods). Wider at the top,
// tapering pixel-by-pixel to a rounded bottom.
const BELLY: string[] = [
  ".DPBBBBBBBBBBPD.",
  ".DBBBBBBBBBBBBD.",
  "..DBBBBBBBBBBD..",
  "...DDDDDDDDDD...",
  "................",
];

// Transient "startled" face — eyes wide open, tiny 'o' mouth. Triggered
// when the user clicks the pet. Rendered instead of the mood face for ~1s.
const SURPRISED_FACE: string[] = [
  "DPPEEPPPPPPEEPPD", // wide eye top
  "DPPEEPPPPPPEEPPD", // wide eye bottom (2×2 eyes = shocked stare)
  "DPPPPPPPPPPPPPPD",
  "DPPPPPPEEPPPPPPD", // small 'o' mouth (gasp)
  "DPPPPPPPPPPPPPPD",
];

// Rows 6–10 change with mood.
const FACE: Record<Mood, string[]> = {
  happy: [
    "DPPEEEPPPPEEEPPD", // closed smile eyes
    "DPPPPPPPPPPPPPPD",
    "DPPCPPPPPPPPCPPD", // cheek blush
    "DPPPPEPPPPEPPPPD", // smile corners
    "DPPPPPEEEEPPPPPD", // smile flat (U)
  ],
  ok: [
    "DPPPEEPPPPEEPPPD", // open dot eyes
    "DPPPPPPPPPPPPPPD",
    "DPPCPPPPPPPPCPPD",
    "DPPPPPPPPPPPPPPD",
    "DPPPPPEEEEPPPPPD", // simple flat smile
  ],
  sad: [
    "DPPPEEPPPPEEPPPD",
    "DPPPPTPPPPPPPPPD", // tear drop below left eye
    "DPPCPPPPPPPPCPPD",
    "DPPPPPEEEEPPPPPD", // frown flat top
    "DPPPPEPPPPEPPPPD", // frown corners turn down
  ],
};

// Tail pixels — an S-curl that floats out to the right of the body. Stored
// as [col, row, colorKey]. Rendered inside a <motion.g> that drifts gently
// so the tail looks alive while the body does its idle bob.
const TAIL_PIXELS: [number, number, keyof typeof PIXEL_COLORS][] = [
  [16, 10, "P"],
  [17, 10, "P"],
  [18, 9, "P"],
  [18, 8, "P"],
  [17, 7, "P"],
  [17, 6, "D"],
];

function PetSprite({ mood, startled }: { mood: Mood; startled: boolean }) {
  const grid = [...HEAD, ...(startled ? SURPRISED_FACE : FACE[mood]), ...BELLY];
  return (
    <motion.svg
      width="120"
      height="96"
      viewBox="0 0 20 16"
      style={{ shapeRendering: "crispEdges", imageRendering: "pixelated" }}
      animate={{ y: [0, -1, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      aria-label={`pet feeling ${mood}`}
      role="img"
    >
      {grid.map((row, y) =>
        Array.from(row).map((ch, x) => {
          const fill = PIXEL_COLORS[ch];
          if (!fill) return null;
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={fill}
            />
          );
        }),
      )}
      <motion.g
        animate={{ x: [0, 0.35, 0, -0.25, 0], y: [0, -0.4, 0, 0.25, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {TAIL_PIXELS.map(([x, y, key]) => (
          <rect
            key={`tail-${x}-${y}`}
            x={x}
            y={y}
            width={1}
            height={1}
            fill={PIXEL_COLORS[key]}
          />
        ))}
      </motion.g>
    </motion.svg>
  );
}
