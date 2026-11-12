import React from 'react';
import { Street, Glow, proj, propScale } from '../../engine';
import { BreadCart } from './chc-props-food-and-trade';

// Chapter C street backdrops: the Street set blurred behind a medium shot, with bread carts standing along the
// sidewalk at given depths (some sold out). Drawn in the Street's own projection so the perspective holds.

/** The blurred street: `zoom` scales it about the vanishing point, `shiftX` slides it, `warm` adds a morning glow. */
export const BlurStreet: React.FC<{ t: number; id: string; zoom?: number; shiftX?: number; blur?: number; market?: number; carts?: [number, number, boolean][]; warm?: number }> = ({
  t, id, zoom = 1.6, shiftX = 0, blur = 6, market = 1, carts = [[-5.2, 11, false], [5.4, 15, false], [-5.4, 22, false]], warm = 0,
}) => (
  <g filter={blur > 0 ? `url(#blur${blur})` : undefined}>
    <g transform={`translate(${960 + shiftX} 470) scale(${zoom}) translate(-960 -470)`}>
      <Street t={t} id={id} market={market} />
      {[...carts].sort((a, b) => b[1] - a[1]).map(([X, Z, sold], i) => {
        const p = proj(X, 0, Z);
        return <BreadCart key={i} x={p.x} y={p.y} s={propScale(Z) * 0.36} loaves={sold ? 0 : 1} sold={sold} />;
      })}
    </g>
    {warm > 0 ? <rect x={-600} y={-300} width={3200} height={1700} fill="#FFC27A" opacity={warm * 0.18} /> : null}
    {warm > 0 ? <Glow x={1500} y={160} r={900} o={0.5 * warm} /> : null}
  </g>
);
