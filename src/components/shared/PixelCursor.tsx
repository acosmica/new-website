"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Chunky pixel cursor that replaces the native cursor on desktop.
 * A short trail of fading clones follows the main cursor. The home
 * route gets the dramatic big/glowy variant; every other route uses
 * the original smaller, calmer cursor.
 */
export default function PixelCursor() {
  const mainRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [enabled, setEnabled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

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
        const headSize = isHome ? 22 : 14;
        const tailReduction = isHome ? 14 : 9;
        const size = headSize - t * tailReduction;
        const opacity = (isHome ? 0.85 : 0.75) * (1 - t);
        return (
          <div
            key={i}
            ref={(el) => {
              trailRefs.current[i] = el;
            }}
            className="pointer-events-none absolute top-0 left-0 rounded-[3px] bg-mauve"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              boxShadow: isHome
                ? "0 0 12px rgba(201,165,212,1), 0 0 24px rgba(255,126,182,0.7), 0 0 40px rgba(255,126,182,0.4)"
                : "0 0 8px rgba(201,165,212,0.9), 0 0 16px rgba(201,165,212,0.55)",
            }}
          />
        );
      })}
      <div
        ref={mainRef}
        className="pointer-events-none absolute top-0 left-0 will-change-transform"
      >
        <CursorArrow big={isHome} />
      </div>
    </div>
  );
}

function CursorArrow({ big }: { big: boolean }) {
  // 8-bit style arrow. `big` mode (home page only) is dramatically
  // larger with a triple-stack glow; otherwise renders the original
  // small/restrained variant used on the rest of the site.
  return (
    <svg
      width={big ? 48 : 32}
      height={big ? 58 : 38}
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        shapeRendering: "crispEdges",
        filter: big
          ? "drop-shadow(0 0 6px rgba(255,249,214,1)) drop-shadow(0 0 14px rgba(201,165,212,0.95)) drop-shadow(0 0 28px rgba(255,126,182,0.7))"
          : "drop-shadow(0 0 4px rgba(201,165,212,0.95)) drop-shadow(0 0 10px rgba(201,165,212,0.6))",
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
