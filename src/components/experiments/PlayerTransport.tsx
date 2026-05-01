"use client";

import { useEffect, useState } from "react";

type Glyph = "prev" | "play" | "pause" | "stop" | "next";

const PHOSPHOR = "#f2c9a8";
const ACCENT = "#ff7eb6";

export default function PlayerTransport({
  playing,
  onPlayPause,
  onStop,
  onPrev,
  onNext,
}: {
  playing: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [seek, setSeek] = useState(28);
  const [vol, setVol] = useState(72);

  const elapsedSec = Math.round((seek / 100) * 248);
  const totalSec = 248;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: "12px",
        background:
          "linear-gradient(180deg, #f0e7ee 0%, #d3c2d7 30%, #9d8aa8 70%, #5b4a72 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -2px 4px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.35), 0 0 0 1px rgba(0,0,0,0.6)",
      }}
    >
      <div className="flex h-[64px] items-center gap-4 px-4">
        {/* Left — readout + mini eq */}
        <div className="flex shrink-0 items-center gap-2">
          <Readout value={fmtTime(elapsedSec)} sub={fmtTime(totalSec)} color={PHOSPHOR} />
          <MiniEq playing={playing} />
        </div>

        {/* Center — transport buttons */}
        <div className="flex shrink-0 items-center gap-2">
          <ChromeBtn glyph="prev" onClick={onPrev} ariaLabel="Previous track" size={38} />
          <ChromeBtn
            glyph={playing ? "pause" : "play"}
            onClick={onPlayPause}
            ariaLabel={playing ? "Pause" : "Play"}
            size={48}
            primary
          />
          <ChromeBtn glyph="next" onClick={onNext} ariaLabel="Next track" size={38} />
          <ChromeBtn glyph="stop" onClick={onStop} ariaLabel="Stop" size={32} />
        </div>

        {/* Right — seek + knob */}
        <div className="flex flex-1 items-center gap-3">
          <Slider value={seek} onChange={setSeek} accent={PHOSPHOR} />
          <RotaryKnob value={vol} onChange={setVol} accent={ACCENT} />
        </div>
      </div>
    </div>
  );
}

function Readout({
  value,
  sub,
  color,
}: {
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div
      className="flex shrink-0 items-baseline gap-1.5 rounded-md px-2.5 py-1"
      style={{
        background: "linear-gradient(180deg, #150924 0%, #0a0511 100%)",
        boxShadow:
          "inset 0 1px 2px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1), 0 1px 0 rgba(255,255,255,0.5)",
      }}
    >
      <span
        className="font-mono tabular-nums"
        style={{
          color,
          textShadow: `0 0 6px ${color}aa`,
          fontSize: "15px",
          letterSpacing: "0.04em",
        }}
      >
        {value}
      </span>
      <span
        className="font-mono text-[12px] uppercase tracking-[0.18em]"
        style={{ color, opacity: 0.55 }}
      >
        / {sub}
      </span>
    </div>
  );
}

const MINI_BAR_COUNT = 5;

function MiniEq({ playing }: { playing: boolean }) {
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: MINI_BAR_COUNT }, () => 0.3),
  );

  useEffect(() => {
    if (!playing) {
      let t = 0;
      const id = window.setInterval(() => {
        t += 1;
        setHeights(
          Array.from(
            { length: MINI_BAR_COUNT },
            (_, i) => 0.22 + 0.08 * Math.sin((i + t) * 0.6),
          ),
        );
      }, 240);
      return () => window.clearInterval(id);
    }
    const id = window.setInterval(() => {
      setHeights(
        Array.from(
          { length: MINI_BAR_COUNT },
          () => 0.3 + Math.random() * 0.65,
        ),
      );
    }, 140);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <div
      className="flex h-[28px] w-[44px] items-end gap-[2px] rounded-md px-1.5 py-1"
      style={{
        background: "linear-gradient(180deg, #150924 0%, #0a0511 100%)",
        boxShadow:
          "inset 0 1px 2px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)",
      }}
    >
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-[1px]"
          style={{
            height: `${h * 100}%`,
            background:
              "linear-gradient(180deg, #ff7eb6 0%, #f2c9a8 60%, #ead9a0 100%)",
            boxShadow: "0 0 3px rgba(239,179,195,0.55)",
            transition: "height 80ms linear",
          }}
        />
      ))}
    </div>
  );
}

function ChromeBtn({
  glyph,
  onClick,
  ariaLabel,
  size,
  primary,
}: {
  glyph: Glyph;
  onClick: () => void;
  ariaLabel: string;
  size: number;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="group relative flex items-center justify-center outline-none"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "999px",
        background:
          "radial-gradient(circle at 35% 25%, #fafafd 0%, #d6cee0 35%, #8e7ea0 75%, #4a3858 100%)",
        boxShadow: primary
          ? "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -2px 3px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.6), 0 0 14px rgba(255,126,182,0.35)"
          : "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -2px 3px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.6)",
        transition: "transform 80ms ease",
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(1px)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
      }}
    >
      <Glyph glyph={glyph} primary={primary} size={size} />
    </button>
  );
}

function Glyph({
  glyph,
  primary,
  size,
}: {
  glyph: Glyph;
  primary?: boolean;
  size: number;
}) {
  const fill = primary ? ACCENT : "#1a0f2c";
  const filter = primary ? `drop-shadow(0 0 4px ${ACCENT}aa)` : undefined;
  const dim = Math.round(size * 0.42);

  switch (glyph) {
    case "prev":
      return (
        <svg width={dim} height={dim} viewBox="0 0 16 16" style={{ filter }}>
          <polygon points="14,2 6,8 14,14" fill={fill} />
          <rect x="3" y="2" width="2" height="12" fill={fill} />
        </svg>
      );
    case "next":
      return (
        <svg width={dim} height={dim} viewBox="0 0 16 16" style={{ filter }}>
          <polygon points="2,2 10,8 2,14" fill={fill} />
          <rect x="11" y="2" width="2" height="12" fill={fill} />
        </svg>
      );
    case "play":
      return (
        <svg width={dim} height={dim} viewBox="0 0 16 16" style={{ filter }}>
          <polygon points="3,2 14,8 3,14" fill={fill} />
        </svg>
      );
    case "pause":
      return (
        <svg width={dim} height={dim} viewBox="0 0 16 16" style={{ filter }}>
          <rect x="3" y="2" width="3.5" height="12" fill={fill} />
          <rect x="9.5" y="2" width="3.5" height="12" fill={fill} />
        </svg>
      );
    case "stop":
      return (
        <svg width={dim} height={dim} viewBox="0 0 16 16" style={{ filter }}>
          <rect x="3" y="3" width="10" height="10" fill={fill} />
        </svg>
      );
  }
}

function Slider({
  value,
  onChange,
  accent,
}: {
  value: number;
  onChange: (v: number) => void;
  accent: string;
}) {
  return (
    <div className="relative h-3 w-full">
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 rounded-full"
        style={{
          height: "5px",
          background: "linear-gradient(180deg, #2a1840 0%, #120a1f 100%)",
          boxShadow:
            "inset 0 1px 2px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.1), 0 1px 0 rgba(255,255,255,0.5)",
        }}
      />
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: `${value}%`,
          height: "5px",
          background: `linear-gradient(90deg, ${accent}aa 0%, ${accent} 100%)`,
          boxShadow: `0 0 8px ${accent}aa, inset 0 1px 0 rgba(255,255,255,0.45)`,
        }}
      />
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        aria-label="seek"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${value}%`,
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 25%, #ffffff 0%, #d8cce0 35%, #776a8c 75%, #2c1f40 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.85), 0 1px 2px rgba(0,0,0,0.6), 0 0 6px " +
            accent +
            "88",
        }}
      />
    </div>
  );
}

function RotaryKnob({
  value,
  onChange,
  accent,
}: {
  value: number;
  onChange: (v: number) => void;
  accent: string;
}) {
  const angle = -135 + (value / 100) * 270;
  const size = 42;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, #fafafd 0%, #d6cee0 35%, #8e7ea0 75%, #3a2a4e 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -2px 5px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.65)",
        }}
      />
      {Array.from({ length: 11 }).map((_, i) => {
        const tickAngle = -135 + (i / 10) * 270;
        const isMajor = i === 0 || i === 5 || i === 10;
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              width: isMajor ? 2 : 1,
              height: isMajor ? 4 : 2.5,
              background: "rgba(20,10,30,0.7)",
              transform: `translate(-50%, -50%) rotate(${tickAngle}deg) translateY(-18px)`,
            }}
          />
        );
      })}
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2"
        style={{
          width: 2.5,
          height: 9,
          marginLeft: -1.25,
          marginTop: -4.5,
          background: accent,
          boxShadow: `0 0 8px ${accent}, 0 0 12px ${accent}88`,
          borderRadius: 2,
          transform: `rotate(${angle}deg) translateY(-9px)`,
          transformOrigin: "center 4.5px",
          transition: "transform 80ms ease",
        }}
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 12,
          height: 12,
          background:
            "radial-gradient(circle at 30% 30%, #ffffff 0%, #c8b8d0 55%, #4a3858 100%)",
          boxShadow:
            "inset 0 1px 1px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.5)",
        }}
      />
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-grab opacity-0 active:cursor-grabbing"
        aria-label="volume"
      />
    </div>
  );
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}
