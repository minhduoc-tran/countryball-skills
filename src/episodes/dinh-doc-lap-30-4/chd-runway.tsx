import React from 'react';
import { Camera, project } from '../../countryball/geo-camera';
import { Pt } from '../../countryball/fx-math';

// Schematic Tân Sơn Nhất runways for the map scenes (two parallel strips, bearing ~70 deg, ~3 km long; position is the OSM site point, the
// strips are drawn by hand: stylised, not surveyed). Screen px from the camera. `ends` gives the two ends of each strip for jets/bombs.

const C0 = { lon: 106.6563, lat: 10.8182 };
const HALF = { lon: 0.0128, lat: 0.0046 };                    // half length of a strip in degrees (bearing 70 deg)
const OFFSET = { lon: 0.0013, lat: -0.0036 };                 // second strip, ~400 m to the south-east

export const runwayEnds = (cam: Camera, strip: 0 | 1): [Pt, Pt] => {
  const o = strip ? OFFSET : { lon: 0, lat: 0 };
  return [project(cam, C0.lon + o.lon - HALF.lon, C0.lat + o.lat - HALF.lat), project(cam, C0.lon + o.lon + HALF.lon, C0.lat + o.lat + HALF.lat)];
};

export const Runways: React.FC<{ cam: Camera; burn?: number }> = ({ cam }) => {
  const w = Math.max(6, cam.zoom / 2400);
  return (
    <g strokeLinecap="butt">
      {([0, 1] as const).map((s) => {
        const [a, b] = runwayEnds(cam, s);
        return (
          <g key={s}>
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#111" strokeWidth={w + 5} opacity={0.5} />
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#8A8F96" strokeWidth={w} />
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#E9ECEF" strokeWidth={1.6} strokeDasharray="14 12" opacity={0.85} />
          </g>
        );
      })}
    </g>
  );
};

/** Point at fraction u along strip s (u may be < 0 or > 1: beyond the ends). */
export const onRunway = (cam: Camera, strip: 0 | 1, u: number): Pt => {
  const [a, b] = runwayEnds(cam, strip);
  return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
};

/** Screen heading (deg, 0 = east) of the strip direction (WSW -> ENE). */
export const runwayHeading = (cam: Camera): number => {
  const [a, b] = runwayEnds(cam, 0);
  return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
};
