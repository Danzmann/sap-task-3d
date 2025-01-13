import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { ROTATE_SPEED } from '../utils/constants.ts';

interface RotatingBoxProps {
  position: [number, number, number];
  color: THREE.Color;
  delay: number;
}

const RotatingBox: React.FC<RotatingBoxProps> = ({
  position,
  color,
  delay,
  lowGraphics,
}) => {
  const boxRef = useRef<THREE.Mesh>();
  const scale = useRef(0);

  useFrame((_, delta) => {
    if (boxRef.current) {
      const elapsedTime = THREE.MathUtils.clamp(delta - delay * 1.5, 0, 1);
      scale.current = THREE.MathUtils.lerp(scale.current, 1, elapsedTime);
      boxRef.current.scale.set(scale.current, scale.current, scale.current);

      boxRef.current.rotation.z += ROTATE_SPEED;
    }
  });

  return (
    <mesh ref={boxRef} position={position} castShadow className="hoverable">
      <boxGeometry args={[1, 1, 1]} />
      {lowGraphics ? (
        <meshBasicMaterial color={color} />
      ) : (
        <meshStandardMaterial color={color} />
      )}
    </mesh>
  );
};

export default React.memo(RotatingBox);
