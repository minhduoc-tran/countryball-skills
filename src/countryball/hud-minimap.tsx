import React from 'react';
import { LAYERS } from './geo-data';
import { Camera, viewBounds } from './geo-camera';
import { PORTRAIT_HUD, usePortraitHud } from './hud-portrait-safe';

// Corner minimap: the whole world (110m), a crosshair and a red box that follows the current camera (a portrait camera, w/h 1080x1920,
// gives a tall box). Bottom-right in 16:9; portrait frames (or `portrait`): right column y 404 (PORTRAIT_HUD.mini); `x`/`y` = top-left override.
export const MINI = { W: 300, H: 150 };
// Default camera = the SE-Asia framing of the rice scene (so MiniMap with no props looks as before).
export const RICE_CAMERA: Camera = { lon: 110, lat: 14.9749, zoom: 54.9661, lat0: 14 };

const mx = (lon: number) => ((lon + 180) / 360) * MINI.W;
const my = (lat: number) => ((84 - lat) / 144) * MINI.H;

let worldD: string | null = null; // built once: static data, so memoising keeps frames pure
const worldPath = (): string => {
  if (worldD !== null) return worldD;
  let d = '';
  for (const rings of Object.values(LAYERS.world.countries)) {
    for (const r of rings) {
      if (r.bb[3] < -60) continue; // no Antarctica (minimap shows lat 84..-60)
      let last: [number, number] | null = null, s = '';
      for (let i = 0; i < r.pts.length; i += 2) {
        const x = mx(r.pts[i]), y = my(r.pts[i + 1]);
        if (last && Math.abs(x - last[0]) < 0.5 && Math.abs(y - last[1]) < 0.5) continue;
        s += `${s ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`; last = [x, y];
      }
      if (s.length > 12) d += s + 'Z';
    }
  }
  return (worldD = d);
};

export const MiniMap: React.FC<{ camera?: Camera; id?: string; portrait?: boolean; x?: number; y?: number }> = ({ camera = RICE_CAMERA, id = 'hud-mini', portrait, x: px, y: py }) => {
  const pos = usePortraitHud(portrait) ? PORTRAIT_HUD.mini : { x: 1864 - MINI.W - 20, y: 1046 - MINI.H - 20 };
  const v = viewBounds(camera);
  let x0 = mx(v[0]), x1 = mx(v[2]), y0 = my(v[3]), y1 = my(v[1]);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  if (x1 - x0 < 6) { x0 = cx - 3; x1 = cx + 3; }
  if (y1 - y0 < 6) { y0 = cy - 3; y1 = cy + 3; }
  return (
    <g transform={`translate(${px ?? pos.x},${py ?? pos.y})`}>
      <rect x={-12} y={-12} width={MINI.W + 24} height={MINI.H + 24} rx={10} fill="#0E1A27" stroke="#E2B95A" strokeWidth={4} />
      <clipPath id={`${id}-clip`}><rect width={MINI.W} height={MINI.H} /></clipPath>
      <g clipPath={`url(#${id}-clip)`}>
        <path d={worldPath()} fill="#4A4F55" stroke="#2A2E33" strokeWidth={0.6} />
        <line x1={cx} y1={0} x2={cx} y2={MINI.H} stroke="#E2B95A" strokeWidth={1.5} opacity={0.8} />
        <line x1={0} y1={cy} x2={MINI.W} y2={cy} stroke="#E2B95A" strokeWidth={1.5} opacity={0.8} />
        <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="#C9343A" fillOpacity={0.35} stroke="#FF5A5F" strokeWidth={2} />
      </g>
    </g>
  );
};
