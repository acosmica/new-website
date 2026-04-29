"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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

  const [filterOpen, setFilterOpen] = useState(false);

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
          detail view has a clean single-bar chrome. On mobile, chips are
          collapsed behind a Filter dropdown that the visitor opens at will. */}
      {!isDetailView && (
      <div className="plum-inset border-t border-plum-dark/60 bg-code-gutter font-pixel text-code-text">
        {/* Mobile-only toggle */}
        <div className="px-3 py-2 md:hidden">
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            aria-expanded={filterOpen}
            aria-controls="work-filter-panel"
            className={`${
              filterOpen ? "plum-inset" : "plum-outset"
            } flex w-full items-center justify-between bg-plum px-3 py-2 font-pixel text-base leading-none text-code-text shadow-[3px_3px_0_rgba(0,0,0,0.4)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none`}
          >
            <span className="flex items-center gap-2 uppercase tracking-wider">
              Filter
              {selected.size > 0 && (
                <span className="plum-outset bg-mauve px-1.5 py-0.5 text-xs leading-none text-ink">
                  {selected.size}
                </span>
              )}
            </span>
            <span
              aria-hidden
              className="text-lg leading-none text-blush transition-transform duration-150"
              style={{ transform: filterOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ▾
            </span>
          </button>
        </div>

        <div
          id="work-filter-panel"
          className={`flex-wrap items-center gap-2 px-3 pb-2 md:flex md:py-2 ${
            filterOpen ? "flex" : "hidden md:flex"
          }`}
        >
        <span className="hidden font-pixel text-sm uppercase leading-none tracking-wider text-code-text/60 md:inline">
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
              style={
                active
                  ? {
                      background: `linear-gradient(135deg, ${c} 0%, rgba(255,255,255,0.15) 100%), ${c}`,
                      borderColor: c,
                      color: "#1a1a1a",
                    }
                  : { borderColor: `${c}80` }
              }
              className={`flex items-center gap-1.5 rounded-full border font-pixel text-base leading-none transition-colors px-3 py-1 ${
                active
                  ? ""
                  : "bg-plum/30 text-code-text/85 hover:bg-plum-light/30"
              }`}
            >
              <span
                aria-hidden
                className="inline-block size-2 shrink-0 rounded-full"
                style={{ background: c }}
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
      </div>
      )}
    </>
  );
}

