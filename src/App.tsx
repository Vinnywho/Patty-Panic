import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Sky, Environment } from '@react-three/drei';
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
        <fog attach="fog" args={['#fce4ec', 60, 180]} />
        <Sky sunPosition={[100, 40, 100]} turbidity={0.3} rayleigh={0.5} />
        
        <ambientLight intensity={0.6} />
        <directionalLight 
          castShadow 
          position={[15, 20, 10]} 
          intensity={1.8} 
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={200}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        <pointLight position={[0, 10, -100]} intensity={0.5} color="#ff69b4" />
        <pointLight position={[0, 10, -200]} intensity={0.5} color="#ffd700" />

        {/* Ambient sparkles & confetti particles */}
        <AmbientGlitter count={300} />
        <VIPConfetti count={350} />

        <Suspense fallback={null}>
          <Environment preset="sunset" />
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
