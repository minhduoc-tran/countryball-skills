import React from 'react';
import { Camera } from '../../countryball/geo-camera';
import { easeOut } from '../../countryball/fx-math';
import { FlagPin, proj, ramp } from './chg-common';

// Chapter G, "cuộc chiến cắm cờ" (28.1.1973): flags pop up on the Quảng Trị map, red (Quân Giải phóng) and yellow (VNCH) in
// turn, each with a soft tinted patch of "held land" around it. Positions are lon/lat so they stay on the land while the camera drifts.

/** [lon, lat, side] in the order they pop up. */
export const FLAG_SPOTS: [number, number, 'VNM' | 'RVN'][] = [
  [107.05, 16.86, 'VNM'], [107.16, 16.77, 'RVN'], [106.96, 16.78, 'VNM'], [107.2, 16.7, 'RVN'], [107.1, 16.93, 'VNM'], [107.1, 16.68, 'RVN'],
  [106.9, 16.9, 'VNM'], [107.22, 16.78, 'RVN'], [107.0, 16.7, 'VNM'], [107.0, 16.95, 'VNM'], [107.14, 16.72, 'RVN'], [107.28, 16.64, 'RVN'],
  [106.9, 16.72, 'VNM'], [107.06, 16.78, 'VNM'], [107.14, 16.84, 'RVN'], [106.95, 16.66, 'VNM'],
];

/** Flags + patches on a map camera. s = shot seconds, off = seconds already elapsed when this shot starts (so flags placed in the
 *  previous shot are still there), first = second the first flag pops, gap = seconds between pops. */
export const FlagRace: React.FC<{ cam: Camera; s: number; t: number; off?: number; first?: number; gap?: number; n?: number; size?: number }> = ({ cam, s, t, off = 0, first = 1.4, gap = 0.2, n = FLAG_SPOTS.length, size = 78 }) => {
  const P = proj(cam), T = s + off;
  return (
    <g>
      {FLAG_SPOTS.slice(0, n).map(([lo, la, side], i) => {
        const at = first + i * gap, [x, y] = P(lo, la), k = easeOut(ramp(T, at, at + 0.9));
        if (T < at) return null;
        const c = side === 'VNM' ? '#E0483C' : '#F2C230';
        return <circle key={`p${i}`} cx={x} cy={y} r={(60 + 24 * Math.sin(T * 2 + i)) * k} fill={c} fillOpacity={0.22} stroke={c} strokeWidth={4} strokeDasharray="14 10" strokeOpacity={0.8} />;
      })}
      {FLAG_SPOTS.slice(0, n).map(([lo, la, side], i) => {
        const [x, y] = P(lo, la);
        return <FlagPin key={`f${i}`} x={x} y={y} flag={side} s={T} at={first + i * gap} t={t} size={size} />;
      })}
    </g>
  );
};
