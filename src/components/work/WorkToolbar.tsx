"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { tagColor } from "@/lib/tagColors";

type Props = { allTags: string[] };

/**
 * Toolbar for /work — back button + tag filter buttons. Filter state lives
 * in the URL as `?tags=A,B,C` so the sidebar and any future consumer can
 * subscribe via useSearchParams() without a shared React context.
 * AND semantics: a project must carry every selected tag.
 */
export default function WorkToolbar({ allTags }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = useMemo(() => {
    const raw = searchParams.get("tags") ?? "";
    return new Set(raw.split(",").filter(Boolean));
  }, [searchParams]);

  // When the URL is /work/<slug> — either because the user opened a
  // project in the modal (intercepting route) or via direct deep-link —
  // the filter panel is hidden and the Back button points one step back
  // (to /work, preserving any active tag filters) instead of all the way
  // home.
  const isDetailView = pathname !== "/work";

  const backHref = useMemo(() => {
    if (!isDetailView) return "/";
    const qs = searchParams.toString();
    return qs ? `/work?${qs}` : "/work";
  }, [isDetailView, searchParams]);

  const writeTags = useCallback(
    (next: Set<string>) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.size === 0) params.delete("tags");
      else params.set("tags", Array.from(next).join(","));
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const toggle = (tag: string) => {
    const next = new Set(selected);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    writeTags(next);
  };

  const clear = () => writeTags(new Set());

  return (
    <>
      {/* Row 1 — Back button. One step back: /work → /, /work/[slug] → /work. */}
      <div className="plum-inset flex h-9 items-center gap-3 bg-code-gutter px-3 font-pixel text-base text-code-text">
        <Link
          href={backHref}
          prefetch
          className="plum-outset bg-plum px-2 py-0.5 text-code-text hover:bg-plum-light/50"
          aria-label={isDetailView ? "Back to projects" : "Back to desktop"}
        >
          ← Back
        </Link>
      </div>

      {/* Row 2 — tag filter bar. Hidden while viewing a project so the
          detail view has a clean single-bar chrome. */}
      {!isDetailView && (
      <div className="plum-inset flex flex-wrap items-center gap-2 border-t border-plum-dark/60 bg-code-gutter px-3 py-2 font-pixel text-code-text">
        <span className="font-pixel text-sm uppercase leading-none tracking-wider text-code-text/60">
          Filter ▸
        </span>

        {allTags.map((tag) => {
          const active = selected.has(tag);
          const c = tagColor(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              aria-pressed={active}
              style={active ? { background: c, color: "#1a1a1a" } : undefined}
              className={`flex items-center gap-1.5 font-pixel text-base leading-none transition-colors ${
                active
                  ? "plum-inset px-3 py-1.5"
                  : "plum-outset bg-plum px-3 py-1.5 text-code-text hover:bg-plum-light/50"
              }`}
            >
              <span
                aria-hidden
                className="inline-block size-2.5 shrink-0"
                style={{
                  background: c,
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.35)",
                }}
              />
              {tag}
            </button>
          );
        })}

        {selected.size > 0 && (
          <button
            type="button"
            onClick={clear}
            className="ml-auto plum-outset bg-hot px-2.5 py-1 font-pixel text-sm leading-none text-paper hover:bg-hot/80"
          >
            clear ✕
          </button>
        )}
      </div>
      )}
    </>
  );
}

