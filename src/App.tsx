import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import { Perf } from 'r3f-perf';

import Circle from './components/Circle';
import {
  MAX_BOXES,
  MAX_CIRCLES,
  MAX_RADIUS,
  MIN_BOXES,
  MIN_CIRCLES,
  MIN_RADIUS,
} from './utils/constants.ts';
import { getDevMode } from './utils/getEnv.ts';

const App: React.FC = () => {
  const [numBoxes, setNumBoxes] = useState(12);
  const [radius, setRadius] = useState(10);
  const [numCircles, setNumCircles] = useState(3);
  const [autoChange, setAutoChange] = useState(false);
  const [lowGraphics, setLowGraphics] = useState(false);

  // Handle the auto-increasing and decreasing of circles
  useEffect(() => {
    if (!autoChange) return;

    let increment = 1;
    const interval = setInterval(() => {
      setNumCircles((prev) => {
        if (prev >= MAX_CIRCLES) increment = -1; // Decreasing
        if (prev <= MIN_CIRCLES) increment = 1; // Increasing

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
      min: MIN_BOXES,
      max: MAX_BOXES,
      step: 1,
      onChange: (value) => setNumBoxes(value),
    },
    Radius: {
      value: radius,
      min: MIN_RADIUS,
      max: MAX_RADIUS,
      step: 0.5,
      onChange: (value) => setRadius(value),
    },
    'Number of Circles': {
      value: numCircles,
      min: MIN_CIRCLES,
      max: MAX_CIRCLES,
      step: 1,
      onChange: (value) => {
        if (!autoChange) setNumCircles(value);
      },
    },
    'Auto Change': {
      value: autoChange,
      onChange: (value) => setAutoChange(value),
    },
    'Low Quality': {
      value: lowGraphics,
      onChange: (value) => setLowGraphics(value),
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
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
      >
        <ambientLight intensity={0.2} />

        {!lowGraphics && (
          <directionalLight
            position={[50, 20, 20]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          >
            <orthographicCamera
              attach="shadow-camera"
              args={[-22, 22, 22, -22]}
            />
          </directionalLight>
        )}

        <mesh receiveShadow position={[0, 0, -0.5]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="white" />
        </mesh>

        <OrbitControls />
        {getDevMode && <Perf position="bottom-left" />}

        {Array.from({ length: numCircles }).map((_, index) => (
          <Circle
            key={index}
            radius={radius}
            numBoxes={numBoxes}
            position={[0, 0, index * 1.5]} // Stak circles vertically
            lowGraphics={lowGraphics}
          />
        ))}
      </Canvas>
    </>
  );
};

export default App;
