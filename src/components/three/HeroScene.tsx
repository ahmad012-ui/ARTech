import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SceneCanvas, useIsMobile } from "./SceneCanvas";

function Framework({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const nodes = useMemo(() => {
    const count = reduced ? 14 : 26;
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.1;
      arr.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta),
        ),
      );
    }
    return arr;
  }, [reduced]);

  const dust = useMemo(() => {
    const count = reduced ? 90 : 220;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return positions;
  }, [reduced]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    pointer.current.x += (state.pointer.x - pointer.current.x) * 0.04;
    pointer.current.y += (state.pointer.y - pointer.current.y) * 0.04;
    g.rotation.y += delta * 0.12;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.current.y * 0.28, 0.06);
    g.position.x = THREE.MathUtils.lerp(g.position.x, pointer.current.x * 0.35, 0.06);
    if (inner.current) inner.current.rotation.z -= delta * 0.18;
  });

  return (
    <group ref={group} scale={0.78}>
      <mesh>
        <icosahedronGeometry args={[2.1, 1]} />
        <meshBasicMaterial wireframe color="#7fa9c9" transparent opacity={0.28} />
      </mesh>

      <mesh ref={inner} castShadow>
        <icosahedronGeometry args={[0.62, 0]} />
        <meshStandardMaterial
          color="#0e1418"
          metalness={0.9}
          roughness={0.25}
          emissive="#12333f"
          emissiveIntensity={0.35}
          flatShading
        />
      </mesh>

      <mesh>
        <icosahedronGeometry args={[0.64, 0]} />
        <meshBasicMaterial wireframe color="#cfe8f5" transparent opacity={0.45} />
      </mesh>


      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.75, 0.008, 8, 128]} />
        <meshBasicMaterial color="#9fd0e8" transparent opacity={0.35} />
      </mesh>

      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#cfe8f5" transparent opacity={0.75} />
        </mesh>
      ))}

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.022} color="#8fa8b8" transparent opacity={0.5} sizeAttenuation />
      </points>
    </group>
  );
}

export function HeroScene() {
  const mobile = useIsMobile();
  return (
    <SceneCanvas
      className="absolute inset-0"
      camera={{ position: [0, 0, 8.4], fov: 40 }}
      shadows={false}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 4]} intensity={1.2} color="#bcdcf0" />
      <pointLight position={[-4, -2, -3]} intensity={18} color="#2a5f7a" distance={14} />
      <Framework reduced={mobile} />
    </SceneCanvas>
  );
}
