import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/projects";
import { tagColor } from "@/lib/tagColors";

/**
 * Tarot-proportioned project card. Clicking it navigates to
 * /work/[slug] — a parallel-route intercept at /work/@modal/(.)[slug]
 * catches that navigation and renders ProjectModal on top, leaving
 * this grid visible underneath. Direct navigation to /work/[slug]
 * still resolves to the full-page view.
 */
export default function TarotCard({ project }: { project: Project }) {
  // Tarot card always uses the still hero image (not the video). That way
  // each card is a predictable thumbnail preview.
  const src = project.hero || project.thumbnail;
  const isGif = !!src && src.toLowerCase().endsWith(".gif");
  return (
    <Link
      href={`/work/${project.slug}`}
      prefetch
      scroll={false}
      className="group relative block aspect-[5/8] overflow-hidden plum-outset bg-plum transition-transform duration-200 ease-out hover:-translate-y-1"
    >
      <div aria-hidden className="absolute inset-0">
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            unoptimized={isGif}
            className="object-cover"
            style={{
              objectPosition: project.heroFocus ?? "center",
              transform: project.heroZoom
                ? `scale(${project.heroZoom})`
                : undefined,
              transformOrigin: "center",
            }}
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(135deg, var(--color-code-title-from) 0%, var(--color-code-title-to) 100%)",
            }}
          />
        )}
      </div>

      {/* Decorative double-line frame — tarot-card look */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-2 border border-paper/30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 border border-paper/15"
      />

      {/* Year top-right */}
      <div
        className="absolute right-3 top-3 font-mono text-[12px] uppercase tracking-[0.18em] text-paper/85"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.85)" }}
      >
        {project.year}
      </div>

      {/* Tag colour-dots top-left — quick visual of categories */}
      <div className="absolute left-3 top-3 flex gap-1">
        {project.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            aria-hidden
            className="size-2.5"
            style={{
              background: tagColor(tag),
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.5)",
            }}
          />
        ))}
      </div>

      {/* Title plaque — gradient overlay at bottom so title is legible
          regardless of underlying image. Title + subtitle centered. */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum-dark via-plum-dark/80 to-transparent p-4 pt-14 text-center">
        <h3
          className="font-bodoni text-2xl italic leading-tight text-paper"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75)" }}
        >
          {project.title}
        </h3>
        {(project.subtitle || project.tags[0]) && (
          <div className="mt-1 font-pixel text-[13px] uppercase tracking-wider text-paper/70">
            {project.subtitle ?? project.tags[0]}
          </div>
        )}
      </div>

      {/* Hover glow — inset highlight when pointer enters */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ boxShadow: "inset 0 0 30px rgba(234, 217, 232, 0.45)" }}
      />
    </Link>
  );
}
