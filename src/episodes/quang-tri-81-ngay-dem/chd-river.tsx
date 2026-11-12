import React from 'react';
import { Camera } from '../../countryball/geo-camera';
import { WATERWAYS, localToScreen } from '../../countryball/citadel-geometry';
import { pathAtDist, samplePath } from '../../countryball/fx-flight-path';
import { clamp, Pt } from '../../countryball/fx-math';

// Chapter D river helpers (the Thạch Hãn on the CitadelPlan): moving current chevrons along the real river centre line,
// and a "position along a polyline" helper to carry icons (letters, crates) across the water. t in FRAMES, cam = plan camera.

/** Local-metre polyline of the Sông Thạch Hãn centre line near the citadel (|x| < 1100, |y| < 800), ordered south -> north. */
const RIVER_LOCAL: Pt[] = (() => {
  const w = WATERWAYS.filter((q) => q.name === 'Sông Thạch Hãn').sort((a, b) => b.pts.length - a.pts.length)[0];
  const out: Pt[] = [];
  if (!w) return out;
  for (let i = 0; i + 1 < w.pts.length; i += 2) if (Math.abs(w.pts[i]) < 1100 && Math.abs(w.pts[i + 1]) < 800) out.push([w.pts[i], w.pts[i + 1]]);
  if (out.length > 1 && out[0][1] < out[out.length - 1][1]) out.reverse();   // make it run towards smaller y (north)
  return out;
})();

/** Chevrons drifting along the river (fast current). `n` chevrons, `speed` px per frame on screen. */
export const RiverFlow: React.FC<{ cam: Camera; t: number; n?: number; speed?: number; size?: number; color?: string; o?: number }> = ({ cam, t, n = 14, speed = 3.2, size = 22, color = '#E8F4FF', o = 0.8 }) => {
  if (RIVER_LOCAL.length < 2) return null;
  const sp = samplePath(RIVER_LOCAL.map(([x, y]) => localToScreen(cam, x, y)), 10), gap = sp.total / n;
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const d = (i * gap + t * speed) % sp.total, p = pathAtDist(sp, d);
        if (p.x < -40 || p.x > 1960 || p.y < -40 || p.y > 1120) return null;
        return <path key={i} d={`M${-size},${-size * 0.7} L0,0 L${-size},${size * 0.7}`} transform={`translate(${p.x},${p.y}) rotate(${p.heading})`} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />;
      })}
    </g>
  );
};

/** Position + heading at fraction u (0..1) of a screen polyline. */
export const posAt = (points: Pt[], u: number): { x: number; y: number; heading: number } => {
  const sp = samplePath(points);
  return pathAtDist(sp, clamp(u) * sp.total);
};
