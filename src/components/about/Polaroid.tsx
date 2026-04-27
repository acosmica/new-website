"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

type Props = {
  caption?: string;
  color?: string;
  rotate?: number;
  style?: CSSProperties;
  children?: React.ReactNode;
};

export default function Polaroid({
  caption,
  color = "#f5c542",
  rotate = 0,
  style,
  children,
}: Props) {
  return (
    <motion.div
      whileHover={{ y: -6, rotate: 0, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="note-shadow absolute select-none"
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      {/* Thumbtack */}
      <span
        aria-hidden
        className="absolute left-1/2 -top-2 size-4 -translate-x-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, #fff 0%, ${color} 40%, ${color} 100%)`,
          boxShadow: "1px 1px 2px rgba(0,0,0,0.4)",
        }}
      />
      <div className="bg-paper p-2 pb-6">
        <div
          className="relative aspect-square w-40 overflow-hidden bg-gradient-to-br from-accent to-desktop"
        >
          {children}
        </div>
        {caption && (
          <div className="mt-2 text-center font-hand text-lg leading-none text-ink">
            {caption}
          </div>
        )}
      </div>
    </motion.div>
  );
}
