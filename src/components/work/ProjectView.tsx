import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Project } from "@/lib/projects";
import HeroVideo from "./HeroVideo";

type Props = { project: Project };

function isVideo(src?: string): boolean {
  if (!src) return false;
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(src);
}

function isGif(src?: string): boolean {
  return !!src && src.toLowerCase().endsWith(".gif");
}

/** Frame used by every in-body image — keeps the plum-outset aesthetic
 *  consistent and lets us swap aspect ratios per layout. */
function Frame({
  src,
  aspect,
  fit = "cover",
  caption,
}: {
  src: string;
  aspect: string;
  fit?: "cover" | "contain";
  caption?: string;
}) {
  return (
    <figure className="not-prose m-0">
      <div
        className="plum-outset relative w-full overflow-hidden bg-plum-dark"
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={src}
          alt={caption ?? ""}
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          unoptimized={isGif(src)}
          className={fit === "cover" ? "object-cover" : "object-contain p-2"}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 font-mono text-xs text-paper/55">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function VideoFrame({
  src,
  aspect,
  poster,
  fit = "cover",
}: {
  src: string;
  /** Optional forced aspect ratio box. Omit to let the video's intrinsic
   *  dimensions drive its height (full width, no cropping). */
  aspect?: string;
  poster?: string;
  fit?: "cover" | "contain";
}) {
  if (!aspect) {
    return (
      <div className="plum-outset not-prose relative w-full overflow-hidden bg-plum-dark">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          className="block h-auto w-full"
        />
      </div>
    );
  }
  return (
    <div
      className="plum-outset not-prose relative w-full overflow-hidden bg-plum-dark"
      style={{ aspectRatio: aspect }}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        className={`absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
      />
    </div>
  );
}

/** Single image — full content width with breakout from prose column. */
function Figure({
  src,
  aspect = "16/9",
  fit = "cover",
  caption,
}: {
  src: string;
  aspect?: string;
  fit?: "cover" | "contain";
  caption?: string;
}) {
  return (
    <div className="not-prose my-10">
      <Frame src={src} aspect={aspect} fit={fit} caption={caption} />
    </div>
  );
}

/** Two images side by side. */
function Pair({
  a,
  b,
  aspect = "4/5",
  fit = "cover",
}: {
  a: string;
  b: string;
  aspect?: string;
  fit?: "cover" | "contain";
}) {
  return (
    <div className="not-prose my-10 grid gap-3 md:grid-cols-2 md:gap-4">
      <Frame src={a} aspect={aspect} fit={fit} />
      <Frame src={b} aspect={aspect} fit={fit} />
    </div>
  );
}

/** Three images side by side — collapses to a single column on mobile. */
function Trio({
  a,
  b,
  c,
  aspect = "3/4",
  fit = "cover",
}: {
  a: string;
  b: string;
  c: string;
  aspect?: string;
  fit?: "cover" | "contain";
}) {
  return (
    <div className="not-prose my-10 grid gap-3 md:grid-cols-3 md:gap-4">
      <Frame src={a} aspect={aspect} fit={fit} />
      <Frame src={b} aspect={aspect} fit={fit} />
      <Frame src={c} aspect={aspect} fit={fit} />
    </div>
  );
}

/** Image floated alongside the MDX paragraph that follows. Use when the
 *  visual is vertical-leaning and would otherwise leave dead space. */
function Aside({
  src,
  side = "right",
  aspect = "3/4",
  width = "40%",
}: {
  src: string;
  side?: "left" | "right";
  aspect?: string;
  width?: string;
}) {
  return (
    <div
      className="not-prose mb-2 mt-4"
      style={{
        float: side,
        width,
        marginLeft: side === "right" ? "1.5rem" : 0,
        marginRight: side === "left" ? "1.5rem" : 0,
      }}
    >
      <Frame src={src} aspect={aspect} />
    </div>
  );
}

/** Inline embedded video — autoplays muted, like the hero. */
function InlineVideo({
  src,
  aspect = "16/9",
  poster,
}: {
  src: string;
  aspect?: string;
  poster?: string;
}) {
  return (
    <div className="not-prose my-10">
      <VideoFrame src={src} aspect={aspect} poster={poster} />
    </div>
  );
}

/** Autoplaying video rotated 90° and placed in a 2-column row with
 *  surrounding text children. Use when the raw video is shot vertically
 *  but the page layout wants it wide. */
function VideoAside({
  src,
  rotate = 90,
  side = "left",
  ratio = "9/16",
  children,
}: {
  src: string;
  rotate?: number;
  side?: "left" | "right";
  /** Intrinsic aspect of the source video — defaults to portrait 9:16. */
  ratio?: string;
  children?: React.ReactNode;
}) {
  // Convert intrinsic ratio (e.g. "9/16") to the rotated landscape ratio
  // so the visual footprint matches the rotated video exactly.
  const [w, h] = ratio.split("/").map(Number);
  const landscape = rotate % 180 === 0 ? `${w} / ${h}` : `${h} / ${w}`;
  const innerWidth = rotate % 180 === 0 ? "100%" : `${(w / h) * 100}%`;
  const innerHeight = rotate % 180 === 0 ? "100%" : `${(h / w) * 100}%`;

  const video = (
    <div
      className="not-prose relative w-full overflow-hidden plum-outset bg-plum-dark"
      style={{ aspectRatio: landscape }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: innerWidth,
          height: innerHeight,
          transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
          transformOrigin: "center",
        }}
      >
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="block h-full w-full object-contain"
        />
      </div>
    </div>
  );

  // Give the video column slightly more room than the text column so the
  // rotated footprint reads as a proper media panel rather than a thumbnail.
  const cols =
    side === "left"
      ? "md:grid-cols-[5fr_4fr]"
      : "md:grid-cols-[4fr_5fr]";

  return (
    <div className={`my-10 grid gap-6 md:items-center md:gap-8 ${cols}`}>
      {side === "left" && video}
      <div className="min-w-0">{children}</div>
      {side === "right" && video}
    </div>
  );
}

/** Image laid out alongside MDX content in a 2-column row. Mirrors the
 *  VideoAside pattern but for a still image — pick this when a tall
 *  portrait asset would otherwise stretch the page if rendered full width. */
function ImageAside({
  src,
  aspect = "9/16",
  side = "left",
  fit = "cover",
  width = "45%",
  children,
}: {
  src: string;
  aspect?: string;
  side?: "left" | "right";
  fit?: "cover" | "contain";
  /** Width of the image column at md+ (as a CSS length or %). */
  width?: string;
  children?: React.ReactNode;
}) {
  const image = (
    <div
      className="not-prose relative w-full shrink-0 overflow-hidden plum-outset bg-plum-dark"
      style={{ aspectRatio: aspect, width: undefined }}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 45vw"
        unoptimized={isGif(src)}
        className={fit === "cover" ? "object-cover" : "object-contain p-2"}
      />
    </div>
  );
  // Children's trailing Figure/InlineVideo wrappers carry their own
  // my-10, which visually offsets the bottom edge when using items-end.
  // Zero out the last child's bottom margin so bottoms truly align.
  return (
    <div className="mt-0 mb-10 flex flex-col gap-6 md:flex-row md:items-end md:gap-8">
      {side === "left" && (
        <div className="w-full md:shrink-0" style={{ flexBasis: width }}>
          {image}
        </div>
      )}
      <div className="min-w-0 flex-1 [&>*:last-child]:mb-0 [&>*:first-child]:mt-0">
        {children}
      </div>
      {side === "right" && (
        <div className="w-full md:shrink-0" style={{ flexBasis: width }}>
          {image}
        </div>
      )}
    </div>
  );
}

/** Inline pill-style outbound link — use inside MDX when you want the
 *  same "Open site →" button the detail footer renders, but positioned
 *  within the body copy. */
function LinkButton({
  href,
  children,
}: {
  href: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="not-prose my-6">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="plum-outset inline-block bg-plum px-3 py-1.5 font-pixel text-lg text-mauve hover:bg-plum-light/50 hover:text-blush"
      >
        {children ?? "Open site →"}
      </a>
    </div>
  );
}

/** Default render of every asset in `frontmatter.assets` — kept for
 *  backwards compat with existing MDX (e.g. botanica). */
function AssetRow({ assets }: { assets: string[] }) {
  if (!assets.length) return null;
  return (
    <div className="not-prose my-10">
      <div
        className="grid gap-3 md:gap-4"
        style={{
          gridTemplateColumns: `repeat(${assets.length}, minmax(0, 1fr))`,
        }}
      >
        {assets.map((src) => (
          <div
            key={src}
            className="plum-outset relative aspect-[2/3] overflow-hidden bg-plum-dark"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 768px) 16vw, 200px"
              className="object-contain p-2"
              unoptimized={isGif(src)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectView({ project }: Props) {
  const heroVideoSrc =
    project.heroVideo ?? (isVideo(project.hero) ? project.hero : undefined);
  const heroImageSrc =
    project.hero && !isVideo(project.hero) ? project.hero : undefined;

  return (
    <article className="h-full overflow-y-auto bg-plum text-code-text">
      <section
        className="relative w-full overflow-hidden bg-code-gutter"
        style={{ height: "min(82vh, 720px)" }}
      >
        {heroVideoSrc ? (
          <HeroVideo src={heroVideoSrc} poster={heroImageSrc} />
        ) : heroImageSrc ? (
          <Image
            src={heroImageSrc}
            alt=""
            fill
            priority
            unoptimized={isGif(heroImageSrc)}
            className="object-cover"
            style={{ objectPosition: project.heroFocus ?? "center" }}
            sizes="(max-width: 768px) 100vw, 72vw"
          />
        ) : null}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(18,10,31,0.95) 0%, rgba(18,10,31,0.55) 14%, rgba(18,10,31,0) 30%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 px-6 pb-2 pt-3 md:px-8 md:pb-2.5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h1
              className="font-pixel text-4xl leading-none text-paper md:text-6xl"
              style={{ textShadow: "0 2px 4px rgba(0,0,0,0.7)" }}
            >
              {project.title}
            </h1>
            <div className="flex flex-col items-end font-mono text-sm leading-tight text-paper/80 md:text-base">
              {project.location && <span>{project.location}</span>}
              <span>{project.year}</span>
            </div>
          </div>

          {project.summary && (
            <p
              className="max-w-2xl text-base leading-relaxed text-paper/90 md:text-lg"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
            >
              {project.summary}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-pixel text-xs uppercase leading-none tracking-[0.18em] text-paper/55">
              Tags ▸
            </span>
            {project.tags.map((tag) => (
              <Link
                key={tag}
                href={`/work?tags=${encodeURIComponent(tag)}`}
                prefetch
                className="plum-outset bg-plum/80 px-2 py-0.5 font-pixel text-sm leading-none text-code-text backdrop-blur-sm transition-colors hover:bg-mauve hover:text-ink md:text-base"
              >
                {tag}
              </Link>
            ))}
          </div>

          {project.role && project.role.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-pixel text-xs uppercase leading-none tracking-[0.18em] text-paper/55">
                Role ▸
              </span>
              {project.role.map((r) => (
                <span
                  key={r}
                  className="plum-outset bg-plum-light/30 px-2 py-0.5 font-pixel text-sm leading-none text-paper backdrop-blur-sm md:text-base"
                >
                  {r}
                </span>
              ))}
            </div>
          )}

          {project.exhibition && project.exhibition.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-pixel text-xs uppercase leading-none tracking-[0.18em] text-paper/55">
                Exhibition ▸
              </span>
              {project.exhibition.map((e) => (
                <span
                  key={e}
                  className="plum-outset bg-plum-light/30 px-2 py-0.5 font-pixel text-sm leading-none text-paper backdrop-blur-sm md:text-base"
                >
                  {e}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[88rem] px-8 py-8 md:px-12">
        <div className="prose prose-invert prose-lg max-w-none font-sans text-code-text prose-headings:font-pixel prose-headings:text-code-text prose-h2:text-2xl prose-h3:text-xl prose-a:text-mauve hover:prose-a:text-blush prose-strong:text-code-text prose-code:text-peach">
          <MDXRemote
            source={project.body}
            components={{
              Assets: () => <AssetRow assets={project.assets ?? []} />,
              Figure,
              Pair,
              Trio,
              Aside,
              InlineVideo,
              LinkButton,
              VideoAside,
              ImageAside,
            }}
          />
        </div>

        {project.endVideo && (
          <div className="mt-12">
            <VideoFrame src={project.endVideo} />
          </div>
        )}

        {((project.tools && project.tools.length > 0) || project.link) && (
          <footer className="mt-10 grid gap-6 border-t-2 border-plum-light pt-6 md:grid-cols-2">
            {project.tools && project.tools.length > 0 && (
              <div>
                <h3 className="mb-2 font-pixel text-lg text-code-text">
                  Tools
                </h3>
                <ul className="flex flex-wrap gap-1.5">
                  {project.tools.map((tool) => (
                    <li
                      key={tool}
                      className="plum-inset bg-code-gutter px-2 py-0.5 font-mono text-sm text-code-text"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {project.link && (
              <div>
                <h3 className="mb-2 font-pixel text-lg text-code-text">Live</h3>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="plum-outset inline-block bg-plum px-3 py-1.5 font-pixel text-lg text-mauve hover:bg-plum-light/50 hover:text-blush"
                >
                  Open site →
                </a>
              </div>
            )}
          </footer>
        )}
      </div>
    </article>
  );
}
