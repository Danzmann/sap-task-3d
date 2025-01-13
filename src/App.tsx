import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Circle from './components/Circle';

const App: React.FC = () => {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, -40, 30],
        // rotation: [Math.PI / 4, 0, 0],
        fov: 75,
      }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[50, 20, 15]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
      </directionalLight>

      <mesh receiveShadow position={[0, 0, -0.5]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="white" />
      </mesh>

      <OrbitControls />

      <Circle radius={10} numBoxes={12} />
    </Canvas>
  );
};

export default App;
