"use client";

import type { Experiment } from "@/lib/experiments";

const PHOSPHOR = "#f2c9a8";
const ACCENT = "#ff7eb6";
const SOFT = "#ead9a0";
const DIM = "#9d8aa8";

export default function PlayerPlaylist({
  experiments,
  activeIndex,
  onSelect,
}: {
  experiments: Experiment[];
  activeIndex: number | null;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{
        borderRadius: "12px",
        background:
          "linear-gradient(180deg, #150924 0%, #0f0719 60%, #0a0511 100%)",
        boxShadow:
          "inset 0 0 0 2px #1a0f2c, inset 0 0 0 4px #6a4f7e, inset 0 0 24px rgba(242,201,168,0.10), 0 0 0 1px rgba(0,0,0,0.6)",
      }}
    >
      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between border-b border-white/10 px-4 py-2.5"
        style={{
          background:
            "linear-gradient(180deg, rgba(58,39,80,0.6) 0%, rgba(31,18,56,0.4) 100%)",
        }}
      >
        <span
          className="font-mono text-[13px] uppercase tracking-[0.28em]"
          style={{ color: PHOSPHOR, textShadow: "0 0 6px rgba(242,201,168,0.7)" }}
        >
          ▣ Playlist
        </span>
        <span
          className="font-mono text-[12px] uppercase tracking-[0.2em]"
          style={{ color: ACCENT }}
        >
          {experiments.length} tracks
        </span>
      </div>

      {/* Track list */}
      <ul className="relative z-10 flex-1 overflow-y-auto px-2 py-2">
        {experiments.map((e, i) => {
          const active = i === activeIndex;
          return (
            <li key={e.slug}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                className="group relative block w-full overflow-hidden text-left outline-none focus-visible:[box-shadow:inset_0_0_0_2px_#ff7eb6]"
                style={{
                  borderRadius: "8px",
                  margin: "2px 0",
                  padding: "9px 12px 9px 16px",
                  background: active
                    ? "linear-gradient(135deg, rgba(255,126,182,0.18) 0%, rgba(90,46,114,0.35) 100%)"
                    : "transparent",
                  boxShadow: active
                    ? "inset 0 0 0 1px rgba(255,126,182,0.45), inset 0 0 14px rgba(242,201,168,0.10)"
                    : "inset 0 0 0 1px rgba(255,255,255,0.04)",
                  transition: "background 160ms ease, box-shadow 160ms ease",
                }}
              >
                {/* Side stripe — accent indicator */}
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-full"
                  style={{
                    width: "3px",
                    background: active
                      ? "linear-gradient(180deg, #ff7eb6 0%, #f2c9a8 100%)"
                      : "transparent",
                    boxShadow: active ? "0 0 8px #ff7eb6" : undefined,
                  }}
                />

                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-2 truncate">
                    <span
                      className="font-mono text-[12px] tabular-nums"
                      style={{
                        color: active ? PHOSPHOR : DIM,
                        textShadow: active ? "0 0 4px rgba(242,201,168,0.7)" : undefined,
                        opacity: active ? 1 : 0.85,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="truncate font-mono text-[14px] uppercase tracking-[0.1em]"
                      style={{
                        color: active ? "#ffffff" : PHOSPHOR,
                        textShadow: active
                          ? "0 0 6px rgba(255,126,182,0.55)"
                          : "0 0 4px rgba(242,201,168,0.35)",
                      }}
                    >
                      {e.title}
                    </span>
                  </div>
                </div>
                {e.tags[0] && (
                  <p
                    className="mt-0.5 truncate font-mono text-[12px] uppercase tracking-[0.18em]"
                    style={{
                      color: active ? SOFT : DIM,
                      opacity: active ? 0.9 : 0.55,
                    }}
                  >
                    {e.tags.slice(0, 3).join(" · ")}
                  </p>
                )}
              </button>
            </li>
          );
        })}
      </ul>

    </div>
  );
}

