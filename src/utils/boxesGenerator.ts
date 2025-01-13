import * as THREE from 'three';

import { BOXES_GENERATION_ANIMATION_DELAY } from './constants.ts';

// Generate positions and (smoothly transitioning :D ) colors for the boxes
const boxesGenerator = (
  numBoxes: number,
  radius: number,
  baseColor: THREE.Color,
) => {
  const boxes = Array.from({ length: numBoxes }, (_, i) => {
    const angle = (i / numBoxes) * Math.PI * 2;
    const position = [
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0, // needed for flat cirlce
    ];

    // Instead of a flat progression, I use a sinusoidal function for a smooth color shade transitions
    const lightness = 0.5 + 0.4 * Math.sin((i / numBoxes) * Math.PI * 2);
    const shade = baseColor
      .clone()
      .setHSL(baseColor.getHSL({}).h, 0.8, lightness);

    return {
      position,
      color: shade,
      delay: BOXES_GENERATION_ANIMATION_DELAY * i,
    };
  });
  return boxes;
};

export default boxesGenerator;
