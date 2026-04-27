"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Chunky pixel cursor that replaces the native cursor on desktop.
 * A short trail of fading clones follows the main cursor.
 */
export default function PixelCursor() {
  const mainRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Skip on touch devices — no cursor to replace.
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (!hasHover) return;
    setEnabled(true);
    document.body.classList.add("pixel-cursor-active");

    const trail: { x: number; y: number }[] = Array(14)
      .fill(0)
      .map(() => ({ x: -40, y: -40 }));

    let targetX = -40;
    let targetY = -40;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    let raf = 0;
    const tick = () => {
      if (mainRef.current) {
        mainRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
      // Each trail dot eases toward the one in front of it. Lower easing
      // factor = longer, more noticeable trail that drifts behind the cursor.
      let prev = { x: targetX, y: targetY };
      for (let i = 0; i < trail.length; i++) {
        trail[i].x += (prev.x - trail[i].x) * 0.22;
        trail[i].y += (prev.y - trail[i].y) * 0.22;
        const el = trailRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${trail[i].x}px, ${trail[i].y}px, 0)`;
        }
        prev = trail[i];
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.body.classList.remove("pixel-cursor-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      {Array.from({ length: 14 }).map((_, i) => {
        const t = i / 13; // 0 (closest to cursor) → 1 (tail end)
        const size = 14 - t * 9; // 14px near head, ~5px at tail
        const opacity = 0.75 * (1 - t); // fades out smoothly
        return (
          <div
            key={i}
            ref={(el) => {
              trailRefs.current[i] = el;
            }}
            className="pointer-events-none absolute top-0 left-0 rounded-[2px] bg-mauve"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              boxShadow: "0 0 8px rgba(201,165,212,0.9), 0 0 16px rgba(201,165,212,0.55)",
            }}
          />
        );
      })}
      <div
        ref={mainRef}
        className="pointer-events-none absolute top-0 left-0 will-change-transform"
      >
        <CursorArrow />
      </div>
    </div>
  );
}

function CursorArrow() {
  // 8-bit style arrow — larger and brighter, with a sun-yellow glow so it
  // stays legible over the busy wallpaper and floating panels.
  return (
    <svg
      width="32"
      height="38"
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        shapeRendering: "crispEdges",
        filter:
          "drop-shadow(0 0 4px rgba(201,165,212,0.95)) drop-shadow(0 0 10px rgba(201,165,212,0.6))",
      }}
    >
      <path
        d="M2 2 L2 18 L6 14 L9 21 L12 20 L9 13 L16 13 Z"
        fill="#fff9d6"
        stroke="black"
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
