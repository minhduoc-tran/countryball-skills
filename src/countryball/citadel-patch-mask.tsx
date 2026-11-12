import React from 'react';
import { DATA_BOX } from './citadel-geometry';

// Soft-edged mask for CitadelPlan used as an overlay on the map: the plan's data covers a ~7.6 x 4.7 km window, so its
// edge is feathered (blurred ~200 m) instead of ending in a hard rectangle. Defines mask id `${id}-patch` (screen px).
export const CitadelPatchMask: React.FC<{ id: string; overlay: boolean; k: number; c: [number, number] }> = ({ id, overlay, k, c }) => {
  if (!overlay) return null;
  const inset = 260, sx = (x: number) => 960 + (x - c[0]) * k, sy = (y: number) => 540 + (y - c[1]) * k;
  return (
    <defs>
      <filter id={`${id}-feather`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={Math.max(2, 190 * k)} /></filter>
      <mask id={`${id}-patch`} maskUnits="userSpaceOnUse" x={-4000} y={-4000} width={9920} height={9080}>
        <rect x={sx(DATA_BOX.x0 + inset)} y={sy(DATA_BOX.y0 + inset)} width={(DATA_BOX.x1 - DATA_BOX.x0 - 2 * inset) * k} height={(DATA_BOX.y1 - DATA_BOX.y0 - 2 * inset) * k} fill="#FFF" filter={`url(#${id}-feather)`} />
      </mask>
    </defs>
  );
};
