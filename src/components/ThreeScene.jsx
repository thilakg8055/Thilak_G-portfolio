import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

const ACID = "#00FFB3";
const BLUE = "#00D4FF";

// Mouse position in normalized device coords, tracked on window because the
// hero content sits above the canvas and swallows its pointer events.
function useWindowPointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return pointer;
}

/* ------------------------------------------------------------------ */
/* Robotic arm: base yaw + analytic 2-bone IK + wrist + gripper        */
/* ------------------------------------------------------------------ */

const H = 1.1; // shoulder height above base
const L1 = 2.3; // upper arm
const L2 = 2.1; // forearm
const GRIP = 0.9; // wrist -> claw tip

function Metal({ color = "#0D1F2D", edge = ACID, edgeOpacity = 0.55 }) {
  return (
    <>
      <meshStandardMaterial color={color} metalness={0.85} roughness={0.28} />
      <Edges threshold={20} color={edge} transparent opacity={edgeOpacity} />
    </>
  );
}

function Joint({ r = 0.32, color = ACID }) {
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r, r, 0.62, 24]} />
        <Metal color="#132a3a" edgeOpacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r * 0.72, 0.035, 8, 32]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function RobotArm({ targetRef, telemetryRef, pointer, scale = 1 }) {
  const base = useRef();
  const shoulder = useRef();
  const elbow = useRef();
  const wrist = useRef();
  const clawA = useRef();
  const clawB = useRef();
  const laser = useRef();
  const ledRing = useRef();
  const smoothed = useRef(new THREE.Vector3(2, 1, 1));
  const local = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    if (!targetRef.current || !base.current) return;
    const t = state.clock.elapsedTime;

    // Wrist hovers above the AI core so the claws point down at it.
    const desired = targetRef.current.position.clone();
    desired.y += (GRIP + 0.55) * scale;
    smoothed.current.lerp(desired, 1 - Math.pow(0.02, dt));

    // Target in the arm's local space.
    local.copy(smoothed.current);
    base.current.parent.worldToLocal(local);

    const yaw = Math.atan2(-local.z, local.x);
    const r = Math.hypot(local.x, local.z);
    const y = local.y - H;
    const d = Math.min(Math.hypot(r, y), L1 + L2 - 0.05);
    const cosE = THREE.MathUtils.clamp((d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2), -1, 1);
    const e = Math.acos(cosE);
    const s = Math.atan2(y, r) + Math.atan2(L2 * Math.sin(e), L1 + L2 * Math.cos(e));

    base.current.rotation.y = yaw;
    shoulder.current.rotation.z = s;
    elbow.current.rotation.z = -e;
    // Keep the gripper pointing straight down, with a little servo jitter.
    wrist.current.rotation.z = -Math.PI / 2 - s + e + Math.sin(t * 7) * 0.012;
    wrist.current.rotation.x = Math.sin(t * 0.8) * 0.25 + pointer.current.x * 0.3;

    // Claws breathe open/closed.
    const open = 0.28 + (Math.sin(t * 1.6) * 0.5 + 0.5) * 0.32;
    clawA.current.rotation.z = open;
    clawB.current.rotation.z = -open;

    // Scanning laser flicker + base LED chase.
    laser.current.material.opacity = 0.35 + Math.random() * 0.35;
    laser.current.scale.x = laser.current.scale.z = 0.7 + Math.random() * 0.6;
    ledRing.current.rotation.y = t * 2;

    if (telemetryRef) {
      const deg = (v) => THREE.MathUtils.radToDeg(v);
      telemetryRef.current = {
        j1: deg(yaw),
        j2: deg(s),
        j3: deg(-e),
        j4: deg(wrist.current.rotation.z),
        grip: open,
        x: smoothed.current.x,
        y: smoothed.current.y,
        z: smoothed.current.z,
      };
    }
  });

  return (
    <group ref={base}>
      {/* Base plinth */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.95, 1.1, 0.3, 32]} />
        <Metal />
      </mesh>
      <group ref={ledRing} position={[0, 0.32, 0]}>
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.78, 0, Math.sin(a) * 0.78]}>
              <boxGeometry args={[0.08, 0.04, 0.08]} />
              <meshBasicMaterial color={i % 3 === 0 ? BLUE : ACID} toneMapped={false} />
            </mesh>
          );
        })}
      </group>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.45, 0.6, 0.7, 24]} />
        <Metal />
      </mesh>

      {/* Shoulder */}
      <group ref={shoulder} position={[0, H, 0]}>
        <Joint r={0.38} />
        <mesh position={[L1 / 2, 0, 0]}>
          <boxGeometry args={[L1, 0.34, 0.42]} />
          <Metal />
        </mesh>
        {/* Hydraulic piston detail */}
        <mesh position={[L1 / 2, -0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, L1 * 0.7, 8]} />
          <meshStandardMaterial color="#5a6b78" metalness={1} roughness={0.2} />
        </mesh>

        {/* Elbow */}
        <group ref={elbow} position={[L1, 0, 0]}>
          <Joint r={0.3} color={BLUE} />
          <mesh position={[L2 / 2, 0, 0]}>
            <boxGeometry args={[L2, 0.26, 0.32]} />
            <Metal edge={BLUE} />
          </mesh>
          {/* Cable run */}
          <mesh position={[L2 / 2, 0.18, 0]}>
            <boxGeometry args={[L2 * 0.8, 0.03, 0.06]} />
            <meshBasicMaterial color={ACID} toneMapped={false} />
          </mesh>

          {/* Wrist + gripper */}
          <group ref={wrist} position={[L2, 0, 0]}>
            <Joint r={0.2} />
            <mesh position={[0.25, 0, 0]}>
              <cylinderGeometry args={[0.16, 0.2, 0.3, 16]} />
              <Metal />
            </mesh>
            <mesh position={[0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.5, 0.12, 0.3]} />
              <Metal />
            </mesh>
            <group ref={clawA} position={[0.5, 0.18, 0]}>
              <mesh position={[0.3, 0, 0]}>
                <boxGeometry args={[0.5, 0.06, 0.18]} />
                <Metal edge={BLUE} />
              </mesh>
            </group>
            <group ref={clawB} position={[0.5, -0.18, 0]}>
              <mesh position={[0.3, 0, 0]}>
                <boxGeometry args={[0.5, 0.06, 0.18]} />
                <Metal edge={BLUE} />
              </mesh>
            </group>
            {/* Tractor / scan beam */}
            <mesh ref={laser} position={[0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.06, 0.6, 8, 1, true]} />
              <meshBasicMaterial color={ACID} transparent opacity={0.5} toneMapped={false} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* AI core the arm is tracking                                         */
/* ------------------------------------------------------------------ */

function AICore({ coreRef, anchor, pointer, scale = 1 }) {
  const inner = useRef();
  const shell = useRef();
  const orbit = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Lissajous drift, nudged toward the mouse.
    coreRef.current.position.set(
      anchor[0] + (Math.sin(t * 0.55) * 0.9 + pointer.current.x * 0.5) * scale,
      anchor[1] + (Math.sin(t * 0.9) * 0.4 + pointer.current.y * 0.3) * scale,
      anchor[2] + Math.cos(t * 0.45) * 0.9 * scale
    );
    inner.current.rotation.x = t * 0.7;
    inner.current.rotation.y = t * 0.9;
    shell.current.rotation.y = -t * 0.4;
    shell.current.rotation.z = t * 0.25;
    orbit.current.rotation.x = Math.PI / 2 + Math.sin(t) * 0.3;
    orbit.current.rotation.z = t * 1.5;
    const pulse = 1 + Math.sin(t * 3) * 0.06;
    inner.current.scale.setScalar(pulse);
  });

  return (
    <group ref={coreRef} scale={scale}>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.32, 0]} />
        <meshBasicMaterial color={ACID} toneMapped={false} />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshBasicMaterial color={BLUE} wireframe transparent opacity={0.45} />
      </mesh>
      <mesh ref={orbit}>
        <torusGeometry args={[0.85, 0.012, 8, 64]} />
        <meshBasicMaterial color={ACID} transparent opacity={0.7} />
      </mesh>
      <pointLight color={ACID} intensity={6} distance={6} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Neural network constellation with signal pulses                     */
/* ------------------------------------------------------------------ */

function NeuralNet({ count = 90, radius = 9 }) {
  const group = useRef();
  const pulses = useRef();

  const { nodes, linePositions, edges } = useMemo(() => {
    const nodes = [];
    for (let i = 0; i < count; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(radius * (0.45 + Math.random() * 0.55));
      v.z -= 6;
      nodes.push(v);
    }
    const edges = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 3.1) edges.push([i, j]);
      }
    }
    const linePositions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], k) => {
      nodes[a].toArray(linePositions, k * 6);
      nodes[b].toArray(linePositions, k * 6 + 3);
    });
    return { nodes, linePositions, edges };
  }, [count, radius]);

  const nodePositions = useMemo(() => {
    const arr = new Float32Array(nodes.length * 3);
    nodes.forEach((n, i) => n.toArray(arr, i * 3));
    return arr;
  }, [nodes]);

  const PULSES = 40;
  const neighbors = useMemo(() => {
    const adj = nodes.map(() => []);
    edges.forEach(([a, b]) => {
      adj[a].push(b);
      adj[b].push(a);
    });
    return adj;
  }, [nodes, edges]);
  const pulseState = useMemo(() => {
    const connected = neighbors.map((n, i) => (n.length ? i : -1)).filter((i) => i >= 0);
    return Array.from({ length: connected.length ? PULSES : 0 }, () => {
      const from = connected[Math.floor(Math.random() * connected.length)];
      const to = neighbors[from][Math.floor(Math.random() * neighbors[from].length)];
      return { from, to, t: Math.random(), speed: 0.3 + Math.random() * 0.8 };
    });
  }, [neighbors]);
  const pulsePositions = useMemo(() => new Float32Array(PULSES * 3), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.03;
    group.current.rotation.x = Math.sin(t * 0.1) * 0.1;
    pulseState.forEach((p, i) => {
      p.t += dt * p.speed;
      if (p.t >= 1) {
        // Hop to a neighbouring synapse so signals propagate through the graph.
        const next = neighbors[p.to];
        p.from = p.to;
        p.to = next[Math.floor(Math.random() * next.length)];
        p.t = 0;
      }
      tmp.lerpVectors(nodes[p.from], nodes[p.to], p.t).toArray(pulsePositions, i * 3);
    });
    pulses.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={BLUE} transparent opacity={0.12} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={nodes.length} array={nodePositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color={ACID} size={0.09} transparent opacity={0.8} sizeAttenuation />
      </points>
      <points ref={pulses}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={PULSES} array={pulsePositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#ffffff" size={0.16} transparent opacity={0.95} sizeAttenuation toneMapped={false} />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Holographic floor + rising data streams                             */
/* ------------------------------------------------------------------ */

function HoloFloor({ x = 0, y }) {
  const grid = useRef();
  const scan = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    grid.current.position.z = (t * 0.6) % 1;
    const s = (t * 0.35) % 1;
    scan.current.scale.setScalar(0.2 + s * 5);
    scan.current.material.opacity = (1 - s) * 0.5;
  });
  return (
    <group position={[0, y, 0]}>
      <gridHelper ref={grid} args={[40, 40, ACID, "#0b3b3a"]} material-transparent material-opacity={0.25} />
      <mesh ref={scan} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, 0]}>
        <ringGeometry args={[0.95, 1, 64]} />
        <meshBasicMaterial color={ACID} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function DataStreams({ count = 260 }) {
  const ref = useRef();
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      speeds[i] = 0.4 + Math.random() * 1.4;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((_, dt) => {
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * dt;
      if (arr[i * 3 + 1] > 7) arr[i * 3 + 1] = -7;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={BLUE} size={0.035} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ------------------------------------------------------------------ */

function Rig({ telemetryRef }) {
  const { viewport } = useThree();
  const pointer = useWindowPointer();
  const core = useRef();
  const narrow = viewport.width < 12;

  // Arm sits to the right on desktop, centered and smaller behind text on mobile.
  const armScale = narrow ? 0.75 : 1.15;
  const armPos = narrow ? [1.2, -viewport.height / 2 + 0.4, -3] : [viewport.width * 0.26, -3.8, 0];
  // Core floats in front of the arm, well inside its reach envelope.
  const coreAnchor = [armPos[0] - 2.0 * armScale, armPos[1] + 1.9 * armScale, armPos[2] + 0.5 * armScale];

  useFrame((state) => {
    // Subtle camera parallax.
    state.camera.position.x += (pointer.current.x * 0.8 - state.camera.position.x) * 0.03;
    state.camera.position.y += (pointer.current.y * 0.5 + 0.4 - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, -0.5, 0);
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 6]} intensity={1.4} color="#cfefff" />
      <directionalLight position={[-6, -2, -4]} intensity={0.6} color={BLUE} />

      <NeuralNet />
      <DataStreams />
      <HoloFloor x={armPos[0]} y={armPos[1]} />

      {/* Rotated so the arm's rest pose faces the core (and the text) */}
      <group position={armPos} scale={armScale} rotation={[0, Math.PI, 0]}>
        <RobotArm targetRef={core} telemetryRef={telemetryRef} pointer={pointer} scale={armScale} />
      </group>
      <AICore coreRef={core} anchor={coreAnchor} pointer={pointer} scale={armScale} />
    </>
  );
}

export default function ThreeScene({ style, telemetryRef }) {
  const wrapper = useRef();
  const [visible, setVisible] = useState(true);

  // Stop rendering when the hero scrolls out of view.
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (wrapper.current) io.observe(wrapper.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapper} style={style} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.4, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={["#050A0E", 9, 26]} />
        <Rig telemetryRef={telemetryRef} />
      </Canvas>
    </div>
  );
}
