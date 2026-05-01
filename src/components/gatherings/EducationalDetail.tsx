import Image from "next/image";
import Link from "next/link";
import type { EducationalEntry } from "@/lib/gatherings";

export default function EducationalDetail({ entry }: { entry: EducationalEntry }) {
  return (
    <div className="relative h-[100dvh] w-full overflow-y-auto overflow-x-hidden">
      <div aria-hidden className="fixed inset-0 -z-20 bg-plum-dark" />
      <div aria-hidden className="fixed inset-0 -z-10">
        {entry.images[0] && (
          <Image
            src={entry.images[0]}
            alt=""
            fill
            priority
            className="object-cover opacity-50"
            style={{ filter: "blur(34px) saturate(1.1)" }}
            sizes="100vw"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(140deg, rgba(18,10,31,0.85) 0%, rgba(37,26,56,0.7) 60%, rgba(90,62,122,0.55) 100%)",
          }}
        />
      </div>

      <Link
        href="/gatherings"
        className="plum-outset fixed left-4 top-4 z-50 inline-flex items-center gap-2 bg-plum px-3 py-1.5 font-pixel text-base leading-none text-code-text shadow-[4px_4px_0_rgba(0,0,0,0.45)] hover:bg-plum-light/50 md:left-6 md:top-6"
      >
        <span aria-hidden>←</span> Back
      </Link>

      <main className="mx-auto max-w-[88rem] px-4 py-16 md:px-10 md:py-20">
        <article className="plum-outset bg-plum text-code-text shadow-[10px_12px_0_rgba(0,0,0,0.45)]">
          <div
            className="flex h-9 items-center gap-2 px-1.5 text-code-text"
            style={{
              background:
                "linear-gradient(90deg, var(--color-code-title-from) 0%, var(--color-code-title-to) 100%)",
            }}
          >
            <span className="plum-outset inline-block size-4 bg-mauve" aria-hidden />
            <div className="flex min-w-0 flex-1 items-baseline gap-2 font-pixel text-xl leading-none">
              <span className="truncate">{entry.title}</span>
              <span className="truncate text-base opacity-80">— {entry.slug}.txt</span>
            </div>
          </div>

          <div className="border-b border-plum-light/40 px-5 py-4 md:px-8 md:py-5">
            <div className="font-pixel text-sm uppercase leading-none tracking-[0.18em] text-paper/55">
              {entry.kind} | {entry.year}
            </div>
            <h1
              className="mt-2 font-pixel text-3xl leading-tight text-paper md:text-4xl"
              style={{ textShadow: "2px 2px 0 rgba(0,0,0,0.45)" }}
            >
              {entry.title}
            </h1>
            <span className="mt-1 block font-mono text-sm text-paper/65">
              {entry.venue}
            </span>
          </div>

          {/* Media first, image-dominant — full content width. Optional
              YouTube embed renders at the top, then any still images. */}
          <div className="flex flex-col gap-4 px-3 py-5 md:px-6 md:py-7">
            {entry.video && (
              <div
                className="plum-inset relative w-full overflow-hidden bg-plum-dark"
                style={{ aspectRatio: "16 / 9" }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${entry.video.youtubeId}?rel=0&modestbranding=1${
                    entry.video.startSeconds
                      ? `&start=${entry.video.startSeconds}`
                      : ""
                  }`}
                  title={entry.title}
                  loading="lazy"
                  allow="accelerated-2d-canvas; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            )}

            {entry.images.map((src, i) => (
              <div key={i} className="plum-inset overflow-hidden bg-plum-dark">
                <Image
                  src={src}
                  alt=""
                  width={2400}
                  height={1600}
                  sizes="(max-width: 768px) 100vw, 70vw"
                  className="block h-auto w-full"
                />
              </div>
            ))}
          </div>

          {/* Body + action buttons */}
          <div className="border-t border-plum-light/40 px-5 py-5 md:px-8 md:py-7">
            <p className="max-w-[60rem] text-base leading-relaxed text-code-text/90 md:text-[1.05rem]">
              {entry.body}
            </p>
            {entry.link && (
              <a
                href={entry.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="plum-outset mt-5 inline-block bg-plum px-3 py-1.5 font-pixel text-base leading-none text-code-text shadow-[4px_4px_0_rgba(0,0,0,0.45)] hover:bg-plum-light/50"
              >
                {entry.link.label} →
              </a>
            )}
          </div>

          <div className="border-t border-plum-light/40 px-5 py-4 md:px-8 md:py-5">
            <Link
              href="/gatherings"
              className="plum-outset inline-block bg-plum px-3 py-1.5 font-pixel text-base leading-none text-code-text shadow-[4px_4px_0_rgba(0,0,0,0.45)] hover:bg-plum-light/50"
            >
              ← Back to Gatherings
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
