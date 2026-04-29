"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Experiment } from "@/lib/experiments";
import PlayerDisplay from "./PlayerDisplay";
import PlayerPlaylist from "./PlayerPlaylist";
import PlayerTransport from "./PlayerTransport";

type IntroPayload = { title: string; tagline: string; body: string[] };

export default function MediaPlayer({
  experiments,
  intro,
}: {
  experiments: Experiment[];
  intro: IntroPayload;
}) {
  const [trackIndex, setTrackIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const track = trackIndex == null ? null : experiments[trackIndex] ?? null;

  const select = (i: number) => {
    setTrackIndex(i);
    setPlaying(true);
  };
  const playPause = () => {
    if (trackIndex == null) {
      select(0);
      return;
    }
    setPlaying((p) => !p);
  };
  const stop = () => {
    setPlaying(false);
    setTrackIndex(null);
  };
  const prev = () => {
    if (trackIndex == null) return select(experiments.length - 1);
    select((trackIndex - 1 + experiments.length) % experiments.length);
  };
  const next = () => {
    if (trackIndex == null) return select(0);
    select((trackIndex + 1) % experiments.length);
  };

  const router = useRouter();
  const isPlaying = playing && track != null;
  const trackTitle = track?.title ?? null;
  const closeToDesktop = () => router.push("/");

  return (
    <div className="relative w-full max-w-[1360px]">
      <div
        className="relative w-full"
        style={{
          borderRadius: "28px",
          background:
            "linear-gradient(135deg, #f5eef3 0%, #d3c2d7 28%, #9d8aa8 58%, #5b4a72 82%, #2a1f3a 100%)",
          boxShadow:
            "inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -3px 6px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.4), 0 30px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.6), 0 0 80px rgba(201,165,212,0.22)",
          padding: "16px 18px 18px 18px",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: "28px",
            background:
              "linear-gradient(118deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.10) 100%)",
          }}
        />

        <TitleBar
          isPlaying={isPlaying}
          trackTitle={trackTitle}
          onClose={closeToDesktop}
        />

        <div
          className="relative z-10 mt-3 grid gap-3"
          style={{
            gridTemplateColumns: "minmax(0, 7fr) minmax(0, 3fr)",
          }}
        >
          <div className="min-h-[600px]">
            <PlayerDisplay intro={intro} track={track} playing={isPlaying} />
          </div>
          <div className="min-h-[600px]">
            <PlayerPlaylist
              experiments={experiments}
              activeIndex={trackIndex}
              onSelect={select}
            />
          </div>
        </div>

        <div className="relative z-10 mt-3">
          <PlayerTransport
            playing={isPlaying}
            onPlayPause={playPause}
            onStop={stop}
            onPrev={prev}
            onNext={next}
          />
        </div>
      </div>
    </div>
  );
}

function TitleBar({
  isPlaying,
  trackTitle,
  onClose,
}: {
  isPlaying: boolean;
  trackTitle: string | null;
  onClose: () => void;
}) {
  return (
    <div
      className="relative z-10 flex h-[36px] items-center justify-between rounded-[10px] px-4"
      style={{
        background:
          "linear-gradient(180deg, #3a2750 0%, #1f1238 60%, #120a1f 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.6)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="inline-block rounded-full"
          style={{
            width: "12px",
            height: "12px",
            background:
              "conic-gradient(from 180deg, #ff7eb6, #c9a5d4, #f2c9a8, #ead9a0, #ff7eb6)",
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.45), 0 0 6px rgba(255,126,182,0.6)",
          }}
        />
        <span
          className="font-mono text-[15px] uppercase tracking-[0.28em]"
          style={{ color: "#f2c9a8", textShadow: "0 0 6px rgba(242,201,168,0.6)" }}
        >
          Mica Lages — Experiments.wmp
        </span>
        {isPlaying && trackTitle && (
          <span
            className="hidden truncate font-mono text-[14px] uppercase tracking-[0.22em] md:inline"
            style={{ color: "#ff7eb6" }}
          >
            ▶ {trackTitle}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <WinBtn label="_" />
        <WinBtn label="▢" />
        <WinBtn label="✕" hot onClick={onClose} ariaLabel="Close — return to desktop" />
      </div>
    </div>
  );
}

function WinBtn({
  label,
  hot,
  onClick,
  ariaLabel,
}: {
  label: string;
  hot?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      tabIndex={onClick ? 0 : -1}
      aria-hidden={onClick ? undefined : true}
      className="flex items-center justify-center"
      style={{
        width: "20px",
        height: "18px",
        borderRadius: "5px",
        background: hot
          ? "linear-gradient(180deg, #ff9eb8 0%, #d0412c 70%, #7a1f10 100%)"
          : "linear-gradient(180deg, #f5eef3 0%, #d3c2d7 60%, #8a7ca0 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.55)",
        color: hot ? "#fff" : "#1a0f2c",
        fontSize: "11px",
        fontFamily: "var(--font-geist-mono), monospace",
        lineHeight: 1,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {label}
    </button>
  );
}
