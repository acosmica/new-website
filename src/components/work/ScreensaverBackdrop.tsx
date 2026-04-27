"use client";

import { useEffect, useRef } from "react";

// Glyph alphabet — mix of block glyphs, punctuation, symbols, digits and
// a handful of letters. Picked to read as "code/screensaver" rather than
// plain prose when it streams down the canvas.
const CHARS =
  "░▒▓█▌▐▞▚◆◇○●·•+*=/\\<>(){}[]|;,._`~!@#$%&?:0123456789abcdefghijklmnopqrstuvwxyz";

// Pastel palette sampled from the wallpaper so the screensaver blends
// into the rest of the site's colour story.
const COLORS = [
  "#c9a5d4", // mauve
  "#efb3c3", // blush
  "#a4d9c5", // mint
  "#ead9a0", // goldlite
  "#f2c9a8", // peach
  "#bfe0d2", // seafoam
];

// Occasional code-line snippets that type-rain alongside the glyphs for
// extra "terminal" texture.
const CODE_SNIPPETS = [
  "src(s0).color(1.1, 0.95, 0.85).out()",
  "for (let i = 0; i < n; i++) spawn()",
  "shader.uniforms.time.value += dt",
  "const ritual = await summon()",
  "if (magic) return render(scene)",
  "noise.seed(Date.now() * 0.001)",
  "osc(4, 0.1, 1.2).kaleid(3).out()",
  "ancestrality.map(echo)",
  "// loading witch.exe...",
  "ctx.fillStyle = 'rgba(201,165,212,1)'",
];

export default function ScreensaverBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FONT_SIZE = 14;
    const COL = FONT_SIZE;
    const FADE = "rgba(18, 10, 31, 0.08)"; // plum-dark translucent
    const FRAME_SKIP = 2; // only advance every Nth animation frame (≈30fps)

    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];
    let speeds: number[] = [];
    let colors: string[] = [];

    type Snippet = {
      text: string;
      x: number;
      y: number;
      written: number;
      vy: number;
      color: string;
      ttl: number;
    };
    let snippets: Snippet[] = [];

    const reset = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = Math.floor(width / COL);
      drops = Array.from({ length: columns }, () => Math.random() * height);
      speeds = Array.from(
        { length: columns },
        () => 0.1 + Math.random() * 0.28,
      );
      colors = Array.from(
        { length: columns },
        () => COLORS[Math.floor(Math.random() * COLORS.length)],
      );

      ctx.fillStyle = "#120a1f";
      ctx.fillRect(0, 0, width, height);
    };

    reset();
    window.addEventListener("resize", reset);

    const maybeSpawnSnippet = () => {
      if (snippets.length > 5) return;
      if (Math.random() > 0.004) return;
      snippets.push({
        text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
        x: Math.random() * (width - 280),
        y: Math.random() * height,
        written: 0,
        vy: 0.06 + Math.random() * 0.12,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        ttl: 520 + Math.floor(Math.random() * 360),
      });
    };

    let raf = 0;
    let running = true;
    let tick = 0;

    const loop = () => {
      if (!running) return;

      tick += 1;
      // Run the animation logic at ~30fps rather than 60fps — every glyph
      // advances half as often, which halves the perceived speed without
      // giving up RAF's vsync.
      if (tick % FRAME_SKIP !== 0) {
        raf = requestAnimationFrame(loop);
        return;
      }

      // Trail fade — translucent fill leaves a ghost of prior frames.
      ctx.fillStyle = FADE;
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${FONT_SIZE}px ui-monospace, "Geist Mono", monospace`;
      ctx.textBaseline = "top";

      // Matrix-style falling glyph columns
      for (let i = 0; i < columns; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = colors[i];
        ctx.fillText(ch, i * COL, drops[i]);

        drops[i] += speeds[i] * FONT_SIZE;
        if (drops[i] > height + FONT_SIZE) {
          drops[i] = -FONT_SIZE;
          speeds[i] = 0.1 + Math.random() * 0.28;
          colors[i] = COLORS[Math.floor(Math.random() * COLORS.length)];
        }
      }

      // Occasional typed code-line segments drifting downward
      maybeSpawnSnippet();
      for (const s of snippets) {
        if (s.written < s.text.length) {
          if (Math.random() < 0.12) s.written++;
        }
        const shown = s.text.slice(0, s.written);
        ctx.fillStyle = s.color;
        ctx.fillText(shown + (s.written < s.text.length ? "▌" : ""), s.x, s.y);
        s.y += s.vy;
        s.ttl -= 1;
      }
      snippets = snippets.filter(
        (s) => s.ttl > 0 && s.y < height + FONT_SIZE,
      );

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", reset);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden bg-plum-dark"
    >
      <canvas ref={canvasRef} className="block" />
      {/* Soft vignette so the ASCII reads richer near the edges and
          quieter behind the window content. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(18,10,31,0.55) 0%, rgba(18,10,31,0.2) 60%, rgba(18,10,31,0) 100%)",
        }}
      />
    </div>
  );
}
