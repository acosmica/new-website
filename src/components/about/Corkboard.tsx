"use client";

import { useEffect, useMemo, useState } from "react";
import HydraPolaroid from "./HydraPolaroid";
import StickyNote from "./StickyNote";
import { useScale } from "@/lib/useScale";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return isMobile;
}

// --- Spiral geometry (shared by the mask + the SVG overlays so the wire
// passes through exactly where the paper is cut) ------------------------
// Base values designed against the 1800px viewport baseline. The Corkboard
// component multiplies each by `useScale()` so the spiral binding grows
// proportionally with the rest of the page on large monitors.
const BASE_HOLE_PITCH = 44;
const HOLE_COUNT = 40;
const BASE_TILE_WIDTH = 120;
const BASE_RING_CX = 60;
const BASE_RING_CY = 22;
const BASE_HOLE_RX = 8;
const BASE_HOLE_RY = 4;

function buildHoleMask(pitch: number, rx: number, ry: number): string {
  return Array.from({ length: HOLE_COUNT }, (_, i) => {
    const y = i * pitch + pitch / 2;
    return `radial-gradient(ellipse ${rx}px ${ry}px at 50% ${y}px, transparent 85%, black 100%)`;
  }).join(", ");
}

// Notebook-paper surface — dusty lavender base, rule lines, pink margin,
// diagonal creases. The darker centre shadow has been dropped now that
// the spiral binding is 3D and punches real holes. PAPER_BG_LAYERS is
// reused across the desktop + mobile variants; the desktop variant adds
// a CSS mask built from the scaled spiral geometry per-render.
const PAPER_BG_LAYERS = [
  // Clean 2rem-period rule lines so bio text can sit exactly on them.
  "repeating-linear-gradient(180deg, rgba(82, 54, 101, 0.3) 0, rgba(82, 54, 101, 0.3) 1px, transparent 1px, transparent 2rem)",
  "linear-gradient(90deg, transparent calc(3.5rem - 1px), rgba(214, 133, 155, 0.7) calc(3.5rem - 1px), rgba(214, 133, 155, 0.7) calc(3.5rem + 1px), transparent calc(3.5rem + 1px))",
  "linear-gradient(112deg, transparent 0%, transparent 22%, rgba(0,0,0,0.06) 23%, transparent 24%, transparent 100%)",
  "linear-gradient(82deg, transparent 0%, transparent 55%, rgba(0,0,0,0.05) 56%, transparent 57%, transparent 100%)",
  "linear-gradient(155deg, transparent 0%, transparent 72%, rgba(0,0,0,0.04) 73%, transparent 74%, transparent 100%)",
  "linear-gradient(70deg, transparent 0%, transparent 35%, rgba(255,255,255,0.04) 36%, rgba(255,255,255,0.04) 37%, transparent 38%, transparent 100%)",
  "linear-gradient(180deg, #d4c7d8 0%, #c4b7c8 100%)",
].join(", ");

// Mobile variant: no pink margin line (the bio uses the full width of
// the page, so a vertical margin guide doesn't make sense), no spiral
// holes, and rule lines kept on the same 2rem cadence so 2rem line-height
// text sits exactly on the lines.
const MOBILE_PAPER_BG_LAYERS = [
  "repeating-linear-gradient(180deg, rgba(82, 54, 101, 0.3) 0, rgba(82, 54, 101, 0.3) 1px, transparent 1px, transparent 2rem)",
  "linear-gradient(112deg, transparent 0%, transparent 22%, rgba(0,0,0,0.06) 23%, transparent 24%, transparent 100%)",
  "linear-gradient(82deg, transparent 0%, transparent 55%, rgba(0,0,0,0.05) 56%, transparent 57%, transparent 100%)",
  "linear-gradient(155deg, transparent 0%, transparent 72%, rgba(0,0,0,0.04) 73%, transparent 74%, transparent 100%)",
  "linear-gradient(70deg, transparent 0%, transparent 35%, rgba(255,255,255,0.04) 36%, rgba(255,255,255,0.04) 37%, transparent 38%, transparent 100%)",
  "linear-gradient(180deg, #d4c7d8 0%, #c4b7c8 100%)",
].join(", ");

const MOBILE_PAPER_STYLE: React.CSSProperties = {
  backgroundColor: "#cec2d2",
  backgroundImage: MOBILE_PAPER_BG_LAYERS,
};

const PAPER_NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")";

/**
 * A hand-drawn single-stroke 5-point star (unicursal pentagram) — the
 * kind kids doodle without lifting the pen. Rendered with a metallic
 * gradient stroke + soft glow to read like glitter-gel pen ink.
 */
type StarSpec = {
  top: string;
  left: string;
  size: number;
  rotate: number;
  palette: [string, string, string];
};

const GLITTER_STARS: StarSpec[] = [
  { top: "3%", left: "30%", size: 46, rotate: -16, palette: ["#b8893a", "#e6c874", "#c97fa0"] },
  { top: "58%", left: "42%", size: 36, rotate: 22, palette: ["#a07db0", "#c49cb0", "#8ab99f"] },
  { top: "92%", left: "9%", size: 52, rotate: -10, palette: ["#c49677", "#c9a23e", "#c88fa4"] },
  { top: "5%", left: "56%", size: 32, rotate: 8, palette: ["#c29a3a", "#8ab99f", "#d7c075"] },
  { top: "72%", left: "89%", size: 54, rotate: -22, palette: ["#c97fa0", "#c29a3a", "#a07db0"] },
  { top: "32%", left: "66%", size: 40, rotate: 14, palette: ["#8ab99f", "#98c1aa", "#a07db0"] },
  { top: "46%", left: "94%", size: 30, rotate: -5, palette: ["#c29a3a", "#c88fa4", "#d7c075"] },
];

// Single-stroke 5-point-star path. Drawn large in a 28-unit viewBox so the
// stroke/dasharray can carry real weight at bigger sizes.
const STAR_PATH = "M 0,-10 L 5.88,8.09 L -9.51,-3.09 L 9.51,-3.09 L -5.88,8.09 Z";

function GlitterStar({ spec, idx }: { spec: StarSpec; idx: number }) {
  const gradId = `star-grad-${idx}`;
  const wobbleId = `star-wobble-${idx}`;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        top: spec.top,
        left: spec.left,
        width: spec.size,
        height: spec.size,
        transform: `translate(-50%, -50%) rotate(${spec.rotate}deg)`,
        // just a tiny cast shadow — no bright halo. Reads as ink on paper.
        filter: "drop-shadow(0 1px 0.5px rgba(0,0,0,0.22))",
        overflow: "visible",
        opacity: 0.78,
      }}
      viewBox="-14 -14 28 28"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={spec.palette[0]} />
          <stop offset="55%" stopColor={spec.palette[1]} />
          <stop offset="100%" stopColor={spec.palette[2]} />
        </linearGradient>
        {/* Hand-drawn wobble: fractal noise displaces the stroke so the
            star's edges look shaky, like a kid's pen across textured paper. */}
        <filter
          id={wobbleId}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            seed={idx * 7 + 3}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={0.9}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <g filter={`url(#${wobbleId})`}>
        {/* body — darker bottom tone of the palette, gives the line weight */}
        <path
          d={STAR_PATH}
          fill="none"
          stroke={spec.palette[0]}
          strokeWidth={2.6}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.9}
        />
        {/* gradient ink on top */}
        <path
          d={STAR_PATH}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={1.6}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* glitter specks — short dashes along the star in the highlight
            tone, simulating bits of metallic catching the light */}
        <path
          d={STAR_PATH}
          fill="none"
          stroke={spec.palette[1]}
          strokeWidth={0.7}
          strokeDasharray="1 2.6"
          strokeLinecap="round"
          opacity={0.85}
        />
        {/* second sparser speck pass for extra grit */}
        <path
          d={STAR_PATH}
          fill="none"
          stroke={spec.palette[2]}
          strokeWidth={0.45}
          strokeDasharray="0.6 5"
          strokeLinecap="round"
          opacity={0.7}
        />
      </g>
    </svg>
  );
}

/** The section of wire you see THROUGH each punched hole — drawn below
 *  the paper so it only appears inside the transparent cut-out. Internal
 *  coordinates and stroke widths are all multiplied by `scale` so the
 *  binding grows in lockstep with the rest of the page composition. */
function SpiralRear({ scale }: { scale: number }) {
  const s = scale;
  const tileWidth = BASE_TILE_WIDTH * s;
  const pitch = BASE_HOLE_PITCH * s;
  const cx = BASE_RING_CX * s;
  const cy = BASE_RING_CY * s;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2"
      width={tileWidth}
      height="100%"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="wire-cross" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#2a1f36" />
          <stop offset="35%" stopColor="#7a6885" />
          <stop offset="55%" stopColor="#c7badc" />
          <stop offset="75%" stopColor="#8a7a99" />
          <stop offset="100%" stopColor="#2a1f36" />
        </linearGradient>
        <pattern
          id="rear-wire"
          width={tileWidth}
          height={pitch}
          patternUnits="userSpaceOnUse"
        >
          <rect
            x={cx - 3 * s}
            y={cy - 9 * s}
            width={6 * s}
            height={18 * s}
            fill="url(#wire-cross)"
          />
          <rect
            x={cx - 3 * s}
            y={cy + 4 * s}
            width={6 * s}
            height={5 * s}
            fill="rgba(0,0,0,0.55)"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#rear-wire)" />
    </svg>
  );
}

/** The visible top arc of each ring — drawn above the paper, with multi-
 *  layer strokes to read as cylindrical metal with a specular highlight. */
function SpiralFront({ scale }: { scale: number }) {
  const s = scale;
  const tileWidth = BASE_TILE_WIDTH * s;
  const pitch = BASE_HOLE_PITCH * s;
  const cx = BASE_RING_CX * s;
  const cy = BASE_RING_CY * s;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2"
      width={tileWidth}
      height="100%"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="front-wire"
          width={tileWidth}
          height={pitch}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${cx - 18 * s} ${cy + 2 * s} Q ${cx + 2 * s} ${cy - 18 * s} ${cx + 22 * s} ${cy + 2 * s}`}
            fill="none"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={5 * s}
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - 19 * s} ${cy} Q ${cx} ${cy - 19 * s} ${cx + 19 * s} ${cy}`}
            fill="none"
            stroke="#2d2138"
            strokeWidth={5.5 * s}
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - 19 * s} ${cy} Q ${cx} ${cy - 19 * s} ${cx + 19 * s} ${cy}`}
            fill="none"
            stroke="#8a7a99"
            strokeWidth={3.8 * s}
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - 19 * s} ${cy - 0.4 * s} Q ${cx} ${cy - 19 * s} ${cx + 18.6 * s} ${cy - 0.4 * s}`}
            fill="none"
            stroke="#c4b6d0"
            strokeWidth={2.4 * s}
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - 12 * s} ${cy - 8 * s} Q ${cx} ${cy - 17 * s} ${cx + 12 * s} ${cy - 8 * s}`}
            fill="none"
            stroke="#f4eef6"
            strokeWidth={1 * s}
            strokeLinecap="round"
            opacity={0.95}
          />
          <path
            d={`M ${cx - 19 * s} ${cy} Q ${cx - 16 * s} ${cy - 2 * s} ${cx - 13 * s} ${cy}`}
            fill="none"
            stroke="#eadfec"
            strokeWidth={0.6 * s}
            strokeLinecap="round"
          />
          <path
            d={`M ${cx + 13 * s} ${cy} Q ${cx + 16 * s} ${cy - 2 * s} ${cx + 19 * s} ${cy}`}
            fill="none"
            stroke="#eadfec"
            strokeWidth={0.6 * s}
            strokeLinecap="round"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#front-wire)" />
    </svg>
  );
}

/** Washi-tape strip — striped translucent tape over the page, with hand
 *  lettering on top. Deliberately tilted and uneven to feel stuck-on. */
function WashiTape({
  children,
  color = "peach",
  rotate = 0,
  width = 260,
  style,
}: {
  children: React.ReactNode;
  color?: "peach" | "blush" | "mint" | "mauve" | "gold";
  rotate?: number;
  width?: number;
  style?: React.CSSProperties;
}) {
  const STRIPE: Record<string, string> = {
    peach:
      "repeating-linear-gradient(135deg, rgba(242,201,168,0.88) 0 10px, rgba(255,223,198,0.88) 10px 20px)",
    blush:
      "repeating-linear-gradient(135deg, rgba(239,179,195,0.88) 0 10px, rgba(255,215,225,0.88) 10px 20px)",
    mint:
      "repeating-linear-gradient(135deg, rgba(164,217,197,0.88) 0 10px, rgba(205,238,222,0.88) 10px 20px)",
    mauve:
      "repeating-linear-gradient(135deg, rgba(201,165,212,0.88) 0 10px, rgba(228,205,234,0.88) 10px 20px)",
    gold:
      "repeating-linear-gradient(135deg, rgba(234,217,160,0.88) 0 10px, rgba(250,238,196,0.88) 10px 20px)",
  };
  return (
    <div
      className="pointer-events-none absolute z-[22] select-none font-hand text-[1.375rem] leading-tight text-ink/80"
      style={{
        width: `calc(${width}px * var(--scale))`,
        background: STRIPE[color],
        padding: "0.625rem 1rem",
        transform: `rotate(${rotate}deg)`,
        boxShadow:
          "1px 2px 0 rgba(0,0,0,0.08), 0.25rem 0.4375rem 0.75rem rgba(0,0,0,0.12)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Inner notebook content height — sized to end one line past the bottom
// of the longest block on the page (the left bio). Re-measure if the bio
// or max window width changes.
const PAGE_HEIGHT = 1024;

export default function Corkboard() {
  const isMobile = useIsMobile();
  const scale = useScale();

  // Spiral binding geometry + the matching CSS mask are both derived from
  // `--scale` so the holes, wire, and rings grow with the page on large
  // monitors. Memoised because the mask is a 40-stop gradient string.
  const holeMask = useMemo(
    () =>
      buildHoleMask(
        BASE_HOLE_PITCH * scale,
        BASE_HOLE_RX * scale,
        BASE_HOLE_RY * scale,
      ),
    [scale],
  );

  const paperStyle = useMemo<React.CSSProperties>(
    () => ({
      backgroundColor: "#cec2d2",
      backgroundImage: PAPER_BG_LAYERS,
      maskImage: holeMask,
      WebkitMaskImage: holeMask,
      maskComposite: "intersect",
      WebkitMaskComposite: "source-in",
    }),
    [holeMask],
  );

  return (
    // Outer scroll viewport — fixed to the window body area. Inner wrapper
    // is explicitly sized so absolute-positioned paper/spiral/content cover
    // the full scroll extent and move with the scroll.
    <div className="relative h-[calc(100dvh-8.75rem)] w-full overflow-y-auto overflow-x-hidden">
      <div
        className="relative w-full"
        style={
          isMobile
            ? { minHeight: "calc(100dvh - 8.75rem)" }
            : { height: `calc(${PAGE_HEIGHT}px * var(--scale))` }
        }
      >
      {/* Spiral binding + punched holes — desktop only. On mobile the page
          is one continuous tall sheet without the centre split. */}
      {!isMobile && <SpiralRear scale={scale} />}

      {/* Notebook paper. On desktop, holes are punched down the centre via
          a CSS mask. On mobile, no mask = continuous paper. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={isMobile ? MOBILE_PAPER_STYLE : paperStyle}
      />

      {/* Paper grain + wrinkle layers (masked identically so noise also
          respects the holes) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-[0.32]"
        style={{
          backgroundImage: PAPER_NOISE,
          backgroundSize: "25rem 25rem",
          ...(isMobile ? {} : {
            maskImage: holeMask,
            WebkitMaskImage: holeMask,
            maskComposite: "intersect" as const,
            WebkitMaskComposite: "source-in",
          }),
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.25]"
        style={{
          backgroundImage: PAPER_NOISE,
          backgroundSize: "11.25rem 11.25rem",
          ...(isMobile ? {} : {
            maskImage: holeMask,
            WebkitMaskImage: holeMask,
            maskComposite: "intersect" as const,
            WebkitMaskComposite: "source-in",
          }),
        }}
      />

      {!isMobile && <SpiralFront scale={scale} />}

      {/* Polaroid — desktop: large, top-right with the live hydra overlay.
          Mobile uses a static, tighter-margin polaroid floated into the
          bio block (rendered below) so text wraps on its left/under it. */}
      {!isMobile && (
        <HydraPolaroid
          src="/about/me.jpg"
          caption="mini mica, live-coded"
          rotate={5}
          size={320}
          style={{ position: "absolute", top: "2.5rem", right: "4%", zIndex: 30 }}
        />
      )}

      {/* Sticky notes — desktop only. Mobile keeps the page minimal. */}
      {!isMobile && (
        <div className="absolute inset-0 z-20">
          <StickyNote
            color="mauve"
            rotate={-4}
            style={{ top: "1.5rem", left: "6rem" }}
            width={280}
          >
            Hi, I&apos;m Micaelle!
            <br />
            A multimedia creative
            <br />
            making magic ✧
          </StickyNote>

          <StickyNote
            color="blush"
            rotate={3}
            style={{ top: "47.5rem", right: "3rem" }}
            width={260}
          >
            currently obsessed with:
            <br />
            glitches, vibe coding
            <br />
            and baking focaccia
          </StickyNote>
        </div>
      )}

      {/* Bio — desktop: split into two ruled columns flanking the spiral.
          Mobile: one continuous tall column spanning the full page width.
          17px Geist Mono on a 32px line-height keeps text baselines locked
          to the paper's ruled cadence. */}
      {isMobile ? (
        <div
          className="relative z-10 font-mono text-ink/85"
          style={{
            // 2rem paddingTop puts the first text line box exactly between
            // the first and second rule line, so each baseline (≈1.5rem from
            // the top of its 2rem line box) lands on a rule line below.
            paddingTop: "2rem",
            paddingLeft: "1.25rem",
            paddingRight: "1.25rem",
            paddingBottom: "3rem",
            fontSize: "1.0625rem",
            lineHeight: "2rem",
            whiteSpace: "pre-wrap",
          }}
        >
          {/* Floated static polaroid — text wraps to its left and below */}
          <figure
            className="float-right ml-3 mb-2"
            style={{
              transform: "rotate(5deg)",
              filter: "drop-shadow(0.125rem 0.1875rem 0 rgba(0,0,0,0.35))",
            }}
          >
            <div className="bg-paper p-1.5 pb-5">
              <div className="relative aspect-square w-[10rem] overflow-hidden bg-plum">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/about/me.jpg"
                  alt="Micaelle"
                  className="block h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-1 text-center font-hand text-base leading-none text-ink">
                mini mica
              </figcaption>
            </div>
          </figure>

          {`I am a multidisciplinary artist, creative technologist, researcher, producer, witch and several other hyphens at the famous intersection of art, design, and technology.

Born and raised in Brazil and now based in Brooklyn, NY, I specialize in building immersive and interactive experiences across every scale imaginable.

My toolkit is a bit of a kaleidoscope: it ranges from traditional film and storytelling to electronics, VR, creative coding, and AI. With a BA in Cinema and Audiovisual and a Masters from NYU’s Interactive Telecommunications Program (ITP), I’ve spent my career figuring out how to make tech feels human, emotional and a little bit magical.

On the industry side, I worked as an Associated Artist at 3LD Art & Technology and a Creative Technologist at Smooth Technology, collaborating with brands and artists to turn fun ideas into reality.

As the founder and Creative Director of thecode, I’ve led the development of large-scale installations for brands like Heineken and Coca-Cola, and I head up production for the IMMER and ARTELLIGENT festivals.

My personal artistic practice focuses on the concept of magic and how it manifests in our world.

Through a researcher-practitioner perspective, I explore how ritual, ancestrality, and memory manifest through interactive objects and expanded audiovisual spaces. The idea is to create spaces of (co) and (re)creation, where interactors can engage with speculation, deep thinking, rebellion, embodiement and other sensations.

My energy also extends into community-building and education, being a former professor at LaGuardia Community College and leading free workshops dreaming about technology as a tool for collective connection.`}
        </div>
      ) : (
        <>
          <div
            className="pointer-events-none absolute z-10 font-mono text-ink/85"
            style={{
              top: "4.375rem",
              left: "4rem",
              right: "calc(50% + 3.5rem)",
              fontSize: "1.0625rem",
              lineHeight: "2rem",
              whiteSpace: "pre-wrap",
            }}
          >
            <div
              aria-hidden
              style={{
                float: "left",
                width: "21rem",
                height: "5.5rem",
                shapeOutside: "margin-box",
                marginRight: "0.5rem",
              }}
            />
            {`I am a multidisciplinary artist, creative technologist, researcher, producer, witch and several other hyphens at the famous intersection of art, design, and technology.

Born and raised in Brazil and now based in Brooklyn, NY, I specialize in building immersive and interactive experiences across every scale imaginable.

My toolkit is a bit of a kaleidoscope: it ranges from traditional film and storytelling to electronics, VR, creative coding, and AI. With a BA in Cinema and Audiovisual and a Masters from NYU’s Interactive Telecommunications Program (ITP), I’ve spent my career figuring out how to make tech feels human, emotional and a little bit magical.

On the industry side, I worked as an Associated Artist at 3LD Art & Technology and a Creative Technologist at Smooth Technology, collaborating with brands and artists to turn fun ideas into reality.

As the founder and Creative Director of thecode, I’ve led the development of large-scale installations for brands like Heineken and Coca-Cola, and I head up production for the IMMER and ARTELLIGENT festivals.`}
          </div>

          <div
            className="pointer-events-none absolute z-10 font-mono text-ink/85"
            style={{
              top: "4.375rem",
              left: "calc(50% + 3.5rem)",
              right: "3rem",
              fontSize: "1.0625rem",
              lineHeight: "2rem",
              whiteSpace: "pre-wrap",
            }}
          >
            <div
              aria-hidden
              style={{
                float: "right",
                width: "22rem",
                height: "25.625rem",
                shapeOutside: "margin-box",
                marginLeft: "0.5rem",
              }}
            />
            {`My personal artistic practice focuses on the concept of magic and how it manifests in our world.

Through a researcher-practitioner perspective, I explore how ritual, ancestrality, and memory manifest through interactive objects and expanded audiovisual spaces. The idea is to create spaces of (co) and (re)creation, where interactors can engage with speculation, deep thinking, rebellion, embodiement and other sensations.

My energy also extends into community-building and education, being a former professor at LaGuardia Community College and leading free workshops dreaming about technology as a tool for collective connection.`}
          </div>
        </>
      )}

      {/* Washi tape, glitter stars, margin scribble — desktop only. */}
      {!isMobile && (
        <>
          <WashiTape
            color="mauve"
            rotate={-3}
            width={370}
            style={{
              top: "25rem",
              right: "calc(4% - 1.5625rem)",
              whiteSpace: "nowrap",
              zIndex: 40,
            }}
          >
            founder & creative director @ thecode ✺
          </WashiTape>

          <div className="pointer-events-none absolute inset-0 z-[15]">
            {GLITTER_STARS.map((s, i) => (
              <GlitterStar key={i} spec={s} idx={i} />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 z-10 font-hand text-2xl text-ink/60">
            <div
              style={{ position: "absolute", top: "50.625rem", left: "calc(50% + 4.5rem)" }}
              className="-rotate-3"
            >
              ~ keep making weird things
            </div>
          </div>
        </>
      )}

      {/* Stamp layer — StampStudio portals the user's placed stamps here
          so they scroll with the notebook content. Kept pointer-events-none
          so clicks pass through to the document-level handler in StampStudio. */}
      <div
        id="stamp-layer"
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[45]"
      />
      </div>
    </div>
  );
}
