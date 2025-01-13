import React, { useMemo, useRef, useState } from 'react';
import { GroupProps, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { ROTATE_SPEED } from '../utils/constants.tsx';
import RotatingBox from './RotatingBox.tsx';

interface CircleProps extends GroupProps {
  radius: number;
  numBoxes: number;
}

const Circle: React.FC<CircleProps> = ({ radius, numBoxes, ...props }) => {
  const groupRef = useRef<THREE.Group>();
  const [hovered, setHovered] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(ROTATE_SPEED); // Dynamic rotation speed
  const [targetRotation, setTargetRotation] = useState<number | null>(null); // Target rotation for jumping

  useFrame(() => {
    if (groupRef.current) {
      if (!hovered && targetRotation === null) {
        groupRef.current.rotation.z += currentSpeed;
      } else if (targetRotation !== null) {
        groupRef.current.rotation.z += currentSpeed;

        if (
          (currentSpeed > 0 && groupRef.current.rotation.z >= targetRotation) ||
          (currentSpeed < 0 && groupRef.current.rotation.z <= targetRotation)
        ) {
          setCurrentSpeed(ROTATE_SPEED); // Reset speed to normal
          setTargetRotation(null); // Stop the jump
        }
      }
    }
  });

  const handleClick = () => {
    if (groupRef.current) {
      const currentRotation = groupRef.current.rotation.z;
      const jumpAngle = (2 * Math.PI) / 3; // 1/3 of a full circle at each click
      const newTarget = currentRotation + jumpAngle;

      setTargetRotation(newTarget);
      setCurrentSpeed(ROTATE_SPEED * 20);
    }
  };

  const baseColor = useMemo(
    () => new THREE.Color(Math.random(), Math.random(), Math.random()),
    [],
  );

  // Generate positions and (smoothly transitioning :D ) colors for the boxes
  const boxes = useMemo(() => {
    return Array.from({ length: numBoxes }, (_, i) => {
      const angle = (i / numBoxes) * Math.PI * 2;
      const position = [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0, // needed for flat cirlce
      ];

      // Instead of a flat progression, I use a sinusoidal function for a smooth lightness transitions
      const lightness = 0.5 + 0.4 * Math.sin((i / numBoxes) * Math.PI * 2);
      const shade = baseColor
        .clone()
        .setHSL(baseColor.getHSL({}).h, 0.8, lightness);

      return { position, color: shade, delay: 0.0001 * i };
    });
  }, [radius, numBoxes, baseColor]);

  return (
    <group
      ref={groupRef}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={handleClick} // Trigger the jump on click
      {...props}
    >
      {boxes.map(({ position, color, delay }, index) => (
        <RotatingBox
          key={index}
          position={position}
          color={color}
          delay={delay}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
        />
      ))}
    </group>
  );
};

export default Circle;
