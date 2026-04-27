"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

/**
 * Hydra-ish live-coding polaroid. Each program declares a set of `ops`
 * (typed operations) and a `code` array — the code is the text shown on
 * top of the image, the ops describe what actually happens to the pixels.
 * Programs are hand-paired so the visible code matches the applied effect
 * one-to-one. Sequence starts gentle (colour), then escalates toward
 * fragmentation and pixelation so the piece feels like it's being
 * live-coded from scratch every loop.
 */

type RGB = [number, number, number];

type Op =
  | { t: "color"; c: RGB }
  | { t: "hue"; n: number }
  | { t: "saturate"; x: number }
  | { t: "brightness"; x: number }
  | { t: "contrast"; x: number }
  | { t: "invert"; x: number }
  | { t: "sepia"; x: number }
  | { t: "grayscale"; x: number }
  | { t: "blur"; px: number }
  | { t: "rotate"; rad: number }
  | { t: "scale"; x: number }
  | { t: "mirror" }
  | { t: "mult"; c: RGB }
  | { t: "screen"; c: RGB }
  | { t: "diff"; c: RGB }
  | { t: "burn"; c: RGB }
  | { t: "dodge"; c: RGB }
  | { t: "repeat"; cols: number; rows: number }
  | { t: "pixelate"; size: number };

type Program = { code: string[]; ops: Op[] };

const PROGRAMS: Program[] = [
  // 1 — gentle introduction: just a warm colour wash.
  {
    code: ["src(s0)", "  .color(1.1, 0.95, 0.85)", "  .out()"],
    ops: [{ t: "color", c: [1.1, 0.95, 0.85] }],
  },
  // 2 — hue shift.
  {
    code: ["src(s0)", "  .hue(0.12)", "  .saturate(1.3)", "  .out()"],
    ops: [
      { t: "hue", n: 0.12 },
      { t: "saturate", x: 1.3 },
    ],
  },
  // 3 — vintage sepia.
  {
    code: ["src(s0)", "  .sepia(0.7)", "  .contrast(1.15)", "  .out()"],
    ops: [
      { t: "sepia", x: 0.7 },
      { t: "contrast", x: 1.15 },
    ],
  },
  // 4 — crunchy contrast.
  {
    code: ["src(s0)", "  .contrast(1.4)", "  .brightness(0.92)", "  .out()"],
    ops: [
      { t: "contrast", x: 1.4 },
      { t: "brightness", x: 0.92 },
    ],
  },
  // 5 — noir.
  {
    code: ["src(s0)", "  .grayscale(1)", "  .contrast(1.3)", "  .out()"],
    ops: [
      { t: "grayscale", x: 1 },
      { t: "contrast", x: 1.3 },
    ],
  },
  // 6 — multiply with a purple.
  {
    code: ["src(s0)", "  .mult(color(0.6, 0.3, 0.85))", "  .out()"],
    ops: [{ t: "mult", c: [0.6, 0.3, 0.85] }],
  },
  // 7 — screen blend with orange.
  {
    code: [
      "src(s0)",
      "  .screen(color(0.95, 0.45, 0.2))",
      "  .saturate(1.3)",
      "  .out()",
    ],
    ops: [
      { t: "screen", c: [0.95, 0.45, 0.2] },
      { t: "saturate", x: 1.3 },
    ],
  },
  // 8 — partial invert + rotation starts.
  {
    code: ["src(s0)", "  .invert(0.45)", "  .rotate(0.25)", "  .out()"],
    ops: [
      { t: "invert", x: 0.45 },
      { t: "rotate", rad: 0.25 },
    ],
  },
  // 9 — colour burn with deep magenta.
  {
    code: [
      "src(s0)",
      "  .burn(color(0.7, 0.1, 0.5))",
      "  .brightness(1.05)",
      "  .out()",
    ],
    ops: [
      { t: "burn", c: [0.7, 0.1, 0.5] },
      { t: "brightness", x: 1.05 },
    ],
  },
  // 10 — scale + difference blend (big colour pop).
  {
    code: [
      "src(s0)",
      "  .scale(1.25)",
      "  .diff(color(0.3, 0.6, 0.95))",
      "  .out()",
    ],
    ops: [
      { t: "scale", x: 1.25 },
      { t: "diff", c: [0.3, 0.6, 0.95] },
    ],
  },
  // 11 — dodge + dream blur.
  {
    code: [
      "src(s0)",
      "  .blur(5)",
      "  .dodge(color(0.9, 0.4, 0.8))",
      "  .saturate(1.4)",
      "  .out()",
    ],
    ops: [
      { t: "blur", px: 5 },
      { t: "dodge", c: [0.9, 0.4, 0.8] },
      { t: "saturate", x: 1.4 },
    ],
  },
  // 12 — mirror flip + blur.
  {
    code: ["src(s0)", "  .mirror()", "  .blur(3)", "  .out()"],
    ops: [{ t: "mirror" }, { t: "blur", px: 3 }],
  },
  // 13 — fragmenting starts: tile the image.
  {
    code: ["src(s0)", "  .repeat(3, 2)", "  .hue(0.5)", "  .out()"],
    ops: [
      { t: "repeat", cols: 3, rows: 2 },
      { t: "hue", n: 0.5 },
    ],
  },
  // 14 — dense mosaic.
  {
    code: [
      "src(s0)",
      "  .repeat(6, 3)",
      "  .rotate(0.2)",
      "  .saturate(1.4)",
      "  .out()",
    ],
    ops: [
      { t: "repeat", cols: 6, rows: 3 },
      { t: "rotate", rad: 0.2 },
      { t: "saturate", x: 1.4 },
    ],
  },
  // 15 — chunky pixelate.
  {
    code: ["src(s0)", "  .pixelate(36)", "  .saturate(1.6)", "  .out()"],
    ops: [
      { t: "pixelate", size: 36 },
      { t: "saturate", x: 1.6 },
    ],
  },
  // 16 — fine pixelate + orange difference.
  {
    code: [
      "src(s0)",
      "  .pixelate(16)",
      "  .diff(color(1, 0.5, 0))",
      "  .out()",
    ],
    ops: [
      { t: "pixelate", size: 16 },
      { t: "diff", c: [1, 0.5, 0] },
    ],
  },
  // 17 — deep rotation + heavy mult.
  {
    code: [
      "src(s0)",
      "  .rotate(0.6)",
      "  .scale(1.4)",
      "  .mult(color(0.35, 0.1, 0.5))",
      "  .contrast(1.5)",
      "  .out()",
    ],
    ops: [
      { t: "rotate", rad: 0.6 },
      { t: "scale", x: 1.4 },
      { t: "mult", c: [0.35, 0.1, 0.5] },
      { t: "contrast", x: 1.5 },
    ],
  },
  // 18 — full chaos: fragment + rotate + mirror + difference.
  {
    code: [
      "src(s0)",
      "  .repeat(4, 4)",
      "  .rotate(0.45)",
      "  .mirror()",
      "  .diff(color(1, 0.2, 0.6))",
      "  .out()",
    ],
    ops: [
      { t: "repeat", cols: 4, rows: 4 },
      { t: "rotate", rad: 0.45 },
      { t: "mirror" },
      { t: "diff", c: [1, 0.2, 0.6] },
    ],
  },
];

const TYPE_SPEED = 26; // ms per char
const HOLD_AFTER_COMPLETE = 2400; // ms

type TokenKind = "fn" | "chain" | "num" | "punct" | "default";
const TOKEN_COLOR: Record<TokenKind, string> = {
  fn: "#ead9a0",
  chain: "#efb3c3",
  num: "#a4d9c5",
  punct: "#c9a5d4",
  default: "#ead9e8",
};

function tokenize(line: string): [TokenKind, string][] {
  const out: [TokenKind, string][] = [];
  const isChained = line.trimStart().startsWith(".");
  const regex = /(\s+|[.,()])|([a-zA-Z_][a-zA-Z0-9_]*)|([-+]?\d*\.?\d+)/g;
  let m: RegExpExecArray | null;
  let last = 0;
  let seenIdentifier = false;
  while ((m = regex.exec(line)) !== null) {
    if (m.index > last) out.push(["default", line.slice(last, m.index)]);
    const [tok] = m;
    if (/^\s+$/.test(tok) || /^[.,()]/.test(tok)) {
      out.push(["punct", tok]);
    } else if (/^[-+]?\d*\.?\d+$/.test(tok)) {
      out.push(["num", tok]);
    } else {
      const kind: TokenKind = !seenIdentifier && isChained ? "chain" : "fn";
      out.push([kind, tok]);
      seenIdentifier = true;
    }
    last = regex.lastIndex;
  }
  if (last < line.length) out.push(["default", line.slice(last)]);
  return out;
}

type Compiled = {
  filter: string;
  transform: string;
  overlays: {
    color: string;
    blend: CSSProperties["mixBlendMode"];
    opacity: number;
  }[];
  tile?: { cols: number; rows: number };
  pixel?: number;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const rgbCss = (c: RGB, a = 1) =>
  `rgba(${Math.round(clamp01(c[0]) * 255)}, ${Math.round(clamp01(c[1]) * 255)}, ${Math.round(clamp01(c[2]) * 255)}, ${a})`;

function compile(ops: Op[]): Compiled {
  const filters: string[] = [];
  const transforms: string[] = [];
  const overlays: Compiled["overlays"] = [];
  let tile: Compiled["tile"];
  let pixel: number | undefined;
  // Track cumulative rotation + scale so we can back-fill a cover-scale
  // when the image is rotated — a rotated square needs `|cos θ| + |sin θ|`
  // extra scale to still cover its original frame without corner bleed.
  let totalRotationRad = 0;
  let totalScale = 1;

  for (const op of ops) {
    switch (op.t) {
      case "color":
        overlays.push({
          color: rgbCss(op.c),
          blend: "soft-light",
          opacity: 0.6,
        });
        break;
      case "hue":
        filters.push(`hue-rotate(${Math.round(op.n * 360)}deg)`);
        break;
      case "saturate":
        filters.push(`saturate(${op.x})`);
        break;
      case "brightness":
        filters.push(`brightness(${op.x})`);
        break;
      case "contrast":
        filters.push(`contrast(${op.x})`);
        break;
      case "invert":
        filters.push(`invert(${op.x})`);
        break;
      case "sepia":
        filters.push(`sepia(${op.x})`);
        break;
      case "grayscale":
        filters.push(`grayscale(${op.x})`);
        break;
      case "blur":
        filters.push(`blur(${op.px}px)`);
        break;
      case "rotate":
        totalRotationRad += op.rad;
        transforms.push(
          `rotate(${((op.rad * 180) / Math.PI).toFixed(1)}deg)`,
        );
        break;
      case "scale":
        totalScale *= op.x;
        transforms.push(`scale(${op.x})`);
        break;
      case "mirror":
        transforms.push("scaleX(-1)");
        break;
      case "mult":
        overlays.push({
          color: rgbCss(op.c),
          blend: "multiply",
          opacity: 0.75,
        });
        break;
      case "screen":
        overlays.push({ color: rgbCss(op.c), blend: "screen", opacity: 0.6 });
        break;
      case "diff":
        overlays.push({
          color: rgbCss(op.c),
          blend: "difference",
          opacity: 0.8,
        });
        break;
      case "burn":
        overlays.push({
          color: rgbCss(op.c),
          blend: "color-burn",
          opacity: 0.7,
        });
        break;
      case "dodge":
        overlays.push({
          color: rgbCss(op.c),
          blend: "color-dodge",
          opacity: 0.55,
        });
        break;
      case "repeat":
        tile = { cols: op.cols, rows: op.rows };
        break;
      case "pixelate":
        pixel = op.size;
        break;
    }
  }

  // If the image is rotated and the user's explicit scale doesn't already
  // cover the rotation, append an extra scale so the corners never bleed.
  if (totalRotationRad !== 0) {
    const minCover =
      Math.abs(Math.cos(totalRotationRad)) +
      Math.abs(Math.sin(totalRotationRad));
    if (totalScale < minCover) {
      const extra = minCover / totalScale;
      transforms.push(`scale(${extra.toFixed(3)})`);
    }
  }

  return {
    filter: filters.join(" "),
    transform: transforms.join(" "),
    overlays,
    tile,
    pixel,
  };
}

type Props = {
  src: string;
  caption?: string;
  rotate?: number;
  style?: CSSProperties;
  size?: number;
};

export default function HydraPolaroid({
  src,
  caption = "IMG_4773.JPG",
  rotate = -3,
  style,
  size = 480,
}: Props) {
  const [programIdx, setProgramIdx] = useState(0);
  const [typed, setTyped] = useState(0);

  const program = PROGRAMS[programIdx];
  const fullText = program.code.join("\n");
  const totalChars = fullText.length;

  useEffect(() => {
    if (typed < totalChars) {
      const id = window.setTimeout(() => setTyped((t) => t + 1), TYPE_SPEED);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => {
      setTyped(0);
      setProgramIdx((i) => (i + 1) % PROGRAMS.length);
    }, HOLD_AFTER_COMPLETE);
    return () => window.clearTimeout(id);
  }, [typed, totalChars]);

  const linesVisible: string[] = (() => {
    let remaining = typed;
    const out: string[] = [];
    for (const line of program.code) {
      if (remaining <= 0) {
        out.push("");
        continue;
      }
      if (remaining >= line.length + 1) {
        out.push(line);
        remaining -= line.length + 1;
      } else {
        out.push(line.slice(0, remaining));
        remaining = 0;
      }
    }
    return out;
  })();

  const isTyping = typed < totalChars;
  let cursorLine = -1;
  for (let i = linesVisible.length - 1; i >= 0; i--) {
    if (linesVisible[i].length > 0) {
      cursorLine = i;
      break;
    }
  }

  const compiled = compile(program.ops);
  const imgSize = size - 24;

  return (
    <motion.div
      initial={{ rotate }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
      drag
      dragMomentum={false}
      dragElastic={0.12}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="note-shadow relative cursor-grab select-none touch-none active:cursor-grabbing"
      style={style}
    >
      {/* thumbtack */}
      <span
        aria-hidden
        className="absolute left-1/2 -top-3 z-10 size-5 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #fff 0%, #c9a5d4 40%, #7a4d94 100%)",
          boxShadow: "1px 1px 3px rgba(0,0,0,0.5)",
        }}
      />

      <div className="bg-paper p-3 pb-8" style={{ width: size }}>
        <div
          className="relative aspect-square w-full overflow-hidden bg-plum"
          style={{ width: imgSize }}
        >
          <PortraitMedia src={src} size={imgSize} compiled={compiled} />

          {/* Blend-mode overlays — order matters, drawn in op order on top */}
          {compiled.overlays.map((ov, i) => (
            <div
              key={`${programIdx}-${i}`}
              aria-hidden
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                backgroundColor: ov.color,
                mixBlendMode: ov.blend,
                opacity: ov.opacity,
              }}
            />
          ))}

          {/* Scanline CRT texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 1px, transparent 1px, transparent 3px)",
            }}
          />

          {/* Hydra-style code overlay */}
          <pre
            aria-hidden
            className="pointer-events-none absolute inset-0 p-4 font-mono text-[13px] leading-relaxed"
            style={{
              color: TOKEN_COLOR.default,
              textShadow: "0 1px 2px rgba(0,0,0,0.9)",
            }}
          >
            {linesVisible.map((line, i) => {
              const tokens = tokenize(line);
              const showCaret = isTyping && i === cursorLine;
              return (
                <div key={i}>
                  {tokens.map(([kind, text], j) => (
                    <span key={j} style={{ color: TOKEN_COLOR[kind] }}>
                      {text}
                    </span>
                  ))}
                  {showCaret && (
                    <span
                      aria-hidden
                      className="inline-block align-middle"
                      style={{
                        width: "7px",
                        height: "14px",
                        marginLeft: "1px",
                        background: TOKEN_COLOR.chain,
                        animation: "caret-blink 1s step-end infinite",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </pre>

          {/* Status badge */}
          <div
            className="absolute top-2 right-2 flex items-center gap-1 bg-plum/80 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-code-text"
            style={{ letterSpacing: "0.12em" }}
          >
            <span
              className="inline-block size-1.5 bg-mint"
              style={{ animation: "caret-blink 0.9s step-end infinite" }}
              aria-hidden
            />
            hydra.js
          </div>
        </div>

        {caption && (
          <div className="mt-3 text-center font-hand text-xl leading-none text-ink">
            {caption}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Chooses the render path for the portrait based on the current program.
 * `tile` swaps to a tiled background image, `pixel` scales down + up with
 * pixelated rendering, otherwise a plain <img> with filter + transform.
 */
function PortraitMedia({
  src,
  size,
  compiled,
}: {
  src: string;
  size: number;
  compiled: Compiled;
}) {
  const { filter, transform, tile, pixel } = compiled;

  if (tile) {
    return (
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: `${100 / tile.cols}% ${100 / tile.rows}%`,
          backgroundRepeat: "repeat",
          filter,
          transform,
          transformOrigin: "center center",
        }}
      />
    );
  }

  if (pixel) {
    const scale = size / pixel;
    return (
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ filter, transform, transformOrigin: "center center" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="portrait"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${pixel}px`,
            height: `${pixel}px`,
            imageRendering: "pixelated",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            objectFit: "cover",
          }}
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="portrait"
      className="absolute inset-0 h-full w-full object-cover"
      style={{
        filter,
        transform,
        transformOrigin: "center center",
        transition: "filter 500ms ease-out, transform 500ms ease-out",
      }}
    />
  );
}
