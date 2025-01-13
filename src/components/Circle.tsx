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
    <group ref={groupRef} {...props}>
      {boxes.map(({ position, color, delay }, index) => (
        <RotatingBox
          key={index}
          position={position}
          color={color}
          delay={delay}
        />
      ))}
    </group>
  );
};

interface RotatingBoxProps {
  position: [number, number, number];
  color: THREE.Color;
  delay: number;
}

const RotatingBox: React.FC<RotatingBoxProps> = ({
  position,
  color,
  delay,
}) => {
  console.log(delay);
  const boxRef = useRef<THREE.Mesh>();
  const scale = useRef(0);

  useFrame((_, delta) => {
    if (boxRef.current) {
      // Introduce a delay before starting the scale animation
      const elapsedTime = THREE.MathUtils.clamp(delta - delay, 0, 1);
      scale.current = THREE.MathUtils.lerp(scale.current, 1, elapsedTime);
      boxRef.current.scale.set(scale.current, scale.current, scale.current);

      boxRef.current.rotation.z += ROTATE_SPEED;
    }
  });

  return (
    <mesh ref={boxRef} position={position} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Circle;
