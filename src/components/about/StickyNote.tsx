"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  color?: "sun" | "lime" | "hot" | "paper" | "mauve" | "blush" | "mint";
  rotate?: number;
  style?: CSSProperties;
  children: ReactNode;
  width?: number;
};

const BG: Record<NonNullable<Props["color"]>, string> = {
  sun: "bg-sun",
  lime: "bg-lime",
  hot: "bg-hot text-paper",
  paper: "bg-paper",
  mauve: "bg-mauve",
  blush: "bg-blush",
  mint: "bg-mint",
};

export default function StickyNote({
  color = "sun",
  rotate = 0,
  style,
  children,
  width = 220,
}: Props) {
  return (
    <motion.div
      whileHover={{ rotate: rotate + 0.5, y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`note-shadow absolute select-none p-4 font-hand text-[22px] leading-tight text-ink ${BG[color]}`}
      style={{ width, transform: `rotate(${rotate}deg)`, ...style }}
    >
      {children}
    </motion.div>
  );
}
