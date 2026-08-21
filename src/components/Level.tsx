import { RigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

/* ═══════════════════════════════════════════
   THEMED BUILDING BLOCKS
   ═══════════════════════════════════════════ */

/* ── Platform (rounded edges) ── */
const Platform = ({ position, size = [10, 1.2, 10] as [number, number, number], color = '#ff69b4' }: {
  position: [number, number, number]; size?: [number, number, number]; color?: string
}) => (
  <RigidBody type="fixed" position={position}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.05} />
    </mesh>
    <mesh position={[0, size[1] / 2, 0]}>
      <boxGeometry args={[size[0] - 0.1, 0.12, size[2] - 0.1]} />
      <meshStandardMaterial color={color} roughness={0.15} metalness={0.15} />
    </mesh>
  </RigidBody>
);

/* ── Side Rail ── */
const Rail = ({ position, size = [0.5, 2, 30] as [number, number, number], color = '#ffb6c1' }: {
  position: [number, number, number]; size?: [number, number, number]; color?: string
}) => (
  <RigidBody type="fixed" position={position}>
    <mesh receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.35} transparent opacity={0.5} />
    </mesh>
  </RigidBody>
);

/* ── Checkpoint Flag ── */
const Checkpoint = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Pole */}
    <mesh castShadow>
      <cylinderGeometry args={[0.08, 0.08, 5, 8]} />
      <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.7} />
    </mesh>
    {/* Flag */}
    <mesh position={[0.6, 1.8, 0]}>
      <boxGeometry args={[1.2, 0.8, 0.05]} />
      <meshStandardMaterial color="#ff1493" roughness={0.3} />
    </mesh>
    {/* Star on top */}
    <mesh position={[0, 2.7, 0]}>
      <octahedronGeometry args={[0.2]} />
      <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.8} emissive="#ffd700" emissiveIntensity={0.4} />
    </mesh>
  </group>
);

/* ═══════════════════════════════════════════
   PATRICINHA THEMED OBSTACLES
   ═══════════════════════════════════════════ */

/* ── Giant Lipstick (rotating obstacle) ── */
const GiantLipstick = ({ position, speed = 1.5 }: { position: [number, number, number]; speed?: number }) => {
  const ref = useRef<any>();
  const rotation = useRef(0);
  useFrame((_, delta) => {
    if (ref.current) {
      rotation.current += delta * speed;
      const quat = new THREE.Quaternion();
      quat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current);
      ref.current.setNextKinematicRotation({ x: quat.x, y: quat.y, z: quat.z, w: quat.w });
    }
  });
  return (
    <RigidBody ref={ref} type="kinematicPosition" position={position} rotation={[0, 0, Math.PI / 2]}>
      <group>
        {/* Lipstick tube */}
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[0.6, 10, 8, 16]} />
          <meshStandardMaterial color="#c71585" roughness={0.2} metalness={0.15} />
        </mesh>
        {/* Lipstick tip (one end) */}
        <mesh position={[0, 6, 0]} castShadow>
          <coneGeometry args={[0.6, 1.2, 12]} />
          <meshStandardMaterial color="#ff1493" roughness={0.15} />
        </mesh>
        {/* Gold band */}
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 0.3, 12]} />
          <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.7} />
        </mesh>
      </group>
    </RigidBody>
  );
};

/* ── Perfume Bottle (swinging pendulum) ── */
const PerfumeBottle = ({ position, speed = 2, range = 6 }: {
  position: [number, number, number]; speed?: number; range?: number
}) => {
  const ref = useRef<any>();
  useFrame((state) => {
    if (ref.current) {
      ref.current.setNextKinematicTranslation({
        x: position[0] + Math.sin(state.clock.getElapsedTime() * speed) * range,
        y: position[1],
        z: position[2],
      });
    }
  });
  return (
    <RigidBody ref={ref} type="kinematicPosition" position={position}>
      <group>
        {/* Bottle body */}
        <mesh castShadow receiveShadow>
          <capsuleGeometry args={[1, 1.5, 8, 16]} />
          <meshStandardMaterial color="#e6b8ff" roughness={0.1} metalness={0.3} transparent opacity={0.85} />
        </mesh>
        {/* Bottle cap (spray nozzle) */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.4, 0.6, 8]} />
          <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.7} />
        </mesh>
        {/* Spray top */}
        <mesh position={[0, 2.2, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.7} />
        </mesh>
      </group>
    </RigidBody>
  );
};

/* ── Shopping Bag Bumper ── */
const ShoppingBag = ({ position, color = '#ff69b4' }: { position: [number, number, number]; color?: string }) => (
  <RigidBody type="fixed" position={position} restitution={2.2} friction={0}>
    <group>
      {/* Bag body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 2.5, 1.5]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.05} />
      </mesh>
      {/* Handle (left) */}
      <mesh position={[-0.4, 1.6, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.35, 0.06, 8, 12, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* Handle (right) */}
      <mesh position={[0.4, 1.6, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.35, 0.06, 8, 12, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
    </group>
  </RigidBody>
);

/* ── Frappuccino Spill (slippery floor zone) ── */
const FrappuccinoSpill = ({ position, size = [8, 0.15, 8] as [number, number, number] }: {
  position: [number, number, number]; size?: [number, number, number]
}) => (
  <RigidBody type="fixed" position={position} friction={0.01} restitution={0}>
    <mesh receiveShadow>
      <cylinderGeometry args={[size[0] / 2, size[2] / 2, size[1], 24]} />
      <meshStandardMaterial color="#d4a574" roughness={0.6} transparent opacity={0.7} />
    </mesh>
  </RigidBody>
);

/* ── Giant High Heel (decoration) ── */
const GiantHighHeel = ({ position, color = '#ff1493' }: { position: [number, number, number]; color?: string }) => (
  <group position={position}>
    {/* Sole */}
    <mesh castShadow>
      <boxGeometry args={[1.2, 0.3, 3]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.2} />
    </mesh>
    {/* Heel */}
    <mesh position={[0, 1, -1.1]} castShadow>
      <cylinderGeometry args={[0.15, 0.1, 2, 8]} />
      <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.6} />
    </mesh>
    {/* Toe curve */}
    <mesh position={[0, 0.3, 1.2]} castShadow>
      <sphereGeometry args={[0.55, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.2} />
    </mesh>
  </group>
);

/* ── Giant Vanity Mirror (glamorous decoration) ── */
const GiantMirror = ({ position, rotation = [0, 0, 0] as [number, number, number], scale = 1 }: { 
  position: [number, number, number]; rotation?: [number, number, number]; scale?: number 
}) => (
  <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
    {/* Ornate oval frame (outer) */}
    <mesh castShadow>
      <torusGeometry args={[2.2, 0.35, 12, 32]} />
      <meshStandardMaterial color="#ffd700" roughness={0.05} metalness={0.9} />
    </mesh>
    {/* Inner frame ring */}
    <mesh>
      <torusGeometry args={[1.9, 0.12, 8, 32]} />
      <meshStandardMaterial color="#ffec8b" roughness={0.08} metalness={0.85} />
    </mesh>
    {/* Mirror surface (reflective) */}
    <mesh>
      <circleGeometry args={[1.8, 32]} />
      <meshStandardMaterial color="#d8d8ff" roughness={0} metalness={1} />
    </mesh>
    {/* Mirror shine highlight */}
    <mesh position={[-0.4, 0.4, 0.02]}>
      <circleGeometry args={[0.5, 16]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.15} />
    </mesh>

    {/* Frame gems (top, bottom, left, right) */}
    <mesh position={[0, 2.35, 0]}>
      <octahedronGeometry args={[0.2]} />
      <meshStandardMaterial color="#ff69b4" roughness={0.05} metalness={0.6} emissive="#ff1493" emissiveIntensity={0.4} />
    </mesh>
    <mesh position={[0, -2.35, 0]}>
      <octahedronGeometry args={[0.15]} />
      <meshStandardMaterial color="#ff69b4" roughness={0.05} metalness={0.6} emissive="#ff1493" emissiveIntensity={0.3} />
    </mesh>
    <mesh position={[-2.35, 0, 0]}>
      <octahedronGeometry args={[0.15]} />
      <meshStandardMaterial color="#e0e0ff" roughness={0.05} metalness={0.6} emissive="#aaaaff" emissiveIntensity={0.3} />
    </mesh>
    <mesh position={[2.35, 0, 0]}>
      <octahedronGeometry args={[0.15]} />
      <meshStandardMaterial color="#e0e0ff" roughness={0.05} metalness={0.6} emissive="#aaaaff" emissiveIntensity={0.3} />
    </mesh>

    {/* Vanity light bulbs around frame */}
    {[...Array(8)].map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      return (
        <mesh key={i} position={[Math.cos(angle) * 2.5, Math.sin(angle) * 2.5, 0.15]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial 
            color="#fff8dc" 
            emissive="#ffd700" 
            emissiveIntensity={0.6} 
            roughness={0.1} 
          />
        </mesh>
      );
    })}

    {/* Stand */}
    <mesh position={[0, -3.2, 0]} castShadow>
      <cylinderGeometry args={[0.18, 0.25, 3, 8]} />
      <meshStandardMaterial color="#ffd700" roughness={0.08} metalness={0.85} />
    </mesh>
    {/* Base plate */}
    <mesh position={[0, -4.6, 0]} castShadow>
      <cylinderGeometry args={[0.8, 0.9, 0.2, 16]} />
      <meshStandardMaterial color="#ffd700" roughness={0.08} metalness={0.85} />
    </mesh>
  </group>
);

/* ── Moving Platform ── */
const MovingPlatform = ({ position, axis = 'x', speed = 1.5, range = 4, size = [5, 0.8, 5] as [number, number, number], color = '#da70d6' }: {
  position: [number, number, number]; axis?: 'x' | 'y'; speed?: number; range?: number;
  size?: [number, number, number]; color?: string
}) => {
  const ref = useRef<any>();
  useFrame((state) => {
    if (ref.current) {
      const offset = Math.sin(state.clock.getElapsedTime() * speed) * range;
      ref.current.setNextKinematicTranslation({
        x: position[0] + (axis === 'x' ? offset : 0),
        y: position[1] + (axis === 'y' ? offset : 0),
        z: position[2],
      });
    }
  });
  return (
    <RigidBody ref={ref} type="kinematicPosition" position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.25} />
      </mesh>
    </RigidBody>
  );
};

/* ── Decorative Pillar with Diamond ── */
const DiamondPillar = ({ position, color = '#ffc0cb' }: { position: [number, number, number]; color?: string }) => (
  <group position={position}>
    <mesh castShadow receiveShadow>
      <cylinderGeometry args={[0.35, 0.45, 4, 12]} />
      <meshStandardMaterial color={color} roughness={0.25} metalness={0.15} />
    </mesh>
    <mesh position={[0, 2.4, 0]} castShadow>
      <octahedronGeometry args={[0.4]} />
      <meshStandardMaterial color="#ff69b4" roughness={0.05} metalness={0.5} emissive="#ff1493" emissiveIntensity={0.3} />
    </mesh>
  </group>
);

/* ═══════════════════════════════════════════
   LEVEL LAYOUT
   ═══════════════════════════════════════════ */
export const Level = () => {
  const ballPositions = useMemo(() => [
    [-5, 4, -255], [3, 4, -260], [-2, 4, -265], [6, 4, -270],
    [-4, 4, -275], [2, 4, -280], [-6, 4, -285], [5, 4, -262],
    [0, 4, -268], [-3, 4, -278], [4, 4, -288], [-5, 4, -290],
  ], []);

  return (
    <>
      {/* ═══════════ SECTION 1: STARTING AREA (Shopping Mall Entrance) ═══════════ */}
      <Platform position={[0, -0.5, 0]} size={[24, 1.5, 24]} color="#ffe4e1" />
      
      <DiamondPillar position={[-10, 1.5, -10]} />
      <DiamondPillar position={[10, 1.5, -10]} />
      <DiamondPillar position={[-10, 1.5, 10]} />
      <DiamondPillar position={[10, 1.5, 10]} />

      {/* Giant heels as decoration at start */}
      <GiantHighHeel position={[-7, 1, 0]} color="#ff1493" />
      <GiantHighHeel position={[7, 1, 0]} color="#c71585" />

      {/* Vanity mirrors at start — left and right of entrance */}
      <GiantMirror position={[-10, 4, 0]} rotation={[0, Math.PI / 6, 0]} scale={0.8} />
      <GiantMirror position={[10, 4, 0]} rotation={[0, -Math.PI / 6, 0]} scale={0.8} />

      {/* ═══════════ SECTION 2: RAMP (Pink Carpet Descent) ═══════════ */}
      <RigidBody type="fixed" position={[0, -1.5, -22]} rotation={[0.12, 0, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[12, 1, 28]} />
          <meshStandardMaterial color="#ff69b4" roughness={0.25} />
        </mesh>
      </RigidBody>
      {/* Carpet stripes */}
      <RigidBody type="fixed" position={[0, -1, -22]} rotation={[0.12, 0, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[8, 0.15, 28]} />
          <meshStandardMaterial color="#c71585" roughness={0.3} />
        </mesh>
      </RigidBody>

      {/* ═══════════ SECTION 3: PERFUME GAUNTLET ═══════════ */}
      <Platform position={[0, -2.5, -55]} size={[12, 1.2, 45]} color="#ffb6c1" />
      <Rail position={[-6.5, -1, -55]} size={[0.5, 2, 45]} />
      <Rail position={[6.5, -1, -55]} size={[0.5, 2, 45]} />

      <PerfumeBottle position={[0, -0.5, -40]} speed={2.5} range={5} />
      <PerfumeBottle position={[0, -0.5, -52]} speed={2} range={5.5} />
      <PerfumeBottle position={[0, -0.5, -64]} speed={3} range={4.5} />

      {/* ── CHECKPOINT 1 ── */}
      <Checkpoint position={[-5.5, -1, -72]} />

      {/* ═══════════ SECTION 4: FRAPPUCCINO SLIPPERY ZONE ═══════════ */}
      <Platform position={[0, -2.5, -95]} size={[14, 1.2, 30]} color="#f8d7e0" />
      <Rail position={[-7.5, -1, -95]} size={[0.5, 2, 30]} />
      <Rail position={[7.5, -1, -95]} size={[0.5, 2, 30]} />

      <FrappuccinoSpill position={[2, -1.8, -88]} size={[6, 0.15, 6]} />
      <FrappuccinoSpill position={[-3, -1.8, -98]} size={[7, 0.15, 7]} />
      <FrappuccinoSpill position={[1, -1.8, -105]} size={[5, 0.15, 5]} />

      {/* Shopping bag bumpers in the slippery zone */}
      <ShoppingBag position={[4, -0.5, -90]} color="#ff69b4" />
      <ShoppingBag position={[-4, -0.5, -95]} color="#da70d6" />
      <ShoppingBag position={[3, -0.5, -103]} color="#c71585" />

      {/* Mirrors flanking frappuccino zone (dressing room vibe) */}
      <GiantMirror position={[-9, 2, -88]} rotation={[0, 0.4, 0]} scale={0.7} />
      <GiantMirror position={[9, 2, -95]} rotation={[0, -0.4, 0]} scale={0.7} />
      <GiantMirror position={[-9, 2, -103]} rotation={[0, 0.4, 0]} scale={0.7} />

      {/* ═══════════ SECTION 5: PLATFORM JUMPS (VIP Rope Jumps) ═══════════ */}
      <Platform position={[-2, -2.5, -120]} size={[6, 1.2, 6]} color="#ff69b4" />
      <Platform position={[3, -2.5, -130]} size={[5, 1.2, 5]} color="#da70d6" />
      <Platform position={[-3, -2, -140]} size={[5, 1.2, 5]} color="#ff69b4" />
      <Platform position={[2, -1.5, -150]} size={[5, 1.2, 5]} color="#c71585" />
      <Platform position={[0, -1.5, -160]} size={[6, 1.2, 6]} color="#da70d6" />

      {/* ── CHECKPOINT 2 ── */}
      <Checkpoint position={[-4, 0.5, -160]} />

      {/* ═══════════ SECTION 6: LIPSTICK SPINNING ARENA ═══════════ */}
      <Platform position={[0, -2.5, -180]} size={[20, 1.2, 24]} color="#ffb6c1" />
      <Rail position={[-10.5, -1, -180]} size={[0.5, 2, 24]} />
      <Rail position={[10.5, -1, -180]} size={[0.5, 2, 24]} />

      <GiantLipstick position={[0, -0.5, -175]} speed={1.6} />
      <GiantLipstick position={[0, -0.5, -185]} speed={-2} />

      {/* Decorative mirrors — Lipstick Arena walls */}
      <GiantMirror position={[-13, 2, -172]} rotation={[0, 0.3, 0]} />
      <GiantMirror position={[13, 2, -172]} rotation={[0, -0.3, 0]} />
      <GiantMirror position={[-13, 2, -182]} rotation={[0, 0.3, 0]} />
      <GiantMirror position={[13, 2, -182]} rotation={[0, -0.3, 0]} />

      {/* ═══════════ SECTION 7: MOVING PLATFORMS (Catwalk Segments) ═══════════ */}
      <MovingPlatform position={[0, -2.5, -205]} axis="x" speed={1.2} range={5} size={[5, 0.8, 5]} color="#ff69b4" />
      <MovingPlatform position={[0, -2.5, -215]} axis="x" speed={1.8} range={6} size={[4.5, 0.8, 4.5]} color="#da70d6" />
      <MovingPlatform position={[0, -1.5, -225]} axis="y" speed={1.4} range={3} size={[5, 0.8, 5]} color="#c71585" />
      <MovingPlatform position={[0, -2, -235]} axis="x" speed={2} range={4} size={[4, 0.8, 4]} color="#ff69b4" />

      {/* ── CHECKPOINT 3 ── */}
      <Platform position={[0, -2.5, -245]} size={[10, 1.2, 8]} color="#ffb6c1" />
      <Checkpoint position={[-4, -0.5, -245]} />

      {/* ═══════════ SECTION 8: SHOPPING BAG BOWLING + PHYSICS BALLS ═══════════ */}
      <Platform position={[0, -2.5, -275]} size={[22, 1.2, 55]} color="#ff85a2" />
      <Rail position={[-11.5, -1, -275]} size={[0.5, 2, 55]} />
      <Rail position={[11.5, -1, -275]} size={[0.5, 2, 55]} />

      <ShoppingBag position={[-4, -0.5, -258]} color="#ffd700" />
      <ShoppingBag position={[4, -0.5, -263]} color="#ff69b4" />
      <ShoppingBag position={[0, -0.5, -270]} color="#da70d6" />
      <ShoppingBag position={[-5, -0.5, -280]} color="#c71585" />
      <ShoppingBag position={[5, -0.5, -277]} color="#ffd700" />
      <ShoppingBag position={[0, -0.5, -288]} color="#ff69b4" />

      {ballPositions.map((pos, i) => (
        <RigidBody key={i} position={pos as [number, number, number]} colliders="ball" mass={0.4} restitution={0.9}>
          <mesh castShadow>
            <sphereGeometry args={[1, 20, 20]} />
            <meshStandardMaterial
              color={['#ffd700', '#ff69b4', '#da70d6', '#ff1493'][i % 4]}
              roughness={0.15}
              metalness={0.35}
            />
          </mesh>
        </RigidBody>
      ))}

      {/* ═══════════ SECTION 9: FINAL PERFUME GAUNTLET (narrow) ═══════════ */}
      <Platform position={[0, -2.5, -315]} size={[8, 1.2, 24]} color="#c71585" />
      <Rail position={[-4.5, -1, -315]} size={[0.5, 2, 24]} />
      <Rail position={[4.5, -1, -315]} size={[0.5, 2, 24]} />

      <PerfumeBottle position={[0, -0.5, -308]} speed={3.5} range={3} />
      <PerfumeBottle position={[0, -0.5, -318]} speed={2.8} range={3.5} />
      <PerfumeBottle position={[0, -0.5, -325]} speed={3.2} range={3} />

      {/* ── CHECKPOINT 4 ── */}
      <Checkpoint position={[-3.5, -0.5, -325]} />

      {/* ═══════════ SECTION 10: LAST JUMPS TO VIP ═══════════ */}
      <Platform position={[0, -2.5, -340]} size={[6, 1.2, 6]} color="#ff69b4" />
      <Platform position={[3, -2, -350]} size={[5, 1.2, 5]} color="#da70d6" />
      <Platform position={[-2, -1.5, -360]} size={[5, 1.2, 5]} color="#c71585" />
      <Platform position={[0, -1.5, -372]} size={[6, 1.2, 6]} color="#ff69b4" />

      {/* ═══════════ FINISH: VIP AREA ═══════════ */}
      <Platform position={[0, -2.5, -400]} size={[30, 1.5, 30]} color="#ffd700" />

      <DiamondPillar position={[-12, -0.5, -387]} color="#ffd700" />
      <DiamondPillar position={[12, -0.5, -387]} color="#ffd700" />
      <DiamondPillar position={[-12, -0.5, -413]} color="#ffd700" />
      <DiamondPillar position={[12, -0.5, -413]} color="#ffd700" />

      <GiantHighHeel position={[-8, -0.5, -400]} color="#ffd700" />
      <GiantHighHeel position={[8, -0.5, -400]} color="#ffd700" />

      {/* Grand vanity mirrors flanking VIP runway */}
      <GiantMirror position={[-14, 3, -393]} rotation={[0, 0.3, 0]} scale={1.2} />
      <GiantMirror position={[14, 3, -393]} rotation={[0, -0.3, 0]} scale={1.2} />
      <GiantMirror position={[-14, 3, -407]} rotation={[0, 0.3, 0]} scale={1.2} />
      <GiantMirror position={[14, 3, -407]} rotation={[0, -0.3, 0]} scale={1.2} />

      {/* Finish line archway — DECORATIVE ONLY (no RigidBody = no wall!) */}
      <group position={[0, 2.5, -387]}>
        {/* Arch pillars */}
        <mesh position={[-6, 0, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 8, 12]} />
          <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.7} />
        </mesh>
        <mesh position={[6, 0, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 8, 12]} />
          <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.7} />
        </mesh>
        {/* Arch top bar */}
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[13, 1, 1]} />
          <meshStandardMaterial color="#ffd700" roughness={0.1} metalness={0.7} />
        </mesh>
        {/* VIP text backing */}
        <mesh position={[0, 4, 0.6]}>
          <boxGeometry args={[5, 1.5, 0.1]} />
          <meshStandardMaterial color="#ff1493" roughness={0.2} emissive="#ff1493" emissiveIntensity={0.2} />
        </mesh>
        {/* Star decorations */}
        <mesh position={[-4, 4.8, 0]}>
          <octahedronGeometry args={[0.4]} />
          <meshStandardMaterial color="#ff69b4" roughness={0.05} metalness={0.5} emissive="#ff1493" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[4, 4.8, 0]}>
          <octahedronGeometry args={[0.4]} />
          <meshStandardMaterial color="#ff69b4" roughness={0.05} metalness={0.5} emissive="#ff1493" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0, 5.2, 0]}>
          <octahedronGeometry args={[0.5]} />
          <meshStandardMaterial color="#ffd700" roughness={0.05} metalness={0.7} emissive="#ffd700" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </>
  );
};
