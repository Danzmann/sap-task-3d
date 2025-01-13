import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import Circle from './components/Circle';

const App: React.FC = () => {
  const [numBoxes, setNumBoxes] = useState(12);
  const [radius, setRadius] = useState(10);
  const [numCircles, setNumCircles] = useState(3);
  const [autoChange, setAutoChange] = useState(false);

  const maxCircles = 40;
  const minCircles = 0;

  // Handle the auto-increasing and decreasing of circles
  useEffect(() => {
    if (!autoChange) return;

    let increment = 1;
    const interval = setInterval(() => {
      setNumCircles((prev) => {
        if (prev >= maxCircles) increment = -1; // Decreasing
        if (prev <= minCircles) increment = 1; // Increasing

        const newValue = prev + increment;
        set({ 'Number of Circles': newValue }); // Update the slider programmatically
        return newValue;
      });
    }, 300);

    return () => clearInterval(interval); // Clean up the interval when autoChange is off
  }, [autoChange]);

  const [_, set] = useControls(() => ({
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
      min: minCircles,
      max: maxCircles,
      step: 1,
      onChange: (value) => {
        if (!autoChange) setNumCircles(value);
      },
    },
    'Auto Change': {
      value: autoChange,
      onChange: (value) => setAutoChange(value),
    },
  }));

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
          position={[50, 20, 20]}
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
