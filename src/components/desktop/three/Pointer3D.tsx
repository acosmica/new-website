"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ExtrudeGeometry, Group, Shape } from "three";

type Props = {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  floatSpeed?: number;
  floatOffset?: number;
  tint?: string;
};

/**
 * Modern OS cursor — rounded, beveled, matte neutral grey.
 * Material intentionally non-pearly so the pointer reads as a rendered
 * UI element rather than a toy charm.
 */
export default function Pointer3D({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  floatSpeed = 0.8,
  floatOffset = 0,
  tint = "#ededed",
}: Props) {
  const group = useRef<Group>(null);

  const geometry = useMemo(() => {
    const s = new Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0.02, -0.35, 0.04, -0.7, 0.06, -1.1);
    s.quadraticCurveTo(0.2, -1.0, 0.32, -0.9);
    s.lineTo(0.52, -1.25);
    s.quadraticCurveTo(0.6, -1.28, 0.66, -1.24);
    s.lineTo(0.48, -0.88);
    s.quadraticCurveTo(0.6, -0.8, 0.78, -0.74);
    s.bezierCurveTo(0.58, -0.5, 0.3, -0.25, 0, 0);

    const g = new ExtrudeGeometry(s, {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.018,
      bevelSegments: 4,
      curveSegments: 32,
    });
    g.center();
    g.computeVertexNormals();
    return g;
  }, []);

  const edgeGeometry = useMemo(() => {
    const clone = geometry.clone();
    clone.scale(1.06, 1.06, 0.6);
    return clone;
  }, [geometry]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime * floatSpeed + floatOffset;
    group.current.position.y = position[1] + Math.sin(t) * 0.12;
    group.current.position.x = position[0] + Math.cos(t * 0.7) * 0.07;
    group.current.rotation.y = rotation[1] + Math.sin(t * 0.5) * 0.28;
    group.current.rotation.z = rotation[2] + Math.cos(t * 0.6) * 0.14;
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      {/* Soft rim — mid grey, just enough to hold the silhouette */}
      <mesh geometry={edgeGeometry} position={[0, 0, -0.02]}>
        <meshStandardMaterial color="#9a9a9a" roughness={0.75} metalness={0.06} />
      </mesh>
      {/* Main body — light neutral, matte-satin so it catches light */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={tint}
          roughness={0.42}
          metalness={0.06}
          clearcoat={0.2}
          clearcoatRoughness={0.35}
          reflectivity={0.22}
        />
      </mesh>
    </group>
  );
}
