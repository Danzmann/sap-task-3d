import React, { useMemo, useRef } from 'react';
import { GroupProps, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CircleProps extends GroupProps {
  radius: number;
  numBoxes: number;
}

const ROTATE_SPEED = 0.005;

const Circle: React.FC<CircleProps> = ({ radius, numBoxes, ...props }) => {
  const groupRef = useRef<THREE.Group>();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += ROTATE_SPEED;
    }
  });

  const baseColor = useMemo(
    () => new THREE.Color(Math.random(), Math.random(), Math.random()),
    [],
  );

  // Generate positions and colors for the boxes
  const boxes = useMemo(() => {
    return Array.from({ length: numBoxes }, (_, i) => {
      const angle = (i / numBoxes) * Math.PI * 2;
      const position = [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0, // Needed for flat cirlce
      ];
      const shade = baseColor
        .clone()
        .offsetHSL(0, 0, Math.random() * 0.2 - 0.1);
      return { position, color: shade };
    });
  }, [radius, numBoxes, baseColor]);

  return (
    <group ref={groupRef} {...props}>
      {boxes.map(({ position, color }, index) => (
        <RotatingBox key={index} position={position} color={color} />
      ))}
    </group>
  );
};

interface RotatingBoxProps {
  position: [number, number, number];
  color: THREE.Color;
}

const RotatingBox: React.FC<RotatingBoxProps> = ({ position, color }) => {
  const boxRef = useRef<THREE.Mesh>();

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.z += ROTATE_SPEED;
    }
  });

  return (
    <mesh ref={boxRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Circle;
