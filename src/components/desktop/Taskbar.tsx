"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Tamagotchi from "./Tamagotchi";

const PAGE_TITLES: Record<string, string> = {
  "/": "Desktop",
  "/work": "Work",
  "/cv": "CV",
  "/contact": "Contact",
  "/about": "About",
};

function resolveTitle(pathname: string): string {
  if (pathname.startsWith("/work/")) return "Work";
  return PAGE_TITLES[pathname] ?? "Desktop";
}

export default function Taskbar() {
  const pathname = usePathname();
  const [time, setTime] = useState<string>(() => formatNow());
  const [petOpen, setPetOpen] = useState(false);
  const petRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setTime(formatNow()), 1000 * 15);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!petOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!petRootRef.current) return;
      if (!petRootRef.current.contains(e.target as Node)) setPetOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPetOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [petOpen]);

  const activeTitle = resolveTitle(pathname);
  const isHome = pathname === "/";

  return (
    <footer
      className="plum-outset fixed inset-x-0 bottom-0 z-[70] flex h-11 items-center gap-2 bg-plum px-1.5"
      role="contentinfo"
    >
      <Link
        href="/"
        className="plum-outset flex h-8 items-center gap-1.5 bg-plum px-2 font-pixel text-lg leading-none text-code-text hover:bg-plum-light"
      >
        <span className="inline-block size-4 bg-mint pixelated" aria-hidden />
        ML
      </Link>

      <div className="mx-1 h-6 w-0.5 bg-plum-dark" aria-hidden />

      {!isHome && (
        <div
          className="plum-inset flex h-8 items-center gap-2 bg-code-gutter px-2 font-pixel text-lg leading-none text-code-text"
          aria-current="page"
        >
          <span className="inline-block size-3 bg-sun pixelated" aria-hidden />
          {activeTitle}.app
        </div>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        <div className="plum-inset hidden h-7 items-center gap-1.5 bg-code-gutter px-2 font-pixel text-base leading-none text-code-text sm:flex">
          <span aria-hidden>♪</span>
          <span aria-hidden>⬓</span>
          <span aria-hidden>⚑</span>
        </div>

        <div ref={petRootRef} className="relative">
          <button
            type="button"
            onClick={() => setPetOpen((v) => !v)}
            aria-expanded={petOpen}
            aria-haspopup="dialog"
            aria-label="Open pixel pet"
            className={`${
              petOpen ? "plum-inset" : "plum-outset"
            } flex h-9 items-center gap-1.5 bg-plum px-3 font-pixel leading-none text-code-text hover:bg-plum-light/40`}
          >
            <span aria-hidden className="text-xl leading-none text-[#efb3c3]">
              ♥
            </span>
            <span className="text-base uppercase tracking-widest">PET</span>
          </button>
          <Tamagotchi open={petOpen} />
        </div>

        <div
          className="plum-inset flex h-7 items-center bg-code-gutter px-2 font-pixel text-lg leading-none text-code-text tabular-nums"
          aria-label="current time"
        >
          {time}
        </div>
      </div>
    </footer>
  );
}

function formatNow(): string {
  const d = new Date();
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}
