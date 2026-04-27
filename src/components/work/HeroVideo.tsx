"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  src: string;
  poster?: string;
};

/**
 * Hero video used on project detail pages. Renders as a background-style
 * autoplaying loop and, when clicked, opens a fullscreen lightbox that
 * plays the same video without any of the title/summary overlay text.
 */
export default function HeroVideo({ src, poster }: Props) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        aria-label="Play video"
        onClick={() => setOpen(true)}
        className="absolute inset-0 block h-full w-full cursor-zoom-in p-0"
      >
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Project video"
          className="fixed inset-0 z-[90] grid place-items-center p-4 md:p-8"
        >
          <button
            type="button"
            aria-label="Close video"
            onClick={close}
            className="fixed inset-0 cursor-zoom-out bg-plum-dark/95 backdrop-blur-xl"
          />
          <div className="relative z-10 w-full max-w-[110rem]">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={src}
              autoPlay
              loop
              playsInline
              controls
              poster={poster}
              className="max-h-[90dvh] w-full object-contain plum-outset bg-plum-dark"
            />
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute -top-3 -right-3 grid size-8 place-items-center plum-outset bg-hot font-pixel text-base leading-none text-paper active:[box-shadow:inset_1px_1px_0_0_#000,inset_-1px_-1px_0_0_rgba(234,217,232,0.6)]"
            >
              <span className="-mt-0.5">✕</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
