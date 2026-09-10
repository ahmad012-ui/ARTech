import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SceneCanvas, useIsMobile } from "./SceneCanvas";

function Core({ reduced, variant }: { reduced: boolean; variant: "tech" | "cta" }) {
  const group = useRef<THREE.Group>(null);
  const p = useRef({ x: 0, y: 0 });

  const dust = useMemo(() => {
    const count = reduced ? 80 : variant === "cta" ? 300 : 160;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return positions;
  }, [reduced, variant]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    p.current.x += (state.pointer.x - p.current.x) * 0.03;
    p.current.y += (state.pointer.y - p.current.y) * 0.03;
    g.rotation.y += delta * 0.1;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -p.current.y * 0.2, 0.05);
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.6, 24, 16]} />
        <meshBasicMaterial wireframe color="#7fa9c9" transparent opacity={0.22} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.58, 0]} />
        <meshStandardMaterial
          color="#0d1317"
          metalness={0.95}
          roughness={0.2}
          emissive="#12333f"
          emissiveIntensity={0.35}
          flatShading
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshBasicMaterial wireframe color="#cfe8f5" transparent opacity={0.4} />
      </mesh>

      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.7, i * 0.4, 0]}>
          <torusGeometry args={[2.2 + i * 0.35, 0.006, 6, 96]} />
          <meshBasicMaterial color="#a9cfe4" transparent opacity={0.28} />
        </mesh>
      ))}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="#8fa8b8" transparent opacity={0.45} sizeAttenuation />
      </points>
    </group>
  );
}

export function CoreScene({ variant = "tech" }: { variant?: "tech" | "cta" }) {
  const mobile = useIsMobile();
  return (
    <SceneCanvas className="absolute inset-0" camera={{ position: [0, 0, 7], fov: 45 }}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1} color="#bcdcf0" />
      <pointLight position={[-4, -3, -2]} intensity={16} color="#245a72" distance={16} />
      <Core reduced={mobile} variant={variant} />
    </SceneCanvas>
  );
}
