"use client";

import { useEffect, useRef } from "react";

// Typewriter / résumé motifs — bullets, dashes, brackets, slashes,
// asterisks, the kind of glyphs you'd find scattered through a
// monospaced CV draft.
const GLYPHS = "*-/+=|\\—·•◦‹›«»‡¶§†★☆#%&_><[](){}";
const COLORS = ["#f2c9a8", "#ead9a0", "#f5f1e6", "#c9a5d4", "#5a3e7a"];

const CELL = 22;
const FONT_SIZE = 15;
const TICK_MS = 140;
const SWAP_PROB = 0.035;

type Cell = { ch: string; color: string; alpha: number; drift: number };

/**
 * Slow drifting field of CV-themed glyphs for the /cv backdrop. Glyphs
 * fade in, drift upward by a small amount each tick, fade out. Less
 * frenetic than the experiments backdrop so the long résumé text
 * stays readable on top of it.
 */
export default function CvBackdrop({
  className = "pointer-events-none fixed inset-0",
  zIndex = 0,
  opacity = 0.55,
}: {
  className?: string;
  zIndex?: number;
  opacity?: number;
} = {}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cells: Cell[][] = [];
    let cols = 0;
    let rows = 0;
    let raf = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      cells = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          ch: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: 0.15 + Math.random() * 0.45,
          drift: Math.random() * CELL,
        })),
      );
      ctx.font = `${FONT_SIZE}px var(--font-geist-mono), ui-monospace, monospace`;
      ctx.textBaseline = "top";
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < TICK_MS) return;
      last = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cell = cells[y][x];
          if (Math.random() < SWAP_PROB) {
            cell.ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            cell.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            cell.alpha = 0.35 + Math.random() * 0.55;
            cell.drift = CELL;
          } else {
            cell.alpha = Math.max(0.1, cell.alpha - 0.008);
            cell.drift = Math.max(0, cell.drift - 0.6);
          }
          if (cell.alpha < 0.05) continue;
          ctx.globalAlpha = cell.alpha;
          ctx.fillStyle = cell.color;
          ctx.fillText(
            cell.ch,
            x * CELL + 3,
            y * CELL + cell.drift + 2,
          );
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    window.addEventListener("resize", resize);

    if (!reduce) {
      raf = requestAnimationFrame(tick);
    } else {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cell = cells[y][x];
          ctx.globalAlpha = cell.alpha;
          ctx.fillStyle = cell.color;
          ctx.fillText(cell.ch, x * CELL + 3, y * CELL + 2);
        }
      }
      ctx.globalAlpha = 1;
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ zIndex, opacity }}
    />
  );
}
