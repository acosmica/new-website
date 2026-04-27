"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";

// Four scrapbook/witch-diary stamp tools: heart, smile, witch-hat, flower.
type ToolId = "heart" | "smile" | "witch" | "flower";
type Tool = { id: ToolId; label: string };
const TOOLS: Tool[] = [
  { id: "heart", label: "heart stamp" },
  { id: "smile", label: "smile stamp" },
  { id: "witch", label: "witch hat stamp" },
  { id: "flower", label: "flower stamp" },
];

type Stamp = {
  id: number;
  tool: ToolId;
  x: number;
  y: number;
  rot: number;
  seed: number;
};

// ====================================================================
// 3D dock icons — static meshes, rendered once per Canvas (frameloop
// "demand"), so four icons cost almost zero CPU after mount.
// ====================================================================

function heartShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0, 0.3);
  s.bezierCurveTo(0, 0.55, -0.3, 0.8, -0.6, 0.8);
  s.bezierCurveTo(-1.05, 0.8, -1.05, 0.15, -1.05, 0.15);
  s.bezierCurveTo(-1.05, -0.25, -0.55, -0.55, 0, -1);
  s.bezierCurveTo(0.55, -0.55, 1.05, -0.25, 1.05, 0.15);
  s.bezierCurveTo(1.05, 0.15, 1.05, 0.8, 0.6, 0.8);
  s.bezierCurveTo(0.3, 0.8, 0, 0.55, 0, 0.3);
  return s;
}

function HeartMesh() {
  const shape = useMemo(heartShape, []);
  const geometry = useMemo(
    () =>
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.4,
        bevelEnabled: true,
        bevelThickness: 0.07,
        bevelSize: 0.07,
        bevelSegments: 2,
        curveSegments: 10,
      }),
    [shape],
  );
  return (
    <mesh geometry={geometry} scale={0.85} rotation={[-0.15, -0.3, 0]}>
      <meshStandardMaterial color="#e05b72" metalness={0.2} roughness={0.45} />
    </mesh>
  );
}

function SmileMesh() {
  return (
    <group scale={0.95} rotation={[-0.1, -0.2, 0]}>
      <mesh>
        <sphereGeometry args={[1, 28, 28]} />
        <meshStandardMaterial color="#f5c542" metalness={0.15} roughness={0.5} />
      </mesh>
      <mesh position={[-0.32, 0.25, 0.88]}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.32, 0.25, 0.88]}>
        <sphereGeometry args={[0.11, 12, 12]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, -0.15, 0.85]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.38, 0.055, 10, 22, Math.PI]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

function WitchHatMesh() {
  return (
    <group rotation={[-0.18, -0.35, 0.07]} position={[0, -0.1, 0]}>
      {/* Wide flat brim */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.1, 36]} />
        <meshStandardMaterial color="#1e1629" metalness={0.1} roughness={0.6} />
      </mesh>
      {/* Pointy cone */}
      <mesh position={[0, 0.42, 0]}>
        <coneGeometry args={[0.62, 1.75, 28]} />
        <meshStandardMaterial color="#1e1629" metalness={0.1} roughness={0.6} />
      </mesh>
      {/* Purple band at cone base */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.64, 0.64, 0.17, 28]} />
        <meshStandardMaterial color="#6a3d52" metalness={0.15} roughness={0.4} />
      </mesh>
      {/* Gold buckle on the band */}
      <mesh position={[0, -0.4, 0.65]}>
        <boxGeometry args={[0.22, 0.17, 0.05]} />
        <meshStandardMaterial color="#d7b05a" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

function FlowerMesh() {
  return (
    <group rotation={[-0.2, 0, 0.35]}>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.58, Math.sin(a) * 0.58, 0]}
          >
            <sphereGeometry args={[0.4, 14, 14]} />
            <meshStandardMaterial
              color="#efb3c3"
              metalness={0.15}
              roughness={0.45}
            />
          </mesh>
        );
      })}
      <mesh position={[0, 0, 0.2]}>
        <sphereGeometry args={[0.34, 14, 14]} />
        <meshStandardMaterial color="#f5c542" metalness={0.2} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Tool3D({ tool }: { tool: ToolId }) {
  if (tool === "heart") return <HeartMesh />;
  if (tool === "smile") return <SmileMesh />;
  if (tool === "witch") return <WitchHatMesh />;
  return <FlowerMesh />;
}

function ToolCanvas({ tool }: { tool: ToolId }) {
  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 3.2], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[2, 3, 3]} intensity={1.15} />
      <directionalLight
        position={[-2, -1, 2]}
        intensity={0.4}
        color="#b6c8ff"
      />
      <Tool3D tool={tool} />
    </Canvas>
  );
}

// ====================================================================
// Ink-stamp SVG — single-colour silhouette + fractal-noise displacement
// for uneven edges + multiply blend so the mark sinks into the paper.
// ====================================================================

const INK_COLORS: Record<ToolId, string> = {
  heart: "#a0304a",
  smile: "#b17c1d",
  witch: "#241a3a",
  flower: "#9a5370",
};

function InkStamp({
  tool,
  size,
  seed = 3,
}: {
  tool: ToolId;
  size: number;
  seed?: number;
}) {
  const color = INK_COLORS[tool];
  const filterId = `ink-${tool}-${seed}`;
  const maskId = `inkmask-${tool}-${seed}`;
  const common = { width: size, height: size, viewBox: "0 0 24 24" };

  const filterDefs = (
    <defs>
      <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="1.3"
          numOctaves={2}
          seed={seed}
        />
        <feDisplacementMap in="SourceGraphic" scale="0.45" />
      </filter>
    </defs>
  );

  if (tool === "heart") {
    return (
      <svg {...common}>
        {filterDefs}
        <path
          d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 6.5-7 11-7 11z"
          fill={color}
          fillOpacity="0.8"
          filter={`url(#${filterId})`}
        />
      </svg>
    );
  }
  if (tool === "smile") {
    return (
      <svg {...common}>
        {filterDefs}
        <defs>
          <mask id={maskId}>
            <rect width="24" height="24" fill="white" />
            <circle cx="9" cy="10" r="1.35" fill="black" />
            <circle cx="15" cy="10" r="1.35" fill="black" />
            <path
              d="M8 14 Q12 17 16 14"
              stroke="black"
              strokeWidth="1.7"
              fill="none"
              strokeLinecap="round"
            />
          </mask>
        </defs>
        <circle
          cx="12"
          cy="12"
          r="9.5"
          fill={color}
          fillOpacity="0.8"
          mask={`url(#${maskId})`}
          filter={`url(#${filterId})`}
        />
      </svg>
    );
  }
  if (tool === "witch") {
    // Witch-hat silhouette: brim ellipse + pointy cone, one colour.
    return (
      <svg {...common}>
        {filterDefs}
        <g
          fill={color}
          fillOpacity="0.85"
          filter={`url(#${filterId})`}
        >
          <ellipse cx="12" cy="17.5" rx="9" ry="1.9" />
          <path d="M12 3 L8.6 15.6 L15.4 15.6 Z" />
        </g>
      </svg>
    );
  }
  return (
    <svg {...common}>
      {filterDefs}
      <g fill={color} fillOpacity="0.8" filter={`url(#${filterId})`}>
        <circle cx="12" cy="5.8" r="3.2" />
        <circle cx="12" cy="18.2" r="3.2" />
        <circle cx="5.8" cy="12" r="3.2" />
        <circle cx="18.2" cy="12" r="3.2" />
        <circle cx="7.2" cy="7.2" r="2.8" />
        <circle cx="16.8" cy="7.2" r="2.8" />
        <circle cx="7.2" cy="16.8" r="2.8" />
        <circle cx="16.8" cy="16.8" r="2.8" />
        <circle cx="12" cy="12" r="2.6" />
      </g>
    </svg>
  );
}

// ====================================================================
// Studio
// ====================================================================

const BUTTON_SIZE = 44;
const PLACED_STAMP_SIZE = 44;
const CURSOR_STAMP_SIZE = 48;

export default function StampStudio() {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [hoverTool, setHoverTool] = useState<ToolId | null>(null);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [layer, setLayer] = useState<HTMLElement | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  // Locate the stamp layer that Corkboard renders inside its scroll
  // content so placed stamps scroll with the paper.
  useEffect(() => {
    const el = document.getElementById("stamp-layer");
    setLayer(el);
  }, []);

  // While a tool is active: track cursor for the follow-preview, place
  // stamps on click/drag (throttled), hide the native cursor.
  useEffect(() => {
    if (!activeTool || !layer) {
      setCursor(null);
      return;
    }
    let isDown = false;
    let lastAt = 0;

    const place = (e: MouseEvent) => {
      const rect = layer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      setStamps((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          tool: activeTool,
          x,
          y,
          rot: (Math.random() - 0.5) * 34,
          seed: Math.floor(Math.random() * 100) + 1,
        },
      ]);
    };

    const onMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
      if (!isDown) return;
      const now = Date.now();
      if (now - lastAt < 130) return;
      lastAt = now;
      place(e);
    };
    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const dock = document.getElementById("stamp-dock");
      if (dock?.contains(e.target as Node)) return;
      isDown = true;
      lastAt = Date.now();
      place(e);
    };
    const onUp = () => {
      isDown = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      setCursor(null);
    };
  }, [activeTool, layer]);

  return (
    <>
      {/* Placed stamps — inside the notebook scroll layer, multiplied
          into the paper so they read as ink, not stickers. */}
      {layer &&
        createPortal(
          stamps.map((s) => (
            <div
              key={s.id}
              className="absolute"
              style={{
                left: s.x - PLACED_STAMP_SIZE / 2,
                top: s.y - PLACED_STAMP_SIZE / 2,
                transform: `rotate(${s.rot}deg)`,
                mixBlendMode: "multiply",
              }}
            >
              <InkStamp tool={s.tool} size={PLACED_STAMP_SIZE} seed={s.seed} />
            </div>
          )),
          layer,
        )}

      {/* Cursor preview — free-floating (no multiply, so it stays legible
          over the dark backdrop when you haven't reached the paper yet) */}
      {activeTool && cursor && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[90]"
          style={{
            left: cursor.x - CURSOR_STAMP_SIZE / 2,
            top: cursor.y - CURSOR_STAMP_SIZE / 2,
            opacity: 0.9,
          }}
        >
          <InkStamp tool={activeTool} size={CURSOR_STAMP_SIZE} seed={7} />
        </div>
      )}

      {/* Dock — fixed to viewport bottom, floats over the notebook */}
      <div
        id="stamp-dock"
        className="fixed bottom-14 left-1/2 z-[80] -translate-x-1/2"
      >
        <div className="flex items-end gap-1.5 rounded-xl border border-white/15 bg-plum/55 px-2 py-1.5 shadow-[0_8px_22px_rgba(0,0,0,0.35)] backdrop-blur-md">
          {TOOLS.map((t) => {
            const isHover = hoverTool === t.id;
            const isActive = activeTool === t.id;
            const lift = isHover ? -10 : 0;
            const scale = isHover ? 1.4 : isActive ? 1.1 : 1;
            return (
              <button
                key={t.id}
                type="button"
                aria-label={t.label}
                onMouseEnter={() => setHoverTool(t.id)}
                onMouseLeave={() => setHoverTool(null)}
                onClick={() =>
                  setActiveTool(activeTool === t.id ? null : t.id)
                }
                className="relative rounded-lg transition-transform duration-200 ease-out"
                style={{
                  width: BUTTON_SIZE,
                  height: BUTTON_SIZE,
                  transform: `translateY(${lift}px) scale(${scale})`,
                  background: isActive
                    ? "rgba(234, 217, 232, 0.18)"
                    : "transparent",
                }}
              >
                {/* Explicit pixel-sized wrapper so R3F's Canvas has a
                    non-ambiguous parent to measure (the previous grid +
                    size-full combo misbehaved and rendered huge). */}
                <span
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg"
                  style={{
                    width: BUTTON_SIZE,
                    height: BUTTON_SIZE,
                  }}
                >
                  <ToolCanvas tool={t.id} />
                </span>
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-paper"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
