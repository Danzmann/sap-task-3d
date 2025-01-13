import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Circle from './components/Circle';

const App: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 75 }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <Circle radius={10} numBoxes={12} />
    </Canvas>
  );
};

export default App;
