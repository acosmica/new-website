"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "▓▒░█│┃║╳╲╱·•◦∘○◇◆▢▣◐◑◒◓†‡¤¦¶§♢♦☆★▼▲►◄";
const COLORS = ["#ff7eb6", "#c9a5d4", "#f2c9a8", "#ead9a0", "#9d8aa8"];

const CELL = 20;
const FONT_SIZE = 16;
const TICK_MS = 110;
const SWAP_PROB = 0.05;

type Cell = { ch: string; color: string; alpha: number };

export default function AsciiBackdrop({
  className = "pointer-events-none fixed inset-0",
  zIndex = 0,
  opacity = 0.85,
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
          alpha: 0.25 + Math.random() * 0.55,
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
            cell.alpha = 0.45 + Math.random() * 0.5;
          } else {
            cell.alpha = Math.max(0.18, cell.alpha - 0.012);
          }
          if (cell.alpha < 0.05) continue;
          ctx.globalAlpha = cell.alpha;
          ctx.fillStyle = cell.color;
          ctx.fillText(cell.ch, x * CELL + 2, y * CELL + 2);
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    window.addEventListener("resize", resize);

    if (!reduce) {
      raf = requestAnimationFrame(tick);
    } else {
      // Static one-shot render so the backdrop still has texture.
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const cell = cells[y][x];
          ctx.globalAlpha = cell.alpha;
          ctx.fillStyle = cell.color;
          ctx.fillText(cell.ch, x * CELL + 2, y * CELL + 2);
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
