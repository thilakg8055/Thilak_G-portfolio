import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const mesh = useRef();
  const count = 1500;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return arr;
  }, []);

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      // Mix between #00FFB3 (green) and #00D4FF (blue)
      arr[i * 3] = 0;
      arr[i * 3 + 1] = t * 0.83 + (1 - t) * 0.83;
      arr[i * 3 + 2] = t * 0.7 + (1 - t) * 1.0;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.03;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function FloatingRing() {
  const mesh = useRef();
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
      mesh.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });
  return (
    <mesh ref={mesh} position={[3, 0, -5]}>
      <torusGeometry args={[2, 0.02, 16, 60]} />
      <meshBasicMaterial color="#00FFB3" transparent opacity={0.3} />
    </mesh>
  );
}

function FloatingRing2() {
  const mesh = useRef();
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.4;
      mesh.current.rotation.z = -state.clock.elapsedTime * 0.08;
    }
  });
  return (
    <mesh ref={mesh} position={[-4, 1, -8]}>
      <torusGeometry args={[2.5, 0.015, 16, 60]} />
      <meshBasicMaterial color="#00D4FF" transparent opacity={0.2} />
    </mesh>
  );
}

export default function ThreeScene({ style }) {
  return (
    <div style={style} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Particles />
        <FloatingRing />
        <FloatingRing2 />
      </Canvas>
    </div>
  );
}
