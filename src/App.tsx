import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import Circle from './components/Circle';

const App: React.FC = () => {
  const [numBoxes, setNumBoxes] = useState(12);
  const [radius, setRadius] = useState(10);
  const [numCircles, setNumCircles] = useState(3);

  // Leva controls for user input
  useControls({
    'Number of Boxes': {
      value: numBoxes,
      min: 3,
      max: 30,
      step: 1,
      onChange: (value) => setNumBoxes(value),
    },
    Radius: {
      value: radius,
      min: 5,
      max: 20,
      step: 0.5,
      onChange: (value) => setRadius(value),
    },
    'Number of Circles': {
      value: numCircles,
      min: 1,
      max: 40,
      step: 1,
      onChange: (value) => setNumCircles(value),
    },
  });

  return (
    <>
      <Leva collapsed />
      <Canvas
        shadows
        camera={{
          position: [0, -40, 30],
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
          <orthographicCamera
            attach="shadow-camera"
            args={[-10, 10, 10, -10]}
          />
        </directionalLight>

        <mesh receiveShadow position={[0, 0, -0.5]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="white" />
        </mesh>

        <OrbitControls />

        {/* Render stacked circles */}
        {Array.from({ length: numCircles }).map((_, index) => (
          <Circle
            key={index}
            radius={radius}
            numBoxes={numBoxes}
            position={[0, 0, index * 1.5]} // Stacking circles vertically
          />
        ))}
      </Canvas>
    </>
  );
};

export default App;
