import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { ROTATE_SPEED } from '../utils/constants.tsx';

interface RotatingBoxProps {
  position: [number, number, number];
  color: THREE.Color;
  delay: number;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

const RotatingBox: React.FC<RotatingBoxProps> = ({
  position,
  color,
  delay,
  onHoverStart,
  onHoverEnd,
}) => {
  const boxRef = useRef<THREE.Mesh>();
  const scale = useRef(0);

  useFrame((_, delta) => {
    if (boxRef.current) {
      const elapsedTime = THREE.MathUtils.clamp(delta - delay, 0, 1);
      scale.current = THREE.MathUtils.lerp(scale.current, 1, elapsedTime);
      boxRef.current.scale.set(scale.current, scale.current, scale.current);

      boxRef.current.rotation.z += ROTATE_SPEED;
    }
  });

  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer';
    if (onHoverStart) onHoverStart();
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
    if (onHoverEnd) onHoverEnd();
  };

  return (
    <mesh
      ref={boxRef}
      position={position}
      castShadow
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      className="hoverable"
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default RotatingBox;
