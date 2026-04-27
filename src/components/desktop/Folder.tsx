"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export type FolderAccent = "peach" | "blush" | "mauve" | "mint" | "seafoam" | "goldlite";

type FolderProps = {
  /** Route to navigate to. Omit when using onClick. */
  href?: string;
  /** Click handler. When provided, renders as a button instead of a link
   *  so the folder can trigger in-page behavior (e.g. a modal). */
  onClick?: () => void;
  label: string;
  accent?: FolderAccent;
  layoutId?: string;
};

const TAB_BG: Record<FolderAccent, string> = {
  peach: "bg-peach",
  blush: "bg-blush",
  mauve: "bg-mauve",
  mint: "bg-mint",
  seafoam: "bg-seafoam",
  goldlite: "bg-goldlite",
};

/**
 * Chunky skeuomorphic folder icon. Hover jiggles, click routes.
 * Tab colour is sampled from the wallpaper palette so the UI blends
 * into the dreamy backdrop instead of clashing.
 */
export default function Folder({
  href,
  onClick,
  label,
  accent = "peach",
  layoutId,
}: FolderProps) {
  const visual = (
    <>
      <motion.div
        layoutId={layoutId}
        whileHover={{ y: -4, rotate: -2 }}
        whileTap={{ scale: 0.95, rotate: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        className="relative"
      >
        <div
          className={`h-3 w-10 rounded-t-[2px] ${TAB_BG[accent]} pixelated plum-outset`}
        />
        <div className="plum-outset -mt-0.5 grid h-14 w-20 place-items-center bg-plum pixelated">
          <div className="h-1 w-10 bg-plum-light" aria-hidden />
        </div>
        <div
          className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            boxShadow: "0 0 0 2px rgba(255,255,255,0.8)",
          }}
        />
      </motion.div>
      <span
        className="mt-1 rounded-sm px-1.5 py-0.5 font-pixel text-2xl leading-none text-white group-hover:bg-accent group-focus-visible:bg-accent"
        style={{
          textShadow:
            "1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000, 2px 2px 0 rgba(0,0,0,0.9)",
        }}
      >
        {label}
      </span>
    </>
  );

  const sharedCls = "group flex w-20 flex-col items-center gap-1 focus:outline-none";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Open ${label} folder`}
        className={sharedCls}
      >
        {visual}
      </button>
    );
  }

  return (
    <Link
      href={href ?? "/"}
      prefetch
      aria-label={`Open ${label} folder`}
      className={sharedCls}
    >
      {visual}
    </Link>
  );
}
