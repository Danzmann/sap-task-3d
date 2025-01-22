import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { GroupProps, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import debounce from 'lodash.debounce';

import {
  ROTATE_SPEED,
  ONCLICK_JUMP_PERCENTAGE,
  ONCLICK_ROTATE_SPEED_MULTIPLIER,
} from '../utils/constants.ts';

interface CircleProps extends GroupProps {
  radius: number;
  numBoxes: number;
}

const Circle: React.FC<CircleProps> = ({ radius, numBoxes, ...props }) => {
  const groupRef = useRef<THREE.Group>();
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const [hoveredBoxIndex, setHoveredBoxIndex] = useState<number | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState(ROTATE_SPEED);
  const [targetRotation, setTargetRotation] = useState<number | null>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize and update box positions and colors
  useEffect(() => {
    if (instancedMeshRef.current) {
      const mesh = instancedMeshRef.current;
      const baseColor = new THREE.Color(Math.random(), Math.random(), Math.random());

      for (let i = 0; i < numBoxes; i++) {
        const angle = (i / numBoxes) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        // Set position and scale for each box
        dummy.position.set(x, y, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        // Set color
        const lightness = 0.5 + 0.4 * Math.sin((i / numBoxes) * Math.PI * 2);
        const shade = baseColor.clone().setHSL(baseColor.getHSL({}).h, 0.8, lightness);
        mesh.setColorAt(i, shade);
      }

      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
  }, [numBoxes, radius, dummy]);

  // Rotation logic using delta time
  useFrame((_, delta) => {
    if (groupRef.current) {
      const group = groupRef.current;

      // Normal rotation if no hover or jump is active
      if (!hoveredBoxIndex && targetRotation === null) {
        group.rotation.z += currentSpeed * delta;
      }

      // Handle jump rotation
      if (targetRotation !== null) {
        group.rotation.z += currentSpeed * delta;

        if (
          (currentSpeed > 0 && group.rotation.z >= targetRotation) ||
          (currentSpeed < 0 && group.rotation.z <= targetRotation)
        ) {
          setCurrentSpeed(ROTATE_SPEED);
          setTargetRotation(null);
        }
      }
    }
  });

  // Debounced hover handler
  const handleHoverDebounced = useCallback(
    debounce((instanceId: number | null) => setHoveredBoxIndex(instanceId), 100),
    []
  );

  const handlePointerMove = (event: any) => {
    const intersections = event.intersections;

    if (intersections.length > 0) {
      const instanceId = intersections[0].instanceId;
      if (instanceId !== undefined && instanceId !== hoveredBoxIndex) {
        handleHoverDebounced(instanceId);
        document.body.style.cursor = 'pointer';
      }
    }
  };

  const handlePointerOut = () => {
    handleHoverDebounced(null);
    document.body.style.cursor = 'default';
  };

  const handlePointerDown = () => {
    if (groupRef.current && targetRotation === null) {
      const currentRotation = groupRef.current.rotation.z;
      const jumpAngle = (ONCLICK_JUMP_PERCENTAGE / 100) * (Math.PI * 2);
      const newTarget = currentRotation + jumpAngle;

      setTargetRotation(newTarget);
      setCurrentSpeed(ROTATE_SPEED * ONCLICK_ROTATE_SPEED_MULTIPLIER);
    }
  };

  return (
    <group
      ref={groupRef}
      {...props}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
    >
      <instancedMesh
        ref={instancedMeshRef}
        args={[null, null, numBoxes]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial />
      </instancedMesh>
    </group>
  );
};

export default Circle;
