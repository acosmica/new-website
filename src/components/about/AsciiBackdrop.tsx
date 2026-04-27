"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient ASCII field — a sparse monospace grid of glyphs that pulse and
 * drift on a slow wave. Low opacity, plum-tinted. Designed as wallpaper:
 * enough motion to feel alive, not enough to pull attention from content.
 */
const GLYPHS = [".", "·", "∴", "∵", "~", "*", "◦", "░", "▒", "✧", "+"];
const CELL = 22; // px per cell — sparse density

export default function AsciiBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    // Per-cell seed, computed once per resize. Keeps glyphs stable so they
    // don't flicker randomly — they only breathe in brightness/position.
    let seeds: Float32Array = new Float32Array(0);
    let glyphIdx: Uint8Array = new Uint8Array(0);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      const total = cols * rows;
      seeds = new Float32Array(total);
      glyphIdx = new Uint8Array(total);
      for (let i = 0; i < total; i++) {
        seeds[i] = Math.random();
        glyphIdx[i] = Math.floor(Math.random() * GLYPHS.length);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let start = performance.now();

    const tick = (now: number) => {
      const t = (now - start) * 0.001; // seconds
      ctx.clearRect(0, 0, w, h);
      ctx.font = "14px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const seed = seeds[i];
          // Slow wave field — each cell fades in/out on its own phase,
          // modulated spatially so waves ripple across the grid.
          const phase =
            t * (0.25 + seed * 0.4) +
            c * 0.18 +
            r * 0.22 +
            seed * Math.PI * 2;
          const pulse = 0.5 + 0.5 * Math.sin(phase);
          // Squash pulse so cells rest dim most of the time — only a
          // handful glow brightly at any given moment.
          const intensity = Math.pow(pulse, 3);
          if (intensity < 0.04) continue;

          const x = c * CELL + CELL / 2;
          const y = r * CELL + CELL / 2;
          // Slight drift so glyphs aren't perfectly aligned to the grid.
          const dx = Math.sin(t * 0.5 + seed * 7) * 1.4;
          const dy = Math.cos(t * 0.45 + seed * 5) * 1.4;

          // Color mix across the plum palette: lavender → mauve → mint
          // based on the cell's seed so the field reads as part of the
          // dreamy-terminal colour family.
          const hueSeed = seed;
          let color: string;
          if (hueSeed < 0.55) {
            color = `rgba(201, 165, 212, ${intensity * 0.6})`; // mauve
          } else if (hueSeed < 0.85) {
            color = `rgba(234, 217, 232, ${intensity * 0.55})`; // code-text
          } else {
            color = `rgba(164, 217, 197, ${intensity * 0.5})`; // mint
          }
          ctx.fillStyle = color;
          ctx.fillText(GLYPHS[glyphIdx[i]], x + dx, y + dy);
        }
      }

      if (!reduceMotion) raf = requestAnimationFrame(tick);
    };

    if (reduceMotion) {
      tick(performance.now());
    } else {
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
