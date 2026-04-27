"use client";

import { useEffect, useState } from "react";

const BAR_COUNT = 22;

/**
 * Y2K visualizer bars. When `playing` is true, bars animate at random
 * heights on a 120ms tick. When idle, bars sit at a low resting height
 * with a gentle sine wobble so the LCD never feels dead. Palette runs
 * plum → magenta → peach to match the rest of the site.
 */
export default function PlayerEqualizer({ playing }: { playing: boolean }) {
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: BAR_COUNT }, () => 0.18),
  );

  useEffect(() => {
    if (!playing) {
      let t = 0;
      const id = window.setInterval(() => {
        t += 1;
        setHeights(
          Array.from({ length: BAR_COUNT }, (_, i) =>
            0.16 + 0.06 * Math.sin((i + t) * 0.5),
          ),
        );
      }, 220);
      return () => window.clearInterval(id);
    }
    const id = window.setInterval(() => {
      setHeights(
        Array.from({ length: BAR_COUNT }, () => 0.25 + Math.random() * 0.7),
      );
    }, 120);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <div className="flex h-full w-full items-end gap-[3px]">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-[1px]"
          style={{
            height: `${h * 100}%`,
            background:
              "linear-gradient(180deg, #ff7eb6 0%, #c9a5d4 30%, #f2c9a8 55%, #ead9a0 80%, #5a3e7a 100%)",
            boxShadow:
              "0 0 4px rgba(239,179,195,0.55), inset 0 0 0 1px rgba(255,255,255,0.18)",
            transition: "height 80ms linear",
          }}
        />
      ))}
    </div>
  );
}
