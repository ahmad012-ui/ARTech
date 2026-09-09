import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { SceneCanvas } from "./SceneCanvas";

export type IconKind = "cube" | "layers" | "network" | "product";

function Shape({ kind }: { kind: IconKind }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.35;
    ref.current.rotation.x += delta * 0.12;
  });

  return (
    <group ref={ref}>
      {kind === "cube" && (
        <mesh>
          <boxGeometry args={[1.15, 1.15, 1.15]} />
          <meshBasicMaterial wireframe color="#a9cfe4" transparent opacity={0.7} />
        </mesh>
      )}
      {kind === "layers" &&
        [-0.4, 0, 0.4].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.45, 0.78, 4]} />
            <meshBasicMaterial color="#a9cfe4" transparent opacity={0.55} />
          </mesh>
        ))}
      {kind === "network" && (
        <mesh>
          <icosahedronGeometry args={[0.9, 1]} />
          <meshBasicMaterial wireframe color="#a9cfe4" transparent opacity={0.6} />
        </mesh>
      )}
      {kind === "product" && (
        <mesh>
          <torusKnotGeometry args={[0.6, 0.14, 90, 12]} />
          <meshStandardMaterial
            color="#101820"
            metalness={0.9}
            roughness={0.3}
            emissive="#1d4457"
            emissiveIntensity={0.7}
          />
        </mesh>
      )}
    </group>
  );
}

export function IconScene({ kind }: { kind: IconKind }) {
  return (
    <SceneCanvas className="h-16 w-16" camera={{ position: [0, 0, 3.2], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 2]} intensity={1.1} color="#cfe6f5" />
      <Shape kind={kind} />
    </SceneCanvas>
  );
}
