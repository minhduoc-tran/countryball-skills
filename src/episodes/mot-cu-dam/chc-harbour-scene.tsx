import React from 'react';
import { easeInOut, clamp } from '../../engine';
import { HarborBack, SeaFront, CargoShip, OctoBody, OctoArms, OctoOpts, ShipRef } from './chc-harbour-props';

// CHAPTER C: the whole harbour fight scene in draw order: sea + port, octopus (clipped by the water while it rises),
// the ship, the tentacles over the ship, the near water. Pier and Pip are drawn by the shot (so fx can sit between).
export type ShipPose = ShipRef & { rot?: number; dy?: number };
export const SHIP0: ShipPose = { x: 1230, y: 730, sc: 0.95 };
export const OCTO0: OctoOpts = { ox: 1330, oy: 525, sc: 1.0 };
const SURF = 580; // y of the water where the octopus rises (behind the ship)

export const HarborScene: React.FC<{
  t: number; id: string; octo?: OctoOpts; rise?: number; wrap?: number; squeeze?: number; flail?: number; hideOcto?: boolean;
  ship?: ShipPose; hi?: (k: number) => number; look?: number; lookY?: number; lid?: number; mouth?: number; tw?: number;
}> = ({ t, id, octo = OCTO0, rise = 1, wrap = 0, squeeze = 0, flail = 1, hideOcto = false, ship = SHIP0, hi, look, lookY, lid, mouth, tw }) => {
  const r = clamp(rise);
  const o: OctoOpts = { ...octo, oy: octo.oy + (1 - r) * 640 };
  const s = { x: ship.x, y: ship.y + (ship.dy ?? 0), sc: ship.sc };
  const clipY = r >= 1 ? 4000 : SURF;
  const arms = <OctoArms o={o} t={t} wrap={wrap} ship={s} squeeze={squeeze} flail={flail} hi={hi} />;
  return (
    <g>
      <defs><clipPath id={`${id}oclip`}><rect x={-1000} y={-3000} width={4000} height={clipY + 3000} /></clipPath></defs>
      <HarborBack t={t} id={id} />
      {hideOcto ? null : (
        <g clipPath={`url(#${id}oclip)`}>
          <OctoBody o={o} t={tw ?? t} look={look} lookY={lookY} lid={lid} mouth={mouth} />
          {wrap < 0.05 ? arms : <OctoArms o={o} t={t} wrap={wrap} ship={s} squeeze={squeeze} flail={flail} hi={hi} part="back" />}
        </g>
      )}
      {!hideOcto && r < 1 && r > 0 ? <ellipse cx={octo.ox} cy={SURF} rx={330 + 160 * easeInOut(r)} ry={30} fill="none" stroke="#FFFFFF" strokeWidth={9} opacity={0.8} /> : null}
      <CargoShip x={s.x} y={s.y} sc={s.sc} t={t} rot={ship.rot ?? 0} squeeze={squeeze} />
      {hideOcto || wrap < 0.05 ? null : <OctoArms o={o} t={t} wrap={wrap} ship={s} squeeze={squeeze} flail={flail} hi={hi} part="front" />}
      <SeaFront t={t} wl={s.y} />
    </g>
  );
};
