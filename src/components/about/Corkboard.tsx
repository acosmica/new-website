"use client";

import HydraPolaroid from "./HydraPolaroid";
import StickyNote from "./StickyNote";

// --- Spiral geometry (shared by the mask + the SVG overlays so the wire
// passes through exactly where the paper is cut) ------------------------
const HOLE_PITCH = 44;      // vertical distance between rings (px)
const HOLE_COUNT = 40;      // enough rings for a full-height, scrollable page
const TILE_WIDTH = 120;     // SVG pattern tile width — holds the full loop
const RING_CX = 60;         // horizontal centre of each loop inside a tile
const RING_CY = 22;         // vertical centre of each loop inside a tile
const HOLE_RX = 8;
const HOLE_RY = 4;

// CSS mask that punches transparent ellipses down the centre of the
// paper at each ring position. `mask-composite: intersect` means the
// paper is visible only where ALL gradients are opaque — so each hole
// position (transparent in its gradient) gets cut out.
const HOLE_MASK = Array.from({ length: HOLE_COUNT }, (_, i) => {
  const y = i * HOLE_PITCH + HOLE_PITCH / 2;
  return `radial-gradient(ellipse ${HOLE_RX}px ${HOLE_RY}px at 50% ${y}px, transparent 85%, black 100%)`;
}).join(", ");

// Notebook-paper surface — dusty lavender base, rule lines, pink margin,
// diagonal creases. The darker centre shadow has been dropped now that
// the spiral binding is 3D and punches real holes.
const PAPER_STYLE: React.CSSProperties = {
  backgroundColor: "#cec2d2",
  backgroundImage: [
    // Clean 32px-period rule lines so bio text can sit exactly on them.
    "repeating-linear-gradient(180deg, rgba(82, 54, 101, 0.3) 0, rgba(82, 54, 101, 0.3) 1px, transparent 1px, transparent 32px)",
    "linear-gradient(90deg, transparent calc(3.5rem - 1px), rgba(214, 133, 155, 0.7) calc(3.5rem - 1px), rgba(214, 133, 155, 0.7) calc(3.5rem + 1px), transparent calc(3.5rem + 1px))",
    "linear-gradient(112deg, transparent 0%, transparent 22%, rgba(0,0,0,0.06) 23%, transparent 24%, transparent 100%)",
    "linear-gradient(82deg, transparent 0%, transparent 55%, rgba(0,0,0,0.05) 56%, transparent 57%, transparent 100%)",
    "linear-gradient(155deg, transparent 0%, transparent 72%, rgba(0,0,0,0.04) 73%, transparent 74%, transparent 100%)",
    "linear-gradient(70deg, transparent 0%, transparent 35%, rgba(255,255,255,0.04) 36%, rgba(255,255,255,0.04) 37%, transparent 38%, transparent 100%)",
    "linear-gradient(180deg, #d4c7d8 0%, #c4b7c8 100%)",
  ].join(", "),
  maskImage: HOLE_MASK,
  WebkitMaskImage: HOLE_MASK,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
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
 *  the paper so it only appears inside the transparent cut-out. */
function SpiralRear() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2"
      width={TILE_WIDTH}
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
          width={TILE_WIDTH}
          height={HOLE_PITCH}
          patternUnits="userSpaceOnUse"
        >
          {/* A short vertical wire section crossing through the hole,
              shaded left→right with the metallic gradient above for a
              round, dimensional feel. Height exceeds the hole slightly
              so the paper crops it cleanly. */}
          <rect
            x={RING_CX - 3}
            y={RING_CY - 9}
            width={6}
            height={18}
            fill="url(#wire-cross)"
          />
          {/* drop-shadow where the wire passes behind the hole rim */}
          <rect
            x={RING_CX - 3}
            y={RING_CY + 4}
            width={6}
            height={5}
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
function SpiralFront() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2"
      width={TILE_WIDTH}
      height="100%"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="front-wire"
          width={TILE_WIDTH}
          height={HOLE_PITCH}
          patternUnits="userSpaceOnUse"
        >
          {/* cast shadow on the paper, offset down-right */}
          <path
            d={`M ${RING_CX - 18} ${RING_CY + 2} Q ${RING_CX + 2} ${RING_CY - 18} ${RING_CX + 22} ${RING_CY + 2}`}
            fill="none"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={5}
            strokeLinecap="round"
          />
          {/* outer dark edge (bottom of the cylinder) */}
          <path
            d={`M ${RING_CX - 19} ${RING_CY} Q ${RING_CX} ${RING_CY - 19} ${RING_CX + 19} ${RING_CY}`}
            fill="none"
            stroke="#2d2138"
            strokeWidth={5.5}
            strokeLinecap="round"
          />
          {/* mid metal body */}
          <path
            d={`M ${RING_CX - 19} ${RING_CY} Q ${RING_CX} ${RING_CY - 19} ${RING_CX + 19} ${RING_CY}`}
            fill="none"
            stroke="#8a7a99"
            strokeWidth={3.8}
            strokeLinecap="round"
          />
          {/* brighter upper body */}
          <path
            d={`M ${RING_CX - 19} ${RING_CY - 0.4} Q ${RING_CX} ${RING_CY - 19} ${RING_CX + 18.6} ${RING_CY - 0.4}`}
            fill="none"
            stroke="#c4b6d0"
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          {/* specular highlight */}
          <path
            d={`M ${RING_CX - 12} ${RING_CY - 8} Q ${RING_CX} ${RING_CY - 17} ${RING_CX + 12} ${RING_CY - 8}`}
            fill="none"
            stroke="#f4eef6"
            strokeWidth={1}
            strokeLinecap="round"
            opacity={0.95}
          />
          {/* tiny rim highlight at the hole */}
          <path
            d={`M ${RING_CX - 19} ${RING_CY} Q ${RING_CX - 16} ${RING_CY - 2} ${RING_CX - 13} ${RING_CY}`}
            fill="none"
            stroke="#eadfec"
            strokeWidth={0.6}
            strokeLinecap="round"
          />
          <path
            d={`M ${RING_CX + 13} ${RING_CY} Q ${RING_CX + 16} ${RING_CY - 2} ${RING_CX + 19} ${RING_CY}`}
            fill="none"
            stroke="#eadfec"
            strokeWidth={0.6}
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
      className="pointer-events-none absolute z-[22] select-none font-hand text-[22px] leading-tight text-ink/80"
      style={{
        width,
        background: STRIPE[color],
        padding: "10px 16px",
        transform: `rotate(${rotate}deg)`,
        boxShadow:
          "1px 2px 0 rgba(0,0,0,0.08), 4px 7px 12px rgba(0,0,0,0.12)",
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
  return (
    // Outer scroll viewport — fixed to the window body area. Inner wrapper
    // is explicitly sized so absolute-positioned paper/spiral/content cover
    // the full scroll extent and move with the scroll.
    <div className="relative h-[calc(100dvh-140px)] w-full overflow-y-auto overflow-x-hidden">
      <div className="relative w-full" style={{ height: `${PAGE_HEIGHT}px` }}>
      {/* Rear of the spiral — visible only through the punched holes */}
      <SpiralRear />

      {/* Notebook paper with transparent holes punched down the centre */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={PAPER_STYLE}
      />

      {/* Paper grain + wrinkle layers (masked identically so noise also
          respects the holes) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-[0.32]"
        style={{
          backgroundImage: PAPER_NOISE,
          backgroundSize: "400px 400px",
          maskImage: HOLE_MASK,
          WebkitMaskImage: HOLE_MASK,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.25]"
        style={{
          backgroundImage: PAPER_NOISE,
          backgroundSize: "180px 180px",
          maskImage: HOLE_MASK,
          WebkitMaskImage: HOLE_MASK,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      {/* Front of the spiral — sits on top of the paper */}
      <SpiralFront />

      {/* Polaroid header — top right */}
      <HydraPolaroid
        src="/about/me.jpg"
        caption="mini mica, live-coded"
        rotate={5}
        size={320}
        style={{ position: "absolute", top: "40px", right: "4%", zIndex: 30 }}
      />

      {/* Sticky notes — only the originals kept */}
      <div className="absolute inset-0 z-20">
        <StickyNote
          color="mauve"
          rotate={-4}
          style={{ top: "24px", left: "6rem" }}
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
          style={{ top: "760px", right: "3rem" }}
          width={260}
        >
          currently obsessed with:
          <br />
          glitches, vibe coding
          <br />
          and baking focaccia
        </StickyNote>
      </div>

      {/* Main bio — left page, spans from just past the pink margin line
          to just shy of the spiral binding. Starts at the very top (on-rule
          baseline) and wraps around the "Hi Micaelle" sticky via an invisible
          float reservation. 17px Geist Mono on a 32px line-height keeps text
          baselines locked to the paper's ruled cadence. */}
      <div
        className="pointer-events-none absolute z-10 font-mono text-ink/85"
        style={{
          top: "70px",
          left: "4rem",
          right: "calc(50% + 3.5rem)",
          fontSize: "17px",
          lineHeight: "32px",
          whiteSpace: "pre-wrap",
        }}
      >
        <div
          aria-hidden
          style={{
            float: "left",
            width: "21rem",
            height: "88px",
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

      {/* Secondary bio — right page, spans from the spiral out to the
          right edge. Starts at the top (on-rule) and wraps around the
          polaroid via an invisible float reservation. */}
      <div
        className="pointer-events-none absolute z-10 font-mono text-ink/85"
        style={{
          top: "70px",
          left: "calc(50% + 3.5rem)",
          right: "3rem",
          fontSize: "17px",
          lineHeight: "32px",
          whiteSpace: "pre-wrap",
        }}
      >
        <div
          aria-hidden
          style={{
            float: "right",
            width: "22rem",
            height: "410px",
            shapeOutside: "margin-box",
            marginLeft: "0.5rem",
          }}
        />
        {`My personal artistic practice focuses on the concept of magic and how it manifests in our world.

Through a researcher-practitioner perspective, I explore how ritual, ancestrality, and memory manifest through interactive objects and expanded audiovisual spaces. The idea is to create spaces of (co) and (re)creation, where interactors can engage with speculation, deep thinking, rebellion, embodiement and other sensations.

My energy also extends into community-building and education, being a former professor at LaGuardia Community College and leading free workshops dreaming about technology as a tool for collective connection.`}
      </div>

      {/* Washi tape — thecode pull-quote, stuck across the lower white
          margin of the polaroid like a diary entry. z above polaroid (z-30). */}
      <WashiTape
        color="mauve"
        rotate={-3}
        width={370}
        style={{
          top: "400px",
          right: "calc(4% - 25px)",
          whiteSpace: "nowrap",
          zIndex: 40,
        }}
      >
        founder & creative director @ thecode ✺
      </WashiTape>

      {/* Glitter-pen stars scattered across both pages */}
      <div className="pointer-events-none absolute inset-0 z-[15]">
        {GLITTER_STARS.map((s, i) => (
          <GlitterStar key={i} spec={s} idx={i} />
        ))}
      </div>

      {/* Margin scribble — left edge of the right page, aligned with
          the "currently obsessed" sticky on the far right. */}
      <div className="pointer-events-none absolute inset-0 z-10 font-hand text-2xl text-ink/60">
        <div
          style={{ position: "absolute", top: "810px", left: "calc(50% + 4.5rem)" }}
          className="-rotate-3"
        >
          ~ keep making weird things
        </div>
      </div>

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
