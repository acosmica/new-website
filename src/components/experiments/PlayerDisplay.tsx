"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Experiment } from "@/lib/experiments";

type IntroPayload = { title: string; tagline: string; body: string[] };

const PHOSPHOR = "#f2c9a8";
const PHOSPHOR_GLOW = "rgba(242,201,168,0.7)";
const ACCENT = "#ff7eb6";
const ACCENT_GLOW = "rgba(255,126,182,0.7)";
const SOFT = "#ead9a0";
const COOL = "#c9a5d4";

export default function PlayerDisplay({
  intro,
  track,
  playing,
}: {
  intro: IntroPayload;
  track: Experiment | null;
  playing: boolean;
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        borderRadius: "12px",
        background:
          "radial-gradient(ellipse at 30% 20%, #2a1340 0%, #150924 55%, #0a0511 100%)",
        boxShadow:
          "inset 0 0 0 2px #1a0f2c, inset 0 0 0 4px #6a4f7e, inset 0 0 30px rgba(242,201,168,0.18), 0 0 0 1px rgba(0,0,0,0.6)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, transparent 1px, transparent 3px)",
          zIndex: 30,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)",
          zIndex: 30,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 30%)",
          zIndex: 30,
        }}
      />

      <div className="relative z-10 flex h-full w-full flex-col p-5 md:p-6">
        {track ? (
          <TrackView track={track} playing={playing} />
        ) : (
          <IntroView intro={intro} />
        )}
      </div>
    </div>
  );
}

function IntroView({ intro }: { intro: IntroPayload }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-5">
      <div>
        <h1
          className="mt-2 font-pixel uppercase leading-[0.9]"
          style={{
            color: PHOSPHOR,
            textShadow: `0 0 6px ${PHOSPHOR_GLOW}, 0 0 18px rgba(242,201,168,0.45)`,
            fontSize: "clamp(3rem, 6.6vw, 5.4rem)",
          }}
        >
          {intro.title}
        </h1>
        <p
          className="mt-2 font-pixel"
          style={{
            color: SOFT,
            textShadow: `0 0 4px ${PHOSPHOR_GLOW}`,
            fontSize: "clamp(1.35rem, 1.95vw, 1.9rem)",
          }}
        >
          &gt; {intro.tagline}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {intro.body.map((p, i) => (
          <p
            key={i}
            className="font-sans leading-relaxed"
            style={{
              color: "#f7e3d0",
              textShadow: `0 0 3px ${PHOSPHOR_GLOW}`,
              fontSize: "clamp(1rem, 1.05vw, 1.125rem)",
            }}
          >
            {p}
          </p>
        ))}
      </div>

      <p
        className="mt-1 hidden font-mono text-[18px] uppercase tracking-[0.24em] md:block"
        style={{ color: PHOSPHOR, opacity: 0.85 }}
      >
        Select a track from the playlist to inspect ▸
      </p>
      <p
        className="mt-1 font-mono text-[14px] uppercase tracking-[0.22em] md:hidden"
        style={{ color: PHOSPHOR, opacity: 0.85 }}
      >
        ▾ select a project below to inspect
      </p>
    </div>
  );
}

const SLIDE_LIMIT = 2;
// Reference aspect for all landscape slides — sourced from the emoji cam
// project's image dimensions (3600 × 1830). Every landscape project crops
// to this ratio. Portrait projects keep their detected aspect, except
// any slug listed here which is force-rendered as landscape (its portrait
// images get cropped to fit the wide slide).
const LANDSCAPE_ASPECT = 3600 / 1830;
const DEFAULT_ASPECT = LANDSCAPE_ASPECT;
const FORCE_LANDSCAPE_SLUGS = new Set<string>();

function TrackView({ track, playing }: { track: Experiment; playing: boolean }) {
  const allImages = useMemo(
    () =>
      track.images.length > 0
        ? track.images
        : track.preview
          ? [track.preview]
          : [],
    [track.images, track.preview],
  );
  const slideImages = useMemo(
    () =>
      track.previewImages.length > 0
        ? track.previewImages.slice(0, SLIDE_LIMIT)
        : allImages.slice(0, SLIDE_LIMIT),
    [track.previewImages, allImages],
  );

  const [idx, setIdx] = useState(0);
  const [aspect, setAspect] = useState<number>(DEFAULT_ASPECT);
  const lastSlug = useRef(track.slug);

  useEffect(() => {
    if (lastSlug.current !== track.slug) {
      lastSlug.current = track.slug;
      setIdx(0);
      setAspect(DEFAULT_ASPECT);
    }
  }, [track.slug]);

  // Detect aspect ratio from the first image's natural dimensions.
  // Portrait images keep their own ratio; landscape images all snap to
  // the shared LANDSCAPE_ASPECT so every horizontal slide matches.
  // Slugs in FORCE_LANDSCAPE_SLUGS skip detection — aspect is reset to
  // LANDSCAPE_ASPECT in the slug-change effect above.
  useEffect(() => {
    if (slideImages.length === 0) return;
    if (FORCE_LANDSCAPE_SLUGS.has(track.slug)) return;
    const probe = new window.Image();
    let cancelled = false;
    probe.onload = () => {
      if (cancelled) return;
      if (probe.naturalWidth > 0 && probe.naturalHeight > 0) {
        const ratio = probe.naturalWidth / probe.naturalHeight;
        setAspect(ratio < 0.95 ? ratio : LANDSCAPE_ASPECT);
      }
    };
    probe.src = slideImages[0];
    return () => {
      cancelled = true;
    };
  }, [slideImages, track.slug]);

  useEffect(() => {
    if (!playing || slideImages.length < 2) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % slideImages.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, [playing, slideImages.length]);

  const tagLine = track.tags.slice(0, 4).join(" · ");
  const summary = track.summary || track.body[0] || "";
  const portrait = aspect < 0.95;

  const carousel = (
    <div
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: "8px",
        boxShadow:
          "inset 0 0 0 2px rgba(242,201,168,0.45), inset 0 0 22px rgba(0,0,0,0.6), 0 0 0 4px #2a1340, 0 0 22px rgba(242,201,168,0.18)",
        background: "#0a0511",
        aspectRatio: aspect,
      }}
    >
      {slideImages.map((src, i) => (
        <div
          key={src + i}
          className="absolute inset-0"
          style={{
            opacity: i === idx ? 1 : 0,
            transition: "opacity 420ms ease",
          }}
          aria-hidden={i !== idx}
        >
          <Image
            src={src}
            alt={`${track.title} — image ${i + 1}`}
            fill
            sizes={portrait ? "(max-width: 768px) 60vw, 30vw" : "(max-width: 768px) 80vw, 60vw"}
            priority={i === idx}
            className="object-cover"
            style={{ filter: "saturate(1.05) contrast(1.05)" }}
          />
        </div>
      ))}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, transparent 1px, transparent 2px)",
        }}
      />

      {slideImages.length > 1 && (
        <div
          className="absolute right-3 top-3 hidden rounded-md px-2.5 py-1 font-mono text-[14px] tabular-nums uppercase tracking-[0.18em] md:block"
          style={{
            color: PHOSPHOR,
            background: "rgba(10,5,17,0.7)",
            border: "1px solid rgba(242,201,168,0.35)",
            textShadow: `0 0 4px ${PHOSPHOR_GLOW}`,
          }}
        >
          {String(idx + 1).padStart(2, "0")} / {String(slideImages.length).padStart(2, "0")}
        </div>
      )}

      {slideImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1">
          {slideImages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Go to image ${i + 1}`}
              className="flex cursor-pointer items-center justify-center"
              style={{
                width: 22,
                height: 22,
                background: "transparent",
                border: "none",
                padding: 0,
              }}
            >
              <span
                aria-hidden
                className="block rounded-full"
                style={{
                  width: i === idx ? 20 : 8,
                  height: 8,
                  background: i === idx ? ACCENT : "rgba(242,201,168,0.55)",
                  boxShadow:
                    i === idx ? `0 0 8px ${ACCENT}` : "0 0 3px rgba(0,0,0,0.6)",
                  transition: "width 200ms ease, background 200ms ease",
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const learnMoreBtn = (
    <Link
      href={`/experiments/${track.slug}`}
      prefetch
      className="plum-outset self-start bg-plum px-3 py-1.5 font-pixel text-base leading-none text-code-text shadow-[4px_4px_0_rgba(0,0,0,0.45)] hover:bg-plum-light/50"
    >
      Learn more →
    </Link>
  );

  if (portrait) {
    return (
      <>
        {/* Mobile: image on top full width, text + button below.
            Desktop (md+): vertical carousel left (38%), text right. */}
        <div className="flex h-full min-h-0 w-full flex-col gap-4 md:flex-row md:gap-5">
          <div
            className="flex w-full shrink-0 items-center justify-center md:w-[38%]"
          >
            {carousel}
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 md:gap-4">
            <h2
              className="hidden font-pixel uppercase leading-[0.95] md:block"
              style={{
                color: PHOSPHOR,
                textShadow: `0 0 6px ${PHOSPHOR_GLOW}, 0 0 18px rgba(242,201,168,0.4)`,
                fontSize: "clamp(1.8rem, 3.6vw, 3rem)",
              }}
            >
              {track.title}
            </h2>
            {tagLine && (
              <p
                className="hidden font-mono text-[15px] uppercase tracking-[0.18em] md:block"
                style={{ color: COOL, textShadow: "0 0 4px rgba(201,165,212,0.55)" }}
              >
                {tagLine}
              </p>
            )}

            {summary && (
              <p
                className="font-sans leading-relaxed"
                style={{
                  color: "#f7e3d0",
                  textShadow: `0 0 3px ${PHOSPHOR_GLOW}`,
                  fontSize: "clamp(1rem, 1.05vw, 1.125rem)",
                }}
              >
                {summary}
              </p>
            )}

            {learnMoreBtn}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-3">
      <div className="flex w-full justify-center">{carousel}</div>

      <div className="flex shrink-0 flex-col gap-2">
        <div className="flex items-baseline justify-between gap-4">
          <h2
            className="hidden truncate font-pixel uppercase leading-[0.95] md:block"
            style={{
              color: PHOSPHOR,
              textShadow: `0 0 6px ${PHOSPHOR_GLOW}, 0 0 18px rgba(242,201,168,0.4)`,
              fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)",
            }}
          >
            {track.title}
          </h2>
          {tagLine && (
            <p
              className="hidden truncate font-mono text-[14px] uppercase tracking-[0.18em] md:inline"
              style={{ color: COOL, textShadow: "0 0 4px rgba(201,165,212,0.55)" }}
            >
              {tagLine}
            </p>
          )}
        </div>
        {summary && (
          <p
            className="line-clamp-2 font-sans leading-relaxed"
            style={{
              color: "#f7e3d0",
              textShadow: `0 0 3px ${PHOSPHOR_GLOW}`,
              fontSize: "clamp(1rem, 1.05vw, 1.125rem)",
            }}
          >
            {summary}
          </p>
        )}
        {learnMoreBtn}
      </div>
    </div>
  );
}
