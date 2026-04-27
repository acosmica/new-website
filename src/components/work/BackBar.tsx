"use client";

import { useRouter } from "next/navigation";

/**
 * Sticky bar at the top of a project detail page with a "← Back" action.
 * Uses router.back() when there's history (e.g. came from /work via the
 * intercepted modal), and falls back to a hard /work push when the page
 * was opened directly (typed URL / refresh).
 */
export default function BackBar() {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/work");
    }
  };

  return (
    <div className="plum-inset sticky top-0 z-30 flex h-9 items-center gap-3 bg-code-gutter px-3 font-pixel text-base text-code-text">
      <button
        type="button"
        onClick={goBack}
        aria-label="Back to work"
        className="plum-outset bg-plum px-2 py-0.5 text-code-text hover:bg-plum-light/50"
      >
        ← Back
      </button>
    </div>
  );
}
