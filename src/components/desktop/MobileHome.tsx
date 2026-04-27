"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const APPS = [
  { href: "/work", label: "Work", emoji: "📁", bg: "bg-peach", id: "folder-work" },
  { href: "/cv", label: "CV", emoji: "📄", bg: "bg-mint", id: "folder-cv" },
  { href: "/contact", label: "Contact", emoji: "✉", bg: "bg-blush", id: "folder-contact" },
  { href: "/about", label: "About", emoji: "✦", bg: "bg-mauve", id: "folder-about" },
];

export default function MobileHome() {
  const [time, setTime] = useState("—");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        `${d.getHours().toString().padStart(2, "0")}:${d
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      );
    };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex h-[100dvh] w-full flex-col md:hidden">
      {/* Wallpaper backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-desktop via-accent to-desktop-deep"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 desktop-dither opacity-40"
      />

      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pt-3 font-pixel text-base text-white">
        <span>{time}</span>
        <span className="flex items-center gap-1.5 text-sm">
          <span>5G</span>
          <span>●●●●</span>
          <span>82%</span>
        </span>
      </div>

      {/* Intro scribbles */}
      <div className="px-6 pt-10 font-hand text-white">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl leading-none"
          style={{ transform: "rotate(-4deg)" }}
        >
          hi!
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-2xl leading-tight"
        >
          i'm Micaelle —
          <br />a multimedia designer
        </motion.div>
      </div>

      {/* App grid */}
      <div className="mt-auto grid grid-cols-2 gap-6 p-10">
        {APPS.map((app, i) => (
          <motion.div
            key={app.href}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.08, type: "spring" }}
          >
            <Link
              href={app.href}
              className="flex flex-col items-center gap-2"
              prefetch
            >
              <motion.div
                layoutId={app.id}
                whileTap={{ scale: 0.92 }}
                className={`pixel-outset grid size-20 place-items-center text-3xl ${app.bg}`}
              >
                {app.emoji}
              </motion.div>
              <span className="font-pixel text-base leading-none text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.9)]">
                {app.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Home indicator */}
      <div className="mx-auto mb-3 h-1 w-24 rounded-full bg-white/60" />
    </div>
  );
}
