import React from 'react';
import { Box, Layer } from './geo-data';
import { Camera } from './geo-camera';
import { ringsPath } from './geo-paths';
import { clamp, nightTone, ramp } from './map-context';

// Extra drawing of the Sài Gòn map level (called by LevelLayer when level === 'saigon', inside the clipped land group):
//   areas  Mangrove (Rừng Sác / Cần Giờ, dark green) and Urban (the built-up footprint, lighter warm tone)
//   roads  the trunk roads that existed in 1975: QL1 (= Xa lộ Biên Hòa to the north-east, QL4 to the south-west), QL13, QL22, QL15
//          (today QL51), QL20, drawn with a dark casing; inner-city arterials ('Arterial') from zoom ~3500 and secondary/tertiary streets ('Street', inner city only) from ~7000, both faint
// Widths are stylised screen px (they grow slowly with zoom), not true road widths. Rivers are drawn afterwards by LevelLayer.

const ROAD_COL: Record<string, string> = { QL1: '#F6E7B6', QL13: '#F1DDA4', QL22: '#F1DDA4', QL15: '#F1DDA4', QL20: '#E6D29A' };

export const SaigonLayerExtras: React.FC<{ layer: Layer; cam: Camera; view: Box; night: number }> = ({ layer, cam, view, night }) => {
  const z = cam.zoom;
  const area = (k: string) => ringsPath(layer.areas[k] ?? [], cam, view, { closed: true, minStep: 0.8 });
  const line = (k: string, smooth = true) => ringsPath(layer.roads[k] ?? [], cam, view, { closed: false, smooth, minStep: 0.8 });
  const major = clamp(z * 0.0017, 2.6, 7), arterialOp = ramp(z, 2500, 4500) * 0.7, streetOp = ramp(z, 6000, 11000) * 0.55;
  const urban = area('Urban'), mangrove = area('Mangrove');
  return (
    <g>
      {urban && <path d={urban} fill={nightTone('#E58C70', night)} fillOpacity={0.42} stroke={nightTone('#E58C70', night)} strokeOpacity={0.55} strokeWidth={1.2} strokeLinejoin="round" />}
      {mangrove && <path d={mangrove} fill={nightTone('#4E7040', night)} fillOpacity={0.88} stroke={nightTone('#2F4A28', night)} strokeWidth={1} strokeLinejoin="round" />}
      {arterialOp > 0.02 && <path d={line('Arterial')} fill="none" stroke={nightTone('#F3DDB4', night)} strokeWidth={clamp(z * 0.0004, 1.2, 3)} strokeOpacity={arterialOp} strokeLinecap="round" strokeLinejoin="round" />}
      {streetOp > 0.02 && <path d={line('Street')} fill="none" stroke={nightTone('#F3DDB4', night)} strokeWidth={clamp(z * 0.0001, 0.9, 2)} strokeOpacity={streetOp} strokeLinecap="round" strokeLinejoin="round" />}
      {Object.keys(ROAD_COL).map((k) => <path key={`c${k}`} d={line(k)} fill="none" stroke={nightTone('#3A1E16', night)} strokeWidth={major + 3} strokeOpacity={0.8} strokeLinecap="round" strokeLinejoin="round" />)}
      {Object.keys(ROAD_COL).map((k) => <path key={k} d={line(k)} fill="none" stroke={nightTone(ROAD_COL[k], night)} strokeWidth={major} strokeLinecap="round" strokeLinejoin="round" />)}
    </g>
  );
};
