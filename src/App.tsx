import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Sky } from '@react-three/drei';
import { PlayerController } from './components/PlayerController';
import { Level } from './components/Level';
import { UI } from './components/UI';
import { AmbientGlitter, VIPConfetti } from './components/Particles';
import { useGameStore } from './store/gameStore';

function App() {
  const { status } = useGameStore();

  return (
    <>
      <UI />
      <Canvas shadows camera={{ position: [0, 8, 15], fov: 55 }}>
        <color attach="background" args={['#fce4ec']} />
        <fog attach="fog" args={['#fce4ec', 60, 200]} />
        <Sky sunPosition={[100, 35, 100]} turbidity={0.2} rayleigh={0.6} />
        
        {/* Glamorous lighting setup (Self-contained, no external CDN dependencies) */}
        <ambientLight intensity={0.7} color="#ffffff" />
        <hemisphereLight args={['#ffffff', '#ffb6c1', 0.8]} />
        <directionalLight 
          castShadow 
          position={[20, 25, 15]} 
          intensity={1.8} 
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={250}
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
        />
        <pointLight position={[0, 12, -80]} intensity={0.8} color="#ff69b4" />
        <pointLight position={[0, 12, -180]} intensity={0.8} color="#da70d6" />
        <pointLight position={[0, 12, -280]} intensity={0.8} color="#ff1493" />
        <pointLight position={[0, 15, -390]} intensity={1.2} color="#ffd700" />

        {/* Ambient sparkles & confetti particles */}
        <AmbientGlitter count={300} />
        <VIPConfetti count={350} />

        <Suspense fallback={null}>
          <Physics key={status}>
            <PlayerController />
            <Level />
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
