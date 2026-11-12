import React from 'react';
import { Kitchen, KitchenIsland, KITCHEN, stand, islandTop, Glow, Dust } from '../../engine';
import { XoiPot } from './che-home-and-family-props';

// The family kitchen in the evening, shared by the sister-question shots. One layout, so every cut agrees:
//   mum behind the island on the left (u 0.36, w 0.4), the xôi pot on the island (u 0.58),
//   Pip at the right (u 0.78, w 0.62), sis beside him (u 0.64, w 0.66, 0.72 of his height).
// Draw order: <KitchenNight/>, characters behind the island, <KitchenFront/> (island + pot), then front characters.

export const SPOT = {
  mum: stand(KITCHEN, 0.36, 0.4),
  pip: stand(KITCHEN, 0.8, 0.62, 0.62),
  sis: stand(KITCHEN, 0.62, 0.66, 0.62 * 0.72),
};

/** The kitchen after dark: the engine's kitchen darkened, the pendants and lamp pools kept warm. */
export const KitchenNight: React.FC<{ t: number; id: string; veil?: number }> = ({ t, id, veil = 0.6 }) => (
  <g>
    <Kitchen t={t} id={id} veil={veil} />
    <rect x={-400} y={-300} width={2720} height={1700} fill="#0E1030" opacity={0.28} />
    <rect x={-400} y={-300} width={2720} height={1700} fill="#FF9A4A" opacity={0.07} style={{ mixBlendMode: 'screen' }} />
    <Glow x={820} y={470} r={520} o={0.3} />
    <Glow x={1100} y={470} r={420} o={0.2} />
  </g>
);

/** The island, the xôi pot with its steam, and warm dust in the lamp light. */
export const KitchenFront: React.FC<{ t: number; seed?: number; pot?: boolean }> = ({ t, seed = 5, pot = true }) => {
  const top = islandTop(0.6, 0.5);
  return (
    <g>
      <KitchenIsland />
      {pot ? <XoiPot x={top.x} y={top.y + 12} s={0.52} t={t} /> : null}
      <Dust t={t} seed={seed} x0={640} y0={420} w={760} h={420} n={26} o={0.5} />
    </g>
  );
};
