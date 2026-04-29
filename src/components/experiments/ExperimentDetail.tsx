import Image from "next/image";
import Link from "next/link";
import type { Experiment } from "@/lib/experiments";
import AsciiBackdrop from "./AsciiBackdrop";

const PHOSPHOR = "#f2c9a8";
const PHOSPHOR_GLOW = "rgba(242,201,168,0.7)";
const ACCENT = "#ff7eb6";
const COOL = "#c9a5d4";

type GalleryConfig = {
  gridCols?: number;
  max?: number;
  gridAspect?: string;
  rows?: number[];
  noCrop?: boolean;
  order?: number[];
  rowCaptions?: string[];
};

const galleryConfig: Record<string, GalleryConfig> = {
  "ai-fashion": {
    gridCols: 3,
    max: 6,
    gridAspect: "3 / 4",
    rowCaptions: ["ORIGINAL IMAGE", "GENERATED CLOTHING", "FINAL GEN-AI OUTPUT"],
  },
  fulldome: { gridCols: 2, noCrop: true },
  fabrication: { rows: [3, 2, 3, 3, 2, 3], gridAspect: "4 / 3" },
  "live-coding": { rows: [3, 3], gridAspect: "4 / 3" },
};

export default function ExperimentDetail({ track }: { track: Experiment }) {
  const tagLine = track.tags.join(" · ");
  const sourceImages =
    track.images.length > 0
      ? track.images
      : track.preview
        ? [track.preview]
        : [];

  const cfg = galleryConfig[track.slug] ?? {};
  const orderedSource = cfg.order
    ? cfg.order.map((i) => sourceImages[i]).filter((s): s is string => Boolean(s))
    : sourceImages;
  const totalNeeded = cfg.rows
    ? cfg.rows.reduce((sum, n) => sum + n, 0)
    : cfg.max;
  const allImages = totalNeeded
    ? orderedSource.slice(0, totalNeeded)
    : orderedSource;

  const rowChunks: string[][] = [];
  if (cfg.rows) {
    let cursor = 0;
    for (const count of cfg.rows) {
      rowChunks.push(allImages.slice(cursor, cursor + count));
      cursor += count;
    }
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-y-auto overflow-x-hidden bg-black">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, #2d1838 0%, #150924 45%, #0a0511 80%, #000 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 75% 80%, rgba(255,126,182,0.18) 0%, transparent 45%)",
        }}
      />
      <AsciiBackdrop />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <Link
        href="/experiments"
        className="pixel-outset fixed left-4 top-4 z-50 inline-flex items-center gap-2 bg-paper px-3 py-1.5 font-pixel text-base leading-none text-ink shadow-[4px_4px_0_rgba(0,0,0,0.45)] hover:bg-peach md:left-6 md:top-6"
      >
        <span aria-hidden>←</span> Back to Player
      </Link>

      <main className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-col px-4 py-12 md:px-8 md:py-16">
        <article
          className="relative flex w-full flex-col overflow-hidden"
          style={{
            borderRadius: "28px",
            padding: "16px 18px 18px 18px",
            background:
              "linear-gradient(135deg, #f5eef3 0%, #d3c2d7 28%, #9d8aa8 58%, #5b4a72 82%, #2a1f3a 100%)",
            boxShadow:
              "inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -3px 6px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.4), 0 30px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.6), 0 0 80px rgba(201,165,212,0.22)",
          }}
        >
          <div
            className="flex h-[36px] shrink-0 items-center justify-between rounded-[10px] px-4"
            style={{
              background:
                "linear-gradient(180deg, #3a2750 0%, #1f1238 60%, #120a1f 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.6)",
            }}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden
                className="inline-block shrink-0 rounded-full"
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
                className="shrink-0 font-mono text-[15px] uppercase tracking-[0.28em]"
                style={{ color: PHOSPHOR, textShadow: `0 0 6px ${PHOSPHOR_GLOW}` }}
              >
                Mica Lages — Experiments.wmp
              </span>
              <span
                className="hidden truncate font-mono text-[14px] uppercase tracking-[0.22em] md:inline"
                style={{ color: ACCENT }}
              >
                ▸ {track.title}
              </span>
            </div>
          </div>

          <div
            className="mt-3 flex-1 overflow-hidden"
            style={{
              borderRadius: "12px",
              background:
                "radial-gradient(ellipse at 30% 20%, #2a1340 0%, #150924 55%, #0a0511 100%)",
              boxShadow:
                "inset 0 0 0 2px #1a0f2c, inset 0 0 0 4px #6a4f7e, inset 0 0 30px rgba(242,201,168,0.18), 0 0 0 1px rgba(0,0,0,0.6)",
            }}
          >
            <div className="flex w-full flex-col gap-7 px-6 py-8 md:px-10 md:py-10">
              <header className="flex flex-col gap-3">
                <p
                  className="font-mono text-[15px] uppercase tracking-[0.28em]"
                  style={{
                    color: ACCENT,
                    textShadow: "0 0 6px rgba(255,126,182,0.55)",
                  }}
                >
                  ▸ {track.year || "Experiment"}
                </p>
                <h1
                  className="font-pixel uppercase leading-[0.95]"
                  style={{
                    color: PHOSPHOR,
                    textShadow: `0 0 6px ${PHOSPHOR_GLOW}, 0 0 18px rgba(242,201,168,0.4)`,
                    fontSize: "clamp(2rem, 4.4vw, 3.4rem)",
                  }}
                >
                  {track.title}
                </h1>
                {tagLine && (
                  <p
                    className="font-mono text-[15px] uppercase tracking-[0.2em]"
                    style={{ color: COOL, textShadow: "0 0 4px rgba(201,165,212,0.55)" }}
                  >
                    {tagLine}
                  </p>
                )}
              </header>

              {track.body.length > 0 && (
                <div className="flex flex-col gap-3">
                  {track.body.map((p, i) => (
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
              )}

              {allImages.length > 0 &&
                (cfg.rows ? (
                  <div className="flex flex-col gap-4">
                    {rowChunks.map((row, rowIdx) => (
                      <div
                        key={rowIdx}
                        className="grid gap-4"
                        style={{
                          gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
                        }}
                      >
                        {row.map((src, i) => (
                          <figure
                            key={src + i}
                            className="relative w-full overflow-hidden"
                            style={{
                              aspectRatio: cfg.gridAspect ?? "4 / 3",
                              borderRadius: "10px",
                              boxShadow:
                                "inset 0 0 0 2px rgba(242,201,168,0.35), 0 0 0 4px #2a1340, 0 10px 30px rgba(0,0,0,0.5)",
                              background: "#0a0511",
                            }}
                          >
                            <Image
                              src={src}
                              alt={`${track.title} — image ${i + 1}`}
                              fill
                              sizes={
                                row.length >= 3
                                  ? "(max-width: 768px) 30vw, 260px"
                                  : "(max-width: 768px) 45vw, 380px"
                              }
                              className="object-cover"
                              style={{ filter: "saturate(1.05) contrast(1.05)" }}
                            />
                          </figure>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : cfg.gridCols ? (
                  <div
                    className="grid items-start gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${cfg.gridCols}, minmax(0, 1fr))`,
                    }}
                  >
                    {allImages.map((src, i) =>
                      cfg.noCrop ? (
                        <figure
                          key={src + i}
                          className="relative w-full overflow-hidden"
                          style={{
                            borderRadius: "10px",
                            boxShadow:
                              "inset 0 0 0 2px rgba(242,201,168,0.35), 0 0 0 4px #2a1340, 0 10px 30px rgba(0,0,0,0.5)",
                            background: "#0a0511",
                          }}
                        >
                          <Image
                            src={src}
                            alt={`${track.title} — image ${i + 1}`}
                            width={1600}
                            height={1200}
                            sizes="(max-width: 768px) 90vw, 820px"
                            className="block h-auto w-full"
                            style={{ filter: "saturate(1.05) contrast(1.05)" }}
                          />
                        </figure>
                      ) : (
                        <figure key={src + i} className="flex flex-col gap-2">
                          <div
                            className="relative w-full overflow-hidden"
                            style={{
                              aspectRatio: cfg.gridAspect ?? "3 / 4",
                              borderRadius: "10px",
                              boxShadow:
                                "inset 0 0 0 2px rgba(242,201,168,0.35), 0 0 0 4px #2a1340, 0 10px 30px rgba(0,0,0,0.5)",
                              background: "#0a0511",
                            }}
                          >
                            <Image
                              src={src}
                              alt={`${track.title} — image ${i + 1}`}
                              fill
                              sizes={
                                cfg.gridCols && cfg.gridCols >= 3
                                  ? "(max-width: 768px) 30vw, 240px"
                                  : "(max-width: 768px) 45vw, 380px"
                              }
                              className="object-cover"
                              style={{ filter: "saturate(1.05) contrast(1.05)" }}
                            />
                          </div>
                          {cfg.rowCaptions && cfg.gridCols && (
                            <figcaption
                              className="text-center font-mono text-[12px] uppercase tracking-[0.22em]"
                              style={{
                                color: PHOSPHOR,
                                textShadow: `0 0 4px ${PHOSPHOR_GLOW}`,
                              }}
                            >
                              {cfg.rowCaptions[i % cfg.gridCols]}
                            </figcaption>
                          )}
                        </figure>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    {allImages.map((src, i) => (
                      <figure
                        key={src + i}
                        className="relative w-full overflow-hidden"
                        style={{
                          borderRadius: "10px",
                          boxShadow:
                            "inset 0 0 0 2px rgba(242,201,168,0.35), 0 0 0 4px #2a1340, 0 10px 30px rgba(0,0,0,0.5)",
                          background: "#0a0511",
                        }}
                      >
                        <Image
                          src={src}
                          alt={`${track.title} — image ${i + 1}`}
                          width={1600}
                          height={1200}
                          sizes="(max-width: 768px) 90vw, 820px"
                          className="block h-auto w-full"
                          style={{ filter: "saturate(1.05) contrast(1.05)" }}
                        />
                      </figure>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
