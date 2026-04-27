"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CylinderGeometry,
  Group,
  LatheGeometry,
  MeshPhysicalMaterial,
  PointLight,
  Vector2,
} from "three";

type Props = {
  position: [number, number, number];
  color: string;
  scale?: number;
  floatSpeed?: number;
  floatOffset?: number;
};

/**
 * A realistic 5mm through-hole LED. The bulb, flange, and leads share
 * a single vertical axis so the silhouette reads as one continuous object.
 *
 * The glow "breathes" on a long ~8s cycle with a reduced emissive range
 * — less video-game blink, more subtle standby indicator.
 */
export default function LED({
  position,
  color,
  scale = 1,
  floatSpeed = 1,
  floatOffset = 0,
}: Props) {
  const group = useRef<Group>(null);
  const bulbMat = useRef<MeshPhysicalMaterial>(null);
  const flangeMat = useRef<MeshPhysicalMaterial>(null);
  const light = useRef<PointLight>(null);

  // Per-instance random blink state. Each LED drifts through `breathing`
  // (the normal slow pulse) and occasionally dips into `dark` (blinks off)
  // or spikes into `flash` (bright pop). Timers are seeded with
  // floatOffset so different LEDs never sync up.
  const blink = useRef<{
    mode: "breathing" | "dark" | "flash";
    until: number;
  }>({
    mode: "breathing",
    until: 3 + ((floatOffset * 1.7) % 8) + Math.random() * 10,
  });

  const bulbGeometry = useMemo(() => {
    const pts: Vector2[] = [];
    pts.push(new Vector2(0.001, -0.28));
    pts.push(new Vector2(0.19, -0.28));
    pts.push(new Vector2(0.19, 0.02));
    pts.push(new Vector2(0.188, 0.06));
    pts.push(new Vector2(0.182, 0.1));
    pts.push(new Vector2(0.172, 0.14));
    pts.push(new Vector2(0.158, 0.18));
    pts.push(new Vector2(0.138, 0.22));
    pts.push(new Vector2(0.112, 0.26));
    pts.push(new Vector2(0.08, 0.29));
    pts.push(new Vector2(0.04, 0.305));
    pts.push(new Vector2(0.001, 0.31));
    const g = new LatheGeometry(pts, 64);
    g.computeVertexNormals();
    return g;
  }, []);

  const flangeGeometry = useMemo(
    () => new CylinderGeometry(0.215, 0.21, 0.03, 64),
    [],
  );
  const leadGeometry = useMemo(
    () => new CylinderGeometry(0.012, 0.012, 1, 16),
    [],
  );

  const anodeLen = 0.6;
  const cathodeLen = 0.5;

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime * floatSpeed + floatOffset;
    group.current.position.y = position[1] + Math.sin(t) * 0.09;
    group.current.rotation.y = Math.sin(t * 0.3) * 0.35;
    group.current.rotation.z = Math.cos(t * 0.22) * 0.08;

    // Slightly brighter breathing range so the vibrant colours glow
    // properly through the bloom pass.
    const elapsed = state.clock.elapsedTime;
    const breathe =
      0.55 + 0.35 * (0.5 + 0.5 * Math.sin(elapsed * 0.35 + floatOffset * 1.3));

    // Random blink state machine. Each LED schedules its next event
    // independently — most of the time breathing, occasionally blinking
    // off or spiking bright for a fraction of a second.
    if (elapsed > blink.current.until) {
      if (blink.current.mode === "breathing") {
        blink.current.mode = Math.random() > 0.5 ? "dark" : "flash";
        blink.current.until = elapsed + 0.04 + Math.random() * 0.22;
      } else {
        blink.current.mode = "breathing";
        blink.current.until = elapsed + 4 + Math.random() * 22;
      }
    }

    let intensity = breathe;
    if (blink.current.mode === "dark") intensity = 0.04;
    else if (blink.current.mode === "flash") intensity = 2.2;

    if (bulbMat.current) bulbMat.current.emissiveIntensity = intensity;
    if (flangeMat.current) flangeMat.current.emissiveIntensity = intensity * 0.35;
    if (light.current) light.current.intensity = 0.08 + intensity * 0.35;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Bulb — translucent cast resin */}
      <mesh geometry={bulbGeometry} castShadow>
        <meshPhysicalMaterial
          ref={bulbMat}
          color={color}
          emissive={color}
          emissiveIntensity={0.25}
          roughness={0.22}
          metalness={0.02}
          transmission={0.6}
          thickness={0.35}
          ior={1.52}
          clearcoat={0.6}
          clearcoatRoughness={0.15}
          attenuationColor={color}
          attenuationDistance={1.1}
        />
      </mesh>

      {/* Flange */}
      <mesh geometry={flangeGeometry} position={[0, -0.29, 0]}>
        <meshPhysicalMaterial
          ref={flangeMat}
          color={color}
          emissive={color}
          emissiveIntensity={0.1}
          roughness={0.55}
          metalness={0.05}
          transparent
          opacity={0.82}
        />
      </mesh>

      {/* Leads — tin-plated steel, slightly scuffed */}
      <mesh
        geometry={leadGeometry}
        position={[-0.07, -0.3 - anodeLen / 2, 0]}
        scale={[1, anodeLen, 1]}
      >
        <meshStandardMaterial color="#b9bcc2" metalness={0.92} roughness={0.34} />
      </mesh>
      <mesh
        geometry={leadGeometry}
        position={[0.07, -0.3 - cathodeLen / 2, 0]}
        scale={[1, cathodeLen, 1]}
      >
        <meshStandardMaterial color="#b9bcc2" metalness={0.92} roughness={0.34} />
      </mesh>

      {/* Ambient spill */}
      <pointLight
        ref={light}
        color={color}
        intensity={0.15}
        distance={2.2}
        decay={2.2}
        position={[0, 0.12, 0]}
      />
    </group>
  );
}
