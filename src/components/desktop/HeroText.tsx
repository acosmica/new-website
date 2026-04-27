"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type PhraseDef = {
  text: string;
  typeSpeed: number;
  holdMs: number;
  fadeMs: number;
};

const PHRASES: PhraseDef[] = [
  { text: "hi", typeSpeed: 180, holdMs: 1100, fadeMs: 560 },
  { text: "I'm Mica!", typeSpeed: 140, holdMs: 1200, fadeMs: 560 },
  { text: "I am a multimedia artist", typeSpeed: 95, holdMs: 1400, fadeMs: 560 },
  { text: "creative technologist", typeSpeed: 105, holdMs: 1400, fadeMs: 560 },
  { text: "welcome to my portfolio", typeSpeed: 110, holdMs: 1700, fadeMs: 560 },
];

/** Pause before restarting the cycle so the loop doesn't feel abrupt. */
const LOOP_GAP_MS = 1800;

/**
 * Hero text rotates in 3D to match the galaxy-cluster camera. Mouse-X drives
 * yaw, mouse-Y drives pitch. Scaled down from the camera's 126° orbit so the
 * text stays readable at the extremes.
 */
const HERO_MAX_YAW_DEG = 85;
const HERO_MAX_PITCH_DEG = 45;
const HERO_MAX_TRANSLATE_Z = 140;
const HERO_MAX_TRANSLATE_X = 70;
const HERO_MAX_TRANSLATE_Y = 42;

export default function HeroText() {
  // One phrase is visible at a time. `cycleKey` advances per phrase so
  // AnimatePresence can exit the outgoing one fully before the next mounts
  // — no more "rewriting on top" ghost overlap.
  const [idx, setIdx] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  const advance = () => {
    setIdx((current) => {
      const next = current + 1;
      if (next >= PHRASES.length) {
        // Loop back after a short breath.
        window.setTimeout(() => {
          setIdx(0);
          setCycleKey((k) => k + 1);
        }, LOOP_GAP_MS);
        return current;
      }
      return next;
    });
    setCycleKey((k) => k + 1);
  };

  const rotatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let tx = 0, ty = 0;
    let cx = 0, cy = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const apply = (cxv: number, cyv: number) => {
      if (!rotatorRef.current) return;
      // Mouse-right → camera orbits right → the hero plane at origin
      // appears turned to expose its left face: negative rotateY in CSS.
      const yaw = -cxv * HERO_MAX_YAW_DEG;
      const pitch = cyv * HERO_MAX_PITCH_DEG;
      const px = cxv * HERO_MAX_TRANSLATE_X;
      const py = cyv * HERO_MAX_TRANSLATE_Y;
      const pz = -Math.abs(cxv) * HERO_MAX_TRANSLATE_Z;
      // Keep the -50% centering baked in so we can own the full transform.
      rotatorRef.current.style.transform =
        `translate(-50%, -50%) translate3d(${px}px, ${py}px, ${pz}px) rotateY(${yaw}deg) rotateX(${pitch}deg)`;
    };

    if (reduce) {
      apply(0, 0);
      return;
    }

    const tick = () => {
      // Match the scene's lerp so text + cluster drift together.
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      apply(cx, cy);
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
    // Outer: perspective container. No transform of its own — the rotator
    // owns the full transform stack (position + 3D), preventing CSS from
    // collapsing the 3D space.
    <div
      className="pointer-events-none absolute inset-0 z-20 select-none"
      style={{
        perspective: "1100px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        ref={rotatorRef}
        className="absolute left-1/2 top-1/2 w-[min(70rem,80%)] will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          // Start centered — the rAF loop will overwrite this immediately.
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="relative flex min-h-[30vh] items-center justify-center">
          <AnimatePresence mode="wait">
            <Phrase key={cycleKey} def={PHRASES[idx]} onDone={advance} />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Phrase({
  def,
  onDone,
}: {
  def: PhraseDef;
  onDone: () => void;
}) {
  const [chars, setChars] = useState(0);
  const triggered = useRef(false);
  const cb = useRef(onDone);
  cb.current = onDone;

  useEffect(() => {
    if (chars >= def.text.length) return;
    const id = setTimeout(() => setChars((c) => c + 1), def.typeSpeed);
    return () => clearTimeout(id);
  }, [chars, def.text.length, def.typeSpeed]);

  useEffect(() => {
    if (chars < def.text.length || triggered.current) return;
    triggered.current = true;
    const id = setTimeout(() => cb.current(), def.holdMs);
    return () => clearTimeout(id);
  }, [chars, def.text.length, def.holdMs]);

  const visible = def.text.slice(0, chars);
  const isTyping = chars < def.text.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: def.fadeMs / 1000, ease: "easeOut" }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div
        className="relative max-w-[90%]"
        style={{ filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.3))" }}
      >
        {/* Base layer — Dreamer TM regular, WHITE, generous spacing */}
        <div
          className="hero-line relative font-dreamer leading-[1.05] text-white text-[clamp(2.25rem,6.5vw,5.75rem)] text-center"
          style={{ letterSpacing: "0.04em", fontWeight: 400 }}
        >
          <span>{visible}</span>
          {isTyping && (
            <span
              aria-hidden
              className="ml-1 inline-block w-[0.06em] bg-white align-baseline"
              style={{
                height: "0.82em",
                animation: "caret-blink 1s step-end infinite",
              }}
            />
          )}
        </div>

        {/* Halftone overlay — colour cycles through the wallpaper palette */}
        <div
          aria-hidden
          className="hero-line dither-halftone pointer-events-none absolute inset-0 font-dreamer leading-[1.05] text-[clamp(2.25rem,6.5vw,5.75rem)] text-center"
          style={{
            letterSpacing: "0.04em",
            fontWeight: 400,
            transform: "translate(12px, 9px)",
          }}
        >
          {visible}
        </div>

        {/* Secondary skewed halftone sliver */}
        <div
          aria-hidden
          className="hero-line dither-halftone pointer-events-none absolute inset-0 font-dreamer leading-[1.05] text-[clamp(2.25rem,6.5vw,5.75rem)] text-center opacity-55"
          style={{
            letterSpacing: "0.04em",
            fontWeight: 400,
            transform: "skew(-8deg) translate(18px, 4px)",
            animationDelay: "-6s",
          }}
        >
          {visible}
        </div>
      </div>
    </motion.div>
  );
}
