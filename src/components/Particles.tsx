import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════
   ✨ GLITTER & SPARKLE PARTICLES SYSTEM
   
   Includes:
   1. Floating ambient glitter/sparkles drifting along the runway
   2. VIP Finish Confetti shower with dynamic physics
   ═══════════════════════════════════════════════════════════════ */

export const AmbientGlitter = ({ count = 250 }: { count?: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize random particle data along the entire track (Z: 10 to -420)
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 40,
        y: Math.random() * 18 - 2,
        z: Math.random() * -420 + 10,
        speedY: Math.random() * 0.4 + 0.1,
        rotSpeed: Math.random() * 2 + 1,
        scale: Math.random() * 0.15 + 0.08,
        colorIndex: Math.floor(Math.random() * 4),
      });
    }
    return data;
  }, [count]);

  const colors = useMemo(() => [
    new THREE.Color('#ffd700'), // Gold
    new THREE.Color('#ff69b4'), // Hot pink
    new THREE.Color('#ffffff'), // White sparkle
    new THREE.Color('#da70d6'), // Orchid / purple
  ], []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      // Gentle floating bob and drift
      const currentY = p.y + Math.sin(time * p.speedY + i) * 1.2;
      const currentX = p.x + Math.cos(time * 0.5 + i) * 0.8;

      dummy.position.set(currentX, currentY, p.z);
      dummy.rotation.set(time * p.rotSpeed + i, time * p.rotSpeed * 0.8, 0);
      dummy.scale.setScalar(p.scale * (1 + Math.sin(time * 3 + i) * 0.3)); // Pulsing sparkle
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, colors[p.colorIndex]);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial
        roughness={0.1}
        metalness={0.8}
        emissive="#ff69b4"
        emissiveIntensity={0.6}
      />
    </instancedMesh>
  );
};

export const VIPConfetti = ({ count = 300 }: { count?: number }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { status } = useGameStore();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Confetti particles focused around VIP area (Z: -385 to -415)
  const confetti = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 30,
        y: Math.random() * 25 + 5,
        z: -400 + (Math.random() - 0.5) * 26,
        fallSpeed: Math.random() * 4 + 2,
        swaySpeed: Math.random() * 3 + 1,
        swayAmount: Math.random() * 2 + 0.5,
        rotX: Math.random() * 5 + 2,
        rotZ: Math.random() * 5 + 2,
        scaleX: Math.random() * 0.2 + 0.15,
        scaleY: Math.random() * 0.35 + 0.2,
        colorIndex: Math.floor(Math.random() * 5),
      });
    }
    return data;
  }, [count]);

  const confettiColors = useMemo(() => [
    new THREE.Color('#ffd700'), // Gold
    new THREE.Color('#ff1493'), // Deep pink
    new THREE.Color('#00ffff'), // Cyan pop
    new THREE.Color('#ffffff'), // White
    new THREE.Color('#ff69b4'), // Pink
  ], []);

  useFrame((state) => {
    if (!meshRef.current || status !== 'finished') return;
    const time = state.clock.getElapsedTime();

    confetti.forEach((c, i) => {
      // Loop falling confetti
      const currentY = ((c.y - time * c.fallSpeed) % 25) + 0;
      const currentX = c.x + Math.sin(time * c.swaySpeed + i) * c.swayAmount;
      const currentZ = c.z + Math.cos(time * c.swaySpeed + i) * 0.5;

      dummy.position.set(currentX, Math.max(currentY, -2.5), currentZ);
      dummy.rotation.set(time * c.rotX + i, time * 2, time * c.rotZ + i);
      dummy.scale.set(c.scaleX, c.scaleY, 0.05);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, confettiColors[c.colorIndex]);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  if (status !== 'finished') return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial
        roughness={0.3}
        metalness={0.5}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
};
