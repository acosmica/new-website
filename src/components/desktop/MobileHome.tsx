"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const APPS = [
  { href: "/work", label: "Work", emoji: "📁", bg: "bg-peach", id: "folder-work" },
  { href: "/experiments", label: "Experiments", emoji: "▶", bg: "bg-blush", id: "folder-experiments" },
  { href: "/gatherings", label: "Gatherings", emoji: "✨", bg: "bg-mauve", id: "folder-gatherings" },
  { href: "/cv", label: "CV", emoji: "📄", bg: "bg-mint", id: "folder-cv" },
  { href: "/contact", label: "Contact", emoji: "✉", bg: "bg-sun", id: "folder-contact" },
  { href: "/about", label: "About", emoji: "✦", bg: "bg-blush", id: "folder-about" },
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
    <div
      className="relative flex h-[100dvh] w-full flex-col overflow-hidden pb-12 md:hidden"
      style={{
        backgroundColor: "#2a1f2e",
        backgroundImage:
          "linear-gradient(180deg, rgba(18,10,31,0.55) 0%, rgba(18,10,31,0.15) 30%, rgba(18,10,31,0.15) 70%, rgba(18,10,31,0.7) 100%), url(/bg/acosmica.jpg)",
        backgroundSize: "cover, cover",
        backgroundPosition: "center, 75% center",
        backgroundRepeat: "no-repeat, no-repeat",
      }}
    >

      {/* Intro */}
      <div className="px-6 pt-12 text-white">
        <div className="font-dreamer text-7xl italic leading-none tracking-wide">
          hi!
        </div>
        <div className="mt-5 font-dreamer text-4xl leading-snug tracking-wide">
          I'm Micaelle
          <br />
          <span className="italic text-blush">a multimedia designer</span>
          <br />
          <span className="italic text-blush">&amp; creative technologist</span>
        </div>
      </div>

      {/* App grid */}
      <div className="mt-auto grid grid-cols-3 gap-5 px-6 pb-10 pt-8">
        {APPS.map((app) => (
          <Link
            key={app.href}
            href={app.href}
            className="flex flex-col items-center gap-2"
            prefetch
          >
            <motion.div
              whileTap={{ scale: 0.92 }}
              className={`pixel-outset grid size-16 place-items-center text-2xl ${app.bg}`}
            >
              {app.emoji}
            </motion.div>
            <span className="text-center font-pixel text-sm leading-none text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.9)]">
              {app.label}
            </span>
          </Link>
        ))}
      </div>

    </div>
  );
}
