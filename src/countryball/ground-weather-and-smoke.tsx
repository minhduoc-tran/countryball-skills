import React from 'react';
import { Glow, Puff } from './fx-glow';
import { clamp, easeOut, hash, lerp, prog } from './fx-math';

// Weather, smoke and craters for ground-war maps (screen px, t in frames, 30 fps, deterministic):
//   <MonsoonRain t intensity? angle? dim? />      full-screen slanted rain (two depths), grey wash and drifting mist; mùa mưa / lũ
//   <SmokeColumn t t0? x y h? w? color? lean? life? fire? />   a smoke column rising from (x, y), leaning with the wind, loops forever
//   <CraterField id t t0 t1 x y w h n? seed? />    n craters appear one by one between t0 and t1 inside an ellipse (x, y = centre,
//                                                   w x h = size px): the battlefield being churned up
// Draw rain last (on top of everything but HUD).

export const MonsoonRain: React.FC<{ t: number; intensity?: number; angle?: number; dim?: number; color?: string }> = ({ t, intensity = 0.7, angle = 14, dim = 0.22, color = '#D4E6F6' }) => {
  const k = clamp(intensity), n = Math.round(260 * k), a = (angle * Math.PI) / 180;
  const streaks = Array.from({ length: n }, (_, i) => {
    const near = hash(i, 9) > 0.55, sp = near ? 34 + 14 * hash(i, 1) : 20 + 8 * hash(i, 1), len = near ? 54 + 34 * hash(i, 2) : 26 + 18 * hash(i, 2);
    const y = ((hash(i, 3) * 1400 + t * sp) % (1080 + len * 2)) - len, x = ((hash(i, 4) * 2300 - 200 - Math.tan(a) * y + 4000) % 2300) - 200 + Math.tan(a) * (y - 540);
    return <line key={i} x1={x} y1={y} x2={x + Math.sin(a) * len} y2={y + Math.cos(a) * len} stroke={color} strokeWidth={near ? 2.4 : 1.2} strokeLinecap="round" opacity={near ? 0.5 : 0.28} />;
  });
  return (
    <g pointerEvents="none">
      <rect width={1920} height={1080} fill="#3C4F63" opacity={dim * k} />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={((hash(i, 7) * 2400 + t * (0.6 + i * 0.3)) % 2600) - 340} cy={200 + i * 330} rx={620} ry={110} fill="#C9D6E2" opacity={0.1 * k} />)}
      {streaks}
    </g>
  );
};

export const SmokeColumn: React.FC<{ t: number; t0?: number; x: number; y: number; h?: number; w?: number; color?: string; lean?: number; life?: number; fire?: boolean }> = ({
  t, t0 = 0, x, y, h = 360, w = 54, color = '#2C2C30', lean = 0.35, life = 150, fire = false,
}) => {
  const a = t - t0;
  if (a < 0) return null;
  const N = 16, fadeIn = Math.min(1, a / 30);
  return (
    <g>
      {fire && <Glow x={x} y={y} r={w * 2.2} color="#FF6A1A" o={0.6 * fadeIn} />}
      {Array.from({ length: N }, (_, i) => {
        const age = (a + (i * life) / N) % life, k = age / life, up = easeOut(k) * h, young = a < life ? prog(age, 0, Math.max(1, a)) : 1;
        return <Puff key={i} x={x + lean * up + Math.sin(k * 5 + i) * w * 0.25} y={y - up} r={w * (0.35 + 1.5 * k)} color={k < 0.25 && fire ? '#1B1B1E' : color} o={0.78 * (1 - Math.pow(k, 1.6)) * fadeIn * young} seed={i} />;
      }).reverse()}
    </g>
  );
};

export const CraterField: React.FC<{ id: string; t: number; t0: number; t1: number; x: number; y: number; w: number; h: number; n?: number; seed?: number; scale?: number }> = ({ t, t0, t1, x, y, w, h, n = 60, seed = 1, scale = 1 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const ti = lerp(t0, t1, hash(i, seed)), a = t - ti;
      if (a < 0) return null;
      const ang = hash(i, seed + 1) * 6.283, d = Math.sqrt(hash(i, seed + 2)), cx = x + Math.cos(ang) * d * w * 0.5, cy = y + Math.sin(ang) * d * h * 0.5;
      const r = (7 + 13 * hash(i, seed + 3)) * scale * (0.3 + 0.7 * easeOut(a / 8)), ry = r * (0.62 + 0.25 * hash(i, seed + 4));
      return (
        <g key={i} transform={`rotate(${hash(i, seed + 5) * 180} ${cx} ${cy})`}>
          <ellipse cx={cx} cy={cy} rx={r * 1.7} ry={ry * 1.7} fill="#1E1812" opacity={0.3} />
          <ellipse cx={cx} cy={cy} rx={r * 1.2} ry={ry * 1.2} fill="#9C8764" opacity={0.9} />
          <ellipse cx={cx} cy={cy} rx={r * 0.85} ry={ry * 0.85} fill="#3B2E21" />
          {a < 10 && <circle cx={cx} cy={cy} r={r * (1 + a * 0.3)} fill="none" stroke="#FFE9B0" strokeWidth={3 * (1 - a / 10)} opacity={1 - a / 10} />}
        </g>
      );
    })}
  </g>
);
