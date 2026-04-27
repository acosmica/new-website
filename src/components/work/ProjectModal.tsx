"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, type ReactNode } from "react";
import BackBar from "./BackBar";

/**
 * Modal wrapper rendered by the /work/@modal/(.)[slug] intercepting
 * route. Closing the modal calls `router.back()` so the browser
 * history stays coherent (back/forward still work).
 */
export default function ProjectModal({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const router = useRouter();

  const close = useCallback(() => router.back(), [router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    // Lock underlying scroll while modal is open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [close]);

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center p-3 pb-16 md:p-5 md:pb-16"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop — fully opaque plum-dark with heavy blur so the work
          grid underneath is not visible/distracting. */}
      <button
        type="button"
        aria-label="Close project window"
        onClick={close}
        className="fixed inset-0 cursor-default bg-plum-dark/95 backdrop-blur-xl"
      />

      {/* Window chrome — matches the /work page's Window width
          (max-w-[96rem]) so the detail view fills the same footprint. */}
      <div className="relative z-10 flex h-full w-full max-w-[96rem] flex-col overflow-hidden plum-outset bg-plum">
        {/* Title bar — matches the desktop Window component visually */}
        <div
          className="flex h-9 shrink-0 items-center gap-2 px-1.5 text-code-text"
          style={{
            background:
              "linear-gradient(90deg, var(--color-code-title-from) 0%, var(--color-code-title-to) 100%)",
          }}
        >
          <span
            aria-hidden
            className="inline-block size-4 plum-outset bg-mauve pixelated"
          />
          <div className="flex min-w-0 flex-1 items-baseline gap-2 font-pixel text-lg leading-none">
            <span className="truncate">{title}</span>
            <span className="truncate text-base opacity-75">— project.mdx</span>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="grid size-6 place-items-center plum-outset bg-hot font-pixel text-base leading-none text-paper active:[box-shadow:inset_1px_1px_0_0_#000,inset_-1px_-1px_0_0_rgba(234,217,232,0.6)]"
          >
            <span className="-mt-0.5">✕</span>
          </button>
        </div>

        {/* Body — the project view scrolls within. BackBar is the first
            child so its sticky top-0 follows the user down the scroll. */}
        <div className="flex-1 overflow-y-auto">
          <BackBar />
          {children}
        </div>
      </div>
    </div>
  );
}
