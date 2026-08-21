import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { usePlayerControls } from '../hooks/usePlayerControls';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════
   ✨ PATRICINHA — Chibi Diva Character (polished & cute)
   
   Design: Big round head (60% of height), tiny bean body,
   oversized glamorous hair, sparkly accessories.
   Inspired by Bratz / chibi anime proportions.
   ═══════════════════════════════════════════════════════════════ */
const PatricinhaCharacter = () => {
  const skinColor = '#fde0c4';
  const hairColor = '#f7c948';
  const hairDark = '#daa520';
  const dressColor = '#ff1493';
  const dressDark = '#c71585';
  const shoeColor = '#ff69b4';
  const goldColor = '#ffd700';

  return (
    <group scale={[1.1, 1.1, 1.1]}>

      {/* ╔══════════════════════════════════╗
          ║         BIG CHIBI HEAD           ║
          ╚══════════════════════════════════╝ */}
      <group position={[0, 1.65, 0]}>
        {/* Main head sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.72, 32, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.35} />
        </mesh>

        {/* ── EYES (big anime-style) ── */}
        {/* Left eye white */}
        <mesh position={[-0.22, 0, 0.6]} rotation={[0, -0.15, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Left iris */}
        <mesh position={[-0.2, 0, 0.7]} rotation={[0, -0.1, 0]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color="#6b3fa0" roughness={0.15} />
        </mesh>
        {/* Left pupil */}
        <mesh position={[-0.19, 0, 0.74]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.1} />
        </mesh>
        {/* Left eye sparkle (big) */}
        <mesh position={[-0.14, 0.06, 0.76]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
        {/* Left eye sparkle (small) */}
        <mesh position={[-0.24, -0.03, 0.75]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>

        {/* Right eye white */}
        <mesh position={[0.22, 0, 0.6]} rotation={[0, 0.15, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        {/* Right iris */}
        <mesh position={[0.2, 0, 0.7]} rotation={[0, 0.1, 0]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color="#6b3fa0" roughness={0.15} />
        </mesh>
        {/* Right pupil */}
        <mesh position={[0.19, 0, 0.74]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.1} />
        </mesh>
        {/* Right eye sparkle (big) */}
        <mesh position={[0.24, 0.06, 0.76]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
        </mesh>
        {/* Right eye sparkle (small) */}
        <mesh position={[0.14, -0.03, 0.75]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>

        {/* ── EYELASHES (thick, glamorous) ── */}
        {/* Left upper lashes */}
        <mesh position={[-0.22, 0.14, 0.62]} rotation={[0.5, -0.1, -0.1]}>
          <boxGeometry args={[0.26, 0.035, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        {/* Left lash wing */}
        <mesh position={[-0.35, 0.12, 0.56]} rotation={[0.4, -0.2, -0.35]}>
          <boxGeometry args={[0.1, 0.03, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        {/* Right upper lashes */}
        <mesh position={[0.22, 0.14, 0.62]} rotation={[0.5, 0.1, 0.1]}>
          <boxGeometry args={[0.26, 0.035, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>
        {/* Right lash wing */}
        <mesh position={[0.35, 0.12, 0.56]} rotation={[0.4, 0.2, 0.35]}>
          <boxGeometry args={[0.1, 0.03, 0.02]} />
          <meshStandardMaterial color="#1a1a2e" />
        </mesh>

        {/* ── BLUSH ── */}
        <mesh position={[-0.4, -0.1, 0.48]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#ff8fab" roughness={0.5} transparent opacity={0.45} />
        </mesh>
        <mesh position={[0.4, -0.1, 0.48]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#ff8fab" roughness={0.5} transparent opacity={0.45} />
        </mesh>

        {/* ── NOSE (tiny dot) ── */}
        <mesh position={[0, -0.06, 0.7]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#f0c4a8" roughness={0.4} />
        </mesh>

        {/* ── MOUTH (cute cat smile) ── */}
        <mesh position={[0, -0.2, 0.67]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#e8648a" />
        </mesh>
        <mesh position={[-0.06, -0.19, 0.66]} rotation={[0.1, 0.3, 0.3]}>
          <torusGeometry args={[0.05, 0.015, 8, 12, Math.PI * 0.8]} />
          <meshStandardMaterial color="#e8648a" />
        </mesh>
        <mesh position={[0.06, -0.19, 0.66]} rotation={[0.1, -0.3, -0.3]}>
          <torusGeometry args={[0.05, 0.015, 8, 12, Math.PI * 0.8]} />
          <meshStandardMaterial color="#e8648a" />
        </mesh>

        {/* ╔══════════════════════════════════╗
            ║      GLAMOROUS BLONDE HAIR       ║
            ╚══════════════════════════════════╝ */}
        <mesh position={[0, 0.2, -0.05]}>
          <sphereGeometry args={[0.73, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
          <meshStandardMaterial color={hairColor} roughness={0.35} />
        </mesh>
        <mesh position={[-0.15, 0.35, 0.45]} rotation={[-0.6, -0.2, -0.2]}>
          <capsuleGeometry args={[0.2, 0.3, 8, 12]} />
          <meshStandardMaterial color={hairColor} roughness={0.35} />
        </mesh>
        <mesh position={[0.2, 0.32, 0.4]} rotation={[-0.5, 0.15, 0.15]}>
          <capsuleGeometry args={[0.15, 0.25, 8, 12]} />
          <meshStandardMaterial color={hairColor} roughness={0.35} />
        </mesh>
        <mesh position={[-0.6, -0.15, -0.1]}>
          <capsuleGeometry args={[0.25, 0.8, 8, 12]} />
          <meshStandardMaterial color={hairColor} roughness={0.35} />
        </mesh>
        <mesh position={[0.6, -0.15, -0.1]}>
          <capsuleGeometry args={[0.25, 0.8, 8, 12]} />
          <meshStandardMaterial color={hairColor} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.1, -0.55]} rotation={[0.3, 0, 0]}>
          <capsuleGeometry args={[0.4, 0.6, 8, 12]} />
          <meshStandardMaterial color={hairColor} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.3, -0.6]} rotation={[0.8, 0, 0]}>
          <capsuleGeometry args={[0.18, 0.5, 8, 12]} />
          <meshStandardMaterial color={hairDark} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.4, -0.85]} rotation={[0.3, 0, 0]}>
          <capsuleGeometry args={[0.2, 0.9, 8, 12]} />
          <meshStandardMaterial color={hairDark} roughness={0.4} />
        </mesh>
        <mesh position={[0, -1.0, -0.9]} rotation={[0.1, 0, 0.15]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color={hairColor} roughness={0.35} />
        </mesh>

        {/* ── TIARA / CROWN ── */}
        <mesh position={[0, 0.55, 0.35]} rotation={[-0.6, 0, 0]}>
          <torusGeometry args={[0.28, 0.04, 8, 20, Math.PI]} />
          <meshStandardMaterial color={goldColor} roughness={0.05} metalness={0.9} />
        </mesh>
        {[-0.18, 0, 0.18].map((x, i) => (
          <mesh key={i} position={[x, 0.65 + (i === 1 ? 0.08 : 0), 0.3]} rotation={[-0.5, 0, 0]}>
            <coneGeometry args={[0.04, 0.12, 4]} />
            <meshStandardMaterial color={goldColor} roughness={0.05} metalness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 0.68, 0.35]} rotation={[-0.5, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.06]} />
          <meshStandardMaterial color="#ff69b4" roughness={0.05} metalness={0.6} emissive="#ff1493" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.18, 0.6, 0.34]} rotation={[-0.5, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.035]} />
          <meshStandardMaterial color="#e0e0ff" roughness={0.05} metalness={0.6} emissive="#aaaaff" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.18, 0.6, 0.34]} rotation={[-0.5, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.035]} />
          <meshStandardMaterial color="#e0e0ff" roughness={0.05} metalness={0.6} emissive="#aaaaff" emissiveIntensity={0.3} />
        </mesh>

        {/* ── SUNGLASSES ── */}
        <mesh position={[-0.22, 0.38, 0.52]} rotation={[-0.5, -0.15, -0.05]}>
          <torusGeometry args={[0.13, 0.025, 8, 16]} />
          <meshStandardMaterial color="#ff1493" roughness={0.1} metalness={0.4} />
        </mesh>
        <mesh position={[0.22, 0.38, 0.52]} rotation={[-0.5, 0.15, 0.05]}>
          <torusGeometry args={[0.13, 0.025, 8, 16]} />
          <meshStandardMaterial color="#ff1493" roughness={0.1} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.38, 0.6]} rotation={[-0.5, 0, 0]}>
          <boxGeometry args={[0.12, 0.025, 0.025]} />
          <meshStandardMaterial color="#ff1493" roughness={0.1} metalness={0.4} />
        </mesh>
      </group>

      {/* ╔══════════════════════════════════╗
          ║          TINY BEAN BODY          ║
          ╚══════════════════════════════════╝ */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.38, 0.4, 12, 16]} />
        <meshStandardMaterial color={dressColor} roughness={0.2} metalness={0.05} />
      </mesh>
      <mesh castShadow position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.3, 0.55, 0.4, 16]} />
        <meshStandardMaterial color={dressDark} roughness={0.25} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[0.52, 0.05, 6, 20]} />
        <meshStandardMaterial color={dressColor} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.39, 0.035, 6, 16]} />
        <meshStandardMaterial color={goldColor} roughness={0.05} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.35, 0.38]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={goldColor} roughness={0.05} metalness={0.9} emissive="#ffd700" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0.82, 0.12]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.2, 0.04, 6, 16, Math.PI]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </mesh>

      {/* ── PEARL NECKLACE ── */}
      {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((angle, i) => {
        const a = angle * 0.45 - 0.7;
        return (
          <mesh key={i} position={[Math.sin(a) * 0.32, 0.78 - Math.abs(Math.sin(a)) * 0.06, Math.cos(a) * 0.32]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#faf0e6" roughness={0.15} metalness={0.3} />
          </mesh>
        );
      })}

      {/* ── ARMS ── */}
      <mesh castShadow position={[-0.52, 0.55, 0]} rotation={[0, 0, 0.45]}>
        <capsuleGeometry args={[0.1, 0.35, 8, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} />
      </mesh>
      <mesh position={[-0.72, 0.25, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} />
      </mesh>
      <mesh castShadow position={[0.52, 0.55, 0]} rotation={[0, 0, -0.45]}>
        <capsuleGeometry args={[0.1, 0.35, 8, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} />
      </mesh>
      <mesh position={[0.72, 0.25, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} />
      </mesh>

      {/* ── DESIGNER HANDBAG ── */}
      <group position={[0.82, 0.2, 0.05]}>
        <mesh>
          <boxGeometry args={[0.22, 0.16, 0.1]} />
          <meshStandardMaterial color={dressDark} roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.06, 0.03]}>
          <boxGeometry args={[0.22, 0.06, 0.12]} />
          <meshStandardMaterial color={dressColor} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.06, 0.08]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color={goldColor} roughness={0.05} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <torusGeometry args={[0.1, 0.012, 6, 12, Math.PI]} />
          <meshStandardMaterial color={goldColor} roughness={0.05} metalness={0.9} />
        </mesh>
      </group>

      {/* ── LEGS ── */}
      <mesh castShadow position={[-0.18, -0.25, 0]}>
        <capsuleGeometry args={[0.1, 0.22, 8, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} />
      </mesh>
      <mesh castShadow position={[0.18, -0.25, 0]}>
        <capsuleGeometry args={[0.1, 0.22, 8, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.35} />
      </mesh>

      {/* ── SHOES ── */}
      <mesh position={[-0.18, -0.5, 0.04]}>
        <capsuleGeometry args={[0.12, 0.08, 8, 12]} />
        <meshStandardMaterial color={shoeColor} roughness={0.1} metalness={0.2} />
      </mesh>
      <mesh position={[-0.18, -0.55, -0.08]} rotation={[0.25, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.025, 0.15, 8]} />
        <meshStandardMaterial color={goldColor} roughness={0.05} metalness={0.8} />
      </mesh>
      <mesh position={[0.18, -0.5, 0.04]}>
        <capsuleGeometry args={[0.12, 0.08, 8, 12]} />
        <meshStandardMaterial color={shoeColor} roughness={0.1} metalness={0.2} />
      </mesh>
      <mesh position={[0.18, -0.55, -0.08]} rotation={[0.25, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.025, 0.15, 8]} />
        <meshStandardMaterial color={goldColor} roughness={0.05} metalness={0.8} />
      </mesh>
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════════ */

export const PlayerController = () => {
  const bodyRef = useRef<RapierRigidBody>(null);
  const characterGroupRef = useRef<THREE.Group>(null);
  const { movement: movementRef, mouse: mouseRef } = usePlayerControls();
  const { status, setStatus, checkpoint, setCheckpoint } = useGameStore();
  
  const speed = 15;
  const jumpStrength = 9.5;
  
  const moveDirection = useMemo(() => new THREE.Vector3(), []);
  const cameraForward = useMemo(() => new THREE.Vector3(), []);
  const cameraRight = useMemo(() => new THREE.Vector3(), []);

  const checkpointZones = useMemo(() => [
    { z: -65,  pos: [0, 2, -60]   as [number, number, number] },
    { z: -130, pos: [0, 2, -125]  as [number, number, number] },
    { z: -220, pos: [0, 2, -215]  as [number, number, number] },
    { z: -310, pos: [0, 2, -305]  as [number, number, number] },
  ], []);

  useEffect(() => {
    if (status === 'playing' && bodyRef.current) {
      bodyRef.current.setTranslation({ x: checkpoint[0], y: checkpoint[1], z: checkpoint[2] }, true);
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  }, [status]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        useGameStore.getState().togglePause();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useFrame((state) => {
    if (!bodyRef.current) return;

    const translation = bodyRef.current.translation();
    const velocity = bodyRef.current.linvel();

    if (status === 'paused') {
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    // Void reset
    if (translation.y < -20) {
      bodyRef.current.setTranslation({ x: checkpoint[0], y: checkpoint[1], z: checkpoint[2] }, true);
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    // Checkpoints
    if (status === 'playing') {
      for (const cp of checkpointZones) {
        if (translation.z < cp.z && checkpoint[2] > cp.pos[2]) {
          setCheckpoint(cp.pos);
        }
      }
    }

    // Finish
    if (translation.z < -390 && status === 'playing') {
      setStatus('finished');
    }

    const { forward, backward, left, right, jump } = movementRef.current;
    const { angleY, angleX } = mouseRef.current;

    // Movement calculation relative to camera horizontal angle
    if (status === 'playing') {
      // Calculate camera directional vectors on the XZ plane
      cameraForward.set(-Math.sin(angleY), 0, -Math.cos(angleY));
      cameraRight.set(Math.cos(angleY), 0, -Math.sin(angleY));

      const inputZ = (forward ? 1 : 0) - (backward ? 1 : 0);
      const inputX = (right ? 1 : 0) - (left ? 1 : 0);

      if (inputZ !== 0 || inputX !== 0) {
        moveDirection
          .copy(cameraForward)
          .multiplyScalar(inputZ)
          .add(cameraRight.clone().multiplyScalar(inputX))
          .normalize()
          .multiplyScalar(speed);

        // Smoothly rotate the character model to face the move direction
        if (characterGroupRef.current) {
          const targetRotationY = Math.atan2(moveDirection.x, moveDirection.z);
          // Handle smooth shortest angle interpolation
          const currentRotationY = characterGroupRef.current.rotation.y;
          let diff = (targetRotationY - currentRotationY) % (Math.PI * 2);
          if (diff < -Math.PI) diff += Math.PI * 2;
          if (diff > Math.PI) diff -= Math.PI * 2;
          characterGroupRef.current.rotation.y += diff * 0.25;
        }
      } else {
        moveDirection.set(0, 0, 0);
      }

      bodyRef.current.setLinvel({ x: moveDirection.x, y: velocity.y, z: moveDirection.z }, true);

      const isGrounded = Math.abs(velocity.y) < 0.15;
      if (jump && isGrounded) {
        bodyRef.current.setLinvel({ x: velocity.x, y: jumpStrength, z: velocity.z }, true);
      }
    } else {
      bodyRef.current.setLinvel({ x: 0, y: velocity.y, z: 0 }, true);
    }

    const playerPos = new THREE.Vector3(translation.x, translation.y, translation.z);
    
    // Camera orbital positioning based on mouse state
    if (status === 'finished') {
      const time = state.clock.getElapsedTime();
      const orbitPos = playerPos.clone().add(
        new THREE.Vector3(Math.sin(time * 0.8) * 8, 4, Math.cos(time * 0.8) * 8)
      );
      state.camera.position.lerp(orbitPos, 0.04);
      state.camera.lookAt(playerPos.clone().add(new THREE.Vector3(0, 1.5, 0)));
    } else if (status === 'menu') {
      const time = state.clock.getElapsedTime();
      state.camera.position.set(Math.sin(time * 0.2) * 6, 6, 16);
      state.camera.lookAt(0, 2, 0);
    } else {
      // Third-person mouse-controlled orbit camera
      const distance = 13;
      const camX = playerPos.x + Math.sin(angleY) * Math.cos(angleX) * distance;
      const camY = playerPos.y + Math.sin(angleX) * distance + 2.5;
      const camZ = playerPos.z + Math.cos(angleY) * Math.cos(angleX) * distance;

      state.camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.15);
      
      const lookAtTarget = playerPos.clone().add(new THREE.Vector3(0, 1.8, 0));
      state.camera.lookAt(lookAtTarget);
    }
  });

  return (
    <RigidBody 
      ref={bodyRef} 
      position={[checkpoint[0], checkpoint[1], checkpoint[2]]} 
      mass={1} 
      colliders="hull" 
      lockRotations 
      restitution={0.1} 
      friction={1}
      linearDamping={0.5}
    >
      <group ref={characterGroupRef}>
        <PatricinhaCharacter />
      </group>
    </RigidBody>
  );
};
