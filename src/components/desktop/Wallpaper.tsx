"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const Scene3D = dynamic(() => import("./three/Scene3D"), {
  ssr: false,
  loading: () => null,
});

/**
 * Immersive wallpaper:
 *   layer 1  — the acosmica portrait, blurred + blended into the gradient
 *   layer 2  — painterly pink/peach/mint wash to unify the palette
 *   layer 3  — 3D canvas (floating LEDs, pointers, glitches)
 *
 * Backdrop layers also receive subtle mouse-parallax so the whole page
 * responds to pointer position, pairing with the in-canvas 360° camera.
 */
export default function Wallpaper() {
  const portraitRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let px = 0, py = 0, tx = 0, ty = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    const tick = () => {
      px += (tx - px) * 0.06;
      py += (ty - py) * 0.06;
      if (portraitRef.current) {
        portraitRef.current.style.transform =
          `translate3d(${-px * 80}px, ${-py * 55}px, 0) scale(1.28)`;
      }
      if (washRef.current) {
        washRef.current.style.transform =
          `translate3d(${-px * 35}px, ${-py * 24}px, 0) scale(1.14)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#2a1f2e]">
      {/* Reference portrait — blended painterly backdrop */}
      <div
        ref={portraitRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: "url(/bg/acosmica.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(6px) saturate(1.05) contrast(1.02)",
          transform: "scale(1.28)",
        }}
      />
      {/* Painterly colour wash — unifies palette with 3D scene */}
      <div
        ref={washRef}
        className="absolute inset-0 mix-blend-soft-light will-change-transform"
        style={{
          background:
            "radial-gradient(120% 80% at 70% 40%, rgba(248,225,197,0.7) 0%, rgba(242,196,209,0.55) 35%, rgba(201,169,198,0.4) 62%, rgba(142,216,198,0.35) 100%)",
          transform: "scale(1.1)",
        }}
      />
      {/* Turquoise coral blotches — echoes the image's oxidized patches */}
      <div
        className="absolute inset-0 opacity-35 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(142,216,198,0.55) 0%, transparent 18%)," +
            "radial-gradient(circle at 80% 70%, rgba(232,180,216,0.45) 0%, transparent 22%)," +
            "radial-gradient(circle at 50% 90%, rgba(245,233,181,0.4) 0%, transparent 25%)",
        }}
      />
      {/* Warm dusk vignette for cinematic depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(42,31,46,0.55) 100%)",
        }}
      />

      <div className="absolute inset-0">
        <Scene3D />
      </div>
    </div>
  );
}
