import React, { useMemo, useRef, useState, useCallback } from 'react';
import { GroupProps, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import debounce from 'lodash.debounce';

import {
  ROTATE_SPEED,
  ONCLICK_JUMP_PERCENTAGE,
  ONCLICK_ROTATE_SPEED_MULTIPLIER,
} from '../utils/constants.ts';
import boxesGenerator from '../utils/boxesGenerator.ts';

import RotatingBox from './RotatingBox.tsx';

interface CircleProps extends GroupProps {
  radius: number;
  numBoxes: number;
  lowGraphics: boolean;
}

const Circle: React.FC<CircleProps> = ({
  radius,
  numBoxes,
  lowGraphics,
  ...props
}) => {
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
      const jumpAngle = (ONCLICK_JUMP_PERCENTAGE / 100) * (Math.PI * 2); // Calculate angle from percentage
      const newTarget = currentRotation + jumpAngle;

      setTargetRotation(newTarget);
      setCurrentSpeed(ROTATE_SPEED * ONCLICK_ROTATE_SPEED_MULTIPLIER);
    }
  };

  const baseColor = useMemo(
    () => new THREE.Color(Math.random(), Math.random(), Math.random()),
    [],
  );

  const boxes = useMemo(
    () => boxesGenerator(numBoxes, radius, baseColor),
    [radius, numBoxes, baseColor],
  );

  const handleHoverDebounced = useCallback(
    debounce((hovering: boolean) => setHovered(hovering), 100),
    [],
  );

  const handlePointerOver = () => {
    handleHoverDebounced(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    handleHoverDebounced(false);
    document.body.style.cursor = 'default';
  };

  return (
    <group
      ref={groupRef}
      scale={hovered ? 1.1 : 1}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handleClick} // Trigger the jump on click
      {...props}
    >
      {boxes.map(({ position, color, delay }, index) => (
        <RotatingBox
          key={index}
          position={position}
          color={color}
          delay={delay}
          lowGraphics={lowGraphics}
        />
      ))}
    </group>
  );
};

export default Circle;
