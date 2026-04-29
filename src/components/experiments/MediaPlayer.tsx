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

  // Mobile intro disclosure — when a track is selected the intro display
  // collapses into a toggle bar at the top, but can be re-opened.
  const [introOpen, setIntroOpen] = useState(false);

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
          mobileToggleable={!!track}
          introOpen={introOpen}
          onMobileToggle={() => setIntroOpen((v) => !v)}
          onDesktopReturnToIntro={track ? stop : undefined}
        />

        {/* Mobile-only intro panel — visually attached to the title bar
            above (no top gap, top corners squared) so it reads as a
            dropdown of the tab itself, not a separate box. */}
        <div
          id="experiments-intro-panel"
          className={`relative z-10 min-h-[420px] md:hidden ${
            track && !introOpen ? "hidden" : ""
          }`}
          style={{
            marginTop: "-1px",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            overflow: "hidden",
          }}
        >
          <PlayerDisplay intro={intro} track={null} playing={false} />
        </div>

        <div
          className={`relative z-10 flex flex-col gap-3 md:grid md:mt-3 ${
            track && introOpen ? "mt-3" : "mt-3 md:mt-3"
          }`}
          style={{
            gridTemplateColumns: "minmax(0, 7fr) minmax(0, 3fr)",
          }}
        >
          {/* Desktop display — always shows. On mobile this is hidden in
              favour of the inline preview inside the playlist below. */}
          <div className="hidden min-h-[600px] md:block">
            <PlayerDisplay intro={intro} track={track} playing={isPlaying} />
          </div>

          <div className="min-h-[320px] md:min-h-[600px]">
            <PlayerPlaylist
              experiments={experiments}
              activeIndex={trackIndex}
              onSelect={select}
              inlinePreview={
                track ? (
                  <div className="md:hidden">
                    <PlayerDisplay
                      intro={intro}
                      track={track}
                      playing={isPlaying}
                    />
                  </div>
                ) : null
              }
            />
          </div>
        </div>

        <div className="relative z-10 mt-3 hidden md:block">
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
  mobileToggleable,
  introOpen,
  onMobileToggle,
  onDesktopReturnToIntro,
}: {
  isPlaying: boolean;
  trackTitle: string | null;
  onClose: () => void;
  /** When true on mobile, the title bar acts as a tap target that
   *  toggles the intro panel (chevron rendered next to the title). */
  mobileToggleable?: boolean;
  introOpen?: boolean;
  onMobileToggle?: () => void;
  /** When provided (desktop only), clicking the title bar clears the
   *  active track so the main display returns to the intro. */
  onDesktopReturnToIntro?: () => void;
}) {
  const interior = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden
          className="hidden shrink-0 rounded-full md:inline-block"
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
          className="hidden truncate font-mono text-[15px] uppercase tracking-[0.28em] md:inline"
          style={{ color: "#f2c9a8", textShadow: "0 0 6px rgba(242,201,168,0.6)" }}
        >
          Experiments.wmp
        </span>
        <span
          className="truncate font-mono text-[12px] uppercase tracking-[0.18em] md:hidden"
          style={{ color: "#f2c9a8", textShadow: "0 0 6px rgba(242,201,168,0.6)" }}
        >
          Experiments.wmp
        </span>
        <span
          aria-hidden
          className="text-base leading-none transition-transform duration-150 md:hidden"
          style={{
            transform: mobileToggleable && introOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: "#ff7eb6",
          }}
        >
          ▾
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
    </>
  );

  const sharedClass =
    "relative z-10 flex h-[36px] items-center justify-between rounded-[10px] px-4";
  const sharedStyle: React.CSSProperties = {
    background:
      "linear-gradient(180deg, #3a2750 0%, #1f1238 60%, #120a1f 100%)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.6)",
  };

  const interactive = mobileToggleable || !!onDesktopReturnToIntro;

  if (interactive) {
    // The bar acts as a tap/click target. On mobile it toggles the
    // intro dropdown; on desktop it clears the active track and
    // returns the main display to the intro view.
    const handleActivate = () => {
      const isMobile =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 767px)").matches;
      if (isMobile) onMobileToggle?.();
      else onDesktopReturnToIntro?.();
    };
    return (
      <div
        className={`${sharedClass} cursor-pointer`}
        style={sharedStyle}
        onClick={handleActivate}
        role="button"
        tabIndex={0}
        aria-expanded={mobileToggleable ? introOpen : undefined}
        aria-controls={mobileToggleable ? "experiments-intro-panel" : undefined}
        aria-label={onDesktopReturnToIntro ? "Return to intro" : undefined}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleActivate();
          }
        }}
      >
        {interior}
      </div>
    );
  }

  return (
    <div className={sharedClass} style={sharedStyle}>
      {interior}
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
      onClick={(e) => {
        // Don't bubble to the parent title bar (which on mobile acts
        // as the intro toggle).
        e.stopPropagation();
        onClick?.();
      }}
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
