"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

type ScribbleProps = {
  text: string;
  color?: string;
  size?: number;
  rotate?: number;
  delay?: number;
  underline?: boolean;
  style?: CSSProperties;
  className?: string;
};

/**
 * A handwritten scribble that draws in on mount via a clip-path reveal,
 * then wobbles gently on idle. Uses the Caveat font for a marker-pen feel.
 */
export default function Scribble({
  text,
  color = "white",
  size = 64,
  rotate = 0,
  delay = 0,
  underline = false,
  style,
  className = "",
}: ScribbleProps) {
  return (
    <motion.div
      className={`font-hand scribble-idle pointer-events-none select-none ${className}`}
      style={
        {
          color,
          fontSize: size,
          lineHeight: 1,
          textShadow: "2px 2px 0 rgba(0,0,0,0.25)",
          // Passed into the keyframe animation so wobble respects rotation
          "--scribble-rot": `${rotate}deg`,
          transform: `rotate(${rotate}deg)`,
          ...style,
        } as CSSProperties
      }
      initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
      animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
      transition={{
        duration: text.length * 0.06 + 0.4,
        delay,
        ease: "easeOut",
      }}
    >
      <span style={{ display: "inline-block" }}>
        {text}
        {underline && (
          <svg
            aria-hidden
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
            width="100%"
            height="10"
            style={{ display: "block", marginTop: -6 }}
          >
            <path
              d="M2 8 Q 50 2, 100 6 T 198 5"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </motion.div>
  );
}
